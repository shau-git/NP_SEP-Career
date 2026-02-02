const express = require("express")
const router = express.Router()
const {getUserProfile, updateUserProfile} = require("../controllers/user_controller")
const {addExperience} = require("../controllers/experience_controllers")
const {addEducation} = require("../controllers/education_controller")
const {addSkill} = require("../controllers/skills_controller")
const {addLink} = require("../controllers/link_controllers")
const {addLanguage} = require("../controllers/language_controller")
const {register} = require("../controllers/auth_controllers")
const checkUser = require("../middlewares/checkuser")
const auth = require("../middlewares/authentication")
const {
    createUserSchema, 
    updateUserSchema, 
    createExperienceSchema,
    createEducationSchema,
    createSkillSchema,
    createLinkSchema,
    createLanguageSchema
} = require("../middlewares/validators_config")



// register user
router.post('/', createUserSchema, register)

//add experience
router.post('/:user_id/experience', auth, createExperienceSchema, addExperience)

//add education
router.post('/:user_id/education', auth, createEducationSchema, addEducation)

//add skill
router.post('/:user_id/skills', auth, createSkillSchema, addSkill)

//add link
router.post('/:user_id/link', auth, createLinkSchema, addLink)

//add language
router.post('/:user_id/language', auth, createLanguageSchema, addLanguage)

// get the user
router.route('/:user_id')
.get(checkUser, getUserProfile)
.put(auth, updateUserSchema, updateUserProfile)



module.exports = router