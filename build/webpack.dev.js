//强调：初次运行项目，需要首先yarn dll剥离出dll文件,为了在整个开发周期中提高打包速度，推荐隔段时间就yarn dll 剥离第三方库dll。
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 向dist文件中自动添加模版html,不生成dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 打包后先清除dist文件，先于HtmlWebpackPlugin运行
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');//将打包生产的dll.js文件自动引入html
const fs = require('fs');//fs文件读取
const WebpackBar = require('webpackbar');// webpack打包进度条
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');// 能够更好在终端看到webapck运行的警告和错误

const plugins = [//插件
    new HtmlWebpackPlugin({   // 向dist文件中自动添加模版html,不生成dist目录
        template: './index.html',
    }),
    new CleanWebpackPlugin(), // 打包后先清除dist文件，先于HtmlWebpackPlugin运行
    new webpack.NamedModulesPlugin(),  //用于启动HMR时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // 开启模块热更新，热加载和模块热更新不同，热加载是整个页面刷新
    new webpack.optimize.ModuleConcatenationPlugin(), // 运行 tree shaking 需要 ModuleConcatenationPlugin。
                                                    //通过 mode: "production" 可以添加此插件。如果你是开发环境就需要手动添加
    new WebpackBar(),// webpack打包进度条
    new FriendlyErrorsWebpackPlugin(), // 能够更好在终端看到webapck运行的警告和错误
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'));

files.forEach((file) => {
	if (/.*\.dll.js/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, '../dll', file),
		}));
	}
	if (/.*\.manifest.json/.test(file)) {
		plugins.push(new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, '../dll', file),
		}));
	}
});

module.exports = {
    mode: 'development',//模式,表示dev环境
    devtool:"cheap-module-eval-source-map",// 开发环境配置最佳实践
    //devtool译为webpack的调试模式，可以配置sourceMap
    //sourceMap本质上是一种映射关系，打包出来的js文件中的代码可以映射到代码文件的具体位置,这种映射关系会帮助我们直接找到在源代码中的错误。
    //可以直接在devtool中使用.合理的使用source-map可以帮助我们提高开发效率，更快的定位到错误位置。生产环境和开发环境的devtool配置是不同的。
    //我们可以在webpack.dev.js中添加devtool。
    entry: { //入口                 
        //实现刷新浏览器webpack-hot-middleware/client?noInfo=true&reload=true 是必填的
        main: ['webpack-hot-middleware/client?noInfo=true&reload=true', './index.js']
    },
    resolve: {
        extensions: ['.js', '.jsx'], // 当通过import child from './child/child'形式引入文件时，会先去寻找.js为后缀当文件，再去寻找.jsx为后缀的文件
        mainFiles: ['index', 'view'], // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找view开头的文件
        // alias: {
        //     home: path.resolve(__dirname, '../src/home') // 配置别名可以加快webpack查找模块的速度, 引入home其实是引入../src/home
        // }
    },
    module:{//加载模块规则,让 webpack 能够去处理那些非 JavaScript 文件,当然也能处理js文件
        /**我们在 webpack 中定义的一个个 loader，本质上只是一个函数，在定义 loader 同时还会定义一个 test 属性，
         * webpack 会遍历所有的模块名，当匹配 test 属性定义的正则时，会将这个模块作为 source 参数传入 loader 中执行，
         * webpack loader的执行顺序是从右到左，即从后向前执行。 */
        rules: [{       /**js的配置 */
            test: /\.js$/,    // 注意这里要写正确，不然useBuiltIns不起作用,babel-loader的具体配置被抽离在.babelrc文件
            exclude: /node_modules/, // 排除node_modules中的代码
            use: [{
                loader: 'babel-loader', // 只是babel和webpack之间的桥梁，并不会将代码转译
            }],
        },
        {               /**less的配置 */
            test: /\.less$/,  //寻找less文件
            exclude: /node_modules/, //忽略
            use: ['style-loader',/**注意:webpack loader的执行顺序是从右到左 // less-loader 编译less
                                css-loader  //编译css
                                style-loader  //创建style标签，并将css添加进去
                                postcss-loader  //提供自动添加厂商前缀的功能，但是需要配合autoprefixer插件来使用*/
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                }, 'less-loader', 'postcss-loader']  //使用style-loader,css-loader,less-loader,postcss-loader
        },
        {
            test: /\.css$/, //寻找css文件
            use: ['style-loader', 'css-loader', 'postcss-loader'] //使用style-loader,css-loader,postcss-loader
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
    plugins,//plugins被DellPlugin后
    optimization: {   // 开发环境时使用
        usedExports: true
    },
    devServer: {//自建dev服务环境,依赖webpack-dev-server，WDS不输出文件，只是放在内存中，因此速度更快。WDS只能用在dev环境
        contentBase: path.join(__dirname, '../dist'),
        port: 8080,
        historyApiFallback: true, //配置historyApiFallback,使用BrowserRouter时可以解析路径,使用HashRouter无需配置
                                  //若采用自建服务实现HMR，我们可以使用connect-history-api-fallback来实现和historyApiFallback相同的功能。
    },
    output:{
        publicPath: '/',//静态根路径 采用自建服务实现HMR需定义publicPath
        filename: '[name].js',//打包后输出的文件名称 //'[name].js'此方式是使用了webpack.HashedModuleIdsPlugin（生产环境）插件后的引用方式
        chunkFilename: '[name].js',
        path: path.resolve(__dirname,'../dist')
    }
}