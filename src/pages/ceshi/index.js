import React from "react"
import styles from "./index.less";
import BaseController from "../../components/controller";
import { connect } from "dva";
import { Button, ActionSheet, Toast } from "antd-mobile";

@connect(store => ({ indexdata : store.indexceshi }))
// @connect(store =>{
//     console.log(store)
//     return{
//     msg:"我爱北京天安门",
//     name:store.indexceshi.name
//     // indexdata : store.indexceshi
//     }
// })
class Ceshi extends BaseController {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    componentDidMount(){
        this.setTitle("测试")
        
    }
    handlssetname=()=>{
        // console.log(this.props)
        this.props.dispatch({
            type:"indexceshi/setName",
            data:{
                name:"猪猪侠"
            }
        })
    }
    handlssetnameAsync=()=>{
        this.props.dispatch({
            type:"indexceshi/setnamesync",
            data:{
                name:"猪猪侠"
            }
        })
    }
    testcnode=()=>{
        this.props.dispatch({
            type:"indexceshi/testcnode",
            data:{
                name:"搜索侠"
            }
        })
    }
    render() {
        console.log(this.props)
        const {indexdata} = this.props
        console.log(indexdata)
        const {cnodedata} = indexdata
        console.log(cnodedata)
        // const cnodedata = (indexdata)=>{
        //     return
        // }
        return (
            <div>
            11111111
            {indexdata.name}
            <Button
              size="small"
              inline
              onClick={this.handlssetname}
            >
              详情
            </Button>
            <Button
              size="small"
              inline
              type="primary"
              onClick={this.handlssetnameAsync}
            >
              异步
            </Button>
            <Button
              size="small"
              inline
              type="primary"
              onClick={this.testcnode}
            >
              调接口
            </Button>
            <br/>
            {/* {indexdata.cnodedata} */}
            {
                cnodedata.map((item,key)=>{
                    return(
                        <div key={key}>
                        {item.cat}
                        </div>
                    )
                    
                    
                    
                })
            }
            {
                cnodedata.length>0?(
                    <div>
                    {
                        cnodedata.map((item,index)=>(
                            // return(
                                <div key={index}>
                                111111111111
                                <div>{item.cat}</div>
                                </div>
                            // )
                            
                            
                            
                        ))
                    }
                    </div>
                ):(
                    <div>没数据</div>
                )
            }
            
            {/* {this.props.msg}<br/>
            {this.props.name} */}
            
            </div>
        );
    }
}

export default Ceshi;






