// @ts-check

/**
 * Admin credentials configuration.
 * Prioritizes environment variables to prevent exposing credentials in tests.
 * Falls back to demo defaults established by the local application mock auth.
 */
export const ADMIN_CREDENTIALS = {
  email: process.env.PLAYWRIGHT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@subashstudio.com",
  password: process.env.PLAYWRIGHT_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "subash@2026",
};

/**
 * Perform login as admin via the UI login form.
 * @param {import('@playwright/test').Page} page
 */
export async function loginAsAdmin(page) {
  await page.goto("/admin/login");
  await page.waitForLoadState("domcontentloaded");

  // Fill credentials
  await page.fill('input[type="email"]', ADMIN_CREDENTIALS.email);
  await page.fill('input[type="password"]', ADMIN_CREDENTIALS.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL("**/admin/dashboard", { timeout: 15000 });
}

/**
 * Pre-authenticate a page context by injecting session into localStorage directly.
 * Useful for fast test setup without repeating UI login form interactions.
 * @param {import('@playwright/test').Page} page
 */
export async function injectAdminAuthSession(page) {
  const session = {
    token: "jwt_test_token_" + Date.now(),
    user: {
      name: "Subash Admin",
      email: ADMIN_CREDENTIALS.email,
      role: "Studio Director & Lead Photographer",
      avatar: "/images/admin/profile.png",
    },
  };

  await page.addInitScript((authSession) => {
    window.localStorage.setItem(
      "subash_studio_admin_auth",
      JSON.stringify(authSession)
    );
  }, session);
}
