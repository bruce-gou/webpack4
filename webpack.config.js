const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pathName = "src";
module.exports = {
	entry: {
		//入口
		index: path.resolve(__dirname, `${pathName}/index.js`),
		//插件入口,合并第三方包
		vendor: ['react', 'react-dom']
	},
	output: { // 出口
		path: path.join(__dirname, 'dist'), // 打包文件的路径，__dirname指当前根目录
		filename: '[name].[hash:7].js', //入口文件命名
    		chunkFilename: '[name].chunk.[hash:7].js' //非入口文件命名
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015', 'stage-1']
					}
				}]
			},
			{
				test: /\.(sa|sc|le|c)ss$/,
				use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'images/[hash:8].[name].[ext]'
					}
				}]
			}
		]
	},
	optimization: {
		//插件合并
		splitChunks: {
			chunks: 'async', // 哪些块进行优化，有效值为all，async 和 initial
			minSize: 30000, //要生成的块的最小大小（以字节为单位）
			maxSize: 0,
			minChunks: 1, // 分割前必须共享模块的最小块数。
			maxAsyncRequests: 5, //按需加载时的最大并行请求数
			maxInitialRequests: 3, // 入口点处的最大并行请求数。
			automaticNameDelimiter: '~',// 使用模块名字
			name: true, //拆分块的名称。提供true将根据块和缓存组密钥自动生成名称。
			cacheGroups: { // 这里面声明的 可以覆盖 splitChunks 中的配置
				vendors: {
					test: /[\\/]node_modules[\\/]/, //控制此缓存组选择的模块。省略它选择所有模块
					priority: -10 //优先级
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},
		//压缩文件
		minimizer: [
			new UglifyJsPlugin({
				test: /\.js(\?.*)?$/i,
				cache: true,
				parallel: true,
				sourceMap: true,
				uglifyOptions: {
				 warnings: false,
		          compress:{
		          	drop_console: true
		          }
		        }
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		//css引入--内联
	    new MiniCssExtractPlugin({
			chunkFilename: '[name].chunk.[hash].js'
	    }),
		//导出最终生成的入口文件html
		new HtmlWebpackPlugin({
			filename: 'index.html', //文件名
			template: `${pathName}/index.html`, //入口
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			},
			chunksSortMode: 'dependency'
		})
	],
	resolve: {
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'@': path.resolve(__dirname, pathName)
		}
	},
	devServer: {
		// 设置基本目录结构
		contentBase: path.join(__dirname, 'dist'),
		// 服务器的ip地址，也可以使用localhost
		host: 'localhost',
		// 服务端压缩是否开启
		compress: true,
		// 配置服务端口号
		port: 8000,
		// 设置代理
//		proxy: {
//			"/api": {
//				target: "http://192.168.1.6:8000",
//				pathRewrite: {
//					"^/api": "/"
//				},
//				secure: false,
//				changeOrigin: true
//			}
//		}
	}
}