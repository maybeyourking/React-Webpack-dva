//此服务是打包时用了hsitory路由模式后，服务器上线后，用户刷新页面404的问题，其实是服务器当收到路由跳转时当成了真的URL去解析，而服务器目录下又没有此目录，
//所以需要在服务端做一些配置，用hash路由模式不会有此问题。
//配置方式
//1、写node服务，2、利用nginx配置
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('../'));//加载静态资源目录

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, '../index.html'))
  })

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    //判断是主动导向404页面，还是传来的前端路由,如果是前端路由则如下处理

    fs.readFile(path.resolve(__dirname,'../index.html'), function(err, data){
        if(err){
            console.log(err);
            res.send('后台错误');
        }
        else {
            res.writeHead(200, {
                'Content-type': 'text/html',
                'Connection':'keep-alive'
            });
            res.end(data);
        }
    })
});

app.listen(8081, () => {  //监听端口
    console.log("成功启动：localhost:8081")
})