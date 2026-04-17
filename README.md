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

## Current Modules

- Animal registry
- Adoption tracking
- Medical records
- Volunteer management
- English / Hindi bilingual UI
- MongoDB-backed user/admin login and registration
