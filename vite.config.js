import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer, postcssNested],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
