"use client";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CaseStudyFilters({
  filters,
  categories,
  tags,
  onFilterChange,
  onClear,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(filters.search || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange("search", search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const hasActiveFilters = filters.search || filters.category || filters.tag;
  const isOnCategoryPage = pathname.startsWith("/case-studies/category");
  const isOnTagPage = pathname.startsWith("/case-studies/tag");

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="relative w-full max-w-md mx-auto">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search case studies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: '1.5px solid #e5e7eb' }}
          className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2a7a8a]/20 bg-gray-50 placeholder:text-gray-400 text-gray-700 transition-all"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); onFilterChange("search", ""); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => router.push("/case-studies")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !isOnCategoryPage && !isOnTagPage
                ? "bg-[#2a7a8a] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => router.push(`/case-studies/category/${cat.slug}`)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname === `/case-studies/category/${cat.slug}`
                  ? "bg-[#2a7a8a] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => router.push(`/case-studies/tag/${tag.slug}`)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                pathname === `/case-studies/tag/${tag.slug}`
                  ? "border-[#2a7a8a] text-[#2a7a8a] bg-[#2a7a8a]/10"
                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Clear filters */}
      {(hasActiveFilters || isOnCategoryPage || isOnTagPage) && (
        <div className="flex justify-center">
          <button
            onClick={() => { setSearch(""); onClear(); router.push("/case-studies"); }}
            className="text-xs text-gray-400 hover:text-[#2a7a8a] transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}