import { Suspense } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import WithWithout from "@/components/WithWithout";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Testimonials3 from "@/components/Testimonials3";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            {/* Add Google Tag Manager Script */}
            <Head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-WV3GTG44');
                        `,
                    }}
                />
            </Head>
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-WV3GTG44"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                ></iframe>
            </noscript>

            {/* App Layout */}
            <Suspense>
                <Header />
            </Suspense>
            <main>
                <Hero />
                <Problem />
                <WithWithout />
                <FeaturesAccordion />
                <Pricing />
                <Testimonials3 />
                <FAQ />
            </main>
            <Footer />
        </>
    );
}