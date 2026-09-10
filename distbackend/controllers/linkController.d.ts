import type { NextFunction, Request, Response } from "express";
import { type UserInfoT } from "../types/index.js";
export declare function createLink(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getMyLinks(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function deleteLink(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function updateLink(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getStats(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function getLinkAnalytics(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export declare function redirectToOriginal(req: Request, res: Response, next: NextFunction): Promise<Response | undefined | void>;
//# sourceMappingURL=linkController.d.ts.map