"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, BadgeCheck, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";

const certifications = [
  {
    icon: Award,
    title: "Meta Front-End Developer Professional Certificate",
  },
  {
    icon: BadgeCheck,
    title: "MongoDB Node.js Developer Path",
  },
  {
    icon: ShieldCheck,
    title: "Next.js & React — The Complete Guide (Udemy)",
  },
  {
    icon: Trophy,
    title: "AWS Certified Cloud Practitioner",
  },
];

export default function Certifications() {
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
            Professional Credentials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black text-gray-900"
          >
            Certifications
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
            >
              <cert.icon className="text-[#2a7a8a]" size={32} strokeWidth={1.5} />
              <p className="text-gray-900 text-base font-medium leading-snug">
                {cert.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <Link
            href={"/contact"}
            className="bg-[#2a7a8a] hover:bg-[#235f6e] transition-colors duration-200 text-white font-bold text-base px-10 cursor-pointer py-4 rounded-xl"
          >
            Work With Me
          </Link>
        </motion.div>

      </div>
    </section>
  );
}