import {useState, useEffect} from 'react'
import { useStyles } from './ReportsCss'
import { Grid,Button} from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import MaterialTable from '@material-table/core';
import { postData } from '../../services/FetchNodeServices';

export default function Reports(props){
    var classes= useStyles()
    var todaydate=new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()
    const [listBill,setListBill]=useState([])
    const [totalAmount,setTotalAmount]= useState('')
    const [fromDate,setFromDate]= useState(todaydate)
    const [toDate,setToDate]= useState(todaydate)

    useEffect(function(){
        fetchAllBills()
        fetchTotalAmount()
    },[])

    const handleBillFetch=()=>{
        fetchAllBills()
        fetchTotalAmount()
    }
    const fetchTotalAmount=async()=>{
        var fdate= new Date(fromDate)
        var tdate= new Date(toDate)
        var fromdate= fdate.getFullYear()+"/"+(fdate.getMonth()+1)+"/"+fdate.getDate()
        var todate= tdate.getFullYear()+"/"+(tdate.getMonth()+1)+"/"+tdate.getDate()
        var body={'fromDate':fromdate,'toDate':todate}
        var response= await postData('billing/fetch_total',body)
        if(response.data.totalsale==null){
            setTotalAmount(0)
          }
          else{
            setTotalAmount(response.data.totalsale)
          }
    }

    const fetchAllBills=async()=>{
       var fdate= new Date(fromDate)
       var tdate= new Date(toDate)
       var fromdate= fdate.getFullYear()+"/"+(fdate.getMonth()+1)+"/"+fdate.getDate()
       var todate= tdate.getFullYear()+"/"+(tdate.getMonth()+1)+"/"+tdate.getDate()
       var body={'fromDate':fromdate,'toDate':todate}
       var response= await postData('billing/fetch_all_bill',body)
       setListBill(response.data)
    }

    return(
        <div className={classes.root}>
        <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={2} style={{display:'flex',alignItems:'center',flexDirection:'column',fontFamily:'kanit',fontSize:18,fontWeight:'bold'}} >
                     <div>
                        Total Sales
                     </div>
                     <div style={{fontSize:24}}>
                        &#8377; {parseFloat(totalAmount).toFixed(2)}
                     </div>
                </Grid>
                <Grid item xs={4} style={{display:'flex',alignItems:'center'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker format="DD/MM/YYYY"
                                value={dayjs(fromDate)}
                                onChange={(newdate)=>setFromDate(newdate)}
                                slotProps={{ textField: { fullWidth: true } }}
                                label="From Date" />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid> 
                <Grid item xs={4} style={{display:'flex',alignItems:'center'}}>  
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} >
                            <DatePicker format="DD/MM/YYYY"
                                value={dayjs(toDate)}
                                onChange={(newdate)=>setToDate(newdate)}
                                slotProps={{ textField: { fullWidth: true } }}
                                label="To Date" />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid> 
                <Grid item xs={2} style={{display:'flex',alignItems:'center'}}>
                    <Button onClick={handleBillFetch} variant='contained' fullWidth>Search</Button></Grid>   
            </Grid>    
        </div>
        <div className={classes.box}>
            <MaterialTable
                title="Billing Details"
                columns={[
                    { title: 'BillNo', field: 'billno' },
                    { title: 'Bill Time/Date',
                    render:rowData=><div>{new Date(rowData.billdate).toLocaleDateString()}, Time:{rowData.billtime}</div>},
                    { title: 'Customer Name', field: 'customername' },
                    { title: 'Server Name', field: 'server' },
                    { title: 'Amount', 
                    render:rowData=><>&#8377;{parseFloat(rowData.totalamount).toFixed(2)}</>},  
                    { title: 'Payment Mode', field: 'paymentmode' }, 
                ]}
                data={listBill}   
                options={{
                    paging:true,
                    pageSize:3,
                    emptyRowsWhenPaging:false,
                    pageSizeOptions:[3,5,7]
                }}     
                actions={[
                {
                icon: 'save',
                tooltip: 'Save User',
                onClick: (event, rowData) => alert("You saved " + rowData.name)
                }
            ]}
        />                      
        </div>
    </div>
    )
}