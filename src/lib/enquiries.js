import api from "./api";

export const getNewsletterLeads = async (params = {}) => {
  const response = await api.get("/api/newsletter", { params });
  return response.data;
};

export const getEnquiry = async (id) => {
  const response = await api.get(`/api/enquiry/${id}`);
  return response.data;
};

export const getEnquiries = async (params = {}) => {
  const response = await api.get("/api/enquiry", { params });
  return response.data;
};

export const getEnquiryStats = async () => {
  const response = await api.get("/api/enquiry/stats");
  return response.data?.data;
};

export const updateEnquiry = async (id, data) => {
  const response = await api.patch(`/api/enquiry/${id}`, data);
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/api/enquiry/${id}`);
  return response.data;
};
