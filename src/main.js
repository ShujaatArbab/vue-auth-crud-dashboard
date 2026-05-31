import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css";
import "./assets/main.css";

const app = createApp(App);

// PINIA
app.use(createPinia());

// ROUTER
app.use(router);
// For Notification
app.use(Toast);
// MOUNT
app.mount("#app");