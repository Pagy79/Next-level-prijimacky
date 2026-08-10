# Next-level-prijimacky

Tréninková appka na české přijímačky (JPZ čeština) — React + Vite + Supabase.

## Požadavky

- Node.js 18+
- Supabase projekt ([dashboard](https://supabase.com/dashboard/project/huogtxxxuxkcpwhmjlyk))

## Rychlý start

```bash
npm install
npm run dev
```

Appka poběží na `http://localhost:5173`.

## Supabase

Credentials jsou v `.env.local` (není v gitu). Pro audit backendu:

```bash
npm run verify:supabase
```

SQL audit a referenční setup: `scripts/supabase-audit.sql`, `scripts/supabase-setup-reference.sql`.

## Struktura

```
├── index.html              # HTML shell
├── main.jsx                # React entry point
├── QuizPrototype.jsx       # Hlavní aplikace (UI + auth + progress)
├── data/questions.json     # Banka otázek (~1000 úloh JPZ čeština)
├── lib/supabase/client.ts  # Supabase klient
├── lib/progress.js         # Ukládání pokusů + slabé oblasti
└── scripts/                # Audit, setup SQL, extract-questions
```

## Learning loop (progress)

Po dokončení testu appka uloží pokus a odpovědi. Na dashboardu pak uvidíš slabé oblasti a režim **Jen moje chyby**.

1. V Supabase SQL Editoru spusť `scripts/supabase-learning-loop.sql` (tabulky `attempts` a `attempt_answers` + RLS).
2. Do té doby funguje progress lokálně v prohlížeči (localStorage).

## Deploy

Pro Vercel nastav env proměnné:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
