import React,{useEffect, useState} from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { postData } from '../../services/FetchNodeServices';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  const [totalAmount,setTotalAmount]= useState('')
  const getCurrentDate=()=>{
      const date= new Date()
        const cd= date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
  }

  const getCurrentDateString=()=>{
    const date= new Date()
      const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const cd= d[date.getDay()]+","+m[(date.getMonth())]+" "+date.getDate()+" "+date.getFullYear()
      return cd
}

  const fetchTotalAmount=async()=>{
    var response= await postData('billing/fetch_todays_total',{'todaysdate':getCurrentDate()})
    if(response.data.todayssale==null){
      setTotalAmount(0)
    }
    else{
      setTotalAmount(response.data.todayssale)
    }
  }

   useEffect(function(){
      fetchTotalAmount()
   },[])

  return (
    <React.Fragment>
      <Title>Today's Sales</Title>
      <Typography component="p" variant="h4">
        &#8377; {parseFloat(totalAmount).toFixed(2)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {getCurrentDateString()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}