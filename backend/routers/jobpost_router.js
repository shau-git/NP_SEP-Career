const express = require("express")
const router = express.Router()
const {getAllJobPost, getOneJobPost} = require("../controllers/jobpost_controller")
const {applyForJob} = require("../controllers/job_applicant_controller")
const auth = require("../middlewares/authentication")
const {createJobApplicantsSchema} = require("../middlewares/validators_config")
  


// GET all job post
router.get('/', getAllJobPost);

// get one job post
router.get('/:job_post_id', getOneJobPost);

// user apply for job
router.post('/:job_post_id/jobapplicant', auth, createJobApplicantsSchema, applyForJob);

module.exports = router