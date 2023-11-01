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

const app = createApp(App);

app.use(ElementPlus);
app.use(router);

//配置全局变量
app.config.globalProperties.Request = Request;
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.Message = Message;

app.mount("#app");
