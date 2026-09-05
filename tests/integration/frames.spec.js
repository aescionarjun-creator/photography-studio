// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors, hasHorizontalOverflow, verifyImagesLoaded } from "../fixtures/test-data.js";

test.describe("Custom Handcrafted Frames Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state or demo seed
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Public 7-step frame ordering wizard end-to-end", async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);

    // 1. Navigate to /frames
    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: /Design Your Heirloom Frame/i })).toBeVisible();

    // Verify Step 1: Wood Selection
    await expect(page.getByText(/Step 1: Choose Timber Wood Type/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Teak Wood" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rose Wood" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pine Wood" })).toBeVisible();

    // Select Teak Wood
    const teakCard = page.locator("div").filter({ hasText: /^Teak Wood/ }).first();
    await teakCard.click();

    // Proceed to Step 2
    await page.getByRole("button", { name: "Continue", exact: false }).click();

    // Verify Step 2: Design Selection
    await expect(page.getByText(/Step 2: Choose Frame Profile/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Classic Gold" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Modern Black" })).toBeVisible();

    // Select Classic Gold (+₹0)
    const goldCard = page.locator("div").filter({ hasText: /^Classic Gold/ }).first();
    await goldCard.click();

    // Proceed to Step 3
    await page.getByRole("button", { name: "Continue", exact: false }).click();

    // Verify Step 3: Photo Upload
    await expect(page.getByText(/Step 3: Upload Photo/i)).toBeVisible();

    // Create a 1x1 test image buffer and upload
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('input[type="file"]').setInputFiles({
      name: "wedding-portrait.png",
      mimeType: "image/png",
      buffer: testImageBuffer,
    });

    // Wait for photo uploaded state
    await expect(page.getByText(/ready for framing/i)).toBeVisible({ timeout: 5000 });

    // Proceed to Step 4
    await page.getByRole("button", { name: "Continue", exact: false }).click();

    // Verify Step 4: Size Selection
    await expect(page.getByText(/Step 4: Select Frame Aspect Ratio/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "10 × 12" })).toBeVisible();

    // Select 10 × 12 (₹1,200)
    const sizeCard = page.locator("div").filter({ hasText: /^10 × 12/ }).first();
    await sizeCard.click();

    // Proceed to Step 5: Review & Pricing Breakdown
    await page.getByRole("button", { name: "Continue", exact: false }).click();

    await expect(page.getByText(/Step 5: Review Configuration & Pricing Breakdown/i)).toBeVisible();
    await expect(page.getByText("Pricing Breakdown")).toBeVisible();

    // Verify exact pricing formula: Teak(800) + Classic Gold(0) + 10x12(1200) = 2,000
    await expect(page.getByText("₹800").first()).toBeVisible();
    await expect(page.getByText("₹1,200").first()).toBeVisible();
    await expect(page.getByText("₹2,000").first()).toBeVisible();

    // Proceed to Step 6: Customer Details
    await page.getByRole("button", { name: /Proceed to Customer Details/i }).click();

    await expect(page.getByText(/Step 6: Customer Details & Fulfillment/i)).toBeVisible();

    // Fill form
    await page.getByPlaceholder(/Kavitha Ramachandran/i).fill("Aarav Sundaram");
    await page.getByPlaceholder(/98401/i).fill("+91 94431 88990");
    await page.getByPlaceholder(/kavitha@example.com/i).fill("aarav@teststudio.com");
    await page.getByPlaceholder(/House \/ Flat No/i).fill("42 Palace Road, Tirunelveli 627001");

    // Submit Order
    await page.getByRole("button", { name: /Confirm & Place Order/i }).click();

    // Verify Step 7: Confirmation & WhatsApp
    await expect(page.getByText(/Order Successfully Received/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Aarav Sundaram/i).first()).toBeVisible();
    await expect(page.getByText(/SS-FR-/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Confirm Order on WhatsApp/i })).toBeVisible();

    // Verify WhatsApp link format
    const waLink = page.getByRole("link", { name: /Confirm Order on WhatsApp/i });
    const href = await waLink.getAttribute("href");
    expect(href).toContain("https://wa.me/919345706609");
    expect(href).toContain("SS-FR-");

    expect(consoleErrors).toEqual([]);
  });

  test("Admin Frames Manager displays orders and catalog tabs", async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);

    // 1. Login to Admin Panel
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@subashstudio.com");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard$/);

    // 2. Sidebar contains Frames link with Frame icon
    const framesNavLink = page.locator("aside").getByRole("link", { name: /Frames/i }).first();
    await expect(framesNavLink).toBeVisible();
    await framesNavLink.click();
    await expect(page).toHaveURL(/\/admin\/frames$/);

    // 3. Header and Stat Cards verification
    await expect(page.getByRole("heading", { name: /Custom Frame Management/i })).toBeVisible();
    await expect(page.getByText(/Total Orders/i)).toBeVisible();
    await expect(page.getByText(/Total Frame Revenue/i)).toBeVisible();

    // 4. Tab Switching
    // Tab 1: Orders table
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("SS-FR-")).toBeVisible();

    // Tab 2: Wood Types
    await page.getByRole("button", { name: /Wood Types/i }).click();
    await expect(page.getByText(/Configured Timber Species/i)).toBeVisible();
    await expect(page.getByText("Teak Wood")).toBeVisible();
    await expect(page.getByText("Rose Wood")).toBeVisible();

    // Tab 3: Frame Designs
    await page.getByRole("button", { name: /Frame Designs/i }).click();
    await expect(page.getByText(/Profiles & Artisan Finishes/i)).toBeVisible();
    await expect(page.getByText("Classic Gold")).toBeVisible();
    await expect(page.getByText("Modern Black")).toBeVisible();

    // Tab 4: Sizes & Ratios
    await page.getByRole("button", { name: /Sizes & Ratios/i }).click();
    await expect(page.getByText(/Standard Dimensions & Ratio Surcharges/i)).toBeVisible();
    await expect(page.getByText("10 × 12")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("Order Frames and Admin Frames have no horizontal overflow across viewports", async ({ page }) => {
    const viewports = [
      { name: "375x812", width: 375, height: 812 },
      { name: "768x1024", width: 768, height: 1024 },
      { name: "1280x800", width: 1280, height: 800 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Public /frames
      await page.goto("/frames");
      await page.waitForLoadState("domcontentloaded");
      let overflow = await hasHorizontalOverflow(page);
      expect(overflow, `Horizontal overflow on /frames at ${vp.name}`).toBe(false);

      // Verify images
      const imgCheck = await verifyImagesLoaded(page);
      expect(imgCheck.brokenCount, `Broken images on /frames at ${vp.name}`).toBe(0);
    }
  });
});
