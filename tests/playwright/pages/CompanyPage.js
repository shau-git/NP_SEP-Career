import {expect} from '@playwright/test'

export class CompanyPage {
    constructor(page) {
        this.page = page
        this.companyIconButton = page.locator('#usercompany')
        this.createCompanyButton = page.locator('button', { hasText: 'Create Company' })

    }

    async clickCompanyIcon() {
        this.companyIconButton.click()
    }
    async clickCreateCompanyButton(index) {
        await this.createCompanyButton.nth(index).click()
    }

    async fillForm(form) {
        const {companyName, industry, location, description} = form
        await this.page.locator('label:has-text("Company Name") + input').fill(companyName)
        await this.page.locator('label:has-text("Location") + input').fill(location)
        await this.page.locator('label:has-text("Industry") + select').selectOption({ label: industry })
        await this.page.locator('label:has-text("Description") + textarea').fill(description)
    }

    async clickCompanyProfile(companyName) {
        await this.page.getByRole('heading', { level: 3, name: companyName, exact: true }).click()
    }
}







