import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/upload", formData);
  return data;
};

export const deleteImage = async (publicId) => {
  const { data } = await api.delete("/api/upload", { data: { publicId } });
  return data;
};