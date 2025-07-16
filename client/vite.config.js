import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:5000",
    //     secure: false,
    //   },
    // },
    allowedHosts: [
      "localhost",
      "4k98ww-5173.csb.app",
      "w4qcgx-5173.csb.app",
      "vvkg5d-5173.csb.app",
      "vvkg5d-5174.csb.app",
    ],
  },

  plugins: [react()],
});
