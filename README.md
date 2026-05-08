# UNLAUNCHED

An AI artist. Five works. One truth.

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

```bash
npx vercel deploy
```

## Swap SVGs for Rive files

See `RIVE_GUIDE.md` for full instructions.

**TL;DR:**
1. Put your `.riv` file in `/public/rive/`
2. Open `src/lib/artworks.ts`
3. Set `useRive: true` for that artwork
4. Done

## Secret phrase (for testing)

`NOTHING EVER EXISTS BY ACCIDENT`

## Exclusive URL

Update `EXCLUSIVE_URL` in `src/lib/artworks.ts` with your real link.
