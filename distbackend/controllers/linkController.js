import { createLinkBL, deleteLinkBL, getLinkAnalyticsBL, getMyLinksBL, getStatsBL } from "../BL/linkBL.js";
import { braintree_Plan_linkLimit, braintree_Plans, PlanType } from "../config/braintree.js";
import { Message } from "../constant/constant.js";
import LinkModel, {} from "../models/Link.js";
import SubscriptionModel from "../models/Subscription.js";
import { Link_404, Link_Expired_410, Link_Unavailable_410 } from "../templates/HtmlTemplate.js";
import { Status, SubscriptionStatus } from "../types/index.js";
import { BaseResponse, generateCode, isValidCustomCode, isValidHttpUrlRegex } from "../utils/utility.js";
// @route   POST /api/links
export async function createLink(req, res, next) {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl || !isValidHttpUrlRegex(originalUrl)) {
            return res.status(400).json(BaseResponse(400, Message.Valid_URL_400, null));
        }
        // Enforce plan link limits
        const subscription = await SubscriptionModel.findOne({ userid: req.userinfo?.id, status: SubscriptionStatus.Active });
        const existingCount = await LinkModel.countDocuments({ userid: req.userinfo?.id, status: Status.Active });
        if (!subscription) {
            if (existingCount >= (braintree_Plans[0]?.linkLimit || 0)) {
                return res.status(403).json(BaseResponse(403, Message.Plan_limit_reached_403(braintree_Plans[0]?.linkLimit?.toString(), braintree_Plans[0]?.planid?.toString()), null));
            }
        }
        else {
            if (existingCount >= (braintree_Plan_linkLimit[subscription?.braintreePlanId] || 0)) {
                return res.status(403).json(BaseResponse(403, Message.Plan_limit_reached_403(subscription?.linkLimit?.toString(), subscription.braintreePlanId), null));
            }
        }
        // premium_month not match can not add tags and expiredate
        if (subscription?.braintreePlanId !== PlanType.premium_month) {
            req.body.tags = [];
            req.body.expiresAt = null;
        }
        // standard_month and premium_month not match can not add customCode
        if (subscription?.braintreePlanId !== PlanType.standard_month &&
            subscription?.braintreePlanId !== PlanType.premium_month) {
            req.body.customCode = "";
        }
        // Custom short codes are a paid feature
        let shortCode = req.body.customCode?.trim();
        if (shortCode && !subscription) {
            return res.status(403).json(BaseResponse(403, Message.ShortCode_403, null));
        }
        if (shortCode) {
            if (!isValidCustomCode(shortCode)) {
                return res.status(400).json(BaseResponse(400, Message.Custom_code_404, null));
            }
            const existing = await LinkModel.findOne({ shortCode, status: Status.Active });
            if (existing) {
                return res.status(409).json(BaseResponse(409, Message.Short_code_409, null));
            }
        }
        else {
            shortCode = generateCode(6);
        }
        const link = await createLinkBL(req, shortCode);
        return res.status(201).json(BaseResponse(201, Message[200], link));
    }
    catch (err) {
        next(err);
    }
}
// @route   GET /api/links
export async function getMyLinks(req, res, next) {
    try {
        const links = await getMyLinksBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], links));
    }
    catch (error) {
        next(error);
    }
}
;
// @route DELETE api/links/:id
export async function deleteLink(req, res, next) {
    try {
        await deleteLinkBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], null));
    }
    catch (err) {
        next(err);
    }
}
// @route put api/links/:id
export async function updateLink(req, res, next) {
    try {
        const { id } = req.params;
        const { isActive, tags, expiresAt } = req.body;
        const link = await LinkModel.findOne({
            _id: id,
            userid: req.userinfo?.id
        });
        if (!link) {
            return res.status(404).json(BaseResponse(404, Message.Link_404, null));
        }
        if (typeof isActive === "boolean")
            link.isActive = isActive;
        if (Array.isArray(tags))
            link.tags = tags.slice(0, 5);
        if (expiresAt !== undefined)
            link.expiresAt = expiresAt || undefined;
        await link.save();
        return res.status(200).json(BaseResponse(200, Message[200], link));
    }
    catch (err) {
        next(err);
    }
}
// @route   GET /api/links/stats
// @desc    Aggregate dashboard stats: totals + last-14-days click series
export async function getStats(req, res, next) {
    try {
        const result = await getStatsBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], result));
    }
    catch (err) {
        next(err);
    }
}
// @route   GET /api/links/:id/analytics
export async function getLinkAnalytics(req, res, next) {
    try {
        const link = await LinkModel.findById({
            _id: req.params.id,
            userid: req.userinfo?.id,
            status: Status.Active,
        });
        if (!link) {
            res.status(404).json({ message: "LinkModel not found" });
            return;
        }
        const linkanalytics = await getLinkAnalyticsBL(req);
        return res.status(200).json(BaseResponse(200, Message[200], linkanalytics));
    }
    catch (err) {
        next(err);
    }
}
;
// @route   GET /r/:code  (public redirect, mounted separately without /api prefix)
export async function redirectToOriginal(req, res, next) {
    try {
        const { code } = req.params;
        const link = await LinkModel.findOne({
            shortCode: code
        });
        if (!link) {
            return res.status(404).send(Link_404);
        }
        if (!link.isActive || link.status === Status.Deleted) {
            return res.status(410).send(Link_Unavailable_410);
        }
        if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
            return res.status(410).send(Link_Expired_410);
        }
        link.clicks += 1;
        link.clickHistory.push({ date: new Date() });
        // Keep click history bounded so documents don't grow unbounded forever
        if (link.clickHistory.length > 2000) {
            link.clickHistory = link.clickHistory.slice(-2000);
        }
        await link.save();
        return res.redirect(link.originalUrl);
    }
    catch (err) {
        next();
    }
}
//# sourceMappingURL=linkController.js.map