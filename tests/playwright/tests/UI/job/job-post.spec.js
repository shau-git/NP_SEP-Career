import { CompanyPage } from "../../../pages/CompanyPage"
import { JobPage } from "../../../pages/JobPage"
import { test , expect} from "../../../Fixtures/fixture"
import form from "../../../../test-data/test_form.json"

test('should show when a company member add a job post', async({memberPage}) => {
    // Arrange
    const companyName = 'TechCorp'
    const {createJobPostForm} = form

    // Act
    const company = new CompanyPage(memberPage)
    await company.clickCompanyIcon()
    await company.clickCompanyProfile(companyName)

    const jobPost = new JobPage(company.page)
    await jobPost.createNewJob(createJobPostForm)

    // Assert
    await expect(jobPost.page.getByText('New Job Post added!')).toBeVisible()

})

// npx playwright test ./tests/playwright/UI/job/job-post.spec.js --headed --project=chromium --reporter=list

