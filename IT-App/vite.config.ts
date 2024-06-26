import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: 'https://inv.glassmountainbpo.com/',
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'],
});
