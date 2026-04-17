import { Router } from "express";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find().populate("animalId").sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical records.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    const populatedRecord = await MedicalRecord.findById(record._id).populate("animalId");
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: "Failed to create medical record.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("animalId");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found." });
    }

    res.json(record);
  } catch (error) {
    res.status(400).json({ message: "Failed to update medical record.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found." });
    }

    res.json({ message: "Medical record deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete medical record.", error: error.message });
  }
});

export default router;
