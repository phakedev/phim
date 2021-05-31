import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import ViteFonts from "vite-plugin-fonts"
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons"
import ViteComponents from "vite-plugin-components"
import Pages from "vite-plugin-pages"
import ViteRadar from "vite-plugin-radar"
const vueSvgPlugin = require("vite-plugin-vue-svg")

export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    vueSvgPlugin({
      defaultExport: "url",
      svgoConfig: {},
    }),
    ViteRadar({
      analytics: {
        id: "G-RSNZK9JHE2",
      },
    }),
    WindiCSS(),
    ViteComponents({
      customComponentResolvers: ViteIconsResolver(),
    }),
    ViteIcons(),
    ViteFonts({
      google: {
        families: [
          {
            name: "JetBrains Mono",
            styles: "wght@300;400;500;600;700;800",
            defer: true,
          },
        ],
        display: "swap",
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 600,
  },
})
