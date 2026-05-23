"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Discover & Plan",
    description:
      "Understanding business goals, mapping user journeys, and defining the technical stack and architecture before writing a single line of code.",
  },
  {
    number: 2,
    title: "Build the Foundation",
    description:
      "Setting up a clean project structure, database schemas, authentication flows, and CI/CD pipelines for a solid, maintainable base.",
  },
  {
    number: 3,
    title: "Develop & Integrate",
    description:
      "Building features iteratively — REST APIs, dynamic UI, third-party services — with clean code and thorough testing at each step.",
  },
  {
    number: 4,
    title: "Optimize & Ship",
    description:
      "Performance tuning, accessibility checks, and production deployment with monitoring — delivering software that scales and delights users.",
  },
];

export default function Philosophy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left: My Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            My Philosophy
          </h2>
          <div className="w-12 h-1 bg-[#2a7a8a] mb-8" />

          <blockquote className="text-2xl md:text-3xl font-light text-gray-800 leading-snug mb-8">
            &ldquo;Great software isn&apos;t just about working code — it&apos;s
            about building systems that are intuitive for users, maintainable
            for teams, and scalable for the future. I believe every feature
            should solve a real problem elegantly.&rdquo;
          </blockquote>

          <p className="text-gray-500 text-base leading-relaxed">
            Lasting products come from the intersection of clean architecture
            and user-centered thinking. By combining technical rigor with
            product empathy, I build full-stack applications that don&apos;t
            just work today — they evolve gracefully as requirements grow.
          </p>
        </motion.div>

        {/* Right: My Strategic Approach */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-black text-gray-900 mb-10"
          >
            My Development Approach
          </motion.h2>

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-5"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#2a7a8a] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}