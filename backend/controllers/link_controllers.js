const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const Link = require("../models/link")

const addLink = asyncWrapper(async (req, res) => {
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

    const addedLink = await Link.create({...value, user_id}); 
    return res.status(201).json({message: "Link record added successfully", data: addedLink});
    
})



const updateLink = asyncWrapper(async (req, res) => {
    const { link_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(link_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let link = await Link.findOne({
        where: {link_id},
    })

    if (!link) {
        throw new NotFoundError(`Link id ${link_id} record not found!`)
    }

    const value = req.body

    if (link.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }
    await Link.update(value, {where: {link_id}}); 

    const updatedLink = await Link.findOne({
        where: {link_id},
    })

    return res.status(200).json({message: "Link record added successfully", data: updatedLink});
    
})



const deleteLink = asyncWrapper(async (req, res) => {
    const { link_id } = req.params;

    // 1. Validate ID is a number
    if (isNaN(Number(link_id))) {
        throw new BadRequestError("Invalid ID format");
    }

    // get the user payload
    const payload = req.user

    let link = await Link.findOne({
        where: {link_id},
    })

    // if education_id id not found
    if (!link) {
        throw new NotFoundError(`Link id ${link_id} record not found!`)
    }

    if (link.user_id != payload.user_id) {
        throw new ForbiddenError("This action is forbidden") 
    }

    await Link.destroy({where: {link_id}}); 

    return res.status(200).json({message: `Link ${link_id} record deleted successfully`})    
})

module.exports = { 
    addLink ,
    updateLink,
    deleteLink
};