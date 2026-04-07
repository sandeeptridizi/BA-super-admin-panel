import api from "./api";

/** @returns {Promise<{ data: Array }>} */
export async function fetchPendingApprovals() {
  const res = await api.get("/api/product", { params: { approvalStatus: "PENDING" } });
  return res.data;
}

/** @returns {Promise<{ data: Array }>} */
export async function fetchFeaturedRecommended() {
  const res = await api.get("/api/product", { params: { featuredOrRecommended: "true" } });
  return res.data;
}

/** @returns {Promise<{ data: Array }>} */
export async function fetchAllApprovedProducts() {
  const res = await api.get("/api/product", { params: { approvalStatus: "APPROVED" } });
  return res.data;
}

/**
 * @param {string} id
 * @param {{ approvalStatus: string, tier?: string }} body
 */
export async function approveProduct(id, body) {
  const res = await api.patch(`/api/product/${id}`, body);
  return res.data;
}

/**
 * @param {string} id
 * @param {{ isFeatured?: boolean, isRecommended?: boolean, isVerified?: boolean }} body
 */
export async function updateFeaturedRecommended(id, body) {
  const res = await api.patch(`/api/product/${id}`, body);
  return res.data;
}
