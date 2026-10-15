import { createApp, createSSRApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import "./App.css";

// index.html (landing) chega pré-renderizado pelo build: hidrata em vez de recriar o DOM,
// para não reiniciar as animações nem repintar. app.html (demais rotas) chega vazio.
const container = document.getElementById("app")!;
const app = container.hasChildNodes() ? createSSRApp(App) : createApp(App);

app.use(router);
router.isReady().then(() => app.mount(container));
