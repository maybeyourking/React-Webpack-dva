import React, {Suspense,lazy} from 'react';
import PropTypes from 'prop-types';
import {
  routerRedux,
  Route,
  Switch,
  Redirect
} from 'dva/router';
import {Spin} from 'antd';
import Page404 from '../pages/404';
import Login from '../layout/Login';
const Home = lazy(() => import(/* webpackChunkName: "home-vendor" */'../layout/Index'));
import Homepage from '../pages/Home';
import Setting from '../pages/Setting';
import Chess from '../pages/Mydemo/chess';
import Music from '../pages/Mydemo/Music';
import Planegame from '../pages/Mydemo/Planegame';
import Yunapp from '../pages/Mydemo/Yunapp';

const {ConnectedRouter} = routerRedux;
//Suspense 组件为路由组件未加载成功之前做的操作，lazy()方法为路由懒加载

export default function Router({history}) {
  return (
    <ConnectedRouter history={history}>
      <Suspense fallback={<Spin size="large" style={{position:'fixed',top:'50%',left:'50%'}}/>}>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path='/login' component={Login}/>
        <Route path="/home" render={()=>{//路由插槽，Home组件通过this.props.children来接收路由匹配过来的组件
          return(
            <Home>
                <Route exact path='/home' component={Homepage}/>
                <Route exact path='/home/setting' component={Setting}/>
                <Route exact path='/home/mydemo/chess' component={Chess}/>
                <Route exact path='/home/mydemo/music' component={Music}/>
                <Route exact path='/home/mydemo/planegame' component={Planegame}/>
                <Route exact path='/home/mydemo/yunapp' component={Yunapp}/>
            </Home>
          )
        }} />
        <Route path="/404" component={Page404} />
        <Redirect from='/' to='/404'></Redirect>
      </Switch>
      </Suspense>
    </ConnectedRouter>
  );
}

Router.propTypes = {//利用propTypes对props进行校验
  history: PropTypes.object
};
/**关于prop-types
 * propTypes能用来检测全部数据类型的变量，包括基本类型的的字符串，布尔值，数字，以及引用类型的对象，数组，函数，甚至还有ES6新增的符号类型
 * 例子：
  Son.propTypes = {
      optionalArray: PropTypes.array,//检测数组类型
      optionalBool: PropTypes.bool,//检测布尔类型
      optionalFunc: PropTypes.func,//检测函数（Function类型）
      optionalNumber: PropTypes.number,//检测数字
      optionalObject: PropTypes.object,//检测对象
      optionalString: PropTypes.string,//检测字符串
      optionalSymbol: PropTypes.symbol,//ES6新增的symbol类型
  }
 */