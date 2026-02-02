const {BadRequestError} = require("../../errors/errors")

const validateEmailPassword = (req,res, next) => {
    const {email, password} = req.body
    console.log(password)

    if(!email || !password || !password.trim()) {
        throw new BadRequestError("Please provide email and password")
    }
    
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailRegex.test(email)

    if (!emailRegex.test(email)) {
        throw new BadRequestError("Please provide valid email")
    }

    next()
}
    
module.exports = validateEmailPassword