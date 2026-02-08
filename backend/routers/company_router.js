const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {getCompanyProfile, updateCompanyProfile, addCompanyProfile, getCompanyStats, getAllCompanies} = require("../controllers/company_controller")
const {getCompanyMembers, addCompanyMember, updateCompanyMember} = require("../controllers/company_member_controller")    
const {createJobPost, updateJobPost} = require("../controllers/jobpost_controller")
const {getJobApplicantsCompany} = require("../controllers/job_applicant_controller")
const {
    createCompanySchema,
    updateCompanySchema, 
    createCompanyMemberSchema,
    updateCompanyMemberSchema,
    createJobPostSchema,
    updateJobPostSchema
} = require("../middlewares/validators_config")





// add member to company
router.route('/')
    .get(getAllCompanies)
    .post(auth, createCompanySchema, addCompanyProfile)


// get company profile  // update copany profile
router.route('/:company_id')
    .get(getCompanyProfile)
    .put(auth, updateCompanySchema, updateCompanyProfile)


// add company job post
router.post('/:company_id/jobpost', auth, createJobPostSchema, createJobPost)


// update company job post
router.put('/:company_id/jobpost/:job_post_id', auth, updateJobPostSchema, updateJobPost)


// get all company job applicant
router.get("/:company_id/jobapplicant", auth, getJobApplicantsCompany)

// get company stats
router.get("/:company_id/stats", auth, getCompanyStats)


// get company member data // add company member 
router.route('/:company_id/companymember')
    .get(auth, getCompanyMembers)
    .post(auth, createCompanyMemberSchema, addCompanyMember)


// update company member data
router.put('/:company_id/companymember/:company_member_id', auth, updateCompanyMemberSchema, updateCompanyMember)


module.exports = router