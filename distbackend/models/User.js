import bcrypt from "bcrypt";
import crypto from "crypto";
import { Document, Schema } from "mongoose";
import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: 60,
    },
    lastname: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: 60,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    resetPasswordToken: { type: String, select: false, default: null },
    resetPasswordExpires: { type: Date, select: false, default: null },
    otp: String,
    otpExpire: Date,
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
// Generates a raw token (sent via email) and stores its hashed version + expiry
userSchema.methods.generateResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
    const expiresMin = Number(process.env.RESET_TOKEN_EXPIRES_MIN || 30);
    this.resetPasswordExpires = new Date(Date.now() + expiresMin * 60 * 1000);
    return rawToken;
};
export default Mongoose.model(DBCollections.users, userSchema);
//# sourceMappingURL=User.js.map