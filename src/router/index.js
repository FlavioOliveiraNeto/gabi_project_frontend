import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PatientDashboard from '../components/PatientDashboard.vue'
import PsychDashboard from '../components/PsychDashboard.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/patient', name: 'patient', component: PatientDashboard },
  { path: '/psych', name: 'psych', component: PsychDashboard }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
