<template>
  <div>
    <div class="part-panel">
      <el-card class="box-card">
        <div slot="header" class="card-title">
          <span>数据概括</span>
        </div>
        <div class="data-list">
          <el-row :gutter="10">
            <el-col :span="4" v-for="item in allDataList">
              <div class="data-item">
                <div class="title">{{ item.statisticsName }}</div>
                <div class="data-panel">
                  <div class="data">{{ item.count }}</div>
                  <div class="pre">
                    昨日新增: <span class="new">{{ item.preCount }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="part-panel">
      <el-card class="box-card">
        <div slot="header" class="card-title">
          <span>近一周数据概括</span>
        </div>
        <div class="data-list">
          <el-row :gutter="10">
            <el-col :span="12">
              <div ref="myChats4AppWeekDataRef" class="chat"></div>
            </el-col>
            <el-col :span="12">
              <div ref="myChats4ContentWeekDataRef" class="chat"></div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, shallowRef } from "vue";
import {
  mockAllData,
  mockAppWeekData,
  mockContentWeekData,
} from "@/mock/data.js";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();

const api = {
  getAllData: "/index/getAllData",
  getAppWeekData: "/index/getAppWeekData",
  getContentWeekData: "/index/getContentWeekData",
};

// 查询数据概括
const allDataList = ref([]);
const loadAllData = async () => {
  // let result = await proxy.Request({
  //   url: api.getAllData,
  // });
  // if (!result) {
  //   return;
  // }
  // allDataList.value = result.data;
  allDataList.value = mockAllData.data; // 使用模拟数据
};

loadAllData();

// echat 配置
const getOption = (title, xAxisData = [], seriesData = []) => {
  return {
    title: {
      text: title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        textStyle: {
          color: "red",
        },
      },
    },
    legend: {
      x: 200,
    },
    grid: {
      left: 50,
      right: 0,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: "#90979c",
        },
      },
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: "45",
      },
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
  };
};

// 查询图表1
const myChats4AppWeekDataRef = ref();
const myChats4AppWeekData = shallowRef();
const init4AppWeekData = () => {
  nextTick(() => {
    myChats4AppWeekData.value = echarts.init(myChats4AppWeekDataRef.value);
    loadAppWeekData();
  });
};

init4AppWeekData();

// 获取数据
const loadAppWeekData = async () => {
  // let result = await proxy.Request({
  //   url: api.getAppWeekData,
  // });
  // if (!result) {
  //   return;
  // }
  // const data = result.data;
  const data = await mockAppWeekData.data; // 使用模拟数据
  console.log(data);
  const xAxisData = data.dataList;
  const seriesData = [];
  const color = ["#1b9cfc", "#67c23a"];
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: "bar",
      smooth: true, // 平滑曲线
      data: item.listData,
      itemStyle: {
        color: color[index],
      },
    });
  });
  myChats4AppWeekData.value.setOption(
    getOption("App下载用户统计", xAxisData, seriesData)
  );
};

// 图表2
const myChats4ContentWeekDataRef = ref();
const myChats4ContentWeekData = shallowRef();
const init4ContentWeekData = () => {
  nextTick(() => {
    myChats4ContentWeekData.value = echarts.init(
      myChats4ContentWeekDataRef.value
    );
    loadContentWeekData();
  });
};

init4ContentWeekData();

const loadContentWeekData = async () => {
  // let result = await proxy.Request({
  //   url: api.getContentWeekData,
  // });
  // if (!result) {
  //   return;
  // }
  // const data = result.data;
  const data = await mockContentWeekData.data; // 使用模拟数据
  console.log(data);
  const xAxisData = data.dataList;
  const seriesData = [];
  const color = ["#1b9cfc", "#67c23a", "#33166e", "#fb7993", "#a4c4fc"];
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: "bar",
      smooth: true, // 平滑曲线
      data: item.listData,
      itemStyle: {
        color: color[index],
      },
    });
  });
  myChats4ContentWeekData.value.setOption(
    getOption("内容统计", xAxisData, seriesData)
  );
};
</script>

<style lang="scss" scoped>
.card-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.part-panel {
  margin-top: 10px;
  &:first-child {
    margin-top: 0px;
  }
}

.data-list {
  .data-item {
    background: #f4f9fd;
    color: #9a9fa6;
    padding: 20px;
    border-radius: 5px;
    width: 100%;
    .data-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .data {
      font-size: 25px;
      color: #000012;
      font-weight: bold;
    }
    .pre {
      margin-top: 5px;
      .new {
        color: #ff6873;
      }
    }
  }
}

.chat {
  height: calc(100vh - 400px);
}
</style>
