const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {updateExperience, deleteExperience} = require("../controllers/experience_controllers")
const {
    updateExperienceSchema, 
} = require("../middlewares/validators_config")



router.route('/:experience_id')
.put(auth, updateExperienceSchema, updateExperience)
.delete(auth, deleteExperience)

module.exports = router