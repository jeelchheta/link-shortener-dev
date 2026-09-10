import { Types } from "mongoose";
import { type SaveTransactionParams } from "../types/index.js";
export declare function genrateClientTokenBL(): Promise<string>;
export declare function getPlansBL(): Promise<any>;
export declare function getPlanById(planid: string): Promise<any>;
export declare function freePlanSwitch(req: any): Promise<any>;
export declare function gatewayTransaction(plan: any, user: any, req: any): Promise<any>;
export declare const saveTransaction: ({ transaction, subscription, userId, customerId, }: SaveTransactionParams) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Transaction.js").TransactionT, {}, {}> & import("../models/Transaction.js").TransactionT & {
    _id: Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare function getmyplanBL(req: any): Promise<any>;
export declare function getgetmytransactionsBL(req: any): Promise<any>;
export declare function cancelsubscriptionBL(req: any): Promise<void>;
export declare function handleBraintreeWebhook(notification: any): Promise<void>;
//# sourceMappingURL=subscriptionBL.d.ts.map