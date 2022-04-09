module.exports = {
	// ...
	devServer: {
	    port: 8080,
	    proxy: {
	      '/user': {
	        target: 'http://114.215.183.5:3335',
	        ws: true,
	        changeOrigin: true,
	        // pathRewrite: {
	        //   '^/adminapi': ''
	        // }
	      },
	    },
	    disableHostCheck: true, // 这是由于新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname 不是配置内的，将中断访问。
  },
  //...
}
