"use client";

import {useRef, useState} from "react";
import Image from "next/image";

interface Feature {
    title: string;
    description: string;
    type?: "video" | "image";
    path?: string;
    format?: string;
    alt?: string;
}

const features = [
    {
        title: "Job Search",
        description:
            "Find job listings across multiple platforms in one place, saving time by eliminating the need to browse multiple websites.",
        type: "video",
        path: "https://d3m8mk7e1mf7xn.cloudfront.net/app/newsletter.webm",
        format: "video/webm",
    },
    {
        title: "Resume Builder",
        description:
            "Automatically generate a tailored CV based on your pre-uploaded data. Quickly create customized resumes for each job application.",
        type: "image",
        path: "https://images.unsplash.com/photo-1568775972-68d0b6590416?fit=crop&w=500&h=500&q=80",
        alt: "A resume builder",
    },
    {
        title: "Job Alerts",
        description:
            "Receive instant notifications about new job opportunities in your sector, ensuring you never miss out on the best jobs.",
        type: "video",
        path: "https://d3m8mk7e1mf7xn.cloudfront.net/app/newsletter.webm",
        format: "video/webm",
    },
    {
        title: "Remote Jobs",
        description:
            "Find remote work opportunities with the flexibility to work from anywhere, optimizing your search for the best remote roles.",
        type: "video",
        path: "https://d3m8mk7e1mf7xn.cloudfront.net/app/newsletter.webm",
        format: "video/webm",
    },
] as Feature[];

const Item = ({
                  index,
                  feature,
                  isOpen,
                  setFeatureSelected,
              }: {
    index: number;
    feature: Feature;
    isOpen: boolean;
    setFeatureSelected: () => void;
}) => {
    const accordion = useRef(null);
    const {title, description} = feature;

    return (
        <li>
            <button
                className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left border-t md:text-lg border-base-content/10"
                onClick={(e) => {
                    e.preventDefault();
                    setFeatureSelected();
                }}
                aria-expanded={isOpen}
            >
        <span
            className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          <span className={`mr-2`}>{index + 1}.</span>
          <h3 className="inline">{title}</h3>
        </span>
                <svg
                    className={`flex-shrink-0 w-4 h-4 ml-auto fill-current ${
                        isOpen ? "fill-primary" : ""
                    }`}
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`transform origin-center transition duration-200 ease-out ${
                            isOpen && "rotate-180"
                        }`}
                    />
                    <rect
                        y="7"
                        width="16"
                        height="2"
                        rx="1"
                        className={`transform origin-center rotate-90 transition duration-200 ease-out ${
                            isOpen && "rotate-180 hidden"
                        }`}
                    />
                </svg>
            </button>

            <div
                ref={accordion}
                className={`transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden`}
                style={
                    isOpen
                        ? {maxHeight: accordion?.current?.scrollHeight, opacity: 1}
                        : {maxHeight: 0, opacity: 0}
                }
            >
                <div className="pb-5 leading-relaxed">{description}</div>
            </div>
        </li>
    );
};

const Media = ({feature}: { feature: Feature }) => {
    const {type, path, format, alt} = feature;
    const style =
        "rounded-lg aspect-square w-full sm:w-[26rem] border border-base-content/10";
    const size = {
        width: 500,
        height: 500,
    };

    if (type === "video") {
        return (
            <video
                className={style}
                autoPlay
                muted
                loop
                playsInline
                controls
                width={size.width}
                height={size.height}
            >
                <source src={path} type={format}/>
            </video>
        );
    } else if (type === "image") {
        return (
            <Image
                src={path}
                alt={alt}
                className={`${style} object-cover object-center`}
                width={size.width}
                height={size.height}
            />
        );
    } else {
        return <div className={`${style} !border-none`}></div>;
    }
};

const FeaturesAccordion = () => {
    const [featureSelected, setFeatureSelected] = useState<number>(0);

    return (
        <section
            className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100 "
            id="features"
        >
            <div className="px-8">
                <p className="font-medium text-sm text-accent mb-2">
                    There’s a better way to find your dream job
                </p>
                <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
                    All you need to land your ideal job in days, not weeks
                </h2>
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                    <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
                        <ul className="w-full">
                            {features.map((feature, i) => (
                                <Item
                                    key={feature.title}
                                    index={i}
                                    feature={feature}
                                    isOpen={featureSelected === i}
                                    setFeatureSelected={() => setFeatureSelected(i)}
                                />
                            ))}
                        </ul>

                        <Media feature={features[featureSelected]} key={featureSelected}/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesAccordion;