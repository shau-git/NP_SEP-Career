const userData = require("../../tests/test-data/test_user.json")
// const Company = require("../models/company")
const CompanyMember = require("../models/company_member")
const User = require("../models/user")


async function createTestCompanyMember() {
    console.log("creating test company member for company_id: 1...")

    // get test user email where companyRole is not normal user (member, admin, owner)
    const {accounts} =  userData
    const email_list = accounts
        .filter(account => account.companyRole !== 'user')
        .map(account => account.email)

    // get test user id from the db base on the email_list variable 
    const user_list = await User.findAll({
        where: { email:  email_list},
        attributes: ['user_id']
    })

    // get and map the user id from the fetched data 
    const userId_list = user_list.map(user => user.dataValues.user_id)

    let i = 0
    while (i < userId_list.length) {
        const user_id = userId_list[i]
        //const company_id = testCompany.dataValues.company_id
        const [role] = email_list[i].split('@')

        await CompanyMember.create({
            user_id,  
            company_id: 1, 
            role, 
            removed: false
        })
        console.log(`Created Company ${role}: user id ${user_id}, company id: ${1}`)
        i++
    } 
}


//node ./backend/test/createTestCompanyMember.js
module.exports = createTestCompanyMember  