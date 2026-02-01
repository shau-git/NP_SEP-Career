import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const jobPostFields = {
    title: Joi.string().min(1).max(50).trim().messages({
        'string.base': 'title must be a string',
        'string.min': 'title cannot be empty',
        'string.max': 'title cannot exceed 50 characters',
    }),

    industry: Joi.string().trim()
        .valid('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')
        .messages({
        'any.only': "industry must be one of: ('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')",
    }),

    requirements: Joi.array()
        .items(Joi.string().trim().min(3).max(200)) // Each item must be a string
        .min(1) // At least one requirement is needed
        .required()
        .messages({
            'array.min': 'Please provide at least one requirement',
            'string.empty': 'requirements cannot contain empty text'
    }),


    responsibilities: Joi.array()
        .items(Joi.string().trim().min(3).max(500)) // Longer strings allowed for responsibilities
        .min(1)
        .required()
        .messages({
            'array.min': 'Please provide at least one responsibility'
    }),

    employment_type: Joi.string().trim().uppercase()
            .valid('full time', 'part time')
            .messages({
            'any.only': "employment_type must be one of: 'full time', 'part time' ",
    }),

    experience: Joi.string().trim()
        .valid('0-2', '3-5' ,'5-8', '8+')
        .messages({
        'any.only': "experience must be one of: 0-2, 2-5, 5-8, 8+",
    }),

    removed: Joi.boolean()
      .messages({
        'boolean.base': 'Removed status must be true or false.',
    }),

    salary_start: Joi.number().integer().min(1)
        .messages({
            'number.base': 'salary_start must be a number.',
            'number.min': 'salary_start cannot be negative.',
    }),

    salary_end: Joi.number().integer().greater(Joi.ref('salary_start'))
        .messages({
            'number.base': 'salary_end must be a number.',
            'number.greater': 'salary_end must be greater than the starting salary',
    }),

    location: Joi.string()
        .valid('onsite', 'remote')
        .messages({
        'any.only': "location must be one of: 'onsite', 'remote'",
    }),

    benefit: Joi.array()
        .items(Joi.string().trim().min(3).max(200)) // Each item must be a string
        .min(1) // At least one requirement is needed
        .required()
        .messages({
            'array.min': 'Please provide at least one benefit',
            'string.empty': 'Benefit cannot contain empty text'
    }),

    contact_email: Joi.string().email({ tlds: { allow: false } }).min(10).max(65).trim()
        .messages({
            'string.email': 'Please enter a valid contact_email address',
            'string.min': 'contact_email must be at least 10 characters long',
            'string.max': 'contact_email cannot exceed 80 characters',
    }),

    summary: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'summary must be a string',
        'string.min': 'summary cannot be empty',
        'string.max': 'summary cannot exceed 500 characters',
    }),

    description: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'description must be a string',
        'string.min': 'description cannot be empty',
        'string.max': 'description cannot exceed 500 characters',
    })
};



// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    job_post_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company job_post_id is not allowed',
    }),
    company_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_id is not allowed',
    }),

    created_at: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify created_at',
    }),

    job_applicants: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify job_applicants',
    }),

    company: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify company relation',
    }),
};


// POST schema (required + forbidden)
export const createJobPostSchema = Joi.object({
    ...forbiddenFields,
    title: jobPostFields.title.required().messages(requiredMsg("title")),
    industry: jobPostFields.industry.required().messages(requiredMsg("industry")),
    requirements: jobPostFields.requirements.required().messages(requiredMsg("requirements")),
    responsibilities: jobPostFields.responsibilities.required().messages(requiredMsg("responsibilities")),
    employment_type: jobPostFields.employment_type.required().messages(requiredMsg("employment_type")),
    experience: jobPostFields.experience.required().messages(requiredMsg("experience")),
    salary_start: jobPostFields.salary_start.required().messages(requiredMsg("salary_start")),
    salary_end: jobPostFields.salary_end.required().messages(requiredMsg("salary_end")),
    location: jobPostFields.location.required().messages(requiredMsg("location")),
    benefit: jobPostFields.benefit.required().messages(requiredMsg("benefit")),
    summary: jobPostFields.summary.required().messages(requiredMsg("summary")),
    description: jobPostFields.description.required().messages(requiredMsg("description")),
    removed: jobPostFields.removed.forbidden().messages({
        'any.forbidden': 'You are not allowed to handle the removed status here',
    }),
});

// PUT / PATCH schema (partial + forbidden)
export const updateJobPostSchema = Joi.object({
    ...jobPostFields,
    ...forbiddenFields,
}).min(1);
