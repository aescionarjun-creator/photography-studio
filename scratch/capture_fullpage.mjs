import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();

  // Desktop
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  
  // Scroll down progressively to trigger whileInView animations
  await pageDesk.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  await pageDesk.waitForTimeout(1000);
  await pageDesk.screenshot({ path: "scratch/fullpage_desktop_scrolled.png", fullPage: true });

  // Mobile
  const pageMob = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await pageMob.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await pageMob.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await pageMob.waitForTimeout(1000);
  await pageMob.screenshot({ path: "scratch/fullpage_mobile_scrolled.png", fullPage: true });

  await browser.close();
  console.log("Scrolled screenshots saved.");
}

run().catch(console.error);
