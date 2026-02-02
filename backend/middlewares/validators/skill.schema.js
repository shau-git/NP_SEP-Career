const Joi = require("joi")
const requiredMsg = require("./utils/required_message")
const { joiErrorMessage } = require("./utils/error_message");

// allowed fields ONLY
const skillFields = {
    skill: Joi.string().min(1).max(30).trim().messages({
        'string.base': 'skill must be a string',
        'string.min': 'skill cannot be empty',
        'string.max': 'skill cannot exceed 30 characters',
    })
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
const createSkillSchema = Joi.object({
    skill: skillFields.skill.required().messages(requiredMsg("skill")),
    //level: skillFields.level.required().messages(requiredMsg("level")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
const updateSkillSchema = Joi.object({
    ...skillFields,
    ...forbiddenFields,
}).min(1);



const validateCreate = (req, res, next) => {
    const { error } = createSkillSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};
   

const validateUpdate = (req, res, next) => {
    const { error } = updateSkillSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};

module.exports = {
    createSkillSchema: validateCreate,
    updateSkillSchema: validateUpdate
}

    

   