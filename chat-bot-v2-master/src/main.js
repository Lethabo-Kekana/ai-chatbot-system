import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Chat from "vue3-beautiful-chat";
import VueSweetalert2 from "vue-sweetalert2";
// import "./assets/main.css";
import "./axios.js";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Chat);
app.use(VueSweetalert2);
app.mount("#app");
