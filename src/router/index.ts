import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
} from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import PatientDashboard from "../components/PatientDashboard.vue";
import PsychDashboard from "../components/PsychDashboard.vue";
import NotFound from "../views/NotFound.vue";

type Role = "admin" | "client";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/paciente",
    name: "paciente",
    component: PatientDashboard,
    meta: {
      requiresAuth: true,
      role: "client" as Role,
    },
  },
  {
    path: "/terapeuta",
    name: "terapeuta",
    component: PsychDashboard,
    meta: {
      requiresAuth: true,
      role: "admin" as Role,
    },
  },

  // 👇 CATCH-ALL (equivalente ao "*" do React)
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: RouteLocationNormalized) => {
  const token = localStorage.getItem("auth_token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? (JSON.parse(userRaw) as { role?: Role }) : null;

  // 🔐 Se precisa auth e não tem token
  if (to.meta.requiresAuth && !token) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  // 🛑 Se tem role definida e não bate com usuário
  if (to.meta.role && user?.role !== to.meta.role) {
    return { name: "login" };
  }
});

export default router;
