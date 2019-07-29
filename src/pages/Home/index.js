import React,{useState,useEffect,useRef} from 'react';
import {Button} from 'antd';

export default function Home(){
    const [count,setCount] = useState(0);
    const refEl = useRef(null);//useRef 相当于refs 可以将某个元素或对象挂载到ref实例上
    refEl.current = count;
  
    const refEls = useRef(null);
    refEls.current = count;
  
    useEffect(()=>{
      document.title = count;
    })
    return(
        <>
            <div>this is home,react hooks demo.</div>
            <h3>You clicked {count} times</h3>
            <h4>refEl count :{refEl.current}</h4>
            <h4>refEls count :{refEls.current}</h4>
            <Button 
                onClick={()=>{
                    setCount(count+1)
                }}
            >
                Click Me!
            </Button>
        </>
    )
}