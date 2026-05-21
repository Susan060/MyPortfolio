"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowLeft, Calendar, Clock, Tag, Briefcase, BarChart2, Plus, X } from "lucide-react";
import { getPublicCaseStudyBySlug } from "@/api/(public)/caseStudies";
import SocialShareButton from "@/app/components/(public)/case-studies/SocialShareButtons";

// ─── Floating TOC Widget ───────────────────────────────────────────────────────
function TableOfContents({ contentRef }) {
  const [open, setOpen] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isFixed, setIsFixed] = useState(true);
  const tocRef = useRef(null);

  // Build headings list from the rendered content DOM
  useEffect(() => {
    if (!contentRef || !contentRef.current) return;

    const buildHeadings = () => {
      const elements = Array.from(
        contentRef.current.querySelectorAll("h2, h3, h4")
      );

      if (elements.length === 0) return;

      const list = [];

      elements.forEach((el, index) => {
        const text = el.textContent?.trim() || "";
        const level = parseInt(el.tagName[1]);

        let id = el.getAttribute("id");

        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `heading-${index}`;

          let uniqueId = id;
          let counter = 1;
          while (list.some((h) => h.id === uniqueId)) {
            uniqueId = `${id}-${counter++}`;
          }
          id = uniqueId;
          el.setAttribute("id", id);
        }

        el.style.scrollMarginTop = "100px";
        list.push({ id, text, level });
      });

      setHeadings(list);
    };

    const timer = setTimeout(buildHeadings, 500);
    return () => clearTimeout(timer);
  }, [contentRef]);

  // Highlight the heading currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.getAttribute("id") || "");
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Switch fixed ↔ absolute when TOC would overlap/pass the article bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef?.current || !tocRef.current) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const tocHeight = tocRef.current.offsetHeight;
      const gap = 24; // 1.5rem = bottom-6

      const spaceBelow = contentRect.bottom - (window.innerHeight - gap - tocHeight - gap);

      setIsFixed(spaceBelow > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [contentRef, headings]);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    if (window.innerWidth < 768) setOpen(false);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div
      ref={tocRef}
      style={
        isFixed
          ? { position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }
          : { position: "absolute", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }
      }
      className="flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-white border border-gray-200 rounded-xl shadow-xl w-72 max-h-80 overflow-y-auto"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                On this page
              </p>
            </div>
            <nav className="p-3 space-y-0.5">
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleClick(h.id)}
                  className={`
                    w-full text-left rounded-lg px-3 py-2 text-sm transition-all duration-150
                    ${h.level === 2 ? "pl-3" : ""}
                    ${h.level === 3 ? "pl-6" : ""}
                    ${h.level === 4 ? "pl-9" : ""}
                    ${activeId === h.id
                      ? "bg-red-50 text-red-500 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="line-clamp-2 leading-snug">{h.text}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border text-sm font-semibold
          transition-all duration-200
          ${open
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          }
        `}
      >
        <span className="uppercase tracking-widest text-xs">On this page</span>
        {open ? <X size={13} /> : <Plus size={13} />}
      </button>
    </div>
  );
}

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [sidebarTop, setSidebarTop] = useState(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["caseStudy", slug],
    queryFn: () => getPublicCaseStudyBySlug(slug),
  });

  const cs = data?.data;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/case-studies/${slug}`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !cs?.featuredImage?.url || !isImageLoaded) return;

    const calculateTop = () => {
      if (!heroRef.current) return;
      try {
        const heroRect = heroRef.current.getBoundingClientRect();
        const heroDocumentTop = heroRect.top + window.scrollY;
        setSidebarTop(heroDocumentTop);
      } catch (error) {
        console.error("Error calculating sidebar top:", error);
      }
    };

    const timeoutId = setTimeout(calculateTop, 100);
    calculateTop();

    window.addEventListener("resize", calculateTop);
    window.addEventListener("scroll", calculateTop);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculateTop);
      window.removeEventListener("scroll", calculateTop);
    };
  }, [cs, isMobile, isImageLoaded]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16 space-y-6">
          <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!cs) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-400">Case study not found</p>
          <Link href="/case-studies" className="text-sm text-red-500 hover:underline">
            ← Back to Case Studies
          </Link>
        </div>
      </main>
    );
  }

  const stickyTop = sidebarTop !== null ? `${sidebarTop}px` : "7rem";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit mb-8"
        >
          <ArrowLeft size={15} />
          Back to Case Studies
        </motion.button>

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">

          {/* ── MAIN CONTENT ── */}
          {/* position:relative is required so the absolute TOC fallback anchors here */}
          <div className="flex-1 min-w-0 space-y-8 relative">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {cs.categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/case-studies/category/${cat.slug}`}
                    className="text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {cs.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {cs.clientName && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} />
                    {cs.clientName}
                  </span>
                )}
                {cs.industry && (
                  <span className="flex items-center gap-1.5">
                    <BarChart2 size={13} />
                    {cs.industry}
                  </span>
                )}
                {cs.projectDuration && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {cs.projectDuration}
                  </span>
                )}
                {cs.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {new Date(cs.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Services */}
              {cs.servicesProvided?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cs.servicesProvided.map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Featured Image */}
            {cs.featuredImage?.url && (
              <motion.div
                ref={heroRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative w-full rounded-2xl overflow-hidden h-50 md:h-96 lg:h-144"
              >
                <Image
                  src={cs.featuredImage.url}
                  alt={cs.featuredImage.altText || cs.title}
                  fill
                  className="object-cover"
                  priority
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setIsImageLoaded(true)}
                />
              </motion.div>
            )}

            {/* Metrics */}
            {cs.metrics?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {cs.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-2xl p-4 text-center space-y-1"
                  >
                    <p className="text-2xl font-black text-red-500">{m.value}</p>
                    <p className="text-xs text-gray-400">{m.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Challenge / Solution / Results - WITH contentRef ATTACHED */}
            <div ref={contentRef}>
              {[
                { label: "The Challenge", html: cs.challenge },
                { label: "Our Solution", html: cs.solution },
                { label: "The Results", html: cs.results },
              ].map(({ label, html }) =>
                html ? (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-3 mb-8"
                  >
                    <h2 className="text-lg font-black text-gray-900">{label}</h2>
                    <div
                      className="prose prose-gray prose-sm md:prose-base max-w-none text-justify
                        prose-headings:font-black prose-headings:text-gray-900 prose-headings:text-left
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-justify
                        prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline
                        [&_a]:text-red-500! [&_a_*]:text-red-500!
                        prose-strong:text-gray-800 [&_a_strong]:text-red-500
                        prose-blockquote:border-red-500 prose-blockquote:text-gray-500
                        prose-img:rounded-xl prose-img:shadow-md"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </motion.div>
                ) : null
              )}

              {/* Testimonial */}
              {cs.testimonial?.quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-l-4 border-red-500 pl-6 py-2 space-y-2 mb-8"
                >
                  <p className="text-gray-600 italic text-base leading-relaxed text-justify">
                    "{cs.testimonial.quote}"
                  </p>
                  <footer className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">
                      {cs.testimonial.author}
                    </span>
                    {cs.testimonial.role && `, ${cs.testimonial.role}`}
                  </footer>
                </motion.blockquote>
              )}
            </div>

            {/* Tags */}
            {cs.tags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200"
              >
                <Tag size={13} className="text-gray-400" />
                {cs.tags.map((tag) => (
                  <Link
                    key={tag._id}
                    href={`/case-studies/tag/${tag.slug}`}
                    className="text-xs border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 px-3 py-1 rounded-full transition-all"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Bottom section with Back to case studies link and Mobile share buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="pt-4"
            >
              {isMobile ? (
                <>
                  <div className="flex flex-col  gap-4">
                    <div className="flex items-center gap-3 w-full justify-center">
                      <span className="text-xs text-gray-400 font-medium">Share this case study:</span>
                      <SocialShareButton
                        title={cs.title}
                        description={cs.description}
                        url={shareUrl}
                        vertical={false}
                      />
                    </div>
                    <div className="w-full border-t border-gray-100"></div>
                    <Link
                      href="/case-studies"
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      Back to all cases
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to all case studies
                </Link>
              )}
            </motion.div>

            {/* ── FLOATING TOC WIDGET ── */}
            {/* Rendered inside the article div so position:absolute fallback anchors correctly */}
            <TableOfContents contentRef={contentRef} />

          </div>{/* end flex-1 */}

          {/* ── STICKY SHARE SIDEBAR — desktop only ── */}
          {!isMobile && (
            <motion.aside
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex flex-col items-center gap-3 w-14 shrink-0"
              style={{
                position: "sticky",
                top: stickyTop,
                alignSelf: "flex-start",
              }}
            >
              <SocialShareButton
                title={cs.title}
                description={cs.description}
                url={shareUrl}
                vertical
              />
            </motion.aside>
          )}

        </div>
      </div>
    </main>
  );
}