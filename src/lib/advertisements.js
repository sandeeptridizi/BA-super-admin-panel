import api from "./api";

export const getAdvertisements = async (params = {}) => {
  const response = await api.get("/api/advertisement", { params });
  return response.data;
};

export const getAdvertisementStats = async () => {
  const response = await api.get("/api/advertisement/stats");
  return response.data;
};

export const getAdvertisement = async (id) => {
  const response = await api.get(`/api/advertisement/${id}`);
  return response.data;
};

export const createAdvertisement = async (data) => {
  const response = await api.post("/api/advertisement", data);
  return response.data;
};

export const updateAdvertisement = async (id, data) => {
  const response = await api.put(`/api/advertisement/${id}`, data);
  return response.data;
};

export const deleteAdvertisement = async (id) => {
  const response = await api.delete(`/api/advertisement/${id}`);
  return response.data;
};
