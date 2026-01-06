"use server";

import { sql } from "@/db";
import { verifySession } from "@/lib/tokens";
import bcrypt from "bcryptjs";

interface CreatorDataProps {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CREATOR";
}

export const createUser = async ({
  email,
  name,
  password,
  role = "CREATOR",
}: CreatorDataProps) => {
  try {
    const sessionData = (await verifySession()) as any;
    if (sessionData.status === 400 || sessionData.status === 401) {
      return sessionData;
    }
    if (sessionData.user.role !== "ADMIN") {
      return {
        status: 403,
        message: "Only Admin can create users",
      };
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    const create = await sql`
    WITH inserted AS (
      INSERT INTO users (
        name,
        email,
        password,
        role
    ) VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        ${role}
    ) ON CONFLICT (email) DO 
    NOTHING RETURNING *) 
    SELECT 
      (SELECT json_agg(inserted) FROM inserted) AS INSERTED,
      (SELECT json_agg(users) FROM users) AS users;
    
    `;

    const row = create[0];
    if (!row.inserted) {
      return {
        status: 500,
        message: "User email already exists",
      };
    }
    return {
      status: 201,
      data: [...row.users, ...row.inserted],
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const data = await sql`SELECT * FROM users`;
    return data;
  } catch (error) {
    return {
      status: 500,
    };
  }
};

export const deleteUser = async () => {
  try {
  } catch (error) {}
};
