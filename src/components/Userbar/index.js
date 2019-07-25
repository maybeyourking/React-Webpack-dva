import React from 'react';
import {Menu, Dropdown,Icon} from 'antd';
import {Link} from 'dva/router';

function Userbar(props){
    //console.log(props)
    function logout(){
        if( localStorage.getItem('userinfo') ){
            localStorage.removeItem('userinfo')
        }
    }
    const menu = (
        <Menu>
          <Menu.Item key="0">
            <Link to='/home/acount'><Icon type="user" style={{margin:'0 5px'}}/><span>个人中心</span></Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to='/home/acount/acountsetting'><Icon type="setting" style={{margin:'0 5px'}}/><span>个人设置</span></Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3">
            <Link to='/login' onClick={()=>logout()}><Icon type="logout" style={{margin:'0 5px'}}/><span>退出登陆</span></Link>
          </Menu.Item>
        </Menu>
      );
      if(props.userbar){
          if(props.userbar.loginFlag){
              return(
                  <>
                      <Dropdown overlay={menu}>
                          <span className='userbar'>
                              <span className='user-img'><img src={props.userbar.logo} /></span>
                              <span className='user-name'>{props.userbar.username}</span>
                          </span>
                      </Dropdown>
                  </>
              )
          }
          
      }
      else{
        return(
            <a href='/login'>请登录</a>
        )
      }

}

export default Userbar;