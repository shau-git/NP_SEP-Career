const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {deleteSkill} = require("../controllers/skills_controller")
    

router.route('/:skill_id')
.delete(auth, deleteSkill)

module.exports = router