# pet-adoption-system

MERN-style project structure for a Pet Adoption & Animal Shelter Management System.

## Structure

```text
pet-adoption-system/
├── backend/            # Node.js + Express API
├── frontend/           # React + Vite client
└── .gitignore
```

## Run

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

MongoDB should be running locally at `mongodb://127.0.0.1:27017/pet_adoption_system` unless you change `MONGODB_URI` in `backend/.env`.

## Deployment

### Render backend

Set these environment variables on Render:

```bash
MONGO_URI=<your-atlas-connection-string>
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,https://adopt-a-pet-orcin.vercel.app
```

`FRONTEND_URLS` can contain a comma-separated list of Vercel domains and preview URLs.

### Vercel frontend

Set this environment variable on Vercel before building:

```bash
VITE_API_URL=https://adopt-a-pet-gto4.onrender.com/api
```

If `VITE_API_URL` is missing, the app now falls back to localhost during local development and to the Render API in production.

## Current Modules

- Animal registry
- Adoption tracking
- Medical records
- Volunteer management
- English / Hindi bilingual UI
- MongoDB-backed user/admin login and registration
