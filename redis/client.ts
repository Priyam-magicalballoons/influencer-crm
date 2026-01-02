import { Redis } from "@upstash/redis";

// 👇 we can now import our redis client anywhere we need it
export const redis = Redis.fromEnv();
