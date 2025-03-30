/// <reference types="vite/client" />


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // Fix global object for browser
  },
  resolve: {
    alias: {
      buffer: "buffer", // Fix buffer import issue
    },
  },
});
