"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Code2, Smartphone, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { value: "2+",  label: "Years Exp." },
  { value: "20+", label: "Completed" },
  { value: "98%", label: "Happy Clients" },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full pt-20 bg-white overflow-hidden font-[Sora,sans-serif]">
      {/* subtle top-right teal glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none bg-[radial-gradient(ellipse_at_80%_10%,rgba(42,122,138,0.08)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* ── LEFT ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 z-10 max-w-xl">

          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8f4f6] text-[#2a7a8a] text-xs font-semibold border border-[#2a7a8a]/20">
              <span className="w-2 h-2 rounded-full bg-[#2a7a8a]" />
              Full Stack Web Developer
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-[2.85rem] md:text-[3.4rem] font-black leading-[1.12] tracking-tight text-[#0d2d3a]"
          >
            Building Modern<br />
            <span className="text-[#1e6a7a]">Digital Experiences</span><br />
            That Stand Out
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-gray-500 text-[0.95rem] leading-relaxed max-w-md"
          >
            Creative developer building fast, scalable, and visually impressive
            experiences for startups and innovative teams worldwide.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex items-center gap-3 flex-wrap mt-1"
          >
            <motion.button
              onClick={() => router.push("/contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 bg-[#1e6a7a] hover:bg-[#16566a] text-white font-semibold text-sm rounded-lg shadow-md shadow-[#1e6a7a]/25 transition-colors cursor-pointer"
            >
              Hire Me
              <ArrowRight size={15} />
            </motion.button>
            <motion.button
              onClick={() => router.push("/projects")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              View Projects
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex items-center gap-10 mt-4 pt-4 border-t border-gray-100"
          >
            {stats.map((s, i) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-[#0d2d3a] leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT ────────────────────────────────── */}
        <div className="flex-1 flex justify-center items-center relative z-10 max-w-sm w-full">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
            className="relative w-full"
          >
            {/* Photo card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#0d2d3a]/15 border border-gray-100">
              <Image
                src="/Profile1.jpg"
                alt="Profile Photo"
                width={600}
                height={500}
                className="w-full h-[440px] object-cover object-center"
                priority
              />
              {/* subtle bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d3a]/10 via-transparent to-transparent" />
            </div>

            {/* Top-right floating chip — Responsive Design */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-3 -right-3 bg-white rounded-xl shadow-lg border border-gray-100 px-3.5 py-2.5 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e8f4f6] flex items-center justify-center text-[#1e6a7a]">
                <Smartphone size={14} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Responsive Design</span>
            </motion.div>

            {/* Bottom-left floating chip — Clean Code */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg border border-gray-100 px-3.5 py-2.5 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e8f4f6] flex items-center justify-center text-[#1e6a7a]">
                <Code2 size={14} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Clean Code</span>
            </motion.div>

            {/* Bottom-right floating chip — React Expert */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg border border-gray-100 px-3.5 py-2.5 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e8f4f6] flex items-center justify-center text-[#1e6a7a]">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-semibold text-gray-700">React Expert</span>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}