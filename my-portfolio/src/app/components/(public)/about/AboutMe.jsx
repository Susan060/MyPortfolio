"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// --- Animated Counter Hook ---
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

// --- Stat Card ---
function StatCard({ label, value, suffix, sub, delay, inView }) {
  const count = useCounter(value, 1800, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm flex flex-col gap-2"
    >
      <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
        {label}
      </span>
      <span className="text-4xl font-black text-gray-900 tracking-tight leading-none">
        {count}
        {suffix}
      </span>
      <span className="text-sm font-semibold text-[#2a7a8a]">{sub}</span>
    </motion.div>
  );
}

// --- Global Stat Card (non-numeric) ---
function GlobalStatCard({ label, value, sub, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm flex flex-col gap-2"
    >
      <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
        {label}
      </span>
      <span className="text-4xl font-black text-gray-900 tracking-tight leading-none">
        {value}
      </span>
      <span className="text-sm font-semibold text-[#2a7a8a]">{sub}</span>
    </motion.div>
  );
}

// --- Main About Section ---
export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const stats = [
    { label: "Experience", value: 2, suffix: "+ Years", sub: "Expert Level", numeric: true },
    { label: "Projects", value: 6, suffix: "+", sub: "Industries Served", numeric: true },
    { label: "Apps Shipped", value: 10, suffix: "+", sub: "Production Deployments", numeric: true },
    { label: "Clients", value: "Regional", sub: "Pokhara,Chitwan", numeric: false },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="max-w-7xl pt-20 mx-auto px-6">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row items-center gap-35 mb-16">
          {/* Left: Text */}
          <div className="flex-1 max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold tracking-widest uppercase text-[#2a7a8a] mb-4"
            >
              Professional Profile
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight"
            >
              About <span className="text-[#2a7a8a]">Me</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              I specialize in building high-performance, scalable web applications
              using Next.js and the MERN stack. With 1+ years of hands-on experience,
              I bridge the gap between clean architecture and exceptional user
              experience — crafting full-stack solutions from database design to
              polished frontend interfaces. My work integrates RESTful APIs,
              server-side rendering, and modern React patterns to deliver products
              that are fast, maintainable, and built to scale.
            </motion.p>
          </div>

          {/* Right: Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md lg:max-w-lg shrink-0"
          >
            {/* Decorative offset shadow */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#d4eef1] -z-10" />

            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative">
              <Image
                src="/Profile1.jpg"
                alt="Profile photo"
                width={610}
                height={480}
                className="w-full h-120 object-cover object-center"
                priority
              />

              {/* Current Role Badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#2a7a8a] px-7 py-5">
                <p className="text-[#a8d8df] text-xs font-bold tracking-widest uppercase mb-1">
                  Current Role
                </p>
                <p className="text-white text-xl font-bold tracking-tight">
                  Full-Stack Web Developer
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) =>
            stat.numeric ? (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                sub={stat.sub}
                delay={0.1 + i * 0.1}
                inView={isInView}
              />
            ) : (
              <GlobalStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                sub={stat.sub}
                delay={0.1 + i * 0.1}
                inView={isInView}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}