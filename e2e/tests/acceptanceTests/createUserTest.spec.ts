import { test , expect } from '@playwright/test';

test.describe('US-183', () => {
    test.skip(true, "Not yet implemented");
    test('Go to create user', async ({ browser }) =>{
        const page = await browser.newPage();
        await page.goto('/index');
        await page.getByText('Sign up').click();
        await expect(page).toHaveURL(/signup\//);
        await page.close();
    })
    test.skip(true, "Not yet implemented")
    test('CRUD for user', async ({ browser }) => {
        const page = await browser.newPage();
        //Firstrly creating a user, to be used
        await page.goto('/signup');
        await page.getByLabel('Username').fill('testUser');
        await page.getByLabel('Password').fill('abc123');
        await page.getByText('Sign up').click();
        await expect(page).toHaveURL(/testUser\//);
        //Then updating username
        //If user is not immediatly sent to account page:
        //await page.getByText('Manage account').click();
        //otherwise can just start account management straight after creating user:
        await page.getByText('Edit username').click();
        await page.getByLabel('New username').fill('newTestUser');
        await page.getByText('Confirm new username').click();
        await expect(page).toHaveURL(/newTestUser\//);
        //Optionally can reset the password aswell, but is prob better after login system has been implemented
        //For deleting user:
        //Again assuming user is sent to user page after name edit
        await page.getByText('Delete user').click();
        //await page.getByText('Yes').click.();
        //Post account deletion page confirms account is deleted
        await expect(page.getByText('Account is deleted')).toBeVisible();
        //Attempt to access user page, and get feedback, user does not exist
        await page.goto('/newTestUser')
        await expect(page.getByText('404')).toBeVisible();
        await page.close();
    })
})