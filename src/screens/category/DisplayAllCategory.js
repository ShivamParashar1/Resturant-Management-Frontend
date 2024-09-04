import { useState,useEffect } from "react"
import { Button,Dialog,DialogActions,DialogContent,Avatar,Grid,TextField, } from "@mui/material"
import { makeStyles } from "@mui/styles"
import Swal from "sweetalert2"
import { UploadFile } from "@mui/icons-material";
import MaterialTable from "@material-table/core"
import Heading from "../../components/heading/Heading"
import { serverURL,getData,postData } from "../../services/FetchNodeServices"
import { useNavigate } from "react-router-dom";

var useStyles= makeStyles({
    root:{
        width:"auto",
        height:"auto",
        background:"#dfe4ea",
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
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

export default function DisplayAllCategory(){
    var classes= useStyles()
    var navigate= useNavigate()
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listCategory,setListCategory]= useState([])
    const [open,setOpen]= useState(false)

    ////////////////////Category Data////////////
    const [restaurantId,setRestaurantId]= useState("");
    const [categoryName,setCategoryName]= useState("")
    const [categoryId,setCategoryId]= useState("");
    const [categoryIcon,setCategoryIcon]= useState({url:'',bytes:''})
    const [categoryError,setCategoryError]= useState({}) 
    const [btnStatus,setButtonStatus]= useState(false)
    const [tempFile,setTempFile]= useState({icon:''})

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
        setButtonStatus(true)
        console.log("cc",categoryError)
    }

    const handleSubmit=async()=>{
        if(validation()){
        var body={'restaurantid':restaurantId,'categoryname':categoryName,'categoryid':categoryId}
        var result=await postData('category/category_edit_data',body)
        if(result.status){
            Swal.fire({
               icon:'success',
               title:'Category registration',
               text:result.message
            })
            setOpen(false)
         }
         else{
            Swal.fire({
               icon:'error',
               title:'Oops...',
               text:result.message
            })
            setOpen(false)
         }
    }
    fetchAllCategory()
}
    
   ///////////////////////////////////////////////

   const handleClose=()=>{
    setButtonStatus(false)
      setCategoryIcon({url:tempFile.icon})
   }

   const editImage=async()=>{
    var formData= new FormData()
    formData.append('categoryid',categoryId)
    formData.append('icon',categoryIcon.bytes)
    var result=await postData('category/category_edit_icon',formData)
    if(result.status){
      Swal.fire({
         icon:'success',
         title:'Category registration',
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
   
   const editDeleteButton=()=>{
    return(<div>
        <Button onClick={editImage}>Edit</Button>
        <Button onClick={handleClose}>Close</Button>
    </div>)
  }
   
    const fetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid})
        setListCategory(result.data)
    }


    useEffect(function(){
        fetchAllCategory()
    },[])

    const handleDelete=async(rowData)=>{
        Swal.fire({
            icon: 'warning',
            title: 'Do You Want To Delete Category?',
            showDenyButton: true,
            confirmButtonText: 'Yes Delete it',
            confirmButtonColor:'rgb(14 155 36)',
            denyButtonText: `Don't Delete`,
          }).then(async(result) => {
            if (result.isConfirmed) {
               var body={'categoryid':rowData.categoryid}
               var result=await postData('category/category_delete',body)
               if(result.status){
                  Swal.fire('Category Deleted!', result.message, 'success')
                  fetchAllCategory()
               }
               else{
                  Swal.fire('Fail!', result.message, 'error')
               }
            } else if (result.isDenied) {
              Swal.fire('Category Not Deleted', 'Your Data is Safe', 'error')
            }
          })
       }



    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setCategoryName(rowData.categoryname)
        setCategoryId(rowData.categoryid)
        setCategoryIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
        setTempFile({icon:`${serverURL}/images/${rowData.icon}`})
        setOpen(true)
    }

    const showData=()=>{
        return(
            <div>
                <div >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Heading title={"Category Register"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                             label="Restaurant id" value={restaurantId}
                             disabled fullWidth></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                            error={categoryError?.categoryName?.error}
                            onFocus={()=>handleError(false,'categoryName','')}
                            helperText={categoryError?.categoryName?.message}
                            label="Category Name" value={categoryName}
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
                            sx={{ width: 76, height: 66 }} />
                             <div>
                                {btnStatus?editDeleteButton():<></>}
                            </div>
                        </Grid>
                    </Grid>
                </div>
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
               title="Category List"
               columns={[
                { title: 'Restaurant Id/Name',
                 render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></>},
                { title: 'Category Name', 
                 render:rowData=><><div>{rowData.categoryname}</div></> },
                { title: 'Category Icon', 
                 render:rowData=><><div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:45,height:45,borderRadius:10}}/></div></>},
                ]}
              data={listCategory}  
              options={{
                paging:true,
                pageSize:4,
                emptyRowsWhenPaging:false,
                pageSizeOptions:[4,5,7]
            }}        
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Category',
                  onClick: (event, rowData) => handleEdit(rowData)
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete Category',
                  onClick: (event, rowData) => handleDelete(rowData)
                },
                {
                    icon: 'add',
                    tooltip: 'Add Category',
                    isFreeAction:true,
                    onClick: (event, rowData) => navigate('/admindashboard/categoryinterface')
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