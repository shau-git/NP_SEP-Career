const express = require('express');
const sequelize = require('./db/connect');
require('dotenv').config();
const PORT = process.env.PORT || 3000; 
const cors = require("cors")

const app = express();
app.use(cors({
    origin: ['https://np-sep-career.vercel.app', 'https://np-sep-career.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add all methods you use
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json());


// errorHandling
const errorHandlerMiddleware = require("./middlewares/errorHandler")
const notFound = require("./middlewares/not-found")


// import routers
const jobpost_router = require("./routers/jobpost_router")
const user_router = require("./routers/user_router")
const auth_router = require("./routers/auth_router")
const experience_router = require("./routers/experience_router")
const education_router = require("./routers/education_router")
const skill_router = require("./routers/skill_router")
const link_router = require("./routers/link_router")
const language_router = require("./routers/language_router")
const image_router = require("./routers/image_router")


// routes
app.use('/api/login', auth_router)
app.use('/api/jobpost', jobpost_router)
app.use('/api/user', user_router)
app.use('/api/experience', experience_router)
app.use('/api/education', education_router)
app.use('/api/skills', skill_router)
app.use('/api/link', link_router)
app.use('/api/language', language_router)
app.use('/api/image', image_router)

// handling error
app.use(notFound) // all not found route will be catched by this middleware
app.use(errorHandlerMiddleware)


const domain = "http://localhost:"
// Database connection
sequelize.authenticate()
    .then(() => {
        console.log('DB connected successfully.');
        // Optional: dbConnect.sync({ alter: true }); // Uncomment only if you need to auto-create/update tables
        app.listen(PORT, () => {
            //console.log(`Server started on port ${PORT}`);
            console.log(`Server started => ${domain}${PORT}`);
            
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit process if DB connection fails
    });