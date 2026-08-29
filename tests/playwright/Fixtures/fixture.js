import { test as base, expect as baseExpect } from '@playwright/test'

export const test = base.extend({

    // Logged out
    publicPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            storageState: undefined
        })

        const page = await context.newPage()

        await page.goto('localhost:5173/')

        await use(page)

        await context.close()
    },

    // Normal user
    userPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            storageState: 'tests/playwright/auth/.auth/user.json'
        })

        const page = await context.newPage()

        await page.goto('localhost:5173/')

        await use(page)

        await context.close()
    },


    // Member
    memberPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            storageState: 'tests/playwright/auth/.auth/member.json'
        })

        const page = await context.newPage()

        await page.goto('localhost:5173/')

        await use(page)

        await context.close()
    },


    // Admin
    adminPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            storageState: 'tests/playwright/auth/.auth/admin.json'
        })

        const page = await context.newPage()

        await page.goto('localhost:5173/')

        await use(page)

        await context.close()
    },


    // Owner
    ownerPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            storageState: 'tests/playwright/auth/.auth/owner.json'
        })

        const page = await context.newPage()

        await page.goto('localhost:5173/')

        await use(page)

        await context.close()
    }
})

export const expect = baseExpect;