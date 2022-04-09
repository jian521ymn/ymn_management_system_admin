<template>
  <div class="login-box">
    <div class="login-input-box">
      <h3>账号登陆</h3>
      <el-form ref="form"
               :model="form"
               label-width="0px"
               label-position="right"
               :rules="rules">
        <el-form-item label=""
                      prop="userName">
          <el-input v-model="form.userName"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label=""
                      prop="password">
          <el-input v-model="form.password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import { formValidate } from '../../utils/index'
import http from '../../utils/http'
export default {
  name: '',
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    http.get('/user/login')
    .then(res=>{
      if(res?.data?.code === 0){
        this.successMsg('cookie有效，登录')
      }
    })
  },
  methods: {
    onSubmit () {
      formValidate(this, 'form')
      .then(valid=>{
        if (valid) {
          return http.post('/user/login',{...this?.form})
        }
      })
      .then(res=>{
        if(res?.code !==0){
          this.errorMsg(res?.msg || '未知错误');
          return
        }
        this.successMsg('登录成功！')
        console.log(res?.data);
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login-box {
  position: relative;
  background-image: url("http://114.215.183.5:88/ymn_management_system_admin/xiaolang.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  .login-input-box {
    position: absolute;
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: rgba(255, 255, 255, 0.5);
    padding: 30px;
    h3 {
      padding: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgb(153 153 153);
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>