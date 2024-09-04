import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, Grid, TextField,Radio,RadioGroup,FormLabel,FormControlLabel, Button,Avatar,FormHelperText } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import Swal from "sweetalert2";
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

export default function WaiterInterface(){
    const classes= useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [restaurantId,setRestaurantId]= useState("")
    const [waiterName,setWaiterName]= useState("")
    const [gender,setGender]= useState("")
    const [dob,setDob]= useState('')
    const [mobileNo,setMobileNo]= useState("")
    const [emailid,setEmailid]= useState("")
    const [address,setAddress]= useState("")
    const [picture,setPicture]= useState({url:'',bytes:''})
    const [resError,setResError]= useState({})

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleImage=(event)=>{
        setPicture({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
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
        var formData= new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('waitername',waiterName)
        formData.append('gender',gender)
        formData.append('dob',dob)
        formData.append('mobileno',mobileNo)
        formData.append('emailid',emailid)
        formData.append('address',address)
        formData.append('picture',picture.bytes)
        var result=await postData('waiters/waiter_submit',formData)
        if(result.status){
            Swal.fire({
               icon:'success',
               title:'Waiter registration',
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
                        <Heading title="Waiter Registration" myroute={'/admindashboard/displayallwaiter'}/>  
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            disabled value={restaurantId}
                            label="Restaurant Id" fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            error={resError?.waiterName?.error}
                            onFocus={()=>handleError(false,'waiterName','')}
                            helperText={resError?.waiterName?.message}
                            onChange={(event)=>setWaiterName(event.target.value)}
                            label="Waiter Name" fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl>
                            <FormLabel>Gender</FormLabel>
                                <RadioGroup row 
                                error={resError?.gender?.error}
                                onFocus={()=>handleError(false,'gender','')}
                                onChange={(event)=>setGender(event.target.value)}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                </RadioGroup>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.gender?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} fullWidth>
                        <TextField 
                            error={resError?.dob?.error}
                            onFocus={()=>handleError(false,'dob','')}
                            helperText={resError?.dob?.message}
                            onChange={(event)=>setDob(event.target.value)}
                            label="D.O.B." fullWidth value={dob}
                            type="date" variant='outlined'
                            InputLabelProps={{
                                shrink: true,
                              }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            error={resError?.mobileNo?.error}
                            onFocus={()=>handleError(false,'mobileNo','')}
                            helperText={resError?.mobileNo?.message}
                            onChange={(event)=>setMobileNo(event.target.value)}
                            label="Mobile No." fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            error={resError?.emailid?.error}
                            onFocus={()=>handleError(false,'emailid','')}
                            helperText={resError?.emailid?.message}
                            onChange={(event)=>setEmailid(event.target.value)}
                            label="Email Id" fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={resError?.address?.error}
                            onFocus={()=>handleError(false,'address','')}
                            helperText={resError?.address?.message} 
                            onChange={(event)=>setAddress(event.target.value)}
                            label="Address" fullWidth></TextField>
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
                            sx={{ width: 56, height: 56 }}
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