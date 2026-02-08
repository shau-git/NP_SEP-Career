const { Op } = require('sequelize');
const JobPost = require("../models/jobpost")
const JobApplicant = require("../models/jobapplicant")
const Company = require("../models/company")
const CompanyMember = require("../models/company_member")
const Notification = require("../models/notification")
const User = require("../models/user")
const sequelize = require("../db/connect")
const { ForbiddenError, NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors/errors');
const asyncWrapper = require('./utils/wrapper');

// --- GET: View job applicants (For Users) ---
const getJobApplicationsUser = asyncWrapper(async (req, res) => {
    const { user_id } = req.params;
    const session_user_id = req.user.user_id;

    // 1. Validate ID format
    if (isNaN(Number(user_id))) {
        throw new BadRequestError(`Invalid User ID format: ${user_id}`);
    }

    // 2. Security: User can only view their own records
    if (parseInt(user_id) !== parseInt(session_user_id)) {
        throw new ForbiddenError("Unauthorized to view data!");
    }

    // 3. Fetch the applications
    const myApplications = await JobApplicant.findAll({
        where: { user_id: parseInt(user_id) },
        attributes: [
            'applicant_id',
            'user_id',
            'job_post_id',
            'status',
            'expected_salary',
            'applied_date',
            'interview_date',
            'interview_time'
        ]
    });

    // 4. Return JSON response
    return res.status(200).json({
        total: myApplications.length,
        data: myApplications
    });
});


// --- GET: View job applicants (For Company Members) ---
const getJobApplicantsCompany = asyncWrapper(async (req, res) => {
    const { company_id } = req.params;
    const {job_post_id} = req.query
    const user_id = req.user.user_id; // From auth middleware


    if (job_post_id && isNaN(Number(job_post_id))) {
        throw new BadRequestError(`Job Post ID: ${job_post_id} must be numeric`);
    } 

    if (isNaN(Number(company_id))) {
        throw new BadRequestError(`Company ID: ${company_id} must be numeric`);
    }


    //2. Verify if the requesting user is a member of the company
    const isMember = await CompanyMember.findOne({
        where: { 
            company_id, 
            user_id, 
            removed: false 
        }
    });

    if (!isMember) {
        throw new ForbiddenError("You are unauthorized to view this data");
    }

    const jobFilter = { company_id };
        
    // If the user provided a specific job ID, add it to the filter
    if (job_post_id) {
        jobFilter.job_post_id = job_post_id;
    }

    const applicants = await JobApplicant.findAll({
        attributes: [
        'applicant_id', 
        'status', 
        'expected_salary', 
        'applied_date', 
        'interview_date'
        ],
        include: [
            {
                // 2. Fetch the User data (Foreign Key: user_id)
                model: User,
                as: 'user', // Must match your association alias
                attributes: ['name', 'email', 'image']
            },
            {
                // 3. Fetch the Job Post data (Foreign Key: job_post_id)
                model: JobPost,
                as: 'job_post', // Must match your association alias
                attributes: ['title'],
                // Optional: Ensure the job belongs to the logged-in company
                where: jobFilter
            }
        ]
    });

    return res.status(200).json({ 
        total: applicants.length, 
        data: applicants 
    });
});



// --- POST: Apply for a job ---
const applyForJob = asyncWrapper(async (req, res) => {
    const { job_post_id } = req.params;
    const applicant_user_id = req.user.user_id; // From auth middleware
    const applicant_name = req.user.name;
    const value = req.body; // Validated by middleware

    if (isNaN(Number(job_post_id))) {
        throw new BadRequestError(`Invalid ID: ${job_post_id} must be numeric`);
    }

    const t = await sequelize.transaction();

    try {
        // 1. Verify Job exists and get Info for notifications
        const job = await JobPost.findOne({
            where: { job_post_id },
            attributes: ['company_id', 'company_id', 'title'],
            include: [{
                model: Company,
                as: 'company',
                attributes: ['name']
            }],
            transaction: t
        });

        if (!job ) {
            throw new NotFoundError(`Job post id ${job_post_id} not found`);
        }

        // 2. Create the application
        const applyJob = await JobApplicant.create({
            ...value,
            user_id: applicant_user_id,
            job_post_id: parseInt(job_post_id)
        }, { transaction: t });

        // 3. Notification Logic
        // Get all active company members to notify HR
        const members = await CompanyMember.findAll({
            where: { company_id: job.company_id, removed: false },
            attributes: ['user_id'],
            transaction: t
        });

        const notifications = [
            // A. Notifications for HR Members
            ...members.map(m => ({
                user_id: m.user_id,
                sender_id: applicant_user_id,
                company_id: parseInt(job.company_id),
                job_post_id: parseInt(job_post_id),
                type: "APPLICANT_NEW",
                message: `${applicant_name} applied for ${job.title}.`
            })),
            // B. Confirmation for the Applicant
            {
                user_id: applicant_user_id,
                sender_id: null,
                company_id: parseInt(job.company_id),
                job_post_id: parseInt(job_post_id),
                type: "APPLICANT_STATUS_CHANGE",
                message: `You successfully applied for ${job.title} @ ${job.company.name}.`
            }
        ];

        await Notification.bulkCreate(notifications, { transaction: t });

        await t.commit();
        return res.status(201).json({ 
            message: "Applied for job successfully", 
            data: applyJob 
        });

    } catch (error) {
        await t.rollback();
        throw error;
    }
});


// change job application data
const updateJobApplication = asyncWrapper(async (req, res) => {
    const { applicant_id } = req.params;
    const session_user_id = req.user.user_id; // From auth middleware
    const session_user_name = req.user.name;
    const value = req.body; // Validated by middleware

    if (isNaN(Number(applicant_id))) {
        throw new BadRequestError(`Invalid Application ID: ${applicant_id}`);
    }

    // Start a transaction to ensure data consistency
    const t = await sequelize.transaction();

    try {
        // 1. Fetch Application + nested JobPost + Company
        const application = await JobApplicant.findOne({
            where: { applicant_id },
            include: [
                { model: User, as: 'user', attributes: ['name'] },
                { 
                    model: JobPost, 
                    as: 'job_post',
                    attributes: ['title', 'company_id', 'contact_email'],
                    include: [{ model: Company, as: 'company', attributes: ['name'] }]
                }
            ],
            transaction: t
        });

        if (!application) throw new NotFoundError("Application not found");

        // 2. Authorization: Check if the editor is an active company member
        const isMember = await CompanyMember.findOne({
            where: {
                company_id: application.job_post.company_id,
                user_id: session_user_id,
                removed: false
            },
            transaction: t
        });

        if (!isMember) {
            // Check if requester is the applicant themselves
            if (application.user_id === session_user_id) {
                throw new ForbiddenError(
                    `Applicants cannot edit data directly. Please email ${application.job_post.contact_email} to request changes.`
                );
            }
            throw new ForbiddenError("You don't have permission to update this application");
        }

        // 3. Perform the Update
        const [count, updatedRows] = await JobApplicant.update(value, {
            where: { applicant_id },
            returning: true,
            plain: true,
            transaction: t
        });
        
        const updatedApplication = updatedRows;

        // 4. NOTIFICATION LOGIC
        // Fetch other HR members to notify
        const otherMembers = await CompanyMember.findAll({
            where: {
                company_id: application.job_post.company_id,
                user_id: { [Op.ne]: session_user_id },
                removed: false
            },
            attributes: ['user_id'],
            transaction: t
        });

        const notificationsToCreate = [
            // A. Notification for the Applicant
            {
                user_id: application.user_id,
                sender_id: session_user_id,
                company_id: application.job_post.company_id,
                job_post_id: application.job_post_id,
                type: "APPLICANT_STATUS_CHANGE",
                message: `Your application for ${application.job_post.title} @ ${application.job_post.company.name} was updated to ${updatedApplication.status}.${updatedApplication.status === "INTERVIEW" && " Please check out for the interview date time."}`
            },
            // B. Notifications for the Team (Colleagues)
            ...otherMembers.map(member => ({
                user_id: member.user_id,
                sender_id: session_user_id,
                company_id: application.job_post.company_id,
                job_post_id: application.job_post_id,
                type: "TEAM_UPDATE",
                message: `Status for application #${application.user.name} was changed by ${session_user_name} to ${updatedApplication.status}.`
            }))
        ];

        // 5. Batch Create Notifications
        if (notificationsToCreate.length > 0) {
            await Notification.bulkCreate(notificationsToCreate, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({ 
            message: "Job Application updated", 
            data: updatedApplication 
        });

    } catch (error) {
        await t.rollback();
        throw error; // Re-throw so asyncWrapper handles it
    }
});



module.exports = {
    getJobApplicationsUser,
    getJobApplicantsCompany,
    applyForJob,
    updateJobApplication
};