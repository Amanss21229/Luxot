# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the LUXORA Telegram Shopping Bot + full e-commerce website. Both share the same Firebase Firestore backend — admin product changes on Telegram auto-reflect on the website.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4
- **State**: Zustand (cart & wishlist)
- **Data fetching**: TanStack Query
- **Toast**: Sonner
- **Routing**: Wouter
- **Database**: Firebase Firestore (via firebase-admin)
- **Telegram Bot**: Telegraf v4 (long polling)
- **Validation**: Zod
- **Build**: esbuild (API) + Vite (web)

## LUXORA Website (artifacts/luxora-web)

Full-featured e-commerce website at `previewPath: "/"`, port 23062.

### Pages
- `/` — Home (hero banner, categories, featured, trending, CTAs)
- `/shop` — All products with sort/filter
- `/shop/:category` — Category-specific products
- `/product/:id` — Product detail with images, reviews, add-to-cart
- `/cart` — Shopping cart with quantity management
- `/checkout` — Address form (name, phone, email, full Indian address) + Razorpay payment branding
- `/order-success` — Order confirmation with order ID
- `/wishlist` — Saved products
- `/search` — Product search
- `/digital` — Luxora Learn digital products
- `/faq` — Frequently Asked Questions (interactive accordion, filterable by category)
- `/shipping-policy` — Shipping Policy (India-wide, delivery timeline table, courier partners)
- `/return-refund` — Return & Refund Policy (7-day returns, Razorpay refund info)
- `/terms-of-service` — Terms of Service (Razorpay, legal, India-compliant)
- `/privacy-policy` — Privacy Policy (IT Act 2000 compliant, Firebase/Razorpay data handling)

### Features
- Premium dark gold theme (Amazon/Flipkart-like layout)
- Real-time product sync with Telegram bot (shared Firebase backend)
- Cart & wishlist (persisted via localStorage with Zustand)
- Full address collection at checkout with Indian state selector
- Orders saved to Firestore
- Product image carousel
- Star ratings display
- Category grid, trending section, featured products
- Telegram Bot CTA throughout the site
- SEO meta tags, Open Graph, structured data
- Mobile responsive

### API Proxy
Vite dev server proxies `/api/*` → `http://localhost:3000/api/*`

## LUXORA Bot (artifacts/api-server)

**Bot Name**: LUXORA - ONLINE SHOPPING PLATFORM 🛍  
**Bot Username**: @LuxoraShoppingBot  
**Permanent Admin ID**: 8162524828

### Admin Commands (Telegram Bot)
- `/add` — Add product (auto-updates website)
- `/edit` — Edit product
- `/delete` — Delete product
- `/promote` — Feature a product
- `/adddigital` — Add digital product
- `/announce` — Broadcast to all users
- `/lock` / `/unlock` — Force join

### Bot File Structure
```
artifacts/api-server/src/bot/
├── index.ts            — Main bot setup
├── firebase.ts         — Firebase Admin SDK init
├── constants.ts        — Branding, categories
├── db/
│   ├── products.ts     — Product CRUD
│   ├── cart.ts         — Cart management
│   ├── wishlist.ts     — Wishlist
│   ├── reviews.ts      — Review/rating
│   ├── digital.ts      — Digital products
│   └── ...
└── handlers/
    ├── shop.ts, cart.ts, wishlist.ts, search.ts, admin.ts ...
```

### API Routes (Express)
- `GET /api/products` — List products (with ?category, ?search, ?limit)
- `GET /api/products/trending` — Trending products
- `GET /api/products/featured` — Featured products
- `GET /api/products/:id` — Product detail
- `GET /api/products/:id/reviews` — Product reviews
- `POST /api/products/:id/reviews` — Submit review
- `GET /api/digital-products` — Digital products
- `POST /api/orders` — Place order

### Firestore Collections
- `products` — main catalog (synced to website)
- `digital_products` — Luxora Learn items
- `orders` — website orders
- `users`, `admins`, `cart`, `wishlist`, `reviews`, `clicks`, `force_join`

### Secrets Required
- `TELEGRAM_BOT_TOKEN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

## Workflows
- `Start application` — `PORT=3000 pnpm --filter @workspace/api-server run dev` (API + Telegram bot, console)
- `Luxora Web` — `PORT=23062 BASE_PATH=/ pnpm --filter @workspace/luxora-web run dev` (Web frontend, webview)

## Render Deployment

`render.yaml` is at the project root. Single web service setup:
- **Build**: Installs deps → builds Vite frontend → builds API server
- **Start**: Runs API server with `NODE_ENV=production` (Express serves built Vite files under `artifacts/luxora-web/dist`)
- **Health check**: `GET /api/health`
- **Required env vars on Render**: `TELEGRAM_BOT_TOKEN`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
- **Port**: Render assigns $PORT; set `10000` as default in render.yaml

## Key Commands

- `pnpm run typecheck` — typecheck across all packages
- `pnpm run build` — build all packages
- `pnpm --filter @workspace/api-server run dev` — run API + bot
- `pnpm --filter @workspace/luxora-web run dev` — run website
