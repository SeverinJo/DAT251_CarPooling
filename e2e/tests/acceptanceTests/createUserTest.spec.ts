import { test, expect } from './workerSetup/workerUserCreate';

test('can access dashboard when signed in', async ({ page, account }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // account is available too
    await expect(page.getByTestId('current-user')).toHaveText(account.username);
});