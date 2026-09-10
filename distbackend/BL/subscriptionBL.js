import { Types } from "mongoose";
import Braintree_Gateway from "../config/braintree.js";
import { DBCollections } from "../constant/constant.js";
import { braintreeplan } from "../models/Plan.js";
import SubscriptionModel from "../models/Subscription.js";
import TransactionModel from "../models/Transaction.js";
import UserModel from "../models/User.js";
import { BraintreeWebhookStatus, SubscriptionStatus } from "../types/index.js";
export async function genrateClientTokenBL() {
    try {
        const result = await Braintree_Gateway.clientToken.generate({});
        if (!result.success) {
            throw new Error(result.message);
        }
        return result.clientToken;
    }
    catch (err) {
        throw err;
    }
}
export async function getPlansBL() {
    try {
        const result = await braintreeplan.find().sort({ syncedAt: 1 });
        return result;
    }
    catch (err) {
        throw err;
    }
}
export async function getPlanById(planid) {
    try {
        const result = await braintreeplan.findOne({ planid: planid });
        return result;
    }
    catch (err) {
        throw err;
    }
}
export async function freePlanSwitch(req) {
    try {
        const result = await UserModel.updateOne({
            _id: req.userinfo?.id
        }, {
            $set: {
                plan: req?.planId,
                planRenewsAt: null
            }
        });
        return result;
    }
    catch (err) {
        throw err;
    }
}
export async function gatewayTransaction(plan, user, req) {
    try {
        const saleResult = await Braintree_Gateway.transaction.sale({
            amount: plan.price,
            paymentMethodNonce: req?.body?.paymentMethodNonce,
            customer: user.braintreeCustomerId
                ? undefined
                : { firstName: `${user.firstname} ${user.lastname}`, email: user.email },
            customerId: user.braintreeCustomerId || undefined,
            options: {
                submitForSettlement: true,
                storeInVaultOnSuccess: true,
            },
        });
        return saleResult;
    }
    catch (err) {
        throw err;
    }
}
export const saveTransaction = async ({ transaction, subscription, userId, customerId, }) => {
    try {
        if (!transaction?.id) {
            return null;
        }
        return TransactionModel.findOneAndUpdate({
            braintreeTransactionId: transaction.id,
        }, {
            $set: {
                subscriptionid: subscription?._id || null,
                braintreeSubscriptionId: subscription?.braintreeSubscriptionId || null,
                status: transaction.status,
                amount: Number(transaction.amount || 0),
                currency: transaction.currencyIsoCode || "USD",
                type: transaction.type,
                paymentMethodToken: transaction.paymentMethodToken || null,
                orderId: transaction.orderId || null,
                transactionDate: transaction.createdAt || null,
                settlementDate: transaction.settlementDate || null,
                processorResponseCode: transaction.processorResponseCode || null,
                processorResponseText: transaction.processorResponseText || null,
                rawWebhookData: transaction,
            },
            $setOnInsert: {
                braintreeTransactionId: transaction.id,
                userid: userId,
                braintreeCustomerId: customerId,
                failureCount: 0,
            },
        }, {
            upsert: true,
            new: true,
        });
    }
    catch (err) {
        throw err;
    }
};
export async function getmyplanBL(req) {
    try {
        const subscription = await SubscriptionModel.findOne({ userid: req.userinfo.id });
        return subscription;
    }
    catch (err) {
        throw err;
    }
}
export async function getgetmytransactionsBL(req) {
    try {
        const subscription = await TransactionModel.aggregate([
            {
                $match: {
                    userid: new Types.ObjectId(req.userinfo.id)
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: DBCollections.subscriptions,
                    localField: "subscriptionid",
                    foreignField: "_id",
                    as: "subscription"
                }
            },
            {
                $unwind: "$subscription"
            },
            {
                $project: {
                    amount: 1,
                    status: 1,
                    createdAt: 1,
                    braintreeTransactionId: 1,
                    braintreePlanId: "$subscription.braintreePlanId"
                }
            }
        ]);
        // ({ userid: req.userinfo.id })
        //     .select(`amount status createdAt updatedAt`);
        return subscription;
    }
    catch (err) {
        throw err;
    }
}
export async function cancelsubscriptionBL(req) {
    try {
        let result = await Braintree_Gateway.subscription.cancel(req.body.subscriptionId);
        if (!result.success) {
            throw new Error("subscription cancellation error");
        }
        await SubscriptionModel.findOneAndUpdate({
            braintreeSubscriptionId: req.body.subscriptionId,
            userid: req.userinfo.id,
        }, {
            $set: {
                status: SubscriptionStatus.Canceled,
                canceledAt: new Date(),
                lastWebhookAt: new Date()
            }
        });
    }
    catch (err) {
        throw err;
    }
}
export async function handleBraintreeWebhook(notification) {
    switch (notification.kind) {
        case BraintreeWebhookStatus.subscription_went_active:
            await subscriptionWentActive(notification);
            break;
        case BraintreeWebhookStatus.subscription_charged_successfully:
            await subscriptionChargedSuccessfully(notification);
            break;
        case BraintreeWebhookStatus.subscription_charged_unsuccessfully:
            await subscriptionChargedUnsuccessfully(notification);
            break;
        case BraintreeWebhookStatus.subscription_went_past_due:
            await subscriptionWentPastDue(notification);
            break;
        case BraintreeWebhookStatus.subscription_canceled:
            await subscriptionCanceled(notification);
            break;
        case BraintreeWebhookStatus.subscription_expired:
            await subscriptionExpired(notification);
            break;
        case BraintreeWebhookStatus.subscription_trial_ended:
            await subscriptionTrialEnded(notification);
            break;
        default:
            console.log("Unhandled Braintree event:", notification.kind);
    }
}
;
async function subscriptionWentActive(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            console.error("Subscription not found:", btSubscription.id);
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                status: SubscriptionStatus.Active,
                nextBillingDate: btSubscription.nextBillingDate,
                paidThroughDate: btSubscription.paidThroughDate,
                billingDayOfMonth: btSubscription.billingDayOfMonth,
                lastWebhookAt: notification.timestamp,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionChargedSuccessfully(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            console.error("Subscription not found:", btSubscription.id);
            return;
        }
        // Update subscription
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                status: SubscriptionStatus.Active,
                failureCount: 0,
                nextBillingDate: btSubscription.nextBillingDate,
                paidThroughDate: btSubscription.paidThroughDate,
                lastWebhookAt: notification.timestamp,
            },
        });
        // Save transaction
        for (const transaction of btSubscription.transactions || []) {
            await saveTransaction({
                transaction,
                subscription,
                userId: subscription.userid,
                customerId: subscription.braintreeCustomerId,
            });
        }
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionChargedUnsuccessfully(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $inc: {
                failureCount: 1,
            },
            $set: {
                lastWebhookAt: notification.timestamp,
            },
        });
        // Save failed transaction
        for (const transaction of btSubscription.transactions || []) {
            await saveTransaction({
                transaction,
                subscription,
                userId: subscription.userid,
                customerId: subscription.braintreeCustomerId,
            });
        }
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionWentPastDue(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                status: SubscriptionStatus.PastDue,
                lastWebhookAt: notification.timestamp,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionCanceled(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                status: SubscriptionStatus.Canceled,
                canceledAt: notification.timestamp,
                lastWebhookAt: notification.timestamp,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionExpired(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                status: SubscriptionStatus.Expired,
                expiresAt: notification.timestamp,
                lastWebhookAt: notification.timestamp,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
async function subscriptionTrialEnded(notification) {
    try {
        const btSubscription = notification.subscription;
        const subscription = await SubscriptionModel.findOne({
            braintreeSubscriptionId: btSubscription.id,
        });
        if (!subscription) {
            return;
        }
        await SubscriptionModel.updateOne({
            _id: subscription._id,
        }, {
            $set: {
                trialPeriod: false,
                nextBillingDate: btSubscription.nextBillingDate,
                lastWebhookAt: notification.timestamp,
            },
        });
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=subscriptionBL.js.map