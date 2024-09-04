import { useState,useEffect } from "react"
import { makeStyles } from "@mui/styles"
import { Grid,TextField,FormControl,MenuItem,Select,InputLabel, FormLabel,Button,Avatar,FormControlLabel ,Radio, RadioGroup,FormHelperText} from "@mui/material"
import { UploadFile } from "@mui/icons-material"
import Swal from "sweetalert2"
import {Dialog,DialogActions,DialogContent } from "@mui/material"
import Heading from "../../components/heading/Heading"
import { serverURL,postData } from "../../services/FetchNodeServices"
import MaterialTable from "@material-table/core"
import { useNavigate } from "react-router-dom"

var useStyles= makeStyles({
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


export default function DisplayAllFoodItems(){
    const classes= useStyles()
    var navigate= useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listFoodItems,setListFoodItems]=useState([])
    const [open,setOpen]= useState(false)
    const [btnStatus,setButtonStatus]= useState(false)
    const [tempFile,setTempFile]= useState({icon:''})

    /////////////////food items data/////////////
    const [foodItemId,setFoodItemId]=useState("")
    const [restaurantId,setRestaurantId]= useState("")
    const [categoryId,setCategoryId]= useState("")
    const [category,setCategory]=useState([])
    const [foodItemName,setFoodItemName]=useState("")
    const [foodType,setFoodType]= useState("")
    const [ingredients,setIngredients]= useState("")
    const [price,setPrice]= useState("")
    const [offerPrice,setOfferPrice]= useState("")
    const [icon,setIcon]= useState({url:'',bytes:''})
    const [resError,setResError]=useState({})
    

    const FetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid})
        setCategory(result.data)
    }
    useEffect(function(){
        FetchAllCategory()
    },[])

    const fillCategory=()=>{
        return category.map((item)=>{
          return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
        })
    }

    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        setButtonStatus(true)
    }

    const handleError=(error,input,message)=>{
        setResError(prevState=>({...prevState,[input]:{'error':error,'message':message}}))
        console.log("cc",resError)
    }

    function validation(){
        var submitRecord=true
        if(!restaurantId){
            handleError(true,'restaurantId','Please Enter Restaurant Id')
            submitRecord= false
        }
        if(!categoryId){
            handleError(true,'categoryId','Please Choose Category')
            submitRecord= false
        }
        if(!foodItemName){
            handleError(true,'foodItemName','Please Enter Food Item Name')
            submitRecord= false
        }
        if(!foodType){
            handleError(true,'foodType','Please Select Food Type')
            submitRecord= false
        }
        if(!ingredients){
            handleError(true,'ingredients','Please Enter Ingredients')
            submitRecord= false
        }
        if(!price){
            handleError(true,'price','Please Enter Price')
            submitRecord= false
        }
        if(!offerPrice){
            handleError(true,'offerPrice','Please Enter Food Price')
            submitRecord= false
        }
        if(!icon.url){
            handleError(true,'icon','Please Select Food Item Icon')
            submitRecord= false
        }
        return submitRecord
        
    }

    const handleSubmit=async()=>{
        if(validation()){
        var body={'restaurantid':restaurantId,'categoryid':categoryId,'fooditemname':foodItemName,
        'foodtype':foodType,'ingredients':ingredients,'price':price,'offerprice':offerPrice,'icon':icon.bytes,'fooditemid':foodItemId}
        var result= await postData('fooditems/fooditems_edit_data',body)
        if(result.status){
            Swal.fire({
                icon:'success',
                title:'Food Item registration',
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
    fetchAllFoodItems()
    }

    ///////////////////////////////////////////////

    const editImage=async()=>{
        var formData= new FormData()
        formData.append('fooditemid',foodItemId)
        formData.append('icon',icon.bytes)
        var result=await postData('fooditems/fooditems_edit_icon',formData)
        if(result.status){
          Swal.fire({
             icon:'success',
             title:'Food Item registration',
             text:result.message,
             position:'top-end',
             timer:5000,
             showConfirmButton:false,
             toast:true
          })
       }
       else{
          Swal.fire({
             icon:'error',
             title:'oops...',
             text:result.message,
             position:'top-end',
             timer:5000,
             showConfirmButton:false,
             toast:true
          })
       }
        setButtonStatus(false)
       }
      
    const handleClose=()=>{
        setButtonStatus(false)
        setIcon({url:tempFile.icon})
       }

    const editDeleteButton=()=>{
        return(<div>
        <Button onClick={()=>editImage()}>Edit</Button>
        <Button onClick={()=>handleClose()}>Close</Button>
        </div>)
      }

    const handleEdit=(rowData)=>{
         setFoodItemId(rowData.fooditemid)
         setRestaurantId(rowData.restaurantid)
         setCategoryId(rowData.categoryid)
         setFoodItemName(rowData.fooditemname)
         setFoodType(rowData.foodtype)
         setIngredients(rowData.ingredients)
         setPrice(rowData.price)
         setOfferPrice(rowData.offerprice)
         setIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
         setTempFile({icon:`${serverURL}/images/${rowData.icon}`})
         setOpen(true)
    }


    const handleDelete=async(rowData)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Do You Want To Delete Food Item?',
            showDenyButton: true,
            confirmButtonText: 'Yes Delete it',
            confirmButtonColor:'rgb(14 155 36)',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            if (result.isConfirmed) {
               var body={'fooditemid':rowData.fooditemid}
               var result=await postData('fooditems/fooditems_delete',body)
               if(result.status){
                  Swal.fire('Food Item Deleted!', result.message, 'success')
                  fetchAllFoodItems()
               }
               else{
                  Swal.fire('Fail!', result.message, 'error')
               }
            } else if (result.isDenied) {
              Swal.fire('Food Item Not Deleted', 'Your Data is Safe', 'error')
            }
          })
       }


    const showData=()=>{
        return(
            <div >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"Food Items Register"}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         label="Restaurant Id" value={restaurantId}
                         disabled fullWidth ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <InputLabel>Category</InputLabel>
                            <Select 
                                error={resError?.categoryId?.error}
                                onFocus={()=>handleError(false,'categoryId','')}
                                label="Category" value={categoryId}
                               onChange={(event)=>setCategoryId(event.target.value)}>
                                <MenuItem>Select Category</MenuItem>
                                    {fillCategory()}
                            </Select>
                            <FormHelperText style={{color:'#d63031'}}>{resError?.categoryId?.message}</FormHelperText>
                        </FormControl> 
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         error={resError?.foodItemName?.error}
                         onFocus={()=>handleError(false,'foodItemName','')}
                         helperText={resError?.foodItemName?.message}
                         label="Food Item Name"  value={foodItemName}
                         onChange={(event)=>setFoodItemName(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Food Type</FormLabel>
                                <RadioGroup 
                                  error={resError?.foodType?.error}
                                  onFocus={()=>handleError(false,'foodType','')}
                                  row onChange={(event)=>setFoodType(event.target.value)} value={foodType}>
                                    <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
                                    <FormControlLabel value="Non-veg" control={<Radio />} label="Non-veg" />
                                </RadioGroup>
                                <FormHelperText style={{color:'#d63031'}}>{resError?.foodType?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                         error={resError?.ingredients?.error}
                         onFocus={()=>handleError(false,'ingredients','')}
                         helperText={resError?.ingredients?.message}
                         label="Ingredients" value={ingredients}
                         onChange={(event)=>setIngredients(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         error={resError?.price?.error}
                         onFocus={()=>handleError(false,'price','')}
                         helperText={resError?.price?.message}
                         label="Price" value={price}
                         onChange={(event)=>setPrice(event.target.value)} fullWidth ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         error={resError?.offerPrice?.error}
                         onFocus={()=>handleError(false,'offerPrice','')}
                         helperText={resError?.offerPrice?.message}
                         label="Offer Price" value={offerPrice}
                         onChange={(event)=>setOfferPrice(event.target.value)} fullWidth ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" component="label" endIcon={<UploadFile/>}>
                            <input  onChange={handleIcon}  accept="image/*"  type="file" multiple hidden></input>
                            Upload Food Item Icon
                        </Button>
                        {
                            resError?.icon?.error?<div style={{color:'#d63031',fontSize:13,marginLeft:12,marginTop:4}}>{resError?.icon?.message}</div>:<div></div>
                        }
                    </Grid>
                    <Grid className={classes.center} item xs={12}>
                    <Avatar
                     variant='rounded' 
                     src={icon.url}
                     sx={{ width: 56, height: 56 }}
                       />
                       <div>
                            {btnStatus?editDeleteButton():<></>}
                        </div>
                    </Grid>
                </Grid> 
            </div>
        )
    }

    const handleDialogClose=()=>{
        setOpen(false)
      }
     

    const fetchAllFoodItems=async()=>{
        var result=await postData('fooditems/fetch_all_fooditems',{restaurantid:admin.restaurantid})
        setListFoodItems(result.data)
    }

    useEffect(function(){
        fetchAllFoodItems()
    },[])

    const showDataForEdit=()=>{
        return(
        <Dialog open={open} maxWidth="md" >
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
               title="Category List"
               columns={[
                { title: 'Restaurant Id/Name',
                 render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></>},
                { title: 'Category Name', 
                 render:rowData=><><div>{rowData.categoryname}</div></> },
                { title: 'Food Item Name', 
                 render:rowData=><><div>{rowData.fooditemname}</div><div>/{rowData.foodtype}</div></> },
                 { title: 'Ingredients', 
                 render:rowData=><><div>{rowData.ingredients}</div></> },
                 { title: 'price', 
                 render:rowData=><><div><s>{rowData.price}</s></div><div>{rowData.offerprice}</div></> },
                { title: 'Food Item Icon', 
                 render:rowData=><><div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:40,height:40,borderRadius:10}}/></div></>},
                ]}
              data={listFoodItems}  
              options={{
                paging:true,
                pageSize:4,
                emptyRowsWhenPaging:false,
                pageSizeOptions:[4,5,7]
            }}        
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Food Items',
                  onClick: (event, rowData) => handleEdit(rowData)
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete Food Items',
                  onClick: (event, rowData) => handleDelete(rowData)
                },
                {
                    icon: 'add',
                    tooltip: 'Add Food Items',
                    isFreeAction:true,
                    onClick: (event, rowData) => navigate('/admindashboard/fooditemsinterface')
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