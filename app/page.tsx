import {Suspense} from 'react'
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
            <Suspense>
                <Header/>
            </Suspense>
            <main>
                <Hero/>
                <Problem/>
                <WithWithout/>
                <FeaturesAccordion/>
                <Pricing/>
                <Testimonials3/>
                <FAQ/>
            </main>
            <Footer/>
        </>
    );
}