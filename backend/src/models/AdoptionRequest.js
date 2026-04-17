import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema(
  {
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    adopterName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "approved", "rejected", "completed"],
      default: "pending"
    },
    adminNote: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const AdoptionRequest = mongoose.model("AdoptionRequest", adoptionRequestSchema);
