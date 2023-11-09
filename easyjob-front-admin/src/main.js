import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/base.scss";
import "@/assets/icon/iconfont.css";

import VueCookies from "vue-cookies";
import Message from "@/utils/Message";
import Request from "@/utils/Request";
import Confirm from "@/utils/Confirm";
import Verify from "@/utils/Verify";
import PermissionCode from "@/utils/PermissionCode";

// 引入全局组件
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";
import Cover from "@/components/Cover.vue";
import CoverUpload from "@/components/CoverUpload.vue";
import CategorySelect from "@/components/content/CategorySelect.vue";
import SunEditor from "@/components/content/SunEditor.vue";
import ImportData from "@/components/content/ImportData.vue";
import Badge from "@/components/Badge.vue";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);

// 定义全局组件
app.component("Dialog", Dialog);
app.component("Table", Table);
app.component("Cover", Cover);
app.component("CoverUpload", CoverUpload);
app.component("CategorySelect", CategorySelect);
app.component("SunEditor", SunEditor);
app.component("Badge", Badge);
app.component("ImportData", ImportData);

//配置全局变量
app.config.globalProperties.Request = Request;
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.PermissionCode = PermissionCode;
app.config.globalProperties.globalInfo = {
  // 图像
  avatarUrl: "/api/file/getAvatar/",
  imageUrl: "/api/file/getImage/",
};

// 使用自定义指令做权限验证
app.directive("has", {
  mounted: (el, binding, vnode) => {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let permissionCodeList = userInfo.permissionCodeList;
    permissionCodeList =
      permissionCodeList == undefined ? [] : permissionCodeList;
    if (!permissionCodeList.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  },
});

app.mount("#app");
