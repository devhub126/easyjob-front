<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
      :width="300"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="用户名">
          {{ formData.userName }}
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="formData.password"
            :maxLength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePassword">
          <el-input
            type="password"
            show-password
            v-model="formData.rePassword"
            :maxLength="20"
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
  updatePassword: "/settings/updatePassword",
};

const dialogConfig = ref({
  show: false,
  title: "修改密码",
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
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      userName: data.userName,
      userId: data.userId,
    };
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
      url: api.updatePassword,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
  });
};
</script>

<style lang="scss" scoped></style>
