import React ,{Component} from 'react';
import {connect} from 'dva';
import {Menu, Icon} from 'antd';
import {routerRedux} from 'dva/router';//dva的routerRedux实现路由跳转需通过dispatch触发
                                       //如果要使用this.props.history.push(),引入withRouter高阶函数即可。import {withRouter} from 'dva/router';
                                       //如果要是有Link标签实现声明式跳转，引入Link组件即可。import {Link} from 'dva/router';
//import menuDate from './rootmenu.js';

import './index.less';

const {SubMenu} = Menu;
//const data = menuDate.menuDate//正常情况应该通过props把列表数据传递过来

export default connect()(class NavLeft extends Component{
    constructor(props) {
        super(props);
        this.state = {
            openKeys:[]//刷新页面SubMenu状态保留数组
        };
    }
    componentWillReceiveProps(nextProps){
        //console.log(this.props,nextProps)
        if( this.props.navLeftList.length === 0){//页面首次捕获到navLeftList,处理openKeys数据
            const selectedKeysStr = this.defaultSelected(nextProps)[this.defaultSelected(nextProps).length-1];
            const newList = [];
            for ( var nI = 0 ; nI < selectedKeysStr.length-1 ; nI ++ ){
                newList.push(selectedKeysStr.substr(0,nI+1))
            }
            newList.push(selectedKeysStr);
            this.setState({
                openKeys:newList
            })
        }
        if( nextProps.siderCollapse ){//如果父组件发起收起左侧导航命令，需清空SubMenu显示数组
            this.setState({
                openKeys:[]
            })
        }
        if( !nextProps.siderCollapse && this.props.siderCollapse != nextProps.siderCollapse ){//如果父组件发起收起展开导航命令，还原SubMenu
            const selectedKeysStr = this.defaultSelected(nextProps)[this.defaultSelected(nextProps).length-1];
            const newList = [];
            for ( var i = 0 ; i < selectedKeysStr.length-1 ; i ++ ){
                newList.push(selectedKeysStr.substr(0,i+1))
            }
            newList.push(selectedKeysStr);
            this.setState({
                openKeys:newList
            })
        }
    }
    jump(path,keyPath){//路由跳转
        this.props.dispatch(routerRedux.push(path))//跳转路由，下方是点击收起其他SubMenu逻辑
        const selectedKeysStr = keyPath.keyPath[0]
        const newList = [];
        for ( var nI = 0 ; nI < selectedKeysStr.length-1 ; nI ++ ){
            newList.push(selectedKeysStr.substr(0,nI+1))
        }
        this.setState({
            openKeys:newList
        })
    }
    defaultSelected(keys){//得到默认选择项，通过传过来props中的history和navLeftList数据比较
        const mapkeys = mapkey(keys.navLeftList)
        function mapkey(key){
           return key.map((item)=>{
                if(item.children){
                    return mapkey(item.children)
                }
                else{
                    return item.path
                }
            })
        }
        const nowhistory = this.props.nowhistory.pathname;
        const showindex = []
        function findindex(mapkeys,i){//此递归函数只能获得最末两级数组序列
            mapkeys.forEach((item,index)=>{
                if ( item === nowhistory ){
                    //console.log(i,item,index)
                    if(i){      
                        showindex.unshift( i +'')
                        showindex.unshift( i +'' + index)
                    }
                    else{
                        showindex.unshift( index +'') ;
                    }
                }
                else{
                    if( Object.prototype.toString.call(item) === '[object Array]' ){
                        if(i){//保证一直往里轮询
                            //console.log(i+''+index)
                            findindex(item,i+''+index)
                        }
                        else{
                            //console.log(index+'')
                            findindex(item,index)
                        }
                    }
                }
            })
        }
        findindex(mapkeys)
        return showindex ;
    }
    changeOpen(openKeys){//点击SubMenu回调
        this.setState({
            openKeys:openKeys
        })
    }
    renderMenu(data){
        if( data.length ){
            return data.map((item)=>{
                if( item.children ){
                    return  <SubMenu key={item.id} title={<span>{item.icon?<Icon type={item.icon} />:''}<span>{item.name}</span></span>}>
                                {this.renderMenu(item.children)}
                            </SubMenu>         
                }
                else{
                    return <Menu.Item key={item.id} onClick={(keyPath)=>this.jump(item.path,keyPath)}>{item.icon?<Icon type={item.icon} />:''}<span>{item.name}</span></Menu.Item>
                }
            })
        }
    }
    render(){
        return(
            <>
                <Menu theme="dark" mode="inline" selectedKeys={this.defaultSelected(this.props)} openKeys={this.state.openKeys} onOpenChange={(openKeys)=>this.changeOpen(openKeys)} >
                    {this.renderMenu(this.props.navLeftList)}
                    {/* <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                    <MenuItemGroup title="Item 1">
                        <Menu.Item key="1">Option 1</Menu.Item>
                        <Menu.Item key="2">Option 2</Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Iteom 2">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                    </MenuItemGroup>
                    </SubMenu> */}
                </Menu>
            </>
        )
    }
});





