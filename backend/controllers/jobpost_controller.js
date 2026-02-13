const {NotFoundError, BadRequestError,  ForbiddenError, UnauthenticatedError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const sequelize = require('../db/connect');
const { Op } = require('sequelize'); // Needed for [Op.iLike]
const Company = require('../models/company'); // Needed for the 'include'
const JobPost = require("../models/jobpost")
const CompanyMember = require("../models/company_member")
const Notification = require("../models/notification")
const JobApplicant = require("../models/jobapplicant")

//GET All job post
const getAllJobPost = asyncWrapper(async(req, res) => {
    // Destructure all possible filters from frontend
    const { title, industry, company_id,  employment_type, experience, sortBy } = req.query;
    // console.log(req.query, '////')
    let filter = {removed: false};
    
    // 1. Helper function to handle both string and array inputs
    const ensureArray = (input) => {
        if (!input) return null;
        if (Array.isArray(input)) return input;
        // If it's a string, it might be "Full-Time,Part-Time" or just "Full-Time"
        return input.split(',');
    };

    // 2. Text Search Filters (using iLike for case-insensitive matching)
    if (title) filter.title = { [Op.iLike]: `%${title}%` };
    
    const industryArray = ensureArray(industry);
    if (industry) filter.industry = { [Op.in]: industryArray };

    const employment_typeArray = ensureArray(employment_type);
    if (employment_type) filter.employment_type = { [Op.in]: employment_typeArray };

    const experienceArray = ensureArray(experience);
    if (experience) filter.experience = { [Op.in]: experienceArray };


    // 4. Company Specific Filter
    if (company_id) {
        if (parseInt(company_id)) {
            filter.company_id = parseInt(company_id);
            delete filter.removed
        } else {
            throw new BadRequestError(`company_id must be a number!`);
        }
    }

    // 5. Dynamic Sorting
    let order = [['created_at', 'DESC']]; // Default
    if (sortBy === 'salary-high') order = [['salary_end', 'DESC']];
    if (sortBy === 'salary-low') order = [['salary_start', 'ASC']];

    const jobposts = await JobPost.findAll({
        where: filter,
        order: order,
        attributes: [
            'job_post_id', 
            'created_at',
            'company_id', 
            'title', 
            'industry', 
            'requirements', 
            'responsibilities', 
            'employment_type', 
            'experience', 
            'removed', 
            'salary_start', 
            'salary_end', 
            'location', 
            'benefit', 
            'summary', 
            'description',
            'contact_email',
            //  total applicants
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM job_applicant AS applicants
                    WHERE
                        applicants.job_post_id = "JobPost"."job_post_id"
                )`),
                'applicantCount'
            ]
        ],
        include: [
            {
                model: Company,
                as: 'company' // This must match the 'as' alias in your model definition
            }
        ]
    })

    return res.status(200).json({total: jobposts.length, data: jobposts})
})


// get one job 
const getOneJobPost = asyncWrapper(async(req, res) => {
    const param_id = req.params.job_post_id
    const job_post_id = parseInt(param_id)

    if(!job_post_id) {
        throw new BadRequestError(`Invalid ID: ${param_id} must be numeric`)
    }

    const jobPost = await JobPost.findOne({
        where: { job_post_id },
        attributes: [
            'job_post_id', 
            'company_id', 
            'title', 
            'industry', 
            'requirements', 
            'responsibilities', 
            'employment_type', 
            'experience', 
            'created_at', 
            'removed', 
            'salary_start', 
            'salary_end', 
            'location', 
            'benefit', 
            'summary', 
            'description',
            'contact_email'
        ],
        include: [
            {
            model: Company,
            as: 'company' // This must match the 'as' alias in your model definition
            }
        ]
    });

    if(!jobPost) { throw new NotFoundError(`Job Post ${job_post_id} not found`) }

    return res.status(200).json({data: jobPost})
})



// POST: Create a new job post
const createJobPost = asyncWrapper(async (req, res) => {
    const { company_id } = req.params;
    const user_id = req.user.user_id; // From your auth middleware
    const user_name = req.user.name;
    const user_email = req.user.email;
    const value = req.body;

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // 1. Verify company exists and user is an active member
        const company = await Company.findByPk(company_id, { 
            attributes: ['name'],
            transaction: t 
        });

        const isMember = await CompanyMember.findOne({
            where: { company_id, user_id, removed: false },
            transaction: t
        });

        if(!company ) {
            throw new NotFoundError(`Company id ${company_id} not exist!`)
        }

        if (!isMember) {
            throw new ForbiddenError(`You are not allowed to add job post for company id ${company_id}!`);
        }

        // 2. Set defaults (Contact Email & Created Date)
        if (!value.contact_email) {
            value.contact_email = user_email;
        }
        // format as 'YYYY-MM-DD' for Postgres DATE type
        const created_at = new Date().toISOString().split('T')[0];

        // 3. Create the Job Post
        const newJobPost = await JobPost.create(
            { ...value, company_id, created_at },
            { transaction: t }
        );

        // 4. Prepare Notifications for other members
        const otherMembers = await CompanyMember.findAll({
            where: {
                company_id,
                user_id: { [Op.ne]: user_id }, // Op.ne is "Not Equal"
                removed: false
            },
            attributes: ['user_id'],
            transaction: t
        });

        if (otherMembers.length > 0) {
            const notifications = otherMembers.map(member => ({
                user_id: member.user_id,
                sender_id: user_id,
                company_id: parseInt(company_id),
                job_post_id: newJobPost.job_post_id,
                type: "JOB_POST_CREATED",
                message: `${user_name} published a new job: ${newJobPost.title} @ ${company.name}.`
            }));

            // Sequelize equivalent of createMany
            await Notification.bulkCreate(notifications, { transaction: t });
        }

        // Commit the transaction
        await t.commit();

        return res.status(201).json({
            message: "New Job Post added!",
            data: newJobPost
        });

    } catch (error) {
        // Rollback transaction if any step fails
        await t.rollback();
        throw error; // asyncWrapper will catch this and call next(error)
    }
});


// PUT: Edit job post data
const updateJobPost = asyncWrapper(async (req, res) => {
    const { company_id, job_post_id } = req.params;
    const user_id = req.user.user_id; // From auth middleware
    const user_name = req.user.name;
    const value = req.body; // Validated by middleware

    // 1. Validate ID format
    if (isNaN(Number(company_id))) {
        throw new BadRequestError(`Company id must be a number: ${company_id}`);
    }

    if (isNaN(Number(job_post_id))) {
        throw new BadRequestError(`Job Post id must be a number: ${job_post_id}`);
    }

    const t = await sequelize.transaction();

    try {
        // 2. Fetch Job Post to verify ownership and get info for notifications
        const job = await JobPost.findOne({
            where: { job_post_id },
            include: [{
                model: Company,
                as: 'company',
                attributes: ['name']
            }],
            transaction: t
        });

        if (!job || job.company_id !== parseInt(company_id)) {
            throw new NotFoundError(`Job post not found in company ${company_id}`);
        }

        // 3. Authorization: Check if the editor is an active member
        const isMember = await CompanyMember.findOne({
            where: { 
                company_id: parseInt(company_id), 
                user_id, 
                removed: false 
            },
            transaction: t
        });

        if (!isMember) {
            throw new ForbiddenError("You don't have permission to edit this job post");
        }

        // user can reuse the removed job post, set the date to today
        if(value.removed === false) {
            value.created_at = new Date().toISOString().split('T')[0];
        }
        // 4. Update the Job Post
        // [Op.in] style logic or returning:true for Postgres
        const [affectedCount, updatedRows] = await JobPost.update(value, {
            where: { job_post_id },
            returning: true,
            plain: true,
            transaction: t
        });

        const updatedJobPost = updatedRows;

        // 5. NOTIFICATION LOGIC: Get recipients
        const [otherMembers, applicants] = await Promise.all([
            CompanyMember.findAll({
                where: { 
                    company_id: parseInt(company_id), 
                    user_id: { [Op.ne]: user_id }, //
                    removed: false 
                },
                attributes: ['user_id'],
                transaction: t
            }),
            JobApplicant.findAll({
                where: { job_post_id },
                attributes: ['user_id'],
                transaction: t
            })
        ]);

        // Combine into one notification array
        const notificationsToCreate = [
            // Notifications for Colleagues
            ...otherMembers.map(member => ({
                user_id: member.user_id,
                sender_id: user_id, 
                company_id: parseInt(company_id),
                job_post_id: parseInt(job_post_id),
                type: "JOB_POST_UPDATED",
                message: `${user_name} updated the job post: ${job.title}.`
            })),
            
            // Notifications for Applicants
            ...applicants.map(app => ({
                user_id: app.user_id,
                sender_id: null, // System-style notification
                company_id: parseInt(company_id),
                job_post_id: parseInt(job_post_id),
                type: "JOB_POST_UPDATED",
                message: `The job post "${job.title}" at ${job.company.name} has been updated. Please check for the changes.`
            }))
        ];

        // 6. Bulk Create Notifications
        if (notificationsToCreate.length > 0) {
            await Notification.bulkCreate(notificationsToCreate, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({
            message: `Job Post id ${job_post_id} updated!`, 
            data: updatedJobPost
        });

    } catch (error) {
        await t.rollback();
        throw error;
    }
});


module.exports = {
    getAllJobPost,
    getOneJobPost,
    createJobPost,
    updateJobPost
}