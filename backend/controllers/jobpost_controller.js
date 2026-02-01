const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")
const asyncWrapper = require("./utils/wrapper")
const JobPost = require("../models/jobpost")
const { Op } = require('sequelize'); // Needed for [Op.iLike]
const Company = require('../models/company'); // Needed for the 'include'

//GET All job post
const getAllJobPost = asyncWrapper(async(req, res) => {
    const {title, industry, removed} = req.query

    let filter = {removed: false}

    title && (filter.title = { [Op.iLike]: `%${title}%` })
    title && (filter.industry = { [Op.iLike]: `%${industry}%` })

    const jobposts = await JobPost.findAll({
        where: filter,
        order: [
            ['created_at', 'DESC'],
            ['job_post_id', 'DESC']
        ],
        attributes: [
            'job_post_id', 
            'company_id', 
            'title', 
            'industry', 
            'requirements', 
            'responsibilities', 
            'employment_type', 
            'experience', 
            'created_at', 
            'removed', 
            'salary_start', 
            'salary_end', 
            'location', 
            'benefit', 
            'summary', 
            'description'
        ],
        include: [
            {
            model: Company,
            as: 'company' // This must match the 'as' alias in your model definition
            }
        ]
    })
console.log("line 45", jobposts)
    return res.status(200).json({total: jobposts.length, data: jobposts})
})

module.exports = {
    getAllJobPost
}