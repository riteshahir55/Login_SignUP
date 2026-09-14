import { test, expect } from '@playwright/test';

test.describe('Authentication Flows (Pre-Deployment Mocked)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully register a user via mocked sign up endpoint', async ({ page }) => {
    // 1. Intercept network
    await page.route('**/api/users/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'User registered successfully!',
      });
    });

    // 2. Fill form
    await page.getByPlaceholder('Name').fill('Ritesh Ahir');
    await page.getByPlaceholder('Email Id').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('SecurePassword123');

    // 3. Submit AND explicitly wait for the dialog to be handled before ending the test
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'),
      page.locator('.submit').click(),
    ]);

    expect(dialog.message()).toBe('User registered successfully!');
    await dialog.accept();
  });

  test('should successfully log in via mocked login endpoint', async ({ page }) => {
    // 1. Intercept network
    await page.route('**/api/users/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Login successful!',
      });
    });

    // 2. Switch to Login tab
    await page.locator('.toggle-message span').click();
    await expect(page.locator('.header .text')).toHaveText('Login');

    // 3. Fill Login form
    await page.getByPlaceholder('Email Id').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('SecurePassword123');

    // 4. Submit and wait deterministically for the alert
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'),
      page.locator('.submit').click(),
    ]);

    expect(dialog.message()).toBe('Login successful!');
    await dialog.accept();
  });

  test('should handle login failure gracefully when backend returns an error', async ({ page }) => {
    // 1. Intercept and return 401
    await page.route('**/api/users/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    });

    // 2. Switch to Login tab
    await page.locator('.toggle-message span').click();

    // 3. Fill credentials
    await page.getByPlaceholder('Email Id').fill('wrong@example.com');
    await page.getByPlaceholder('Password').fill('WrongPassword');

    // 4. Submit and wait deterministically for the error alert
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'),
      page.locator('.submit').click(),
    ]);

    expect(dialog.message()).toBe('An error occured during login.');
    await dialog.accept();
  });

});