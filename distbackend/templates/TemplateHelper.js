import Moment, {} from "moment";
import { DateFormate } from "../constant/constant.js";
import { forgotpassword_txt, otp_txt } from "./TextTemplates.js";
export async function getOTPTemplate(OTPCode, ExpDate) {
    try {
        let parts = otp_txt.split("[Subject:]");
        let subject = parts[0]?.replaceAll("{OTPCode}", OTPCode);
        let body = parts[1]?.
            replaceAll("{OTPCode}", OTPCode).
            replaceAll("{Company}", process.env.AppName || "Company").
            replaceAll("{ExpDate}", Moment(ExpDate).format(DateFormate.MMMMDoYYYYhmmssa));
        return { subject, body };
    }
    catch (err) {
        throw err;
    }
}
export async function getOTPPasswordResetTemplate(req, token, ExpDate) {
    try {
        const protocol = req.protocol, host = req.get("host");
        const resetLink = `${protocol}://${host}/reset-password/${token}`;
        let parts = forgotpassword_txt.split("[Subject:]");
        let subject = parts[0];
        let body = parts[1]?.
            replaceAll("{ResetLink}", resetLink).
            replaceAll("{Company}", process.env.AppName || "Company").
            replaceAll("{ExpDate}", Moment(ExpDate).format(DateFormate.MMMMDoYYYYhmmssa));
        return { subject, body };
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=TemplateHelper.js.map