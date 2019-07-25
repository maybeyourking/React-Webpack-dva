//强调：初次运行项目，需要首先yarn dll剥离出dll文件，为了在整个开发周期中提高打包速度，推荐隔段时间就yarn dll 剥离第三方库dll。
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 向dist文件中自动添加模版html,不生成dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 打包后先清除dist文件，先于HtmlWebpackPlugin运行
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//想要分开打包我们的css文件，需要使用mini-css-extract-plugin这个插件，
                                                                //但是这个插件目前还不支持HMR,为了不影响开发效率，因此就在生成环境下使用该插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");//这个插件可以帮助我们把相同的样式合并。
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default; //插件可以帮我们把过大的css文件拆分
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');//将打包生产的dll.js文件自动引入html
const fs = require('fs');//fs文件读取
const WorkboxPlugin = require('workbox-webpack-plugin');//PWA全称progressive Web Application,PWA实现的功能是即便服务器挂掉，还是可以通过在本地的缓存来访问到页面。
                                        //运行命令打包后会多出两个文件precache-manifest.js和service-worker.js, service-worker这个文件就可以让我们的页面被缓存住
                                        //关于PWA介绍https://lavas.baidu.com/pwa/README
const WebpackBar = require('webpackbar');// webpack打包进度条
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');// 能够更好在终端看到webapck运行的警告和错误

const plugins = [//插件              
    new HtmlWebpackPlugin({   // 向dist文件中自动添加模版html,不生成dist目录
        template: './index.html',
    }),
    new CleanWebpackPlugin(), // 打包后先清除dist文件，先于HtmlWebpackPlugin运行
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].chunk.css'
    }),
    new CSSSplitWebpackPlugin({
        size: 4000,
        filename: '[name]-[part].[ext]'
    }),
    new webpack.HashedModuleIdsPlugin(),  //根据模块的相对路径生成一个四位数的hash,实现持久化缓存,生产环境建议使用
    //为了解决浏览器文件缓存问题，例如：代码更新后，文件名称未改变，浏览器非强制刷新后，浏览器去请求文件时认为文件名称未改变而直接从缓存中读取不去重新请求。
    //我们可以在webpack.production.js输出文件名称中添加hash值.
    //使用HashedModuleIdsPlugin的原因是可以当更改某一个文件时，只改变这一个文件的hash值，而不是所有的文件都改变。
    new WorkboxPlugin.GenerateSW({//PWA优化
        clientsClaim: true,
        skipWaiting: true
    }),
    new WebpackBar(),// webpack打包进度条
    new FriendlyErrorsWebpackPlugin(), // 能够更好在终端看到webapck运行的警告和错误
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'));

files.forEach((file) => {
	if (/.*\.dll.js/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({ // 将dll.js文件自动引入html
			filepath: path.resolve(__dirname, '../dll', file),
		}));
	}
	if (/.*\.manifest.json/.test(file)) {
        plugins.push(new webpack.DllReferencePlugin({//当打包第三方库时，会去manifest.json文件中寻找映射关系，
                                                    //如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
			manifest: path.resolve(__dirname, '../dll', file),
		}));
	}
});

module.exports = {
    mode: "production",  // 只要在生产模式下， 代码就会自动压缩，自动启用 tree shaking
    //注意：Tree Shaking可以剔除掉一个文件中未被引用掉部分，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件
    //，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除，用scss或less编译也必须添加
    devtool:"cheap-module-source-map", // 生产配置最佳实践
    entry: {                  // 入口文件
        main: './index.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'], // 当通过import child from './child/child'形式引入文件时，会先去寻找.js为后缀当文件，再去寻找.jsx为后缀的文件
        mainFiles: ['index', 'view'], // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找view开头的文件
        // alias: {
        //     home: path.resolve(__dirname, '../src/home') // 配置别名可以加快webpack查找模块的速度, 引入home其实是引入../src/home
        // }
    },  
    module: {//加载模块规则,让 webpack 能够去处理那些非 JavaScript 文件,当然也能处理js文件
        /**我们在 webpack 中定义的一个个 loader，本质上只是一个函数，在定义 loader 同时还会定义一个 test 属性，
         * webpack 会遍历所有的模块名，当匹配 test 属性定义的正则时，会将这个模块作为 source 参数传入 loader 中执行，
         * webpack loader的执行顺序是从右到左，即从后向前执行。 */
        rules: [{       /**js的配置 */
            test: /\.js$/,    // 注意这里要写正确，不然useBuiltIns不起作用,useBuiltIns被抽离在.babelrc文件
            exclude: /node_modules/, // 排除node_modules中的代码
            use: [{
                loader: 'babel-loader', // 只是babel和webpack之间的桥梁，并不会将代码转译
            }],
        },
        {               /**less的配置 */
            test: /\.less$/,  //寻找less文件
            exclude: /node_modules/, //忽略
            use: [MiniCssExtractPlugin.loader,/**注意:webpack loader的执行顺序是从右到左 
                // less-loader 编译less
                //css-loader  编译css
                //postcss-loader  提供自动添加厂商前缀的功能，但是需要配合autoprefixer插件来使用*/
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                }, 'less-loader', 'postcss-loader']  //使用style-loader,css-loader,less-loader,postcss-loader
        },
        {
            test: /\.css$/, //寻找css文件
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] //使用MiniCssExtractPlugin.loader,css-loader,postcss-loader
        },
        {               /**图标和图片的处理的配置 */
            test: /\.(png|jpg|gif|jpeg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]', // placeholder 占位符
                    outputPath: 'images/', // 打包文件名
                    limit: 204800, // 小于200kb则打包到js文件里，大于则使用file-loader的打包方式打包到imgages里
                },
            },
        },
        {
            test: /\.(eot|woff2?|ttf|svg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]-[hash:5].min.[ext]', // 和上面同理
                    outputPath: 'fonts/',
                    limit: 5000,
                }
            },
        }]
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],//css代码分割。
        splitChunks: {//代码分割SplitChunksPlugin配置
            chunks: "all",    // 只对异步引入代码起作用，设置all时并同时配置vendors才对两者起作用
            minSize: 30000,   // 引入的库大于30kb时才会做代码分割
            minChunks: 1,     // 一个模块至少被用了1次才会被分割
            maxAsyncRequests: 5,     // 同时异步加载的模块数最多是5个，如果超过5个则不做代码分割
            maxInitialRequests: 3,   // 入口文件进行加载时，引入的库最多分割出3个js文件
            automaticNameDelimiter: '~',  // 生成文件名的文件链接符
            name: true,   // 开启自定义名称效果
            cacheGroups: {  // 判断分割出的代码放到哪个文件
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendors: {   // 配合chunks： ‘all’使用，表示如果引入的库是在node-modules中，那就会把这个库分割出来并起名为vendors.js
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: 'vendors.js'
                },
                default: {  // 为非node-modules库中分割出的代码设置默认存放名称
                    priority: -20,
                    reuseExistingChunk: true, // 避免被重复打包分割
                    filename: 'common.js'
                }
            }
        }
	},
    plugins,//plugins被DellPlugin后
    output: {
        publicPath:'/reactwebpackdva/',
        filename: '[name].[contenthash].js',//打包后输出的文件名称 //entry对应的key值
        chunkFilename: '[name].[contenthash].js',  // 间接引用的文件会走这个配置
        path: path.resolve(__dirname, '../dist') 
    }
}

//打包时若用了hsitory路由模式，服务器上线后，用户刷新页面404的问题，其实是服务器当收到路由跳转时当成了真的URL去解析，而服务器目录下又没有此目录，
//所以需要在服务端做一些配置，用hash路由模式不会有此问题。
//配置方式
//1、写node服务 (publicPath：'/')
//  在服务器目录下挂载一个node express服务
//  监听所有路径，若匹配不到重定向到index.html,具体代码在/server/server.js  
//2、利用nginx配置(publicPath:'/服务器此项目文件夹目录/')
//  nginx配置：
//  #reactwebpackdva
//  location /reactwebpackdva {
//      alias /home/reactwebpackdva/;
//      index  index.html;
//      try_files $uri  /reactwebpackdva/index.html;  
//  }
