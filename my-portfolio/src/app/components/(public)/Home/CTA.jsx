"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  return (
    // 1. Full-width outer wrapper (matches navbar's parent)
    <section className="w-full bg-white py-6">

      {/* 2. Constrained + padded — matches navbar's inner div exactly */}
      <div className="max-w-7xl mx-auto px-6">

        {/* 3. The visible rounded card sits INSIDE the aligned container */}
        <div className="rounded-xl bg-[#1e6a7a] py-24 flex flex-col items-center justify-center text-center gap-8">

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl text-white md:text-5xl font-black tracking-tight text-gray-950 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Ready to Build 
            <br />
            Your <span className="text-[#eaf5f7]">Project?</span>
          </motion.h2>

          <motion.button
            onClick={() => router.push("/contact")}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-10 py-4 bg-[#1e6a7a] hover:bg-[#16566a] text-white font-bold text-base rounded-xl shadow-sm shadow-white transition-colors cursor-pointer"
          >
            Hire me
            <ArrowRight size={18} />
          </motion.button>

        </div>
      </div>
    </section>
  );
}