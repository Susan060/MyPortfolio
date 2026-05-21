"use client";

import { useEffect, useState } from "react";
import { getPublicCaseStudies } from "@/api/(public)/caseStudies";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

// ── Single card ────────────────────────────────────────────────────────────
function CaseStudyCard({ study }) {
  const imageUrl = study.featuredImage?.url || null;
  const tags = study.tags || [];

  return (
    <Link href={`/case-studies/${study.slug}`} className="h-full group">
      <article className="bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-gray-100">

        {/* Thumbnail */}
        <div className="h-52 overflow-hidden bg-slate-100 rounded-t-2xl">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={study.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-3 flex-1">

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-3 py-1"
                >
                  {tag?.name ?? tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {study.title}
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed">
            {study.excerpt || study.description}
          </p>

          {/* Key Result */}
          {study.keyResult && (
            <div className="border-l-[3px] border-red-600 bg-slate-50 rounded-r-lg px-4 py-3 mt-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Key Result
              </span>
              <span className="text-xl font-extrabold text-red-600 leading-tight">
                {study.keyResult}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 mt-auto pt-2 group-hover:text-red-600 transition-colors duration-200">
            View Full Case Study
            <ArrowRight size={15} />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Filter tabs ────────────────────────────────────────────────────────────
const FILTERS = ["All", "NEXT JS", "MERN"];

// ── Section ────────────────────────────────────────────────────────────────
export default function CaseStudy({ limit = 3 }) {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicCaseStudies({ limit });
        setStudies(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load case studies.");
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  const filtered =
    activeFilter === "All"
      ? studies
      : studies.filter((s) =>
          (s.tags || []).some(
            (t) => (t?.name ?? t)?.toLowerCase() === activeFilter.toLowerCase()
          )
        );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          {/* Left: label + heading */}
          <div>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
              Portfolio
            </p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Latest Projects
            </h2>
          </div>

          {/* Right: filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 self-start sm:self-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-sm">Loading case studies…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-red-500 text-sm">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            No case studies found.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((study) => (
              <CaseStudyCard
                key={study._id ?? study.id ?? study.slug}
                study={study}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}