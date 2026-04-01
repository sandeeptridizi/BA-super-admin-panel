const TOKEN_KEY = "token";
const USER_TYPE_KEY = "userType";
const USER_KEY = "ba_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserType() {
  return localStorage.getItem(USER_TYPE_KEY) || null;
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, user ? JSON.stringify(user) : "");
}

export function setAuth(token, userType) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_TYPE_KEY, userType);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function isAdmin() {
  return getUserType() === "admin";
}
