import { sentryVitePlugin } from "@sentry/vite-plugin";
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
      includeAssets: ["favicon.svg", "maskable.png", "og.png"],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Noisefill",
        description: "Soundscapes and lofi in a neat interface.",
        start_url: "/",
        display: "standalone",
        background_color: "#010101",
        theme_color: "#010101",
        icons: [
          {
            src: "maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
    sentryVitePlugin({
      org: "noisefill",
      project: "javascript-react",
    }),
  ],

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer, postcssNested],
    },
  },

  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  build: {
    sourcemap: true,
  },
});
