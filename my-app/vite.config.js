import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // load .env file
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
// import { fileURLToPath, URL } from 'node:url'
// import { defineConfig, loadEnv } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig(({ command, mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [
//       vue(),
//       tailwindcss(),
//     ],
//     define: {
//       __APP_ENV__: JSON.stringify(env.APP_ENV),
//     },
//     resolve: {
//       alias: {
//         '@': fileURLToPath(new URL('./src', import.meta.url))
//       }
//     }
//   }
// });
