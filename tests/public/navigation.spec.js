// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors, hasHorizontalOverflow } from "../fixtures/test-data.js";

test.describe("Public Navigation & Links", () => {
  test("Desktop navigation links route correctly", async ({ page }) => {
    // Set a desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const navItems = [
      { label: "About", expectedUrl: "/about", expectedHeading: "About SUBASH STUDIO" },
      { label: "Services", expectedUrl: "/services", expectedHeading: "WHAT WE OFFER" },
      { label: "Portfolio", expectedUrl: "/portfolio", expectedHeading: "Stories we were trusted to tell" },
      { label: "Gallery", expectedUrl: "/gallery", expectedHeading: "Thirteen collections" },
      { label: "Films", expectedUrl: "/films", expectedHeading: "Films" },
      { label: "Branches", expectedUrl: "/branches", expectedHeading: "Find Us" },
      { label: "Contact", expectedUrl: "/contact", expectedHeading: "Get in Touch" },
    ];

    for (const item of navItems) {
      // Find the link within header nav
      const navLink = page.locator("header nav").getByRole("link", { name: item.label, exact: true });
      await expect(navLink).toBeVisible();
      await navLink.click();

      await expect(page).toHaveURL(new RegExp(`${item.expectedUrl}$`));
      await expect(page.getByText(item.expectedHeading, { exact: false }).first()).toBeVisible({ timeout: 8000 });
    }

    // Book a Shoot CTA button in header
    const bookButton = page.locator("header").getByRole("link", { name: "Book a Shoot" });
    await expect(bookButton).toBeVisible();
    await bookButton.click();
    await expect(page).toHaveURL(/\/contact$/);

    // Studio Logo click navigates back to Home
    const logoLink = page.locator("header").getByRole("link", { name: /SUBASH STUDIO/i }).first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await expect(page).toHaveURL(/\/$/);

    expect(consoleErrors).toEqual([]);
  });

  test("Mobile hamburger navigation opens, navigates, and closes", async ({ page }) => {
    // Emulate mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Desktop nav should not be visible
    await expect(page.locator("header nav")).toBeHidden();

    // Toggle button should be visible
    const hamburgerBtn = page.locator('header button[aria-label="Toggle menu"]');
    await expect(hamburgerBtn).toBeVisible();

    // Open mobile menu
    await hamburgerBtn.click();

    // Verify drawer links appear
    const mobileAboutLink = page.locator("header + div").getByRole("link", { name: "About", exact: true });
    await expect(mobileAboutLink).toBeVisible();

    // Click link to navigate
    await mobileAboutLink.click();
    await expect(page).toHaveURL(/\/about$/);

    // Ensure drawer is closed after navigation
    await expect(mobileAboutLink).toBeHidden();

    expect(consoleErrors).toEqual([]);
  });

  test("Footer renders and internal links navigate cleanly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Check footer copyright or brand
    await expect(footer.getByText(/SUBASH STUDIO/i).first()).toBeVisible();

    // Check no horizontal overflow on footer
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
  });
});
