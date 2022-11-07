<template>
    <div class="bg">
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
                当前版本信息：{{ this.version && this.type ? `${this.version}${this.type} 大小：${(Number(this.getVersion()) / 1024
                        / 1024).toFixed(2) + 'M'}` : ''
                }}
                <br>
                资源下载url：
                <el-link v-if="this.url" type="success" :href="this.url">手动下载</el-link>
                <span v-else>
                    暂未获取，请点击下载
                </span>
                <br>
                {{ this.url }}
            </span>
            <h3>
                累计下载人数：<i class="numberpeo"><NumberGrow :value="people" /></i>人
                <br>
                累计下载次数： <i class="number"><NumberGrow :value="total" /></i> 次
            </h3>
        </div>
        <el-dialog title="下载" :visible.sync="dialogVisible" width="30%" :show-close="false" custom-class="downDialog">
            服务器资源下载中...{{ this.nowSize }}/{{ dialogVisible && this.getVersion() }}
            <br>
            服务器资源下载完成后将会触发，自动下载服务器资源...
            <el-progress :text-inside="true" :stroke-width="24"
                :percentage="(Number(nowSize) * 100 / Number(dialogVisible ? getVersion() : 0)).toFixed(2) || 0"
                status="success"></el-progress>
        </el-dialog>
    </div>
</template>
  
<script>
// import axios from 'axios';
import { nodeVersionSize } from 'utils/nodeVersionSize'
import { nodeVersion, nodeType } from 'utils/index'
import http from '../../utils/http';
import NumberGrow from '../../components/NumberGrow'
// import http from 'utils/http';
export default {
    name: '',
    components: {
		NumberGrow
	},
    data() {
        return {
            nodeVersion,
            nodeType,
            version: '',
            type: '',
            loading: false,
            url: '',
            nowSize: 0,
            nodeVersionSize,
            dialogVisible: false,
            people: 0,
            total: 0,
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
        this.getDownTotal()
    },
    methods: {
        change() {
            this.url = ''
        },
        getVersion() {
            let ver = this.nodeVersionSize[this.version] || {};
            let versionSize = 0
            Object.keys(ver).forEach(item => {
                if (item.includes(this.type)) {
                    versionSize = ver[item]
                }
            })
            return versionSize
        },

        getFileSize() {
            setTimeout(() => {
                http.get(`user/getfileProgress?version=${this.version}&type=${this.type}`).then(res => {

                    if (res.code === 0 && (res.data || res.data === 0)) {
                        this.nowSize = res.data;
                        if (Number(res.data) < Number(this.getVersion())) {
                            this.getFileSize()
                        } else {
                            this.nowSize = 0
                        }
                    }
                }).catch((err) => {
                    this.$message.error('请求异常' + err);
                })
            }, 50);
        },
        down() {
            this.dialogVisible = true;
            this.getFileSize()
            http.get(`user/DownloadFile?version=${this.version}&type=${this.type}`).then(res => {
                this.dialogVisible = false
                if (res.code === 0 && res.data) {
                    this.url = res.data
                    window.location.href = res.data;
                    this.getDownTotal()
                }
            }).catch(() => {
                this.dialogVisible = false;
                this.$message.error('请求异常');
            })
        },
        getDownTotal() {
            http.get(`user/InfoUploadList`).then(res => {
                if (res.code === 0 && res.data) {
                    const { total, people } = res?.data || {};
                    this.total = total;
                    this.people = people;
                    // this.numJump(total, 'total')
                }
            }).catch(() => {
                this.$message.error('请求异常');
            })
        },
        numJump(num, key) {
            if (num > 100) {
                let time = num/100;
                let i = 1;
                let timer;
                timer = ()=>setTimeout(() => {
                    console.log(2222,num);
                    if (i >10) {
                        this[key] = num;
                        return
                    }
                    console.log(i * time,'222');
                    this[key] = Math.floor(i * time);
                    i++;
                    timer()
                }, 60)
                timer()
                return
            }
        }
    }
}
</script>
  
<style lang='less'>
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

.dialog-footer {
    text-align: center;
}
.number{
    font-size: 40px;
    color: #9900ff;
    font-weight: 700;
}
.numberpeo{
    font-size: 32px;
    color: #ff00a6;
    font-weight: 700;
}
.downDialog{
    min-width: 300px;
}
</style>