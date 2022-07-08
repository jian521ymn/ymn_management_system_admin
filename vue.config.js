module.exports = {
	// ...
	devServer: {
		port: 8080,
		proxy: {
			'/user': {
				target: 'http://114.215.183.5:3334',
				ws: true,
				changeOrigin: true,
				// pathRewrite: {
				//   '^/adminapi': ''
				// }
			},
		},
		disableHostCheck: true, // 这是由于新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname 不是配置内的，将中断访问。
	},
	configureWebpack: {
		resolve: {
			alias: {
				// '@': resolve('src'),
				// 'assets': resolve('@/assets'),
				// 'views': resolve('@/views'),
				// 'columns': resolve('@/columns'),
				// 'utils': resolve('@/utils'),
				'assets': '@/assets',
				'common': '@/common',
				'components': '@/components',
				'api': '@/api',
				'views': '@/views',
				'plugins': '@/plugins',
				'utils': '@/utils',
			}
		}
	},
}