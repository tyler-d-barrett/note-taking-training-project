// src/auth/utils.ts
import { CryptoHasher } from "bun";

const SECRET = process.env.APP_SECRET || "training-secret-key-123";

export function createToken(accountId: number): string {
  const hasher = new CryptoHasher("sha256", SECRET);
  hasher.update(accountId.toString());
  const signature = hasher.digest("hex");

  return `${accountId}.${signature}`;
}

export function verifyToken(token: string): number | null {
  const [idStr, providedSignature] = token.split(".");
  if (!idStr || !providedSignature) return null;

  const hasher = new CryptoHasher("sha256", SECRET);
  hasher.update(idStr);
  const expectedSignature = hasher.digest("hex");

  if (providedSignature === expectedSignature) {
    return parseInt(idStr, 10);
  }

  return null;
}

export function getAuthenticatedId(req: Request): number | null {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
