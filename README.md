# LakeBridge

> Postgres-native lakehouse access platform — marketing & demo website.

Query Postgres tables and S3/R2 lake data from a single SQL endpoint.
No data movement. No new tools. Works with every Postgres-compatible client.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Tailwind CSS, Framer Motion |
| Routing | React Router DOM v7 |
| Theme | next-themes (dark / light toggle) |
| Icons | lucide-react |
| Package manager | Yarn |

This is a **static marketing website**. There is no required backend, database, or email service.

---

## Local Development

```bash
# Install dependencies
cd frontend
yarn install

# Start dev server (http://localhost:3000)
yarn start
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel        # Install Vercel CLI once
cd frontend
vercel                 # Follow the prompts
```

### Option B — Vercel Dashboard (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set the **Root Directory** to `frontend`.
4. Framework preset will be detected as **Create React App** automatically.
5. Leave all environment variables empty — none are required.
6. Click **Deploy**.

### Vercel Project Settings

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Create React App |
| Build Command | `yarn build` |
| Output Directory | `build` |
| Install Command | `yarn install` |

No environment variables are required for the static site.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page (hero, features, pricing, waitlist) |
| `/docs` | Documentation — quickstart, architecture, extension reference |
| `/blog` | Blog / changelog |

All routes are handled client-side via React Router. The `vercel.json` rewrite rule ensures deep links work correctly.

---

## Features

- Dark / Light theme toggle (persistent via `next-themes`)
- Scroll-triggered fade-in animations (Framer Motion)
- SEO meta tags + Open Graph + Twitter Card in `public/index.html`
- Fully responsive (mobile menu, adaptive layouts)
- Waitlist form — frontend-only, shows instant success message

---

## Optional: Re-enabling the Backend

If you want to re-enable the FastAPI backend and MongoDB waitlist storage:

1. Deploy the `backend/` directory to Railway, Fly.io, or any container host.
2. Set `REACT_APP_BACKEND_URL=https://your-api.example.com` in Vercel environment variables.
3. Restore the API call in `frontend/src/components/WaitlistSection.js`.

---

## License

MIT
