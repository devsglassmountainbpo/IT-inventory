import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: 'https://devs.glassmountainbpo.com/',
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'],
});
