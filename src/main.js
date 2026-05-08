import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

// PINIA
app.use(createPinia());

// ROUTER
app.use(router);

// MOUNT
app.mount("#app");