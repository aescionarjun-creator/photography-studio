import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { w: 375, h: 812, name: '375px' },
    { w: 768, h: 1024, name: '768px' },
    { w: 1024, h: 768, name: '1024px' },
    { w: 1366, h: 768, name: '1366px' },
    { w: 1440, h: 900, name: '1440px' },
    { w: 1920, h: 1080, name: '1920px' },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #F8F6F2; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #2B2B2B; padding: 40px 20px; }
          .container { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
          
          .branch-card {
            background: #FFFFFF;
            border: 1px solid #E7E0D2;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 10px 40px -15px rgba(43,43,43,0.14);
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          @media (min-width: 1024px) {
            .branch-card {
              flex-direction: row;
            }
            .branch-card.reverse {
              flex-direction: row-reverse;
            }
          }

          .img-col {
            width: 100%;
            background: #FAF8F5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
          }

          .img-col img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
            transition: transform 0.7s;
          }
          .img-col:hover img {
            transform: scale(1.03);
          }

          @media (min-width: 1024px) {
            .img-col-kalladai {
              width: 40%;
            }
            .img-col-tirunelveli {
              width: 36%;
            }
          }

          .content-col {
            flex: 1 1 0%;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          @media (min-width: 768px) {
            .content-col { padding: 36px; }
          }
          @media (min-width: 1024px) {
            .content-col { padding: 40px 48px; }
          }
          @media (min-width: 1280px) {
            .content-col { padding: 44px 56px; }
          }

          .eyebrow {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #9C7B3D;
            margin-bottom: 12px;
          }

          .title {
            font-size: 30px;
            font-weight: 700;
            color: #2B2B2B;
            margin-bottom: 16px;
            font-family: serif;
          }

          .desc {
            font-size: 14px;
            color: #6B7280;
            line-height: 1.65;
            margin-bottom: 28px;
          }

          .meta-item {
            font-size: 14px;
            color: #2B2B2B;
            margin-bottom: 12px;
            display: flex;
            gap: 12px;
          }

          .directions-link {
            display: inline-block;
            margin-top: 8px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #9C7B3D;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Card 1: Kalladaikurichi (~40%) -->
          <div id="card-kalladai" class="branch-card">
            <div id="img-kalladai" class="img-col img-col-kalladai">
              <img src="http://localhost:5173/images/gallery/branches/kalladaikurichi.jpg" alt="Kalladaikurichi" />
            </div>
            <div id="content-kalladai" class="content-col">
              <p class="eyebrow">Flagship Studio & Production Atelier</p>
              <h3 class="title">Kalladaikurichi</h3>
              <p class="desc">Our original studio and full production headquarters — shoot floor, edit suites and album atelier under one roof.</p>
              <div class="meta-item"><span>📍</span><span>88 Main Road, Kalladaikurichi, Tamil Nadu 627416</span></div>
              <div class="meta-item"><span>📞</span><span>+91 93457 06609</span></div>
              <div class="meta-item"><span>🕒</span><span>Mon – Sun, 08:00 AM – 09:00 PM</span></div>
              <a href="#" class="directions-link">Get Directions ↗</a>
            </div>
          </div>

          <!-- Card 2: Tirunelveli (~36%) -->
          <div id="card-tirunelveli" class="branch-card reverse">
            <div id="img-tirunelveli" class="img-col img-col-tirunelveli">
              <img src="http://localhost:5173/images/gallery/branches/tirunelveli.jpg" alt="Tirunelveli" />
            </div>
            <div id="content-tirunelveli" class="content-col">
              <p class="eyebrow">Consultation & Portrait Studio</p>
              <h3 class="title">Tirunelveli</h3>
              <p class="desc">A dedicated portrait and consultation studio serving the Kongu region with the signature SUBASH STUDIO experience.</p>
              <div class="meta-item"><span>📍</span><span>Ahil Complex, S Bypass Rd, next to Selam RR Briyani, Vasanth Nagar, Tirunelveli, Tamil Nadu 627005</span></div>
              <div class="meta-item"><span>📞</span><span>+91 93457 06609</span></div>
              <div class="meta-item"><span>🕒</span><span>Mon – Sun, 08:00 AM – 09:00 PM</span></div>
              <a href="#" class="directions-link">Get Directions ↗</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    await page.waitForTimeout(1000);
    const info = await page.evaluate(() => {
      const c1 = document.getElementById('card-kalladai').getBoundingClientRect();
      const i1 = document.getElementById('img-kalladai').getBoundingClientRect();
      const img1 = document.getElementById('img-kalladai').querySelector('img').getBoundingClientRect();
      const t1 = document.getElementById('content-kalladai').getBoundingClientRect();

      const c2 = document.getElementById('card-tirunelveli').getBoundingClientRect();
      const i2 = document.getElementById('img-tirunelveli').getBoundingClientRect();
      const img2 = document.getElementById('img-tirunelveli').querySelector('img').getBoundingClientRect();
      const t2 = document.getElementById('content-tirunelveli').getBoundingClientRect();

      return {
        card1: {
          cardW: c1.width, cardH: c1.height,
          colW: i1.width, colH: i1.height,
          imgW: img1.width, imgH: img1.height,
          textW: t1.width, textH: t1.height,
          imgPercent: ((i1.width / c1.width) * 100).toFixed(1) + '%'
        },
        card2: {
          cardW: c2.width, cardH: c2.height,
          colW: i2.width, colH: i2.height,
          imgW: img2.width, imgH: img2.height,
          textW: t2.width, textH: t2.height,
          imgPercent: ((i2.width / c2.width) * 100).toFixed(1) + '%'
        }
      };
    });

    console.log(`[TEST VP ${vp.name}]:`, JSON.stringify(info, null, 2));
    await page.screenshot({ path: `test_new_layout_${vp.name}.png` });
    await page.close();
  }

  await browser.close();
})();
