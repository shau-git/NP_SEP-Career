import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const experienceFields = {
    company: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'company field must be a string',
        'string.min': 'company field cannot be empty',
        'string.max': 'company field cannot exceed 30 characters',
    }),
    
    role: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'role field must be a string',
        'string.min': 'role field cannot be empty',
        'string.max': 'role field cannot exceed 30 characters',
    }),

    years: Joi.string().trim()
        .valid('0-2', '3-5' ,'5-8', '8+')
        .messages({
        'any.only': "years must be one of: 0-2, 2-5, 5-8, 8+",
    }),
    
    start_date : Joi.date().iso().messages({
            'date.base': 'start_datemust be a valid date',
            'date.format': 'start_date must be in YYYY-MM-DD format',
    }),

    end_date : Joi.alternatives().try(Joi.date().iso().greater(Joi.ref('start_date')), Joi.string().valid('present') ).messages({
        'alternatives.types': 'end_date must be a valid date or "present"',
        'any.only': 'end_date must be a valid date or "present"',
        'date.greater': 'end_date must be later than the start date',
    }),

    employment_type: Joi.string().trim().lowercase()
        .valid('full time', 'part time')
        .messages({
        'any.only': "employment_type must be one of: 'full time', 'part time' ",
    }),

    description: Joi.string().min(1).max(500).trim().messages({
        'string.base': 'description must be a string',
        'string.min': 'description cannot be empty',
        'string.max': 'description cannot exceed 500 characters',
    })
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    experience_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing experience_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
  }),
};

// POST schema (required + forbidden)
export const createExperienceSchema = Joi.object({
    company: experienceFields.company.required().messages(requiredMsg("company")),
    role: experienceFields.role.required().messages(requiredMsg("role")),
    years: experienceFields.years.required().messages(requiredMsg("years")),
    start_date: experienceFields.start_date.required().messages(requiredMsg("start_date")),
    end_date: experienceFields.end_date.required().messages(requiredMsg("end_date")),
    employment_type: experienceFields.employment_type.required().messages(requiredMsg("employment_type")),
    description: experienceFields.description.required().messages(requiredMsg("description")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateExperienceSchema = Joi.object({
    ...experienceFields,
    ...forbiddenFields,
}).min(1);


    

   