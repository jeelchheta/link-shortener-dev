import express, {} from "express";
import { createLink, deleteLink, getLinkAnalytics, getMyLinks, getStats, updateLink } from "../controllers/linkController.js";
import { braintreeWebhook, cancelmyplan, checkout, getclienttoken, getmyplan, getmytransactions, getplans } from "../controllers/subscriptionController.js";
import { forgotpassword, loginUser, registerUser, setnewpassword, verifyOTP } from "../controllers/usercontroller.js";
import protect from "../middlewares/auth.middleware.js";
import { limiter } from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();
router.post("/register", limiter(5, 15), registerUser);
router.post("/verifyotp", limiter(5, 15), verifyOTP);
router.post("/login", limiter(5, 15), loginUser);
router.post('/forgot-password', limiter(5, 15), forgotpassword);
router.post('/reset-password/:token', setnewpassword);
router.post("/links", protect, createLink);
router.get("/links", protect, getMyLinks);
router.get("/links/stats", protect, getStats);
router.get("/links/:id/analytics", protect, getLinkAnalytics);
router.put("/links/:id", protect, updateLink);
router.delete("/links/:id", protect, deleteLink);
// router.get("/braintree/plan/sync", plansync); /* dev api */
router.get("/braintree/clienttoken", protect, getclienttoken);
router.get("/braintree/plans", limiter(100, 5), getplans);
router.get("/braintree/myplan", protect, getmyplan);
router.get("/braintree/transactions", protect, getmytransactions);
router.post("/braintree/checkout", protect, checkout);
router.post("/braintree/myplan/cancel", protect, cancelmyplan);
router.post("/webhooks/braintree", braintreeWebhook);
export default router;
//# sourceMappingURL=index.js.map