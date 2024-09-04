import { Paper,Grid } from "@mui/material"
import Chart from "../../components/DashboardComponent/Chart"
import Deposits from "../../components/DashboardComponent/Deposits"
import Orders from "../../components/DashboardComponent/Orders"

export default function Summary(props){
    return(
        <div>
            <Grid container spacing={3}>
              {/* Chart */}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',height: 240,}}>
                        <Chart />
                    </Paper>
                </Grid>
                {/*Deposists */ }
                <Grid item xs={12} md={4} lg={3}>
                <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 240,}}>
                  <Deposits />
                </Paper>
              </Grid>
               {/* Recent Orders */}
               <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Orders />
                  </Paper>
              </Grid>
            </Grid>
        </div>
     )
}