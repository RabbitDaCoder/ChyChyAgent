import { create } from "zustand";
import api from "../utils/api";
import { toast } from "react-toastify";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async ({ name, password, email }, navigate) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/register", {
        name,
        password,
        email,
      });
      set({ user: res.data.user, loading: false });
      toast.success("User registered successfully");
      navigate("/admin/login");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred,Try again");
    }
  },

  login: async ({ password, email }, navigate) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", { password, email });

      set({ user: res.data.data, loading: false });
      navigate("/admin/dashboard");
      toast.success("User logged in successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.error?.message || "An error occurred, try again",
      );
    }
  },

  logout: async (navigate) => {
    try {
      await api.post("/auth/logout");
      set({ user: null });
      if (navigate) navigate("/admin/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
      set({ user: null });
      if (navigate) navigate("/admin/login");
    }
  },

  uploadProfileImage: async (file) => {
    set({ loading: true });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/auth/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the user state immediately with the new image URL
      set((state) => ({
        user: { ...state.user, image: res.data.image },
        loading: false,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Upload failed, try again");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await api.post("/auth/refresh");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept auth routes — let login/logout handle their own errors
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return api(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        useUserStore.getState().logout();
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
