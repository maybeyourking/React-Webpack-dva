## React-Webpack-dva
>  基于react + react-router + dva + axios + antd + es6 + less的脚手架
### 项目介绍
本项目是利用webpack搭建的搭建一个基于react + react-router + dva + axios + antd + es6 + less + eslint用于中后台开发的脚手架,
主要是希望通过配置本项目,来对webpack工具有一个更加深入和全面的认识，在练习中提升自己。

### 功能实现
- [x] Es6/7
- [x] react/react-router/dva
- [x] less
- [x] axios
- [x] dev-server
- [x] 模块热替换（HMR）
- [x] sourcemap
- [x] CSS代码分割
- [x] 代码分割(SplitChunksPlugin)
- [x] 浏览器缓存
- [x] tree shaking
- [x] DellPlugin
- [x] PWA
- [x] eslint


### 快速开始
```javascript
//注意本项目用yarn作为包管理工具，请自行安装yarn
git clone 本项目路径
yarn install || npm install  // 依赖包安装
yarn dll || npm run dll   // dllplugin进行打包
yarn start || npm run start // 开发模式启动项目
yarn build || npm run build // 生产环境项目打包
yarn dev-build || npm run dev-build // 开发环境打包
```