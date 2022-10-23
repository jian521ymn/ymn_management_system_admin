<template>
    <div class="bg" v-loading="loading" element-loading-text="服务器资源下载中，下载完成后将自动下载">
        <div class="login-box1">
            <h2>node镜像下载JY</h2>
            <div>
                <el-select v-model="version" placeholder="请选择node版本" @change="change">
                    <el-option v-for="item in nodeVersion" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-select v-model="type" placeholder="请选择文件类型">
                    <el-option v-for="item in nodeType" :key="item" :label="item" :value="item" @change="change">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button :disabled="!version || !type" type="primary" @click="down">下载</el-button>
            </div>
        </div>
        <div class="remark">
            <span>
                当前版本信息：{{this.version && this.type ? `${this.version}${this.type}`:''}}
                <br>
                资源下载url：
                <el-link v-if="this.url" type="success" :href="this.url">手动下载</el-link>
                <span v-else>
                    暂未获取，请点击下载
                </span>
                <br>
                {{this.url}}
            </span>
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
            version: '',
            type: '',
            loading: false,
            url: ''
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
        change() {
            this.url = ''
        },
        down() {
            this.loading = true;
            axios.get(`http://114.215.183.5:3334/user/DownloadFile?version=${this.version}&type=${this.type}`).then(re => {
                this.loading = false
                let res = re.data;
                if (res.code === 0 && res.data) {
                    this.url = res.data
                    window.location.href = res.data
                }
            }).catch(() => {
                this.loading = false;
                this.$message.error('请求异常');
            })
        }
    }
}
</script>
  
<style lang='less' scoped>
.bg {
    background-image: url(http://114.215.183.5:88/cc/node.jpeg);
    width: 100vw;
    height: 100vh;
    background-size: 100%;
    background-repeat: no-repeat;
    background-attachment: fixed
}

.login-box1 {
    padding-top: 300px;

    div {
        display: inline-block;
        margin-top: 10px;
        margin-left: 20px;
        min-width: 200px;
    }
}

.remark {
    margin-top: 50px;

    >span {
        display: inline-block;
        padding: 10px;
        border-radius: 10px;
        background: white;
    }
}
</style>