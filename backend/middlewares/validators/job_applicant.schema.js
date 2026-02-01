import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const jobApplicantFields = {
    status: Joi.string().trim().uppercase()
        .valid('ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'PENDING')
        .messages({
            'any.only': "status must be one of: 'ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'PENDING'",
    }),

    expected_salary: Joi.number().integer().min(1)
        .messages({
            'number.base': 'expected_salary must be a number.',
            'number.min': 'expected_salary cannot be negative.',
    }),

    interview_date: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            'date.format': 'interview_date must be a valid YYYY-MM-DD date'
    }),

    interview_time: Joi.string()
        .allow(null)
        // Regex for 09:00AM format
        .pattern(/^(0[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/) 
        .when('interview_date', {
            is: Joi.exist().not(null),
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'string.pattern.base': 'interview_time must be in HH:MM(AM|PM) (ex: 09:00AM) format',
            'any.required': 'interview_time is required if a date is set'
    }),
};


// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    applicant_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing applicant_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    job_post_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing job_post_id is not allowed',
    }),

    applied_date: Joi.forbidden().messages({
        'any.forbidden': 'Changing applied_date is not allowed',
    }),

    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
    job_post: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify job_post relation',
    }),
};


// POST schema (required + forbidden)
export const createJobApplicantsSchema = Joi.object({
    ...forbiddenFields,
    expected_salary: jobApplicantFields.expected_salary.required().messages(requiredMsg("expected_salary")),
    status: jobApplicantFields.status.forbidden().messages({
        'any.forbidden': 'You are not allowed to create status',
    }),
    interview_date: jobApplicantFields.interview_date.forbidden().messages({
        'any.forbidden': 'You are not allowed to create interview_date',
    }),
    interview_time: jobApplicantFields.interview_time.forbidden().messages({
        'any.forbidden': 'You are not allowed to create interview_time',
    })
});

// PUT / PATCH schema (partial + forbidden)
export const updateJobApplicantSchema = Joi.object({
    ...jobApplicantFields,
    ...forbiddenFields,
    expected_salary: Joi.forbidden().messages({
        'any.forbidden': 'expected_salary cannot be changed after application',
    }),
}).min(1);