import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const companyMemberFields = {
    role: Joi.string().trim().lowercase()
        .valid('owner', 'admin', 'member')
        .messages({
        'any.only': "role field must be one of: owner, admin, member",
    }),

    removed: Joi.boolean().messages({
        'boolean.base': 'removed status must be true or false.'
    }),

    user_id: Joi.number().integer().min(1)
        .messages({
            'number.base': 'user_id must be a number',
            'number.min': 'user_id cannot be negative',
    }),
    
};

// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    company_member_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_member_id is not allowed',
    }),
    company_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing company_id is not allowed',
    }),
    // user_id: Joi.forbidden().messages({
    //     'any.forbidden': 'Changing user_id is not allowed',
    // }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),

    company: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify company relation',
    }),
};


// POST schema (required + forbidden)
export const createCompanyMemberSchema = Joi.object({
    ...forbiddenFields,
    role: companyMemberFields.role.required().messages(requiredMsg("role")),
    user_id: companyMemberFields.user_id.required().messages(requiredMsg("user_id")),
    removed: companyMemberFields.removed.forbidden().messages({
        'any.forbidden': 'You are not allowed to handle removed status here',
    }),
});

// PUT / PATCH schema (partial + forbidden)
export const updateCompanyMemberSchema = Joi.object({
    ...companyMemberFields,
    ...forbiddenFields,
     user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
}).min(1);
