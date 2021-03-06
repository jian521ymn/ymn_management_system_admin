import axios from "axios";
import { Message } from "element-ui";
import { getCookie } from 'utils/index'
//默认配置
const http = axios.create({
    baseURL: process.env.NODE_ENV !== "production" ? '' : 'http://114.215.183.5:3334',
    withCredentials: true,
    params:{
        userNames:getCookie().userNames
    },
    timeout: 500000
})
// 请求拦截器
http.interceptors.request.use((config) => {
        config.withCredentials = true
        return config
    },
    (error) => {
        return Promise.reject(error)
    })
// 响应拦截器
http.interceptors.response.use(
    (response) => {
        const res = response.data;
        // cookie失效跳转逻辑
        return res
    },
    (error) => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)
export default http