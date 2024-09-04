import React,{useState,useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {getData} from '../../services/FetchNodeServices'



export default function Orders() {
  const [recentOrders,setRecentOrders]=useState([])
  const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const fetchRecentBills=async()=>{
    var result=await getData('billing/fetch_recent_bills')
     setRecentOrders(result.data)
  }

  useEffect(function(){
    fetchRecentBills()
  },[])


  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size='small'>
        <TableHead>
          <TableRow>
             <TableCell>BillNo.</TableCell>
            <TableCell>Date/Time</TableCell>
            <TableCell>Waiter Name</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Floor/table</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
            <TableCell align='center'>Payment Mode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentOrders.map((item) => (
            <TableRow key={item.billno}>
              <TableCell>{item.billno}</TableCell>
              <TableCell>{new Date(item.billdate).getDate()+", "+m[(new Date(item.billdate).getMonth())]+" "+new Date(item.billdate).getFullYear()} ,Time:{item.billtime}</TableCell>
              <TableCell>{item.server}</TableCell>
              <TableCell>{item.customername}</TableCell>
              <TableCell>{item.tableno}</TableCell>
              <TableCell align="right">&#8377;{`${item.totalamount}`}</TableCell>
              <TableCell align='center'>{item.paymentmode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="http://localhost:3000/admindashboard/reports"  sx={{ mt: 3 }}>
       See more orders
      </Link>
    </React.Fragment>
  );
}