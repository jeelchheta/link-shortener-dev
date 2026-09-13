import type { NextFunction, Request, Response } from "express";
export declare function registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function verifyOTP(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function loginUser(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function forgotpassword(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function setnewpassword(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=usercontroller.d.ts.map