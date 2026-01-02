"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const generateJWTToken = async (userId: string) => {
  try {
    if (!userId) {
      return {
        status: 400,
      };
    }

    const token = jwt.sign(userId, process.env.JWT_SECRET!);

    (await cookies()).set("token", token);

    return {
      status: 200,
    };
  } catch (error) {
    return {
      status: 400,
    };
  }
};

export const verifyJWT = async (token: string) => {
  try {
    if (!token) {
      return {
        status: 400,
        message: "Token not provided",
      };
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!userId) {
      return {
        status: 400,
        message: "Unauthorised token",
      };
    }

    return {
      status: 200,
      message: token,
    };
  } catch (error) {}
};
