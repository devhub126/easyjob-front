<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
      width="90%"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-row :getter="10">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" :maxLength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类" prop="categoryId">
              <CategorySelect
                v-model="formData.categoryId"
                :type="0"
              ></CategorySelect>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficultyLevel">
              <el-rate v-model="formData.difficultyLevel"></el-rate>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :getter="10">
          <el-col :span="12">
            <el-form-item label="问题" prop="content">
              <SunEditor v-model="formData.question"></SunEditor> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="答案分析" prop="answerAnalysis">
              <SunEditor
                v-model="formData.answerAnalysis"
              ></SunEditor> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveQuestionInfo: "/questionInfo/saveQuestionInfo",
};

const dialogConfig = ref({
  show: false,
  title: "新增账号",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const validateRePass = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = {
  userName: [{ required: true, message: "请输入用户名" }],
  password: [
    { required: true, message: "请输入密码" },
    {
      message: "密码由8位数字或密码组成",
      validator: proxy.Verify.password,
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      message: "两次输入的密码不一致",
      validator: validateRePass,
    },
  ],
  phone: [
    { required: true, message: "请输入手机号" },
    {
      message: "请输入正确的手机号",
      validator: proxy.Verify.phone,
      trigger: "blur",
    },
  ],
  email: [
    {
      validator: proxy.Verify.email,
      trigger: "blur",
      message: "请输入正确的邮箱",
    },
  ],
  roles: [{ required: true, message: "请选择角色" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = Object.assign({}, data || {});
  });
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveQuestionInfo,
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
