"use client";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const StatusBadge = ({ status }) => {
  const styles = {
    published: "text-green-600 bg-green-50",
    draft: "text-gray-400 bg-gray-100",
    archived: "text-orange-500 bg-orange-50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "published"
            ? "bg-green-500"
            : status === "draft"
            ? "bg-gray-400"
            : "bg-orange-500"
        }`}
      />
      {status}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

export default function CaseStudyTable({
  caseStudies,
  loading,
  total,
  pages,
  currentPage,
  limit,
  onDelete,
  onEdit,
  onPageChange,
}) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        {/* Head */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {["Title", "Client", "Date Published", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : caseStudies.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                No case studies found
              </td>
            </tr>
          ) : (
            <AnimatePresence>
              {caseStudies.map((cs, i) => (
                <motion.tr
                  key={cs._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {cs.featuredImage?.url ? (
                          <Image
                            src={cs.featuredImage.url}
                            alt={cs.featuredImage.altText || cs.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800 line-clamp-2 max-w-xs">
                        {cs.title}
                      </span>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {cs.clientName || "—"}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {cs.publishedAt
                      ? new Date(cs.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={cs.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(cs._id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(cs._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {start} to {end} of {total} case studies
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pages}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}