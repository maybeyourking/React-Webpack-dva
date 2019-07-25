import dva from 'dva';
import { createBrowserHistory } from 'history';//使用history路由模式
import qhistory from 'qhistory';
import {stringify, parse} from 'qs';//qs是npm仓库所管理的包,qs.stringify()作用是将对象或者数组序列化成URL的格式。
									//具体参照https://www.jianshu.com/p/7e64878fb210
import './index.less';

//1.Initialize
const app = dva({
	history: qhistory(createBrowserHistory({
		// URL base path 可以设定服务器项目目录，根目录名称
		basename: 'reactwebpackdva/'
		//basename: '/'
	}),
	stringify,
	parse
	)
});

//app.use();

//2.Model
/**component model 如果有*/

/**page model */
app.model(require('./src/layout/Login/model').default);
app.model(require('./src/layout/Index/model').default);

//3.Router
app.router(require('./src/router').default);

//4.Start
app.start("#root");