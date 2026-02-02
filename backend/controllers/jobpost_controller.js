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

    if(removed === "true") {
        filter.removed =  true
    } else if (removed === 'false') {
        filter.removed =  false
    }

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

    return res.status(200).json({total: jobposts.length, data: jobposts})
})


// get one job 
const getOneJobPost = asyncWrapper(async(req, res) => {
    const param_id = req.params.job_post_id
    const job_post_id = parseInt(param_id)

    if(!job_post_id) {
        throw new BadRequestError(`Invalid ID: ${param_id} must be numeric`)
    }


    const jobPost = await JobPost.findOne({
        where: { job_post_id },
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
    });


    if(!jobPost) { throw new NotFoundError(`Job Post ${job_post_id} not found`) }

    return res.status(200).json({data: jobPost})
})

module.exports = {
    getAllJobPost,
    getOneJobPost
}