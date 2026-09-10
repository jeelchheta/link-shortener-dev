import { Document, Types } from "mongoose";
import Mongoose from "../config/db.js";
export interface IClickEvent {
    date: Date;
}
export interface ILink extends Document {
    originalUrl: string;
    shortCode: string;
    clicks: number;
    clickHistory: IClickEvent[];
    tags: string[];
    isActive: boolean;
    expiresAt?: Date;
    userid: Types.ObjectId;
    status: string;
    createdAt: Date;
}
declare const _default: Mongoose.Model<ILink, {}, {}, {}, Document<unknown, {}, ILink, {}, {}> & ILink & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Link.d.ts.map