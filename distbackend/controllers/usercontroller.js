import Moment from "moment";
import { sendEmail } from "../BL/mailHelper.js";
import { forgotpasswordBL, getTokenBaseUser, getUnVerifiedUser, loginUserBL, refreshTokenBL, registerUserBL, updatepasswordBL, validateEmailAndContact, verifyOTPBL } from "../BL/userBL.js";
import { Message, OTP_EXPIRATION_MIN, RESET_TOKEN_EXPIRES_MIN } from "../constant/constant.js";
import { getOTPPasswordResetTemplate, getOTPTemplate } from "../templates/TemplateHelper.js";
import { BaseResponse, durationToMs } from "../utils/utility.js";
// @ Route: api/register POST
export async function registerUser(req, res, next) {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email ||
            !password ||
            !firstname ||
            !lastname) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        let checkEmailAndContact = await validateEmailAndContact(req.body);
        if (checkEmailAndContact) {
            return res.status(409).json(BaseResponse(409, Message[409], null));
        }
        const newUser = await registerUserBL(req.body);
        const { subject, body } = await getOTPTemplate(newUser.otp, newUser.otpExpire);
        await sendEmail(req.body.email, subject, body);
        return res.status(201).json(BaseResponse(201, Message[201], null));
    }
    catch (err) {
        next(err);
    }
}
;
// @ Route: api/verifyotp POST
export async function verifyOTP(req, res, next) {
    try {
        const { email, otp } = req.body;
        if (!otp || !email) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        let checkEmailAndContact = await validateEmailAndContact(req.body);
        if (checkEmailAndContact) {
            return res.status(409).json(BaseResponse(409, Message[409], null));
        }
        const newUser = await getUnVerifiedUser(req.body);
        if (!newUser) {
            return res.status(404).json(BaseResponse(404, Message[404], null));
        }
        else {
            if (otp != newUser.otp) {
                return res.status(400).json(BaseResponse(400, Message[400], null));
            }
            else if (Moment(new Date()).diff(newUser.otpExpire, "minutes") > OTP_EXPIRATION_MIN) {
                return res.status(400).json(BaseResponse(400, Message[400], null));
            }
        }
        await verifyOTPBL(req.body);
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
// @ Route: api/login POST
export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email ||
            !password) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        // Save the new user
        let data = await loginUserBL(req.body);
        if (!data?.token) {
            return res.status(500).json(BaseResponse(500, Message[500], null));
        }
        else {
            const { refreshToken, ...userinfo } = data;
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: durationToMs(String(process.env.JWT_REFRESH_TIMEOUT))
            });
            return res.status(200).json(BaseResponse(200, Message[200], userinfo));
        }
    }
    catch (err) {
        next(err);
    }
}
;
// @ Route: api/login POST
export async function forgotpassword(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        let checkEmailAndContact = await validateEmailAndContact(req.body);
        if (!checkEmailAndContact) {
            return res.status(404).json(BaseResponse(404, Message.User_404, null));
        }
        const newUser = await forgotpasswordBL(req.body);
        const { subject, body } = await getOTPPasswordResetTemplate(req, newUser.token, newUser.tokenExpire);
        await sendEmail(req.body.email, subject, body);
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
;
// @ Route: api/reset-password/:token POST
export async function setnewpassword(req, res, next) {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token || !password) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        let user = await getTokenBaseUser(req.body);
        if (!user) {
            return res.status(404).json(BaseResponse(404, Message[404], null));
        }
        else if (Moment(new Date()).diff(user.resetPasswordExpires, "minutes") > RESET_TOKEN_EXPIRES_MIN) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        await updatepasswordBL({ token: token?.toString(), password: password });
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
;
// @ Route: api/reset-password/:token POST
export async function refreshToken(req, res, next) {
    try {
        const result = req.headers.cookie
            ?.split("; ")
            .find(row => row.startsWith("refreshToken="))
            ?.split("=")[1];
        const refreshToken = result ? decodeURIComponent(result) : null;
        if (!refreshToken) {
            return res.status(401).json(BaseResponse(401, Message.Invalid_expired_token_404, null));
        }
        const token = await refreshTokenBL(refreshToken);
        return res.status(200).json(BaseResponse(200, Message[200], token));
    }
    catch (error) {
        return res.status(401).json(BaseResponse(401, Message.Invalid_expired_token_404, null));
    }
}
//# sourceMappingURL=usercontroller.js.map