<template>
  <div class="hello">
    <el-container style="height: 100vh;">
      <el-aside class="aside-box" width="200px ">
        <div style="height:60px; color: azure; padding: 10px;">
          管理后台
        </div>
        <el-menu :default-active="hash" class="el-menu-vertical-demo"  @select="select"
          background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" >
              <el-menu-item index="user">用户配置</el-menu-item>
              <el-menu-item index="user/power">角色配置</el-menu-item>
              <el-menu-item index="user/power/api">接口配置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container direction="vertical" style="height: 100%;">
        <div style="padding: 30px 40px 0;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.getBreadcrumb()}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div style="padding: 30px 40px 0;">
          <router-view></router-view>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {routes} from "../../router"
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(20).fill(item),
      hash: this.getHash(),
      
    }
  },
  methods: {
    select(key){
      window.location.href = `${window.location.origin}/#/${key}` 
    },
    getHash(){
      return window?.location?.hash?.replace(/^#\//g,'').replace(/\?.*$/g,'')
    },
    getBreadcrumb(){
      let breadcrumbText =''
      let hash =this.getHash()
      function breadcrumbMap (arr){
        arr.forEach(item => {
          if(item?.path === hash){
            breadcrumbText = item?.name
          }
          if(item?.children?.length){
              breadcrumbMap(item?.children)
          }
        });
      }
      breadcrumbMap(routes)
      return breadcrumbText
    }
  }
}
</script>

<style lang='less' scoped>
.aside-box {
  background-image: linear-gradient(#28303b, #838fa1);
  // background: #409eff;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid #d1d1d1;

  .el-menu {
    background: transparent;
  }
}

.hello {
  height: 100vh;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.text {
  color: rgb(115, 115, 115);
}
</style>
