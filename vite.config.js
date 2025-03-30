import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import autoImport from "unplugin-auto-import/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    autoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: ["vue"],
    }),
  ],
})
