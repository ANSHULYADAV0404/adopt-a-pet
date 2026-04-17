import { Router } from "express";
import { Adoption } from "../models/Adoption.js";
import { Animal } from "../models/Animal.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const adoptions = await Adoption.find().populate("animalId").sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adoptions.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const adoption = await Adoption.create(req.body);
    await Animal.findByIdAndUpdate(req.body.animalId, { status: "adopted" });
    const populatedAdoption = await Adoption.findById(adoption._id).populate("animalId");
    res.status(201).json(populatedAdoption);
  } catch (error) {
    res.status(400).json({ message: "Failed to create adoption.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("animalId");

    if (!adoption) {
      return res.status(404).json({ message: "Adoption not found." });
    }

    res.json(adoption);
  } catch (error) {
    res.status(400).json({ message: "Failed to update adoption.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndDelete(req.params.id);

    if (!adoption) {
      return res.status(404).json({ message: "Adoption not found." });
    }

    res.json({ message: "Adoption deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete adoption.", error: error.message });
  }
});

export default router;
