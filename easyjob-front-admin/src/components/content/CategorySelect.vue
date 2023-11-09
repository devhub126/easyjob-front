<template>
  <div>
    <el-select
      clearable
      placeholder="请选择分类"
      :modelValue="modelValue"
      @change="onChange"
    >
      <el-option
        v-for="item in categoryList"
        :value="item.categoryId"
        :label="item.categoryName"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: [Number, String],
  },
  type: {
    type: Number,
  },
});

const api = {
  loadCategory: "/category/loadAllCategory4Select",
};

const categoryList = ref([]);

const loadCategory = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
    params: {
      type: props.type,
    },
  });
  if (!result) {
    return;
  }
  categoryList.value = result.data;
};
loadCategory();

const emit = defineEmits(["update:modelValue", "change"]);

const onChange = (e) => {
  emit("update:modelValue", e);
  emit("change");
};
</script>

<style lang="scss" scoped></style>
