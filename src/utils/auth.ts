// utils/auth.ts
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const login = () => {
  localStorage.setItem("isLoggedIn", "true");
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
};
