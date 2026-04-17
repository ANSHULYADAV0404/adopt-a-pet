import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/pet_adoption_system";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    const atlasHint = mongoUri.includes("mongodb+srv://") && mongoUri.includes("cluster0.mongodb.net");
    console.error("MongoDB connection failed:", error.message);

    if (atlasHint) {
      console.error(
        "Your Atlas URI looks incomplete. Replace 'cluster0.mongodb.net' with the exact hostname from MongoDB Atlas, or use a local URI like 'mongodb://127.0.0.1:27017/pet_adoption_system'."
      );
    }

    process.exit(1);
  }
}
