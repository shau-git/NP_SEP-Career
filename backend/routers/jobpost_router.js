const express = require("express")
const router = express.Router()
const {getAllJobPost, getOneJobPost} = require("../controllers/jobpost_controller")


// get one job post
router.get('/:job_post_id', getOneJobPost);

// GET all job post
router.get('/', getAllJobPost);



module.exports = router