import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { Grid,Avatar,TextField,Radio,RadioGroup,FormControl,FormControlLabel,FormLabel,FormHelperText } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { Button, Dialog,DialogActions,DialogContent } from "@mui/material"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { serverURL,postData } from "../../services/FetchNodeServices";
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
    },
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
})


export default function DisplayAllWaiter(){
    var classes= useStyles()
    var navigate=useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listWaiter,setListWaiter]= useState([])
    const [open,setOpen]= useState(false)
    const [waiterId,setWaiterId]= useState("")
    const [btnStatus,setButtonStatus]= useState(false)
    const [tempFile,setTempFile]= useState({picture:''})

    ///////////////////Waiter Data///////////////
    const [restaurantId,setRestaurantId]= useState("")
    const [waiterName,setWaiterName]= useState("")
    const [gender,setGender]= useState("")
    const [dob,setDob]= useState('')
    const [mobileNo,setMobileNo]= useState("")
    const [emailid,setEmailid]= useState("")
    const [address,setAddress]= useState("")
    const [picture,setPicture]= useState({url:'',bytes:''})
    const [resError,setResError]= useState({})

    const handleImage=(event)=>{
        setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        setButtonStatus(true)
     }

    const handleError=(error,input,message)=>{
           setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
    }

    function validation(){
        var submitRecord= true
        if(!restaurantId){
            handleError(true,'restaurantId','Please Enter Restaurant Id')
            submitRecord=false
        }
        if(!waiterName){
            handleError(true,'waiterName','Please Enter Waiter Name')
            submitRecord=false
        }
        if(!gender){
            handleError(true,'gender','Please select Gender')
            submitRecord=false
        }
        if(!dob){
            handleError(true,'dob','Please Enter dob')
            submitRecord=false
        }
        if(!mobileNo || !(/^[0-9]{10}$/.test(mobileNo)))
        {
            handleError(true,'mobileNo','Please Enter Mobile No')
            submitRecord=false
        }
        if(!emailid || !(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(emailid)))
        {
            handleError(true,'emailid','Please Enter emailid')
            submitRecord=false
        }
        if(!address){
            handleError(true,'address','Please Enter address')
            submitRecord=false
        }
        if(!picture.url){
            handleError(true,'picture','Please Select File')
            submitRecord=false
        }
        return submitRecord
    }

    const handleSubmit=async()=>{
        if(validation()){
            var date= new Date(dob)
            var DOB=`${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}`
        var body={'restaurantid':restaurantId,'waitername':waiterName,'gender':gender,'dob':DOB,
           'mobileno':mobileNo,'emailid':emailid,'address':address,'waiterid':waiterId}
        var result=await postData('waiters/waiter_edit_data',body)
        if(result.status){
            Swal.fire({
               icon:'success',
               title:'Waiter registration',
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
    fetchAllWaiters()
    }

    ///////////////////////////////////////////////////////////

    const editImage=async()=>{
         var formData= new FormData()
         formData.append('waiterid',waiterId)
         formData.append('picture',picture.bytes)
         var result=await postData('waiters/waiter_edit_picture',formData)
         if(result.status){
           Swal.fire({
              position:'top-end',
              icon:'success',
              title:'Waiter registration',
              text:result.message,
              timer:5000,
              showConfirmButton:false,
              toast:true
           })
        }
        else{
           Swal.fire({
              position:'top-end',
              icon:'error',
              title:'oops...',
              text:result.message,
              timer:5000,
              showConfirmButton:false,
              toast:true
           })
        }
         setButtonStatus(false)
         fetchAllWaiters()
}

const handleClose=()=>{
       setButtonStatus(false)
       setPicture({url:tempFile.picture,bytes:''})
}

    const editDeleteButton=()=>{
        return(<div>
        <Button onClick={()=>editImage()}>Edit</Button>
        <Button onClick={()=>handleClose()}>Close</Button>
        </div>)
      }

const showData=()=>{
    return(
        <div >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title="Waiter Registration"/>  
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            disabled
                            label="Restaurant Id" value={restaurantId} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={resError?.waiterName?.error}
                            onFocus={()=>handleError(false,'waiterName','')}
                            helperText={resError?.waiterName?.message}
                            onChange={(event)=>setWaiterName(event.target.value)}
                            label="Waiter Name" value={waiterName} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl>
                            <FormLabel>Gender</FormLabel>
                                <RadioGroup row value={gender}
                                error={resError?.gender?.error}
                                onFocus={()=>handleError(false,'gender','')}
                                onChange={(event)=>setGender(event.target.value)}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                </RadioGroup>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.gender?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker format="DD-MM-YYYY"
                                defaultValue={dayjs(dob)}
                                onChange={(newdate)=>setDob(newdate)}
                                slotProps={{ textField: { fullWidth: true } }}
                                label="D.O.B." />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            error={resError?.mobileNo?.error}
                            onFocus={()=>handleError(false,'mobileNo','')}
                            helperText={resError?.mobileNo?.message}
                            onChange={(event)=>setMobileNo(event.target.value)}
                            label="Mobile No." value={mobileNo} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            error={resError?.emailid?.error}
                            onFocus={()=>handleError(false,'emailid','')}
                            helperText={resError?.emailid?.message}
                            onChange={(event)=>setEmailid(event.target.value)}
                            label="Email Id" value={emailid} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={resError?.address?.error}
                            onFocus={()=>handleError(false,'address','')}
                            helperText={resError?.address?.message} 
                            onChange={(event)=>setAddress(event.target.value)}
                            label="Address" value={address} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" component="label"  fullWidth endIcon={<UploadFile/>}>
                            <input accept="image/*"  type="file" multiple hidden 
                              onFocus={()=>handleError(false,'picture','')}  onChange={handleImage} />
                         Upload Image
                        </Button>
                        {
                            resError?.picture?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{resError?.picture?.message}</div>:<div></div>
                        }
                    </Grid>
                    <Grid className={classes.center} item xs={12}>
                        <Avatar
                            variant='rounded' 
                            src={picture.url}
                            sx={{ width: 56, height: 56 }}/>
                            <div>
                                {btnStatus?editDeleteButton():<></>}
                            </div>
                    </Grid>
                </Grid>
            </div>
    )
}


const fetchAllWaiters=async()=>{
     var result=await postData('waiters/fetch_all_waiter',{restaurantid:admin.restaurantid})
     setListWaiter(result.data)
}

useEffect(function(){
    fetchAllWaiters()
},[])

const handleEdit=(rowData)=>{
     setWaiterId(rowData.waiterid)
     setRestaurantId(rowData.restaurantid)
     setWaiterName(rowData.waitername)
     setGender(rowData.gender)
     setDob(rowData.dob)
     setMobileNo(rowData.mobileno)
     setEmailid(rowData.emailid)
     setAddress(rowData.address)
     setPicture({url:`${serverURL}/images/${rowData.picture}`,bytes:''})
     setTempFile({picture:`${serverURL}/images/${rowData.picture}`})
     setOpen(true)
}

const handleDelete=async(rowData)=>{
    Swal.fire({
       icon: 'warning',
       title: 'Do You Want To Delete Waiter?',
       showDenyButton: true,
       confirmButtonText: 'Yes Delete it',
       confirmButtonColor:'rgb(14 155 36)',
       denyButtonText: `Don't Delete`,
     }).then(async(result) => {
       if (result.isConfirmed) {
          var body={'waiterid':rowData.waiterid}
          var result=await postData('waiters/waiter_delete',body)
          if(result.status){
             Swal.fire('Waiter Deleted!', result.message, 'success')
             fetchAllWaiters()
          }
          else{
             Swal.fire('Fail!', result.message, 'error')
          }
       } else if (result.isDenied) {
         Swal.fire('Waiter Not Deleted', 'Your Data is Safe', 'error')
       }
     })
  }

const handleDialogClose=()=>{
    setOpen(false)
  }

const showDataForEdit=()=>{
    return(
     <Dialog open={open} maxWidth='md'>
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
           title="Waiter List"
           columns={[
            { title: 'Restaurant Id',
             render:rowData=><><div>{rowData.restaurantid}</div></>},
            { title: 'Waiter Name.', 
             render:rowData=><><div>{rowData.waitername}</div></> },
            { title: 'Gender', 
             render:rowData=><><div>{rowData.gender}</div></> },
            { title: 'D.O.B.', 
             render:rowData=><div>{rowData.dob}</div> },
            { title: 'Contact', 
             render:rowData=><><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></> },
            { title: 'Address', 
             render:rowData=><><div>{rowData.address}</div></> },
            { title: 'Picture', 
             render:rowData=><><div><img src={`${serverURL}/images/${rowData.picture}`} style={{width:55,height:40,borderRadius:10}}/></div></> },
            ]}
          data={listWaiter}  
          
          options={{
            paging:true,
            pageSize:3,
            emptyRowsWhenPaging:false,
            pageSizeOptions:[3,5,7]
        }}        
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Waiter',
              onClick: (event, rowData) => handleEdit(rowData)
            },
            {
              icon: 'delete',
              tooltip: 'Delete Waiter',
              onClick: (event, rowData) => handleDelete(rowData)
            },
            {
                icon: 'add',
                tooltip: 'Add Waiter',
                isFreeAction:true,
                onClick: (event, rowData) => navigate('/admindashboard/waiterinterface')
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