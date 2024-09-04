import { useState, useEffect } from "react"

export default function Plusminus(props){
    const [value,setValue]=useState(0)
    useEffect(function(){
        setValue(props.qty)
    },[props])

    const handlePlus=()=>{
        var c= value+1
        setValue(c)
        props.onChange(c)
    }

    const handleMinus=()=>{
        if(value>0){
        var c= value-1
        setValue(c)
        props.onChange(c)
        }
    }

    return(
        <div style={{padding:2,display:'flex',alignItems:'center',width:50}}>
            <div onClick={handlePlus} style={{width:20,display:'flex',justifyContent:'center',alignItems:'center',fontWeight:'bold',cursor:'pointer'}}>+</div>
            <div style={{width:10,display:'flex',justifyContent:'center',alignItems:'center'}}>{value}</div>
            <div onClick={handleMinus} style={{width:20,display:'flex',justifyContent:'center',alignItems:'center',fontWeight:'bold',cursor:'pointer'}}>-</div>
        </div>
    )
}