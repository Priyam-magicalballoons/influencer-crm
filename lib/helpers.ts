"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export const tokenExists = async () => {
  try {
    const token = (await cookies()).get("token");
    if (!token) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getRole = async () => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return {
        status: 400,
        role: null,
      };
    }
    const role = jwt.decode(token)?.split("_")[1];
    if (!role) {
      return {
        status: 400,
        role: null,
      };
    }

    return {
      status: 200,
      role: role,
    };
  } catch (error) {
    return {
      status: 400,
      role: null,
    };
  }
};

export const getUserData = async () => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        status: 400,
        user: null,
      };
    }

    const user = jwt.decode(token);

    if (!user) {
      return {
        status: 400,
        user: null,
      };
    }

    const [userId, role] = user?.split("_");

    return {
      status: 200,
      user: {
        userId,
        role,
      },
    };
  } catch (error) {
    return {
      status: 400,
      user: null,
    };
  }
};

export const logoutUser = async () => {
  (await cookies()).delete("token");
  redirect("/login");
};
