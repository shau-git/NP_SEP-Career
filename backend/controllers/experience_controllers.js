const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Experience = require("../models/experience")

const addExperience = asyncWrapper(async (req, res) => {
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

    if (value.end_date instanceof Date) {
        // This turns the Object back into "2020-12-31" so the DB accepts it
        value.end_date = value.end_date.toISOString().split('T')[0];
    }

    const addedExperience = await Experience.create({...value, user_id}); 
    return res.status(201).json({message: "Experience record added successfully", data: addedExperience});
    
})



const updateExperience = asyncWrapper(async (req, res) => {
    const { experience_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(experience_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let experience = await Experience.findOne({
        where: {experience_id},
    })

    if (!experience) {
        throw new NotFoundError(`Experience id ${experience_id} record not found!`)
    }

    const value = req.body

    if (value.end_date instanceof Date) {
        // This turns the Object back into "2020-12-31" so the DB accepts it
        value.end_date = value.end_date.toISOString().split('T')[0];
    }

    if (experience.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }
    await Experience.update(value, {where: {experience_id}}); 

    const updatedExperience = await Experience.findOne({
        where: {experience_id},
    })

    return res.status(200).json({message: "Experience record added successfully", data: updatedExperience});
    
})



const deleteExperience = asyncWrapper(async (req, res) => {
    const { experience_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(experience_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let experience = await Experience.findOne({
        where: {experience_id},
    })

    // if experience id not found
    if (!experience) {
        throw new NotFoundError(`Experience id ${experience_id} record not found!`)
    }

    if (experience.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    await Experience.destroy({where: {experience_id}}); 

    return res.status(200).json({message: `Experience ${experience_id} record deleted successfully`})    
})

module.exports = { 
    addExperience ,
    updateExperience,
    deleteExperience
};