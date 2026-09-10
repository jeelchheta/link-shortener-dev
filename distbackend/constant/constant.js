import { PlanTypeEnum } from "../types/index.js";
export const Message = {
    400: "Bad Request",
    401: "Unauthorized – Authentication required",
    409: "Conflict",
    404: "Not Found",
    429: "Too many requests. Please try again later.",
    500: "Internal Server Error",
    200: "OK – success.",
    201: "Created",
    "Internal_S_E": 'Internal Server Error',
    "No_token_provided": 'Unauthorized: No token provided',
    "Invalid_token": 'Invalid token',
    "Plan_404": "Plan Not Found",
    "Card_402": "Payment was declined. Please try a different card.",
    "Subscription_404": "Subscription not found",
    "Valid_URL_400": "Please provide a valid Link",
    "Plan_limit_reached_403": (linkLimit, name) => `You've reached the ${linkLimit}-link limit for the ${name} plan. Upgrade to create more.`,
    "ShortCode_403": `Custom short codes are available on ${PlanTypeEnum.standard_month?.toString()} and ${PlanTypeEnum.premium_month?.toString()} plans.`,
    "Short_code_409": "This custom short code is already taken",
    "Link_404": "Link not found",
    "Link_410": "This link has been disabled or may be removed by its owner",
    "Link_410_1": "This link has expired",
    "User_404": "User not found",
    "Custom_code_404": "Custom code must be 1-20 characters (letters, numbers, - or _)"
};
export const DBCollections = {
    users: "users",
    subscriptions: "subscriptions",
    braintreeplans: "braintreeplans",
    links: "links"
};
export const DateFormate = {
    MMMMDoYYYYhmmssa: "MMMM Do YYYY, h:mm:ss a"
};
export const OTP_EXPIRATION_MIN = Number(process.env.OTP_EXPIRATION_MIN) || 5;
export const TOKEN_EXPIRATION_MIN = Number(process.env.TOKEN_EXPIRATION_MIN) || 5;
export const PASSWORD_SALT_ROUNDS = 10;
export const Template_Dir = {
    Base: "backend/templates",
    otp_txt: "/otp.txt",
    forgotpassword_txt: "/forgotpassword.txt"
};
//# sourceMappingURL=constant.js.map