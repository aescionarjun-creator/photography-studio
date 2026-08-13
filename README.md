# SUBASH STUDIO — Premium Photography Studio Website

A frontend-only, production-quality React site for a photography studio, built with
Vite, Tailwind CSS, React Router, Framer Motion, GSAP, Lenis smooth scroll, LightGallery,
Swiper, and React CountUp.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## What's inside

- `/`, `/about`, `/services`, `/portfolio`, `/gallery`, `/films`, `/branches`, `/contact`
  — each a real React Router route with fade + slide page transitions.
- Home-page-only navbar behaviour: hidden over the hero, fades in on scroll, hides again
  at the top — sticky and always visible on every other page.
- Warm-white luxury theme (`#F8F6F2` background, champagne gold `#C9A669` accent),
  Fraunces (display) + Manrope (body) type pairing.
- A signature "aperture" motif (see `.aperture` in `src/index.css`) used for the
  404 page and available as a loading/reveal element elsewhere.
- Editorial masonry Portfolio page with category filters and a custom lightbox.
- Filterable Gallery page (13 categories) using LightGallery for zoomable lightbox viewing.
- Contact page with a working (frontend-only, no backend) enquiry form.

## Swap in real content

- **Images**: every image currently comes from `src/data/images.js`, which points to
  seeded `picsum.photos` placeholders so the site always renders. Replace the `img()`
  calls (or the function itself) with your real photography.
- **Logo**: the navbar/footer currently render a small aperture mark + "SUBASH STUDIO"
  wordmark — drop in a real logo file and swap the markup in
  `src/components/Navbar.jsx` / `src/components/Footer.jsx` once you have one.
- **Copy**: studio story, timeline, service descriptions and portfolio captions live in
  `src/data/*.js` and directly in the page files — all plain, editable text.
- **Contact form / WhatsApp / social links**: update the phone numbers, email and social
  URLs in `src/components/Navbar.jsx`, `Footer.jsx`, `FloatingButtons.jsx` and
  `pages/Contact.jsx`.

No backend, database, or authentication is included, per the brief — the contact form
simulates a submission on the client only.
