const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {updateLanguage, deleteLanguage} = require("../controllers/language_controller")
const {
    updateLanguageSchema, 
} = require("../middlewares/validators_config")



router.route('/:language_id')
.put(auth, updateLanguageSchema, updateLanguage)
.delete(auth, deleteLanguage)

module.exports = router