import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows the server to be accessible externally
    port: 3000, // Ensure this matches the Docker configuration
    strictPort: true, // Ensure it fails if the port is not available
    watch: {
      usePolling: true, // Ensures changes are detected in Docker-mounted volumes
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    outDir: "dist", // Ensure the build output is in the `dist` directory
    sourcemap: true,
  },
});
