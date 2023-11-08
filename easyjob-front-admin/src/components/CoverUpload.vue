<template>
  <div>
    <el-upload
      name="file"
      :multiple="false"
      accep=".png,.PNG,.jpg,.JPG,.jepg,.gif,.GIF,.bmp,.BMP"
      :http-request="uploadImg"
    >
      <div
        class="cover-upload-btn"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <template v-if="modelValue">
          <img :src="proxy.globalInfo.imageUrl + modelValue" alt="" />
        </template>
        <template v-else>
          <span class="iconfont icon-jiahao1"></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  uploadFile: "/file/uploadFile",
};

const props = defineProps({
  width: {
    type: Number,
    default: 150,
  },
  height: {
    type: Number,
    default: 150,
  },
  modelValue: {
    type: String,
    default: null,
  },
  type: {
    // 不同地方使用类型不同
    type: Number,
  },
});

const emit = defineEmits();
const uploadImg = async (file) => {
  file = file.file;
  let result = await proxy.Request({
    url: api.uploadFile,
    params: {
      file,
      type: props.type,
    },
  });
  if (!result) {
    return;
  }
  emit("update:modelValue", result.data);  // 返回路径
};
</script>

<style lang="scss" scoped>
.cover-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f1f1;
  overflow: hidden;
  .iconfont {
    font-size: 40px;
    color: rgb(164, 164, 164);
  }
  img {
    width: 100%;
  }
}
</style>
