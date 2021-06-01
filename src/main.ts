import { createApp } from "vue"
import "virtual:windi.css"
import "./assets/css/main.css"
import MainLayout from "./layouts/default.vue"
import { MotionPlugin } from "@vueuse/motion"
import router from "./router"

createApp(MainLayout)
  .use(MotionPlugin)
  .use(router)
  .mount("#app")
