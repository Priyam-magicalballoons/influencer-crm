"use server";

import { sql } from "@/db/index";
import { getAllUsers } from "./creator";
import { getALlBrands } from "./brand";
import { setDataIntoRedis } from "@/redis";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "@/lib/tokens";

export const authenticateUser = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    return {
      status: 400,
      message: "Provide all the fields",
      data: {},
    };
  }

  const userExists =
    await sql`SELECT id,name,email,role,password FROM users where email=${email} LIMIT 1`;

  if (!userExists.length) {
    return {
      status: 400,
      message: "Unauthorised User",
      data: {},
    };
  }

  const passwordValid = await bcrypt.compare(password, userExists[0].password);

  if (!passwordValid) {
    return {
      status: 400,
      message: "Unauthorised User",
      data: {},
    };
  }

  const userData = userExists[0];

  const accessToken = await createAccessToken({
    id: userData.id,
    role: userData.role,
  });

  const refreshToken = createRefreshToken();

  await sql`INSERT INTO sessions (
    id,
    user_id,
    role,
    expires_at
    )
     VALUES 
     (
      ${refreshToken},
      ${userData.id},
      ${userData.role},
      ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)})`;

  (await cookies()).set("access", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  (await cookies()).set("refresh", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  const users = await getAllUsers();
  const brands = await getALlBrands();

  await setDataIntoRedis("creators", users);
  await setDataIntoRedis("brand", brands);

  return {
    status: 200,
    message: "Logged In Successfully",
    user: {
      name: userData.name,
    },
  };
};

export type AuthUser = {
  userId: string;
  role: string;
};

export const requireAuth = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
};
