"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Database, Layout, GitBranch, Layers, Zap } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Next.js Development",
    description:
      "SSR, SSG, ISR, App Router, middleware, and API routes — building fast, SEO-ready production applications.",
  },
  {
    icon: Database,
    title: "Backend & REST APIs",
    description:
      "Node.js + Express REST APIs with JWT authentication, role-based access control, and robust error handling.",
  },
  {
    icon: Layout,
    title: "React & UI Engineering",
    description:
      "Component architecture, custom hooks, TanStack Query, and Tailwind CSS for polished, responsive interfaces.",
  },
  {
    icon: GitBranch,
    title: "MongoDB & Mongoose",
    description:
      "Schema design, aggregation pipelines, indexing strategies, and Cloudinary-integrated file management.",
  },
  {
    icon: Layers,
    title: "Full-Stack Architecture",
    description:
      "End-to-end system design from database modeling to deployment — Vercel, Railway, and cloud infrastructure.",
  },
  {
    icon: Zap,
    title: "Performance & Optimization",
    description:
      "Core Web Vitals tuning, code splitting, lazy loading, caching strategies, and production monitoring.",
  },
];

export default function CoreExpertise() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest uppercase text-[#2a7a8a] mb-4"
          >
            Skill Set
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black text-gray-900"
          >
            Core Development Expertise
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col gap-6"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <skill.icon className="text-[#2a7a8a]" size={28} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {skill.title}
                </h3>
                <p className="text-gray-500 text-base leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}