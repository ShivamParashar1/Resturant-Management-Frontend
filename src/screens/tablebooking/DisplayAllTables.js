import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import MaterialTable from "@material-table/core";
import { Button,Dialog,DialogActions,DialogContent,Grid,TextField,MenuItem,FormHelperText,FormControl,InputLabel,Select } from "@mui/material"
import Swal from "sweetalert2";
import { postData} from "../../services/FetchNodeServices";
import Heading from "../../components/heading/Heading";
import { useNavigate } from "react-router-dom";

const useStyles= makeStyles({
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
    }
})

export default function DisplayAllTables(){
    const classes= useStyles()
    var navigate=useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listTable,setListTable]= useState([])
    const [open,setOpen]= useState(false)

    /////////////////table data /////////////
    const [restaurantId,setRestaurantId]= useState("")
    const [tableId,setTableId]= useState("")
    const [tableNo,setTableNo]= useState("")
    const [noOfChairs,setNoOfChairs]= useState("")
    const [floor,setFloor]= useState("")
    const [resError,setResError]= useState({}) 

    const handleError=(error,input,message)=>{
        setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
        console.log("cc",resError)
    }

    function validation(){
        var submitRecord=true
        if(!restaurantId){
            handleError(true,'restaurantId','Please Enter Restaurant Id')
            submitRecord=false
        }
        if(!tableNo){
            handleError(true,'tableNo','Please Enter Table No.')
            submitRecord=false
        }
        if(!noOfChairs){
            handleError(true,'noOfChairs','Please Enter No. Of Chairs')
            submitRecord=false
        }
        if(!floor){
            handleError(true,'floor','Please Select Floor')
            submitRecord=false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation()){
        var body={'restaurantid':restaurantId,'tableno':tableNo,'noofchairs':noOfChairs,'floor':floor,'tableid':tableId}
        var result=await postData('table/table_edit_data',body)
        if(result.status){
            Swal.fire({
                icon:'success',
                title:'Table registration',
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
        fetchAllTable()
    }

    /////////////////////////////////////////

    
    const fetchAllTable=async()=>{
        var result=await postData('table/fetch_all_table',{restaurantid:admin.restaurantid})
        setListTable(result.data)
    }

    useEffect(function(){
        fetchAllTable()
    },[])

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setTableNo(rowData.tableno)
        setNoOfChairs(rowData.noofchairs)
        setFloor(rowData.floor)
        setTableId(rowData.tableid)
        setOpen(true)
    }

    const handleDelete=async(rowData)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Do You Want To Delete Table?',
            showDenyButton: true,
            confirmButtonText: 'Yes Delete it',
            confirmButtonColor:'rgb(14 155 36)',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            if (result.isConfirmed) {
               var body={'tableid':rowData.tableid}
               var result=await postData('table/table_delete',body)
               if(result.status){
                  Swal.fire('Table Deleted!', result.message, 'success')
                  fetchAllTable()
               }
               else{
                  Swal.fire('Fail!', result.message, 'error')
               }
            } else if (result.isDenied) {
              Swal.fire('Table Not Deleted', 'Your Data is Safe', 'error')
            }
          })
       }

    const showData=()=>{
        return(
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Heading title="Table Register"/>
                        </Grid>
                        <Grid item xs={6}>
                               <TextField 
                               label="Restaurant Id" value={restaurantId}
                               disabled fullWidth></TextField>
                        </Grid>
                        <Grid item xs={6}>
                               <TextField 
                               error={resError?.tableNo?.error}
                               onFocus={()=>handleError(false,'tableNo','')}
                               helperText={resError?.tableNo?.message}
                               label="Table No."  value={tableNo}
                               onChange={(event)=>setTableNo(event.target.value)} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={6}>
                               <TextField 
                               error={resError?.noOfChairs?.error}
                               onFocus={()=>handleError(false,'noOfChairs','')}
                               helperText={resError?.noOfChairs?.message}
                               label="No. Of Chairs" value={noOfChairs}
                               onChange={(event)=>setNoOfChairs(event.target.value)} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl fullWidth >
                                <InputLabel>Floor</InputLabel>
                                <Select label="Floor" value={floor}
                                   error={resError?.floor?.error}
                                   onFocus={()=>handleError(false,'floor','')}
                                    onChange={(event)=>setFloor(event.target.value)}>
                                    <MenuItem>Select Floor</MenuItem>
                                    <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                                    <MenuItem value="1st Floor">1st Floor</MenuItem>   
                                    <MenuItem value="2nd Floor">2nd Floor</MenuItem> 
                                    <MenuItem value="3rd Floor">3rd Floor</MenuItem> 
                                    <MenuItem value="4th Floor">4th Floor</MenuItem> 
                                    <MenuItem value="5th Floor">5th Floor</MenuItem> 
                                    <MenuItem>Terrace</MenuItem>
                                </Select>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.floor?.message}</FormHelperText>
                            </FormControl> 
                        </Grid>
                    </Grid>    
                </div>
        )
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
                  <Button onClick={handleSubmit}>Edit</Button>
                  <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
        )
    }

    function displayAll(){
        return(
            <MaterialTable
               title="Table List"
               columns={[
                { title: 'Restaurant Id/Name',
                 render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></>},
                { title: 'Table No.', 
                 render:rowData=><><div>{rowData.tableno}</div></> },
                { title: 'No. Of Chairs', 
                 render:rowData=><><div>{rowData.noofchairs}</div></> },
                 { title: 'Floor', 
                 render:rowData=><><div>{rowData.floor}</div></> },
                ]}
              data={listTable}        
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Table',
                  onClick: (event, rowData) => handleEdit(rowData)
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete Table',
                  onClick: (event, rowData) => handleDelete(rowData)
                },
                {
                    icon: 'add',
                    tooltip: 'Add Table',
                    isFreeAction:true,
                    onClick: (event, rowData) => navigate('/admindashboard/tablebookinginterface')
                  }
              ]}
            />    
        )
    }

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                {displayAll()}
            </div>
              {showDataForEdit()}
        </div>
    )
}