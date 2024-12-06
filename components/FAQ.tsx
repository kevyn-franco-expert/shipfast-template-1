"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "What does JobHunter help me with?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        JobHunter helps you find the best job listings in your sector, across
        multiple platforms. You can easily create a tailored CV and optimize your
        job search to get the best opportunities in less time.
      </div>
    ),
  },
  {
    question: "Can I cancel my subscription?",
    answer: (
      <p>
        Yes! You can cancel your subscription at any time. Simply go to your
        account settings and follow the cancellation process.
      </p>
    ),
  },
  {
    question: "How can I contact support?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        For any support inquiries, feel free to reach out via email, and our team
        will assist you as soon as possible.
      </div>
    ),
  },
  {
    question: "Can I use JobHunter for free?",
    answer: (
      <p>
        Unfortunately, JobHunter is a paid service. From the moment you sign up, you'll start receiving alerts for job opportunities, including automatic job applications where your profile is automatically matched with relevant opportunities.
      </p>
    ),
  },
  {
    question: "How does JobHunter's automatic application feature work?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        JobHunter automatically applies to job listings that match your profile. By analyzing your skills, experience, and preferences, we ensure that your application is sent to the best opportunities without any extra effort from you.
      </div>
    ),
  },
  {
    question: "How often do I receive alerts about job opportunities?",
    answer: (
      <p>
        Alerts are sent whenever a new job listing that matches your profile becomes available. You will be notified immediately to ensure you never miss out on an opportunity.
      </p>
    ),
  },
  {
    question: "Can I customize the types of jobs I get alerts for?",
    answer: (
      <p>
        Yes! You can customize the types of job opportunities you are interested in by adjusting your preferences in the account settings. This allows you to receive only the most relevant job alerts.
      </p>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
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
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
