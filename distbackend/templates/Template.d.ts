import type { Request } from "express";
import { type Moment as MomentT } from "moment";
export declare function getOTPTemplate(OTPCode: string, ExpDate: MomentT): Promise<{
    subject: any;
    body: any;
}>;
export declare function getOTPPasswordResetTemplate(req: Request, token: string, ExpDate: MomentT): Promise<{
    subject: string | undefined;
    body: string | undefined;
}>;
//# sourceMappingURL=Template.d.ts.map