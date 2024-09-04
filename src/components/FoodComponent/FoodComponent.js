import * as React from 'react';
import { useState,useEffect } from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box, ListItemButton,Dialog,DialogActions,DialogContent,Button, TextField } from '@mui/material';
import { serverURL,postData } from '../../services/FetchNodeServices';
import {useSelector,useDispatch} from 'react-redux'

export default function FoodComponent(props) {
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    var dispatch=useDispatch()
    var foodOrder=useSelector((state)=>state.orderData)
    const [listFood,setListFood]= useState([])
    const [tempListFood,setTempListFood]= useState([])
    const [order,setOrder]= useState([])
    

    const fetchAllFood=async()=>{
        var result=await postData('fooditems/fetch_all_fooditems_categorywise',{restaurantid:admin.restaurantid,categoryid:props.categoryid})
        setListFood(result.data)
        setTempListFood(result.data)
    }

    const searchFood=(event)=>{
        var temp= tempListFood.filter((item)=>item.fooditemname.toLowerCase().includes(event.target.value.toLowerCase()))
         setListFood(temp)
    }

    const handleOrder=(item)=>{
        var key=`#${props.floorNo}${props.tableNo}`
        try{
            var foodlist=foodOrder[key]
            try{ 
               foodlist[item.fooditemid].qty=foodlist[item.fooditemid].qty+1
            }
            catch{
            item.qty=1
            foodlist[item.fooditemid]=item
            foodOrder[key]=foodlist
            }
        }
        catch(e){
            var foodlist={}
            item.qty=1
            foodlist[item.fooditemid]=item
            foodOrder[key]={...foodlist}
        }
        console.log(foodOrder)
        dispatch({type:'ADD_ORDER',payload:[key,foodOrder[key]]})
        props.setRefresh(!props.refresh)
    }

    useEffect(function(){
        fetchAllFood()
    },[props])

    const handleDialogClose=()=>{
        props.setOpen(false)
      }

    const showFoodDialog=()=>{
        return(
        <Dialog open={props.open} maxWidth={'sm'}>
            <DialogContent>
                 <TextField fullWidth onChange={(event)=>searchFood(event)} label="Search food items...." variant='standard'/>
                 {showFoodList()}
            </DialogContent>
            <DialogActions>
                  <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
        )
    }

    const showFoodList=()=>{
        return listFood.map((item)=>{ 
        return(
            <div >
                <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={()=>handleOrder(item)} sx={{height:30,display:'flex',alignItems:'center',padding:3}} alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Cindy Baker" src={`${serverURL}/images/${item.icon}`} sx={{width:35,height:30}} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<span style={{fontFamily:'kanit'}}>{item.fooditemname}</span>}
                        secondary={item.offerprice>0?<span><s>&#8377;{item.price}</s> <b>&#8377;{item.offerprice}</b></span>:<b>&#8377;{item.price}</b>}
                        />
                    </ListItemButton>
                </List>
            </div>)
        })
    }

  return (
    <Box sx={{width:"100%", maxWidth:360, bgcolor:'background.paper' }}>
        {showFoodDialog()}
    </Box>    
  )
}