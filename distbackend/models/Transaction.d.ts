import type { Types } from "mongoose";
import Mongoose from "../config/db.js";
export interface TransactionT extends Document {
    userid: Types.ObjectId;
    subscriptionid: Types.ObjectId | null;
    braintreeTransactionId: string;
    braintreeCustomerId: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    paymentMethodToken: string | null;
    orderId: string | null;
    transactionDate: Date | null;
    settlementDate: Date | null;
    processorResponseCode: string | null;
    processorResponseText: string | null;
    failureCount: number;
    rawWebhookData: Record<string, any> | null;
}
declare const _default: Mongoose.Model<TransactionT, {}, {}, {}, Mongoose.Document<unknown, {}, TransactionT, {}, {}> & TransactionT & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map