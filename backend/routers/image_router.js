const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {signImage, uploadImageToDbUser, uploadImageToDbCompany} = require("../controllers/image_controller")
const {validateSignIn, validateUpdate} = require("../middlewares/validators_config")

router.post('/sign-image', auth, validateSignIn, signImage)

router.post('/uploadimage', auth, validateUpdate, uploadImageToDbUser)

router.post('/uploadimage/company/:company_id', auth, validateUpdate, uploadImageToDbCompany)

module.exports = router