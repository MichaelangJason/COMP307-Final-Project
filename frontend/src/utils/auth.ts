// utils/auth.ts
export const AUTH_TOKEN_KEY = "token";
export const USER_ID_KEY = "userId";
export const USER_ROLE_KEY = "role";
export const USER_EMAIL_KEY = "email";

export const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY);
export const getUserId = () => sessionStorage.getItem(USER_ID_KEY);
export const getUserRole = () => sessionStorage.getItem(USER_ROLE_KEY);
export const isAdmin = () => getUserRole() === "0";

export const clearAuth = () => {
  sessionStorage.clear();
};

export const setAuthData = (
  token: string,
  userId: string,
  role: string,
  email: string
) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(USER_ID_KEY, userId);
  sessionStorage.setItem(USER_ROLE_KEY, role);
  sessionStorage.setItem(USER_EMAIL_KEY, email);
};
