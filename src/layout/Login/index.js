import React , {Component} from 'react';
import {connect} from 'dva';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import bgimg from '../../images/photo-white.jpg';
import './index.less';

@connect(state => ({login: state.login}))//connect装饰器，等同于redux中的connect方法,接收的是全局state,需通过namespace解构
@Form.create()//Form.create()装饰器 等同于用Form.create({})(Login)，经 Form.create() 包装过的组件会自带 this.props.form 属性

class Login extends Component {
    constructor(props) {
		super(props);
    }
    handleSubmit = e => {
		e.preventDefault();
		const {dispatch} = this.props;//通过connent连接的组件props中会自带dispatch方法
		this.props.form.validateFields((err, values) => {
			if (!err) {
                console.log(values)
				dispatch({
					type: 'login/goHome',
					payload: values
				})
			}
		});
    };
    // static getDerivedStateFromProps(props, state){ 
    //     //会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。 
    //     console.log(props);
    //     return null;
    // }
    // getSnapshotBeforeUpdate(prevProps, prevState){//在最近一次渲染输出（提交到 DOM 节点）之前调用。此生命周期需和componentDidUpdate连用，否则报错。
    //     //此生命周期的任何返回值将作为参数传递给 componentDidUpdate()。参数为第三个参数snapshot,并且此生命周期必须有返回值。
    //     console.log(prevProps);
    //     return null;
    // }
    componentDidUpdate(prevProps, prevState, snapshot){
        //console.log(this.props)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <>
                <div className="login" style={{background:`url(${bgimg}) 50% 50% / cover`}}>
                    <div><img src={require('../../images/Funny00003.png')}></img></div>
                    <div>
                        <i className="iconfont icon-changjingguanli" />
                        <span className='myheader'>欢迎小码农，请登录。</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						{getFieldDecorator('username', {
                            rules: [{required: true, message: '请输入用户名!'},
                                    {min: 3 , message: '不能少于3个字符!'},
                                    {max: 10 , message: '不能超过10个字符!'},
                                    {pattern: /^[a-zA-Z]/g , message: '必须以字母开头!'}]
						})(
							<Input
								style={{width: '100%'}}
								prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
								placeholder="admin"
							/>,
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码!'},
                                    {min: 3 , message: '不能少于3个字符!'},
                                    {max: 10 , message: '不能超过10个字符!'}]
						})(
							<Input
								style={{width: '100%'}}
								prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
								type="password"
								placeholder="123"
							/>,
						)}
					</Form.Item>
                    <Form.Item>
					<Button style={{width: '5vw'}} type="primary" htmlType="submit" className="login-form-button">
						登陆
					</Button>
                    </Form.Item>
                    </Form>
                </div>
            </>
        )
    }
}

export default Login;