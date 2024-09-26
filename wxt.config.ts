// import { defineConfig } from 'wxt';

// // See https://wxt.dev/api/config.html
// export default defineConfig({
//   modules: ['@wxt-dev/module-react'],
// });
import { defineConfig, type ConfigEnv } from "wxt";
export default defineConfig({
  manifest: {
    // Your manifest configuration here
  },
  vite: (env: ConfigEnv) => ({
    css: {
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      },
    },
  }),
});
