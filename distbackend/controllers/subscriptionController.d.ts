import type { NextFunction, Request, Response } from "express";
import type { UserInfoT } from "../types/index.js";
export declare function plansync(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getclienttoken(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getplans(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getmyplan(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getmytransactions(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function checkout(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function cancelmyplan(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function braintreeWebhook(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
//# sourceMappingURL=subscriptionController.d.ts.map