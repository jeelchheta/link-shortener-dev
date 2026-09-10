export var Status;
(function (Status) {
    Status["Active"] = "Active";
    Status["Deleted"] = "Deleted";
})(Status || (Status = {}));
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["Pending"] = "Pending";
    SubscriptionStatus["Active"] = "Active";
    SubscriptionStatus["PastDue"] = "PastDue";
    SubscriptionStatus["Canceled"] = "Canceled";
    SubscriptionStatus["Expired"] = "Expired";
})(SubscriptionStatus || (SubscriptionStatus = {}));
export var PlanTypeEnum;
(function (PlanTypeEnum) {
    PlanTypeEnum["Free"] = "Free";
    PlanTypeEnum["standard_month"] = "standard_month";
    PlanTypeEnum["premium_month"] = "premium_month";
})(PlanTypeEnum || (PlanTypeEnum = {}));
export var BraintreeWebhookStatus;
(function (BraintreeWebhookStatus) {
    BraintreeWebhookStatus["subscription_went_active"] = "subscription_went_active";
    BraintreeWebhookStatus["subscription_charged_successfully"] = "subscription_charged_successfully";
    BraintreeWebhookStatus["subscription_charged_unsuccessfully"] = "subscription_charged_unsuccessfully";
    BraintreeWebhookStatus["subscription_went_past_due"] = "subscription_went_past_due";
    BraintreeWebhookStatus["subscription_canceled"] = "subscription_canceled";
    BraintreeWebhookStatus["subscription_expired"] = "subscription_expired";
    BraintreeWebhookStatus["subscription_trial_ended"] = "subscription_trial_ended";
})(BraintreeWebhookStatus || (BraintreeWebhookStatus = {}));
//# sourceMappingURL=index.js.map