import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const companyFields = {
    name: Joi.string().min(1).max(50).trim().messages({
        'string.base': 'name must be a string',
        'string.min': 'name cannot be empty',
        'string.max': 'name cannot exceed 50 characters',
    }),

    image: Joi.string().min(1).trim().messages({
        'string.base': 'image must be a string',
        'string.min': 'image cannot be empty',
    }),

    industry: Joi.string().trim()
        .valid('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')
        .messages({
        'any.only': "industry must be one of: ('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')",
    }),

    location: Joi.string().min(1).max(50).trim().messages({
        'string.base': 'location must be a string',
        'string.min': 'location cannot be empty',
        'string.max': 'location cannot exceed 50 characters',
    }),

    description: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'description must be a string',
        'string.min': 'description cannot be empty',
        'string.max': 'description cannot exceed 500 characters',
    })
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    company_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_id is not allowed',
    }),
    company_members: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify company_members relation',
    }),
    job_posts: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify job_posts relation',
  }),
};

// POST schema (required + forbidden)
export const createCompanySchema = Joi.object({
    name: companyFields.name.required().messages(requiredMsg("name")),
    industry: companyFields.industry.required().messages(requiredMsg("industry")),
    location: companyFields.location.required().messages(requiredMsg("location")),
    description: companyFields.description.required().messages(requiredMsg("description")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateCompanySchema = Joi.object({
    ...companyFields,
    ...forbiddenFields,
}).min(1);


    

   