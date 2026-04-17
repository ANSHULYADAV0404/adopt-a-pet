import { Router } from "express";
import crypto from "crypto";
import { User } from "../models/User.js";
import { createAuthToken } from "../utils/authToken.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { role, fullName, shelterName, city, phone, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email, and password are required." });
    }

    if (role === "user" && !fullName) {
      return res.status(400).json({ message: "Full name is required for user registration." });
    }

    if (role === "admin" && !shelterName) {
      return res.status(400).json({ message: "Shelter name is required for admin registration." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = hashPassword(password);
    const user = await User.create({
      role,
      fullName,
      shelterName,
      city,
      phone,
      email,
      passwordHash
    });

    return res.status(201).json({
      message: `${role === "admin" ? "Admin" : "User"} registered successfully.`,
      user: publicUser(user),
      token: createAuthToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email, and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.role !== role) {
      return res.status(401).json({ message: "Invalid credentials for the selected portal." });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials for the selected portal." });
    }

    return res.json({
      message: `${role === "admin" ? "Admin" : "User"} logged in successfully.`,
      user: publicUser(user),
      token: createAuthToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(":");
  const hashBuffer = Buffer.from(key, "hex");
  const suppliedBuffer = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(hashBuffer, suppliedBuffer);
}

function publicUser(user) {
  return {
    id: user._id,
    role: user.role,
    fullName: user.fullName,
    shelterName: user.shelterName,
    city: user.city,
    phone: user.phone,
    email: user.email
  };
}

export default router;
