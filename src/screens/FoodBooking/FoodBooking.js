import { useEffect,useState } from "react"
import { useStyles } from "./FoodBookingCss"
import { Grid,TextField,MenuItem,FormControl,Select,InputLabel } from "@mui/material"
import { postData } from "../../services/FetchNodeServices"
import TableComponent from "../../components/TableComponent/TableComponent"
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent"
import TableCart from "../../components/TableCart/TableCart"

export default function FoodBooking(props){
    var classes=useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [currentDate,setCurrentDate]= useState("")
    const [waiterData,setWaiterData]= useState([])
    const [waiterId,setWaiterId]= useState('')
    const [waiterName,setWaiterName]= useState('')
    const [floorNo,setFloorNo]=useState('')
    const [tableNo,setTableNo]=useState('')
    const [refresh,setRefresh]=useState(false)
    const [foodOpen,setFoodOpen]=useState(false)

    const getCurrentDate=()=>{
        var date=new Date()
        var cd=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
    }

    const getCurrentTime=()=>{
        var time=new Date()
        var ct=time.getHours()+":"+time.getMinutes()
        return ct
    }

    useEffect(function(){
        setCurrentDate(getCurrentDate()+"  "+getCurrentTime())
        fetchAllWaiter()
    },[])

    const fetchAllWaiter=async()=>{
        var body={'restaurantid':admin.restaurantid}
        var result=await postData('waiters/fetch_all_waiter',body)
         setWaiterData(result.data)
     }

     const fillAllWaiter=()=>{
        return waiterData.map((item)=>{
            return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        })
    }

    const handleWaiter=(event,value)=>{
        setWaiterName(value.props.children)
        setWaiterId(event.target.value)
    }


    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={4} style={{display:'flex',alignItems:'center'}}>
                        <TextField label="Current Date & Time"
                        value={currentDate} fullWidth />
                    </Grid>
                    <Grid item xs={4} style={{display:'flex',alignItems:'center'}}>
                        <FormControl fullWidth>
                            <InputLabel>Waiters</InputLabel>
                                <Select label='Waiters' value={waiterId}
                                onChange={handleWaiter} >
                                    <MenuItem>-Select Waiter-</MenuItem>
                                    {fillAllWaiter()}
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} style={{textAlign:'right',color:'#273c75',fontFamily:'kanit',fontWeight:'bold',fontSize:35}}>
                            {floorNo}   {tableNo.length!=0?<>Table: {tableNo}</>:<></>} 
                    </Grid>
                </Grid>
            </div>
            <div className={classes.box}>
                <Grid container space={1}>
                    <Grid item xs={3}>
                        <CategoryComponent tableNo={tableNo} floorNo={floorNo} refresh={refresh} setRefresh={setRefresh} foodOpen={foodOpen}  />
                    </Grid>
                    <Grid item xs={4}>
                        <TableComponent setTableNo={setTableNo} setFloorNo={setFloorNo} floorNo={floorNo} tableNo={tableNo} setFoodOpen={setFoodOpen} />                      
                    </Grid>
                    <Grid item xs={5}>
                        <TableCart waiterName={waiterName} tableNo={`#${floorNo}${tableNo}`} refresh={refresh} setRefresh={setRefresh} />                      
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}