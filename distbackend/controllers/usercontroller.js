import Moment from "moment";
import { forgotpasswordBL, getTokenBaseUser, getUnVerifiedUser, loginUserBL, registerUserBL, updatepasswordBL, validateEmailAndContact, verifyOTPBL } from "../BL/userBL.js";
import { Message, OTP_EXPIRATION_MIN, TOKEN_EXPIRATION_MIN } from "../constant/constant.js";
import { BaseResponse } from "../utils/utility.js";
import { getOTPPasswordResetTemplate, getOTPTemplate } from "../templates/Template.js";
import { sendEmail } from "../BL/mailHelper.js";
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
        let userinfo = await loginUserBL(req.body);
        if (!userinfo?.token) {
            return res.status(500).json(BaseResponse(500, Message[500], null));
        }
        else {
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
        else if (Moment(new Date()).diff(user.resetPasswordExpires, "minutes") > TOKEN_EXPIRATION_MIN) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        await updatepasswordBL(req.body);
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
;
//# sourceMappingURL=usercontroller.js.map