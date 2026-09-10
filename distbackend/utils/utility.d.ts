import type { TBaseResponse } from "../types/index.js";
export declare function BaseResponse<T>(statuscode: number, message: string, response: T): TBaseResponse<T>;
export declare function generateCode(length?: number, onlyNumber?: boolean): string;
export declare function getEnv(name: string): string;
export declare function isValidHttpUrlRegex(string: string): boolean;
export declare function isValidCustomCode(string: string): boolean;
//# sourceMappingURL=utility.d.ts.map