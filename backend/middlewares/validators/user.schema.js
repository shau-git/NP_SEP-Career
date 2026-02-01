import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

const userBase = {
    
    name: Joi.string().min(1).max(50).trim().messages({
        "string.base": "namemust be a string",
        "string.empty": "namecannot be empty",
        "string.min": "name must be at least 1 character long",
        "string.max": "name cannot exceed 50 characters",
    }),
    role: Joi.string().min(1).max(50).trim().messages({
            'string.base': 'role must be a string',
            'string.min': 'role cannot be empty',
            "string.max": "name cannot exceed 50 characters",
    }),
    image: Joi.string().min(1).trim().messages({
            'string.base': 'image must be a string',
            'string.min': 'image cannot be empty',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).min(10).max(65).trim()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.min': 'email must be at least 10 characters long',
            'string.max': 'email cannot exceed 80 characters',
    }),
    password: Joi.string().min(5).trim()
        .messages({
            'string.min': 'password must be at least 5 characters long',
            'string.base': 'password must be a string',
            'string.empty': 'password cannot be empty',  
    }),
    summary: Joi.string().min(0).max(500).trim().messages({
        "string.base": "summary must be a string",
        "string.max": "summary cannot exceed 500 characters",
    }),
    
};



// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    user_id: Joi.forbidden().messages({'any.unknown': 'user_id is not allowed'}),
    skills: Joi.forbidden().messages({'any.unknown': "You cannot change skills record in this route"}),
    experiences: Joi.forbidden().messages({'any.unknown': "You cannot change experiences record in this route"}),
    educations: Joi.forbidden().messages({'any.unknown': "You cannot change educations record in this route"}),
    company_members: Joi.forbidden().messages({'any.unknown': "You cannot change company_members record in this route"}),
    job_applicants: Joi.forbidden().messages({'any.unknown': "You cannot change job_applicants record record"}),
    notification: Joi.forbidden().messages({'any.unknown': "You cannot modify the notifications data"}),
    image_public_id: Joi.forbidden().messages({'any.unknown': "You cannot modify the image_public_id"}),
};
 

// POST schema (required + forbidden)
export const createUserSchema = Joi.object({
    ...forbiddenFields,
    name: userBase.name.required().messages(requiredMsg("name")),
    email: userBase.email.required().messages(requiredMsg("email")),
    password: userBase.password.required().messages(requiredMsg("password")),
});


// PUT / PATCH schema (partial + forbidden)
export const updateUserSchema = Joi.object({
    ...userBase,
    ...forbiddenFields,
    email: Joi.forbidden().messages({'any.unknown': "You cannot change email."})
}).min(1);
    

   