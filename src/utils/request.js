import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router/index-router.js'

// create an axios instance
const service = axios.create({
	baseURL: process.env.ENV == 'development' ? '/api' + process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API, // url = base url + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	(config) => {
		// do something before request is sent
		// if (store.getters.token) {
		//   // let each request carry token
		//   // ['X-Token'] is a custom headers key
		//   // please modify it according to the actual situation
		//   config.headers['X-Token'] = getToken()
		// }
		config.withCredentials = true
		return config
	},
	(error) => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	/**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

	/**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
	(response) => {
		const res = response.data
		if (
			res.resultCode !== 0 &&
			res.resultCode !== 200 &&
			res.statusCode !== 0 &&
			res.resultCode !== 500 &&
			res.resultCode !== 404 &&
			res.resultCode !== 402
		) {
			if (response.request.responseType === 'blob') {
				return res
			} else {
				Message({
					message: res.message || 'Error',
					type: 'error',
					duration: 5 * 1000
				})
				if (res.resultCode == 405) {
					router.push('/login')
				}
				if (res.resultCode > 1000) {
					if (res.result) {
						var golink = res.result + '&RetutnUrl=' + window.location.href
						window.location.href = golink
					}
				}
				return Promise.reject(new Error(res.message || 'Error'))
			}
		} else {
			return res
		}
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
export default service
