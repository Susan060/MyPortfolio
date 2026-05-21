import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const getAdminCaseStudies = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.status) params.append("status", filters.status);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  const { data } = await api.get(`/api/case-studies/admin/all?${params}`);
  return data;
};

export const getCaseStudyById = async (id) => {
  const { data } = await api.get(`/api/case-studies/id/${id}`);
  return data;
};

export const createCaseStudy = async (payload) => {
  const { data } = await api.post("/api/case-studies", payload);
  return data;
};

export const updateCaseStudy = async ({ id, payload }) => {
  const { data } = await api.put(`/api/case-studies/${id}`, payload);
  return data;
};

export const deleteCaseStudy = async (id) => {
  const { data } = await api.delete(`/api/case-studies/${id}`);
  return data;
};