"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const experiences = [
  {
    title: "Intern — Full-Stack Developer",
    period: "2024 — Early 2024",
    description:
      "Completed a 9-week internship building real-world MERN stack applications, contributing to REST API development, MongoDB schema design, and responsive React UI components under production conditions.",
    align: "left",
  },
  {
    title: "Junior Full-Stack Developer",
    period: "Mid 2024 — 2025",
    description:
      "Developed and maintained full-stack web applications using the MERN stack and Next.js — implementing JWT authentication, Cloudinary image uploads, and TanStack Query for efficient client-side data fetching.",
    align: "right",
  },
  {
    title: "Next.js Developer",
    period: "2025 — Early 2026",
    description:
      "Built production-grade Next.js projects with App Router, SSR/SSG, and optimized Core Web Vitals. Integrated third-party APIs and managed deployments on Vercel with environment-based configurations.",
    align: "left",
  },
  {
    title: "Full-Stack Web Developer",
    period: "2026 — Present",
    description:
      "Designing and delivering end-to-end web solutions independently — from database architecture and Express backends to polished Next.js frontends — with a focus on performance, scalability, and clean code.",
    align: "right",
  },
];

export default function ProfessionalExperience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Professional Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-bold tracking-widest uppercase text-gray-400"
          >
            A Track Record of Results
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Center vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200"
          />

          <div className="flex flex-col gap-20">
            {experiences.map((exp, i) => (
              <div key={exp.title} className="relative flex items-start">

                {/* Dot on the line */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2a7a8a] mt-2 z-10"
                />

                {exp.align === "left" ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="w-1/2 pr-16 text-right"
                    >
                      <h3 className="text-xl font-black text-gray-900 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-[#2a7a8a] font-semibold text-sm mb-3">
                        {exp.period}
                      </p>
                      <p className="text-gray-500 text-base leading-relaxed">
                        {exp.description}
                      </p>
                    </motion.div>
                    <div className="w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="w-1/2" />
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="w-1/2 pl-16"
                    >
                      <h3 className="text-xl font-black text-gray-900 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-[#2a7a8a] font-semibold text-sm mb-3">
                        {exp.period}
                      </p>
                      <p className="text-gray-500 text-base leading-relaxed">
                        {exp.description}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}