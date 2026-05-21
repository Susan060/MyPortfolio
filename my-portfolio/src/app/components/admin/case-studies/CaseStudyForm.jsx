"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { X, Plus, Pencil, Check } from "lucide-react";
import ImageUpload from "@/app/components/admin/case-studies/ImageUpload";
import { createCaseStudy, updateCaseStudy } from "@/api/admin/caseStudies";
import { calculateCaseStudySeoScore } from "./CaseStudySeoChecker";
import CaseStudySeoChecker from "./CaseStudySeoChecker";
import { getTags } from "@/api/(public)/tags";
import { getCategories } from "@/api/(public)/categories";

const TiptapEditor = dynamic(
  () => import("@/app/components/admin/case-studies/TiptapEditor"),
  { ssr: false }
);

const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const INITIAL_FORM = {
  title: "",
  slug: "",
  description: "",
  categories: [],
  tags: [],
  keywords: [],
  status: "draft",
  featuredImage: null,
  clientName: "",
  industry: "",
  projectDuration: "",
  servicesProvided: [],
  challenge: "",
  solution: "",
  results: "",
  testimonial: { quote: "", author: "", role: "" },
  metrics: [],
};

export default function CaseStudyForm({ initialData = null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [keywordInput, setKeywordInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [error, setError] = useState("");
  const [resolved, setResolved] = useState(false);
  const [isSlugEditing, setIsSlugEditing] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const slugInputRef = useRef(null);

  useEffect(() => {
    if (!initialData) {
      setResolved(true);
      return;
    }

    const catsAreObjects =
      initialData.categories?.length > 0 &&
      typeof initialData.categories[0] === "object";
    const tagsAreObjects =
      initialData.tags?.length > 0 &&
      typeof initialData.tags[0] === "object";

    if (catsAreObjects && tagsAreObjects) {
      setFormData({ ...INITIAL_FORM, ...initialData });
      setResolved(true);
      return;
    }

    Promise.all([
      getCategories({ type: "case-study" }),
      getTags({ type: "case-study" }),
    ]).then(([catData, tagData]) => {
      const allCats = Array.isArray(catData)
        ? catData
        : catData?.categories ?? catData?.data ?? [];
      const allTags = Array.isArray(tagData)
        ? tagData
        : tagData?.tags ?? tagData?.data ?? [];

      const categoryIds =
        initialData.categories?.map((c) =>
          typeof c === "object" ? c._id : c
        ) ?? [];
      const tagIds =
        initialData.tags?.map((t) =>
          typeof t === "object" ? t._id : t
        ) ?? [];

      setFormData({
        ...INITIAL_FORM,
        ...initialData,
        categories: allCats.filter((c) => categoryIds.includes(c._id)),
        tags: allTags.filter((t) => tagIds.includes(t._id)),
      });
      setResolved(true);
    });
  }, []);

  // Auto-generate slug from title only when creating and slug hasn't been manually edited
  useEffect(() => {
    if (!isEditing && !slugManuallyEdited) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title]);

  // Focus slug input when edit mode opens
  useEffect(() => {
    if (isSlugEditing) {
      slugInputRef.current?.focus();
    }
  }, [isSlugEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestimonialChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      testimonial: { ...prev.testimonial, [field]: value },
    }));
  };

  const handleFormDataChange = (updated) => {
    setFormData(updated);
  };

  const handleSlugChange = (e) => {
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    setFormData((prev) => ({ ...prev, slug: sanitized }));
    setSlugManuallyEdited(true);
  };

  const handleSlugConfirm = () => {
    setFormData((prev) => ({
      ...prev,
      slug: prev.slug.replace(/-+/g, "-").replace(/^-|-$/g, ""),
    }));
    setIsSlugEditing(false);
  };

  const handleSlugKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSlugConfirm();
    }
    if (e.key === "Escape") {
      setIsSlugEditing(false);
    }
  };

  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        handleChange("keywords", [...formData.keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleAddService = (e) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      if (!formData.servicesProvided.includes(serviceInput.trim())) {
        handleChange("servicesProvided", [
          ...formData.servicesProvided,
          serviceInput.trim(),
        ]);
      }
      setServiceInput("");
    }
  };

  const handleAddMetric = () => {
    if (metricLabel.trim() && metricValue.trim()) {
      handleChange("metrics", [
        ...formData.metrics,
        { label: metricLabel.trim(), value: metricValue.trim() },
      ]);
      setMetricLabel("");
      setMetricValue("");
    }
  };

  const handleRemoveMetric = (index) => {
    handleChange(
      "metrics",
      formData.metrics.filter((_, i) => i !== index)
    );
  };

  const serializePayload = (extra = {}) => ({
    ...formData,
    ...extra,
    categories: formData.categories.map((c) => c._id ?? c),
    tags: formData.tags.map((t) => t._id ?? t),
  });

  const createMutation = useMutation({
    mutationFn: createCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCaseStudies"] });
      router.push("/admin/case-studies");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Something went wrong");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCaseStudies"] });
      router.push("/admin/case-studies");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Something went wrong");
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (status) => {
    setError("");
    const seoScore = calculateCaseStudySeoScore({ ...formData, status });
    const payload = serializePayload({ status, seoScore });
    if (isEditing) {
      updateMutation.mutate({ id: initialData._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (!resolved) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Case Study" : "Create New Case Study"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={isLoading}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Saving..."
              : isEditing
                ? "Update Case Study"
                : "Publish Case Study"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-6 p-6 ">
        {/* Left — Main Content */}
        <div className="flex-1 space-y-4">

          {/* Title + Slug */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-4"
          >
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Case Study Title
              </label>
              <input
                type="text"
                placeholder="Enter Case Study Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-2xl font-bold border-none outline-none placeholder-gray-200 text-gray-800"
              />
            </div>

            {/* Slug */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  URL Slug
                </label>
                {!isSlugEditing && (
                  <button
                    type="button"
                    onClick={() => setIsSlugEditing(true)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Pencil size={10} />
                    Edit
                  </button>
                )}
              </div>

              {isSlugEditing ? (
                <div className="rounded-lg border border-red-200 bg-red-50/40 p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 focus-within:border-red-400 transition-colors">
                    <span className="text-xs text-gray-400 shrink-0 select-none">
                      /case-studies/
                    </span>
                    <input
                      ref={slugInputRef}
                      type="text"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      onKeyDown={handleSlugKeyDown}
                      className="flex-1 text-xs text-gray-700 outline-none bg-transparent min-w-0"
                      placeholder="my-custom-slug"
                    />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Only lowercase letters, numbers, and hyphens. Avoid changing the slug of a published case study as it will break existing links.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSlugConfirm}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      <Check size={11} />
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSlugEditing(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-md transition-colors"
                    >
                      <X size={11} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-md px-2.5 py-1.5">
                  <span className="text-gray-400 shrink-0">/case-studies/</span>
                  <span className="truncate font-medium text-gray-600">
                    {formData.slug || (
                      <span className="text-gray-300 font-normal">auto-generated</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* SEO Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Short Description (SEO Meta)
              </label>
              <span
                className={`text-xs ${
                  formData.description.length > 160
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {formData.description.length}/160
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Write a short SEO description..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full text-sm border-none outline-none resize-none placeholder-gray-300 text-gray-700"
            />
          </motion.div>

          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              The Challenge
            </label>
            <TiptapEditor
              value={formData.challenge}
              onChange={(val) => handleChange("challenge", val)}
            />
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Our Solution
            </label>
            <TiptapEditor
              value={formData.solution}
              onChange={(val) => handleChange("solution", val)}
            />
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              The Results
            </label>
            <TiptapEditor
              value={formData.results}
              onChange={(val) => handleChange("results", val)}
            />
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="bg-white rounded-lg p-5 border border-gray-200 space-y-3"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Testimonial (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Client quote..."
              value={formData.testimonial.quote}
              onChange={(e) => handleTestimonialChange("quote", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400 resize-none placeholder-gray-300 text-gray-700"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Author name"
                value={formData.testimonial.author}
                onChange={(e) =>
                  handleTestimonialChange("author", e.target.value)
                }
                className="text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
              <input
                type="text"
                placeholder="Role (e.g. CEO at Acme)"
                value={formData.testimonial.role}
                onChange={(e) =>
                  handleTestimonialChange("role", e.target.value)
                }
                className="text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
            </div>
          </motion.div>
        </div>

        {/* Right — Sidebar */}
        <div className="w-72 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CaseStudySeoChecker
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Featured Image
            </label>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(val) => handleChange("featuredImage", val)}
            />
            {formData.featuredImage?.url && (
              <input
                type="text"
                placeholder="Image alt text..."
                value={formData.featuredImage.altText || ""}
                onChange={(e) =>
                  handleChange("featuredImage", {
                    ...formData.featuredImage,
                    altText: e.target.value,
                  })
                }
                className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
            )}
          </motion.div>

          {/* Client Info */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-lg p-4 border border-gray-200 space-y-3"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Client Info
            </label>
            <input
              type="text"
              placeholder="Client name *"
              value={formData.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
            <input
              type="text"
              placeholder="Industry (e.g. Fintech)"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
            <input
              type="text"
              placeholder="Project duration (e.g. Jan – Mar 2024)"
              value={formData.projectDuration}
              onChange={(e) => handleChange("projectDuration", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </motion.div>

          {/* Services Provided */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Services Provided
            </label>
            <input
              type="text"
              placeholder="Type service and press Enter..."
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={handleAddService}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
            {formData.servicesProvided.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.servicesProvided.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "servicesProvided",
                          formData.servicesProvided.filter((x) => x !== s)
                        )
                      }
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white rounded-lg p-4 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Metrics
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Label (e.g. Conversion Rate)"
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Value (e.g. +42%)"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="shrink-0 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            {formData.metrics.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {formData.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-500">{m.label}</span>
                    <span className="font-bold text-red-500">{m.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* SEO Keywords */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg p-4 border border-gray-200 space-y-2"
          >
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              SEO Keywords
            </label>
            <input
              type="text"
              placeholder="Type keyword and press Enter..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-400">Separate keywords with Enter</p>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "keywords",
                          formData.keywords.filter((k) => k !== kw)
                        )
                      }
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}