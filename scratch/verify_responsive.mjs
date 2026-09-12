import { chromium } from "playwright";

const viewports = [
  { width: 320, height: 640, name: "320px" },
  { width: 375, height: 667, name: "375px" },
  { width: 430, height: 932, name: "430px" },
  { width: 768, height: 1024, name: "768px" },
  { width: 900, height: 1024, name: "900px" },
  { width: 1024, height: 768, name: "1024px" },
  { width: 1180, height: 820, name: "1180px" },
  { width: 1366, height: 768, name: "1366px" },
  { width: 1440, height: 900, name: "1440px" },
  { width: 1920, height: 1080, name: "1920px" },
];

async function verify() {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    
    // Check horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

    await page.screenshot({ path: `scratch/home_${vp.name}.png`, fullPage: false });

    results.push({
      viewport: vp.name,
      width: vp.width,
      scrollWidth,
      hasHorizontalScroll,
    });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

verify().catch(console.error);
