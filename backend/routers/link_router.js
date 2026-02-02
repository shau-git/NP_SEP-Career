const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {updateLink, deleteLink} = require("../controllers/link_controllers")
const {
    updateLinkSchema, 
} = require("../middlewares/validators_config")



router.route('/:link_id')
.put(auth, updateLinkSchema, updateLink)
.delete(auth, deleteLink)

module.exports = router