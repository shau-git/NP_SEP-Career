const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {signImage, uploadImageToDb} = require("../controllers/image_controller")

router.post('/sign-image', auth, signImage)

router.post('/uploadimage', auth, uploadImageToDb)

module.exports = router