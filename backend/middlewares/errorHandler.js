const {CustomAPIError} = require("../errors/errors")

const errorHandlerMiddleware = (err, req, res, next) => {
    // console.log(err)
    if(err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({message: err.message})
    }
    console.error(err)
    return res.status(500).json({message: err.message})
}

module.exports = errorHandlerMiddleware