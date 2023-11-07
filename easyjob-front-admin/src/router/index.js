import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "登录",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/",
      name: "layout",
      component: () => import("@/views/Layout.vue"),
      children: [
        {
          path: "/home",
          name: "首页",
          component: () => import("@/views/home/Home.vue"),
        },
        {
          path: "/content/category",
          name: "内容管理",
          component: () => import("@/views/content/CategoryList.vue"),
        },
        {
          path: "/app/userDevice",
          name: "App发布",
          component: () => import("@/views/app/UserDevice.vue"),
        },
        {
          path: "/settings/menu",
          name: "菜单管理",
          component: () => import("@/views/setting/MenuList.vue"),
        },
        {
          path: "/settings/role",
          name: "角色管理",
          component: () => import("@/views/setting/RoleList.vue"),
        },
      ],
    },
  ],
});

// 路由拦截
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem("userInfo");
  if (!userInfo && to.path != "/login") {
    router.push("/login");
  }
  next();
});

export default router;
