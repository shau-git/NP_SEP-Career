import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const linkFields = {
    url: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
        'string.uri': 'Must be a valid URL starting with http:// or https://'
    }),

    type: Joi.string().trim()
        .valid('Website', 'LinkedIn', 'GitHub', 'Twitter', 'Portfolio', 'Other')
        .messages({
        'any.only': "level must be one of: Native, Fluent, Basic",
    }),
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    link_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing link_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
};

// POST schema (required + forbidden)
export const createLinkSchema = Joi.object({
    url: linkFields.url.required().messages(requiredMsg("url")),
    type: linkFields.type.required().messages(requiredMsg("type")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateLinkSchema = Joi.object({
    ...linkFields,
    ...forbiddenFields,
}).min(1);


    

   