<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" :maxLength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" :maxLength="11"></el-input>
        </el-form-item>
        <template v-if="!formData.userId">
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
        </template>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" :maxLength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="formData.roles">
            <span
              class="check-span-item"
              v-for="(item, index) in roleList"
              :key="index"
            >
              <el-checkbox :label="item.roleId + ''">{{
                item.roleName
              }}</el-checkbox>
            </span>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadAllRoles: "/settings/loadAllRoles",
  saveAccount: "/settings/saveAccount",
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

const roleList = ref();
const loadRoleList = async () => {
  let result = await proxy.Request({
    url: api.loadAllRoles,
  });
  if (!result) {
    return;
  }
  roleList.value = result.data;
};
loadRoleList();

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.userId == null) {
      dialogConfig.value.title = "新增账号";
      formData.value = { roles: [] };
    } else {
      dialogConfig.value.title = "修改账号";
      let editData = Object.assign({}, data);
      editData.roles = editData.roles.split(",");
      formData.value = Object.assign({}, editData);
    }
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
    params.roles = params.roles.join(",");
    delete params.createTime;
    let result = await proxy.Request({
      url: api.saveAccount,
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

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
