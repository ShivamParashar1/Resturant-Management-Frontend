import { useEffect,useState } from "react"
import { makeStyles } from "@mui/styles"
import { Grid,TextField,FormControl,MenuItem,Select,InputLabel, FormLabel,Button,Avatar,FormControlLabel ,Radio, RadioGroup,FormHelperText} from "@mui/material"
import { UploadFile } from "@mui/icons-material"
import Swal from "sweetalert2"
import Heading from "../../components/heading/Heading"
import { postData } from "../../services/FetchNodeServices"

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
    },
    row:{
        display:'flex',
        flexDirection:'row'
    }
})


export default function FoodItemsInterface(){
    const classes= useStyles()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
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
        setRestaurantId(admin.restaurantid)
    },[])

    const fillCategory=()=>{
        return category.map((item)=>{
          return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
        })
    }

    const handleIcon=(event)=>{
        setIcon({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
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
        var formData= new FormData()
        formData.append('restaurantid',restaurantId)
        formData.append('categoryid',categoryId)
        formData.append('fooditemname',foodItemName)
        formData.append('foodtype',foodType)
        formData.append('ingredients',ingredients)
        formData.append('price',price)
        formData.append('offerprice',offerPrice)
        formData.append('icon',icon.bytes)
        var result= await postData('fooditems/fooditems_submit',formData)
        if(result.status){
            Swal.fire({
                icon:'success',
                title:'Food Item registration',
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
        <div className={classes.root} >
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"Food Items Register"} myroute={'/admindashboard/displayallfooditems'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         value={restaurantId}
                         label="Restaurant Id"
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
                         label="Food Item Name" 
                         onChange={(event)=>setFoodItemName(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Food Type</FormLabel>
                                <RadioGroup 
                                  error={resError?.foodType?.error}
                                  onFocus={()=>handleError(false,'foodType','')}
                                  row onChange={(event)=>setFoodType(event.target.value)}>
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
                         label="Ingredients"
                         onChange={(event)=>setIngredients(event.target.value)} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         error={resError?.price?.error}
                         onFocus={()=>handleError(false,'price','')}
                         helperText={resError?.price?.message}
                         label="Price"
                         onChange={(event)=>setPrice(event.target.value)} fullWidth ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                         error={resError?.offerPrice?.error}
                         onFocus={()=>handleError(false,'offerPrice','')}
                         helperText={resError?.offerPrice?.message}
                         label="Offer Price"
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