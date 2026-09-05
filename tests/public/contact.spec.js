// @ts-check
import { test, expect } from "@playwright/test";
import { captureConsoleErrors, hasHorizontalOverflow } from "../fixtures/test-data.js";

test.describe("Public Contact Form & Submission", () => {
  test("Contact form renders all required fields and contact details", async ({ page }) => {
    const consoleErrors = captureConsoleErrors(page);

    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");

    // Headings
    await expect(page.getByText("Get in Touch")).toBeVisible();
    await expect(page.getByText("Let's talk about your story.")).toBeVisible();

    // Form Fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('select[name="service"]')).toBeVisible();
    await expect(page.locator('input[name="date"]')).toBeVisible();
    await expect(page.locator('textarea[name="notes"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Enquiry/i })).toBeVisible();

    // Direct reach card
    await expect(page.getByText("Reach Us Directly")).toBeVisible();
    await expect(page.getByText(/Kalladaikurichi|Tirunelveli/i).first()).toBeVisible();

    // Google Maps iframe exists
    const mapIframe = page.locator('iframe[title="SUBASH STUDIO location"]');
    await expect(mapIframe).toBeVisible();

    // Check no horizontal overflow
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);

    expect(consoleErrors).toEqual([]);
  });

  test("Submitting valid enquiry updates UI to success state and persists in local context", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");

    const testName = `PW_TEST_ENQUIRY_${Date.now()}`;
    const testPhone = "+91 98765 43210";
    const testEmail = "test.enquiry@subashstudio.test";
    const testNotes = "This is a deterministic automated E2E test enquiry.";

    // Fill form
    await page.locator('input[name="name"]').fill(testName);
    await page.locator('input[name="phone"]').fill(testPhone);
    await page.locator('input[name="email"]').fill(testEmail);

    // Select first available service option if available
    const serviceSelect = page.locator('select[name="service"]');
    const options = await serviceSelect.locator("option").all();
    if (options.length > 1) {
      await serviceSelect.selectOption({ index: 1 });
    }

    await page.locator('input[name="date"]').fill("2026-10-15");
    await page.locator('textarea[name="notes"]').fill(testNotes);

    // Submit form
    await page.getByRole("button", { name: /Send Enquiry/i }).click();

    // Verify success message appears
    await expect(page.getByText("Message sent")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Thank you — a member of the SUBASH STUDIO team will reach out/i)).toBeVisible();

    // Verify localStorage contains the newly added enquiry
    const storedEnquiries = await page.evaluate(() => {
      const data = localStorage.getItem("subash_studio_db_v4_enquiries");
      return data ? JSON.parse(data) : [];
    });

    const created = storedEnquiries.find((e) => e.name === testName);
    expect(created, "Created enquiry was not found in localStorage").toBeDefined();
    expect(created?.phone).toBe(testPhone);
  });
});
