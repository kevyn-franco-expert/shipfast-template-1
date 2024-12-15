import themes from "daisyui/src/theming/themes.js";
import {ConfigProps} from "./types/config";

const config = {
    // REQUIRED
    appName: "JobHunter",
    // REQUIRED: a short description of your app for SEO tags (can be overwritten)
    appDescription:
        "JobHunter helps you find the best job listings, streamline your job search, and create tailored resumes for faster job applications.",
    // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
    domainName: "jobhunter.com",
    crisp: {
        // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
        id: "",
        // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every route, just remove this below
        onlyShowOnRoutes: ["/"],
    },
    stripe: {
        // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
        plans: [
            {
                priceId: "free_trial",
                name: "Starter Plan",
                description: "14-day free trial to kickstart your job search",
                price: 0,
                priceAnchor: 19,
                features: [
                    {name: "Job Alerts"},
                    {name: "AI CV Builder"},
                    {name: "Auto Job Apply"},
                ],
            },
            {
                priceId:
                    process.env.NODE_ENV === "development"
                        ? "price_1QTcbvDDSl6HxoiNycoHuDvN"
                        : "price_1QTcbvDDSl6HxoiNycoHuDvN",
                isFeatured: true,
                name: "Recommended Plan",
                description: "The best choice for active job seekers",
                price: 19,
                priceAnchor: 49,
                features: [
                    {name: "Job Alerts"},
                    {name: "Advanced AI CV Builder"},
                    {name: "Auto Job Apply"},
                    {name: "Priority Support"},
                    {name: "Job Search Optimization"},
                ],
            },
            {
                priceId:
                    process.env.NODE_ENV === "development"
                        ? "prod_RMLIDY8XgQtTdA"
                        : "prod_RMLIDY8XgQtTdA",
                name: "Ultimate Plan",
                description: "For those looking for unlimited features and support",
                price: 299,
                priceAnchor: 329,
                features: [
                    {name: "Unlimited Job Alerts"},
                    {name: "Unlimited AI CV Builder"},
                    {name: "Auto Job Apply"},
                    {name: "Personalized Job Recommendations"},
                    {name: "Career Coaching"},
                    {name: "1-on-1 Support"},
                ],
            },
        ],
    },
    aws: {
        bucket: "bucket-name",
        bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
        cdn: "https://cdn-id.cloudfront.net/",
    },
    mailgun: {
        subdomain: "mg",
        fromNoReply: `JobHunter <noreply@mg.jobhunter.com>`,
        // fromAdmin: `JobHunter Support <support@mg.jobhunter.com>`,
        fromAdmin: `JobHunter Support <kevyn@franco.expert>`,
        // supportEmail: "support@mg.jobhunter.com",
        supportEmail: "kevyn@franco.expert",
        // forwardRepliesTo: "support@jobhunter.com",
        forwardRepliesTo: "kevyn@franco.expert",
    },
    colors: {
        theme: "light",
        main: themes[`[data-theme=light]`]["primary"],
    },
    auth: {
        loginUrl: "/signin",
        callbackUrl: "/dashboard",
    },
} as ConfigProps;

export default config;