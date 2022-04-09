import Vue from 'vue'
import ElementUI, { Message } from 'element-ui';
import './assets/css/reset.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(ElementUI);

Vue.config.productionTip = false
// 向Vue实例上注入全局方法
Vue.prototype.errorMsg=(text,config)=>{
  Message({
    message: text,
    type: 'error',
    duration: 3 * 1000,
    ...config
  })
}
Vue.prototype.successMsg=(text,config)=>{
  Message({
    message: text,
    type: 'ersucessror',
    duration: 3 * 1000,
    ...config
  })
}

new Vue({
  render: h => h(App),
}).$mount('#app')
