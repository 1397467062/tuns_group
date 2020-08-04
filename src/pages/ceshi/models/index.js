import { getQueryIns,mockdata } from "../service";
export default {
    namespace:"indexceshi",
    state:{
        name:"laycat",
        cnodedata:[]
    },
    reducers:{
        setName(state,payload){
            console.log(state)
            console.log(payload)
            let _state = JSON.parse(JSON.stringify(state))
            _state.name = payload.data.name
            return _state
        },
        setcnodedataitem(state,payload){
            console.log(state)
            let _state = JSON.parse(JSON.stringify(state))
            console.log(payload)
            _state.cnodedata=payload.response
            console.log(_state)
            return _state
        },
        testpath(state,payload){
            console.log("监听")
            return state
        }
    },
    effects:{
        *setnamesync({payload},{call,put}){
            yield console.log("run")
            yield put({
                type:"setName",
                data:{
                    name:"超人强"
                }
            })
        },
        *testcnode({payload},{call,put}){
            // call 进行调接口
            // const res = yield call(getQueryIns, {data:"jjjj"});  正式接口
            const res = yield call(mockdata, {data:"pppppp"}); //  mock接口
            console.log(res)
            const { data = {name:"小懒猫"}, response = [{cat:"mao"},{cat:"mao1"},{cat:"mao2"}] } = res;
            yield console.log(data)
            yield console.log(response)
            if(data.name && response.length>0){
                yield console.log(data.name)
                // put进行对上面state的数据进行修改
                yield put({
                    type:"setcnodedataitem",
                    data:data.name,
                    response:response
                })
            }
        }
    },
    subscriptions:{//对页面路径做监听
        haha({dispatch,history}){
            console.log(history)
            history.listen(({pathname})=>{
                if(pathname==="/ceshi"){
                    console.log("用户页")
                    dispatch({
                        type:"testpath"
                    })
                }else{
                    console.log("会员页")
                }
            })
        }
    }
}