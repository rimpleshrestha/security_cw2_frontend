import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import basicSsl from "@vitejs/plugin-basic-ssl"; // Import the SSL plugin

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    basicSsl(), 
  ],
  server: {
    https: true, // This enables the secure server
    port: 5173,
  },
});
