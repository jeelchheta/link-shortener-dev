import fs from "fs/promises";
import Moment, {} from "moment";
import path from "path";
import { DateFormate, Template_Dir } from "../constant/constant.js";
export async function getOTPTemplate(OTPCode, ExpDate) {
    try {
        const filePath = path.resolve(`${Template_Dir.Base}${Template_Dir.otp_txt}`);
        const data = await fs.readFile(filePath, "utf8");
        let parts = data.split("[Subject:]");
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
        const filePath = path.resolve(`${Template_Dir.Base}${Template_Dir.forgotpassword_txt}`);
        const data = await fs.readFile(filePath, "utf8");
        let parts = data.split("[Subject:]");
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
//# sourceMappingURL=Template.js.map