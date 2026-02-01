const express = require("express")
const router = express.Router()
const {getAllJobPost} = require("../controllers/jobpost_controller")


// GET all job post
router.get('/', getAllJobPost);

module.exports = router