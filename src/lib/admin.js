import api from "./api";

export async function getAdminProfile() {
  const res = await api.get("/api/admin/me");
  return res.data;
}

export async function updateAdminProfilePicture(key) {
  const res = await api.patch("/api/admin/me/profile-picture", { key });
  return res.data;
}

export async function removeAdminProfilePicture() {
  const res = await api.delete("/api/admin/me/profile-picture");
  return res.data;
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const res = await api.patch("/api/admin/me/password", { currentPassword, newPassword });
  return res.data;
}

export async function updateAdminProfile(data) {
  const res = await api.patch("/api/admin/me", data);
  return res.data;
}

export async function getPresignedUrl(key) {
  const res = await api.get(`/api/media/presigned?key=${encodeURIComponent(key)}`);
  return res.data;
}

export async function getPlatformDetails() {
  const res = await api.get("/api/platform");
  return res.data;
}

export async function updatePlatformDetails(data) {
  const res = await api.patch("/api/platform", data);
  return res.data;
}
