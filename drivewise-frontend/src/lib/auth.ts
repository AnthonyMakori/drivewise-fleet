import api from "./axios"; 
import type { User } from "../types/user"; 

const AUTH_STORAGE_KEY = "car-hire-auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const getAuthState = (): AuthState => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return { user: null, token: null, isAuthenticated: false };

  try {
    return JSON.parse(stored) as AuthState;
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
};

export const setAuthState = (state: AuthState): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));

  if (state.token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post("/login", { email, password });

  const { access_token, user } = response.data;

  const authState: AuthState = {
    user,
    token: access_token,
    isAuthenticated: true,
  };

  setAuthState(authState);

  return user;
};

export const register = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<User> => {
  const response = await api.post("/register", {
    name,
    email,
    phone,
    password,
    password_confirmation: confirmPassword,
  });

  const { access_token, user } = response.data;

  const authState: AuthState = {
    user,
    token: access_token,
    isAuthenticated: true,
  };

  setAuthState(authState);

  return user;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/logout"); 
  } catch {
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  delete api.defaults.headers.common["Authorization"];
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};
