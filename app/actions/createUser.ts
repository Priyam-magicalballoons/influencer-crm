"use server";

import { sql } from "@/db/index";
import { getAllUsers } from "./creator";
import { getALlBrands } from "./brand";
import { setDataIntoRedis } from "@/redis";

export const authenticateUser = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    return {
      status: 400,
      message: "Provide all the fields",
      data: {},
    };
  }

  const userExists =
    await sql`SELECT id,name,email,role FROM users where email=${email} LIMIT 1`;

  if (!userExists.length) {
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

  return {
    status: 200,
    message: "Logged In Successfully",
    data: userExists[0],
  };
};
