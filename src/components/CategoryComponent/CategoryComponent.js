import * as React from 'react';
import { useState,useEffect } from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Swal from 'sweetalert2';
import { Box, ListItemButton, Paper } from '@mui/material';
import { serverURL,postData } from '../../services/FetchNodeServices';
import FoodComponent from '../FoodComponent/FoodComponent';

export default function CategoryComponent(props) {
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [listCategory,setListCategory]= useState([])
    const [categoryId,setCategoryId]=useState('')
    const [open,setOpen]= useState(false)

    const fetchAllCategory=async()=>{
        var result=await postData('category/fetch_all_category',{restaurantid:admin.restaurantid})
        setListCategory(result.data)
    }

    useEffect(function(){
        fetchAllCategory()
    },[])

    const handleFoodListDialog=(categoryid)=>{
        setCategoryId(categoryid)
        if(props.foodOpen===true){
        setOpen(true)
        }
        else{
            Swal.fire('Please Select Table first')
        }
    }

    const showCategoryList=()=>{
        return listCategory.map((item)=>{ 
        return(
            <Paper elevation={3}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={()=>handleFoodListDialog(item.categoryid)} alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Cindy Baker" src={`${serverURL}/images/${item.icon}`} sx={{width:35,height:30}} />
                    </ListItemAvatar>
                    <ListItemText
                     primary={<span style={{fontFamily:'kanit',fontWeight:'bold'}}>{item.categoryname}</span>} />
                    </ListItemButton>
                    <Divider variant="inset" component="li" />
                </List>
            </Paper>)
        })
    }

  return (
    <Box sx={{width:"100%", maxWidth:360, bgcolor:'background.paper' }}>
        {showCategoryList()}
        <FoodComponent categoryid={categoryId} tableNo={props.tableNo} floorNo={props.floorNo} setOpen={setOpen} open={open} refresh={props.refresh} setRefresh={props.setRefresh} />
    </Box>    
  )
}