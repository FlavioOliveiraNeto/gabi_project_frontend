import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import PatientDashboard from "../views/PatientDashboard.vue";
import PsychDashboard from "../views/PsychDashboard.vue";
import NotFound from "../views/NotFound.vue";

import type { Role } from "@/services/auth";

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
    path: "/cadastro",
    name: "register",
    component: RegisterView,
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
      role: "therapist" as Role,
    },
  },
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

router.beforeEach((to) => {
  const token = localStorage.getItem("auth_token");
  const userRaw = localStorage.getItem("auth_user");

  let user = null;

  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    localStorage.removeItem("auth_user");
  }

  if (to.meta.requiresAuth && !token) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return { name: "login" };
  }

  if (to.name === "login" && token) {
    if (user?.role === "therapist") {
      return { name: "terapeuta" };
    }
    if (user?.role === "client") {
      return { name: "paciente" };
    }
  }

  return true;
});

export default router;
