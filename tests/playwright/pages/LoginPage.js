import { expect } from '@playwright/test'

export class LoginPage {
    constructor(page) {
        this.page = page

        // Login modal
        this.userIconButton = page.locator('#user')
        this.loginOptionButton = page.getByRole('button', { name: 'Login' })

        // Login form
        this.emailInput = page.getByPlaceholder('john@example.com')
        this.passwordInput = page.locator('input[type="password"]')
        this.signInButton = page.getByText('Sign In')

        // Login result
        this.successMessage = page.getByText('Sucessfully Logged In.')
    }

    async openLogin() {
        await this.userIconButton.click()
        await expect(this.loginOptionButton).toBeVisible()
    }

    async login(email, password) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.signInButton.click()
    }

    async expectLoginSuccess() {
        await expect(this.successMessage).toBeVisible()
    }
}