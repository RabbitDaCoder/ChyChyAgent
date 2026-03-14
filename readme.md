# ChyChyAgent

Real estate and insurance platform for **Eloike Maryann** (Maryann Chieboam Eloike) — a Lagos-based advisor with 15+ years of industry experience across AIICO Insurance and AY Housing.

Built with the MERN stack (MongoDB, Express, React, Node.js), AI-assisted blog workflow (Groq), Cloudinary for assets, and Redis for refresh tokens.

## Tech Stack

| Layer    | Stack                                                 |
| -------- | ----------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Zustand  |
| Backend  | Node.js, Express, MongoDB (Mongoose), Redis (ioredis) |
| Auth     | JWT access + refresh tokens, httpOnly cookies         |
| Media    | Cloudinary image uploads                              |
| AI       | Groq API (blog generation, SEO, rewriting)            |
| Deploy   | Client → Vercel · API → Render                        |

## Project Structure

```
api/                    # Express backend
├── controllers/        # Route handlers
├── libs/               # DB, Redis, Cloudinary config
├── middlewares/         # Auth, admin, error handling, uploads
├── models/             # Mongoose schemas (Blog, Listing, Insurance, Contact, User)
├── routes/             # Express routers
├── utils/              # Helpers (AppError, asyncHandler, token utils)
├── seed.js             # Database seed script
└── server.js           # Entry point

client/                 # Vite + React frontend
├── src/
│   ├── components/     # Reusable UI, layout, shared components
│   ├── data/           # Static data (about.js — owner profile)
│   ├── hooks/          # Custom hooks (useListings, useBlogs, etc.)
│   ├── pages/          # Public + admin pages
│   ├── stores/         # Zustand stores (useUserStore, useBlogStore)
│   └── utils/          # Axios instance, formatters, schema builders
└── index.html
```

## API Routes

| Prefix              | Description                                   |
| ------------------- | --------------------------------------------- |
| `/api/v1/auth`      | Login, logout, refresh, profile, upload image |
| `/api/v1/blogs`     | CRUD, publish, feature, upload cover          |
| `/api/v1/listings`  | CRUD, status, feature                         |
| `/api/v1/insurance` | CRUD insurance plans                          |
| `/api/v1/contact`   | Submit + admin list/read/delete enquiries     |
| `/api/v1/ai`        | AI blog generation, SEO, rewriting (admin)    |
| `/api/v1/admins`    | Manage admins (superadmin only)               |

## Design System

- **Display font**: Cormorant Garamond
- **Body font**: DM Sans
- **Mono font**: DM Mono
- **Primary**: Rose gold `#C9896B`
- **Background**: Ivory `#FDFAF7`
- **Palette tokens**: Defined in `client/src/index.css` + `tailwind.config.js`

## Setup

### Backend

```bash
cd api
npm install
cp .env.example .env   # Fill in values
npm run dev             # nodemon
```

### Frontend

```bash
cd client
npm install
cp .env.example .env   # Set VITE_API_URL, VITE_SITE_URL, VITE_WHATSAPP_NUMBER
npm run dev             # Vite dev server
```

### Seed Database

```bash
cd api
node seed.js            # Seeds superadmin, listings, insurance, blogs
```

## Environment Variables

### `api/.env`

```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
UPSTASH_REDIS_URL=
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=
```

### `client/.env`

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SITE_URL=http://localhost:5173
VITE_WHATSAPP_NUMBER=2348012345678
```

## Deployment

| Service | Platform | Config                              |
| ------- | -------- | ----------------------------------- |
| Client  | Vercel   | `client/vercel.json` — SPA rewrites |
| API     | Render   | `render.yaml` — Node web service    |

**Vercel**: Set root directory to `client`, framework preset to Vite, add `VITE_API_URL` pointing to Render API URL.

**Render**: Create Web Service from repo, set root to `api`, add all env vars. Set `CLIENT_URL` to the Vercel client URL for CORS.

## Key Features

- Role-based admin system (superadmin / admin)
- AI-powered blog generation with Groq
- Real-time WhatsApp integration for enquiries
- Cloudinary image management
- Calendly consultation booking (popup widget)
- SEO with structured data (JSON-LD schemas)
- Comprehensive About page with career timeline, stats, gallery
- Owner profile: Maryann Chieboam Eloike — 15 years across AIICO Insurance (10 years) and AY Housing (5 years)

## License

ISC
