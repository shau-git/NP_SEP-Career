const {test, expect} = require('@playwright/test')

test('a user add an education record', async function({page}) {
    await page.goto('http://localhost:5173/')

    // click the profile icon to go to user profile
    await page.locator('#user').click()
    const viewProfile = page.getByText('View Profile')
    await viewProfile.waitFor({ state: 'visible' })
    await viewProfile.hover()
    //await page.waitForTimeout(500)
    await viewProfile.click()

    // assert directing to the correct url
    await expect(page).toHaveURL('http://localhost:5173/user/42')
    //await page.waitForTimeout(1000)

    // Using CSS adjacent sibling to get the button beside <h2>Education</h2>
    await page.locator('h2:text("Education") + button').click();

    //await page.waitForTimeout(1000)

    // fill in the education detail
    await page.locator('input[name="institution"]').type('Ngee Ann Poly',{delay:100})
    await page.locator('input[name="field_of_study"]').type('Full Stack Development',{delay:100})
    await page.locator('select[name="qualification"]').selectOption({value: "Diploma"});
    await page.locator('select[name="study_type"]').selectOption({value: "part time"});
    await page.locator('input[name="start_date"]').fill('2024-10-12')
    await page.locator("button:has-text('Present')").click()
    await page.locator('textarea[name="description"]').fill("Software Testing Project")

    // click Add Education button
    await page.getByText('Add Education').click()

    // assert the success message to be appeared
    await expect(page.getByText('Education record added successfully')).toBeVisible()
    //await page.waitForTimeout(2000)
})