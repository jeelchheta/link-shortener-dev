import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
const transactionSchema = new Mongoose.Schema({
    userid: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: DBCollections.users,
        required: true,
        index: true,
    },
    subscriptionid: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: DBCollections.subscriptions,
        default: null,
        index: true,
    },
    braintreeTransactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    braintreeCustomerId: {
        type: String,
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
    },
    status: {
        type: String,
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
    },
    paymentMethodToken: {
        type: String,
        default: null,
    },
    orderId: {
        type: String,
        default: null,
    },
    transactionDate: {
        type: Date,
        default: null,
    },
    settlementDate: {
        type: Date,
        default: null,
    },
    processorResponseCode: {
        type: String,
        default: null,
    },
    processorResponseText: {
        type: String,
        default: null,
    },
    failureCount: {
        type: Number,
        default: 0,
    },
    rawWebhookData: {
        type: Mongoose.Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: true,
});
export default Mongoose.model("transactions", transactionSchema);
//# sourceMappingURL=Transaction.js.map