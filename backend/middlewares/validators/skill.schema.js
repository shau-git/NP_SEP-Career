import Joi from 'joi';
import requiredMsg from '@/lib/validators/utils/required_message';

// allowed fields ONLY
const skillFields = {
    skill: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'skill must be a string',
        'string.min': 'skill cannot be empty',
        'string.max': 'skill cannot exceed 30 characters',
    }),

    // level: Joi.string().trim().uppercase()
    //     .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    //     .messages({
    //     'any.only': "level must be one of: BEGINNER, INTERMEDIATE, ADVANCED",
    // }),
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    skill_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing skill_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
};

// POST schema (required + forbidden)
export const createSkillSchema = Joi.object({
    skill: skillFields.skill.required().messages(requiredMsg("skill")),
    //level: skillFields.level.required().messages(requiredMsg("level")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
export const updateSkillSchema = Joi.object({
    ...skillFields,
    ...forbiddenFields,
}).min(1);


    

   