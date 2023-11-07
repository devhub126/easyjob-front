<template>
  <!-- 框架布局 -->
  <div class="layout">
    <!-- 头部 -->
    <div class="header">
      <div class="logo">Easyjob管理后台</div>
      <div class="userinfo">
        <!-- 用户信息展示 -->
        欢迎回来,
        <el-dropdown>
          <span class="name">{{ userInfo.userName }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="updateMyPwd">修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <!-- 左侧菜单栏 -->
      <!-- 一级菜单 -->
      <div class="left-sider">
        <div class="menu-list">
          <div
            :class="[
              'menu-item',
              currentPmenu.menuUrl == item.menuUrl ? 'active' : '',
            ]"
            v-for="item in userInfo.menuList"
            @click="pMenuClickHandle(item)"
          >
            <div :class="['iconfont', 'icon-' + item.icon]"></div>
            <div class="menu-name">{{ item.menuName }}</div>
          </div>
        </div>
        <!-- 二级菜单 -->
        <div class="menu-sub-list">
          <div
            @click="jump(sub)"
            :class="[
              'sub-menu',
              currentSubMenu.menuUrl == sub.menuUrl ? 'active' : '',
            ]"
            v-for="sub in currentPmenu.children"
          >
            {{ sub.menuName }}
          </div>
        </div>
      </div>
      <!-- 中间路由页面 -->
      <div class="main-content">
        <div class="tag-content">
          <el-tabs
            v-model="currentSubMenu.menuUrl"
            type="border-card"
            tab-position="top"
            @tab-click="tabClick"
            @edit="editTab"
          >
            <el-tab-pane
              v-for="item in tabList"
              :label="item.menuName"
              :name="item.menuUrl"
              :closable="tabList.length > 1"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="body-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!-- 修改密码组件 -->
    <update-pwd ref="updateMyPwdRef"></update-pwd>
  </div>
</template>

<script setup>
import UpdatePwd from "./UpdatePwd.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const userInfo = ref(
  JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] }
);

// 菜单转化为map对象:即 key:value 的形式
const menuMap = ref({});
const initMenuMap = () => {
  const menuList = userInfo.value.menuList;
  for (let p = 0; p < menuList.length; p++) {
    const pMenu = menuList[p];
    menuMap.value[pMenu.menuUrl] = pMenu;
    if (pMenu.children && pMenu.children.length > 0) {
      for (let s = 0; s < pMenu.children.length; s++) {
        const sub = pMenu.children[s];
        sub["parentPath"] = pMenu.menuUrl;
        menuMap.value[sub.menuUrl] = sub;
      }
    }
  }
};

// 菜单:分为父级/一级/二级
const currentPmenu = ref({ children: [] }); // 一级菜单

// 一级菜单点击
const pMenuClickHandle = (data) => {
  currentPmenu.value = data;
  // 默认选中第一个
  let firstSubMenu = data.children[0];
  jump(firstSubMenu);
};

// 跳转
const jump = (data) => {
  if (currentSubMenu.value.menuUrl == data.menuUrl) {
    return;
  }
  currentSubMenu.value = data;
  addTabHandler(data);
  router.push(data.menuUrl);
};

// 当前二级菜单
const currentSubMenu = ref({});

// 保存菜单状态，防止刷新页面时重置。addTab存在则添加对应的tab标签页
const menuSelect = (curPath, addTab) => {
  let curMenu = menuMap.value[curPath];
  if (curMenu == null) {
    return;
  }
  currentPmenu.value = menuMap.value[curMenu.parentPath];
  currentSubMenu.value = curMenu;
  if (addTab) {
    // 刷新时展示出tab
    addTabHandler(curMenu);
  }
};

onMounted(() => {
  initMenuMap();
  menuSelect(route.path, true);
});

// tab的操作 要点：关闭一个要默认聚焦下一个tab
const tabList = ref([]);

// 添加tab
const addTabHandler = (curMenu) => {
  // console.log(tabList.value);
  let currentTab = tabList.value.find((item) => {
    return item.menuUrl == currentSubMenu.value.menuUrl;
  });
  if (currentTab == null) {
    tabList.value.push(curMenu);
  }
};

const tabClick = (e) => {
  const path = e.props.name;
  menuSelect(path);
  router.push(path);
};

const editTab = (targetKey, action) => {
  if (action !== "remove") {
    return;
  }
  // 移除tab
  let curPath = currentSubMenu.value.menuUrl;
  let tabs = tabList.value;
  if (targetKey == curPath) {
    // 移除当前tab，需要换tab聚焦
    tabs.forEach((tab, index) => {
      if (tab.menuUrl === targetKey) {
        let nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          curPath = nextTab.menuUrl;
        }
      }
    });
  }
  tabList.value = tabs.filter((tab) => tab.menuUrl !== targetKey);
  if (curPath !== currentSubMenu.value.menuUrl) {
    router.push(curPath);
    menuSelect(curPath);
  }
};

// 退出登录
const logout = () => {
  proxy.Confirm("确定要退出吗？", async () => {
    let result = await proxy.Request({
      url: "/logout",
    });
    if (!result) return;
    sessionStorage.removeItem("userInfo");
    router.push("/login");
  });
};

// 修改密码
const updateMyPwdRef = ref();
const updateMyPwd = () => {
  updateMyPwdRef.value.show();
};
</script>

<style lang="scss" scoped>
.layout {
  .header {
    border-bottom: 1px solid #ddd;
    height: 60px;
    padding-right: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #05a1f5;
    }
    .userinfo {
      margin-right: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .name {
        font-size: 1;
        color: #409eff;
        cursor: pointer;
      }
      .user-type {
        margin-left: 5px;
      }
      .layout {
        margin-left: 15px;
      }
    }
  }

  .body {
    display: flex;
    .left-sider {
      width: 260px;
      display: flex;
      height: calc(100vh - 60px);
      border-right: 1px solid #f1f2f4;
      box-shadow: 0 3px 10px 0 rgba(14, 14, 14, 0.06);
      .menu-list {
        width: 70px;
        text-align: center;
        background: #1a1a1a;
        .menu-item {
          text-align: center;
          padding: 15px 0px;
          cursor: pointer;
          color: #fff;
          .iconfont {
            font-size: 20px;
          }
          .icon-app {
            font-size: 25px;
          }
          .menu-name {
            font-weight: bold;
          }
          &:hover {
            color: #06a7ff;
          }
        }
        .active {
          background: #06a7ff;
          &:hover {
            color: #06a7ff;
          }
        }
      }

      .menu-sub-list {
        flex: 1;
        position: relative;
        padding: 5px 5px;
        .sub-menu {
          margin-top: 5px;
          cursor: pointer;
          padding: 10px 8px;
          border-radius: 5px;
          &:hover {
            color: #06a7ff;
          }
        }
        .active {
          background: #e8a4ff;
          color: #1890ff;
        }
      }
    }

    .main-content {
      width: 100%;
      .tag-content {
        :deep(.el-tabs--border-card) {
          border: none;
        }
        :deep(.el-tabs__content) {
          display: none;
        }
      }
      .body-content {
        padding: 10px;
      }
    }
  }
}
</style>
