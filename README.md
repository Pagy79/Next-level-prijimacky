# Next-level-prijimacky

Tréninková appka na české přijímačky (JPZ čeština) — React + Vite + Supabase + Tailwind.

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

SQL:

- Learning loop: `scripts/supabase-learning-loop.sql`
- Audit / plný setup: `scripts/supabase-audit.sql`, `scripts/supabase-setup-reference.sql`

## Struktura

```
├── index.html                 # HTML shell
├── main.jsx                   # React entry + Tailwind CSS
├── styles.css                 # Tailwind directives
├── QuizPrototype.jsx          # Hlavní app logika (auth, quiz, progress)
├── components/                # Ikony, QuestionText
├── data/questions.json        # Banka otázek
├── data/cheatsheets.js        # Taháky
├── public/images/             # Pozadí a assety (místo base64)
├── lib/supabase/client.ts     # Supabase klient
├── lib/progress.js            # Ukládání pokusů + slabé oblasti
├── lib/quizTheme.js           # Styly / meta kategorií
└── scripts/                   # SQL, extract, verify
```

## Learning loop (progress)

Po dokončení testu appka uloží pokus a odpovědi. Na dashboardu pak uvidíš slabé oblasti a režim **Jen moje chyby**.

1. V Supabase SQL Editoru spusť `scripts/supabase-learning-loop.sql`.
2. Do té doby funguje progress lokálně (localStorage).

## Freemium limity (server)

Limity free verze kontroluje Supabase RPC (`start_practice_test`, `start_big_test`). Klient **nemůže** nastavit `is_premium` ani usage countery.

1. Spusť `scripts/supabase-freemium-limits.sql`.
2. Pro test PREMIUM v Dashboardu → Table Editor → `profiles` → `is_premium = true`.

## Deploy

Pro Vercel nastav env proměnné:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
