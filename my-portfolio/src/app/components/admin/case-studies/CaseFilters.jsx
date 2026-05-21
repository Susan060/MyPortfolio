"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export default function CaseFilters({ filters, categories, onFilterChange }) {
  const [search, setSearch] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange("search", search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-50 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search blog posts by title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
        />
      </div>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange("category", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 bg-white text-gray-600"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 bg-white text-gray-600"
      >
        <option value="">Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Filter Icon */}
      <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <SlidersHorizontal size={16} className="text-gray-500" />
      </button>
    </div>
  );
}