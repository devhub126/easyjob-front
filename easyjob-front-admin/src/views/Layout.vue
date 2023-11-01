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
        <div class="menu-sub-list">
          <div
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
        <div class="tag-content"></div>
        <div class="body-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const userInfo = ref(
  JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] }
);

// 菜单高亮
const currentPmenu = ref({ children: [] }); // 二级菜单
const currentSubMenu = ref({});

// 退出登录
const logout = () => {};

// 修改密码
const updateMyPwd = () => {};
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
        // :deep .el-tabs--border-card {
        //   border: none;
        // }
        // :deep .el-tabs__content {
        //   display: none;
        // }
      }
      .body-content {
        padding: 10px;
      }
    }
  }
}
</style>
