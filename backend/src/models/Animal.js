import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    species: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["rescued", "underTreatment", "readyForAdoption", "adopted"],
      default: "rescued"
    },
    location: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Animal = mongoose.model("Animal", animalSchema);
