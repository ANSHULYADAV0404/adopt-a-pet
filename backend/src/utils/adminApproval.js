import { User } from "../models/User.js";

export function approvedAdminFilter() {
  return {
    role: "admin",
    $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: "approved" }]
  };
}

export async function getPrimaryAdminApprovers() {
  return User.find(approvedAdminFilter())
    .sort({ createdAt: 1 })
    .limit(2)
    .select("fullName shelterName city phone email approvalStatus createdAt");
}

export async function getPrimaryAdminApproverIds() {
  const admins = await getPrimaryAdminApprovers();
  return admins.map((admin) => String(admin._id));
}

export function isAdminApproved(user) {
  return user?.role === "admin" && !["pending", "rejected"].includes(user?.approvalStatus);
}
