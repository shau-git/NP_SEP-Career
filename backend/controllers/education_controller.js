const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Education = require("../models/education")

const addEducation = asyncWrapper(async (req, res) => {
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

    const addedEducation = await Education.create({...value, user_id}); 
    return res.status(201).json({message: "Experience record added successfully", data: addedEducation});
    
})



const updateEducation = asyncWrapper(async (req, res) => {
    const { education_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(education_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let education = await Education.findOne({
        where: {education_id},
    })

    if (!education) {
        throw new NotFoundError(`Education id ${education_id} record not found!`)
    }

    const value = req.body

    if (value.end_date instanceof Date) {
        // This turns the Object back into "2020-12-31" so the DB accepts it
        value.end_date = value.end_date.toISOString().split('T')[0];
    }

    if (education.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }
    await Education.update(value, {where: {education_id}}); 

    const updatedEducation = await Education.findOne({
        where: {education_id},
    })

    return res.status(200).json({message: "Education record updated successfully", data: updatedEducation});
    
})



const deleteEducation = asyncWrapper(async (req, res) => {
    const { education_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(education_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let education = await Education.findOne({
        where: {education_id},
    })

    // if education_id id not found
    if (!education) {
        throw new NotFoundError(`Education id ${education_id} record not found!`)
    }

    if (education.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    await Education.destroy({where: {education_id}}); 

    return res.status(200).json({message: `Education ${education_id} record deleted successfully`})    
})

module.exports = { 
    addEducation ,
    updateEducation,
    deleteEducation
};