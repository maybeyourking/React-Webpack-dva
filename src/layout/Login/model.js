import {routerRedux} from 'dva/router';
import {message} from 'antd';
import api from '../../api/login';//获取接口

import key from 'keymaster';//一个用于监听键盘按键的npm包，测试subscriptions订阅函数

export default {
    namespace:'login',
    state:{
        loginFlag:false,
        subscriptionsMsg:null
    },
    effects:{
        * goHome({payload},{put,call,select}){//第一个参数为action,即action.payload,是dispatch触发action接收的参数对象
            //const {username,password} = payload;//将参数解构出来
            try{ //try代码块里一般用call触发一个异步请求逻辑，错误抛出到catch代码块。select用于查找本modal或全局modal下的state。
                const resdata = yield call(api.requestlogin)//请求接口获取数据
                console.log(resdata)
                if(resdata.ok === 1){
                    yield put({type:'signlogin'});
                    const param = {
                        username:'王小小',
                        logo:'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                        loginFlag:true
                    }
                    yield localStorage.setItem('userinfo',JSON.stringify(param))
                    yield put(routerRedux.push(`home`));//put可以发起一个本model的reducer方法也可以本modal外的或者发起页面跳转。
                }
                else{
                    yield put({type:'logout'});
                    message.error('用户名密码错误')
                }
            }
            catch(err){
                console.log(err.message);
            }
        },
        * showMsg({payload},{put,call,select}){//测试subscriptions订阅函数的异步逻辑
            try{
                yield put({type:'redshowMsg'});
                const subscriptionsMsg = yield select(state=>state.login.subscriptionsMsg)
                yield alert('你触发了subscriptions函数！订阅源信息为:'+subscriptionsMsg)
            }
            catch(e){
                console.log(e.message);
            }
        }
        
    },
    reducers:{
        'signlogin'(state, action) {
            return {
                ...state,
                loginFlag:true
            }
          },
        'logout'(state, action) {
            return {
                ...state,
                loginFlag:false
            }
        },
        'redshowMsg'(state,action){//测试subscriptions订阅函数的reducer
            return {
                ...state,
                subscriptionsMsg:'订阅源触发了'
            }
        }
    },
    subscriptions: {
        //Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。它接收两个参数{dispatch,history}.
        //数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
        keyEvent({dispatch}) {//keyEvent名字不是必须，叫什么都可以
          key('⌘+up, ctrl+up', () => {//'⌘+up, ctrl+up' 具体意思查看keymaster API
               dispatch({type:'showMsg'});
             });
        }
      }
}