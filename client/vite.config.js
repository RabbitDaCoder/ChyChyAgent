import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target:
          mode === "production"
            ? "https://chychyagent-api.onrender.com"
            : "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
