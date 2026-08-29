const sequelize = require("../db/connect")
const createTestUser = require("./createTestUser")
const createTestCompanyMember = require("./createTestCompanyMember")

// Wraps any async task with DB connect/close + error handling,
// so individual scripts (createUser, createCompany, etc.) stay clean.
async function runInsert() {
    try {
        await sequelize.authenticate()
        //await task()
        await createTestUser()
        await createTestCompanyMember()

        console.log('Done ...')
    } catch (err) {
        console.error("Script failed:", err)
        process.exitCode = 1
    } finally {
        await sequelize.close()
        
    }
}

// module.exports = runInsert
runInsert()

// node ./backend/test/runInsert.js