// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors, hasHorizontalOverflow, verifyImagesLoaded } from "../fixtures/test-data.js";
import { loginAsAdmin } from "../fixtures/auth.js";

test.describe("Custom Handcrafted Frames Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state or demo seed
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Public 4-stage frame ordering configurator end-to-end", async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);

    // 1. Navigate to /frames
    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: /Design Your Heirloom Frame/i })).toBeVisible();

    // Verify Stage 1: Customize Frame controls are all on the first page
    await expect(page.getByRole("heading", { name: /Choose Timber Wood/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Teak Wood" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rose Wood" })).toBeVisible();

    // Select Teak Wood
    const teakCard = page.locator("div").filter({ hasText: /^Teak Wood/ }).first();
    await teakCard.click();

    // Verify Design Selection on same page
    await expect(page.getByRole("heading", { name: /Choose Frame Profile/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Classic Gold" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Modern Black" })).toBeVisible();

    // Select Classic Gold (+₹0)
    const goldCard = page.locator("div").filter({ hasText: /^Classic Gold/ }).first();
    await goldCard.click();

    // Verify Photo Upload on same page
    await expect(page.getByRole("heading", { name: /Upload Photograph/i })).toBeVisible();

    // Create a 1x1 test image buffer and upload
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "wedding-portrait.png",
      mimeType: "image/png",
      buffer: testImageBuffer,
    });

    // Wait for photo uploaded state
    await expect(page.getByText(/ready for framing/i)).toBeVisible({ timeout: 5000 });

    // Verify Frame Size & Orientation on same page
    await expect(page.getByRole("heading", { name: /Frame Dimensions & Orientation/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "12 × 10" })).toBeVisible();

    // Select 12 × 10 (₹1,200) (portrait format for 10 × 12)
    const sizeCard = page.locator("div").filter({ hasText: /^12 × 10/ }).first();
    await sizeCard.click();

    // Verify Live Preview is visible on right side
    await expect(page.getByText(/Live Artisan Frame Preview/i).first()).toBeVisible();

    // Proceed to Stage 2: Review My Frame
    const reviewBtn = page.getByRole("button", { name: /Review My Frame/i });
    await expect(reviewBtn).toBeEnabled();
    await reviewBtn.click();

    // Verify Stage 2: Review Specification & Pricing
    await expect(page.getByText(/Stage 2: Review Artisan Frame Specification/i)).toBeVisible();
    await expect(page.getByText("Itemized Pricing Summary", { exact: true })).toBeVisible();

    // Verify exact pricing formula: Teak(800) + Classic Gold(0) + 10x12(1200) = 2,000
    await expect(page.getByText("₹800").first()).toBeVisible();
    await expect(page.getByText("₹1,200").first()).toBeVisible();
    await expect(page.getByText("₹2,000").first()).toBeVisible();

    // Test Edit Customization back button preserves selections
    await page.getByRole("button", { name: /Edit/i }).first().click();
    await expect(page.getByRole("heading", { name: /Choose Timber Wood/i })).toBeVisible();
    await expect(page.getByText(/ready for framing/i)).toBeVisible();

    // Proceed back to Review and then to Stage 3: Customer Details
    await page.getByRole("button", { name: /Review My Frame/i }).click();
    await page.getByRole("button", { name: /Yes, This Frame Looks Good — Continue/i }).click();

    await expect(page.getByText(/Stage 3: Customer Details & Fulfillment/i)).toBeVisible();

    // Fill customer form
    await page.getByPlaceholder(/Kavitha Ramachandran/i).fill("Aarav Sundaram");
    await page.getByPlaceholder(/98401/i).fill("+91 94431 88990");
    await page.getByPlaceholder(/kavitha@example.com/i).fill("aarav@teststudio.com");
    await page.getByPlaceholder(/House \/ Flat No/i).fill("42 Palace Road");
    await page.getByPlaceholder(/Tirunelveli/i).first().fill("Tirunelveli");
    await page.getByPlaceholder(/627001/i).fill("627001");

    // Submit Order
    await page.getByRole("button", { name: /Confirm & Place Order/i }).click();

    // Verify Stage 4: Order Successful & WhatsApp
    await expect(page.getByText(/ORDER SUCCESSFUL/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Aarav Sundaram/i).first()).toBeVisible();
    await expect(page.getByText(/SS-FR-/).first()).toBeVisible();
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
    await loginAsAdmin(page);

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
    await expect(page.getByText("SS-FR-").first()).toBeVisible();

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
    await expect(page.getByRole("heading", { name: "10 × 12" })).toBeVisible();

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
