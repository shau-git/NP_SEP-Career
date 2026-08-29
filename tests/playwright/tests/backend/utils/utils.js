import jwt from 'jsonwebtoken'
require('dotenv').config({ path: 'backend/.env' })  // to use .env in /backend folder
import {request} from "@playwright/test"

const reqBase = async (token = "") => {
    return await request.newContext({
        baseURL: 'http://localhost:3000',
        extraHTTPHeaders: {
                Authorization: `Bearer ${token}`
            }
    })
}

const createToken = (credentialInfo) => {
    return jwt.sign( credentialInfo , process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

export {
    reqBase,
    createToken
}