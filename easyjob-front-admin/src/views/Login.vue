<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form
        class="login-form"
        :model="formDate"
        ref="formDataRef"
        :rules="rules"
        @submit.prevent
      >
        <div class="login-title">Easyjob 管理后台</div>
        <el-form-item prop="phone">
          <el-input
            size="large"
            clearable
            placeholder="请输入手机号"
            v-model.trim="formData.phone"
          >
            <template #prefix>
              <span class="iconfont icon-phone"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="large"
            clearable
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span> </template
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel"></div>
          <el-input
            size="large"
            clearable
            placeholder="请输入验证码"
            v-model.trim="formData.checkCode"
          >
            <template #prefix>
              <span class="iconfont icon-yanzhengyanzhengma"></span> </template
          ></el-input>
          <img src="/api/checkCode?time=1697873544896" />
        </el-form-item>
        <el-form-item>
          <div class="rememberme-panel">
            <el-checkbox
              v-model="formData.rememberMe"
              :indeterminate="false"
              @change=""
              >记住我</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="op-btn" type="primary" size="large" @click=""
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
</script>

<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  background-size: cover;
  background: url("../assets/login_bg.jpg");
  display: flex;
  .bg {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-size: 800px;
    background-repeat: no-repeat;
    background-image: url("../assets/login_img.png");
  }
  .login-panel {
    width: 430px;
    margin-right: 8%;
    margin-top: calc((100vh - 500px) / 2);
    .login-form {
      padding: 25px;
      background: #fff;
      border-radius: 5px;
      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-mail-btn {
          margin-left: 5px;
        }
      }
      .rememberme-panel {
        width: 100%;
      }
      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
</style>
