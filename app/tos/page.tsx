import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: December 1, 2024

Welcome to JobHunter!

These Terms of Service (“Terms”) govern your use of the JobHunter website at https://jobhunter.ai (“Website”) and the services provided by JobHunter. By accessing or using our Website and Services, you agree to comply with these Terms. If you do not agree with these Terms, please refrain from using our Website and Services.

1. Description of JobHunter

JobHunter is a platform designed to assist job seekers in finding the best job listings by aggregating opportunities from multiple platforms. It allows users to create tailored CVs from their pre-uploaded data and optimize their job search experience. JobHunter aims to simplify and accelerate the job search process by offering efficient tools and personalized recommendations.

2. Ownership and Usage Rights

When you create an account or use JobHunter’s services, you are granted the right to use the features and tools provided to optimize your job search. You retain ownership of your personal data, including your CV, profile information, and any other content you upload to the Website. However, you do not have the right to resell or distribute the content provided by JobHunter without explicit authorization.

We offer a full refund within 7 days of purchase for any paid services or premium features, as outlined in our refund policy.

3. User Data and Privacy

We collect and store user data, including your name, email address, and other personal information, as necessary to provide our services. This data is used to enhance your experience on the platform, such as matching you with relevant job opportunities. For detailed information on how we handle your data, please review our Privacy Policy.

4. Non-Personal Data Collection

JobHunter uses web cookies and similar tracking technologies to collect non-personal data, such as usage patterns, browsing behavior, and device information. This data is used solely to improve our services and enhance the user experience.

5. Governing Law

These Terms are governed by the laws of the jurisdiction in which JobHunter operates, as specified in our Terms of Service. Any disputes arising from or related to these Terms will be resolved under these laws.

6. Updates to the Terms

JobHunter reserves the right to update or modify these Terms at any time. Users will be notified of any significant changes via email or through our Website. Continued use of the Website or Services after any updates constitutes acceptance of the revised Terms.

7. Contact Information

For any questions or concerns regarding these Terms of Service, please contact us at contact@jobhunter.ai.

Thank you for using JobHunter!
          `}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
