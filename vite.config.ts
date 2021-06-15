import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import ViteFonts from "vite-plugin-fonts"
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons"
import ViteComponents from "vite-plugin-components"
import ViteRadar from "vite-plugin-radar"
import vueSvgPlugin from "vite-plugin-vue-svg"

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },

  plugins: [
    vue(),
    vueSvgPlugin({
      defaultExport: "url",
      svgoConfig: {},
    }),
    ViteRadar({
      enableDev: true,
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
