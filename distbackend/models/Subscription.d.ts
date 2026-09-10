import type { Types } from "mongoose";
import Mongoose from "../config/db.js";
export interface SubscriptionT extends Document {
    userid: Types.ObjectId;
    braintreeCustomerId: string;
    planrecordid: Types.ObjectId;
    braintreeSubscriptionId: string;
    braintreePlanId: string;
    braintreePaymentMethodToken: string;
    status: string;
    price: number;
    linkLimit: number;
    currency: string;
    billingDayOfMonth: number;
    nextBillingDate: Date;
    firstBillingDate: Date;
    paidThroughDate: Date;
    numberOfBillingCycles: number;
    neverExpires: boolean;
    canceledAt: Date;
    expiresAt: Date;
    trialPeriod: boolean;
    trialEndDate: Date;
    failureCount: number;
    lastWebhookAt: Date;
}
declare const _default: Mongoose.Model<SubscriptionT, {}, {}, {}, Mongoose.Document<unknown, {}, SubscriptionT, {}, {}> & SubscriptionT & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Subscription.d.ts.map