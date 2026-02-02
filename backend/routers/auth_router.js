const express = require('express');
const router = express.Router();
const {login} = require('../controllers/auth_controllers');
const validateEmailPassword = require("../middlewares/validators/validateEmailPassword")

// get one job post
router.post('/', validateEmailPassword, login);

module.exports = router