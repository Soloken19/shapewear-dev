# CurveCraft — Premium Shapewear (MVP)

This is a full‑stack MVP for a D2C e‑commerce site built with React (Vite + Tailwind) and FastAPI.

- Frontend: React 18, Vite, TailwindCSS, react-router, Helmet
- Backend: FastAPI (mocked endpoints)
- Data: 6 shapewear SKUs with sizes XS–3XL, colors, fabric, compression

## Development

Commands are managed by supervisor in this environment.

- Frontend runs on port 3000 (internal) with `yarn start` (Vite dev server)
- Backend runs on 0.0.0.0:8001 (FastAPI) with `/api/*` routes

Environment variables (do not modify protected values):
- frontend/.env: REACT_APP_BACKEND_URL
- backend/.env: MONGO_URL (unused for this mocked MVP)

If `REACT_APP_BACKEND_URL` is not provided, the frontend uses relative `/api` as a dev-safe default.

## API Routes (mocked)
- GET /api/health
- GET /api/products — list products
- GET /api/products/:slug — product detail
- POST /api/checkout — accepts cart payload and returns order id

## Pages
- / — Home (hero, trending products, categories, testimonials)
- /collections/:category — Filter by size/color
- /product/:slug — Product detail with before/after slider, fabric modal
- /cart — Editable cart, promo code, persisted to localStorage
- /checkout — Checkout stub
- /about — Brand story and values

## Design
- Color palette: nude, blush, espresso + neutrals
- Fonts: Playfair Display (headings), Inter (body)
- Microanimations: hover lifts, fade in
- Accessibility: semantic HTML, keyboard focusable controls

## Tracking Placeholders
- console.log events for CTA, add-to-cart, checkout

## Runbook
- Restart services after dependency updates:
  - sudo supervisorctl restart backend
  - sudo supervisorctl restart frontend
  - sudo supervisorctl restart all

## Notes
- All backend endpoints are prefixed with /api as required by ingress rules.
- Frontend never hardcodes the backend URL; it reads REACT_APP_BACKEND_URL.
