const CustomAPIError = require("./custom-error")
const ForbiddenError = require("./forbidden")
const BadRequestError = require("./bad-request")
const NotFoundError = require("./not-found")
const UnauthenticatedError = require("./unauthenticated")

module.exports = {
    CustomAPIError, 
    BadRequestError, 
    NotFoundError,
    UnauthenticatedError,
    ForbiddenError
}


/*
these all are self custom error classes, all inherit the error class
*/