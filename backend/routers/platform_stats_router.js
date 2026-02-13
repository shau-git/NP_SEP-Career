const express = require("express")
const router = express.Router()
const {getPlatformStats} = require("../controllers/platform_stats_controller")

// get all platform stats
router.get('/',  getPlatformStats)

module.exports = router