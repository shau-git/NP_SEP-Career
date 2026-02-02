const Joi = require("joi")
const requiredMsg = require("./utils/required_message")
const { joiErrorMessage } = require("./utils/error_message");

// allowed fields ONLY
const languageFields = {
    language: Joi.string().min(1).max(20).trim().messages({
        'string.base': 'language must be a string',
        'string.min': 'language cannot be empty',
        'string.max': 'language cannot exceed 20 characters',
    }),

    proficiency: Joi.string().trim()
        .valid('Native', 'Fluent', 'Basic')
        .messages({
        'any.only': "level must be one of: Native, Fluent, Basic",
    }),
};
 
// forbidden fields (ALWAYS forbidden)
const forbiddenFields = {
    language_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing language_id is not allowed',
    }),
    user_id: Joi.forbidden().messages({
        'any.forbidden': 'Changing user_id is not allowed',
    }),
    user: Joi.forbidden().messages({
        'any.forbidden': 'You are not allowed to modify user relation',
    }),
};

// POST schema (required + forbidden)
const createLanguageSchema = Joi.object({
    language: languageFields.language.required().messages(requiredMsg("language")),
    proficiency: languageFields.proficiency.required().messages(requiredMsg("proficiency")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
const updateLanguageSchema = Joi.object({
    ...languageFields,
    ...forbiddenFields,
}).min(1);



const validateCreate = (req, res, next) => {
    const { error } = createLanguageSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};
   

const validateUpdate = (req, res, next) => {
    const { error } = updateLanguageSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};
  
    

module.exports = {
    createLanguageSchema: validateCreate,
    updateLanguageSchema: validateUpdate
}