import crypto from "crypto";

const secret = process.env.JWT_SECRET || "pet_adoption_secret";

export function createAuthToken(user) {
  const payload = {
    id: String(user._id),
    role: user.role,
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 12
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    throw new Error("Invalid token format.");
  }

  const expectedSignature = sign(encodedPayload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid token signature.");
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  if (payload.exp < Date.now()) {
    throw new Error("Token expired.");
  }

  return payload;
}

function sign(value) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}
