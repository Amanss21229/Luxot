# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the LUXORA Telegram Shopping Bot with Firebase Firestore backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: Firebase Firestore (via firebase-admin)
- **Telegram Bot**: Telegraf v4 (long polling)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## LUXORA Bot

**Bot Name**: LUXORA - ONLINE SHOPPING PLATFORM 🛍 🛍  
**Bot Username**: @LuxoraShoppingBot  
**Permanent Admin ID**: 8162524828

### Features
- User auto-registration on /start
- Product catalog with 8 categories (Electronics, Fashion, Shoes, Gadgets, Stationery, Home, Accessories, Digital)
- Product cards with image carousel (up to 5), optional video
- Shopping cart, wishlist, search, trending system
- Review/rating system (1-5 stars)
- Deep link product sharing via inline queries
- Luxora Learn — digital products (PDFs, courses)
- Admin panel: /add, /edit, /delete, /promote, /remove, /announce, /lock, /unlock, /adddigital
- Broadcast system (forward any message type to all users)
- Force join system (lock/unlock)

### Bot File Structure
```
artifacts/api-server/src/bot/
├── index.ts            — Main bot setup, all handlers wired
├── firebase.ts         — Firebase Admin SDK init
├── constants.ts        — Branding, categories, config
├── db/
│   ├── users.ts        — User registration & lookup
│   ├── admins.ts       — Admin management
│   ├── products.ts     — Product CRUD, search, trending
│   ├── cart.ts         — Cart management
│   ├── wishlist.ts     — Wishlist management
│   ├── reviews.ts      — Review/rating system
│   ├── digital.ts      — Digital products
│   └── forceJoin.ts    — Force join config
├── handlers/
│   ├── start.ts        — /start, user registration, deep links
│   ├── shop.ts         — Category browsing, product carousel
│   ├── cart.ts         — Cart actions
│   ├── wishlist.ts     — Wishlist actions
│   ├── search.ts       — Product search
│   ├── trending.ts     — Trending products
│   ├── digital.ts      — Luxora Learn digital products
│   ├── reviews.ts      — Rating system
│   └── admin.ts        — All admin commands & flows
└── utils/
    ├── format.ts       — Message formatters (MarkdownV2)
    └── keyboards.ts    — All inline/reply keyboards
```

### Firestore Collections
- `users` — registered users
- `admins` — admin user IDs
- `products` — product catalog
- `digital_products` — Luxora Learn items
- `cart` — per-user cart items
- `wishlist` — per-user wishlist items
- `reviews` — product reviews
- `clicks` — click tracking for trending
- `force_join` — force join config

### Secrets Required
- `TELEGRAM_BOT_TOKEN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server + bot locally
