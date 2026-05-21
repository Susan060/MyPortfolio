"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CaseStudyForm from "@/app/components/admin/case-studies/CaseStudyForm";
import { getCaseStudyById } from "@/api/admin/caseStudies";

export default function EditCaseStudyPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({ 
    queryKey: ["caseStudy", id],
    queryFn: () => getCaseStudyById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
        Loading case study...
      </div>
    );
  }

  return <CaseStudyForm initialData={data?.data} />;
}