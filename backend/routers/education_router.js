const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {updateEducation, deleteEducation} = require("../controllers/education_controller")
    
const {
    updateEducationSchema, 
} = require("../middlewares/validators_config")



router.route('/:education_id')
.put(auth, updateEducationSchema, updateEducation)
.delete(auth, deleteEducation)

module.exports = router