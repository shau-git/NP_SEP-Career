const data = require("../../tests/test-data/test_user.json")
const User = require("../models/user")
const runInsert = require("./runInsert")


// runInsert(async() => {
//     for (const { name, email, password } of data.accounts) {
//         // hashPassword returns a plain object with password hashed
//         const hashedUser = await User.hashPassword({ email, password, name })

//         // actually insert into the DB
//         const user = await User.create(hashedUser)
//         console.log(`Created user: ${user.email} (id: ${user.user_id})`)
//     }
// })



async function createTestUser() {
    console.log("creating test user ...")
    for (const { name, email, password } of data.accounts) {
        // hashPassword returns a plain object with password hashed
        const hashedUser = await User.hashPassword({ email, password, name })

        // actually insert into the DB
        const user = await User.create(hashedUser)
        
        console.log(`Created user: ${user.email} (id: ${user.user_id})`)
    }
}

module.exports = createTestUser