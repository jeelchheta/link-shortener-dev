import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Moment from "moment";
import { OTP_EXPIRATION_MIN, PASSWORD_SALT_ROUNDS } from "../constant/constant.js";
import SubscriptionModel from "../models/Subscription.js";
import UserModel from "../models/User.js";
import { PlanTypeEnum, SubscriptionStatus } from "../types/index.js";
import { generateCode, getEnv } from "../utils/utility.js";
export async function validateEmailAndContact(newUser) {
    try {
        let query = {
            email: newUser.email,
            isVerified: true
        };
        return await UserModel.findOne(query);
    }
    catch (err) {
        throw err;
    }
}
export async function registerUserBL(newUser) {
    try {
        const hashedPassword = await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS);
        const otp = generateCode(6, true), otpExpire = Moment(new Date()).add(OTP_EXPIRATION_MIN, "m");
        await UserModel.updateOne({ email: newUser.email }, {
            $set: {
                email: newUser.email,
                password: hashedPassword,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                otp: otp,
                otpExpire: otpExpire
            }
        }, {
            upsert: true,
            runValidators: true
        });
        return { otp, otpExpire };
    }
    catch (err) {
        throw err;
    }
}
export async function getUnVerifiedUser(newUser) {
    try {
        let query = {
            email: newUser.email,
            isVerified: false
        };
        return await UserModel.findOne(query);
    }
    catch (err) {
        throw err;
    }
}
export async function verifyOTPBL(newUser) {
    try {
        const result = await UserModel.updateOne({ email: newUser.email }, {
            $set: {
                email: newUser.email,
                isVerified: true,
                otp: null
            }
        });
    }
    catch (err) {
        throw err;
    }
}
export async function loginUserBL(newUser) {
    try {
        const user = await UserModel.findOne({ email: newUser.email, isVerified: true });
        const JWT_SECRET = process.env.JWT_SECRET, JWT_TIMEOUT = process.env.JWT_TIMEOUT;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        if (!JWT_TIMEOUT) {
            throw new Error("JWT_TIMEOUT is not defined");
        }
        if (user && bcrypt.compareSync(newUser.password, user.password)) {
            const subscribedPlan = await SubscriptionModel.findOne({
                userid: user._id,
                status: SubscriptionStatus.Active
            });
            const token = jwt.sign({
                id: user._id,
                username: user.email
            }, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
            return {
                id: user._id.toString(),
                firstname: user.firstname,
                lastname: user.lastname,
                plan: subscribedPlan?.braintreePlanId || PlanTypeEnum.Free,
                token: token
            };
        }
    }
    catch (err) {
        throw err;
    }
    return null;
}
export async function getUserById(userid) {
    try {
        return await UserModel.findOne({ _id: userid, isVerified: true });
    }
    catch (err) {
        throw err;
    }
    return null;
}
export async function updateUserSubscription(userid, obj) {
    try {
        await UserModel.updateOne({
            _id: userid
        }, {
            $set: {
                plan: obj.plan,
                planRenewsAt: obj.planRenewsAt
            }
        });
    }
    catch (err) {
        throw err;
    }
}
export async function forgotpasswordBL(newUser) {
    try {
        const token = generateCode(16), tokenExpire = Moment(new Date()).add(getEnv("TOKEN_EXPIRATION_MIN"), "m");
        const result = await UserModel.updateOne({ username: newUser.email }, {
            $set: {
                token: token,
                tokenExpire: tokenExpire
            }
        });
        return { token, tokenExpire };
    }
    catch (err) {
        throw err;
    }
}
export async function getTokenBaseUser(user) {
    try {
        let query = {
            token: user.token,
            isVerified: true
        };
        return await UserModel.findOne(query);
    }
    catch (err) {
        throw err;
    }
}
export async function updatepasswordBL(request) {
    try {
        const hashedPassword = await bcrypt.hash(request.password, PASSWORD_SALT_ROUNDS);
        const result = await UserModel.updateOne({ token: request.token }, {
            $set: {
                token: null,
                password: hashedPassword
            }
        });
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=userBL.js.map