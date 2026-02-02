const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Language = require("../models/language")

const addLanguage= asyncWrapper(async (req, res) => {
    const { user_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(user_id))) {
        throw new BadRequestError("Invalid User ID format");
    }

    // get the user payload
    const payload = req.user

    if (user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    const value = req.body

    const addedLanguage = await Language.create({...value, user_id}); 
    return res.status(201).json({message: "Language record added successfully", data: addedLanguage});
    
})



const updateLanguage = asyncWrapper(async (req, res) => {
    const { language_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(language_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let language = await Language.findOne({
        where: {language_id},
    })

    if (!language) {
        throw new NotFoundError(`Language id ${language_id} record not found!`)
    }

    const value = req.body

    if (language.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }
    await Language.update(value, {where: {language_id}}); 

    const updatedLanguage = await Language.findOne({
        where: {language_id},
    })

    return res.status(200).json({message: "Language record added successfully", data: updatedLanguage});
    
})



const deleteLanguage = asyncWrapper(async (req, res) => {
    const { language_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(language_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let language = await Language.findOne({
        where: {language_id},
    })

    // if education_id id not found
    if (!language) {
        throw new NotFoundError(`Language id ${language_id} record not found!`)
    }

    if (language.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    await Language.destroy({where: {language_id}}); 

    return res.status(200).json({message: `Language ${language_id} record deleted successfully`})    
})

module.exports = { 
    addLanguage ,
    updateLanguage,
    deleteLanguage
};