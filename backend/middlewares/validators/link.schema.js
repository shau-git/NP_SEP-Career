const Joi = require("joi")
const requiredMsg = require("./utils/required_message")
const { joiErrorMessage } = require("./utils/error_message");

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
const createLinkSchema = Joi.object({
    url: linkFields.url.required().messages(requiredMsg("url")),
    type: linkFields.type.required().messages(requiredMsg("type")),
    ...forbiddenFields,
});

// PUT / PATCH schema (partial + forbidden)
const updateLinkSchema = Joi.object({
    ...linkFields,
    ...forbiddenFields,
}).min(1);


const validateCreate = (req, res, next) => {
    const { error } = createLinkSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};
   

const validateUpdate = (req, res, next) => {
    const { error } = updateLinkSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });

    // Pass control to the next middleware or route handler.
    next();
};

    
module.exports = {
    createLinkSchema: validateCreate,
    updateLinkSchema: validateUpdate
}

   