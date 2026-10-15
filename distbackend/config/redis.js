import { createClient } from "redis";
import { getEnv } from "../utils/utility.js";
export const redisClient = createClient({
    url: getEnv("REDIS_URL")
});
redisClient.on("error", (error) => {
    console.error("Redis error:", error);
});
export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis connected");
    }
};
//# sourceMappingURL=redis.js.map