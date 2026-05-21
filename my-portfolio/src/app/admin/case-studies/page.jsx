"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import axios from "axios";
import CaseStudyTable from "@/app/components/admin/case-studies/CaseStudyTable";
import BlogFilters from "@/app/components/admin/case-studies/CaseFilters";
import {getAdminCaseStudies,deleteCaseStudy} from '@/api/admin/caseStudies'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default function CaseStudyListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    page: 1,
    limit: 5,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data.data || []));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["adminCaseStudies", filters],
    queryFn: () => getAdminCaseStudies(filters),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCaseStudies"] });
    },
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    deleteMutation.mutate(id);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your client case studies and results
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/case-studies/new")}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Create New Case Study
        </button>
      </div>

      {/* Filters — reusing BlogFilters, same shape */}
      <BlogFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <CaseStudyTable
        caseStudies={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        pages={data?.pages || 1}
        currentPage={filters.page}
        limit={filters.limit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        onEdit={(id) => router.push(`/admin/case-studies/${id}/edit`)}
      />
    </div>
  );
}