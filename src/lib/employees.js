import api from "./api";

/**
 * Create a new employee.
 * @param {{ name: string, email: string, password: string, phone?: string, designation?: string, department?: string }} data
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function createEmployee(data) {
  const res = await api.post("/api/employee", data);
  return res.data;
}

/**
 * Fetch all employees.
 * @returns {Promise<{ message: string, data: object[] }>}
 */
export async function getEmployees() {
  const res = await api.get("/api/employee");
  return res.data;
}

/**
 * Fetch a single employee by id.
 * @param {string} id
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function getEmployee(id) {
  const res = await api.get(`/api/employee/${id}`);
  return res.data;
}

/**
 * Update an employee by id.
 * @param {string} id
 * @param {{ name?: string, email?: string, password?: string, phone?: string, designation?: string, department?: string, isActive?: boolean }} data
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function updateEmployee(id, data) {
  const res = await api.put(`/api/employee/${id}`, data);
  return res.data;
}

export async function deleteEmployee(id) {
  const res = await api.delete(`/api/employee/${id}`);
  return res.data;
}
