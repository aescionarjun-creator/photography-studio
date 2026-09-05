// @ts-check
import { test, expect } from "@playwright/test";
import { injectAdminAuthSession } from "../fixtures/auth.js";

const VIEWPORTS = [
  { name: "375x812 (iPhone SE / Compact)", width: 375, height: 812, expectedCols: 2, isMobile: true },
  { name: "390x844 (iPhone 12/13/14)", width: 390, height: 844, expectedCols: 2, isMobile: true },
  { name: "768x1024 (iPad Portrait)", width: 768, height: 1024, expectedCols: 2, isMobile: true },
  { name: "1024x768 (iPad Landscape / Small Laptop)", width: 1024, height: 768, expectedCols: 3, isMobile: false },
  { name: "1280x800 (WXGA Laptop)", width: 1280, height: 800, expectedCols: 5, isMobile: false },
  { name: "1440x900 (MacBook / Standard Desktop)", width: 1440, height: 900, expectedCols: 5, isMobile: false },
  { name: "1920x1080 (Full HD Desktop)", width: 1920, height: 1080, expectedCols: 5, isMobile: false },
];

const ADMIN_ROUTES = [
  { path: "/admin/dashboard", name: "Dashboard" },
  { path: "/admin/bookings", name: "Bookings" },
  { path: "/admin/enquiries", name: "Enquiries" },
  { path: "/admin/gallery", name: "Gallery" },
  { path: "/admin/portfolio", name: "Portfolio" },
  { path: "/admin/services", name: "Services" },
  { path: "/admin/films", name: "Films" },
  { path: "/admin/branches", name: "Branches" },
  { path: "/admin/testimonials", name: "Testimonials" },
  { path: "/admin/content", name: "Website Content" },
  { path: "/admin/settings", name: "Settings" },
];

test.describe("Admin Panel Responsive & Layout Audit", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport ${vp.name}`, () => {
      // 1. Audit all 11 admin routes for zero horizontal overflow
      for (const route of ADMIN_ROUTES) {
        test(`${route.name} (${route.path}) has zero horizontal page overflow`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await injectAdminAuthSession(page);

          await page.goto(route.path);
          await page.waitForLoadState("domcontentloaded");
          await page.waitForTimeout(150);

          const overflowData = await page.evaluate(() => {
            const doc = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
            const clientWidth = doc.clientWidth;
            return {
              scrollWidth,
              clientWidth,
              diff: scrollWidth - clientWidth,
              hasOverflow: scrollWidth > clientWidth,
            };
          });

          expect(
            overflowData.hasOverflow,
            `Horizontal overflow on ${route.path} at ${vp.name}: scrollWidth=${overflowData.scrollWidth} > clientWidth=${overflowData.clientWidth} (diff: +${overflowData.diff}px)`
          ).toBe(false);
          expect(overflowData.scrollWidth).toBeLessThanOrEqual(overflowData.clientWidth);
        });
      }

      // 2. Dashboard Specific Responsive Validations
      test(`Dashboard responsive components integrity at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await injectAdminAuthSession(page);

        await page.goto("/admin/dashboard");
        await page.waitForLoadState("domcontentloaded");

        // Top Statistics Cards
        const statCards = page.locator("div.grid").first().locator("> div");
        await expect(statCards.first()).toBeVisible();

        // Quick Management Actions Grid Columns Validation
        // Tailwind classes: grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
        const isLg = await page.evaluate(() => window.matchMedia("(min-width: 1024px)").matches);
        const isXl = await page.evaluate(() => window.matchMedia("(min-width: 1280px)").matches);
        const expectedColumns = isXl ? 5 : isLg ? 3 : 2;

        const quickActionsGrid = page.locator("text=Quick Management Actions").locator("..").locator("..").locator("div.grid");
        await expect(quickActionsGrid).toBeVisible();

        const gridColumnCount = await quickActionsGrid.evaluate((el) => {
          const style = window.getComputedStyle(el);
          const gridTemplateColumns = style.gridTemplateColumns;
          return gridTemplateColumns ? gridTemplateColumns.split(" ").length : 0;
        });

        expect(
          gridColumnCount,
          `Quick Actions columns mismatch at ${vp.name} (isLg=${isLg}, isXl=${isXl}): expected ${expectedColumns}, got ${gridColumnCount}`
        ).toBe(expectedColumns);

        // Monthly Shoots tooltips MUST be absolute and NOT participate in document width calculations
        const tooltip = page.locator("div.group > div.absolute").first();
        await expect(tooltip).toBeAttached();
        const tooltipPosition = await tooltip.evaluate((el) => {
          return window.getComputedStyle(el).position;
        });
        expect(tooltipPosition).toBe("absolute");

        // Upcoming Shoots Table Container
        const upcomingTableWrapper = page.locator("div.overflow-x-auto").first();
        await expect(upcomingTableWrapper).toBeVisible();
      });

      // 3. Navigation Drawer & Sidebar Behavior
      test(`Navigation drawer / sidebar behavior at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await injectAdminAuthSession(page);

        await page.goto("/admin/dashboard");
        await page.waitForLoadState("domcontentloaded");

        const mobileMenuBtn = page.locator('header button[aria-label="Open Sidebar Menu"]');
        const desktopSidebar = page.locator("aside.hidden.lg\\:block");
        const isMobileNav = await mobileMenuBtn.isVisible();

        if (isMobileNav) {
          // At mobile widths (< 1024px or when mobile trigger is active)
          await expect(mobileMenuBtn).toBeVisible();
          await expect(desktopSidebar).toBeHidden();

          // Open mobile drawer
          await mobileMenuBtn.click();
          const drawer = page.locator("aside.lg\\:hidden");
          await expect(drawer).toBeVisible();

          // Check drawer navigation links
          const drawerBookingsLink = drawer.getByRole("link", { name: "Bookings" });
          await expect(drawerBookingsLink).toBeVisible();

          // Check Sign Out in drawer
          const drawerSignOut = drawer.locator('button[title="Sign Out"]');
          await expect(drawerSignOut).toBeVisible();

          // Close mobile drawer
          const closeBtn = drawer.locator('button[aria-label="Close sidebar"]');
          await closeBtn.click();
          await expect(drawer).toBeHidden();
        } else {
          // At desktop widths (>= 1024px)
          await expect(desktopSidebar).toBeVisible();
          await expect(mobileMenuBtn).toBeHidden();

          // Desktop sidebar navigation links
          const bookingsLink = desktopSidebar.getByRole("link", { name: "Bookings" });
          await expect(bookingsLink).toBeVisible();

          // Desktop Sign Out button
          const signOutBtn = desktopSidebar.locator('button[title="Sign Out"]');
          await expect(signOutBtn).toBeVisible();
        }
      });
    });
  }

  // 4. Header at 1024x768 Constraint Check
  test("Admin Header fits all controls at 1024x768 without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await injectAdminAuthSession(page);

    await page.goto("/admin/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const header = page.locator("header").first();
    await expect(header).toBeVisible();

    // Check all controls in header
    await expect(header.locator("h1")).toBeVisible();
    await expect(header.locator('input[placeholder="Search..."]')).toBeVisible();
    await expect(header.locator('a[href="/admin/bookings?new=true"]')).toBeVisible();
    await expect(header.locator('a[title="Open Public Website"]')).toBeVisible();
    await expect(header.locator('button[aria-label="View notifications"]')).toBeVisible();

    // Ensure header width <= viewport width
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    if (headerBox) {
      expect(headerBox.width).toBeLessThanOrEqual(1024);
    }
  });
});
