import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import VueCookies from "vue-cookies";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueCookies);
app.use(router);
app.mount("#app");
