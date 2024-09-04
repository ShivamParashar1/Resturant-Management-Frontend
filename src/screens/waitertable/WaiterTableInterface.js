import { useEffect,useState } from "react";
import { makeStyles } from "@mui/styles";
import Swal from "sweetalert2";
import { Grid, TextField,InputLabel,MenuItem,FormControl,Select,FormHelperText, Button, } from "@mui/material";
import Heading from "../../components/heading/Heading";
import { postData } from "../../services/FetchNodeServices";

const  useStyles= makeStyles({
    root:{
        width:'auto',
        height:'auto',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:30
    },
    box:{
        width:'60%',
        height:'auto',
        borderRadius:10,
        background:'#fff',
        padding:15
    },
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
})

export default function WaiterTableInterface(){
    const classes= useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [restaurantId,setRestaurantId]= useState("")
    const [waiterData,setWaiterData]= useState([])
    const [floorData,setFloorData]= useState([])
    const [tableData,setTableData]= useState([])
    const [waiterId,setWaiterId]= useState('')
    const [floor,setFloor]= useState("")
    const [tableid,setTableId]= useState('')
    const [date,setDate]= useState('')
    const [resError,setResError]=useState({})

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
        fetchAllWaiter()
        fetchAllFloor()
    },[])
    
    const handleError=(error,input,message)=>{
        setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
    }

    const fetchAllWaiter=async()=>{
        var body={'restaurantid':admin.restaurantid}
        var result=await postData('waiters/fetch_all_waiter',body)
         setWaiterData(result.data)
     }

    const fetchAllFloor=async()=>{
        var body={'restaurantid':admin.restaurantid}
        var result=await postData('waitertable/fetch_all_floor',body)
        setFloorData(result.data)
    }

    const fetchAllTable=async(floor)=>{
        var body={'floor':floor,'restaurantid':admin.restaurantid}
        var result=await postData('waitertable/fetch_all_table_by_floor',body)
         setTableData(result.data)
     }

    const fillWaiterNames=()=>{
        return waiterData.map((item)=>{
            return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        })
    }
    const fillFloor=()=>{
        return floorData.map((item)=>{
            return <MenuItem value={item.floor}>{item.floor}</MenuItem>
        })
    }
    
    const fillTable=()=>{
        return tableData.map((item)=>{
            return <MenuItem value={item.tableid}>{item.tableno}</MenuItem>
        })
    }

    const handleFloorChange=(event)=>{
        setFloor(event.target.value)
        fetchAllTable(event.target.value)
    }


    function validation(){
        var submitRecord= true
        if(!restaurantId){
            handleError(true,'restaurantId','Pls Input Restaurant Id')
            submitRecord=false
        }
        if(!waiterId){
            handleError(true,'waiterId','Pls Input waiter Name')
            submitRecord=false
        }
        if(!tableid){
            handleError(true,'tableid','Pls Select Table No')
            submitRecord=false
        }
        if(!floor){
            handleError(true,'floor','Pls Select Floor')
            submitRecord=false
        }
        if(!date){
            handleError(true,'date','Pls Select Date')
            submitRecord=false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation()){
            var body={'restaurantid':restaurantId,'waiterid':waiterId,'tableid':tableid,'currentdate':date}
            var result=await postData('waitertable/waitertable_submit',body)
            if(result.status){
                Swal.fire({
                   icon:'success',
                   title:'Waiter Table Allotement',
                   text:result.message
                })
             }
             else{
                Swal.fire({
                   icon:'error',
                   title:'oops...',
                   text:result.message
                })
             }
        }
    }

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title="Waiter Table Allotment" myroute={'/admindashboard/displayallwaitertable'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Restaurant Id" fullWidth
                         disabled value={restaurantId}/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Waiters</InputLabel>
                                <Select label='Waiters' value={waiterId}
                                error={resError?.waiterId?.error}
                                onFocus={()=>handleError(false,'waiterId','')}
                                onChange={(event)=>setWaiterId(event.target.value)} >
                                    <MenuItem>-Select Waiter-</MenuItem>
                                    {fillWaiterNames()}
                                </Select>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.waiterId?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Floor</InputLabel>
                                    <Select label='Floor' value={floor}
                                    error={resError?.floor?.error}
                                    onFocus={()=>handleError(false,'floor','')}
                                    onChange={(event)=>handleFloorChange(event)}>
                                        <MenuItem>-Select Floor-</MenuItem>
                                        {fillFloor()}
                                    </Select>
                                    <FormHelperText style={{color:'#d63031'}}>{resError?.floor?.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                    
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Table No</InputLabel>
                                <Select label='Table No' value={tableid}
                                error={resError?.tableid?.error}
                                onFocus={()=>handleError(false,'tableid','')}
                                onChange={(event)=>setTableId(event.target.value)}>
                                    <MenuItem>-Select Table-</MenuItem>
                                    { fillTable()}
                                </Select>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.tableid?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} fullWidth>
                        <TextField 
                            error={resError?.date?.error}
                            onFocus={()=>handleError(false,'date','')}
                            helperText={resError?.date?.message}
                            onChange={(event)=>setDate(event.target.value)}
                            label="Current Date" fullWidth 
                            type="date" variant='outlined'
                            InputLabelProps={{
                                shrink: true,
                                
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' onClick={handleSubmit} fullWidth>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' fullWidth>Reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
