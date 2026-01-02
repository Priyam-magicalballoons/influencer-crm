"use server";

import { redis } from "@/redis/client";

export const setDataIntoRedis = async (name: string, data: any) => {
  await redis.del(name);
  const set = await redis.set(name, JSON.stringify(data));
  return set;
};

export const getDataFromRedis = async (name: string) => {
  const data = await redis.get(name);
  return data;
};
