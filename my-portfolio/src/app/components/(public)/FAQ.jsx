import { useState } from "react";
import { Code2, Layers, Database, Zap, Globe, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    icon: Code2,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "What technologies do you use in your stack?",
    answer:
      "I build full-stack applications using MongoDB, Express.js, React, and Node.js (MERN), along with Next.js for server-side rendering and static site generation. I also use Tailwind CSS, TypeScript, and REST or GraphQL APIs depending on the project requirements.",
  },
  {
    icon: Layers,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "When should I use Next.js over plain React?",
    answer:
      "Next.js is ideal when you need SEO-friendly pages, server-side rendering, static generation, or file-based routing out of the box. For highly interactive SPAs with no SEO requirements, plain React may suffice — but Next.js is my default choice for most production projects.",
  },
  {
    icon: Database,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "How do you handle databases and data modeling?",
    answer:
      "I primarily use MongoDB with Mongoose for flexible, schema-based data modeling. For relational data needs I work with PostgreSQL. I design schemas with scalability in mind — indexing, population strategies, and aggregation pipelines are all part of my standard workflow.",
  },
  {
    icon: Zap,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "How do you ensure performance in your applications?",
    answer:
      "Performance is built in from the start — code splitting, lazy loading, image optimization via Next.js Image, caching with Redis or SWR, and minimizing client-side JavaScript. I also run Lighthouse audits and Core Web Vitals checks as part of every project delivery.",
  },
  {
    icon: Globe,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "Can you deploy and manage the infrastructure too?",
    answer:
      "Yes. I deploy Next.js projects to Vercel, Node/Express backends to Railway, Render, or AWS EC2, and manage MongoDB on Atlas. I set up CI/CD pipelines using GitHub Actions and handle environment configuration, domain setup, and SSL certificates.",
  },
  {
    icon: GitBranch,
    iconBg: "bg-[#eaf5f7]",
    iconColor: "text-[#1e6a7a]",
    question: "Do you work with existing codebases or only greenfield projects?",
    answer:
      "Both. I regularly join existing projects to refactor legacy code, improve performance, add new features, or migrate from older patterns to modern Next.js App Router architecture. I follow established conventions and document everything clearly for the team.",
  },
];

function ChevronIcon({ open }) {
  return (
    <motion.svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="text-gray-400 shrink-0"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function FAQItem({ faq, index, openIndex, setOpenIndex }) {
  const open = openIndex === index;
  const Icon = faq.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        className="flex items-center gap-3.5 p-5 w-full text-left cursor-pointer group"
        onClick={() => setOpenIndex(open ? null : index)}
        aria-expanded={open}
      >
        <span
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${faq.iconBg}`}
        >
          <Icon size={20} strokeWidth={2} className={faq.iconColor} />
        </span>
        <span className="text-[15px] font-bold text-[#0d2d3a] leading-snug flex-1">
          {faq.question}
        </span>
        <ChevronIcon open={open} />
      </button>

      <motion.div
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div className="px-5 pb-5 pl-[calc(1.25rem+44px+14px)]">
          <p className="text-[13.5px] text-gray-500 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const row1 = faqs.slice(0, 3);
  const row2 = faqs.slice(3, 6);

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-20 font-[Sora,sans-serif]">
      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#1e6a7a] mb-3">
          FAQ
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0d2d3a] tracking-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-base">
          Everything you need to know about working with a full-stack MERN & Next.js developer.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
          {row1.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {row2.map((faq, i) => (
            <FAQItem
              key={i + 3}
              faq={faq}
              index={i + 3}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}