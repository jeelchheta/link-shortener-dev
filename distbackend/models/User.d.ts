import { Document } from "mongoose";
import Mongoose from "../config/db.js";
export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    otp?: string;
    otpExpire?: Date;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: Mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map