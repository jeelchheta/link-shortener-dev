import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
import { SubscriptionStatus } from "../types/index.js";
const subscriptionSchema = new Mongoose.Schema({
    userid: { type: Mongoose.Schema.Types.ObjectId, ref: DBCollections.users, required: true, index: true },
    braintreeCustomerId: { type: String, required: true },
    planrecordid: { type: Mongoose.Schema.Types.ObjectId, ref: DBCollections.braintreeplans, required: true },
    // Braintree subscription ID
    braintreeSubscriptionId: { type: String, required: true, unique: true, index: true },
    // Braintree plan ID
    braintreePlanId: { type: String, required: true },
    // Braintree payment method token
    braintreePaymentMethodToken: { type: String, default: null, },
    status: {
        type: String,
        enum: [
            SubscriptionStatus.Pending,
            SubscriptionStatus.Active,
            SubscriptionStatus.PastDue,
            SubscriptionStatus.Canceled,
            SubscriptionStatus.Expired
        ],
        default: SubscriptionStatus.Pending, index: true
    },
    price: { type: Number, required: true },
    linkLimit: { type: Number, default: 0, },
    currency: { type: String, default: "USD", uppercase: true, },
    billingDayOfMonth: { type: Number, default: null, },
    firstBillingDate: { type: Date, default: null, },
    nextBillingDate: { type: Date, default: null, },
    paidThroughDate: { type: Date, default: null, },
    numberOfBillingCycles: { type: Number, default: null, },
    neverExpires: { type: Boolean, default: true, },
    canceledAt: { type: Date, default: null, },
    expiresAt: { type: Date, default: null, },
    trialPeriod: { type: Boolean, default: false, },
    trialEndDate: { type: Date, default: null, },
    failureCount: { type: Number, default: 0, },
    lastWebhookAt: { type: Date, default: null, }
}, {
    timestamps: true,
});
export default Mongoose.model(DBCollections.subscriptions, subscriptionSchema);
//# sourceMappingURL=Subscription.js.map