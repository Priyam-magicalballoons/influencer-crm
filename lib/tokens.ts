import { sql } from "@/db";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secret = process.env.JWT_SECRET!;

export async function createAccessToken(user: { id: string; role?: string }) {
  return jwt.sign(user, secret, {
    expiresIn: "10s",
    algorithm: "HS256",
  });
}

export async function verifySession() {
  const access = (await cookies()).get("access")?.value;

  if (access) {
    try {
      const payload = jwt.verify(access, secret);

      return { user: payload, status: 200 };
    } catch {}
  } else {
    return {
      status: 400,
      message: "token not exists",
    };
  }

  const refresh = (await cookies()).get("refresh")?.value;
  if (!refresh) return { status: 400, message: "Refresh Token Not Exists" };

  const session = (
    await sql`
    SELECT id, user_id,role, expires_at
    FROM sessions
    WHERE id = ${refresh}
  `
  )[0];

  if (!session || session.expiresAt < new Date()) {
    return { status: 401, message: "Session Expired" };
  }
  const userId = session.user_id;
  const role = session.role;

  const newRefresh = crypto.randomUUID();
  await sql`DELETE FROM sessions WHERE id = ${refresh}`;
  await sql`
    INSERT INTO sessions (id, user_id, role,expires_at)
    VALUES (${newRefresh}, ${userId},${role}, ${new Date(
    Date.now() + 60 * 1000
  )})
  `;

  const newAccess = await createAccessToken({
    id: userId,
    role,
  });

  (await cookies()).set("access", newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  (await cookies()).set("refresh", newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return { user: { userId, role }, status: 200 };
}

export function createRefreshToken() {
  return crypto.randomUUID();
}
