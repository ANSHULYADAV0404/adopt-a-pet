import { Router } from "express";
import { Animal } from "../models/Animal.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch animals.", error: error.message });
  }
});

router.get("/available", async (_req, res) => {
  try {
    const animals = await Animal.find({ status: { $ne: "adopted" } }).sort({ createdAt: -1 });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available animals.", error: error.message });
  }
});

router.use(requireAdmin);

router.post("/", async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ message: "Failed to create animal.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }

    res.json(animal);
  } catch (error) {
    res.status(400).json({ message: "Failed to update animal.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }

    res.json({ message: "Animal deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete animal.", error: error.message });
  }
});

export default router;
