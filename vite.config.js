import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Before build we need to change base to correctly include assets into component
  base: "administrator/components/com_invoices/assets/",
  // base:'/',
  build: {
    // Ensure that the entire app is bundled into a single JS and CSS file
    rollupOptions: {
      output: {
        // Force all code into one JavaScript file
        entryFileNames: "vue-assets/bundle.js",
        chunkFileNames: "vue-assets/bundle.js",
        assetFileNames: "vue-assets/[name][extname]", // Store assets in the assets directory
      },
    },
    cssCodeSplit: false, // Disable CSS code splitting
    outDir: "dist", // Set the output directory to "dist"
    emptyOutDir: true, // Clean the output directory before building
  },
  publicDir: "public", // Specify the public directory for static assets
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
