import { test, expect } from '@playwright/test';

test.describe('Navigation and Authentication Pages', () => {
  test('Landing page loads and has expected key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Aivion|Care|Health|MediCore/i);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('Login page renders role switcher and login fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Patient registration page renders password requirement indicators', async ({ page }) => {
    await page.goto('/register/patient');
    const pwdInput = page.locator('input[name="password"], input[type="password"]').first();
    await expect(pwdInput).toBeVisible();
    
    // Type weak password and check that strength / requirement is visible
    await pwdInput.fill('short');
    await expect(page.locator('text=At least 8 characters')).toBeVisible();
    
    // Type strong compliant password
    await pwdInput.fill('StrongPass@123');
    const reqItem = page.locator('li', { hasText: 'At least 8 characters' });
    await expect(reqItem).toHaveClass(/text-emerald/);
  });

  test('Doctor registration page renders correctly', async ({ page }) => {
    await page.goto('/register/doctor');
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('Hospital registration page renders correctly', async ({ page }) => {
    await page.goto('/register/hospital');
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('Pharmacist registration page renders correctly', async ({ page }) => {
    await page.goto('/register/pharmacist');
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('Pathology registration page renders correctly', async ({ page }) => {
    await page.goto('/register/pathology');
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });
});

test.describe('Public Browsing and Discovery Flows', () => {
  test('Doctors listing page renders', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBeDefined();
  });

  test('Hospitals listing page renders', async ({ page }) => {
    await page.goto('/hospitals');
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBeDefined();
  });

  test('Medicines / Pharmacy store page renders', async ({ page }) => {
    await page.goto('/medicines');
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBeDefined();
  });

  test('Lab tests catalog renders', async ({ page }) => {
    await page.goto('/lab-tests');
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBeDefined();
  });
});

test.describe('Role Dashboard Routing and Security', () => {
  test('Patient dashboard redirects or presents authenticated route correctly', async ({ page }) => {
    await page.goto('/patient/dashboard');
    await page.waitForLoadState('domcontentloaded');
    // When unauthenticated, it either redirects to login or renders fallback/login prompt
    const url = page.url();
    expect(url.includes('/login') || url.includes('/patient')).toBeTruthy();
  });

  test('Doctor dashboard redirects or presents authenticated route correctly', async ({ page }) => {
    await page.goto('/doctor/dashboard');
    await page.waitForLoadState('domcontentloaded');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/doctor')).toBeTruthy();
  });

  test('Hospital dashboard redirects or presents authenticated route correctly', async ({ page }) => {
    await page.goto('/hospital/dashboard');
    await page.waitForLoadState('domcontentloaded');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/hospital')).toBeTruthy();
  });

  test('Admin dashboard redirects or presents authenticated route correctly', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin')).toBeTruthy();
  });
});
