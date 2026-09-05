// @ts-check

export const TEST_PREFIX = "PW_TEST_";

export function generateUniqueTitle(entity) {
  return `${TEST_PREFIX}${entity}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * Validates that there are no console errors or uncaught exceptions during page operation.
 * @param {import('@playwright/test').Page} page
 * @returns {string[]} Captured console errors array
 */
export function captureConsoleErrors(page) {
  const errors = [];
  page.on("pageerror", (exception) => {
    const msg = exception.message || "";
    if (msg.includes("Permission policy 'Fullscreen'") || msg.includes("maps.googleapis.com") || msg.includes("google.com")) {
      return;
    }
    errors.push(`Page Error: ${exception.message}\n${exception.stack}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (
        text.includes("favicon") ||
        text.includes("Failed to load resource: net::ERR_CONNECTION_REFUSED") ||
        text.includes("Permission policy 'Fullscreen'") ||
        text.includes("maps.googleapis.com")
      ) {
        return;
      }
      errors.push(`Console Error: ${text}`);
    }
  });
  return errors;
}

/**
 * Checks for horizontal overflow on a page (scrollWidth > clientWidth)
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function hasHorizontalOverflow(page) {
  return await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return (
      doc.scrollWidth > window.innerWidth ||
      body.scrollWidth > window.innerWidth
    );
  });
}

/**
 * Checks that all visible <img> elements have loaded successfully (naturalWidth > 0)
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<{ brokenCount: number, brokenSources: string[] }>}
 */
export async function verifyImagesLoaded(page) {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    const broken = images.filter((img) => {
      // Only check images that are in the document and have an src
      if (!img.src || img.src.startsWith("data:")) return false;
      return img.complete && img.naturalWidth === 0;
    });
    return {
      brokenCount: broken.length,
      brokenSources: broken.map((img) => img.src),
    };
  });
}
