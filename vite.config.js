import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default ({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 3000,
      host: '0.0.0.0'
    }
  });
};
