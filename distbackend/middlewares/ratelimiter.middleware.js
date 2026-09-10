import rateLimit from "express-rate-limit";
import { Message } from "../constant/constant.js";
import { BaseResponse } from "../utils/utility.js";
// Limit brute-force attempts on sensitive auth endpoints
export function limiter(requestsLimit, timeoutMinutes) {
    return rateLimit({
        windowMs: timeoutMinutes * 60 * 1000,
        limit: requestsLimit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ipv6Subnet: 56,
        handler: (req, res) => {
            return res.status(429).json(BaseResponse(429, Message[429], null));
        },
    });
}
//# sourceMappingURL=ratelimiter.middleware.js.map