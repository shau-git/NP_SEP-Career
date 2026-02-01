const express = require('express');
const sequelize = require('./db/connect');
require('dotenv').config(); 
const PORT = process.env.PORT || 3012; 
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


// routes
app.use('/api/jobpost', jobpost_router)


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