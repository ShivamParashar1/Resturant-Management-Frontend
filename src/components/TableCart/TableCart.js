import { Button, Divider, Grid, TextField } from "@mui/material"
import {useSelector,useDispatch} from "react-redux"
import Swal from 'sweetalert2'
import Plusminus from "../../components/Plusminus/Plusminus"
import { useState } from "react"
import { postData,serverURL } from "../../services/FetchNodeServices"
//////////////Razor pay////////////
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
///////////////////////////////////

export default function TableCart(props){
    /////////////////razorpay////////////
    const [Razorpay] = useRazorpay();
    //////////////////////////////////
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    const [customername,setCustomerName]=useState('')
    const [mobileno,setMobileNo]=useState('')

    var gst=parseInt(admin.gsttype)/2
    var dispatch=useDispatch()
    var foodOrder=useSelector((state)=>state.orderData)
    var foodList=[]
    if(props.tableNo.length!=1)
    {
    var cart=foodOrder[props.tableNo]
    if(cart!=undefined)
     var foodList=Object.values(cart)
    }

    var totalprice=foodList.reduce(calculateTotal,0)
    var totaloffer=foodList.reduce(calculateTotalOffer,0)

    function calculateTotal(item1,item2){
        return item1+(item2.price*item2.qty)
    }
    function calculateTotalOffer(item1,item2){
        var price=item2.offerprice>0?(item2.price*item2.qty):0
        return item1+(price-(item2.offerprice*item2.qty))
    }

    const handleQtyChange=(v,item)=>{
        var foodlist=foodOrder[props.tableNo]
        if(v==0){
               delete foodlist[item.fooditemid]
               foodOrder[props.tableNo]=foodlist
        }
        else{
            foodlist[item.fooditemid].qty=v 
            foodOrder[props.tableNo]=foodlist
        }
        dispatch({type:'ADD_ORDER',payload:[props.tableNo,foodOrder[props.tableNo]]})
        props.setRefresh(!props.refresh)
    }

    const getCurrentDate=()=>{
        var date=new Date()
        var cd=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
    }

    const getCurrentTime=()=>{
        var time=new Date()
        var ct=time.getHours()+":"+time.getMinutes()
        return ct
    }

    ////////////////////////Payment razer pay API////////////////
    const handlePayment = useCallback(async(na) => {
    
        const options = {
          key: "rzp_test_GQ6XaPC6gMPNwH",
          amount: na*100,
          currency: "INR",
          name: admin.restaurantname,
          description: "Online Payments",
          image: `${serverURL}/images/${admin.filelogo}`,
          handler: async(res) => {
            console.log(res);
            
          },
          prefill: {
            name: customername,
            email: "youremail@example.com",
            contact: mobileno,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
    
        const rzpay = new Razorpay(options);
        rzpay.open();
      }, [Razorpay]);

    /////////////////////////////////////////////////////////////

    const handleSave=async()=>{
        var body={billtime:getCurrentTime(), billdate:getCurrentDate(), tableno:props.tableNo, 
            server:props.waiterName, fssai: admin.fssai, cnote:'', gst:admin.gstno, 
            billingdetails:JSON.stringify(foodOrder[props.tableNo]), 
            totalamount:((totalprice-totaloffer)+(totalprice-totaloffer)*admin.gsttype/100).toFixed(2), 
            customername, mobileno}
        var response=await postData('billing/bill_submit',body)
        if(response.status){
            Swal.fire({
                title: 'Are you sure to Save the Bill?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Saved!',
                    'Your Bill Saved Successfully',
                    'success'
                  )
                  dispatch({type:'DELETE_ORDER',payload:[props.tableNo]})
                  props.setRefresh(!props.refresh)
                }
              })
        }
    }
    
    const showFoodList=()=>{
        return foodList?.map((item,index)=>{
            return(
                <>
                    <Grid item xs={1} >{index+1}</Grid>
                    <Grid item xs={3}>{item?.fooditemname}</Grid>
                    <Grid item xs={2} style={{textAlign:'right'}}>&#8377;{item?.price}</Grid>
                    <Grid item xs={2} style={{textAlign:'right'}}>&#8377;{item?.offerprice}</Grid>
                    <Grid item xs={2} style={{display:'flex',justifyContent:'right'}}><Plusminus onChange={(v)=>handleQtyChange(v,item)} qty={item?.qty}/></Grid>
                    <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>&#8377;{item?.offerprice>0?item?.offerprice*item?.qty:item?.price*item?.qty}</Grid>
                </>
            )
        })  
    } 

    const showTotalBill=()=>{
        return(
            <>
                <Grid item xs={12}><Divider/></Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>Total Amount:</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{totalprice}</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>Discount:</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{totaloffer}</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>Net Amount:</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{totalprice-totaloffer}</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>CGST ({gst}%):</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{(totalprice-totaloffer)*gst/100}</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>SGST ({gst}%):</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{(totalprice-totaloffer)*gst/100}</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',fontSize:16}}>Payable Amount:</Grid>
                <Grid item xs={6} style={{fontWeight:'bold',textAlign:'right'}}>&#8377;{((totalprice-totaloffer)+(totalprice-totaloffer)*admin.gsttype/100).toFixed(2)}</Grid>
                <Grid item xs={12}><Divider/></Grid>
                <Grid item xs={6}>
                    <Button onClick={()=>handlePayment(((totalprice-totaloffer)+(totalprice-totaloffer)*admin.gsttype/100).toFixed(2))} style={{display:'flex',marginRight:'auto'}} variant='contained' color='primary'>Payment Online</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleSave} style={{display:'flex',marginLeft:'auto'}} variant='contained' color='primary'>Save & Print</Button>
                </Grid>
            </>
        )
    }

    const heading=()=>{
        return(
            <div>
                <Grid container spacing={1} style={{fontFamily:'kanit'}}>
                    <Grid item xs={6}><TextField onChange={(event)=>setCustomerName(event.target.value)} label="Customer Name" variant='standard'></TextField></Grid>
                    <Grid item xs={6}><TextField onChange={(event)=>setMobileNo(event.target.value)} label="Mobile No" variant='standard'></TextField></Grid>
                    <Grid item xs={12}><Divider/></Grid>
                    <Grid item xs={1} style={{fontWeight:'bold'}}>Sn</Grid>
                    <Grid item xs={3} style={{fontWeight:'bold'}}>Name</Grid>
                    <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>Rate</Grid>
                    <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>Offer</Grid>
                    <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>Quantity</Grid>
                    <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>Amount</Grid>
                    <Grid item xs={12}><Divider/></Grid>
                    {showFoodList()}
                    {showTotalBill()}
                </Grid>
            </div>
        )
    }
    
    return(
        <div>
            {heading()}
        </div>
    )
}