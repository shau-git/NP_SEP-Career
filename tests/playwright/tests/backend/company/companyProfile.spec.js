import {test, expect , beforeAll} from "@playwright/test"
import test_user from "../../../../test-data/test_user.json" 
import { reqBase, createToken } from '../utils/utils'


test.describe("Company Profile Testing", () => {
    let adminReq;
    let memberReq;
    let userReq;

    beforeAll(async () => {

        const baseURL = 'http://localhost:3000'

        // 1. Generate token for a valid Company Admin
        const companyAdmin = { user_id: 39, email: 'admin@test.com' , name: 'Armin'}
        const adminToken = createToken(companyAdmin) 
        adminReq = await reqBase(adminToken)

        // 2. Generate token for a non-admin member 
        const companyMember = { user_id: 38, email: 'member@test.com', name: 'Mikasa' }
        const memberToken = createToken(companyMember) 
        memberReq = await reqBase(memberToken)

        // 3. Generate token for a user from a different company
        const regularUser = { user_id: 37, email: 'user@test.com', name: 'Eren' }
        const userToken = await createToken(regularUser) 
        userReq = await reqBase(userToken)
    })


    test('should return "Company data updated successfully!" & updated data when admin change company profile (exclude company name)', async() => {
        // Arrange
        const updatedData =  {
            //name: 'TechCorp',
            industry: 'IT & Technology',
            location: 'Singapore, Jurong',
            description: 'Number 1 tech company'
        }

        // Action
        const putReq = await adminReq.put('/api/company/1', { data: updatedData })
        const res = await putReq.json()

        // Assert
        await expect(putReq.status()).toBe(200)
        await expect(res.data).toMatchObject(updatedData)
        await expect(res.message).toEqual("Company data updated successfully!")
        
    })

    test('should notify the admin to change the company name if changeing it to an existing name.', async() => {
        // Arrange
        const updatedData =  {
            name: 'TechCorp',
        }

        // Action
        const putReq = await adminReq.put('/api/company/1', { data: updatedData })
        const res = await putReq.json()

        // Assert
        await expect(putReq.status()).toBe(400)
        await expect(res.message).toEqual(`${updatedData.name} already registred, please change to another name.`)
        
    })


    test('a company member attempt to update company profile should get forbidden error', async () => {
        // Arrange
        const updatedData = {
            description: 'Unauthorized modification attempt'
        }

        // Act
        const putReq = await memberReq.put('/api/company/1', { data: updatedData })
        const res = await putReq.json()

        // Assert
        expect(putReq.status()).toBe(403)
        expect(res.message).toEqual('Unauthorized access to modify company data')
    })



    test('a user not from that company attempt to update company profile should get forbidden error', async () => {
        // Arrange
        const updatedData = {
            description: 'Unauthorized modification attempt'
        }

        // Act
        const putReq = await memberReq.put('/api/company/1', { data: updatedData })
        const res = await putReq.json()

        // Assert
        expect(putReq.status()).toBe(403)
        expect(res.message).toEqual('Unauthorized access to modify company data')
    })
})

// npx playwright test ./tests/playwright/tests/api/company/companyProfile.spec.js --project=chromium --reporter=list