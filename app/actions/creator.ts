"use server";

import { sql } from "@/db";

interface CreatorDataProps {
  name: string;
  email: string;
  role: "ADMIN" | "CREATOR";
}

export const createUser = async ({
  email,
  name,
  role = "CREATOR",
}: CreatorDataProps) => {
  try {
    const create = await sql`
    WITH inserted AS (
      INSERT INTO users (
        name,
        email,
        role
    ) VALUES (
        ${name},
        ${email},
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
