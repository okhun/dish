import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("./../pages/BoardView.vue"),
  },
  {
    path: "/mail",
    name: "mail",
    component: () => import("./../pages/MailView.vue"),
  },
  {
    path: "/notification",
    name: "notification",
    component: () => import("./../pages/NotificationView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("./../pages/SettingsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
