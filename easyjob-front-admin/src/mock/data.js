// 模拟数据

// 首页第一栏数据
const mockAllData = {
  data: [
    { statisticsName: "APP下载", count: 121, preCount: 0, listData: null },
    { statisticsName: "注册用户", count: 111, preCount: 0, listData: null },
    { statisticsName: "八股文", count: 377, preCount: 0, listData: null },
    { statisticsName: "考题", count: 223, preCount: 0, listData: null },
    { statisticsName: "分享", count: 102, preCount: 0, listData: null },
    { statisticsName: "反馈", count: 30, preCount: 0, listData: null },
  ],
  code: 200,
  info: "请求成功",
  status: "success",
};

// 首页图表1数据
const mockAppWeekData = {
  data: {
    dataList: [
      "2023-10-15",
      "2023-10-16",
      "2023-10-17",
      "2023-10-18",
      "2023-10-19",
      "2023-10-20",
      "2023-10-21",
    ],
    itemDataList: [
      {
        statisticsName: "App下载",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        statisticsName: "注册用户",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
  code: 200,
  info: "请求成功",
  status: "success",
};

// 首页图表2数据
const mockContentWeekData = {
  data: {
    dataList: [
      "2023-10-15",
      "2023-10-16",
      "2023-10-17",
      "2023-10-18",
      "2023-10-19",
      "2023-10-20",
      "2023-10-21",
    ],
    itemDataList: [
      {
        statisticsName: "八股文",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        statisticsName: "考题",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        statisticsName: "分享",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        statisticsName: "反馈",
        count: null,
        preCount: null,
        listData: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
  code: 200,
  info: "请求成功",
  status: "success",
};

export { mockAllData, mockAppWeekData, mockContentWeekData };
