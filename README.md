
# IL Motors — Landing Page (Static) + API stub

This project is a production-ready **static landing page** for IL Motors with:
- i18n support (Arabic & English)
- RTL/LTR handling (dir and logical CSS)
- Accessible carousel/slider
- Preorder form that POSTs to `/api/preorder`
- SEO meta tags and JSON-LD
- model-viewer placeholders for 3D models

## Structure
- index.html — main static page
- styles.css — styles
- app.js — i18n, carousel, form handling
- /i18n/en.json, ar.json — translations
- /api/server.js — node/express stub for `/api/preorder`
- package.json — basic dependencies list

## Run locally
1. Static preview:
   - Open `index.html` directly in browser (for static preview).
2. Run server (to test /api/preorder):
   - Install Node.js (>=14).
   - `npm install`
   - `node api/server.js`
   - Point form action to `http://localhost:3000/api/preorder` or deploy server.

## Deploy
- Deploy static site on Vercel/Netlify. If you need server endpoint, deploy the `api/server.js` as a serverless function (Netlify Functions or Vercel Serverless) or run as small Node app on Render/Heroku.

## Notes & Next steps
- Replace placeholder images in `/assets` with optimized WebP/JPEG files and provide `srcset`.
- Add reCAPTCHA or similar anti-spam measures for the form.
- Replace model-viewer `src` with actual `.glb`/`.gltf` files hosted in `assets/`.
- Integrate database (Firestore/Postgres) and email service (SendGrid) to store and notify preorders.
- Consider migrating to Next.js + TypeScript + React for advanced SEO (SSR) and larger app features.

