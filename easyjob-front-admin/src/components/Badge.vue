<template>
  <div class="my-badge">
    <div class="badge" :style="{ background: showType }"></div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  showType: {
    type: String,
  },
  text: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.my-badge {
  display: flex;
  align-items: center;
  .badge {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }
  .text {
    margin-left: 5px;
  }
}
</style>
