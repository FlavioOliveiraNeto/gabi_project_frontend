import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";
import router from "./router";

// Usado só no build (scripts/prerender.mjs) para gerar o HTML estático da landing.
export async function render(url: string): Promise<string> {
  const app = createSSRApp(App);
  app.use(router);
  await router.push(url);
  await router.isReady();
  return renderToString(app);
}
