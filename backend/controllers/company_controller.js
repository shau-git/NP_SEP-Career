const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Company = require("../models/company")
const CompanyMember = require("../models/company_member")
const Notification = require("../models/notification")
const JobPost = require("../models/jobpost")
const JobApplicant = require("../models/jobapplicant")
const {Op} = require("sequelize")
const sequelize = require("../db/connect")


// Get all companies with search functionality
const getAllCompanies = asyncWrapper(async (req, res) => {
    const { name } = req.query; // Expecting ?name=query
    let queryOptions = {
        attributes: ['company_id', 'name', 'image', 'industry', 'location', 'description'],
    };

    // If a name is provided, add a search filter
    if (name) {
        queryOptions.where = {
            name: {
                [Op.iLike]: `%${name}%` // Case-insensitive search
            }
        };
    }

    const companies = await Company.findAll(queryOptions);

    return res.status(200).json({ 
        total: companies.length, 
        data: companies 
    });
});


// get the company profile (get one)
const getCompanyProfile = asyncWrapper(async (req, res) => {
    const { company_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(company_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // 2. Execute Query
    const companyData = await Company.findOne({
        where: { company_id: parseInt(company_id) },
        attributes: ['company_id', 'name', 'image', 'industry', 'location', 'description'],
    });

    // 3. Handle Not Found
    if (!companyData) {
        throw new NotFoundError(`Company id ${company_id} not found`);
    }

    return res.status(200).json({ total: 1, data: companyData });
});



// // create company
// const addCompanyProfile = asyncWrapper(async(req, res) => {

//     // get the user_id from payload
//     const user_id = parseInt(req.user.user_id)

//     // get request body
//     const data = req.body

//     // prevent same company name
//     const existName = await Company.findOne({
//         where: {
//             name: {
//                 [Op.iLike]: data.name 
//             }
//         }
//     })

//     if(existName) {
//         throw new BadRequestError(`${data.name} already registred, please change to another name.`)
//     }

//     // create company
//     const addedCompany = await Company.create(data); 

//     // create the user as the owner of the company
//     const newCompanyOwner = await CompanyMember.create(
//         {
//             company_id: addedCompany.company_id,
//             user_id,
//             role: "owner",
//             removed: false
//         }
//     )
// console.log("<<<<<<<<<<<<<<<<<<", addedCompany.dataValues)
//     newCompanyOwner.company = addedCompany.dataValues
//     console.log(newCompanyOwner)

//     return res.status(201).json({message: "Company registered successfully", data: newCompanyOwner});
// })

const addCompanyProfile = asyncWrapper(async (req, res) => {
    const { user_id } = req.user; 
    const { name, industry, location, description, image } = req.body;

    // 1. Create the Company first
    const newCompany = await Company.create({
        name,
        industry,
        location,
        description,
        image
    });

    // 2. Create the Membership
    const newMember = await CompanyMember.create({
        user_id: user_id,
        company_id: newCompany.company_id,
        role: 'owner',
        removed: false
    });

    // 3. Re-fetch with Include to get the exact structure you want
    const result = await CompanyMember.findOne({
        where: { company_member_id: newMember.company_member_id },
        include: [{
            model: Company,
            as: 'company', // Ensure this matches your model association alias
            attributes: ['company_id', 'name', 'industry', 'location', 'description', 'image']
        }]
    });

    return res.status(201).json({ 
        message: "Company registered successfully",
        data: result 
    });
});





// update company profile
const updateCompanyProfile = asyncWrapper(async (req, res) => {
    const { company_id } = req.params;
    
    // Validate ID is a number
    if (isNaN(Number(company_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // find company
    const company = await Company.findOne({
        where: { company_id: parseInt(company_id) },
    });

    // Handle Not Found
    if (!company) {
        throw new NotFoundError(`Company id ${company_id} not found`);
    }

    // get the user payload
    const payload = req.user
    const user_id = parseInt(payload.user_id)

    // get request body
    const value  = req.body

    // Authorization: Only admin and owner can modify company data
    const companyAdmin = await CompanyMember.findOne({
        where: {
            company_id: parseInt(company_id), 
            user_id,
            role: { [Op.in]: ['admin', 'owner'] },
            removed: false
        }
    }) 

    if (!companyAdmin) {
        throw new ForbiddenError('Unauthorized access to modify company data')
    }

    // prevent same company name
    if (value.name) {
        const existName = await Company.findOne({
            where: {
                name: value.name,
                company_id: { [Op.ne]: company_id }
            }
        });
        if (existName) throw new BadRequestError(`${value.name} is taken.`);
    }

    // Execute Query
    await Company.update(value, {where: {company_id: parseInt(company_id)}}); 

    // get the updated company data
    const newCompanyData = await Company.findOne({
        where: {company_id: parseInt(company_id)},
    })

    // Notifications logic
    // Notify all other company members about the profile update
    const otherMembers = await CompanyMember.findAll({
        where: {
            company_id,
            user_id: { [Op.ne]: user_id },
            removed: false
        },
        attributes: ['user_id']
    });

    if (otherMembers.length > 0) {
        const notifications = otherMembers.map(member => ({
            user_id: member.user_id,
            sender_id: user_id,
            company_id,
            type: "COMPANY_PROFILE_UPDATE",
            message: `${payload.name} updated company info for ${newCompanyData.name}.`
        }));

        await Notification.bulkCreate(notifications);
    }


    return res.status(200).json({ message: "Company data updated successfully!", data: newCompanyData });
});


// get company stats
const getCompanyStats = asyncWrapper(async (req, res) => {
    let { company_id } = req.params;
    company_id = parseInt(company_id)
    const userId = req.user.user_id; // Assumes you have middleware like 'verifyToken'

    if(!company_id) throw new BadRequestError(`Company Id ${company_id} must be a number`)

    // 1. SECURITY CHECK: Is this user an active member of this company?
    const isMember = await CompanyMember.findOne({
        where: {
            company_id,
            user_id: userId,
            removed: false // Only allow active members
        }
    });

    if (!isMember) {
        return res.status(403).json({ message: "Access Denied: You are not a member of this company." });
    }

    // 2. Fetch Total Job Posts
    const totalJobs = await JobPost.count({ where: { company_id } });

    // 3. Fetch Job IDs to get Applicant stats
    const jobPosts = await JobPost.findAll({
        where: { company_id },
        attributes: ['job_post_id'],
        raw: true
    });
    const jobIds = jobPosts.map(j => j.job_post_id);

    // 4. Fetch Applicant Stats grouped by status
    const applicantStats = await JobApplicant.findAll({
        where: { job_post_id: { [Op.in]: jobIds } },
        attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('applicant_id')), 'count']
        ],
        group: ['status'],
        raw: true
    });

    // 5. Format results
    const stats = {
        totalJobPosts: totalJobs,
        totalApplicants: 0,
        pending: 0,
        pendingInterview: 0
    };
    
    applicantStats.forEach(item => {
        const count = parseInt(item.count);
        stats.totalApplicants += count;
        if (item.status === 'PENDING') stats.pending = count;
        if (item.status === 'INTERVIEW') stats.pendingInterview = count;
    });
        
    return res.status(200).json({ data: stats });
   
});


module.exports = { 
    getCompanyProfile,
    addCompanyProfile,
    updateCompanyProfile,
    getCompanyStats,
    getAllCompanies
};