<template>
  <el-config-provider :locale="locale" :message="config">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import { RouterView } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { reactive } from "vue";

const locale = zhCn;

const config = reactive({
  max: 1,
});
</script>

<style scoped></style>
