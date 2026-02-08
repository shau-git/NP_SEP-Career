const User = require("../models/user")
const {BadRequestError, UnauthenticatedError, ForbiddenError} = require("../errors/errors")


// POST user
const register = async(req, res) => {
    console.log(req.body)
    let {email, password, name} = req.body

    // Checking if an email already exists in the database
    const duplicateEmail = await User.findOne({
        where: { email }
    });

    if (duplicateEmail) {
        throw new BadRequestError(`${email} already exist`)
    }

    // hashing the password, and get the new req.body
    const newUser  = await User.hashPassword({email, password, name})

    // insert user data to DB
    const user = await User.create(newUser)

    // Genrenate JWT token
    const token = user.createJWT()
    const response = {
        user_id: user.user_id, 
        email: user.email, 
        name: user.name
    }

    res.status(201).json({user: response, token})

}


const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }
    // Validate user credentials
    const user = await User.findOne({
        where: {email}
    })

    if(!user) {
         throw new UnauthenticatedError("Invalid Credentials")
    }

    // Compare password with hash
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect) {
         throw new BadRequestError("Password incorrect")
    }

    // Genrenate JWT token
    const token = user.createJWT()
    const response = {
        user_id: user.user_id, 
        email: user.email, 
        name: user.name
    }

    return res.status(200).json({user: response, token})
}
module.exports = {
    register, login
}