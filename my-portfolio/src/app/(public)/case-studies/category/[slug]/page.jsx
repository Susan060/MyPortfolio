"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CaseStudyGrid from "@/app/components/(public)/case-studies/CaseStudyGrid";
import BlogPagination from "@/app/components/(public)/case-studies/CasePagination";
import { getPublicCaseStudies } from "@/api/(public)/caseStudies";

export default function CaseStudyCategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const { data: categoryData } = useQuery({
    queryKey: ["csCategory", slug],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}`
      );
      return res.json();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["csCategoryItems", slug, page],
    queryFn: () => getPublicCaseStudies({ category: slug, page, limit: 9 }),
    keepPreviousData: true,
  });

  const category = categoryData?.data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Link
            href="/case-studies"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Back to Case Studies
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">
              Category
            </p>
            <h1 className="text-4xl font-black text-gray-900">
              {category?.name || slug}
            </h1>
            {category?.description && (
              <p className="text-gray-400 text-sm max-w-md">{category.description}</p>
            )}
            {data?.total > 0 && (
              <p className="text-sm text-gray-400">
                {data.total} case stud{data.total !== 1 ? "ies" : "y"} found
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CaseStudyGrid caseStudies={data?.data || []} loading={isLoading} />
        </motion.div>

        <BlogPagination
          currentPage={page}
          pages={data?.pages || 1}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </main>
  );
}