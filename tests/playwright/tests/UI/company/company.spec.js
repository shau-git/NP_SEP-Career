import {test} from "../../../Fixtures/fixture"
import { CompanyPage } from "../../../pages/CompanyPage";
import { expect } from "@playwright/test"
import formTestData from "../../../../test-data/test_form.json"

// --- ARRANGE ---
const { createCompanyForm } = formTestData;

test.describe("Company Testing", () => {

    let createCompany;

    test('should show "Company registered successfully" when a user create a company', async ({ ownerPage }) => {
        // already logged in as admin
        const createCompany = new CompanyPage(ownerPage)

        // Act
        await createCompany.clickCompanyIcon()
        await createCompany.clickCreateCompanyButton(0)

        // Assert
        await expect(createCompany.page.locator('h2', { hasText: /Create New Company/ })).toBeVisible();

        // Act
        await createCompany.fillForm(createCompanyForm)
        await createCompany.clickCreateCompanyButton(1)
        
        // Assert
        await expect(createCompany.page.getByText('Company registered successfully')).toBeVisible()

    });

    test('should show "company name already registered" when a user create a company with an existing name', async ({ ownerPage }) => {
        // already logged in as admin

        // Act
        const createCompany = new CompanyPage(ownerPage)
        await createCompany.clickCompanyIcon()
        await createCompany.clickCreateCompanyButton(0)

        // Assert 
        await expect(createCompany.page.locator('h2', { hasText: /Create New Company/ })).toBeVisible();

        // Act
        await createCompany.fillForm(createCompanyForm)
        await createCompany.clickCreateCompanyButton(1)

        // Assert
        await expect(createCompany.page.getByText(`${createCompanyForm.companyName} already registred, please change to another name.`)).toBeVisible()
    });
})

// npx playwright test ./tests/playwright/UI/company/company.spec.js --headed --project=chromium --reporter=list
