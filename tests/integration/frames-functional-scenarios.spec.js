// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors } from "../fixtures/test-data.js";

test.describe("Order Frames Specific Functional Scenarios", () => {
  test("Scenario 1: Teak -> Modern Black -> 4x6 Portrait -> Zoom & Crop -> Review -> Back to Customize -> Verify Persisted -> Place Order Home Delivery", async ({
    page,
  }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    // 1. Select Teak Wood
    const teakCard = page.locator("div").filter({ hasText: /^Teak Wood/ }).first();
    await teakCard.click();
    await expect(page.getByText("Selected: Teak Wood")).toBeVisible();

    // 2. Select Modern Black (+₹150)
    const modernBlackCard = page.locator("div").filter({ hasText: /^Modern Black/ }).first();
    await modernBlackCard.click();
    await expect(page.getByText("Selected: Modern Black")).toBeVisible();

    // 3. Upload Photo
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "heirloom-portrait.jpg",
      mimeType: "image/jpeg",
      buffer: testImageBuffer,
    });
    await expect(page.getByText(/heirloom-portrait\.jpg/i)).toBeVisible({ timeout: 5000 });

    // 4. Select 6 × 4 size (portrait display format for 4 × 6) and ensure Portrait orientation
    await page.getByRole("heading", { name: "6 × 4" }).click();

    const portraitBtn = page.getByRole("button", { name: /Portrait \(Vertical\)/i });
    await portraitBtn.click();
    await expect(page.getByText(/Selected: 6 × 4 \(portrait\)/i)).toBeVisible();

    // 5. Test Zoom & Crop controls
    const zoomInBtn = page.locator('button[title="Zoom in"]');
    await zoomInBtn.click();
    await zoomInBtn.click();
    await expect(page.getByText("130%", { exact: true })).toBeVisible();

    // 6. Check live pricing in preview:
    // Teak (800) + Modern Black (150) + 4x6 (600) = 1,550
    await expect(page.getByText("₹1,550").first()).toBeVisible();

    // 7. Proceed to Review
    await page.getByRole("button", { name: /Review My Frame/i }).click();
    await expect(page.getByText(/Stage 2: Review Artisan Frame Specification/i)).toBeVisible();

    // Verify specifications on Review page
    await expect(page.getByText("Teak Wood").first()).toBeVisible();
    await expect(page.getByText("Modern Black").first()).toBeVisible();
    await expect(page.getByText("6 × 4").first()).toBeVisible();
    await expect(page.getByText("₹1,550").first()).toBeVisible();

    // 8. Back to Customize - Verify all selections remain preserved
    await page.getByRole("button", { name: /Edit/i }).first().click();
    await expect(page.getByText("Selected: Teak Wood")).toBeVisible();
    await expect(page.getByText("Selected: Modern Black")).toBeVisible();
    await expect(page.getByText(/Selected: 6 × 4 \(portrait\)/i)).toBeVisible();
    await expect(page.getByText("130%", { exact: true })).toBeVisible();
    await expect(page.getByText("heirloom-portrait.jpg")).toBeVisible();

    // 9. Review again & continue to Details
    await page.getByRole("button", { name: /Review My Frame/i }).click();
    await page.getByRole("button", { name: /Yes, This Frame Looks Good — Continue/i }).click();
    await expect(page.getByText(/Stage 3: Customer Details & Fulfillment/i)).toBeVisible();

    // 10. Home Delivery & Fill Details
    await page.getByPlaceholder(/Kavitha Ramachandran/i).fill("Senthil Nathan");
    await page.getByPlaceholder(/98401/i).fill("+91 98401 55667");
    await page.getByPlaceholder(/kavitha@example.com/i).fill("senthil@subashphoto.com");
    await page.getByPlaceholder(/House \/ Flat No/i).fill("Flat 3A, Heritage Towers, North Car St");
    await page.getByPlaceholder(/Tirunelveli/i).first().fill("Tirunelveli");
    await page.getByPlaceholder(/627001/i).fill("627006");

    // Submit Order
    await page.getByRole("button", { name: /CONFIRM & PLACE ORDER/i }).click();

    // 11. Verify Order Successful
    await expect(page.getByText(/ORDER SUCCESSFUL/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText("Senthil Nathan").first()).toBeVisible();
    await expect(page.getByText("Teak Wood").first()).toBeVisible();
    await expect(page.getByText("Modern Black").first()).toBeVisible();
    await expect(page.getByText("₹1,550").first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("Scenario 2: Walnut -> Classic Gold -> 12x18 Landscape -> Studio Pickup -> Place Order", async ({
    page,
  }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    // 1. Select Walnut Wood
    const walnutCard = page.locator("div").filter({ hasText: /^Walnut Wood/ }).first();
    await walnutCard.click();
    await expect(page.getByText("Selected: Walnut Wood")).toBeVisible();

    // 2. Select Classic Gold
    const classicGoldCard = page.locator("div").filter({ hasText: /^Classic Gold/ }).first();
    await classicGoldCard.click();
    await expect(page.getByText("Selected: Classic Gold")).toBeVisible();

    // 3. Upload Photo
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "family-heritage.jpg",
      mimeType: "image/jpeg",
      buffer: testImageBuffer,
    });
    await expect(page.getByText(/family-heritage\.jpg/i)).toBeVisible({ timeout: 5000 });

    // 4. Select Landscape orientation first
    const landscapeBtn = page.getByRole("button", { name: /Landscape \(Horizontal\)/i });
    await landscapeBtn.click();

    // 5. Select 12 × 18 size (displayed in landscape)
    await page.getByRole("heading", { name: "12 × 18" }).click();
    await expect(page.getByText(/Selected: 12 × 18 \(landscape\)/i)).toBeVisible();

    // 6. Pricing check:
    // Walnut (850) + Classic Gold (0) + 12x18 (1500) = 2,350
    await expect(page.getByText("₹2,350").first()).toBeVisible();

    // 7. Proceed to Review
    await page.getByRole("button", { name: /Review My Frame/i }).click();
    await expect(page.getByText("Walnut Wood").first()).toBeVisible();
    await expect(page.getByText("12 × 18").first()).toBeVisible();
    await expect(page.getByText("₹2,350").first()).toBeVisible();

    // 8. Continue to Details
    await page.getByRole("button", { name: /Yes, This Frame Looks Good — Continue/i }).click();
    await expect(page.getByText(/Stage 3: Customer Details & Fulfillment/i)).toBeVisible();

    // 9. Select Studio Atelier Pickup
    const pickupOption = page.locator("div").filter({ hasText: /^Studio Atelier Pickup/ }).first();
    await pickupOption.click();

    // Fill customer info
    await page.getByPlaceholder(/Kavitha Ramachandran/i).fill("Meera Balaji");
    await page.getByPlaceholder(/98401/i).fill("+91 94432 11223");
    await page.getByPlaceholder(/kavitha@example.com/i).fill("meera.balaji@gmail.com");

    // Select branch
    const branchSelect = page.locator("select");
    await expect(branchSelect).toBeVisible();

    // Submit Order
    await page.getByRole("button", { name: /CONFIRM & PLACE ORDER/i }).click();

    // 10. Verify Order Successful
    await expect(page.getByText(/ORDER SUCCESSFUL/i)).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#root").getByText("Meera Balaji").first()).toBeVisible();
    await expect(page.locator("#root").getByText("Walnut Wood").first()).toBeVisible();
    await expect(page.locator("#root").getByText("Classic Gold").first()).toBeVisible();
    await expect(page.locator("#root").getByText("₹2,350").first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("Scenario 3: Multi-Frame Add to Cart Flow -> Frame 1 + Frame 2 -> Cart Drawer -> Checkout", async ({
    page,
  }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    // Verify top badge is removed
    await expect(page.getByText("Atelier Handcrafted Framing")).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "Design Your Heirloom Frame" })).toBeVisible();

    // Frame 1: Teak + Modern Black + 6x4 + Photo
    const teakCard = page.locator("div").filter({ hasText: /^Teak Wood/ }).first();
    await teakCard.click();

    const modernBlackCard = page.locator("div").filter({ hasText: /^Modern Black/ }).first();
    await modernBlackCard.click();

    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "first-portrait.jpg",
      mimeType: "image/jpeg",
      buffer: testImageBuffer,
    });
    await expect(page.getByText(/first-portrait\.jpg/i)).toBeVisible({ timeout: 5000 });

    await page.getByRole("heading", { name: "6 × 4" }).click();

    // Click "ADD TO CART"
    const addToCartBtn = page.getByRole("button", { name: /ADD TO CART/i });
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    // Cart drawer should open showing Frame 1
    const cartDrawer = page.locator("aside");
    await expect(cartDrawer.getByText("Your Framing Cart")).toBeVisible();
    await expect(cartDrawer.getByText("1 Frame configured")).toBeVisible();
    await expect(cartDrawer.getByText("Teak Wood")).toBeVisible();

    // Click "Customize Another Frame" from drawer
    await cartDrawer.getByRole("button", { name: /Customize Another Frame/i }).click();

    // Frame 2: Rose Wood + Minimal White + 10x8 (8x10 in portrait) + Photo
    const roseCard = page.locator("div").filter({ hasText: /^Rose Wood/ }).first();
    await roseCard.click();

    const floatCard = page.locator("div").filter({ hasText: /^Minimal White/ }).first();
    await floatCard.click();

    await page.locator('input[type="file"]').setInputFiles({
      name: "second-portrait.jpg",
      mimeType: "image/jpeg",
      buffer: testImageBuffer,
    });
    await expect(page.getByText(/second-portrait\.jpg/i)).toBeVisible({ timeout: 5000 });

    await page.getByRole("heading", { name: "10 × 8" }).click();

    // Add Frame 2 to Cart
    await page.getByRole("button", { name: /ADD TO CART/i }).click();

    // Verify Cart Drawer now has 2 frames
    await expect(cartDrawer.getByText("Your Framing Cart")).toBeVisible();
    await expect(cartDrawer.getByText("2 Frames configured")).toBeVisible();
    await expect(cartDrawer.getByText("Rose Wood")).toBeVisible();

    // Proceed to Checkout from Cart Drawer
    await cartDrawer.getByRole("button", { name: /Proceed to Checkout/i }).click();

    // Verify Stage 3 Customer Details displays both items in summary
    await expect(page.getByText(/Stage 3: Customer Details & Fulfillment/i)).toBeVisible();
    await expect(page.getByText(/Order Summary \(2 Frames\)/i)).toBeVisible();
    await expect(page.locator("#root").getByText("Teak Wood").first()).toBeVisible();
    await expect(page.locator("#root").getByText("Rose Wood").first()).toBeVisible();

    // Fill customer form
    await page.getByPlaceholder(/Kavitha Ramachandran/i).fill("Ananya Sundaram");
    await page.getByPlaceholder(/98401/i).fill("+91 98401 99887");
    await page.getByPlaceholder(/kavitha@example.com/i).fill("ananya@studio.com");
    await page.getByPlaceholder(/House \/ Flat No/i).fill("14 Riverside Villa");
    await page.getByPlaceholder(/Tirunelveli/i).first().fill("Tirunelveli");
    await page.getByPlaceholder(/627001/i).fill("627002");

    // Submit Order
    await page.getByRole("button", { name: /CONFIRM & PLACE ORDER/i }).click();

    // Verify Order Successful with 2 items
    await expect(page.getByText(/ORDER SUCCESSFUL/i)).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#root").getByText("Ananya Sundaram").first()).toBeVisible();
    await expect(page.locator("#root").getByText(/Ordered Frames \(2 items\)/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /CONFIRM ORDER ON WHATSAPP/i })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("Scenario 4: Verify Button-Based Directional Pan Control & Reordered Customizer Flow (01-06)", async ({
    page,
  }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    // 1. Verify Step Numbering & Section Order
    const section01 = page.locator("div").filter({ hasText: /^01Choose Timber Wood/ }).first();
    const section02 = page.locator("div").filter({ hasText: /^02Choose Frame Profile/ }).first();
    const section03 = page.locator("div").filter({ hasText: /^03Upload Photograph/ }).first();
    const section04 = page.locator("div").filter({ hasText: /^04Fine Adjust & Crop/ }).first();
    const section05 = page.locator("div").filter({ hasText: /^05Frame Dimensions/ }).first();
    const section06 = page.locator("div").filter({ hasText: /^06Quantity & Add to Cart/ }).first();

    await expect(section01).toBeVisible();
    await expect(section02).toBeVisible();
    await expect(section03).toBeVisible();
    await expect(section04).toBeVisible();
    await expect(section05).toBeVisible();
    await expect(section06).toBeVisible();

    // 2. Before Photo Upload: Verify Section 04 is visible by default but disabled
    await expect(
      page.getByText(/Upload a photo to enable adjustment controls/i)
    ).toBeVisible();
    const upBtn = page.locator('button[aria-label="Nudge Photo Up"]');
    await expect(upBtn).toBeDisabled();

    // Confirm NO joystick elements exist in DOM
    const joystick = page.locator('[data-testid="joystick-base"], .joystick-knob');
    expect(await joystick.count()).toBe(0);

    // 3. Upload photo
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    await page.locator('input[type="file"]').setInputFiles({
      name: "directional-test-photo.jpg",
      mimeType: "image/jpeg",
      buffer: testImageBuffer,
    });
    await expect(page.getByText(/directional-test-photo\.jpg/i)).toBeVisible({ timeout: 5000 });

    // 4. After Photo Upload: Section 04 auto-enables immediately
    await expect(
      page.getByText(/Upload a photo to enable adjustment controls/i)
    ).not.toBeVisible();
    await expect(upBtn).toBeEnabled();

    // 5. Test Button-Based Directional Pan and Preview Sync
    const downBtn = page.locator('button[aria-label="Nudge Photo Down"]');
    const leftBtn = page.locator('button[aria-label="Nudge Photo Left"]');
    const rightBtn = page.locator('button[aria-label="Nudge Photo Right"]');
    const centerBtn = page.locator('button[aria-label="Recenter Photo"]');

    // Click Up: Y should be -15px
    await upBtn.click();
    await expect(page.getByText(/Y: -15px/)).toBeVisible();

    // Click Down twice: Y should be +15px
    await downBtn.click();
    await downBtn.click();
    await expect(page.getByText(/Y: \+15px/)).toBeVisible();

    // Click Left: X should be -15px
    await leftBtn.click();
    await expect(page.getByText(/X: -15px/)).toBeVisible();

    // Click Right twice: X should be +15px
    await rightBtn.click();
    await rightBtn.click();
    await expect(page.getByText(/X: \+15px/)).toBeVisible();

    // Verify live preview transform receives translate(15px, 15px)
    const previewImgContainer = page.locator("img[alt*='directional-test-photo']").locator("..");
    await expect(previewImgContainer).toHaveCSS(
      "transform",
      /matrix\(.*,\s*15,\s*15\)/
    );

    // Click Center/Recenter: should return to 0,0
    await centerBtn.click();
    await expect(page.getByText(/X: 0px • Y: 0px/)).toBeVisible();
    await expect(previewImgContainer).toHaveCSS(
      "transform",
      /matrix\(.*,\s*0,\s*0\)/
    );

    expect(consoleErrors).toEqual([]);
  });
});
