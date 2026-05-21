import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getPublicCaseStudies = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.tag) params.append("tag", filters.tag);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit || 9);
  console.log("Fetching:", `/api/case-studies?${params}`); 
  const { data } = await api.get(`/api/case-studies?${params}`);
   console.log("Response:", data); 
  return data;
};

export const getPublicCaseStudyBySlug = async (slug) => {
  const { data } = await api.get(`/api/case-studies/${slug}`);
  return data;
};

export const getPublicCaseStudyCategories = async () => {
  const { data } = await api.get("/api/categories?type=case-study");
  return data;
};

export const getPublicCaseStudyTags = async () => {
  const { data } = await api.get("/api/tags?type=case-study");
  return data;
};