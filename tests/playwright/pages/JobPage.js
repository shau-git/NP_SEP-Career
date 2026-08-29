import {expect} from '@playwright/test'

export class JobPage {
    constructor(page) {
        this.page = page
        // this.searchInput = page.getByPlaceholder('Search Job title')
        // this.searchButton = page.getByRole('button', { name: /search/i })
    }

    // Job search
    async searchJob(keyword) {
        // await this.searchInput.fill(keyword)
        // await this.searchButton.click()
        await this.page.getByPlaceholder('Search Job title').fill(keyword)
        await this.page.getByRole('button', { name: /search/i }).click()
    }

    async clickVisitJob() {
        // 1. Wait for the new page (tab) to open when clicking the link
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByRole('link', { name: 'Visit' }).first().click()
        ]);
        
        // 2. Update this.page to point to the new tab immediately!
        this.page = newPage;

        // 3. Wait for the new tab to fully load
        await this.page.waitForLoadState();

        // 4. Wait for the new URL to change /job_post
        await this.page.waitForURL(/.*job_post.*/i);
    }

    // Job application
    async clickApplyButton() {
        // const applyBtn = this.page.getByRole('button', { name: /apply now/i })
        // await applyBtn.click()
        await this.page.getByRole('button', { name: /apply now/i }).click()
    }


    async submitApplyWithSalary(salary) {
        // 1. Fill in the expected salary
        await this.page.locator('div').filter({ hasText: /Expected Salary/i }).locator('input').fill(salary);
        
        // 2. Click the submit button right after
        await this.page.locator('button:has-text("Submit Application")').click();
    }

    // Job post
    async clickAddButton(buttonIndex) {
        await this.page.getByRole('button', { name: "+ Add" }).nth(buttonIndex).click()
    }

    async createNewJob(form) {
        const{
            jobTitle,
            industry,
            employmentType,
            experience,
            salaryStart,
            salaryEnd,
            location,
            contactEmail,
            summary,
            description,
            requirement,
            responsibilities,
            benefits
        } = form
        await this.page.getByRole('button', { name: 'Post New Job' }).click()

        await this.page.locator('label:has-text("Job Title") + input').fill(jobTitle)

        await this.page.locator('label:has-text("Industry") + select').selectOption({ label: industry })
        await this.page.locator('label:has-text("Employment Type") + select').selectOption({ label: employmentType })
        await this.page.locator('label:has-text("Experience") + select').selectOption({ label: experience })

        await this.page.locator('label:has-text("Salary Start") + input').fill(salaryStart)
        await this.page.locator('label:has-text("Salary End") + input').fill(salaryEnd)   

        await this.page.locator('label:has-text("Location") + select').selectOption({ label: location })

        await this.page.locator('label:has-text("Contact Email") + input').fill(contactEmail)  
        

        await this.page.locator('label:has-text("Summary") + textarea').fill(summary)
        await this.page.locator('label:has-text("Description") + textarea').fill(description)

        await this.addItemsToList( requirement, 'requirement', 0)
        await this.addItemsToList( responsibilities, 'responsibility', 1)
        await this.addItemsToList( benefits, 'benefit', 2)
            
        await this.page.locator('button', { hasText: 'Create Job Post' }).click()

    }

    // A reusable helper method inside your JobPage class
    async addItemsToList(itemsArray, inputLocator, buttonIndex) {
        for (const item of itemsArray) {
            // 1. Click the "Add" button to create a new input field slot
            //await this.page.locator(addButtonLocator).click();
            await this.clickAddButton(buttonIndex)
            
            // 2. Target and fill the newly generated input field with the array item
            // (Using .last() ensures you are typing into the brand-new row)
            await this.page.getByPlaceholder(inputLocator).last().fill(item);
        }
    }

    // Response job applicants
    async clickApplicantsOptionButton() {
        await this.page.getByRole('button', {name: 'Applicants'}).click()
    }

    // filter status
    async filterStatus(filter) {
        await this.page.locator('select').nth(1).selectOption(filter);
    }

    // update status to interview
    async updateStatus(status) {
        await this.page.locator('button[title="Options"]').first().click();
        await this.page.getByRole('button', { name: status }).click()
    }

    // input the interview date
    async setUpInterviewDate(date) {
        /*
            Playwright's .fill() method requires native date inputs to use the strict 
            YYYY-MM-DD format and will fail with other formats unless you handle 
            custom date pickers manually or reformat the string. 
        */

        await this.page.locator('input[type="date"]').fill(date)
    }

    async confirmChanges() {
        /*
            To handle a browser dialog/alert that pops up right after clicking the confirm button, listen for the 'dialog' event immediately before clicking.
        */
        this.page.on('dialog', async(d) => {
            await d.accept()
        })
        await this.page.getByRole('button', { name: /confirm/i }).click();
    }
}





