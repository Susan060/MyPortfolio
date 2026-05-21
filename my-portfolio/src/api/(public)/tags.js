import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const getTags = async () => {
  const { data } = await api.get("/api/tags");
  return data;
};

export const createTag = async (payload) => {
  const { data } = await api.post("/api/tags", payload);
  return data;
};

export const updateTag = async ({ id, payload }) => {
  const { data } = await api.put(`/api/tags/${id}`, payload);
  return data;
};

export const deleteTag = async (id) => {
  const { data } = await api.delete(`/api/tags/${id}`);
  return data;
};