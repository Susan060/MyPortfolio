"use client";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, X, ChevronDown, Plus, Loader2 } from "lucide-react";
import { getTags, createTag } from "@/api/(public)/tags";
import { getCategories, createCategory } from "@/api/(public)/categories";

// ─── Helpers ────────────────────────────────────────────────
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const countWords = (text) => text.split(" ").filter(Boolean).length;

const keywordInText = (text, keyword) => {
  if (!text || !keyword) return false;
  const normalizedText = text.toLowerCase();
  const normalizedKw = keyword.toLowerCase();
  if (normalizedText.includes(normalizedKw)) return true;
  const kwWords = normalizedKw.replace(/-/g, " ").split(" ").filter(Boolean);
  return kwWords.every((word) => normalizedText.includes(word));
};

const getKeywordDensity = (text, keyword) => {
  if (!text || !keyword) return 0;
  const words = text.split(" ").filter(Boolean);
  const kwWords = keyword.split(" ").filter(Boolean);
  let matchCount = 0;
  for (let i = 0; i <= words.length - kwWords.length; i++) {
    const slice = words.slice(i, i + kwWords.length).join(" ");
    if (slice === keyword) matchCount++;
  }
  return words.length > 0 ? (matchCount / words.length) * 100 : 0;
};

const getHeadings = (html) => {
  if (!html) return { h2: [], h3: [] };
  const h2 = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map((m) =>
    stripHtml(m[1]).toLowerCase()
  );
  const h3 = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)].map((m) =>
    stripHtml(m[1]).toLowerCase()
  );
  return { h2, h3 };
};

const getFirstParagraph = (html) => {
  if (!html) return "";
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  return match ? stripHtml(match[1]).toLowerCase() : "";
};

const hasImages = (html) => !!html && /<img[^>]+>/i.test(html);

const allImagesHaveAlt = (html) => {
  if (!html) return false;
  const images = [...html.matchAll(/<img[^>]+>/gi)];
  if (images.length === 0) return false;
  return images.every((m) => /alt=["'][^"']+["']/i.test(m[0]));
};

const getCombinedBody = ({ challenge, solution, results }) =>
  stripHtml([challenge, solution, results].filter(Boolean).join(" "));

// ─── SEO Checks ─────────────────────────────────────────────
const SEO_CHECKS = [
  {
    key: "titleLength",
    label: "Title length (45–60 chars)",
    check: ({ title }) => title?.length >= 45 && title?.length <= 60,
  },
  {
    key: "keywordInTitle",
    label: "Focus keyword in title",
    check: ({ title, keywords }) =>
      keywordInText(title, keywords?.[0]?.toLowerCase()),
  },
  {
    key: "keywordAtTitleStart",
    label: "Keyword near start of title",
    check: ({ title, keywords }) => {
      const kw = keywords?.[0]?.toLowerCase();
      if (!kw || !title) return false;
      return title.toLowerCase().trimStart().startsWith(kw);
    },
  },
  {
    key: "titleHasNumber",
    label: "Title contains a number or stat",
    check: ({ title }) => /\d/.test(title || ""),
  },
  {
    key: "descriptionLength",
    label: "Meta description (120–160 chars)",
    check: ({ description }) =>
      description?.length >= 120 && description?.length <= 160,
  },
  {
    key: "keywordInDescription",
    label: "Focus keyword in meta description",
    check: ({ description, keywords }) =>
      keywordInText(description, keywords?.[0]?.toLowerCase()),
  },
  {
    key: "descriptionHasStat",
    label: "Meta description contains a result/stat",
    check: ({ description }) => /\d/.test(description || ""),
  },
  {
    key: "slugExists",
    label: "URL slug is set",
    check: ({ slug }) => !!slug && slug.length > 0,
  },
  {
    key: "keywordInSlug",
    label: "Focus keyword in URL slug",
    check: ({ slug, keywords }) => {
      const kw = keywords?.[0]?.toLowerCase().replace(/\s+/g, "-");
      if (!kw || !slug) return false;
      return (
        slug.includes(kw) ||
        keywordInText(slug.replace(/-/g, " "), keywords?.[0])
      );
    },
  },
  {
    key: "hasClientName",
    label: "Client name is set",
    check: ({ clientName }) => !!clientName && clientName.trim().length > 0,
  },
  {
    key: "hasIndustry",
    label: "Industry is specified",
    check: ({ industry }) => !!industry && industry.trim().length > 0,
  },
  {
    key: "hasProjectDuration",
    label: "Project duration is set",
    check: ({ projectDuration }) =>
      !!projectDuration && projectDuration.trim().length > 0,
  },
  {
    key: "hasServices",
    label: "Services provided are listed",
    check: ({ servicesProvided }) => servicesProvided?.length >= 2,
  },
  {
    key: "hasMetrics",
    label: "At least 3 result metrics added",
    check: ({ metrics }) => metrics?.length >= 3,
  },
  {
    key: "metricsHaveStats",
    label: "Metrics contain numbers/percentages",
    check: ({ metrics }) =>
      metrics?.length > 0 && metrics.some((m) => /\d/.test(m.value)),
  },
  {
    key: "challengeExists",
    label: "Challenge section is written",
    check: ({ challenge }) => countWords(stripHtml(challenge)) >= 50,
  },
  {
    key: "keywordInChallenge",
    label: "Focus keyword in challenge section",
    check: ({ challenge, keywords }) =>
      keywordInText(stripHtml(challenge), keywords?.[0]?.toLowerCase()),
  },
  {
    key: "challengeHasHeading",
    label: "Challenge section has H2/H3 heading",
    check: ({ challenge }) => {
      const { h2, h3 } = getHeadings(challenge || "");
      return h2.length > 0 || h3.length > 0;
    },
  },
  {
    key: "solutionExists",
    label: "Solution section is written",
    check: ({ solution }) => countWords(stripHtml(solution)) >= 80,
  },
  {
    key: "keywordInSolution",
    label: "Focus keyword in solution section",
    check: ({ solution, keywords }) =>
      keywordInText(stripHtml(solution), keywords?.[0]?.toLowerCase()),
  },
  {
    key: "solutionHasHeading",
    label: "Solution section has H2/H3 heading",
    check: ({ solution }) => {
      const { h2, h3 } = getHeadings(solution || "");
      return h2.length > 0 || h3.length > 0;
    },
  },
  {
    key: "resultsExists",
    label: "Results section is written",
    check: ({ results }) => countWords(stripHtml(results)) >= 50,
  },
  {
    key: "resultsHasStats",
    label: "Results section contains numbers/stats",
    check: ({ results }) => /\d/.test(stripHtml(results || "")),
  },
  {
    key: "keywordInResults",
    label: "Focus keyword in results section",
    check: ({ results, keywords }) =>
      keywordInText(stripHtml(results), keywords?.[0]?.toLowerCase()),
  },
  {
    key: "totalWordCount",
    label: "Total content length (400+ words)",
    check: (formData) => countWords(getCombinedBody(formData)) >= 400,
  },
  {
    key: "keywordDensity",
    label: "Keyword density across content (0.5%–2.5%)",
    check: (formData) => {
      const kw = formData.keywords?.[0]?.toLowerCase();
      if (!kw) return false;
      const text = getCombinedBody(formData).toLowerCase();
      const density = getKeywordDensity(text, kw);
      return density >= 0.5 && density <= 2.5;
    },
  },
  {
    key: "keywordInFirstParagraph",
    label: "Keyword in first paragraph of challenge",
    check: ({ challenge, keywords }) => {
      const kw = keywords?.[0]?.toLowerCase();
      const firstPara = getFirstParagraph(challenge);
      return keywordInText(firstPara, kw);
    },
  },
  {
    key: "hasTestimonial",
    label: "Client testimonial is added",
    check: ({ testimonial }) =>
      !!testimonial?.quote && testimonial.quote.trim().length > 20,
  },
  {
    key: "testimonialHasAuthor",
    label: "Testimonial has author and role",
    check: ({ testimonial }) =>
      !!testimonial?.author &&
      testimonial.author.trim().length > 0 &&
      !!testimonial?.role &&
      testimonial.role.trim().length > 0,
  },
  {
    key: "featuredImage",
    label: "Featured image is set",
    check: ({ featuredImage }) => !!featuredImage?.url,
  },
  {
    key: "featuredImageAlt",
    label: "Featured image has alt text",
    check: ({ featuredImage }) =>
      !!featuredImage?.altText && featuredImage.altText.trim().length > 0,
  },
  {
    key: "featuredImageAltHasKeyword",
    label: "Featured image alt text contains keyword",
    check: ({ featuredImage, keywords }) =>
      keywordInText(featuredImage?.altText, keywords?.[0]?.toLowerCase()),
  },
  {
    key: "hasCategory",
    label: "Category is selected",
    check: ({ categories }) => categories?.length > 0,
  },
  {
    key: "hasTags",
    label: "At least one tag is selected",
    check: ({ tags }) => tags?.length > 0,
  },
  {
    key: "hasKeyword",
    label: "Focus keyword is set",
    check: ({ keywords }) =>
      keywords?.length > 0 && keywords[0].trim() !== "",
  },
  {
    key: "hasMultipleKeywords",
    label: "At least 3 SEO keywords added",
    check: ({ keywords }) => keywords?.length >= 3,
  },
];

// ─── Score Export ────────────────────────────────────────────
export const calculateCaseStudySeoScore = (formData) => {
  const passed = SEO_CHECKS.filter((c) => c.check(formData)).length;
  return Math.round((passed / SEO_CHECKS.length) * 100);
};

// ─── MultiSelect Dropdown ────────────────────────────────────
const MultiSelectDropdown = ({
  label,
  items,
  selected,
  onToggle,
  onCreateNew,
  loading,
  placeholder = "Search or create...",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items
    .filter(Boolean)
    .filter((item) =>
      item?.name?.toLowerCase().includes(search.toLowerCase())
    );

  const exactMatch = items
    .filter(Boolean)
    .some((item) => item?.name?.toLowerCase() === search.toLowerCase());

  const handleCreate = async () => {
    if (!search.trim() || exactMatch || creating) return;
    const name = search.trim();
    setCreating(true);
    setSearch(""); // clear immediately so filtered list updates
    try {
      await onCreateNew(name);
    } finally {
      setCreating(false);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Selected badges */}
      <div
        className="min-h-8 flex flex-wrap gap-1 items-center border border-gray-200 rounded-md px-2 py-1 cursor-pointer bg-white hover:border-gray-300 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {selected.length === 0 && (
          <span className="text-[11px] text-gray-400">{label}</span>
        )}
        {selected.filter(Boolean).map((item, index) => (
          <span
            key={item._id || item.id || item.name || index}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded"
          >
            {item.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(item);
              }}
              className="hover:text-red-400 transition-colors"
            >
              <X size={9} />
            </button>
          </span>
        ))}
        <ChevronDown
          size={11}
          className={`ml-auto text-gray-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          {/* Search */}
          <div className="px-2 py-1.5 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full text-xs outline-none text-gray-700 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setOpen(false);
              }}
            />
          </div>

          {/* List */}
          <ul className="max-h-40 overflow-y-auto py-1">
            {loading ? (
              <li className="flex items-center justify-center py-3">
                <Loader2 size={12} className="animate-spin text-gray-400" />
              </li>
            ) : filtered.length === 0 && !search ? (
              <li className="text-[11px] text-gray-400 px-3 py-2">
                No items found
              </li>
            ) : filtered.length === 0 && search ? (
              <li className="text-[11px] text-gray-400 px-3 py-2">
                No matches — create it below
              </li>
            ) : (
              filtered
                .filter((item) => item?.name)
                .map((item, index) => {
                  const isSelected = selected.some(
                    (s) => (s._id || s.id) === (item._id || item.id)
                  );
                  return (
                    <li
                      key={item._id || item.id || item.name || index}
                      onClick={() => onToggle(item)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1.5 4L3 5.5L6.5 2"
                              stroke="white"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {item.name}
                    </li>
                  );
                })
            )}
          </ul>

          {/* Create new */}
          {search.trim() && !exactMatch && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Plus size={11} />
                )}
                Create "{search.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────
const CaseStudySeoChecker = ({ formData, onFormDataChange }) => {
  const [allTags, setAllTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ── Fetch tags & categories scoped to "case-study" type
  useEffect(() => {
    setLoadingTags(true);
    getTags({ type: "case-study" })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data?.tags ?? data?.data ?? [];
        setAllTags(list.filter(Boolean));
      })
      .finally(() => setLoadingTags(false));

    setLoadingCategories(true);
    getCategories({ type: "case-study" })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data?.categories ?? data?.data ?? [];
        setAllCategories(list.filter(Boolean));
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const selectedTags = formData?.tags ?? [];
  const selectedCategories = formData?.categories ?? [];

  const handleToggleTag = (tag) => {
    const exists = selectedTags.some(
      (t) => (t._id || t.id) === (tag._id || tag.id)
    );
    const updated = exists
      ? selectedTags.filter((t) => (t._id || t.id) !== (tag._id || tag.id))
      : [...selectedTags, tag];
    onFormDataChange?.({ ...formData, tags: updated });
  };

  const handleToggleCategory = (cat) => {
    const exists = selectedCategories.some(
      (c) => (c._id || c.id) === (cat._id || cat.id)
    );
    const updated = exists
      ? selectedCategories.filter(
          (c) => (c._id || c.id) !== (cat._id || cat.id)
        )
      : [...selectedCategories, cat];
    onFormDataChange?.({ ...formData, categories: updated });
  };

  // ── Create tag scoped to "case-study" type
  // onFormDataChange spreads the latest formData prop (not a stale closure copy)
  const handleCreateTag = async (name) => {
    try {
      const newTag = await createTag({ name, type: "case-study" });
      const tag = newTag?.data ?? newTag?.tag ?? newTag;
      setAllTags((prev) => [...prev, tag]);
      onFormDataChange?.({
        ...formData,
        tags: [...(formData?.tags ?? []), tag],
      });
    } finally {
    }
  };

  // ── Create category scoped to "case-study" type
  const handleCreateCategory = async (name) => {
    try {
      const newCat = await createCategory({ name, type: "case-study" });
      const cat = newCat?.data ?? newCat?.category ?? newCat;
      setAllCategories((prev) => [...prev, cat]);
      onFormDataChange?.({
        ...formData,
        categories: [...(formData?.categories ?? []), cat],
      });
    } finally {
    }
  };

  // ── SEO Score
  const results = SEO_CHECKS.map((c) => ({
    ...c,
    passed: c.check(formData),
  }));

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const score = Math.round((passed / total) * 100);

  const scoreColor =
    score >= 80
      ? "text-green-500"
      : score >= 50
        ? "text-yellow-500"
        : "text-red-500";
  const barColor =
    score >= 80
      ? "bg-green-500"
      : score >= 50
        ? "bg-yellow-500"
        : "bg-red-500";
  const scoreLabel =
    score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";

  const groups = [
    {
      label: "Title",
      keys: ["titleLength", "keywordInTitle", "keywordAtTitleStart", "titleHasNumber"],
    },
    {
      label: "Meta Description",
      keys: ["descriptionLength", "keywordInDescription", "descriptionHasStat"],
    },
    {
      label: "URL",
      keys: ["slugExists", "keywordInSlug"],
    },
    {
      label: "Client & Project",
      keys: ["hasClientName", "hasIndustry", "hasProjectDuration", "hasServices"],
    },
    {
      label: "Metrics & Results",
      keys: ["hasMetrics", "metricsHaveStats"],
    },
    {
      label: "Challenge",
      keys: ["challengeExists", "keywordInChallenge", "challengeHasHeading"],
    },
    {
      label: "Solution",
      keys: ["solutionExists", "keywordInSolution", "solutionHasHeading"],
    },
    {
      label: "Results",
      keys: ["resultsExists", "resultsHasStats", "keywordInResults"],
    },
    {
      label: "Overall Content",
      keys: ["totalWordCount", "keywordDensity", "keywordInFirstParagraph"],
    },
    {
      label: "Testimonial (E-E-A-T)",
      keys: ["hasTestimonial", "testimonialHasAuthor"],
    },
    {
      label: "Images",
      keys: ["featuredImage", "featuredImageAlt", "featuredImageAltHasKeyword"],
    },
    {
      label: "Taxonomy & Keywords",
      keys: ["hasCategory", "hasTags", "hasKeyword", "hasMultipleKeywords"],
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          SEO Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${scoreColor}`}>
            {scoreLabel}
          </span>
          <span className={`font-bold text-base ${scoreColor}`}>{score}%</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-400">
        {passed} of {total} checks passed
      </p>

      {/* ── Tags & Categories ── */}
      <div className="space-y-2 pt-1 pb-1">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Categories
          </p>
          <MultiSelectDropdown
            label="Select categories…"
            items={allCategories}
            selected={selectedCategories}
            onToggle={handleToggleCategory}
            onCreateNew={handleCreateCategory}
            loading={loadingCategories}
            placeholder="Search or create category…"
          />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Tags
          </p>
          <MultiSelectDropdown
            label="Select tags…"
            items={allTags}
            selected={selectedTags}
            onToggle={handleToggleTag}
            onCreateNew={handleCreateTag}
            loading={loadingTags}
            placeholder="Search or create tag…"
          />
        </div>
      </div>

      {/* Grouped Checks */}
      <div className="space-y-3 pt-1">
        {groups.map((group) => {
          const groupResults = results.filter((r) =>
            group.keys.includes(r.key)
          );
          const groupPassed = groupResults.filter((r) => r.passed).length;
          return (
            <div key={group.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </span>
                <span className="text-[10px] text-gray-400">
                  {groupPassed}/{groupResults.length}
                </span>
              </div>
              <ul className="space-y-1.5">
                {groupResults.map((result) => (
                  <li
                    key={result.key}
                    className="flex items-center gap-2 text-xs"
                  >
                    {result.passed ? (
                      <CheckCircle
                        size={12}
                        className="text-green-500 shrink-0"
                      />
                    ) : (
                      <XCircle
                        size={12}
                        className="text-gray-300 shrink-0"
                      />
                    )}
                    <span
                      className={
                        result.passed ? "text-gray-700" : "text-gray-400"
                      }
                    >
                      {result.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudySeoChecker;