import { useState, useEffect } from "react"
import { Button,Avatar, FormControl, Grid,InputLabel,MenuItem,Select,TextField,FormHelperText } from "@mui/material"
import {makeStyles} from "@mui/styles"
import Swal from "sweetalert2"
import Heading from '../../components/heading/Heading'
import { UploadFile } from "@mui/icons-material"

import { serverURL,postData,getData} from "../../services/FetchNodeServices"

const useStyles= makeStyles({
   root:{
      width:'auto',
      height:'100vh',
      background:'#dfe4ea',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
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

export default function RestaurantInterface(props){
   const [states,setStates]= useState([])
    const [stateid,setStateId]= useState('')
    const [cities,setCities]= useState([])
    const [cityid,setCityId]= useState('')
    const [restaurantName,setRestaurantName]=useState('')
    const [ownerName,setOwnerName]=useState('')
    const [phoneNumber,setPhoneNumber]=useState()
    const [mobileNumber,setMobileNumber]=useState()
    const [emailid,setEmailid]=useState('')
    const [address,setAddress]=useState('')
    const [url,setUrl]=useState('')
    const [fssai,setFssai]=useState('')
    const [gstNo,setGstNo]=useState('')
    const [gstType,setGstType]=useState('')
    const [fileFssai,setFileFssai]=useState({url:'',bytes:''})
    const [fileShopAct,setFileShopAct]=useState({url:'',bytes:''})
    const [fileLogo,setFileLogo]=useState({url:'',bytes:''})
    const [resError,setResError]=useState({})
    const [password,setPassword]=useState('')

    const generatePassword=()=>{
        var pwd=parseInt((Math.random()*8999)+1000)
        return pwd
    }

    const handleError=(error,input,message)=>{
           setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
           console.log("cc",resError)
    }

   function validation(){
      var submitRecord=true
      if(restaurantName.trim().length===0){
         handleError(true,'restaurantName','Pls Input Restaurant Name')
         submitRecord=false
      }
      if(ownerName.trim().length===0){
         handleError(true,'ownerName','Pls Input Owners Name')
         submitRecord=false
      }
      if(!mobileNumber || !(/^[0-9]{10}$/.test(mobileNumber))){
         handleError(true,'mobileNumber','Pls Input Correct Mobile Number')
         submitRecord=false
      } 
      if(!emailid || !(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(emailid))){
         handleError(true,'emailid','Pls Input Correct Email Address')
         submitRecord=false
      } 
      if(!address){
         handleError(true,'address','Pls Input Your Address')
         submitRecord=false
      }
      if(!stateid){
         handleError(true,'stateid','Pls Select State')
         submitRecord=false
      }
      if(!cityid){
         handleError(true,'cityid','Pls Select City')
         submitRecord=false
      }
      if(!fssai){
         handleError(true,'fssai','Pls Input Fssai Number')
         submitRecord=false
      }
      if(!gstNo){
         handleError(true,'gstNo','Pls Input GST Number')
         submitRecord=false
      }
      if(!gstType){
         handleError(true,'gstType','Pls Select GST Type')
         submitRecord=false
      }
      if(!fileFssai.url){
         handleError(true,'fileFssai','Pls Select File Fssai')
         submitRecord=false
      }
      if(!fileShopAct.url){
         handleError(true,'fileShopAct','Pls Select File Shop Registration')
         submitRecord=false
      }
      if(!fileLogo.url){
         handleError(true,'fileLogo','Pls Select File Logo')
         submitRecord=false
      }
      return submitRecord
  }
     
    const fetchAllStates=async()=>{
      var result=await getData('statecity/fetch_all_states')
      console.log(result)
      setStates(result.data)
    }

    useEffect(function(){
      fetchAllStates()
    },[])

      const fillState=()=>{ 
      return states.map((item)=>{
        return <MenuItem value={item.stateid}>{item.statename}</MenuItem>
      })
   }

   const fetchAllCities=async(stateid)=>{
      var body={stateid:stateid}
      var result= await postData('statecity/fetch_all_cities',body)
      setCities(result.data)
   }

   const fillCities=()=>{
      return cities.map((item)=>{
         return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>
      })
   }
   
   const handleStateChange=(event)=>{
      setStateId(event.target.value)
      fetchAllCities(event.target.value)
   } 

   const handleFssai=(event)=>{
      setFileFssai({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
   }
   const handleShopAct=(event)=>{
      setFileShopAct({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
   }
   const handleLogo=(event)=>{
      setFileLogo({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
   }

   const handleSubmit=async()=>{
      if(validation()){
      var formData= new FormData()
      formData.append('restaurantname',restaurantName)
      formData.append('ownername',ownerName)
      formData.append('phonenumber',phoneNumber)
      formData.append('emailid',emailid)
      formData.append('mobileno',mobileNumber)
      formData.append('address',address)
      formData.append('stateid',stateid)
      formData.append('cityid',cityid)
      formData.append('url',url)
      formData.append('fssai',fssai)
      formData.append('gstno',gstNo)
      formData.append('gsttype',gstType)
      formData.append('filefssai',fileFssai.bytes)
      formData.append('fileshopact',fileShopAct.bytes)
      formData.append('filelogo',fileLogo.bytes)
      formData.append('password',generatePassword())
      var d=new Date()
      var cd= d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
      formData.append('createdat',cd)
      formData.append('updatedat',cd)
      var result= await postData('restaurants/restaurant_submit',formData)
      if(result.status){
         Swal.fire({
            icon:'success',
            title:'Restaurant registration',
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


   const classes= useStyles(props)
   return(
      <div className={classes.root}>
         <div className={classes.box}>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                  <Heading title={"Restaurant Registration"} myroute={'/dashboard/displayallrestaurant'}/>
               </Grid>
               <Grid item xs={6}>
                  <TextField 
                  error={resError?.restaurantName?.error}
                  onFocus={()=>handleError(false,'restaurantName','')}
                  helperText={resError?.restaurantName?.message}
                  onChange={(event)=>setRestaurantName(event.target.value)}
                  label="Resturant Name" fullWidth/>
               </Grid>
               <Grid item xs={6}>
                  <TextField
                  error={resError?.ownerName?.error}
                  onFocus={()=>handleError(false,'ownerName','')}
                  helperText={resError?.ownerName?.message}
                  onChange={(event)=>setOwnerName(event.target.value)} 
                  label="Owner's name" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField onChange={(event)=>setPhoneNumber(event.target.value)} label="Phone Number" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.mobileNumber?.error}
                  onFocus={()=>handleError(false,'mobileNumber','')}
                  helperText={resError?.mobileNumber?.message}
                  onChange={(event)=>setMobileNumber(event.target.value)} 
                  label="Mobile Number" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.emailid?.error}
                  onFocus={()=>handleError(false,'emailid','')}
                  helperText={resError?.emailid?.message}
                  onChange={(event)=>setEmailid(event.target.value)} 
                  label="Email Address" fullWidth/>
               </Grid>
               <Grid item xs={12}>
                     <TextField 
                     error={resError?.address?.error}
                     onFocus={()=>handleError(false,'address','')}
                     helperText={resError?.address?.message}
                     onChange={(event)=>setAddress(event.target.value)} 
                     label="Address" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <FormControl fullWidth>
                     <InputLabel>States</InputLabel>
                        <Select label="States" value={stateid}
                        error={resError?.stateid?.error}
                        onFocus={()=>handleError(false,'stateid','')}
                        onChange={handleStateChange} >
                           <MenuItem>-Select State-</MenuItem>
                           {fillState()}
                        </Select>
                        <FormHelperText style={{color:'#d63031'}}>{resError?.stateid?.message}</FormHelperText>
                  </FormControl>
                  {
                  // resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<div></div>
                   }
               </Grid>
               <Grid item xs={4}>
                     <FormControl fullWidth>
                        <InputLabel>City</InputLabel>
                           <Select label="City" value={cityid} 
                           error={resError?.cityid?.error}
                           onFocus={()=>handleError(false,'cityid','')}
                           onChange={(event)=>setCityId(event.target.value)} >
                            <MenuItem>-Select City-</MenuItem>
                            {fillCities()}
                           </Select>
                           <FormHelperText style={{color:'#d63031'}}>{resError?.cityid?.message}</FormHelperText>
                     </FormControl>
               </Grid>
               <Grid item xs={4}>
                  <TextField onChange={(event)=>setUrl(event.target.value)} label="URL" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.fssai?.error}
                  onFocus={()=>handleError(false,'fssai','')}
                  helperText={resError?.fssai?.message}
                  onChange={(event)=>setFssai(event.target.value)} 
                  label="Fssai Number" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.gstNo?.error}
                  onFocus={()=>handleError(false,'gstNo','')}
                  helperText={resError?.gstNo?.message}
                  onChange={(event)=>setGstNo(event.target.value)} 
                  label="GST Number" fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <FormControl fullWidth>
                     <InputLabel>GST Type</InputLabel>
                        <Select label="GST type" value={gstType} 
                        error={resError?.gstType?.error}
                        onFocus={()=>handleError(false,'gstType','')}
                        onChange={(event)=>setGstType(event.target.value)}>
                            <MenuItem>-Select GST type-</MenuItem>
                            <MenuItem value={18}>5 Star</MenuItem>
                            <MenuItem value={5}>Others</MenuItem>
                        </Select>
                        <FormHelperText style={{color:'#d63031'}}>{resError?.gstType?.message}</FormHelperText>
                  </FormControl>
               </Grid>
               <Grid item xs={4}>
                  <Button fullWidth variant="contained" component="label" endIcon={<UploadFile/>}>
                     <input 
                      onFocus={()=>handleError(false,'fileFssai','')}
                      onChange={handleFssai}  accept="image/*"  type="file" multiple hidden></input>
                     Upload Fssai
                  </Button>
                    {
                       resError?.fileFssai?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{resError?.fileFssai?.message}</div>:<div></div>
                   }
               </Grid>
               <Grid item xs={4}>
                  <Button fullWidth variant="contained" component="label" endIcon={<UploadFile/>}>
                     <input 
                     onFocus={()=>handleError(false,'fileShopAct','')}
                     onChange={handleShopAct}  accept="image/*"  type="file" multiple hidden></input>
                     Upload Shop Act
                  </Button>
                  {
                       resError?.fileShopAct?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{resError?.fileShopAct?.message}</div>:<div></div>
                   }
                    </Grid>
               <Grid item xs={4}>
                  <Button fullWidth variant="contained" component="label" endIcon={<UploadFile/>}>
                     <input 
                     onFocus={()=>handleError(false,'fileLogo','')}
                     onChange={handleLogo}  accept="image/*" type="file" multiple hidden></input>
                     Upload Logo
                  </Button>
                  {
                       resError?.fileLogo?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{resError?.fileLogo?.message}</div>:<div></div>
                   }
               </Grid>
               <Grid className={classes.center} item xs={4}>
                  <Avatar
                     variant='rounded' 
                     src={fileFssai.url}
                     sx={{ width: 56, height: 56 }}
                  />
               </Grid>
               <Grid className={classes.center} item xs={4}>
                  <Avatar
                     variant='rounded'
                     src={fileShopAct.url}
                     sx={{ width: 56, height: 56 }}
                  />
               </Grid>
               <Grid className={classes.center} item xs={4}>
                  <Avatar
                     variant='rounded'
                     src={fileLogo.url}
                     sx={{ width: 56, height: 56 }}
                  />
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