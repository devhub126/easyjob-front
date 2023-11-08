<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-button
          type="primary"
          @click="showEdit()"
          v-has="proxy.PermissionCode.category.edit"
          >新增分类</el-button
        >
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>分类列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        :showPagination="false"
      >
        <template #iconPathSlot="{ index, row }">
          <Cover
            :cover="row.iconPath"
            :bgColor="row.bgColor"
            :title="row.categoryName"
          ></Cover>
        </template>
        <template #typeSlot="{ index, row }">
          <span v-if="row.type == 0">问题分类</span>
          <span v-if="row.type == 1">考题分类</span>
          <span v-if="row.type == 2">问题/考题分类</span>
        </template>
        <template #opSlot="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="changeSort(index, 'up')"
              v-has="proxy.PermissionCode.category.edit"
              :class="[index == 0 ? 'not-allow' : 'a-link']"
              >上移</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="changeSort(index, 'down')"
              v-has="proxy.PermissionCode.category.edit"
              :class="[
                tableData.list.length - 1 == index ? 'not-allow' : 'a-link',
              ]"
              >下移</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.category.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delCategory(row)"
              v-has="proxy.PermissionCode.category.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <CategoryEdit ref="CategoryEditRef" @reload="loadDataList"></CategoryEdit>
  </div>
</template>

<script setup>
import CategoryEdit from "./CategoryEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadCategory: "/category/loadAllCategory",
  saveCategory: "/category/saveCategory",
  delCategory: "/category/delCategory",
  changeSort: "/category/changeSort",
};

const tableData = ref({});
const tableOptions = ref({
  extHeight: 125,
});

const columns = [
  { label: "封面", prop: "iconPath", scopedSlots: "iconPathSlot", width: 150 },
  { label: "分类名称", prop: "categoryName" },
  { label: "类型", prop: "type", scopedSlots: "typeSlot" },
  {
    label: "操作",
    prop: "type",
    width: 200,
    scopedSlots: "opSlot",
  },
];

const tableInfoRef = ref();
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  if (!result) {
    return;
  }
  tableData.value.list = result.data.list;
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
const delCategory = (data) => {
  proxy.Confirm(`确定要删除${data.categoryName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: data.categoryId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

// 上移下移
const changeSort = async (index, type) => {
  let dataList = tableData.value.list;
  if (
    (type == "down" && index == dataList.length - 1) ||
    (type == "up" && index == 0)
  ) {
    return; // 最上的不能上移 最下的不能下移
  }
  let temp = dataList[index];
  let number = type == "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  let categoryIds = [];
  dataList.forEach((el) => {
    categoryIds.push(el.categoryId);
  });
  let result = await proxy.Request({
    url: api.changeSort,
    params: {
      categoryIds: categoryIds.join(","),
    },
  });
  if (!result) {
    return;
  }
  proxy.Message.success("移动成功!");
  loadDataList();
};

const CategoryEditRef = ref();
const showEdit = (data = {}) => {
  CategoryEditRef.value.showEdit(Object.assign({}, data));
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
