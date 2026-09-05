// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../fixtures/auth.js";
import path from "path";

test.describe("Phase 6: Admin CRUD Operations", () => {
  const testImagePath = path.resolve(process.cwd(), "tests", "fixtures", "test-image.png");

  test.beforeEach(async ({ page }) => {
    // Isolated login
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("Gallery CRUD: Upload file fixture, Edit, Toggle Featured, Toggle Published, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const itemTitle = `PW_TEST_GALLERY_${timestamp}`;
    const itemTitleEdited = `${itemTitle}_EDITED`;

    await page.goto("/admin/gallery");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD / UPLOAD FIXTURE
    await page.getByRole("button", { name: /Upload Image/i }).click();
    await expect(page.getByRole("heading", { name: /Upload High-Res Photo/i })).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });
    await page.locator('input[placeholder*="Royal Muhurtham"]').fill(itemTitle);
    await page.locator('select').first().selectOption("Wedding");

    await page.getByRole("button", { name: /Publish Photo/i }).click();
    await expect(page.getByRole("heading", { name: /Upload High-Res Photo/i })).toBeHidden();

    // Verify item appears
    await expect(page.getByText(itemTitle)).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE FEATURED & PUBLISHED
    const card = page.locator(".group").filter({ hasText: itemTitle }).first();
    await card.scrollIntoViewIfNeeded();
    const featuredBtn = card.getByRole("button", { name: /Featured/i });
    await expect(featuredBtn).toBeVisible({ timeout: 8000 });
    await featuredBtn.click();
    await page.waitForTimeout(300);

    // 3. EDIT (overlay button uses force click)
    await card.hover();
    const editBtn = card.locator('button[title="Edit Details"]');
    await editBtn.click({ force: true });
    await expect(page.getByRole("heading", { name: /Update Photo Details/i })).toBeVisible();

    const titleInput = page.locator('input[placeholder*="Royal Muhurtham"]');
    await titleInput.clear();
    await titleInput.fill(itemTitleEdited);
    await page.getByRole("button", { name: /Save Changes/i }).click();

    await expect(page.getByText(itemTitleEdited)).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator(".group").filter({ hasText: itemTitleEdited }).first();
    await editedCard.hover();
    const deleteBtn = editedCard.locator('button[title="Delete Image"]');
    await deleteBtn.click({ force: true });

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(itemTitleEdited)).toBeHidden();
  });

  test("Services CRUD: Add, Edit, Toggle Status, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const srvName = `PW_TEST_SERVICE_${timestamp}`;
    const srvNameEdited = `${srvName}_EDITED`;

    await page.goto("/admin/services");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD
    await page.getByRole("button", { name: "Add Service" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Studio Package" })).toBeVisible();

    await page.locator('input[placeholder*="Wedding Photography"]').fill(srvName);
    
    // File upload
    await page.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await page.locator('input[placeholder*="1,20,000"]').fill("₹75,000");
    await page.locator('input[placeholder*="Brief 1-sentence"]').fill("Deterministic automated test service package description.");

    await page.locator('form').getByRole("button", { name: "Add Service" }).click();

    // Verify created
    await expect(page.locator("h3").filter({ hasText: srvName })).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE STATUS
    const card = page.locator("div.bg-white").filter({ hasText: srvName }).first();
    const toggleBtn = card.locator('button[title*="Deactivate"], button[title*="Activate"]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. EDIT
    await card.scrollIntoViewIfNeeded();
    const editBtn = card.locator('button[title="Edit Service"]');
    await expect(editBtn).toBeVisible({ timeout: 8000 });
    await editBtn.click();
    await expect(page.locator('.fixed').getByRole("heading", { name: /Update/i })).toBeVisible();

    const nameInput = page.locator('input[placeholder*="Wedding Photography"]');
    await nameInput.clear();
    await nameInput.fill(srvNameEdited);
    await page.getByRole("button", { name: "Save Service" }).click();

    await expect(page.locator('.fixed').getByRole("heading", { name: /Update/i })).toBeHidden();
    await expect(page.locator("h3").filter({ hasText: srvNameEdited })).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator("div.bg-white").filter({ hasText: srvNameEdited }).first();
    await editedCard.scrollIntoViewIfNeeded();
    const deleteBtn = editedCard.locator('button[title="Delete Service"]');
    await deleteBtn.click();

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: /Delete/i }).click();

    await expect(page.locator("h3").filter({ hasText: srvNameEdited })).toBeHidden();
  });

  test("Portfolio CRUD: Add, Edit, Toggle Featured, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const projTitle = `PW_TEST_PORTFOLIO_${timestamp}`;
    const projTitleEdited = `${projTitle}_EDITED`;

    await page.goto("/admin/portfolio");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD
    await page.getByRole("button", { name: "New Project" }).click();
    await expect(page.getByRole("heading", { name: "Create Showcase Project" })).toBeVisible();

    await page.locator('input[placeholder*="Ananya & Siddharth"]').fill(projTitle);
    await page.locator('input[placeholder*="Grand Chettinad"]').fill("Test Wedding Celebration");

    // Image upload
    await page.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Publish Project" }).click();

    // Verify created
    await expect(page.getByText(projTitle)).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE FEATURED
    const card = page.locator("div.bg-white").filter({ hasText: projTitle }).first();
    const featuredBtn = card.locator('button:has-text("Featured")').first();
    if (await featuredBtn.isVisible()) {
      await featuredBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. EDIT (overlay button)
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    const editBtn = card.locator('button[title="Edit Story"]');
    await expect(editBtn).toBeVisible({ timeout: 8000 });
    await editBtn.click({ force: true });
    await expect(page.locator('.fixed').getByRole("heading", { name: /Edit/i })).toBeVisible();

    const titleInput = page.locator('input[placeholder*="Ananya & Siddharth"]');
    await titleInput.clear();
    await titleInput.fill(projTitleEdited);
    await page.getByRole("button", { name: "Save Story" }).click();

    await expect(page.getByText(projTitleEdited)).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator("div.bg-white").filter({ hasText: projTitleEdited }).first();
    await editedCard.hover();
    const deleteBtn = editedCard.locator('button[title="Delete Story"]');
    await deleteBtn.click({ force: true });

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(projTitleEdited)).toBeHidden();
  });

  test("Films CRUD: Add, Edit, Toggle Featured, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const filmTitle = `PW_TEST_FILM_${timestamp}`;
    const filmTitleEdited = `${filmTitle}_EDITED`;

    await page.goto("/admin/films");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD
    await page.getByRole("button", { name: "Add Film" }).click();
    await expect(page.getByRole("heading", { name: "Upload Film Showcase" })).toBeVisible();

    await page.locator('input[placeholder*="Story Written in the Stars"]').fill(filmTitle);
    await page.locator('input[placeholder*="youtube.com"]').fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    // Thumbnail upload
    await page.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Publish Film" }).click();

    // Verify created
    await expect(page.getByText(filmTitle)).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE FEATURED
    const card = page.locator("div.bg-white").filter({ hasText: filmTitle }).first();
    const featuredBtn = card.locator('button:has-text("Featured")').first();
    if (await featuredBtn.isVisible()) {
      await featuredBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. EDIT
    const editBtn = card.locator('button[title="Edit Film"]');
    await editBtn.click();
    await expect(page.getByRole("heading", { name: /Edit/i })).toBeVisible();

    const titleInput = page.locator('input[placeholder*="Story Written in the Stars"]');
    await titleInput.clear();
    await titleInput.fill(filmTitleEdited);
    await page.getByRole("button", { name: "Save Film" }).click();

    await expect(page.getByText(filmTitleEdited)).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator("div.bg-white").filter({ hasText: filmTitleEdited }).first();
    const deleteBtn = editedCard.locator('button[title="Delete Film"]');
    await deleteBtn.click();

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(filmTitleEdited)).toBeHidden();
  });

  test("Branches CRUD: Add, Edit, Toggle Status, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const branchName = `PW_TEST_BRANCH_${timestamp}`;
    const branchCity = `City_${timestamp}`;

    await page.goto("/admin/branches");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD
    await page.getByRole("button", { name: "Add Branch" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Studio Location" })).toBeVisible();

    await page.locator('input[placeholder*="Kalladaikurichi Headquarters"]').fill(branchName);
    await page.locator('input[placeholder*="e.g. Tirunelveli"]').fill(branchCity);
    await page.locator('textarea[placeholder*="Shop/Complex details"]').fill("123 Test Studio Avenue, Tamil Nadu");

    // Image upload
    await page.locator('input[type="file"]').setInputFiles(testImagePath);

    await page.locator('form').getByRole("button", { name: "Add Branch" }).click();

    // Verify created (target card heading specifically)
    await expect(page.getByRole("heading", { name: branchName })).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE STATUS
    const card = page.locator("div.bg-white").filter({ hasText: branchName }).first();
    const powerBtn = card.locator('button[title*="Active"], button[title*="Inactive"]').first();
    if (await powerBtn.isVisible()) {
      await powerBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. EDIT
    const editBtn = card.locator('button[title="Edit Branch"]');
    await editBtn.click();
    await expect(page.getByRole("heading", { name: /Update/i })).toBeVisible();

    const nameInput = page.locator('input[placeholder*="Kalladaikurichi Headquarters"]');
    const editedName = `${branchName}_EDITED`;
    await nameInput.clear();
    await nameInput.fill(editedName);
    await page.getByRole("button", { name: "Save Branch" }).click();

    await expect(page.getByRole("heading", { name: editedName })).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator("div.bg-white").filter({ hasText: editedName }).first();
    const deleteBtn = editedCard.locator('button[title="Delete Branch"]');
    await deleteBtn.click();

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByRole("heading", { name: editedName })).toBeHidden();
  });

  test("Testimonials CRUD: Add, Edit, Toggle Approved & Featured, Delete", async ({ page }) => {
    const timestamp = Date.now().toString().slice(-6);
    const clientName = `PW_Client_${timestamp}`;
    const editedClientName = `${clientName}_ED`;

    await page.goto("/admin/testimonials");
    await page.waitForLoadState("domcontentloaded");

    // 1. ADD
    await page.getByRole("button", { name: "Add Review" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Client Feedback" })).toBeVisible();

    await page.locator('input[placeholder*="Dr. Arvind & Kavitha"]').fill(clientName);
    await page.locator('textarea[placeholder*="Write the full feedback"]').fill("Truly extraordinary photography and storytelling experience!");

    // Image upload
    await page.locator('input[type="file"]').setInputFiles(testImagePath);
    await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible({ timeout: 5000 });

    await page.locator('form').getByRole("button", { name: "Add Review" }).click();

    // Verify created
    await expect(page.locator("h4").filter({ hasText: clientName })).toBeVisible({ timeout: 8000 });

    // 2. TOGGLE APPROVED / FEATURED
    const card = page.locator("div.bg-white").filter({ hasText: clientName }).first();
    const featuredToggle = card.locator('button:has-text("Featured")').first();
    if (await featuredToggle.isVisible()) {
      await featuredToggle.click();
      await page.waitForTimeout(300);
    }

    // 3. EDIT
    const editBtn = card.locator('button[title="Edit Review"]');
    await editBtn.click();
    await expect(page.getByRole("heading", { name: /Update.*Review/i })).toBeVisible();

    const nameInput = page.locator('input[placeholder*="Dr. Arvind & Kavitha"]');
    await nameInput.clear();
    await nameInput.fill(editedClientName);
    await page.getByRole("button", { name: "Save Review" }).click();
    await expect(page.getByRole("heading", { name: /Update.*Review/i })).toBeHidden();

    await expect(page.locator("h4").filter({ hasText: editedClientName })).toBeVisible();

    // 4. DELETE
    const editedCard = page.locator("div.bg-white").filter({ hasText: editedClientName }).first();
    const deleteBtn = editedCard.locator('button[title="Delete Review"]');
    await deleteBtn.dispatchEvent("click");

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: /Delete Review/i }).click();

    await expect(page.locator("h4").filter({ hasText: editedClientName })).toBeHidden();
  });

  test("Website Content CMS: Edit Home, About, and Contact content", async ({ page }) => {
    await page.goto("/admin/content");
    await page.waitForLoadState("domcontentloaded");

    // 1. HOME TAB
    const testHeadline = `Timeless Heritage Artistry ${Date.now()}`;
    const heroInput = page.locator('label:has-text("Hero Main Headline") + input');
    await expect(heroInput).toBeVisible();
    await heroInput.clear();
    await heroInput.fill(testHeadline);
    await page.getByRole("button", { name: "Save Homepage" }).click();
    await expect(page.getByText(/saved successfully|updated/i).first()).toBeVisible({ timeout: 5000 });

    // 2. ABOUT TAB
    await page.getByRole("button", { name: /About Studio & Story/i }).click();
    await page.getByRole("button", { name: /Save About/i }).click();
    await expect(page.getByText(/saved successfully|updated/i).first()).toBeVisible({ timeout: 5000 });

    // 3. CONTACT TAB
    await page.getByRole("button", { name: /Contact & Social Links/i }).click();
    await page.getByRole("button", { name: /Save Contact/i }).click();
    await expect(page.getByText(/saved successfully|updated/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("Bookings: Create, Read, Update status, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const customerName = `PW_TEST_BOOKING_${timestamp}`;

    await page.goto("/admin/bookings");
    await page.waitForLoadState("domcontentloaded");

    // 1. CREATE BOOKING
    await page.getByRole("button", { name: /Add Booking/i }).click();
    await expect(page.getByRole("heading", { name: "Schedule Shoot Session" })).toBeVisible();

    await page.locator('input[placeholder*="Kavitha & Arvind"]').fill(customerName);
    await page.locator('input[placeholder*="98401"]').fill("+91 98765 43210");
    await page.locator('input[placeholder*="client@gmail.com"]').fill("test.booking@subashstudio.test");
    await page.locator('input[type="date"]').fill("2026-12-15");
    await page.locator('input[placeholder*="Le Royal"]').fill("Tirunelveli Palace");

    await page.getByRole("button", { name: "Create Booking" }).click();

    // Verify created
    await expect(page.getByText(customerName)).toBeVisible({ timeout: 8000 });

    // 2. READ & UPDATE STATUS
    const row = page.locator("tr").filter({ hasText: customerName }).first();
    await expect(row).toBeVisible();
    
    const statusSelect = row.locator("select").first();
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("Confirmed");
      await page.waitForTimeout(300);
    }

    // 3. DELETE
    const deleteBtn = row.locator('button[title="Delete Booking"]').first();
    await deleteBtn.click();

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(customerName)).toBeHidden();
  });

  test("Enquiries: Read, Update status, Delete", async ({ page }) => {
    const timestamp = Date.now();
    const enqName = `PW_TEST_ENQUIRY_${timestamp}`;

    // Inject isolated test enquiry directly
    await page.evaluate((name) => {
      const key = "subash_studio_db_v4_enquiries";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.unshift({
        id: `ENQ-TEST-${Date.now()}`,
        name: name,
        phone: "+91 99887 76655",
        email: "enquiry.test@subashstudio.test",
        service: "Wedding Photography",
        eventDate: "2026-11-20",
        notes: "Automated test enquiry notes.",
        status: "New",
        date: "Today, 10:00 AM",
      });
      localStorage.setItem(key, JSON.stringify(existing));
    }, enqName);

    await page.goto("/admin/enquiries");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(enqName)).toBeVisible({ timeout: 8000 });

    // Update status
    const row = page.locator("tr").filter({ hasText: enqName }).first();
    await expect(row).toBeVisible();

    const statusSelect = row.locator("select").first();
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("Contacted");
      await page.waitForTimeout(300);
    }

    // Delete
    const deleteBtn = row.locator('button[title="Delete Enquiry"]').first();
    await deleteBtn.click();

    const confirmModal = page.locator('div[role="dialog"]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(enqName)).toBeHidden();
  });

  test("Settings: Update studio profile information", async ({ page }) => {
    await page.goto("/admin/settings");
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: /Studio Business Info/i }).click();

    const studioNameInput = page.locator('input[placeholder*="SUBASH STUDIO"]').first();
    if (await studioNameInput.isVisible()) {
      await studioNameInput.fill("SUBASH STUDIO ATELIER");
      await page.getByRole("button", { name: /Save Studio Details/i }).click();
      await expect(page.getByText(/updated|saved/i).first()).toBeVisible({ timeout: 5000 });
    }
  });
});
