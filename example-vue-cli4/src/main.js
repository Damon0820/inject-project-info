import Vue from 'vue';
import App from './App.vue';
import { logProjectInfo } from '../../lib/index';
// import logProjectInfo from "inject-project-info/lib/logProjectInfo";
// if (process.env.NODE_ENV === "production") {
//   logProjectInfo();
// }
// console.log("哈哈哈");
// logProjectInfo();
logProjectInfo(process.env.PROJECT_INFO);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

// console.log("构建信息：");
// console.log("process.env.projectInfo", process.env.projectInfo);
// console.log("process.env.VUE_APP_EDU_URL", process.env.VUE_APP_EDU_URL);
