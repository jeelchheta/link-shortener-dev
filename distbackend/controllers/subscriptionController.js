import { cancelsubscriptionBL, freePlanSwitch, genrateClientTokenBL, getgetmytransactionsBL, getmyplanBL, getPlanById, getPlansBL, handleBraintreeWebhook, saveTransaction } from "../BL/subscriptionBL.js";
import { getUserById } from "../BL/userBL.js";
import Braintree_Gateway, { braintreePlanSyncBL, PlanType } from "../config/braintree.js";
import { Message } from "../constant/constant.js";
import SubscriptionModel from "../models/Subscription.js";
import { BaseResponse } from "../utils/utility.js";
// @ Route: api/braintree/plan/sync GET
export async function plansync(req, res, next) {
    try {
        await braintreePlanSyncBL();
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
// @ Route: api/braintree/plan/clienttoken GET
export async function getclienttoken(req, res, next) {
    try {
        const token = await genrateClientTokenBL();
        return res.status(200).json(BaseResponse(200, Message[200], token));
    }
    catch (err) {
        next(err);
    }
}
// @ Route: api/braintree/plans GET
export async function getplans(req, res, next) {
    try {
        const subscription = await getPlansBL();
        return res.status(200).json(BaseResponse(200, Message[200], subscription));
    }
    catch (err) {
        next(err);
    }
}
// @ Route: api/braintree/plans GET
export async function getmyplan(req, res, next) {
    try {
        const subscription = await getmyplanBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], subscription));
    }
    catch (err) {
        next(err);
    }
}
export async function getmytransactions(req, res, next) {
    try {
        const mytransactions = await getgetmytransactionsBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], mytransactions));
    }
    catch (error) {
        next(error);
    }
}
// @ Route: api/braintree/checkout POST
export async function checkout(req, res, next) {
    try {
        let { planId, paymentMethodNonce } = req.body;
        if (!planId) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        if (!(planId == PlanType.Free)) {
            if (!paymentMethodNonce) {
                return res.status(400).json(BaseResponse(400, Message[400], null));
            }
        }
        const plan = await getPlanById(planId);
        if (!plan) {
            return res.status(404).json(BaseResponse(400, Message.Plan_404, null));
        }
        if (plan?.planid == PlanType.Free) {
            await freePlanSwitch(req);
            return res.status(200).json(BaseResponse(200, Message[200], null));
        }
        // 1. Create customer if we don't already have one
        const user = await getUserById(req.userinfo?.id);
        const customerResult = await Braintree_Gateway.customer.create({
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
        });
        if (!customerResult.success) {
            return res.status(400).json(BaseResponse(400, customerResult.message, null));
        }
        // 2. Vault payment method
        const paymentMethodResult = await Braintree_Gateway.paymentMethod.create({
            customerId: customerResult.customer.id,
            paymentMethodNonce,
            options: {
                verifyCard: true
            }
        });
        if (!paymentMethodResult.success) {
            return res.status(400).json(BaseResponse(400, paymentMethodResult.message, null));
        }
        // 3. Create subscription
        const subscriptionResult = await Braintree_Gateway.subscription.create({
            paymentMethodToken: paymentMethodResult.paymentMethod.token,
            planId
        });
        if (!subscriptionResult.success) {
            return res.status(400).json(BaseResponse(400, subscriptionResult.message, null));
        }
        const subscription = subscriptionResult.subscription;
        // 4. create Subscriptiopn in DB
        const mySubscription = await SubscriptionModel.findOneAndUpdate({
            userid: req.userinfo?.id,
        }, {
            $set: {
                userid: user._id,
                braintreeCustomerId: customerResult.customer.id,
                planrecordid: plan._id,
                braintreeSubscriptionId: subscription.id,
                braintreePlanId: subscription.planId,
                braintreePaymentMethodToken: subscription.paymentMethodToken,
                status: subscription.status,
                price: Number(subscription.price),
                linkLimit: Number(plan.linkLimit),
                billingDayOfMonth: subscription.billingDayOfMonth,
                firstBillingDate: subscription.firstBillingDate,
                nextBillingDate: subscription.nextBillingDate,
                paidThroughDate: subscription.paidThroughDate,
                numberOfBillingCycles: subscription.numberOfBillingCycles,
                neverExpires: subscription.neverExpires,
                trialPeriod: subscription.trialPeriod,
                trialEndDate: subscription.trialPeriod
                    ? subscription.firstBillingDate
                    : null,
                failureCount: subscription.failureCount
            }
        }, {
            upsert: true,
            returnDocument: "after"
        });
        // ----------------------------------------
        // 9. Save initial transaction(s)
        // ----------------------------------------
        for (const transaction of subscription?.transactions || []) {
            await saveTransaction({
                transaction,
                subscription: mySubscription,
                userId: req.userinfo?.id,
                customerId: customerResult.customer.id,
            });
        }
        return res.status(200).json(BaseResponse(200, Message[200], mySubscription));
    }
    catch (err) {
        next(err);
    }
}
// @ Route: api/braintree/myplan/cancel POST
export async function cancelmyplan(req, res, next) {
    try {
        const { subscriptionId } = req.body;
        if (!subscriptionId) {
            return res.status(400).json(BaseResponse(400, Message[400], null));
        }
        await cancelsubscriptionBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
export async function braintreeWebhook(req, res, next) {
    try {
        const { bt_signature, bt_payload, } = req.body;
        if (!bt_signature ||
            !bt_payload) {
            return res.status(400).send("Invalid webhook");
        }
        // //dummy for testing in local simulate "subscription_trial_ended" change this funcation and see
        // const sample =
        //     await Braintree_Gateway.webhookTesting.sampleNotification(
        //         "subscription_trial_ended",
        //         req.body?.subscriptionid
        //     );
        // const notification =
        //     await Braintree_Gateway.webhookNotification.parse(
        //         sample.bt_signature,
        //         sample.bt_payload
        //     );
        // // //
        const notification = await Braintree_Gateway.webhookNotification.parse(bt_signature, bt_payload);
        await handleBraintreeWebhook(notification);
        return res.status(200).send("OK");
    }
    catch (error) {
        // return res.status(400).send(
        //     "Webhook processing failed"
        // );
        next(error);
    }
}
//# sourceMappingURL=subscriptionController.js.map