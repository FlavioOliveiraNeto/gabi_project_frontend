import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import HomeView from "../views/HomeView.vue";

import type { Role } from "@/services/auth";
import { user } from "@/composables/authState";
import { PAGES, pageFor } from "@/seo/pages";

const routes: RouteRecordRaw[] = [
  {
    path: "/trocar-senha",
    name: "change-password",
    component: () => import("../views/ChangePasswordView.vue"),
    meta: {
      requiresAuth: true,
      role: "client" as Role,
    },
  },
  {
    path: "/reset-senha",
    name: "reset-password",
    component: () => import("../views/ResetPasswordView.vue"),
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/psicanalise-online",
    name: "psicanalise-online",
    component: () => import("../views/PsicanaliseOnlineView.vue"),
  },
  {
    path: "/psicologia-questoes-raciais",
    name: "psicologia-questoes-raciais",
    component: () => import("../views/QuestoesRaciaisView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/paciente",
    name: "paciente",
    component: () => import("../views/PatientDashboard.vue"),
    meta: {
      requiresAuth: true,
      role: "client" as Role,
    },
  },
  {
    path: "/terapeuta",
    name: "terapeuta",
    component: () => import("../views/PsychDashboard.vue"),
    meta: {
      requiresAuth: true,
      role: "therapist" as Role,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  // Memory history no pré-render do build (scripts/prerender.mjs), onde não há window.
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  // useAuth (e o axios) só é carregado quando a rota exige autenticação.
  if (to.meta.requiresAuth) {
    const { useAuth } = await import("@/composables/useAuth");
    await useAuth().ready();
  }

  const currentUser = user.value;

  if (to.meta.requiresAuth && !currentUser) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.role && currentUser?.role !== to.meta.role) {
    return { name: "login" };
  }

  if (
    currentUser?.role === "client" &&
    currentUser?.must_change_password &&
    to.name !== "change-password" &&
    to.name !== "reset-password"
  ) {
    return { name: "change-password" };
  }

  if (to.name === "login" && currentUser) {
    if (currentUser.role === "therapist") return { name: "terapeuta" };
    if (currentUser.role === "client")    return { name: "paciente" };
  }

  return true;
});

// Only indexable routes are listed; everything else (auth screens, dashboards, 404)
// gets <meta name="robots" content="noindex">. Vercel also sends X-Robots-Tag for the private paths.
const INDEXABLE = new Set(["home", "psicanalise-online", "psicologia-questoes-raciais"]);
router.afterEach((to) => {
  if (import.meta.env.SSR) return;
  document.title = (pageFor(to.path) ?? PAGES["/"]).title;
  let tag = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (INDEXABLE.has(String(to.name))) return tag?.remove();
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "robots";
    document.head.appendChild(tag);
  }
  tag.content = "noindex, nofollow";
});

export default router;
