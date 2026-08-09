import {test as setup, expect} from '@playwright/test'

const authFile = 'tests/ui/auth/.auth/user.json'
setup('authenticate', async({page}) => {
    await page.goto('http://localhost:5173/')
    await page.locator('#user').click()

    // explicitly wait until the login button is visible
    const loginButton = page.getByRole('button', { name: 'Login' })
    await loginButton.waitFor({ state: 'visible' })

    // assert the login button to be visible
    await expect(loginButton).toBeVisible()

    // fill in email
    await page.getByPlaceholder('john@example.com').type('ksj@gmail.com',{delay:200})
    // fill in password
    await page.locator('input[type="password"]').type('test12345',{delay:200})

    // click sign in button
    await page.getByText('Sign In').click()

    await expect(page.getByText('Sucessfully Logged In.')).toBeVisible()
    // close react toastify message "Successfully Logged In."
    const closeBtn = page.locator('[aria-label="close"]')
    await closeBtn.waitFor({ state: 'visible' })
    await closeBtn.click()

    await page.context().storageState({path: authFile})
})