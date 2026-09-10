import type { NextFunction, Response } from "express";
import type { UserInfoT } from "../types/index.js";
declare function protect(req: UserInfoT, res: Response, next: NextFunction): Promise<Response | undefined>;
export default protect;
//# sourceMappingURL=auth.middleware.d.ts.map