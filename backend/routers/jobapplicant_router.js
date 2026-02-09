const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {updateJobApplication} = require("../controllers/job_applicant_controller")
const {updateJobApplicantSchema} = require("../middlewares/validators_config")

// add member to company
router.put('/:applicant_id', auth, updateJobApplicantSchema, updateJobApplication)

module.exports = router