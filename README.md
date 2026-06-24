# Keymint Next.js Starter

A Next.js app with Keymint license management — create licenses, validate activations, and receive webhooks.

## Quick Start

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|---|---|
| `KEYMINT_ADMIN_API_KEY` | Admin API key (server-side license management) |
| `KEYMINT_CLIENT_API_KEY` | Client API key (activation/validation) |
| `KEYMINT_PRODUCT_ID` | Your product ID |
| `KEYMINT_WEBHOOK_SECRET` | Webhook signing secret |

## What's Included

- **License API route** — `POST /api/licenses` to create licenses with customer details
- **Webhook receiver** — `POST /api/webhooks/keymint` with HMAC-SHA256 signature verification
- **License service** — create, block, unblock, query, and validate licenses
- **Dashboard page** — `/dashboard/licenses` with setup instructions

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   ├── api/
│   │   ├── licenses/route.ts        # License creation endpoint
│   │   └── webhooks/keymint/route.ts # Webhook receiver
│   └── dashboard/
│       └── licenses/page.tsx         # License management UI
└── lib/
    └── license-service.ts            # Keymint API wrapper
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/licenses` | Create a license (`customerEmail` required) |
| `POST` | `/api/webhooks/keymint` | Receive Keymint webhook events |
