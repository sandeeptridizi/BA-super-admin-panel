import api from "./api";

/**
 * Fetch all users (admin). Optional query: search, isActive, subscriptionStatus.
 * @param {{ search?: string, isActive?: string, subscriptionStatus?: string }} params
 * @returns {Promise<{ message: string, data: object[] }>}
 */
export async function getUsers(params = {}) {
  const res = await api.get("/api/user", { params });
  return res.data;
}

/**
 * Fetch a single user by id (admin).
 * @param {string} id
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function getUser(id) {
  const res = await api.get(`/api/user/${id}`);
  return res.data;
}

/**
 * Create a new user (signup). Used by admin to add users.
 * @param {{ name: string, email: string, password: string, phone?: string, city?: string, state?: string }} data
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function createUser(data) {
  const res = await api.post("/api/user", data);
  return res.data;
}

export async function updateUser(id, data) {
  const res = await api.put(`/api/user/${id}`, data);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/api/user/${id}`);
  return res.data;
}
