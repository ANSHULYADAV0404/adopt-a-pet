import { Router } from "express";
import crypto from "crypto";
import { User } from "../models/User.js";
import { createAuthToken } from "../utils/authToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getPrimaryAdminApproverIds, getPrimaryAdminApprovers, isAdminApproved } from "../utils/adminApproval.js";

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
    const primaryAdminIds = role === "admin" ? await getPrimaryAdminApproverIds() : [];
    const requiresAdminApproval = role === "admin" && primaryAdminIds.length > 0;
    const user = await User.create({
      role,
      fullName,
      shelterName,
      city,
      phone,
      email,
      passwordHash,
      approvalStatus: requiresAdminApproval ? "pending" : role === "admin" ? "approved" : "notRequired",
      approvalRequestedAt: requiresAdminApproval ? new Date() : undefined,
      approvalResolvedAt: requiresAdminApproval ? undefined : role === "admin" ? new Date() : undefined
    });

    if (requiresAdminApproval) {
      return res.status(202).json({
        message: "Admin registration request sent to the original admins. You can log in after both approvals are completed.",
        user: publicUser(user),
        requiresApproval: true
      });
    }

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

    if (role === "admin" && !isAdminApproved(user)) {
      const message = user.approvalStatus === "rejected"
        ? "Your admin registration was rejected by the original admins."
        : "Your admin registration is waiting for approval from the original admins.";
      return res.status(403).json({ message });
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

router.get("/admin-requests", requireAdmin, async (req, res) => {
  try {
    const primaryAdmins = await getPrimaryAdminApprovers();
    const primaryAdminIds = primaryAdmins.map((admin) => String(admin._id));
    const pendingAdmins = await User.find({ role: "admin", approvalStatus: "pending" })
      .populate("adminApprovalDecisions.adminId", "fullName shelterName email")
      .sort({ approvalRequestedAt: -1, createdAt: -1 });

    res.json({
      canReview: primaryAdminIds.includes(req.auth.id),
      primaryAdmins,
      pendingAdmins
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load admin registration requests.", error: error.message });
  }
});

router.patch("/admin-requests/:id", requireAdmin, async (req, res) => {
  try {
    const { decision, note = "" } = req.body;

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be approved or rejected." });
    }

    const primaryAdmins = await getPrimaryAdminApprovers();
    const primaryAdminIds = primaryAdmins.map((admin) => String(admin._id));

    if (!primaryAdminIds.includes(req.auth.id)) {
      return res.status(403).json({ message: "Only the original admins can review new admin requests." });
    }

    const pendingAdmin = await User.findById(req.params.id);
    if (!pendingAdmin || pendingAdmin.role !== "admin") {
      return res.status(404).json({ message: "Admin registration request not found." });
    }

    if (pendingAdmin.approvalStatus !== "pending") {
      return res.status(409).json({ message: "This admin registration has already been reviewed." });
    }

    const existingDecisionIndex = pendingAdmin.adminApprovalDecisions.findIndex(
      (entry) => String(entry.adminId) === req.auth.id
    );

    const nextDecision = {
      adminId: req.auth.id,
      decision,
      note: note.trim(),
      decidedAt: new Date()
    };

    if (existingDecisionIndex >= 0) {
      pendingAdmin.adminApprovalDecisions[existingDecisionIndex] = nextDecision;
    } else {
      pendingAdmin.adminApprovalDecisions.push(nextDecision);
    }

    const latestApproverDecisions = pendingAdmin.adminApprovalDecisions.filter((entry) =>
      primaryAdminIds.includes(String(entry.adminId))
    );

    const hasRejection = latestApproverDecisions.some((entry) => entry.decision === "rejected");
    const approvedCount = latestApproverDecisions.filter((entry) => entry.decision === "approved").length;
    const requiredApprovals = primaryAdminIds.length || 1;

    if (hasRejection) {
      pendingAdmin.approvalStatus = "rejected";
      pendingAdmin.approvalResolvedAt = new Date();
    } else if (approvedCount >= requiredApprovals) {
      pendingAdmin.approvalStatus = "approved";
      pendingAdmin.approvalResolvedAt = new Date();
    }

    await pendingAdmin.save();

    const refreshedPendingAdmin = await User.findById(req.params.id)
      .populate("adminApprovalDecisions.adminId", "fullName shelterName email");

    res.json({
      message: pendingAdmin.approvalStatus === "approved"
        ? "Admin registration approved successfully."
        : pendingAdmin.approvalStatus === "rejected"
          ? "Admin registration rejected."
          : "Admin approval recorded. Waiting for the other original admin.",
      pendingAdmin: refreshedPendingAdmin
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to review admin registration request.", error: error.message });
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
    email: user.email,
    approvalStatus: user.approvalStatus || (user.role === "admin" ? "approved" : "notRequired")
  };
}

export default router;
