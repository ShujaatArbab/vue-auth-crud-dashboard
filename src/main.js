import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";
import "./assets/main.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useAuthenticationStore } from "./store/Auth.js";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const authStore = useAuthenticationStore();
authStore.loadAuthFromStorage();

app.use(router);
app.use(Toast);

app.mount("#app");