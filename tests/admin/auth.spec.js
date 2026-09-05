// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../fixtures/auth.js";
import { captureConsoleErrors } from "../fixtures/test-data.js";

test.describe("Phase 4: Admin Authentication & Protected Routes", () => {
  test("Unauthenticated access to protected route redirects to login", async ({ page }) => {
    // Clear localStorage to ensure fresh unauthenticated context
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Verify login form is visible
    await expect(page.getByRole("heading", { name: "Studio Admin Login" })).toBeVisible();
  });

  test("Empty credentials triggers form validation and prevents submission", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");

    // Clear fields to test client validation
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[placeholder="••••••••••••"]');
    await emailInput.clear();
    await passwordInput.clear();

    // Check HTML5 required constraints
    const isEmailValid = await emailInput.evaluate((el) => /** @type {HTMLInputElement} */ (el).checkValidity());
    expect(isEmailValid).toBe(false);

    await page.getByRole("button", { name: /Enter Studio Admin/i }).click();

    // Still on /admin/login because form prevented submission
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Valid admin login successfully redirects to dashboard", async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");

    await loginAsAdmin(page);

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByText(/Studio Management Hub/i)).toBeVisible({ timeout: 10000 });

    expect(consoleErrors).toEqual([]);
  });

  test("Logout button terminates admin session and redirects to login", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);

    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // If on mobile viewport, open the mobile admin navigation drawer
    const isMobile = (page.viewportSize()?.width || 1280) < 1024;
    if (isMobile) {
      const mobileTrigger = page.locator('button[aria-label="Open Sidebar Menu"]');
      await expect(mobileTrigger).toBeVisible({ timeout: 10000 });
      await mobileTrigger.click();
    }

    // Locate sign out button in visible sidebar/drawer
    const signOutBtn = page.locator('aside').locator('button[aria-label="Sign Out"], button[title="Sign Out"]').locator('visible=true').first();
    await expect(signOutBtn).toBeVisible({ timeout: 10000 });
    await signOutBtn.click();

    // Redirected to login
    await expect(page).toHaveURL(/\/admin\/login/);

    // Accessing dashboard again redirects back to login
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
