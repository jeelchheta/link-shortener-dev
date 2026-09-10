import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
export declare function sendEmail(to: string, subject: string | undefined, text: string | undefined): Promise<SMTPTransport.SentMessageInfo | undefined>;
//# sourceMappingURL=mailHelper.d.ts.map