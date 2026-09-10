import braintree from "braintree";
export declare const PlanType: {
    Free: string;
    standard_month: string;
    premium_month: string;
};
declare const Braintree_Gateway: braintree.BraintreeGateway;
export declare const braintree_Plan_linkLimit: {
    [PlanType.Free]: number;
    [PlanType.standard_month]: number;
    [PlanType.premium_month]: number;
};
export declare const braintree_Plans: ({
    planid: string;
    name: string;
    features: string[];
    price: string;
    trialDuration: null;
    trialDurationUnit: null;
    trialPeriod: boolean;
    braintreeCreatedAt: null;
    braintreeUpdatedAt: null;
    syncedAt: null;
    linkLimit: number | undefined;
} | {
    planid: string;
    name: null;
    features: never[];
    price: null;
    trialDuration: null;
    trialDurationUnit: null;
    trialPeriod: boolean;
    braintreeCreatedAt: null;
    braintreeUpdatedAt: null;
    syncedAt: null;
    linkLimit: number | undefined;
})[];
export declare function braintreePlanSyncBL(): Promise<void>;
export default Braintree_Gateway;
//# sourceMappingURL=braintree.d.ts.map