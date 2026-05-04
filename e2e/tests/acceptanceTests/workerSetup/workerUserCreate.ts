import { test as base, expect } from '@playwright/test';

type Account = {
    username: string;
    password: string;
};

// Note that we pass worker fixture types as a second template parameter.
export const test = base.extend<{}, { account: Account }>({
    account: [async ({ browser }, use, workerInfo) => {
        // Unique username.
        const username = 'user' + workerInfo.workerIndex;
        const password = 'verysecure';

        // Create the account with Playwright.
        const page = await browser.newPage();
        await page.goto('/signup');
        await page.getByLabel('User Name').fill(username);
        await page.getByLabel('Password').fill(password);
        await page.getByText('Sign up').click();
        // Make sure everything is ok.
        await expect(page.getByTestId('result')).toHaveText('Success');
        // Do not forget to cleanup.
        await page.close();

        // Use the account value.
        await use({ username, password });
    }, { scope: 'worker' }],

    page: async ({ page, account }, use) => {
        // Sign in with our account.
        const { username, password } = account;
        await page.goto('/signin');
        await page.getByLabel('User Name').fill(username);
        await page.getByLabel('Password').fill(password);
        await page.getByText('Sign in').click();
        await expect(page.getByTestId('userinfo')).toHaveText(username);

        // Use signed-in page in the test.
        await use(page);
    },
});

export { expect } from '@playwright/test';