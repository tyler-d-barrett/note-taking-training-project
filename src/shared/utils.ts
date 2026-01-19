import { CryptoHasher } from "bun";

const SECRET = process.env.APP_SECRET || "training-secret-key-123";
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

//create a token with accountId, expiration date, and sign with secret
export function createToken(accountId: number): string {
  const expiresAt = Date.now() + ONE_DAY_MS;
  const payload = `${accountId}:${expiresAt}`;

  const hasher = new CryptoHasher("sha256", SECRET);
  hasher.update(payload);
  const signature = hasher.digest("hex");

  return `${accountId}.${expiresAt}.${signature}`;
}

//verify that supplied token matches secret signature
export function verifyToken(token: string): number | null {
  const [accountId, expirationDate, providedSignature] = token.split(".");

  if (!accountId || !expirationDate || !providedSignature) return null;

  const expiresAt = parseInt(expirationDate, 10);
  if (Date.now() > expiresAt) {
    return null;
  }

  const payload = `${accountId}:${expirationDate}`;
  const hasher = new CryptoHasher("sha256", SECRET);
  hasher.update(payload);
  const expectedSignature = hasher.digest("hex");

  if (providedSignature === expectedSignature) {
    return parseInt(accountId, 10);
  }

  return null;
}

//pull token off request header
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
