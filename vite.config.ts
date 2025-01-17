import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Omogućuje pristup serveru izvana
    port: 3000, // Port za server
    strictPort: true, // Osigurava prekid ako je port zauzet
    watch: {
      usePolling: true, // Prati promjene u Docker-mounted volumenima
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    outDir: "dist", // Premjestite build u root direktorij
    sourcemap: true, // Generira sourcemap za debugging
  },
});
