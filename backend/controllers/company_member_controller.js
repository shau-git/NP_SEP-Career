const { Op } = require('sequelize');
const CompanyMember = require("../models/company_member")
const User = require("../models/user")
const Company = require("../models/company")
const Notification = require("../models/notification")
const { NotFoundError,  ForbiddenError , BadRequestError} = require("../errors/errors");
const asyncWrapper = require("./utils/wrapper");
const sequelize = require('../db/connect');

// --- GET: List Company Members ---
const getCompanyMembers = asyncWrapper(async (req, res) => {
    let { company_id } = req.params;
    let {user_id} = req.query
    const userId = req.user.user_id; // From auth middleware

    company_id = parseInt(company_id)
    user_id = parseInt(user_id)

    if(!parseInt(company_id)) throw new BadRequestError(`Company Id ${company_id} must be number!`)
    if(user_id && !parseInt(user_id)) throw new BadRequestError(`User Id ${user_id} must be a number`)
    // Authorization: Only existing company members can see the list
    const isMember = await CompanyMember.findOne({
        where: {
            user_id: userId,
            company_id,
            removed: false
        }
    });

    if (!isMember) {
        throw new ForbiddenError('Unauthorized to view company member list');
    } 

    // Fetch data
    let filter = {company_id}
    user_id && (filter.user_id = user_id)

    const data = await CompanyMember.findAll({
        where: filter,
        attributes: ['company_member_id', 'company_id', 'user_id', 'role', 'removed'],
        include: [
            {
                // 2. Fetch the User data (Foreign Key: user_id)
                model: User,
                as: 'user', // Must match your association alias
                attributes: ['name', 'email', 'image']
            }
        ],
        order: [["company_member_id", "DESC"]],
    });
    
    if (data.length > 0) {
        return res.status(200).json({ total: data.length, data });
    } else {
        throw new NotFoundError(`No members found for company ID ${company_id}`);
    }
});



// --- POST: Add New Member ---
const addCompanyMember = asyncWrapper(async (req, res) => {
    const { company_id } = req.params;
    const admin_id = req.user.user_id;
    const value = req.body;

    const t = await sequelize.transaction();

    try {
        // 1. Verify User and Company exist
        const [userExist, company] = await Promise.all([
            User.findByPk(value.user_id, {
                // Explicitly select the attributes you want to return later
                attributes: ['user_id', 'name', 'image', 'email'] 
            }),
            Company.findByPk(company_id)
        ]);

        if (!userExist) throw new NotFoundError(`User ID ${value.user_id} does not exist.`);
        if (!company) throw new NotFoundError(`Company ID ${company_id} not found.`);

        // 2. Authorization (existing logic)
        const admin = await CompanyMember.findOne({
            where: { company_id, user_id: admin_id, role: ['admin', 'owner'], removed: false }
        });
        if (!admin) throw new ForbiddenError('Unauthorized to add members');

        // 3. Business Logic (existing logic)
        if (value.role === "owner") throw new ForbiddenError("Cannot add owner");
        
        // 4. Create Member Record
        const newMember = await CompanyMember.create(
            { ...value, company_id },
            { transaction: t }
        );

        // ... (Keep your Notification Logic here) ...

        await t.commit();

        // 5. Modified Response: Combine membership data with user details
        return res.status(201).json({ 
            message: "New Member Added!", 
            data: {
                ...newMember.toJSON(), // Membership details (role, company_id, etc.)
                user: {                // Injected User details
                    user_id: userExist.user_id,
                    name: userExist.name,
                    email: userExist.email,
                    image: userExist.image
                }
            } 
        });

    } catch (error) {
        await t.rollback();
        throw error;
    }
});


// update company member data
const updateCompanyMember = asyncWrapper(async (req, res) => {
    // 1. Get IDs from params and body
    const { company_id, company_member_id } = req.params;
    const executor_id = req.user.user_id; // From auth middleware
    const value = req.body; // Validated by middleware

    if (isNaN(Number(company_member_id))) {
        throw new BadRequestError(`Invalid Company Member ID: ${company_member_id}`);
    }

    if (isNaN(Number(company_id))) {
        throw new BadRequestError(`Invalid Company ID: ${company_id}`);
    }

    // Start a transaction for the update and notification
    const t = await sequelize.transaction();

    try {

        // 2. check if company exist 
        const comapany = await Company.findOne({where: {company_id}})
        if(!comapany)  throw new NotFoundError(`Company Id ${company_id} not found`);

        // 3. Authorization Check: Is the executor an active Admin or Owner?
        const executorRight = await CompanyMember.findOne({
            where: {
                company_id,
                user_id: executor_id,
                role: ['admin', 'owner'],
                removed: false
            }
        });

        if (!executorRight) {
            throw new ForbiddenError('Unauthorized to modify member data');
        }

        // 4. Target Check: Does the member to be modified exist in this company?
        const memberToModify = await CompanyMember.findOne({
            where: { company_id, company_member_id },
            include: [{
                model: Company,
                as: 'company', // Ensure alias matches your model setup
                attributes: ['name']
            }]
        });

        if (!memberToModify) {
            throw new NotFoundError(`Member with ID ${company_member_id} not found in this company.`);
        }

        // 5. Hierarchy Logic (Role restrictions)
        if (executorRight.role === "admin") {
            // Admin cannot modify an Owner
            if (memberToModify.role === "owner") {
                throw new ForbiddenError("Admins are not authorized to modify owner data");
            }
            // Admin cannot promote someone to Owner
            if (value.role === "owner") {
                throw new ForbiddenError("Admins are not authorized to promote members to owner");
            }
        }

        // 6. Update the Member
        const [affectedCount, updatedRows] = await CompanyMember.update(value, {
            where: { company_member_id },
            returning: true, // Only works for Postgres/Neon
            plain: true,
            transaction: t
        });
        
        // If not using Postgres, you'd fetch with memberToModify.reload({ transaction: t })
        const updatedMember = updatedRows;

        // 7. Notification Logic
        await Notification.create({
            user_id: memberToModify.user_id,
            sender_id: executor_id,
            company_id: parseInt(company_id),
            type: value.removed ? "COMPANY_MEMBER_REMOVE" : "COMPANY_MEMBER_UPDATE",
            message: value.removed 
                ? `You have been removed from ${memberToModify.company.name}.` 
                : `Your role at ${memberToModify.company.name} was updated to ${value.role || memberToModify.role}.`
        }, { transaction: t });

        await t.commit();
        return res.status(200).json({
            message: "Member's data modified successfully!",
            data: updatedMember
        });

    } catch (error) {
        await t.rollback();
        throw error;
    }
});

module.exports = {
    getCompanyMembers,
    addCompanyMember,
    updateCompanyMember
};