import { Schema } from "mongoose";
import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
const BraintreePlanSchema = new Schema({
    planid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        default: []
    },
    price: {
        type: String,
        required: true,
    },
    trialDuration: {
        type: Number
    },
    trialDurationUnit: {
        type: String
    },
    trialPeriod: {
        type: Boolean
    },
    braintreeCreatedAt: {
        type: Date,
        required: true,
    },
    braintreeUpdatedAt: {
        type: Date,
        required: true,
    },
    syncedAt: {
        type: Date,
        required: true,
    },
    linkLimit: {
        type: Number,
        default: 0,
    },
    // merchantId: {
    //     type: String,
    //     required: true
    // },
    // billingDayOfMonth: {
    //     type: Number
    // },
    // billingFrequency: {
    //     type: Number,
    //     required: true
    // },
    // currencyIsoCode: {
    //     type: String,
    //     required: true
    // },
    // numberOfBillingCycles: {
    //     type: Number
    // }
});
export const braintreeplan = Mongoose.model(DBCollections.braintreeplans, BraintreePlanSchema);
//# sourceMappingURL=Plan.js.map