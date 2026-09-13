import Moment from "moment";
import type { IUser } from "../models/User.js";
import { type Pick_IUserData, type Pick_IUserEmail } from "../types/index.js";
export declare function validateEmailAndContact(newUser: Pick_IUserEmail): Promise<IUser | null>;
export declare function registerUserBL(newUser: Pick_IUserData): Promise<any>;
export declare function getUnVerifiedUser(newUser: Pick_IUserEmail): Promise<IUser | null>;
export declare function verifyOTPBL(newUser: Pick_IUserEmail): Promise<void>;
export declare function loginUserBL(newUser: Pick<IUser, "email" | "password">): Promise<any>;
export declare function getUserById(userid: string | undefined): Promise<any>;
export declare function updateUserSubscription(userid: string, obj: {
    plan: string;
    planRenewsAt: Date;
}): Promise<any>;
export declare function forgotpasswordBL(newUser: Pick_IUserEmail): Promise<{
    token: string;
    tokenExpire: Moment.Moment;
}>;
export declare function getTokenBaseUser(user: {
    token: string;
}): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare function updatepasswordBL(request: {
    token: string;
    password: string;
}): Promise<void>;
export declare function refreshTokenBL(refreshToken: string): Promise<string>;
//# sourceMappingURL=userBL.d.ts.map