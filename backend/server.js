import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import animalRoutes from "./src/routes/animalRoutes.js";
import adoptionRoutes from "./src/routes/adoptionRoutes.js";
import medicalRoutes from "./src/routes/medicalRoutes.js";
import volunteerRoutes from "./src/routes/volunteerRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import { connectDatabase } from "./src/config/db.js";
import { seedDatabaseIfEmpty } from "./src/data/seedDatabase.js";
import { Animal } from "./src/models/Animal.js";
import { Adoption } from "./src/models/Adoption.js";
import { MedicalRecord } from "./src/models/MedicalRecord.js";
import { Volunteer } from "./src/models/Volunteer.js";
import { User } from "./src/models/User.js";
import { AdoptionRequest } from "./src/models/AdoptionRequest.js";
import { requireAdmin } from "./src/middleware/requireAdmin.js";

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://adopt-a-pet-orcin.vercel.app"
];

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  return /^https:\/\/adopt-a-pet(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    }
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Shelter API is running" });
});

app.get("/api/dashboard", requireAdmin, async (_req, res) => {
  try {
    const [animals, adoptions, medicalRecords, volunteers, users, requests] = await Promise.all([
      Animal.countDocuments(),
      Adoption.countDocuments(),
      MedicalRecord.countDocuments(),
      Volunteer.countDocuments(),
      User.countDocuments({ role: "user" }),
      AdoptionRequest.countDocuments()
    ]);

    res.json({ animals, adoptions, medicalRecords, volunteers, users, requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard.", error: error.message });
  }
});

app.get("/api/admin/activity", requireAdmin, async (_req, res) => {
  try {
    const [users, requests] = await Promise.all([
      User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 }),
      AdoptionRequest.find()
        .populate("animalId")
        .populate("userId", "fullName email city phone role createdAt")
        .sort({ createdAt: -1 })
    ]);

    res.json({ users, requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to load user activity.", error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/medical-records", medicalRoutes);
app.use("/api/volunteers", volunteerRoutes);

await connectDatabase();
await seedDatabaseIfEmpty();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
