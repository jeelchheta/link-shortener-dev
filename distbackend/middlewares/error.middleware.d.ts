import type { NextFunction, Request, Response } from "express";
declare function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export default errorMiddleware;
//# sourceMappingURL=error.middleware.d.ts.map