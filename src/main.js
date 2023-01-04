import Vue from 'vue'
import ElementUI, { Message } from 'element-ui';
import './assets/css/reset.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import {router} from './router'

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
    type: 'success',
    duration: 3 * 1000,
    ...config
  })
}
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
//Vue全局异常捕获，落日志
const errorHandler = (err, vm, info)=>{
  console.warn('Vue全局异常捕获开始===========')
  console.log(`Error: ${err.toString()}\nInfo: ${info}`)
  if (err.isAxiosError) {
      console.log('axios请求错误！！')
      }
  console.warn('Vue全局异常捕获结束===========')
  
}

// Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error)=> errorHandler(error,this);
