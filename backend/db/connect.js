const { Sequelize } = require('sequelize');
require('dotenv').config()

// the url to connect to the database
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set!');
    console.error('Please set it in your .env file (for local development) or on Render (for deployment).');
    process.exit(1); // Exit the application if no connection string is found
}



const sequelize = new Sequelize(connectionString, {
    // Specify the database dialect
    dialect: 'postgres', 
    logging: true, // Disable logging for cleaner console output
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, 
        },
    }
});

module.exports = sequelize;
