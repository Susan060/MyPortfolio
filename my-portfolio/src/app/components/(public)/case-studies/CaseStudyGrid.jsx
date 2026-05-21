"use client";
import CaseStudyCard from "./CaseStudyCard";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <div className="w-full h-48 bg-gray-100 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export default function CaseStudyGrid({ caseStudies, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <div className="text-center py-20 space-y-2">
        <p className="text-gray-400 text-sm">No case studies found</p>
        <p className="text-gray-300 text-xs">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseStudies.map((cs) => (
        <CaseStudyCard key={cs._id} caseStudy={cs} />
      ))}
    </div>
  );
}