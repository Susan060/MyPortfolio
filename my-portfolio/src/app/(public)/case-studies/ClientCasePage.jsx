"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import CaseStudyGrid from "@/app/components/(public)/case-studies/CaseStudyGrid";
import CaseStudyFilters from "@/app/components/(public)/case-studies/CaseStudyFilters";
import BlogPagination from "@/app/components/(public)/case-studies/CasePagination";
import {
  getPublicCaseStudies,
  getPublicCaseStudyCategories,
  getPublicCaseStudyTags,
} from "@/api/(public)/caseStudies";

export default function CaseStudiesPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tag: "",
    page: 1,
    limit: 9,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["publicCaseStudies", filters],
    queryFn: () => getPublicCaseStudies(filters),
    keepPreviousData: true,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["publicCaseStudyCategories"],
    queryFn: getPublicCaseStudyCategories,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["publicCaseStudyTags"],
    queryFn: getPublicCaseStudyTags,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClear = () => {
    setFilters({ search: "", category: "", tag: "", page: 1, limit: 9 });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-12">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">
            Project{" "}
            <span className="text-[#2a7a8a]">Case Studies</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Real results for real clients. Explore how we've helped businesses
            grow through design, development, and strategy.
          </p>
        </motion.div>

        {/* Filters — reusing BlogFilters since shape is identical */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CaseStudyFilters
            filters={filters}
            categories={categoriesData?.data || []}
            tags={tagsData?.data || []}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
          />
        </motion.div>

        {/* Results count */}
        {!isLoading && data?.total > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 text-center"
          >
            Showing {data?.data?.length} of {data?.total} case studies
          </motion.p>
        )}

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CaseStudyGrid caseStudies={data?.data || []} loading={isLoading} />
        </motion.div>

        {/* Pagination */}
        <BlogPagination
          currentPage={filters.page}
          pages={data?.pages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}