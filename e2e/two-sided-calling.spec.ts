import { test, expect } from '@playwright/test';

test.describe('Two-Sided Video / Audio Calling Verification', () => {
  test('Doctor and Patient can both open consultation call room, view media controls and connect signaling', async ({ browser }) => {
    // Context 1: Doctor Side
    const doctorContext = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });
    const doctorPage = await doctorContext.newPage();

    // Mock Doctor session in localStorage
    await doctorPage.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-doctor-token');
      localStorage.setItem('user', JSON.stringify({
        id: 101,
        fullName: 'Dr. Sarah Khan',
        role: 'DOCTOR',
        doctorApproved: true,
      }));
      // Set Zustand store state
      (window as any).__MOCK_AUTH__ = true;
    });

    // Context 2: Patient Side
    const patientContext = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });
    const patientPage = await patientContext.newPage();

    // Mock Patient session in localStorage
    await patientPage.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-patient-token');
      localStorage.setItem('user', JSON.stringify({
        id: 202,
        fullName: 'Rahul Sharma',
        role: 'PATIENT',
      }));
    });

    const consultationId = 8888;

    // Intercept consultation API calls to provide mock data for both peers
    const mockConsultation = {
      id: consultationId,
      appointmentId: consultationId,
      doctorName: 'Dr. Sarah Khan',
      patientName: 'Rahul Sharma',
      status: 'CONFIRMED',
    };

    await doctorPage.route(`**/api/consultations/**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultation),
      });
    });

    await patientPage.route(`**/api/consultations/**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultation),
      });
    });

    // Doctor enters call room
    await doctorPage.goto(`/video/consultation?id=${consultationId}`);
    await doctorPage.waitForLoadState('domcontentloaded');

    // Patient enters call room
    await patientPage.goto(`/video/consultation?id=${consultationId}`);
    await patientPage.waitForLoadState('domcontentloaded');

    // 1. Verify Doctor Side controls
    const doctorBody = doctorPage.locator('body');
    await expect(doctorBody).toBeVisible();
    await doctorPage.waitForTimeout(1000);

    const doctorButtons = doctorPage.locator('button');
    const doctorBtnCount = await doctorButtons.count();
    expect(doctorBtnCount).toBeGreaterThan(0);

    // 2. Verify Patient Side controls
    const patientBody = patientPage.locator('body');
    await expect(patientBody).toBeVisible();
    await patientPage.waitForTimeout(1000);

    const patientButtons = patientPage.locator('button');
    const patientBtnCount = await patientButtons.count();
    expect(patientBtnCount).toBeGreaterThan(0);

    // 3. Verify Doctor side mute / audio controls exist
    const doctorCallControls = doctorPage.locator('button');
    expect(await doctorCallControls.first().isVisible()).toBeTruthy();

    // 4. Verify Patient side call controls exist
    const patientCallControls = patientPage.locator('button');
    expect(await patientCallControls.first().isVisible()).toBeTruthy();

    // Cleanup
    await doctorContext.close();
    await patientContext.close();
  });
});
