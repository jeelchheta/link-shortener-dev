import { type ILink } from "../models/Link.js";
import { type UserInfoT } from "../types/index.js";
export declare function createLinkBL(req: UserInfoT, shortCode: Pick<ILink, "shortCode">): Promise<any>;
export declare function getMyLinksBL(req: UserInfoT): Promise<any>;
export declare function deleteLinkBL(req: UserInfoT): Promise<any>;
export declare function getStatsBL(req: UserInfoT): Promise<any>;
export declare function getLinkAnalyticsBL(req: UserInfoT): Promise<any>;
//# sourceMappingURL=linkBL.d.ts.map