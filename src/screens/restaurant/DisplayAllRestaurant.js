import MaterialTable from "@material-table/core"
import { useState,useEffect } from "react"
import { makeStyles } from "@mui/styles"
import { Avatar, FormControl, Grid,InputLabel,MenuItem,Select,TextField,FormHelperText } from "@mui/material"
import Swal from "sweetalert2"
import Heading from "../../components/heading/Heading"
import { UploadFile } from "@mui/icons-material"
import { Button, Dialog,DialogActions,DialogContent } from "@mui/material"
import { serverURL,postData,getData} from "../../services/FetchNodeServices"
import { useNavigate } from "react-router-dom"

const useStyles= makeStyles({
    rootdisplay:{
        width:'auto',
        height:'100vh',
        background:'#dfe4ea',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    boxdisplay:{
        width:'100vw',
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

export default function DisplayAllRestaurant(){
    var classes= useStyles()
    var navigate= useNavigate()
    const [listRestaurant,setListRestaurant]= useState([])
    const [open,setOpen]= useState(false)

    /////////////// Restaurant Data ////////////////////
    const [restaurantId,setRestaurantId]=useState('')
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
    const [btnStatus,setButtonStatus]= useState({fssai:false,shopAct:false,logo:false})
    const [tempFile,setTempFile]= useState({fssai:'',shopAct:'',logo:''})

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
 setButtonStatus((prev)=>({...prev,fssai:true}))
}
const handleShopAct=(event)=>{
 setFileShopAct({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
 setButtonStatus((prev)=>({...prev,shopAct:true}))
}
const handleLogo=(event)=>{
 setFileLogo({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
 setButtonStatus((prev)=>({...prev,logo:true}))
}

const handleSubmit=async()=>{
 if(validation()){
   var d=new Date()
   var cd= d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
 var body={
 'restaurantname':restaurantName,'ownername':ownerName,'phonenumber':phoneNumber,
 'emailid':emailid,'mobileno':mobileNumber,'address':address,'stateid':stateid,'cityid':cityid,
 'url':url,'fssai':fssai,'gstno':gstNo,'gsttype':gstType,'filefssai':fileFssai.bytes,
 'fileshopact':fileShopAct.bytes,'filelogo':fileLogo.bytes,'updatedat':cd,'restaurantid':restaurantId }
 var result= await postData('restaurants/restaurant_edit_data',body)
 if(result.status){
    Swal.fire({
       icon:'success',
       title:'Restaurant registration',
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
  fetchAllRestaurant()
}

    /////////////////////////////////////////////////////////////

    const handleClose=(imgStatus)=>{
      if(imgStatus===1){
         setButtonStatus((prev)=>({...prev,fssai:false}))
         setFileFssai({url:tempFile.fssai,bytes:''})
      }
      else if(imgStatus===2){
         setButtonStatus((prev)=>({...prev,shopAct:false}))
         setFileShopAct({url:tempFile.shopAct,bytes:''})
      }
      else if(imgStatus===3){
         setButtonStatus((prev)=>({...prev,logo:false}))
         setFileLogo({url:tempFile.logo,bytes:''})
      }
    }
    const editImage=async(imgStatus)=>{
      if(imgStatus===1){
       var formData= new FormData()
       formData.append('restaurantid',restaurantId)
       formData.append('filefssai',fileFssai.bytes)
       var result=await postData('restaurants/restaurant_edit_fssai',formData)
       if(result.status){
         Swal.fire({
            position:'top-end',
            icon:'success',
            title:'Restaurant registration',
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
       setButtonStatus((prev)=>({...prev,fssai:false}))
   }
   else if(imgStatus===2){
      var formData= new FormData()
      formData.append('restaurantid',restaurantId)
      formData.append('fileshopact',fileShopAct.bytes)
      var result=await postData('restaurants/restaurant_edit_shopact',formData)
      if(result.status){
        Swal.fire({
           position:'top-end',
           icon:'success',
           title:'Restaurant registration',
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
      setButtonStatus((prev)=>({...prev,shopAct:false}))
  }
   else if(imgStatus===3){
      var formData= new FormData()
      formData.append('restaurantid',restaurantId)
      formData.append('filelogo',fileLogo.bytes)
      var result=await postData('restaurants/restaurant_edit_logo',formData)
      if(result.status){
        Swal.fire({
           position:'top-end',
           icon:'success',
           title:'Restaurant registration',
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
      setButtonStatus((prev)=>({...prev,logo:false}))
  }
  fetchAllRestaurant()
}
    

    const editDeleteButton=(imgStatus)=>{
      return(<div>
      <Button onClick={()=>editImage(imgStatus)}>Edit</Button>
      <Button onClick={()=>handleClose(imgStatus)}>Close</Button>
      </div>)
    }


    const fetchAllRestaurant=async()=>{
        var result= await getData('restaurants/fetch_all_restaurant')
        setListRestaurant(result.data)
    }

    const handleEdit=(rowData)=>{
      fetchAllCities(rowData.stateid)
      setRestaurantId(rowData.restaurantid)
      setRestaurantName(rowData.restaurantname)
      setOwnerName(rowData.ownername)
      setPhoneNumber(rowData.phonenumber)
      setMobileNumber(rowData.mobileno)
      setEmailid(rowData.emailid)
      setAddress(rowData.address)
      setStateId(rowData.stateid)
      setCityId(rowData.cityid)
      setUrl(rowData.url)
      setFssai(rowData.fssai)
      setGstNo(rowData.gstno)
      setGstType(rowData.gsttype)
      setFileFssai({url:`${serverURL}/images/${rowData.filefssai}`,bytes:''})
      setFileShopAct({url:`${serverURL}/images/${rowData.fileshopact}`,bytes:''})
      setFileLogo({url:`${serverURL}/images/${rowData.filelogo}`,bytes:''})
      setTempFile({fssai:`${serverURL}/images/${rowData.filefssai}`,shopAct:`${serverURL}/images/${rowData.fileshopact}`,
                     logo:`${serverURL}/images/${rowData.filelogo}`})
      setOpen(true)
    }

    const showData=()=>{
      return(
      <div className={classes.root}>
         <div className={classes.box}>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                  <Heading title={"Restaurant Registration"}/>
               </Grid>
               <Grid item xs={6}>
                  <TextField 
                  error={resError?.restaurantName?.error}
                  onFocus={()=>handleError(false,'restaurantName','')}
                  helperText={resError?.restaurantName?.message}
                  onChange={(event)=>setRestaurantName(event.target.value)}
                  label="Resturant Name" value={restaurantName} fullWidth/>
               </Grid>
               <Grid item xs={6}>
                  <TextField
                  error={resError?.ownerName?.error}
                  onFocus={()=>handleError(false,'ownerName','')}
                  helperText={resError?.ownerName?.message}
                  onChange={(event)=>setOwnerName(event.target.value)} 
                  label="Owner's name" value={ownerName} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField onChange={(event)=>setPhoneNumber(event.target.value)} label="Phone Number" value={phoneNumber} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.mobileNumber?.error}
                  onFocus={()=>handleError(false,'mobileNumber','')}
                  helperText={resError?.mobileNumber?.message}
                  onChange={(event)=>setMobileNumber(event.target.value)} 
                  label="Mobile Number" value={mobileNumber} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.emailid?.error}
                  onFocus={()=>handleError(false,'emailid','')}
                  helperText={resError?.emailid?.message}
                  onChange={(event)=>setEmailid(event.target.value)} 
                  label="Email Address" value={emailid} fullWidth/>
               </Grid>
               <Grid item xs={12}>
                     <TextField 
                     error={resError?.address?.error}
                     onFocus={()=>handleError(false,'address','')}
                     helperText={resError?.address?.message}
                     onChange={(event)=>setAddress(event.target.value)} 
                     label="Address" value={address} fullWidth/>
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
                  <TextField onChange={(event)=>setUrl(event.target.value)} label="URL" value={url} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.fssai?.error}
                  onFocus={()=>handleError(false,'fssai','')}
                  helperText={resError?.fssai?.message}
                  onChange={(event)=>setFssai(event.target.value)} 
                  label="Fssai Number" value={fssai} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <TextField 
                  error={resError?.gstNo?.error}
                  onFocus={()=>handleError(false,'gstNo','')}
                  helperText={resError?.gstNo?.message}
                  onChange={(event)=>setGstNo(event.target.value)} 
                  label="GST Number" value={gstNo} fullWidth/>
               </Grid>
               <Grid item xs={4}>
                  <FormControl fullWidth>
                     <InputLabel>GST Type</InputLabel>
                        <Select label="GST type" value={gstType} 
                        error={resError?.gstType?.error}
                        onFocus={()=>handleError(false,'gsttype','')}
                        onChange={(event)=>setGstType(event.target.value)}>
                            <MenuItem>-Select GST type-</MenuItem>
                            <MenuItem value={'5 Star'}>5 Star</MenuItem>
                            <MenuItem value={'Others'}>Others</MenuItem>
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
                     onChange={handleShopAct}  accept="image/*"  type="file"
                      multiple hidden></input>
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
                     sx={{ width: 56, height: 56 }} />
                     <div>
                        {btnStatus.fssai?editDeleteButton(1):<></>}
                     </div>
               </Grid>
               <Grid className={classes.center} item xs={4}>
                  <Avatar
                     variant='rounded'
                     src={fileShopAct.url}
                     sx={{ width: 56, height: 56 }}/>
                      <div>
                        {btnStatus.shopAct?editDeleteButton(2):<></>}
                     </div>
               </Grid>
               <Grid className={classes.center} item xs={4}>
                  <Avatar
                     variant='rounded'
                     src={fileLogo.url}
                     sx={{ width: 56, height: 56 }}/>
                      <div>
                        {btnStatus.logo?editDeleteButton(3):<></>}
                     </div>
               </Grid>
            </Grid>
         </div>
      </div>
      )
    }

    const handleDelete=async(rowData)=>{
      Swal.fire({
         icon: 'warning',
         title: 'Do You Want To Delete Restaurant?',
         showDenyButton: true,
         confirmButtonText: 'Yes Delete it',
         confirmButtonColor:'rgb(14 155 36)',
         denyButtonText: `Don't Delete`,
       }).then(async(result) => {
         if (result.isConfirmed) {
            var body={'restaurantid':rowData.restaurantid}
            var result=await postData('restaurants/restaurant_delete',body)
            if(result.status){
               Swal.fire('Restaurant Deleted!', result.message, 'success')
               fetchAllRestaurant()
            }
            else{
               Swal.fire('Fail!', result.message, 'error')
            }
         } else if (result.isDenied) {
           Swal.fire('Restaurant Not Deleted', 'Your Data is Safe', 'error')
         }
       })
    }

    const handleDialogClose=()=>{
      setOpen(false)
    }
     
    const showDataForEdit=()=>{
       return(
        <Dialog open={open} maxWidth={'lg'} >
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


    useEffect(function(){
        fetchAllRestaurant()
    },[])

    function displayAll() {
        return (
          <MaterialTable
            title="Restaurant List"
            columns={[
              { title: 'Restaurant',
               render:rowData=><><div style={{fontWeight:'bold'}}>{rowData.restaurantname}</div><div>{rowData.ownername}</div></>},
              { title: 'Address', 
               render:rowData=><><div>{rowData.address}</div><div>{rowData.cityname},{rowData.statename}</div></> },
              { title: 'Contact', 
               render:rowData=><><div>{rowData.phonenumber}</div><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></>},
              { title: 'Documents', 
               render:rowData=><><div>FssaiNo:-{rowData.fssai}</div><div>GstNo:-{rowData.gstno}/{rowData.gsttype}</div></>},
              { title: 'Logo', 
               render:rowData=><><div><img src={`${serverURL}/images/${rowData.filelogo}`} style={{width:55,height:40,borderRadius:10}}/></div></>},
              { title: 'Website', 
               render:rowData=><><div><a href='{rowData.url}'>Visit</a></div></>},
              ]}
            data={listRestaurant}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Restaurant',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Restaurant',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
               icon: 'add',
               tooltip: 'Add Restaurant',
               isFreeAction:true,
               onClick: (event, rowData) => navigate('/dashboard/restaurantinterface')
             }
            ]}
          />
        )
    }

    return(
        <div className={classes.rootdisplay}>
            <div className={classes.boxdisplay}>
                {displayAll()}
            </div>
                {showDataForEdit()}
        </div>
    )
}