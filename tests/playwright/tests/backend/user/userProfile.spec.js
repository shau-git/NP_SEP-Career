import {test, expect , beforeAll} from "@playwright/test"
import test_user from "../../../../test-data/test_user.json" 
import { reqBase, createToken } from '../utils/utils'
import {addExperience} from "../../../../test-data/test_experience.json"

test.describe("Company Profile Testing", () => {

    let userReq;
    let loggedOutReq;
    let user_id = 37

    beforeAll(async () => {
        // 1. Generate base request for 
        const regularUser = { user_id, email: 'user@test.com', name: 'Eren' }
        const userToken = await createToken(regularUser) 
        userReq = await reqBase(userToken)

        // 2. Generate base request for a logged out user
        const emptyToken = ""
        loggedOutReq = await reqBase(emptyToken)
    })


    test('should return "Experience record added successfully" & new data when user add new experience record', async() => {

        // Act
        const req = await userReq.post(`/api/user/${user_id}/experience`, {data: addExperience})
        const res = await req.json()
        
        // Assert
        await expect(req.status()).toBe(201)
        await expect(res.message).toEqual('Experience record added successfully')
        await expect(res.data).toMatchObject(addExperience)
    })


    test('should return "error message" when user add new experience record with empty "company" field', async() => {
        // Arrange
        const invalidInput = {...addExperience, company: ""} 

        // Act
        const req = await userReq.post(`/api/user/${user_id}/experience`, {data: invalidInput})
        const res = await req.json()

        // Assert
        await expect(req.status()).toBe(400)
        await expect(res.message.company).toContain('"company" is not allowed to be empty')
    })


    test('should return "error message" when user add new experience record with invalid years field', async() => {
        // Arrange
        const invalidInput = {...addExperience, years: "invalid"} 

        // Act
        const req = await userReq.post(`/api/user/${user_id}/experience`, {data: invalidInput})
        const res = await req.json()

        // Assert
        await expect(req.status()).toBe(400)
        await expect(res.message.years).toContain('years must be one of: 0-2, 2-5, 5-8, 8+')
    })


    test('should return "error message" when user include user_id in the request body for adding new experience record', async() => {
        // Arrange
        const invalidInput = {...addExperience, user_id: 37} 

        // Act
        const req = await userReq.post(`/api/user/${user_id}/experience`, {data: invalidInput})
        const res = await req.json()

        // Assert
        await expect(req.status()).toBe(400)
        await expect(res.message.user_id).toContain('"user_id" is not allowed')
    })


    test('should return "Unauthorized" when user who has not logged in add experience record', async() => {

        // Act
        const req = await loggedOutReq.post(`/api/user/${user_id}/experience`, {data: addExperience})
        const res = await req.json()

        // Assert
        await expect(req.status()).toBe(401)
        await expect(res.message).toContain('Authentication invalid')
    })

    
    test('should return "error message" when user add experience record to other user profile', async() => {

        // Act
        const req = await userReq.post(`/api/user/1/experience`, {data: addExperience})
        const res = await req.json()

        // Assert
        await expect(req.status()).toBe(403)
        await expect(res.message).toContain('This action is forbidden')
    })
})

// npx playwright test ./tests/playwright/tests/backend/user/userProfile.spec.js --project=chromium --reporter=list
