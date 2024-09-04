import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import MaterialTable from "@material-table/core";
import { getData,postData } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
import { MenuItem,Grid,FormControl,InputLabel,FormHelperText,TextField,Select } from "@mui/material";
import { Button, Dialog,DialogActions,DialogContent } from "@mui/material"
import Heading from '../../components/heading/Heading'
import { useNavigate } from "react-router-dom";

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
        width:'90%',
        height:'auto',
        borderRadius:10,
        background:'#fff',
        padding:15
    },
})

export default function DisplayAllWaiterTable(){
    var classes= useStyles()
    var navigate= useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [waiterTableData,setWaiterTableData]=useState([])
    const [waiterTableId,setWaiterTableId]= useState("")
    const [open,setOpen]=useState(false)
    /////////////////////////waiter table data//////////////////
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
            var body={'restaurantid':restaurantId,'waiterid':waiterId,'tableid':tableid,'currentdate':date,'waitertableid':waiterTableId}
            var result=await postData('waitertable/waitertable_edit_data',body)
            if(result.status){
                Swal.fire({
                   icon:'success',
                   title:'Waiter Table Allotement',
                   text:result.message
                })
                setOpen(false)
             }
             else{
                Swal.fire({
                   icon:'error',
                   title:'oops...',
                   text:result.message
                })
                setOpen(false)
             }
        }
        fetchAllWaiterTable()
    }

    const showData=()=>{
        return(
            <div>
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
                            type="date" variant='outlined'value={date}
                            InputLabelProps={{
                                shrink: true,
                                
                            }}
                        />
                    </Grid>
                </Grid>  
            </div>

        )
    }


    ////////////////////////////////////////////////////////////////

    const fetchAllWaiterTable=async()=>{
        var result=await postData('waitertable/fetch_all_waitertable',{restaurantid:admin.restaurantid})
        setWaiterTableData(result.data)
    }

    useEffect(function(){
        fetchAllWaiterTable() 
    },[])

    const handleEdit=(rowData)=>{ 
        console.log(rowData)
        setWaiterTableId(rowData.waitertableid)
        setRestaurantId(rowData.restaurantid)
        setWaiterId(rowData.waiterid)
        setTableId(rowData.tableid)
        setFloor(rowData.floor)
        setDate(rowData.currentdate)
        fetchAllTable(rowData.floor)
        setOpen(true)
       
    }

    const handleDelete=async(rowData)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Do You Want To Delete Waiter Assigned Table?',
            showDenyButton: true,
            confirmButtonText: 'Yes Delete it',
            confirmButtonColor:'rgb(14 155 36)',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            if (result.isConfirmed) {
               var body={'waitertableid':rowData.waitertableid}
               var result=await postData('waitertable/waitertable_delete',body)
               if(result.status){
                  Swal.fire('Waiter Assigned Table Deleted!', result.message, 'success')
                  fetchAllWaiterTable()
               }
               else{
                  Swal.fire('Fail!', result.message, 'error')
               }
            } else if (result.isDenied) {
              Swal.fire('Waiter Assigned Table Not Deleted', 'Your Data is Safe', 'error')
            }
          })
    }

    const handleDialogClose=()=>{   
        setOpen(false)   
    }

    const showDataForEdit=()=>{
        return(
        <Dialog open={open} >
            <DialogContent>
                {showData()}
            </DialogContent>
            <DialogActions>
                  <Button onClick={handleSubmit} >Edit</Button>
                  <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
        )
    }
    
   

    function displayAll(){
        return(
            <MaterialTable
               title="Waiter Table List"
               columns={[
                { title: 'Restaurant Id/Name',
                 render:rowData=><><div>{rowData.restaurantid}/{admin.restaurantname}</div></>},
                { title: 'Waiter Name', 
                 render:rowData=><><div>{rowData.waitername}</div></> },
                 { title: 'Floor', 
                 render:rowData=><><div>{rowData.floor}</div></> },
                { title: 'table No', 
                 render:rowData=><><div>{rowData.tableno}</div></> },
                { title: 'Current Date',
                  render:rowData=><><div>{rowData.currentdate}</div></>
                 }
                ]}
              data={waiterTableData}        
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Waiter Table',
                  onClick: (event, rowData) => handleEdit(rowData)
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete Waiter Table',
                  onClick: (event, rowData) => handleDelete(rowData)
                },
                {
                    icon: 'add',
                    tooltip: 'Add Waiter Table',
                    isFreeAction:true,
                    onClick: (event, rowData) => navigate('/admindashboard/waitertableinterface')
                  }
              ]}
            />    
        )
    }

    return(
        <div className={classes.root} >
            <div className={classes.box}>
                   {displayAll()}
            </div>
            {showDataForEdit()}
        </div>
    )
}