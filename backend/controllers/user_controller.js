const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const { Op } = require('sequelize'); // Needed for [Op.iLike]
const User = require('../models/user'); // Needed for the 'include'
const Skill = require("../models/skill")
const Education = require("../models/education")
const Language = require("../models/language")
const Experience = require("../models/experience")
const Link = require("../models/link")
const Company = require("../models/company")
const JobPost = require("../models/jobpost")

const CompanyMember = require("../models/company_member")
const JobApplicant = require("../models/jobapplicant")

// get the user profile
const getUserProfile = asyncWrapper(async (req, res) => {
    const { user_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(user_id))) {
        throw new BadRequestError("Invalid User ID format");
    }

    // get the user payload
    const payload = req.user

    // 2. Define standard includes (public profile)
    let includeOptions = [
        { model: Language, as: 'languages', attributes: ['language_id', 'language', 'proficiency'] },
        { model: Link, as: 'links', attributes: ['link_id', 'type', 'url'] },
        { model: Experience, as: 'experiences', attributes: ['experience_id', 'company', 'role', 'years', 'start_date', 'end_date', 'description', 'employment_type'] },
        { model: Education, as: 'educations', attributes: ['education_id', 'institution', 'field_of_study', 'qualification', 'start_date', 'end_date', 'study_type', 'description'] },
        { model: Skill, as: 'skills', attributes: ['skill_id', 'skill'] }
    ];

    // 3. Conditional Private Data (Check session/auth)
    // Note: req.user should be populated by your auth middleware
    if (payload?.user_id && (parseInt(user_id) == payload?.user_id)) {
        includeOptions.push(
            { 
                model: JobApplicant, 
                as: 'job_applicants', 
                attributes: ['applicant_id', 'job_post_id', 'status', 'expected_salary', 'applied_date', 'interview_date'] ,
                include: [
                    {
                        model: JobPost,
                        as: 'job_post',
                        attributes: ['title', 'industry'], // Get Job Title here
                        include: [
                            {
                                model: Company,
                                as: 'company',
                                attributes: ['name', 'image'] // Get Company Name and Image here
                            }
                        ]
                    }
                ],
                order: [["applicant_id", "DESC"]], 
            },
            { 
                model: CompanyMember, 
                as: 'company_members', 
                attributes: ['company_member_id', 'company_id', 'role', 'removed'],
                include: [
                    {
                        model: Company,
                        as: 'company', // Make sure this alias matches your CompanyMember -> Company association
                        attributes: ['company_id', 'name', 'image', 'industry', 'location'] // Only get the fields you need
                    }
                ] 
            }
        );
    }

    // 4. Execute Query
    const userWithData = await User.findOne({
        where: { user_id: parseInt(user_id) },
        attributes: ['user_id', 'name', 'image', 'email', 'role', 'summary'],
        include: includeOptions
    });

    // 5. Handle Not Found
    if (!userWithData) {
        throw new NotFoundError(`User id ${user_id} not found`);
    }

    return res.status(200).json({ total: 1, data: userWithData });
});



// update the user profile
const updateUserProfile = asyncWrapper(async (req, res) => {
    const { user_id } = req.params;
    
    // 1. Validate ID is a number
    if (isNaN(Number(user_id))) {
        throw new BadRequestError("Invalid User ID format");
    }

    // get the user payload
    const payload = req.user

    if(payload.user_id != user_id) throw new ForbiddenError("You can only modify your own profile!")

    const value = req.body
    
    if(value.password) {
        // encrypt user's password before storing
        const salt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(value.password, salt)
    }

    // 1. Perform the update
    // Sequelize update returns an array: [rowsUpdated, updatedRows (if supported)]
    const [rowsUpdated] = await User.update(value, {
        where: { user_id: parseInt(user_id) }
    });

    if (rowsUpdated === 0) {
        throw new NotFoundError(`User id ${user_id} not found`);
    }

    // 2. Fetch the updated record with specific fields (Simulating Prisma's 'select')
    const updatedUser = await User.findOne({
        where: { user_id: parseInt(user_id) },
        attributes: ['user_id', 'role', 'name', 'email', 'image', 'summary']
    });

    return res.status(200).json({message: "User data updated successfully!" , data: updatedUser});
});



module.exports = { 
    getUserProfile ,
    updateUserProfile
};