import api from '../../api/IndexApi.js';

export default {
    namespace:'Index',
    state:{
        navLeftList:[]
    },
    effects:{
        * getNavLeft({payload},{put,call}){
            try{
                const data = yield call(api.reqNavLeft);
                yield put({type:'redgetNavLeft',payload:data.menuDate})
            }
            catch(e){
                console.log(e.message);
            }
        }
    },
    reducers:{
        'redgetNavLeft'(state,action){
            return{
                ...state,
                navLeftList:action.payload
            }
        }
    }
}