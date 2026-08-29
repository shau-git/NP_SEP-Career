import { test as setup } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import testData from "../../test-data/test_user.json"


for (const {companyRole, email, password, storageState} of testData.accounts) {

    setup(`authenticate ${companyRole}`, async ({ page }) => {

        await page.goto('http://localhost:5173/')

        const loginPage = new LoginPage(page)

        // Act
        await loginPage.openLogin()

        await loginPage.login(email, password)

        await loginPage.expectLoginSuccess()

        await page.context().storageState({
            path: storageState
        })
    })
}


// npx playwright test --project=auth_setup --headed
// doesn't specify a browser/device, so Playwright uses its default browser: Chromium.

// make sure these account already exist and are configured correctly in your database.
const accounts = {
    user: {
        email: 'user@test.com',
        password: 'test12345',
        storageState: 'tests/auth/.auth/user.json'
    },

    member: {
        email: 'member@test.com',
        password: 'test12345',
        storageState: 'tests/auth/.auth/member.json'
    },

    admin: {
        email: 'admin@test.com',
        password: 'test12345',
        storageState: 'tests/auth/.auth/admin.json'
    },

    owner: {
        email: 'owner@test.com',
        password: 'test12345',
        storageState: 'tests/auth/.auth/owner.json'
    }
}

/*
for (const [role, account] of Object.entries(accounts)) {

    setup(`authenticate ${role}`, async ({ page }) => {

        await page.goto('http://localhost:5173/')

        const loginPage = new LoginPage(page)

        await loginPage.openLogin()

        await loginPage.login(
            account.email,
            account.password
        )

        await loginPage.expectLoginSuccess()

        await page.context().storageState({
            path: account.storageState
        })
    })
}
*/

