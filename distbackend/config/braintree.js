import braintree from "braintree";
import Moment from "moment";
import { DateFormate } from "../constant/constant.js";
import { braintreeplan } from "../models/Plan.js";
import { PlanTypeEnum } from "../types/index.js";
import { getEnv } from "../utils/utility.js";
export const PlanType = {
    Free: PlanTypeEnum.Free?.toString(),
    standard_month: PlanTypeEnum.standard_month?.toString(),
    premium_month: PlanTypeEnum.premium_month?.toString()
};
const Braintree_Gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: getEnv("BRAINTREE_MERCHANTID"),
    publicKey: getEnv("BRAINTREE_PUBLICKEY"),
    privateKey: getEnv("BRAINTREE_PRIVATEKEY"),
});
export const braintree_Plan_linkLimit = {
    [PlanType.Free]: 5,
    [PlanType.standard_month]: 100,
    [PlanType.premium_month]: 500
};
export const braintree_Plans = [
    {
        "planid": PlanType.Free,
        "name": "Free Plan",
        "features": ["5 short links", "Basic click tracking", "Standard short codes"],
        "price": "00.00",
        "trialDuration": null,
        "trialDurationUnit": null,
        "trialPeriod": false,
        "braintreeCreatedAt": null,
        "braintreeUpdatedAt": null,
        "syncedAt": null,
        "linkLimit": braintree_Plan_linkLimit[PlanType.Free]
    },
    {
        "planid": PlanType.standard_month,
        "name": null,
        "features": [],
        "price": null,
        "trialDuration": null,
        "trialDurationUnit": null,
        "trialPeriod": false,
        "braintreeCreatedAt": null,
        "braintreeUpdatedAt": null,
        "syncedAt": null,
        "linkLimit": braintree_Plan_linkLimit[PlanType.standard_month]
    },
    {
        "planid": PlanType.premium_month,
        "name": null,
        "features": [],
        "price": null,
        "trialDuration": null,
        "trialDurationUnit": null,
        "trialPeriod": false,
        "braintreeCreatedAt": null,
        "braintreeUpdatedAt": null,
        "syncedAt": null,
        "linkLimit": braintree_Plan_linkLimit[PlanType.premium_month]
    }
];
export async function braintreePlanSyncBL() {
    try {
        const subscription = await Braintree_Gateway.plan.all();
        // add free plan
        await braintreeplan.updateOne({
            "planid": braintree_Plans[0]?.planid
        }, {
            $set: {
                ...braintree_Plans[0],
                planid: braintree_Plans[0]?.planid,
                braintreeCreatedAt: Date.now(),
                braintreeUpdatedAt: Date.now(),
                syncedAt: Date.now(),
                features: braintree_Plans[0]?.features ?? [],
                linkLimit: braintree_Plans[0]?.linkLimit ?? 0
            }
        }, {
            upsert: true
        });
        await subscription?.plans?.sort((a, b) => a?.id < b?.id ? 1 : (a?.id > b?.id ? -1 : 0))
            ?.forEach(async (e) => {
            const { id, createdAt, updatedAt, description, ...rest } = e;
            let planObj = braintree_Plans.find(e1 => e1.planid == id);
            await braintreeplan.updateOne({
                "planid": e.id
            }, {
                $set: {
                    ...rest,
                    planid: id ?? planObj?.planid,
                    braintreeCreatedAt: createdAt ?? Date.now(),
                    braintreeUpdatedAt: updatedAt ?? Date.now(),
                    syncedAt: Date.now(),
                    features: e?.description?.split(","),
                    linkLimit: planObj?.linkLimit ?? 0
                }
            }, {
                upsert: true
            });
        });
    }
    catch (err) {
        throw new Error("\nbraintree sync error.. " + Moment(new Date()).format(DateFormate.MMMMDoYYYYhmmssa));
    }
}
export default Braintree_Gateway;
//# sourceMappingURL=braintree.js.map