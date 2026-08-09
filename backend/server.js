const app = require("./app")
const sequelize = require('./db/connect');

const PORT = process.env.PORT || 3000; 
const domain = process.env.BACKEND_DOMAIN || "http://localhost"

// Database connection
sequelize.authenticate()
    .then(() => {
        console.log('DB connected successfully.');
        // Optional: dbConnect.sync({ alter: true }); // Uncomment only if you need to auto-create/update tables
        app.listen(PORT, () => {
            //console.log(`Server started on port ${PORT}`);
            console.log(`Server started => ${domain}:${PORT}`);
            
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit process if DB connection fails
    });