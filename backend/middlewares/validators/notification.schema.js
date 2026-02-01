import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const notificationFields = {
    is_read: Joi.boolean()
        .valid(true)
        .required()
        .messages({
            'any.only': 'is_read must be true.',
            'boolean.base': 'is_read must be a boolean.',
            "any.required": "is_read is required"
    }),

    // message: Joi.string().min(1).max(100).trim().messages({
    //     'string.base': 'message must be a string',
    //     'string.min': 'message cannot be empty',
    //     'string.max': 'message cannot exceed 100 characters',
    // }),

    // type:  Joi.string().trim().uppercase()
    //     .valid('ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'SUBMITTED')
    //     .messages({
    //         'any.only': "type must be one of: 'ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'SUBMITTED'",
    // }),
};


// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    notification_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing notification_id is not allowed',
    }),

    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),

    created_at: Joi.forbidden().messages({
        'any.forbidden': 'Changing created_at is not allowed',
    }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),

    message: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),

    type: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
};


// POST schema (required + forbidden)
// export const createNotificationSchema = Joi.object({
//     ...forbiddenFields,
//     is_read: notificationFields.is_read.forbidden().messages({
//         'any.forbidden': 'You are not allowed to handle is_read status here',
//     }),
// });

// PUT / PATCH schema (partial + forbidden)
export const updateNotificationSchema = Joi.object({
    ...notificationFields,
    ...forbiddenFields,
}).min(1);