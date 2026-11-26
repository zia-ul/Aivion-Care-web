import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile iPhone (375x667)', width: 375, height: 667 },
  { name: 'Mobile Android (412x915)', width: 412, height: 915 },
  { name: 'Small Mobile (320x568)', width: 320, height: 568 },
];

const PAGES_TO_TEST = [
  '/',
  '/login',
  '/register/patient',
  '/register/doctor',
  '/doctors',
  '/hospitals',
  '/medicines',
  '/lab-tests',
  '/book-appointment',
];

for (const vp of VIEWPORTS) {
  test.describe(`UI Layout & Overlap Verification on ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const path of PAGES_TO_TEST) {
      test(`Check page "${path}" does not have horizontal overflow or clipping issues`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('domcontentloaded');

        // Verify page rendered
        const body = page.locator('body');
        await expect(body).toBeVisible();

        // Check horizontal overflow (scrollWidth > clientWidth) which indicates UI breakage / cutoffs
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          const clientWidth = doc.clientWidth;
          return {
            scrollWidth,
            clientWidth,
            hasHorizontalOverflow: scrollWidth > clientWidth + 1, // allow 1px rounding tolerance
          };
        });

        expect(
          overflow.hasHorizontalOverflow,
          `Page ${path} has horizontal scroll overflow on ${vp.name} (${overflow.scrollWidth}px > ${overflow.clientWidth}px)`
        ).toBeFalsy();
      });
    }
  });
}
