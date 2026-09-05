// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../fixtures/auth.js";
import { captureConsoleErrors, hasHorizontalOverflow } from "../fixtures/test-data.js";

test.describe("Admin Routes Quality & Rendering", () => {
  const adminRoutes = [
    { path: "/admin/dashboard", name: "Dashboard", headingMatch: /Executive Dashboard|Studio/i },
    { path: "/admin/bookings", name: "Bookings", headingMatch: /Shoot Bookings|Bookings/i },
    { path: "/admin/enquiries", name: "Enquiries", headingMatch: /Client Enquiries|Enquiries/i },
    { path: "/admin/gallery", name: "Gallery", headingMatch: /Gallery Management/i },
    { path: "/admin/portfolio", name: "Portfolio", headingMatch: /Portfolio/i },
    { path: "/admin/services", name: "Services", headingMatch: /Service Packages|Services/i },
    { path: "/admin/films", name: "Films", headingMatch: /Films|Cinematography/i },
    { path: "/admin/branches", name: "Branches", headingMatch: /Studio Branches|Branches/i },
    { path: "/admin/testimonials", name: "Testimonials", headingMatch: /Client Testimonials|Testimonials/i },
    { path: "/admin/content", name: "Website Content", headingMatch: /Website Content|CMS/i },
    { path: "/admin/settings", name: "Settings", headingMatch: /Settings|Studio Profile/i },
  ];

  test.beforeEach(async ({ page }) => {
    // Authenticate prior to visiting admin pages
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  for (const route of adminRoutes) {
    test(`Admin Route ${route.path} (${route.name}) loads cleanly without errors`, async ({ page }) => {
      const consoleErrors = captureConsoleErrors(page);

      await page.goto(route.path);
      await page.waitForLoadState("domcontentloaded");

      // Verify page URL
      await expect(page).toHaveURL(new RegExp(`${route.path}$`));

      // Verify heading
      await expect(page.locator("h1, h2, h3").filter({ hasText: route.headingMatch }).first()).toBeVisible({ timeout: 10000 });

      // Verify no horizontal overflow in admin layout
      const overflow = await hasHorizontalOverflow(page);
      expect(overflow, `Horizontal overflow detected on ${route.path}`).toBe(false);

      // Verify no critical console errors
      expect(consoleErrors, `Console errors encountered on ${route.path}`).toEqual([]);
    });
  }

  test("Admin sidebar navigation links work smoothly across views", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const isMobile = (page.viewportSize()?.width || 1280) < 1024;
    const openMenuIfMobile = async () => {
      if (isMobile) {
        const mobileTrigger = page.locator('button[aria-label="Open Sidebar Menu"]');
        await expect(mobileTrigger).toBeVisible({ timeout: 10000 });
        await mobileTrigger.click();
      }
    };

    // Click Gallery link from sidebar
    await openMenuIfMobile();
    const galleryLink = page.locator("aside").getByRole("link", { name: "Gallery" }).locator("visible=true").first();
    await expect(galleryLink).toBeVisible({ timeout: 10000 });
    await galleryLink.click();
    await expect(page).toHaveURL(/\/admin\/gallery$/);

    // Click Services link from sidebar
    await openMenuIfMobile();
    const servicesLink = page.locator("aside").getByRole("link", { name: "Services" }).locator("visible=true").first();
    await expect(servicesLink).toBeVisible({ timeout: 10000 });
    await servicesLink.click();
    await expect(page).toHaveURL(/\/admin\/services$/);

    // Click Settings link from sidebar
    await openMenuIfMobile();
    const settingsLink = page.locator("aside").getByRole("link", { name: "Settings" }).locator("visible=true").first();
    await expect(settingsLink).toBeVisible({ timeout: 10000 });
    await settingsLink.click();
    await expect(page).toHaveURL(/\/admin\/settings$/);
  });
});
