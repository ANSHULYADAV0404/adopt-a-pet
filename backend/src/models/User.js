import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    fullName: {
      type: String,
      trim: true
    },
    shelterName: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ["notRequired", "pending", "approved", "rejected"],
      default() {
        return this.role === "admin" ? "approved" : "notRequired";
      }
    },
    approvalRequestedAt: {
      type: Date
    },
    approvalResolvedAt: {
      type: Date
    },
    adminApprovalDecisions: [
      {
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        decision: {
          type: String,
          enum: ["approved", "rejected"],
          required: true
        },
        note: {
          type: String,
          trim: true
        },
        decidedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
