"use server";

import { sql } from "@/db/index";
import { getAllUsers } from "./creator";
import { getALlBrands } from "./brand";
import { setDataIntoRedis } from "@/redis";
import bcrypt from "bcryptjs";

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

  const passwordValid = bcrypt.compare(password, userExists[0].password);

  if (!passwordValid) {
    return {
      status: 400,
      message: "Unauthorised User",
      data: {},
    };
  }

  const users = await getAllUsers();
  const brands = await getALlBrands();

  await setDataIntoRedis("creators", users);
  await setDataIntoRedis("brand", brands);

  const userData = userExists[0];
  return {
    status: 200,
    message: "Logged In Successfully",
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
  };
};
