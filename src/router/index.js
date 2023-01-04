import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../view/loginPage'
import Menu from '../components/NavMean'
import UserConfig from '../view/userConfig'
import UserRole from '../view/userRole'
import UserRoleApi from '../view/userRoleApi'
import nodeDown from '../view/nodeDown'
 
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
      meta:{
        title:'登录'
      },
      children:[
          {
              name:'角色配置',
              path: 'user',
              component: UserConfig,
              meta:{
                title:'角色配置'
              },
          },
          {
            name:'角色权限',
            path: 'user/power',
            component: UserRole,
            meta:{
              title:'角色权限'
            },
          },
          {
            name:'接口配置',
            path: 'user/power/api',
            component: UserRoleApi,
            meta:{
              title:'接口配置'
            },
          }
      ]
    },
    {
      path: '/login',
      component: LoginPage,
      meta:{
        title:'接口配置'
      },
    },
    {
        path: '/home',
        component: Menu,
        meta:{
          title:'首页'
        },
      },
    {
      path: '/about',
      component: LoginPage,
      meta:{
        title:'关于'
      },
    },
    {
      path: '/node',
      component: nodeDown,
      meta:{
        title:'node版本镜像下载'
      },
    }
  ]
 
//3 创建router实例
export const router = new VueRouter({
  routes
})
/* 第二步：在路由守卫router.beforeEach中设置如下代码 */
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
    next()
  }
})
 
//4 导出routes实例
export {routes}