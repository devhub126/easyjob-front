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

// 引入全局组件
import Dialog from "@/components/Dialog.vue";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);

// 定义全局组件
app.component("Dialog", Dialog);

//配置全局变量
app.config.globalProperties.Request = Request;
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.Verify = Verify;

app.mount("#app");
