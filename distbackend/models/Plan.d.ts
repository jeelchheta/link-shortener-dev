import Mongoose from "../config/db.js";
export interface BraintreePlanT extends Document {
    planid: string;
    merchantId: string;
    billingDayOfMonth?: null;
    billingFrequency: number;
    currencyIsoCode: string;
    description?: string;
    name: string;
    numberOfBillingCycles: null;
    price: string;
    trialDuration: null;
    trialDurationUnit: null;
    trialPeriod: boolean;
    braintreeCreatedAt: Date;
    braintreeUpdatedAt: Date;
    addOns?: null;
    discounts?: null;
    syncedAt: Date;
    linkLimit: Number;
    features: string[];
}
export declare const braintreeplan: Mongoose.Model<BraintreePlanT, {}, {}, {}, Mongoose.Document<unknown, {}, BraintreePlanT, {}, {}> & BraintreePlanT & {
    _id: Mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=Plan.d.ts.map