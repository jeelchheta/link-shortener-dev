import type { Request } from "express";
import type { IUser } from "../models/User.js";
export declare enum Status {
    Active = "Active",
    Deleted = "Deleted"
}
export declare enum SubscriptionStatus {
    Pending = "Pending",
    Active = "Active",
    PastDue = "PastDue",
    Canceled = "Canceled",
    Expired = "Expired"
}
export type PlanId = "Free" | "standard_month" | "premium_month";
export declare enum PlanTypeEnum {
    Free = "Free",
    standard_month = "standard_month",
    premium_month = "premium_month"
}
export interface UserInfoT extends Request {
    userinfo?: {
        id: string;
        firstname: string;
        lastname: string;
    };
}
export type Pick_IUserEmail = Pick<IUser, "email">;
export type Pick_IUserData = Pick<IUser, "email" | "password" | "firstname" | "lastname">;
export interface TBaseResponse<T> {
    statuscode: number;
    message: string;
    response: T;
}
export interface SaveTransactionParams {
    transaction: any;
    subscription: any;
    userId: any;
    customerId: string;
}
export declare enum BraintreeWebhookStatus {
    subscription_went_active = "subscription_went_active",
    subscription_charged_successfully = "subscription_charged_successfully",
    subscription_charged_unsuccessfully = "subscription_charged_unsuccessfully",
    subscription_went_past_due = "subscription_went_past_due",
    subscription_canceled = "subscription_canceled",
    subscription_expired = "subscription_expired",
    subscription_trial_ended = "subscription_trial_ended"
}
//# sourceMappingURL=index.d.ts.map