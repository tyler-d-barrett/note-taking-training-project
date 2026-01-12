import type { AccountRepo } from "./accountRepo.ts";
import type { HttpResult } from "@/shared/httpResult.ts";
import { createToken } from "@/shared/utils.ts";

export function authHandlers(repo: AccountRepo) {
  async function register(
    data: any,
  ): Promise<HttpResult<{ token: string; id: number } | { error: string }>> {
    const { email, password } = data;

    if (!email || !password || password.length < 8) {
      return {
        status: 422,
        json: { error: "Valid email and password (min 8 chars) required" },
      };
    }

    try {
      const hash = await Bun.password.hash(password);
      const id = repo.create(email, hash);

      const token = createToken(id);

      return { status: 201, json: { token, id } };
    } catch (e) {
      return { status: 409, json: { error: "User already exists" } };
    }
  }

  async function login(
    data: any,
  ): Promise<HttpResult<{ token: string } | { error: string }>> {
    const { email, password } = data;

    if (!email || !password) {
      return {
        status: 400,
        json: { error: "Email and password are required" },
      };
    }

    const user = repo.findByEmail(email);

    if (!user) {
      return { status: 401, json: { error: "Invalid credentials" } };
    }

    const isMatch = await Bun.password.verify(password, user.password_hash);

    if (!isMatch) {
      return { status: 401, json: { error: "Invalid credentials" } };
    }

    const token = createToken(user.id);

    return { status: 200, json: { token } };
  }

  return { register, login };
}
