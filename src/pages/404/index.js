import React,{Component} from 'react';
import {Card} from 'antd';
import {withRouter} from 'dva/router';
import play01 from '../../images/play01.gif';
import play02 from '../../images/play02.gif';
import play03 from '../../images/play03.gif';
import play04 from '../../images/play04.gif';
import play05 from '../../images/play05.gif';

class Page404 extends Component{
    constructor(props){
        super(props)
    }
    jump(){
        this.props.history.go(-1);
    }
    render(){
        return(
            <>
                <Card title="404，呀页面没找到！嗨一下" extra={<a href='javascript:;' onClick={this.jump.bind(this)}>返回</a>} style={{width: 300}}>
                    <p><img src={play02}/><img style={{float:'right'}} src={play04}/></p>
                    <p style={{textAlign:'center',marginLeft:'66px'}}><img src={play01}/></p>
                    <p><img src={play03}/><img style={{float:'right'}} src={play05}/></p>
                </Card>
            </>
        )
    }
}

export default withRouter(Page404);