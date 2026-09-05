// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../fixtures/auth.js";
import path from "path";
import fs from "fs";

test.describe("Visual Regression & Page Screenshots", () => {
  const screenshotsDir = path.resolve(process.cwd(), "test-results", "screenshots");

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  const publicVisualPages = [
    { path: "/", name: "homepage" },
    { path: "/about", name: "about" },
    { path: "/services", name: "services" },
    { path: "/portfolio", name: "portfolio" },
    { path: "/gallery", name: "gallery" },
    { path: "/films", name: "films" },
    { path: "/branches", name: "branches" },
    { path: "/contact", name: "contact" },
  ];

  for (const p of publicVisualPages) {
    test(`Capture desktop & mobile visual state for ${p.name}`, async ({ page }) => {
      // Desktop screenshot
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(p.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500); // Allow framer-motion animations to settle

      const desktopPath = path.join(screenshotsDir, `${p.name}-desktop.png`);
      await page.screenshot({ path: desktopPath, fullPage: false });
      expect(fs.existsSync(desktopPath)).toBe(true);

      // Mobile screenshot
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(p.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      const mobilePath = path.join(screenshotsDir, `${p.name}-mobile.png`);
      await page.screenshot({ path: mobilePath, fullPage: false });
      expect(fs.existsSync(mobilePath)).toBe(true);
    });
  }

  const adminVisualPages = [
    { path: "/admin/dashboard", name: "admin-dashboard" },
    { path: "/admin/gallery", name: "admin-gallery" },
    { path: "/admin/services", name: "admin-services" },
    { path: "/admin/content", name: "admin-content" },
  ];

  for (const ap of adminVisualPages) {
    test(`Capture admin visual state for ${ap.name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/admin/login");
      await page.waitForLoadState("domcontentloaded");
      await loginAsAdmin(page);

      await page.goto(ap.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      const adminPath = path.join(screenshotsDir, `${ap.name}-desktop.png`);
      await page.screenshot({ path: adminPath, fullPage: false });
      expect(fs.existsSync(adminPath)).toBe(true);
    });
  }
});
