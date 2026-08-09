require('dotenv').config({ path: 'backend/.env' })  // to use .env in /backend folder
const sequelize = require('../../backend/db/connect')
const request = require('supertest')
const app = require("../../backend/app")
const jwt = require('jsonwebtoken');

describe("Integration test for [company_member] endpoint", () => {
    let token;

    beforeEach(() => {
        // Generate a valid JWT token for an authorized company admin before each test
        const companyAdmin = { user_id: 37, email: 'k.shaujie@gmail.com' , name: 'SJ'}
        token = jwt.sign( companyAdmin , process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
        console.log(token)
    })

    // close db conenction
    afterAll(async () => {
        await sequelize.close()
    }, 10000)

    test(`POST /api/company/2/companymember   should add a company member when performed by admin or company owner`, async () => {
        let response = await request(app)
            .post('/api/company/2/companymember')
            .send({ user_id: 17, role: "member"})
            .set('Authorization', `Bearer ${token}`)

        // assert Status code
        expect(response.status).toBe(201) 
 
        // assert body has the message
        expect(response.body.message).toBe('New Member Added!')

        // assert response body contains: newly added user id , the role & the company id
        expect(response.body.data).toMatchObject({ removed: false, user_id: 17, role: 'member', company_id: 2 })

        console.log(response.body)        
    }, 15000)
})