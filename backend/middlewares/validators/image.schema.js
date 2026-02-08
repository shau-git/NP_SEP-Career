const Joi = require('joi');
const requiredMsg = require("./utils/required_message");
const { joiErrorMessage } = require("./utils/error_message");

// 1. Field Definitions
const ImageFields = {
    image: Joi.string().min(1).trim().messages({
        'string.base': 'image must be a string',
        'string.min': 'image cannot be empty',
    }),
    newImageUrl: Joi.string().min(1).trim().messages({
        'string.base': 'newImageUrl must be a string',
        'string.min': 'newImageUrl cannot be empty',
    }),
    newPublicId: Joi.string().min(1).max(255).trim().messages({
        "string.base": "newPublicId must be a string",
        "string.max": "newPublicId cannot exceed 255 characters",
    }),
};

// 2. Schemas
const updateImageSchema = Joi.object({
    // FIXED: Changed .name to .newImageUrl and fixed spelling of newImageUrl
    newImageUrl: ImageFields.newImageUrl.required().messages(requiredMsg("newImageUrl")),
    newPublicId: ImageFields.newPublicId.required().messages(requiredMsg("newPublicId"))
});

const ParamsToSignSchema = Joi.object({
    paramsToSign: Joi.object({
        timestamp: Joi.number().required(),
        folder: Joi.string().max(255).required(),
        upload_preset: Joi.string().required(),
        source: Joi.string().valid('uw').required(),
        public_id: Joi.string().max(255).optional()
    }).required() // The outer key is now mandatory
});

// 3. Validation Middleware
const validateUpdate = (req, res, next) => {
    const { error } = updateImageSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) return res.status(400).json({ message: joiErrorMessage(error) });
    next();
};

const validateSignIn = (req, res, next) => {
    const { error } = ParamsToSignSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false 
    });

    if (error) {
        return res.status(400).json({ 
            message: joiErrorMessage(error) 
        });
    }

    next();
};

// 4. Exports
module.exports = {
    validateSignIn,
    validateUpdate 
};