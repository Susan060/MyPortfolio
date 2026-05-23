"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const skills = [
  "React & Next.js",
  "UI/UX Implementation",
  "Node.js / Express",
  "Tailwind CSS",
];

export default function About() {
  return (
    <section className="w-full bg-white py-20 md:py-28 overflow-hidden font-[Sora,sans-serif]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-stretch gap-20">

        {/* ── LEFT — photo ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative shrink-0 w-full md:w-[42%] self-stretch"
        >
          {/* light background rect */}
          <div className="absolute inset-0 rounded-3xl bg-[#eef2f5]" />

          {/* photo fills full height */}
          <div className="relative z-10 rounded-3xl overflow-hidden h-full">
            <Image
              src="/Profile4.jpg"
              alt="Profile Photo"
              width={560}
              height={640}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
        </motion.div>

        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 self-center" />

        {/* ── RIGHT — text content ─────────────────── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Section label */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-xs font-bold tracking-[0.18em] uppercase text-[#1e6a7a]"
          >
            About Me
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-4xl md:text-[2.6rem] font-black leading-[1.12] tracking-tight text-[#0d2d3a]"
          >
            Passionate About<br />
            Building Exceptional<br />
            Software
          </motion.h2>

          {/* Para 1 */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="text-gray-500 text-[0.92rem] leading-relaxed"
          >
            I am a dedicated Full Stack Developer with a flair for crafting beautiful,
            functional interfaces. With over 8 years in the tech industry, I specialize in
            translating complex business requirements into seamless digital experiences.
          </motion.p>

          {/* Para 2 */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="text-gray-500 text-[0.92rem] leading-relaxed"
          >
            My approach combines technical precision with creative problem-solving. I
            don&apos;t just write code; I architect systems that help businesses grow and
            users succeed.
          </motion.p>

          {/* Skills & Technologies */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="flex flex-col gap-3 mt-2"
          >
            <p className="text-sm font-bold text-[#1e6a7a]">Skills &amp; Technologies</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-1.5 rounded-full border border-[#2a7a8a]/20 bg-[#eaf5f7] text-[#1e6a7a] text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

{/* Download Resume */}
          <motion.a
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/Susan_Adhikari_CV_v3.pdf"
            download
            className="self-start flex items-center gap-2 px-6 py-3 bg-[#eaf5f7] hover:bg-[#d4ecf0] border border-[#2a7a8a]/25 text-[#1e6a7a] font-semibold text-sm rounded-xl transition-colors cursor-pointer mt-1"
          >
              <Download size={15} />
               Download CV
            </motion.a>

        </div>
      </div>
    </section>
  );
}