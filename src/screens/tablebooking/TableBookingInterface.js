import { useState,useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, TextField,FormControl,InputLabel,Select,MenuItem,Button,FormHelperText } from "@mui/material";
import Swal from "sweetalert2";
import Heading from "../../components/heading/Heading";
import { postData } from "../../services/FetchNodeServices";

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

export default function TableBookingInterface(){
    const classes= useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [restaurantId,setRestaurantId]= useState("")
    const [tableNo,setTableNo]= useState("")
    const [noOfChairs,setNoOfChairs]= useState("")
    const [floor,setFloor]= useState("")
    const [resError,setResError]= useState({}) 

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

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
        var body={'restaurantid':restaurantId,'tableno':tableNo,'noofchairs':noOfChairs,'floor':floor}
        var result=await postData('table/table_submit',body)
        if(result.status){
            Swal.fire({
                icon:'success',
                title:'Table registration',
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
                        <Heading title="Table Register" myroute={'/admindashboard/displayalltables'}/>
                    </Grid>
                    <Grid item xs={6}>
                           <TextField 
                           disabled value={restaurantId}
                           label="Restaurant Id"
                            fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                           <TextField 
                           error={resError?.tableNo?.error}
                           onFocus={()=>handleError(false,'tableNo','')}
                           helperText={resError?.tableNo?.message}
                           label="Table No." 
                           onChange={(event)=>setTableNo(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                           <TextField 
                           error={resError?.noOfChairs?.error}
                           onFocus={()=>handleError(false,'noOfChairs','')}
                           helperText={resError?.noOfChairs?.message}
                           label="No. Of Chairs" 
                           onChange={(event)=>setNoOfChairs(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl fullWidth >
                            <InputLabel>Floor</InputLabel>
                            <Select label="Floor" 
                               error={resError?.floor?.error}
                               onFocus={()=>handleError(false,'floor','')}
                                onChange={(event)=>setFloor(event.target.value)}>
                                <MenuItem>Select Floor</MenuItem>
                                <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                                <MenuItem value="1st Floor">Floor 1</MenuItem>   
                                <MenuItem value="2nd Floor">Floor 2</MenuItem> 
                                <MenuItem value="3rd Floor">Floor 3</MenuItem> 
                                <MenuItem value="4th Floor">Floor 4</MenuItem> 
                                <MenuItem value="5th Floor">Floor 5</MenuItem> 
                                <MenuItem value="Roof Top" >Terrace</MenuItem>
                            </Select>
                            <FormHelperText style={{color:'#d63031'}}>{resError?.floor?.message}</FormHelperText>
                        </FormControl> 
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={handleSubmit} variant="contained" fullWidth>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" fullWidth>Reset</Button>
                    </Grid>
                </Grid>    
            </div>
        </div>
    )
}