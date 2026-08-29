import { test } from "../../../Fixtures/fixture"
import { JobPage } from "../../../pages/JobPage";
import { expect } from "@playwright/test"
import { CompanyPage } from "../../../pages/CompanyPage"

test.describe('Job Applicants test', () => {
    test('should show "Job Application updated" when a company member change a job applicant status to interview', async({memberPage}) => {
        // Arrange
        const companyName = 'TechCorp'
        const filter = 'Pending'
        const status = 'Interview'
        const date = '2026-08-27'

        // Act
        const company = new CompanyPage(memberPage)
        await company.clickCompanyIcon()
        await company.clickCompanyProfile(companyName)

        const job = new JobPage(company.page)
        await job.clickApplicantsOptionButton()
        await job.filterStatus(filter)
        await job.updateStatus(status)
        await job.setUpInterviewDate(date)
        await job.confirmChanges()

        // Assert
        await expect(job.page.getByText(`Job Application updated`)).toBeVisible()
        
        //await memberPage.waitForTimeout(3000)
    })
})

// npx playwright test tests/playwright/UI/job/job-response.spec.js --headed --project=chromium --reporter=list