import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer,CartesianGrid,Tooltip } from 'recharts';
import { useState,useEffect } from 'react';
import Title from './Title';
import { postData } from '../../services/FetchNodeServices';


// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}


export default function Chart() {
  const theme = useTheme();
  const [monthSale,setMonthSale]=useState([])

  const fetchMonthSaleData=async()=>{
       var result= await postData('billing/fetch_totalsale_month')
      var MonthSaleData= result.data.map((item)=>{
        const m=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
             return(createData(m[item.month],item.totalmonthsale.toFixed(2)))
       })
       setMonthSale(MonthSaleData)
  }

  useEffect(function(){
    fetchMonthSaleData()
  },[])

  return (
    <React.Fragment>
      <Title>MonthWise Sales</Title>
      <ResponsiveContainer>
        <LineChart
          data={monthSale}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" fill='#dff9fb' />
          <XAxis dataKey="time"  stroke={theme.palette.text.secondary}
                style={theme.typography.body2}>
               <Label angle={0} position='insideBottom' style={{textAnchor: 'middle',
                          fill: theme.palette.text.primary, ...theme.typography.body1,}}>
              Months
            </Label>
          </XAxis>
          <YAxis  stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label angle={270} position='insideLeft' style={{textAnchor: 'middle',
            fill: theme.palette.text.primary,
                ...theme.typography.body1,}}>
              Sales (&#8377;)
            </Label>
          </YAxis>
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"  
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}