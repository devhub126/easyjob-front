<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <el-col :span="3">
              <el-form-item label="标题" label-width="40px">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.titleFuzzy"
                  @keyup.enter.native="loadDataList"
                  class="password-input"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="分类" label-width="50px">
                <!-- 下拉组件 -->
                <CategorySelect
                  :type="0"
                  v-model="searchForm.categoryId"
                  @change="loadDataList"
                ></CategorySelect>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="难度" label-width="50px">
                <el-select
                  clearable
                  placeholder="请选择难度"
                  v-model="searchForm.difficultyLevel"
                >
                  <el-option :value="1" label="一星"></el-option>
                  <el-option :value="2" label="二星"></el-option>
                  <el-option :value="3" label="三星"></el-option>
                  <el-option :value="4" label="四星"></el-option>
                  <el-option :value="5" label="五星"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="状态" label-width="50px">
                <el-select
                  clearable
                  placeholder="请选择状态"
                  v-model="searchForm.status"
                >
                  <el-option :value="0" label="待发布"></el-option>
                  <el-option :value="1" label="已发布"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="创建人">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.createUserFuzzy"
                  @keyup.enter="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :style="{ paddingLeft: '10px' }">
              <div class="elbtn-group">
                <el-button-group>
                  <el-button type="success" @click="loadDataList()" size="small"
                    >查询</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="showEdit()"
                    v-has="proxy.PermissionCode.account.edit"
                    >新增</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="importData()"
                    v-has="proxy.PermissionCode.account.edit"
                    >批量导入</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="showEdit()"
                    v-has="proxy.PermissionCode.account.edit"
                    >批量发布</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="showEdit()"
                    v-has="proxy.PermissionCode.account.edit"
                    >批量删除</el-button
                  >
                </el-button-group>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
      >
        <template #slotDifficultyLevel="{ index, row }">
          <el-rate v-model="row.difficultyLevel" :disabled="true"></el-rate>
        </template>
        <template #slotStatus="{ index, row }">
          <Badge
            :showType="row.status == 0 ? 'orange' : 'green'"
            :text="row.status == 0 ? '待发布' : '已发布'"
          ></Badge>
        </template>
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.account.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delQuestion(row)"
              v-has="proxy.PermissionCode.account.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <!-- 新增/修改 -->
    <QuestionEdit ref="QuestionEditRef" @reload="loadDataList"></QuestionEdit>
    <!-- 引入Excel: type=0 表示上传的问题类型  19p完-->
    <ImportData
      ref="importDataRef"
      :type="0"
      @reload="loadDataList"
    ></ImportData>
  </div>
</template>

<script setup>
import QuestionEdit from "./QuestionEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/questionInfo/loadDataList",
  delQuestion: "/questionInfo/delQuestion",
  delQuestionBatch: "/questionInfo/delQuestionBatch",
  postQuestion: "/questionInfo/postQuestion",
  cancelPostQuestion: "/questionInfo/cancelPostQuestion",
};

// 用于权限控制
const userInfo = ref(
  JSON.parse(sessionStorage.getItem("userInfo")) || { menuList: [] }
);

const searchForm = ref({});
const tableData = ref({});
const tableOptions = ref({
  extHeight: 10,
  selectType: "checkbox",
});

const columns = [
  { label: "ID", prop: "questionId", width: 80 },
  { label: "标题", prop: "title", scopedSlots: "slotTitle" },
  { label: "分类", prop: "categoryName", width: 150 },
  {
    label: "难度",
    prop: "difficultyLevel",
    width: 130,
    scopedSlots: "slotDifficultyLevel",
  },
  { label: "创建人", prop: "createUserName", width: 150 },
  { label: "创建时间", prop: "createTime", width: 180 },
  { label: "发布状态", prop: "status", width: 90, scopedSlots: "slotStatus" },
  { label: "操作", width: 130, scopedSlots: "slotOperation" },
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

const QuestionEditRef = ref();
const showEdit = (data = {}) => {
  QuestionEditRef.value.showEdit(Object.assign({}, data));
};

// 导入
const importDataRef = ref();
const importData = () => {
  importDataRef.value.showImport();
};

// 删除提问
const delQuestion = (data) => {
  proxy.Confirm(`确定要删除${data.userName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delQuestion,
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

.elbtn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
