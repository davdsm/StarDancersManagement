import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import FamiliesView from "@/views/FamiliesView.vue";
import NotificationsView from "@/views/NotificationsView.vue";
import ReportsView from "@/views/ReportsView.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/families",
      name: "families",
      component: FamiliesView,
    },
    {
      path: "/notifications",
      name: "notifications",
      component: NotificationsView,
    },
    {
      path: "/reports",
      name: "reports",
      component: ReportsView,
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Login,
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.path === "/login") return;

  const userStore = useUserStore();
  await userStore.fetchUser();

  if (!userStore.isAdmin && to.path !== "/") {
    return { path: "/" };
  }
});

export default router;
