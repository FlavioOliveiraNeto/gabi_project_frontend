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
import { useAuth } from "@/composables/useAuth";

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
  const { user } = useAuth();
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

export default router;
