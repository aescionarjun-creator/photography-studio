// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors, hasHorizontalOverflow, verifyImagesLoaded } from "../fixtures/test-data.js";

test.describe("Phase 2: Public Routes Quality & Rendering", () => {
  const publicRoutes = [
    { path: "/", name: "Home", headingText: "Subash" },
    { path: "/about", name: "About", headingText: "About SUBASH STUDIO" },
    { path: "/services", name: "Services", headingText: "WHAT WE OFFER" },
    { path: "/portfolio", name: "Portfolio", headingText: "Stories we were trusted to tell" },
    { path: "/gallery", name: "Gallery", headingText: "Thirteen collections" },
    { path: "/films", name: "Films", headingText: "Films" },
    { path: "/branches", name: "Branches", headingText: "Find Us" },
    { path: "/contact", name: "Contact", headingText: "Get in Touch" },
  ];

  for (const route of publicRoutes) {
    test(`Route ${route.path} (${route.name}) loads cleanly without errors`, async ({ page }) => {
      const consoleErrors = captureConsoleErrors(page);

      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      await page.waitForLoadState("domcontentloaded");

      // Verify main content is visible
      // Verify main content heading is visible
      const headingLocator = page.getByRole("heading", { name: route.headingText, exact: false }).first();
      const contentLocator = page.locator("main, section").getByText(route.headingText, { exact: false }).first();
      await expect(headingLocator.or(contentLocator).first()).toBeVisible({ timeout: 10000 });

      // Verify no horizontal overflow
      const overflow = await hasHorizontalOverflow(page);
      expect(overflow, `Horizontal overflow detected on ${route.path}`).toBe(false);

      // Verify images load cleanly (identifies broken static image references)
      const imgCheck = await verifyImagesLoaded(page);
      expect(imgCheck.brokenCount, `Broken images on ${route.path}: ${imgCheck.brokenSources.join(", ")}`).toBe(0);

      // Verify no critical console errors
      expect(consoleErrors, `Console errors encountered on ${route.path}`).toEqual([]);
    });
  }

  test("Homepage Hero 1:1 Aspect Ratio is preserved", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heroImg = page.locator('img[alt="SUBASH STUDIO storefront"]');
    await expect(heroImg).toBeVisible();

    const box = await heroImg.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const ratio = box.width / box.height;
      expect(Math.abs(ratio - 1)).toBeLessThan(0.05);
    }
  });

  test("Homepage Why Choose Us section is prominent and correctly positioned", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Section title
    const heading = page.getByRole("heading", { name: /More Than Photographs/i });
    await expect(heading).toBeVisible();

    // 4 Benefit cards
    await expect(page.getByText("Years of Experience")).toBeVisible();
    await expect(page.getByText("Storytelling Approach")).toBeVisible();
    await expect(page.getByText("Premium Quality")).toBeVisible();
    await expect(page.getByText("Personalized Experience")).toBeVisible();
  });
});
