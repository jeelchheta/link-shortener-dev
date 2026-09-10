import Jwt from "jsonwebtoken";
import { Message } from "../constant/constant.js";
import { BaseResponse } from "../utils/utility.js";
async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader?.startsWith("Bearer ")) {
            return res.status(401).json(BaseResponse(401, Message["No_token_provided"], null));
        }
        const token = authHeader.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        try {
            const userinfo = Jwt.verify(token, JWT_SECRET);
            req.userinfo = {
                id: userinfo.id,
                firstname: userinfo.firstname,
                lastname: userinfo.lastname,
            };
            next();
        }
        catch (err) {
            return res.status(401).json(BaseResponse(401, Message[401], null));
        }
    }
    catch (err) {
        next(err);
    }
}
export default protect;
//# sourceMappingURL=auth.middleware.js.map