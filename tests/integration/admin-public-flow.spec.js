// @ts-check
import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import { loginAsAdmin } from "../fixtures/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testImagePath = path.resolve(__dirname, "../fixtures/test-image.png");

test.describe("Phase 7: Admin ↔ Public Real-Time Integration Flow", () => {
  test("Admin adds a service package → public /services reflects new package (Same BrowserContext)", async ({ browser }) => {
    const timestamp = Date.now();
    const serviceName = `PW_TEST_SRV_INT_${timestamp}`;

    // 1. Create single BrowserContext shared between admin & public
    const context = await browser.newContext();
    const adminPage = await context.newPage();

    await loginAsAdmin(adminPage);
    await adminPage.goto("/admin/services");
    await adminPage.waitForLoadState("domcontentloaded");

    await adminPage.getByRole("button", { name: "Add Service" }).first().click();
    await expect(adminPage.getByRole("heading", { name: "Add Studio Package" })).toBeVisible();

    await adminPage.locator('input[placeholder*="Wedding Photography"]').fill(serviceName);
    await adminPage.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(adminPage.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await adminPage.locator('input[placeholder*="1,20,000"]').fill("₹85,000");
    await adminPage.locator('input[placeholder*="Brief 1-sentence"]').fill("Integration flow test service package.");

    await adminPage.locator("form").getByRole("button", { name: "Add Service" }).click();
    await expect(adminPage.locator("h3").filter({ hasText: serviceName })).toBeVisible({ timeout: 8000 });

    // 2. Open public page in the SAME context
    const publicPage = await context.newPage();
    await publicPage.goto("/services");
    await publicPage.waitForLoadState("domcontentloaded");

    // 3. Verify newly created service appears on public page
    await expect(publicPage.getByText(serviceName).first()).toBeVisible({ timeout: 8000 });

    await context.close();
  });

  test("Admin adds a gallery photo → public /gallery displays photo (Same BrowserContext)", async ({ browser }) => {
    const timestamp = Date.now();
    const galleryTitle = `PW_TEST_GAL_INT_${timestamp}`;

    const context = await browser.newContext();
    const adminPage = await context.newPage();

    await loginAsAdmin(adminPage);
    await adminPage.goto("/admin/gallery");
    await adminPage.waitForLoadState("domcontentloaded");

    await adminPage.getByRole("button", { name: /Upload Image/i }).click();
    await expect(adminPage.getByRole("heading", { name: /Upload High-Res Photo/i })).toBeVisible();

    await adminPage.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(adminPage.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await adminPage.locator('input[placeholder*="Royal Muhurtham"]').fill(galleryTitle);
    await adminPage.locator("select").first().selectOption("Wedding");

    await adminPage.getByRole("button", { name: /Publish Photo/i }).click();
    await expect(adminPage.getByRole("heading", { name: /Upload High-Res Photo/i })).toBeHidden();
    await expect(adminPage.getByText(galleryTitle).first()).toBeVisible({ timeout: 8000 });

    // Open public gallery in the SAME context
    const publicPage = await context.newPage();
    await publicPage.goto("/gallery");
    await publicPage.waitForLoadState("domcontentloaded");

    await expect(publicPage.getByAltText(new RegExp(galleryTitle)).first()).toBeVisible({ timeout: 8000 });

    await context.close();
  });

  test("Admin creates a portfolio story → public /portfolio displays story (Same BrowserContext)", async ({ browser }) => {
    const timestamp = Date.now();
    const portfolioTitle = `PW_TEST_PORT_INT_${timestamp}`;

    const context = await browser.newContext();
    const adminPage = await context.newPage();

    await loginAsAdmin(adminPage);
    await adminPage.goto("/admin/portfolio");
    await adminPage.waitForLoadState("domcontentloaded");

    await adminPage.getByRole("button", { name: "New Project" }).click();
    await expect(adminPage.getByRole("heading", { name: "Create Showcase Project" })).toBeVisible();

    await adminPage.locator('input[placeholder*="Ananya & Siddharth"]').fill(portfolioTitle);
    await adminPage.locator('input[placeholder*="Grand Chettinad"]').fill("Integration Flow Story");

    await adminPage.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(adminPage.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await adminPage.getByRole("button", { name: "Publish Project" }).click();
    await expect(adminPage.getByText(portfolioTitle).first()).toBeVisible({ timeout: 8000 });

    // Open public portfolio in the SAME context
    const publicPage = await context.newPage();
    await publicPage.goto("/portfolio");
    await publicPage.waitForLoadState("domcontentloaded");

    await expect(publicPage.getByText(portfolioTitle).first()).toBeVisible({ timeout: 8000 });

    await context.close();
  });

  test("Admin updates homepage CMS content → public / reflects updated headline (Same BrowserContext)", async ({ browser }) => {
    const timestamp = Date.now();
    const updatedHeading = `PW_TEST_HERO_CMS_${timestamp}`;

    const context = await browser.newContext();
    const adminPage = await context.newPage();

    await loginAsAdmin(adminPage);
    await adminPage.goto("/admin/content");
    await adminPage.waitForLoadState("domcontentloaded");

    const heroInput = adminPage.locator('label:has-text("Hero Main Headline") + input');
    await heroInput.clear();
    await heroInput.fill(updatedHeading);

    await adminPage.getByRole("button", { name: "Save Homepage" }).click();
    await expect(adminPage.getByText(/Homepage content saved|saved/i).first()).toBeVisible({ timeout: 5000 });

    // Open public homepage in the SAME context
    const publicPage = await context.newPage();
    await publicPage.goto("/");
    await publicPage.waitForLoadState("domcontentloaded");

    await expect(publicPage.getByText(updatedHeading)).toBeVisible({ timeout: 8000 });

    await context.close();
  });

  test("Public contact enquiry submission → admin /admin/enquiries displays enquiry (Same BrowserContext)", async ({ browser }) => {
    const timestamp = Date.now();
    const testClientName = `PW_TEST_CONTACT_INT_${timestamp}`;
    const testNotes = "Looking for complete 3-day traditional wedding coverage.";

    const context = await browser.newContext();
    const publicPage = await context.newPage();

    // 1. Submit enquiry on public page
    await publicPage.goto("/contact");
    await publicPage.waitForLoadState("domcontentloaded");

    await publicPage.locator('input[name="name"]').fill(testClientName);
    await publicPage.locator('input[name="phone"]').fill("+91 91234 56789");
    await publicPage.locator('input[name="email"]').fill("integration.flow@subashstudio.test");
    await publicPage.locator('textarea[name="notes"]').fill(testNotes);

    await publicPage.getByRole("button", { name: /Send Enquiry/i }).click();
    await expect(publicPage.getByText("Message sent")).toBeVisible({ timeout: 5000 });

    // 2. Open admin enquiries in the SAME context
    const adminPage = await context.newPage();
    await loginAsAdmin(adminPage);

    await adminPage.goto("/admin/enquiries");
    await adminPage.waitForLoadState("domcontentloaded");

    await expect(adminPage.getByText(testClientName).first()).toBeVisible({ timeout: 8000 });

    await context.close();
  });

  test("Architecture Verification: localStorage data is not shared between independent browser contexts", async ({ browser }) => {
    // Context A (isolated)
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto("/");
    await pageA.evaluate(() => {
      localStorage.setItem("subash_studio_db_v4_test_probe", "context_A_isolated_value");
    });

    // Context B (isolated)
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto("/");
    const valueInContextB = await pageB.evaluate(() => {
      return localStorage.getItem("subash_studio_db_v4_test_probe");
    });

    // Expected behavior under localStorage architecture: independent browser contexts do not share storage
    expect(valueInContextB).toBeNull();

    await contextA.close();
    await contextB.close();
  });
});
