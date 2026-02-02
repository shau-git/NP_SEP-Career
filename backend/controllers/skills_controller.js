const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Skill = require("../models/skill")

const addSkill = asyncWrapper(async (req, res) => {
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

    const addedSkill= await Skill.create({...value, user_id}); 
    return res.status(201).json({message: "Skill record added successfully", data: addedSkill});
    
})



const deleteSkill = asyncWrapper(async (req, res) => {
    const { skill_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(skill_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let skill = await Skill.findOne({
        where: {skill_id},
    })

    // if experience id not found
    if (!skill) {
        throw new NotFoundError(`Skill id ${skill_id} record not found!`)
    }

    if (skill.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    await Skill.destroy({where: {skill_id}}); 

    return res.status(200).json({message: `Skill ${skill_id} record deleted successfully`})    
})

module.exports = { 
    addSkill ,
    deleteSkill
};