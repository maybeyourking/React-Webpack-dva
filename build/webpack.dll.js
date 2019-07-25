//强调：初次运行项目，需要首先剥离出dll文件，webpack.dll.js, 命令：yarn dll
//对于第三方库，这些库在很长的一段时间内，基本不会更新，打包的时候分开打包来提升打包速度, DllPlugin动态链接库插件，
//其原理就是把网页依赖的基础模块抽离出来打包到dll文件中，当需要导入的模块存在于某个dll中时，这个模块不再被打包，而是去dll中获取。
//add-asset-html-webpack-plugin: 将打包生产的dll.js文件自动引入html
//fs文件读取
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
		vendors: ['lodash'],
		react: ['react', 'react-dom'],
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, '../dll'),
		library: '[name]',
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.resolve(__dirname, '../dll/[name].manifest.json'),
		}),
	],
};