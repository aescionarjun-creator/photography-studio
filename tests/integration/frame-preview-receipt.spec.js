// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../fixtures/auth.js";

test.describe("Order Frames Admin Upgrades: WhatsApp Receipt Removal, Shared Print Receipt & Realistic Frame Preview", () => {
  test("1. Floating WhatsApp icon has print-hidden classes and print media isolates FramePrintReceipt", async ({
    page,
  }) => {
    await page.goto("/frames");
    await page.waitForLoadState("domcontentloaded");

    // Floating buttons exist on screen
    const floatingContainer = page.locator('[data-no-print="true"]');
    await expect(floatingContainer).toBeAttached();
    await expect(floatingContainer).toHaveClass(/no-print/);
    await expect(floatingContainer).toHaveClass(/print:hidden/);

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    // Under print styles, #root and floating buttons should be hidden
    const isFloatingHidden = await floatingContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display === "none" || style.visibility === "hidden";
    });
    expect(isFloatingHidden).toBe(true);

    const isRootHidden = await page.locator("#root").evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display === "none" || style.visibility === "hidden";
    });
    expect(isRootHidden).toBe(true);
  });

  test("2. Admin Order Details displays realistic dynamic FrameOrderPreview with photo, wood, design, ratio", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);

    await page.goto("/admin/frames");
    await page.waitForLoadState("domcontentloaded");

    // Switch to Orders tab
    const ordersTabBtn = page.getByRole("button", { name: /Orders/i });
    await ordersTabBtn.click();

    // Verify orders list is visible
    await expect(page.getByText("SS-FR-20260901-101")).toBeVisible();

    // Click "View Details" on Order 1: Teak Wood + Classic Gold + 10x12
    const firstOrderRow = page.locator("div").filter({ hasText: "SS-FR-20260901-101" }).first();
    await firstOrderRow.getByRole("button", { name: /View Details/i }).click();

    // Verify modal opened
    const modal = page.locator(".fixed.inset-0");
    await expect(modal).toBeVisible();

    // Verify Frame Preview Label
    await expect(modal.getByText("ORDERED FRAME PREVIEW")).toBeVisible();

    // Verify dynamic specifications caption
    await expect(
      modal.getByText("Teak Wood • Classic Gold • 10 × 12")
    ).toBeVisible();

    // Verify disclaimer note
    await expect(
      modal.getByText("Visual representation based on the customer's selected frame configuration.")
    ).toBeVisible();

    // Verify customer photo is inside the preview with object-fit: cover
    const previewImg = modal.locator('img[alt="wedding-couple.jpg"]');
    await expect(previewImg).toBeVisible();
    const objectFit = await previewImg.evaluate((el) => window.getComputedStyle(el).objectFit);
    expect(objectFit).toBe("cover");

    // Close modal
    await modal.getByRole("button", { name: "Close" }).click();
    await expect(modal).not.toBeVisible();

    // Open Order 2: Walnut Wood + Modern Black + 8x10
    const secondOrderRow = page.locator("div").filter({ hasText: "SS-FR-20260902-102" }).first();
    await secondOrderRow.getByRole("button", { name: /View Details/i }).click();
    await expect(modal).toBeVisible();

    // Verify dynamic change to Walnut Wood • Modern Black • 8 × 10
    await expect(
      modal.getByText("Walnut Wood • Modern Black • 8 × 10")
    ).toBeVisible();
    await expect(modal.locator('img[alt="reception-portrait.jpg"]')).toBeVisible();

    // Close modal
    await modal.getByRole("button", { name: "Close" }).click();
    await expect(modal).not.toBeVisible();

    // Open Order 3: Rose Wood + Vintage Brown + 12x18
    const thirdOrderRow = page.locator("div").filter({ hasText: "SS-FR-20260904-103" }).first();
    await thirdOrderRow.getByRole("button", { name: /View Details/i }).click();
    await expect(modal).toBeVisible();

    // Verify dynamic change to Rose Wood • Vintage Brown • 12 × 18
    await expect(
      modal.getByText("Rose Wood • Vintage Brown • 12 × 18")
    ).toBeVisible();
    await expect(modal.locator('img[alt="traditional-heritage.jpg"]')).toBeVisible();
  });

  test("3. Admin Print Receipt uses shared FramePrintReceipt (NOT a screenshot) and contains zero WhatsApp icon", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);

    await page.goto("/admin/frames");
    await page.waitForLoadState("domcontentloaded");

    // Switch to Orders tab
    await page.getByRole("button", { name: /Orders/i }).click();

    // Open Order 1
    const firstOrderRow = page.locator("div").filter({ hasText: "SS-FR-20260901-101" }).first();
    await firstOrderRow.getByRole("button", { name: /View Details/i }).click();

    // Check that #frame-print-receipt is in the DOM (rendered via portal)
    const receipt = page.locator("#frame-print-receipt");
    await expect(receipt).toBeAttached();

    // Verify receipt content according to exact specifications:
    await expect(receipt.getByText("ATELIER WOODCRAFT & FRAMING")).toBeVisible();
    await expect(receipt.getByRole("heading", { name: "SUBASH STUDIO" })).toBeVisible();
    await expect(receipt.getByText("Fine Photography & Cinematic Films")).toBeVisible();
    await expect(receipt.getByText("FRAME ORDER RECEIPT")).toBeVisible();

    // Order Information
    await expect(receipt.getByText("SS-FR-20260901-101")).toBeVisible();

    // Customer details
    await expect(receipt.getByText("Ananya Iyer")).toBeVisible();
    await expect(receipt.getByText("+91 98401 55667")).toBeVisible();
    await expect(receipt.getByText("ananya.iyer@gmail.com")).toBeVisible();

    // Specifications
    await expect(receipt.getByText("Teak Wood")).toBeVisible();
    await expect(receipt.getByText("Classic Gold")).toBeVisible();
    await expect(receipt.getByText("10 × 12")).toBeVisible();

    // Studio contact & legal disclaimer
    await expect(
      receipt.getByText("Tirunelveli Atelier • Kalladaikurichi Heritage Studio")
    ).toBeVisible();
    await expect(receipt.getByText(/subashstudio002@gmail\.com/)).toBeVisible();
    await expect(
      receipt.getByText("THIS IS AN OFFICIAL COMPUTER-GENERATED RECEIPT FOR CUSTOM FRAMING ORDER.")
    ).toBeVisible();

    // Verify WhatsApp icon or floating logo is NOT inside the receipt
    const receiptWhatsApp = receipt.locator("svg, img").filter({ hasText: /whatsapp/i });
    expect(await receiptWhatsApp.count()).toBe(0);

    // Emulate print media
    await page.emulateMedia({ media: "print" });

    // Under print styles:
    // #frame-print-receipt should be visible
    const isReceiptVisible = await receipt.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    expect(isReceiptVisible).toBe(true);

    // #root (the entire admin UI, drawer, backdrop, sidebar) is completely hidden
    const isRootHidden = await page.locator("#root").evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display === "none" || style.visibility === "hidden";
    });
    expect(isRootHidden).toBe(true);
  });

  test("4. Order Details modal is fully responsive across mobile, tablet, and desktop viewports", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
    await loginAsAdmin(page);

    await page.goto("/admin/frames");
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: /Orders/i }).click();

    const viewports = [
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);

      // Open Order 1 if not open
      const modal = page.locator(".fixed.inset-0");
      if (!(await modal.isVisible())) {
        const firstOrderRow = page.locator("div").filter({ hasText: "SS-FR-20260901-101" }).first();
        await firstOrderRow.getByRole("button", { name: /View Details/i }).click();
        await expect(modal).toBeVisible();
      }

      // Check preview is visible and within bounds
      const preview = modal.locator(".shadow-inner");
      await expect(preview).toBeVisible();

      // Ensure no horizontal document overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Ensure Print Receipt and Close buttons remain clickable
      const printBtn = modal.getByRole("button", { name: /Print Receipt/i });
      const closeBtn = modal.getByRole("button", { name: "Close" });
      await expect(printBtn).toBeVisible();
      await expect(closeBtn).toBeVisible();
    }
  });
});
