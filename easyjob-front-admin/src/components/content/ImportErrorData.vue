<template>
  <!-- 展示导入excel错误提示 -->
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <Table
        :columns="columns"
        :dataSource="tableData"
        :options="tableOptions"
        :initFetch="false"
        :showPagination="false"
      >
        <template #slotErrorItem="{ index, row }">
          <div class="error-list">
            <div class="item" v-for="(item, num) in row.errorItemList">
              {{ num++ }}、{{ item }}
            </div>
          </div>
        </template>
      </Table>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = ref({
  show: false,
  title: "错误信息",
  buttons: [
    {
      type: "primary",
      text: "关闭",
      click: (e) => {
        dialogConfig.value.show = false;
      },
    },
  ],
});

const columns = [
  {
    label: "错误行",
    prop: "rowNum",
    width: 100,
  },
  {
    label: "错误信息",
    prop: "errorItemList",
    scopedSlots: "slotErrorItem",
  },
];

const tableData = ref({});
const tableOptions = {
  extHeight: 20,
};

const showData = (data) => {
  dialogConfig.value.show = true;
  tableData.value.list = data;
};

defineExpose({
  showData,
});
</script>

<style lang="scss" scoped></style>
