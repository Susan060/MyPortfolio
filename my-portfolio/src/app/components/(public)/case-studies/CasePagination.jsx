"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CasePagination({ currentPage, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
            currentPage === i + 1
              ? "bg-red-500 text-white shadow-md shadow-red-200"
              : "border border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pages}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}