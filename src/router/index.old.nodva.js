import React , {Component} from 'react';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom';
import Login from '../layout/Login';
import Home from '../layout/Home';

class App extends Component {
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>{/*注意exact为路由严格匹配*/}
                    <Route path='/home' component={Home}></Route>
                    <Redirect from='/' to='/login'></Redirect>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;