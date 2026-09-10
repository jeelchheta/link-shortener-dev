import { Document, Schema, Types } from "mongoose";
import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
import { Status } from "../types/index.js";
const linkSchema = new Schema({
    originalUrl: {
        type: String,
        required: [true, "Original Link is required"],
        trim: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    clickHistory: {
        type: [{ date: { type: Date, default: Date.now } }],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    expiresAt: {
        type: Date,
        default: null
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: DBCollections.users,
        required: true,
    },
    status: {
        type: String,
        enum: [
            Status.Active,
            Status.Deleted
        ],
        default: Status.Active
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default Mongoose.model(DBCollections.links, linkSchema);
//# sourceMappingURL=Link.js.map