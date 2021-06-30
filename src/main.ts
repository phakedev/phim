import { createApp } from "vue"
import "virtual:windi.css"
import "./assets/css/main.css"
import MainLayout from "./layouts/default.vue"
import router from "./router"

createApp(MainLayout).use(router).mount("#app")
