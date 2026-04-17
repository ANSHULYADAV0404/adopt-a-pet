import { Router } from "express";
import { Volunteer } from "../models/Volunteer.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch volunteers.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ message: "Failed to create volunteer.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found." });
    }

    res.json(volunteer);
  } catch (error) {
    res.status(400).json({ message: "Failed to update volunteer.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found." });
    }

    res.json({ message: "Volunteer deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete volunteer.", error: error.message });
  }
});

export default router;
