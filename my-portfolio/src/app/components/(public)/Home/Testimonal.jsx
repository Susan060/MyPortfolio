"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
};

const testimonials = [
  {
    quote:
      "Susan's ability to take our vision and turn it into a high-performing reality was incredible. His code is clean, and his eye for UI is unmatched.",
    name: "Kalyan Gharti Gurung",
    role: "UI/UX Designer,lumino Technology",
    avatar: "/Kalyan.jpg",
    rating: 4,
  },
  {
    quote:
      "Working with Susan was a breath of fresh air. He's a fantastic communicator and a brilliant developer who actually cares about the end-user.",
    name: "Prabesh Ghimire",
    role: "SEO Specialist",
    avatar: "/Client3.jpeg",
    rating: 4,
  },
  {
    quote:
      "Working with her was a smooth experience. He built a clean and responsive website, communicated well, and was always open to feedback throughout the project.",
    name: "Ram Prasad Poudel",
    role: "President, FancyAssociationChitwan",
    avatar: "/President.jpg",
    rating: 5,
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className="fill-[#1e6a7a] text-[#1e6a7a]"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-20 md:py-28 font-[Sora,sans-serif]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#1e6a7a] mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-[2.6rem] font-black tracking-tight text-[#0d2d3a]">
            What Clients Say
          </h2>
        </motion.div>

        {/* ── Cards ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(13,45,58,0.08)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-col justify-between gap-6 p-7 rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              {/* Stars + Quote */}
              <div className="flex flex-col gap-4">
                <StarRating count={t.rating} />
                <p className="text-[#0d2d3a] text-[0.93rem] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#eaf5f7]">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d2d3a] leading-tight">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}