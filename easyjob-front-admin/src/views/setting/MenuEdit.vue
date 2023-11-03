<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            clearable
            placeholder="菜单名称"
            v-model.trim="formData.menuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="pId" v-if="formData.pId != 0">
          <el-tree-select
            v-model="formData.pId"
            :data="treeData"
            :props="treeProps"
            defaultExpandAll
            node-key="menuId"
            show-search
            style="width: 100%"
            :check-strictly="true"
            placeholder="选择父级菜单"
          >
          </el-tree-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="formData.menuType">
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="请求路径"
          prop="menuUrl"
          v-if="formData.menuType == 0"
        >
          <el-input
            :maxlength="50"
            clearable
            placeholder="eg:/settings/user"
            v-model="formData.menuUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input
            v-model="formData.permissionCode"
            :maxlength="50"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input
            v-model="formData.icon"
            :maxlength="10"
            clearable
            placeholder="eg:home"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="formData.sort"
            :maxlength="10"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveMenu: "/settings/saveMenu",
};

const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
});

// tree 组件的映射关系
const treeProps = {
  class: "cust-tree-item",
  children: "children",
  label: "menuName",
  value: "menuId",
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  menuName: [{ required: true, message: "请输入名称" }],
  pId: [{ required: true, message: "请选中父级菜单" }],
  menuType: [{ required: true, message: "请选择菜单类型" }],
  menuUrl: [{ required: true, message: "请选择菜单路径" }],
  menuCode: [{ required: true, message: "请输入权限编码" }],
  sort: [
    { required: true, message: "请输入排序号" },
    {
      validator: proxy.Verify.number,
      trigger: "blur",
      message: "请输入正确的排序号",
    },
  ],
};

const dialogConfig = ref({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const showEditDialog = (type, data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (type == "edit") {
      dialogConfig.value.title = "修改菜单";
      formData.value = Object.assign({}, data);
    } else {
      dialogConfig.value.title = "新增菜单";
      formData.value = { pId: data.menuId };
    }
  });
};

defineExpose({
  showEditDialog,
});

const emit = defineEmits(["reload"]);

// 提交添加/修改
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.children; // 只需要操作当前菜单项
    let result = await proxy.Request({
      url: api.saveMenu,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped></style>
