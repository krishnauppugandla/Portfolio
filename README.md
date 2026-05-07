# Portfolio

My personal portfolio — full stack, with a CMS so I can update content without touching code or redeploying.

React + Vite frontend, Node/Express backend, PostgreSQL for storage. The admin panel covers everything: projects, experience, education, skills, certifications, contact messages, and all the text on the page.

Spent more time than I'd like to admit getting the email notifications working reliably. Moved from creating a new transporter per request to a persistent module-level one with `verify()` on startup — that fixed it. Also burned a while on port conflicts because macOS AirPlay grabs 5000, so the server runs on 5001 now.

## Stack

**Client:** React 18, Vite, Tailwind CSS, Framer Motion, React Router v6

**Server:** Node.js, Express, Prisma ORM, PostgreSQL

**Services:** Cloudinary (image uploads), Nodemailer + Gmail SMTP (contact notifications), JWT auth

## Running locally

You'll need Node 18+ and a Postgres database.

```bash
cd server
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, ADMIN_USERNAME, SMTP creds, Cloudinary keys
npm install
npx prisma db push
node prisma/seed.js    # loads all default content, prints the bcrypt hash for your .env
npm run dev            # starts on :5001
```

```bash
# separate terminal
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:5001/api
npm install
npm run dev            # starts on :5173
```

Copy the hash from the seed output into `server/.env` as `ADMIN_PASSWORD_HASH`, then restart the server.

Admin is at `/admin/login`. Default credentials are in the seed script output.

## Admin panel

Lets you manage every piece of content on the site — projects, work experience, education, skills, certs, and all the text/headings via the Settings page. No rebuild needed, changes are live immediately.

## Deployment

Server → Render. Client → Vercel.

Set env vars on each platform. `CLIENT_URL` in the server env needs to match your Vercel domain or CORS will block requests.

Run `npx prisma db push` against your prod database once before the first deploy.
