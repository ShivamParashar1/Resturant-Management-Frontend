import Heading from "../../components/heading/Heading";
import { makeStyles } from "@mui/styles";
import { Grid, TextField,Button,Avatar } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useState,useEffect } from "react";
import Swal from "sweetalert2"
import { postData } from "../../services/FetchNodeServices";

var useStyles= makeStyles({
    root:{
        width:'auto',
        height:'auto',
        background:"#dfe4ea",
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:30
    },
    box:{
       width:'60%',
       height:'auto',
       borderRadius:10,
       background:'#fff',
       padding:15,
    },
    center:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      }
})

export default function CategoryInterface(){
    var classes= useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [restaurantId,setRestaurantId]= useState("");
    const [categoryName,setCategoryName]= useState("")
    const [categoryIcon,setCategoryIcon]= useState({url:'',bytes:''})
    const [categoryError,setCategoryError]= useState({}) 

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleError=(error,input,message)=>{
        setCategoryError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
    } 

    function validation(){
       var submitRecord=true
       if(!restaurantId){
         handleError(true,'restaurantId','Please Enter Restaurant Id')
         submitRecord=false
       }
       if(!categoryName){
        handleError(true,'categoryName','Please Enter Category Name')
        submitRecord=false
      }
      if(!categoryIcon.url){
        handleError(true,'categoryIcon','Please Upload Category Image')
      }
      return submitRecord
    }

    const handleCategoryLogo=(event)=>{
        setCategoryIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})  
        console.log("cc",categoryError)
    }

    const handleSubmit=async()=>{
        if(validation()){
        var formData= new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('categoryname',categoryName)
        formData.append('icon',categoryIcon.bytes)
        var result=await postData('category/category_submit',formData)
        if(result.status){
            Swal.fire({
               icon:'success',
               title:'Category registration',
               text:result.message
            })
         }
         else{
            Swal.fire({
               icon:'error',
               title:'Oops...',
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
                        <Heading title={"Category Register"}  myroute={'/admindashboard/displayallcategory'}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                         disabled value={restaurantId}
                         label="Restaurant id" fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                        error={categoryError?.categoryName?.error}
                        onFocus={()=>handleError(false,'categoryName','')}
                        helperText={categoryError?.categoryName?.message}
                        label="Category Name"
                        onChange={(event)=>setCategoryName(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" component="label" endIcon={<UploadFile/>}>Upload Category Image
                        <input onChange={handleCategoryLogo} accept="image/*" type="file" multiple hidden>
                        </input>
                        </Button>
                        {
                            categoryError?.categoryIcon?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{categoryError?.categoryIcon?.message}</div>:<div></div>
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.center}>
                        <Avatar
                        variant='rounded' 
                        src={categoryIcon.url}
                        sx={{ width: 76, height: 56 }} />
                    </Grid>
                    <Grid item xs={6}>
                         <Button fullWidth variant="contained" onClick={handleSubmit}>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                         <Button fullWidth variant="contained">reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}