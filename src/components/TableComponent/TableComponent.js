import { useEffect,useState } from "react"
import { postData } from "../../services/FetchNodeServices"
import { Paper } from "@mui/material"
import {useSelector} from "react-redux"

export default function TableComponent(props){
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [floorData,setFloorData]= useState([])
    const [tableData,setTableData]= useState([])
    const [selectedFloor,setSelectedFloor]=useState(-1)
    const [selectedTable,setSelectedTable]=useState(-1)

    var foodOrder=useSelector((state)=>state.orderData)
    
    var foodList=[]
    function calculate(tn){
    var cart=foodOrder[tn]
    if(cart!=undefined){
    foodList=Object.values(cart)

    var totalAmount=foodList.reduce(calculateTotal,0)
    var totalOffer=foodList.reduce(calculateTotalOffer,0)
    return(totalAmount-totalOffer)
    }
    else{
        return 0
    }
}
    function calculateTotal(item1,item2){
        return item1+(item2.price*item2.qty)
    }
    function calculateTotalOffer(item1,item2){
        var price=item2.offerprice>0?(item2.price*item2.qty):0
        return item1+(price-(item2.offerprice*item2.qty))
    }

    

    useEffect(function(){
        fetchAllFloor()
    },[])

    const fetchAllFloor=async()=>{
        var body={'restaurantid':admin.restaurantid}
        var result=await postData('waitertable/fetch_all_floor',body)
        setFloorData(result.data)
    }

    const showFloor=()=>{
        return floorData.map((item,i)=>{
            return(
                <Paper elevation={3} onClick={()=>fetchAllTable(item.floor,i)} style={{width:80,height:80,display:'flex',justifyContent:'center',alignItems:'center',padding:5,margin:8,borderRadius:5,textAlign: "center",background:i==selectedFloor?'#27ae60':'#7bed9f',cursor:'pointer'}}>
                    <div style={{fontFamily:'kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2}}>{item.floor}</div>
                </Paper>
            )
        })
    }

    const fetchAllTable=async(floor,i)=>{
        props.setTableNo('')
        props.setFloorNo(floor)
        var body={'floor':floor,'restaurantid':admin.restaurantid}
        var result=await postData('waitertable/fetch_all_table_by_floor',body)
         setTableData(result.data)
         setSelectedFloor(i)
         props.setFoodOpen(false)
         setSelectedTable(-1)
     }

     const handleTableClick=(item,i)=>{
        props.setTableNo(item.tableno)
        props.setFoodOpen(true)
        setSelectedTable(i)

     }

     const showTable=()=>{
        return tableData.map((item,i)=>{
            return(
                <Paper onClick={()=>handleTableClick(item,i)} elevation={3} style={{width:80,height:80,display:'flex',justifyContent:'center',alignItems:'center',padding:5,margin:8,borderRadius:5,flexDirection:'column',background:i==selectedTable?'#c23616':'#e17055',cursor:'pointer'}}>
                    <div style={{fontFamily:'kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2,}}>Table {item.tableno}</div>
                    <div style={{fontFamily:'kanit',fontWeight:600,fontSize:12,color:'#fff',padding:2,}}>Chairs {item.noofchairs}</div>
                    <div style={{fontFamily:'kanit',fontWeight:'bold',fontSize:16,color:'#fff',padding:2,}}>&#8377; {calculate(`#${props.floorNo}${item.tableno}`)}</div>
                </Paper>
            )
        })
    }

    return(
        <div style={{display:'flex',flexDirection:'column',padding:5}}>
            <div style={{display:'flex',flexWrap:'wrap',marginBottom:10}}>
                {showFloor()}
            </div>
            <div style={{display:'flex',flexWrap:'wrap'}}>
                {showTable()}
            </div>
        </div>
    )
}