import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../view/loginPage'
import Menu from '../components/NavMean'
import UserConfig from '../view/userConfig'
import UserRole from '../view/userRole'
import UserRoleApi from '../view/userRoleApi'
 
//1 注入插件
Vue.use(VueRouter)
 
//2 定义路由
const routes =  [
    //添加映射关系
    {
      //默认首页
      path: '/',
      component: Menu,
      redirect:'/login',
      children:[
          {
              name:'角色配置',
              path: 'user',
              component: UserConfig,
          },
          {
            name:'角色权限',
            path: 'user/power',
            component: UserRole,
          },
          {
            name:'接口配置',
            path: 'user/power/api',
            component: UserRoleApi,
          }
      ]
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
        path: '/home',
        component: Menu
      },
    {
      path: '/about',
      component: LoginPage
    }
  ]
 
//3 创建router实例
const router = new VueRouter({
  routes
})
export  {routes}
 
//4 导出router实例
export default router