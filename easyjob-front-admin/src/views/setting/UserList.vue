<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <el-col :span="7">
              <el-form-item label="用户名">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.userNameFuzzy"
                  @keyup.enter.native="loadDataList"
                  class="password-input"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="手机号">
                <el-input
                  class="password-input"
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.phoneDescFuzzy"
                  @keyup.enter.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :style="{ paddingLeft: '10px' }">
              <el-button type="success" @click="loadDataList()">查询</el-button>
              <el-button
                type="primary"
                @click="showEdit()"
                v-has="proxy.PermissionCode.account.edit"
                >新增用户</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>用户列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
      >
        <template #slotStatus="{ index, row }">
          <span :class="row.status ? 'text-green' : 'text-red'">{{
            row.status ? "启用" : "禁用"
          }}</span>
        </template>
        <template #slotOperation="{ index, row }">
          <div
            class="row-op-panel"
            v-if="!(userInfo.superAdmin && userInfo.userId == row.userId)"
          >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.account.edit"
              >修改</a
            >
            <a
              v-has="proxy.PermissionCode.account.updatePwd"
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="updateAccountPwd(row)"
              >修改密码</a
            >
            <a
              :class="!row.status ? 'text-green' : 'text-red'"
              @click.prevent="changeAccountStatus(row)"
              v-has="proxy.PermissionCode.account.updateStatus"
              >{{ !row.status ? "启用" : "禁用" }}</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delAccount(row)"
              v-has="proxy.PermissionCode.account.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <!-- 新增/修改 -->
    <UserEdit ref="userEditRef" @reload="loadDataList"></UserEdit>
    <UserPasswordEdit ref="userPasswordEditRef"></UserPasswordEdit>
  </div>
</template>

<script setup>
// import Table from "@/components/Table.vue"; // 已经全局引入了
import UserEdit from "./UserEdit.vue";
import UserPasswordEdit from "./UserPasswordEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/settings/loadAccountList",
  delAccount: "/settings/delAccount",
  updateStatus: "/settings/updateStatus",
};

// 用于权限控制
const userInfo = ref(
  JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] }
);

const searchForm = ref({});
const tableData = ref({});
const tableOptions = ref({
  extHeight: 125,
});

const columns = [
  { label: "用户名", prop: "userName", width: 150 },
  { label: "手机", prop: "phone", width: 180 },
  { label: "拥有角色", prop: "roleNames", width: 150 },
  { label: "创建时间", prop: "createTime" },
  { label: "状态", prop: "status", width: 100, scopedSlots: "slotStatus" },
  {
    label: "操作",
    prop: "operation",
    width: 200,
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchForm.value);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result.data);
};

// 修改状态
const changeAccountStatus = (data) => {
  let status = data.status == 0 ? 1 : 0;
  let info = status == 0 ? "禁用" : "启用";
  proxy.Confirm(`确定要${info + data.userName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.updateStatus,
      params: {
        userId: data.userId,
        status: status,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("操作成功!");
    loadDataList();
  });
};

// 删除角色
const delAccount = (data) => {
  proxy.Confirm(`确定要删除${data.userName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delAccount,
      params: {
        userId: data.userId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

const userEditRef = ref();
const showEdit = (data = {}) => {
  userEditRef.value.showEdit(Object.assign({}, data));
};

const userPasswordEditRef = ref();
const updateAccountPwd = (data = {}) => {
  userPasswordEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}

.right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 18px;
}

.text-red {
  color: red;
  cursor: pointer;
}
.text-green {
  color: green;
  cursor: pointer;
}
</style>
