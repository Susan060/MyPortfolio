"use client";

import { motion } from "framer-motion";
import { Monitor, ServerCog, Paintbrush2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
};

const services = [
  {
    icon: <Monitor size={20} />,
    title: "Frontend Development",
    description:
      "Building pixel-perfect, interactive, and responsive user interfaces using the latest frameworks like React and Next.js.",
    href: "/services/frontend",
  },
  {
    icon: <ServerCog size={20} />,
    title: "Backend Architecture",
    description:
      "Designing robust server-side systems, APIs, and database structures that are secure, scalable, and efficient.",
    href: "/services/backend",
  },
  {
    icon: <Paintbrush2 size={20} />,
    title: "UI Implementation",
    description:
      "Translating complex designs into high-performance code, ensuring every transition and animation feels natural and polished.",
    href: "/services/ui",
  },
];

export default function Services() {
  const router = useRouter();

  return (
    <section className="w-full bg-white py-20 md:py-28 font-[Sora,sans-serif]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header row ─────────────────────────── */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#1e6a7a] mb-2">
              What I Offer
            </p>
            <h2 className="text-4xl md:text-[2.6rem] font-black tracking-tight text-[#0d2d3a]">
              My Premium Services
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 4 }}
            onClick={() => router.push("/services")}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#1e6a7a] hover:text-[#0d2d3a] transition-colors cursor-pointer bg-transparent border-none"
          >
            View All Services
            <ArrowRight size={15} />
          </motion.button>
        </div>

        {/* ── Cards grid ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(13,45,58,0.09)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative flex flex-col gap-5 p-7 rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer group"
              onClick={() => router.push(svc.href)}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl bg-[#eaf5f7] flex items-center justify-center text-[#1e6a7a] transition-colors   group-hover:bg-[#1e6a7a] group-hover:text-white">
                {svc.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[1.05rem] font-bold text-[#0d2d3a]">
                  {svc.title}
                </h3>
                <p className="text-gray-500 text-[0.88rem] leading-relaxed">
                  {svc.description}
                </p>
              </div>

              {/* Learn More */}
              <motion.div
                className="flex items-center gap-1 text-sm font-semibold text-[#1e6a7a] mt-auto"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Learn More
                <ArrowRight size={14} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile "View All" */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="flex md:hidden justify-center mt-8"
        >
          <button
            onClick={() => router.push("/services")}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1e6a7a] bg-transparent border-none cursor-pointer"
          >
            View All Services <ArrowRight size={14} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}