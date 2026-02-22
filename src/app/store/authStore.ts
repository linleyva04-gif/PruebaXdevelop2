import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: "admin" | "user";
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: "admin", 
  setToken: (token) => set({ token }),
  logout: () => set({ token: null }),
}));
