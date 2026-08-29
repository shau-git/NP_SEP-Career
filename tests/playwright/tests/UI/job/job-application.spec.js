import { test } from "../../../Fixtures/fixture"
import { JobPage } from "../../../pages/JobPage";
import { expect } from "@playwright/test"

test.describe("Job Post Testing", () => {

    // Arrange
    const searchTitle = 'developer'
    const expectedSalary = "5000"
    // Create a dynamic regex with the variable and the 'i' (ignore case) flag
    const titleRegex = new RegExp(searchTitle, 'i');

    test('should show "Applied for job successfully" when a user searches for a job and tries to apply', async ({ userPage }) => {
        // already logged in as admin

        // Act
        const jobSearch = new JobPage(userPage)
        await jobSearch.searchJob(searchTitle)
        await jobSearch.clickVisitJob()        
    
        // Assert: job title contain developer (ignore case sensitive)
        // use jobSearch.page because jobSearch.openJob() change the this.page to newPage
        await expect(jobSearch.page.locator('h1', { hasText: titleRegex })).toBeVisible();

        // Act
        await jobSearch.clickApplyButton()
        await jobSearch.submitApplyWithSalary(expectedSalary)

        // Assert: success message to appear
        await expect(jobSearch.page.getByText('Applied for job successfully')).toBeVisible()
        //await userPage.waitForTimeout(3000)
    });


    test('Should show a login modal when a user who has not logged in searches for a job and tries to apply.', async ({ publicPage }) => { 
        // Act
        const jobSearch = new JobPage(publicPage)
        await jobSearch.searchJob(searchTitle)
        await jobSearch.clickVisitJob()        
    
        // Assert: job title contain developer (ignore case sensitive)
        // use jobSearch.page because jobSearch.openJob() change the this.page to newPage
        await expect(jobSearch.page.locator('h1', { hasText: titleRegex })).toBeVisible();

        // Act
        await jobSearch.clickApplyButton()

        // Assert: Error Message & Sign In button (modal) to appear
        await expect(jobSearch.page.getByText('Login or Sign Up to apply job!')).toBeVisible()
        await expect(jobSearch.page.getByText('Sign In')).toBeVisible()
        await publicPage.waitForTimeout(3000)
    })
})

// npx playwright test ./tests/playwright/tests/UI/job/job-application.spec.js --headed --project=chromium --reporter=list

