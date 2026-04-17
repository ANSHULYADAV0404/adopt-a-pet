import { Router } from "express";
import { AdoptionRequest } from "../models/AdoptionRequest.js";
import { Animal } from "../models/Animal.js";
import { User } from "../models/User.js";
import { requireAdmin, requireUser } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/mine", requireUser, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ userId: req.auth.id })
      .populate("animalId")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your requests.", error: error.message });
  }
});

router.post("/", requireUser, async (req, res) => {
  try {
    const animal = await Animal.findById(req.body.animalId);
    if (!animal) {
      return res.status(404).json({ message: "Selected animal was not found." });
    }

    if (animal.status === "adopted") {
      return res.status(409).json({ message: "This animal is already adopted." });
    }

    const existingRequest = await AdoptionRequest.findOne({
      animalId: animal._id,
      userId: req.auth.id,
      status: { $in: ["pending", "reviewing", "approved"] }
    });

    if (existingRequest) {
      return res.status(409).json({ message: "You already have an active request for this pet." });
    }

    const user = await User.findById(req.auth.id);
    const request = await AdoptionRequest.create({
      animalId: animal._id,
      userId: req.auth.id,
      adopterName: req.body.adopterName || user?.fullName,
      phone: req.body.phone || user?.phone,
      city: req.body.city || user?.city,
      message: req.body.message
    });
    const populatedRequest = await AdoptionRequest.findById(request._id).populate("animalId");

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: "Failed to create adoption request.", error: error.message });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate("animalId")
      .populate("userId", "fullName email city phone role createdAt")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adoption requests.", error: error.message });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    )
      .populate("animalId")
      .populate("userId", "fullName email city phone role createdAt");

    if (!request) {
      return res.status(404).json({ message: "Adoption request not found." });
    }

    if (status === "completed") {
      await Animal.findByIdAndUpdate(request.animalId?._id || request.animalId, { status: "adopted" });
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: "Failed to update request status.", error: error.message });
  }
});

export default router;
