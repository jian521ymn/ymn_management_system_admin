<template>
    <div class="login-box1">
        <div>
            <el-select v-model="version" placeholder="请选择node版本">
            <el-option v-for="item in nodeVersion" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
        </div>
        <div>
            <el-select v-model="type" placeholder="请选择文件类型">
            <el-option v-for="item in nodeType" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
        </div>
        <div>
            <el-button  type="primary" @click="down">下载{{this.version && this.type ? `${this.version}${this.type}`:''}}</el-button>
        </div>

    </div>
</template>
  
<script>
import axios from 'axios';
import { nodeVersion, nodeType } from 'utils/index'
// import http from 'utils/http';
export default {
    name: '',
    data() {
        return {
            nodeVersion,
            nodeType,
            version:'',
            type:''
        }
    },
    mounted() {
        //   http.get('/user/login')
        //     .then(res => {
        //       if (res?.data?.code === 0) {
        //         this.successMsg('cookie有效，登录')
        //         this.jumpPage(res?.data)
        //       }
        //     })
    },
    methods: {
        down(){
            axios.get(`http://114.215.183.5:3334/user/DownloadFile?version=${this.version}&type=${this.type}`).then(re=>{
                let res =re.data;
                if(res.code === 0 && res.data){
                    window.location.href=res.data
                }
            })
        }
    }
}
</script>
  
<style lang='less' scoped>
.login-box1{
    margin-top:300px;
    div{
        display: inline-block;
        margin-left: 20px;
    }
}
</style>