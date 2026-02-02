const jwt = require("jsonwebtoken")

const checkUser = async(req, res, next) => {
    // check if there is a token in the req.headers
    const authHeader = req.headers.authorization
 
    try {
        if(authHeader && authHeader.startsWith('Bearer ')) {
       
            // getting the token only instead of 'Bearer eyJhbci...'
            const token = authHeader.split(' ')[1]

            // verifying the token
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            console.log(payload)

            // attach the jwt token payload to the req
            req.user = {user_id: payload.user_id, email: payload.email }
        }
    } catch (error) {
        console.error(error)
    }
    
    console.log("nextnetx")
    next()
} 

module.exports = checkUser