import { makeStyles } from "@mui/styles";
import { Avatar,Paper,Grid,AppBar,Toolbar,Box,Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import BallotIcon from '@mui/icons-material/Ballot';
import CountertopsIcon from '@mui/icons-material/Countertops';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Logout } from "@mui/icons-material";
import { Route,Routes,Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import CategoryInterface from '../category/CategoryInterface'
import DisplayAllCategory from '../category/DisplayAllCategory'
import FoodItemsInterface from '../foodItems/FoodItemsInterface'
import DisplayAllFoodItems from '../foodItems/DisplayAllFoodItems'
import TableBookingInterface from '../tablebooking/TableBookingInterface'
import DisplayAllTables from '../tablebooking/DisplayAllTables'
import WaiterInterface from '../waiters/WaiterInterface'
import DisplayAllWaiter from '../waiters/DisplayAllWaiter'
import WaiterTableInterface from '../waitertable/WaiterTableInterface'
import DisplayAllWaiterTable from '../waitertable/DisplayAllWaiterTable'
import FoodBooking from '../FoodBooking/FoodBooking'
import Reports from "../Reports/Reports";
import { serverURL } from "../../services/FetchNodeServices";
import Summary from "./Summary";

const useStyles= makeStyles({
  leftBarStyle:{
    padding:5,
    display:"flex",
    flexDirection:'column',
    justifyContent:"center",
    alignItems:"center",
    margin:10,
    
  },
  nameStyle:{
    fontFamily:'Kanit',
    fontSize:16,
    fontWeight:'bold',
    marginTop:5,
    marginBottom:2,
    color:'black'
  },
  phoneStyle:{
    fontFamily:'Kanit',
    fontSize:12,
    fontWeight:'bold',
    color:'#636e72'
 
   },
   emailStyle:{
    fontFamily:'Kanit',
    fontSize:12,
    fontWeight:'bold',
    color:'#636e72'
   },
    menuStyle:{
     display:'flex',
     justifyContent:'left',
     width:250,
    
   },
   menuItemStyle:{
    fontFamily:'Kanit',
    fontSize:16,
    fontWeight:'bold'
   }
})

export default function Dashboard(props){
  const classes= useStyles(props)
  const navigate= useNavigate()
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  const handleLogout=()=>{
    localStorage.clear()
    navigate('/adminlogin')
  }
    return(
        <Box >
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div" >
            {admin.restaurantname}
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spaces={3}  >
        <Grid item xs={2} style={{marginTop:50}} >
          <Paper  className={classes.leftBarStyle}>
          <img src={`${serverURL}/images/${admin.filelogo}`} variant="rounded" width='100'/>
              <div className={classes.nameStyle}>{admin.ownername}</div>
              <div className={classes.emailStyle}>{admin.emailid}</div>
              <div className={classes.phoneStyle}>+91{admin.mobileno}</div>
              <div className={classes.menuStyle}>
              <List>
              <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/summary')}>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Dashboard</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/displayallcategory')}>
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Category List</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/displayallfooditems')}>
                    <ListItemIcon>
                      <BrunchDiningIcon/>
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>foodItems List</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/displayalltables')}>
                    <ListItemIcon>
                      <TableRestaurantIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Table List</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaiter')}>
                    <ListItemIcon>
                      <BallotIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Waiter List</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaitertable')}>
                    <ListItemIcon>
                      <CountertopsIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Waiter Table List</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/foodbooking')}>
                    <ListItemIcon>
                      <ReceiptLongIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Billing</span>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={()=>navigate('/admindashboard/reports')}>
                    <ListItemIcon>
                      <AssessmentIcon />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Sale Reports</span>} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="middle"/>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                     <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>} />
                  </ListItemButton>
                </ListItem>
                </List>
              </div>
          </Paper>
        </Grid>
         <Grid item xs={10} style={{background:'#dfe4ea',marginTop:55,padding:10}}>
          <Routes>
              <Route element={<Navigate to="/admindashboard/summary" replace={true}/>} path="/" />
              <Route element={<CategoryInterface/>} path='/categoryinterface' />
              <Route element={<DisplayAllCategory/>} path='/displayallcategory' />  
              <Route element={<FoodItemsInterface/>} path='/fooditemsinterface' />
              <Route element={<DisplayAllFoodItems/>} path='/displayallfooditems' />  
              <Route element={<TableBookingInterface/>} path='/tablebookinginterface' />
              <Route element={<DisplayAllTables/>} path='/displayalltables' />  
              <Route element={<WaiterInterface/>} path='/waiterinterface' />
              <Route element={<DisplayAllWaiter/>} path='/displayallwaiter' />  
              <Route element={<WaiterTableInterface/>} path='/waitertableinterface' />
              <Route element={<DisplayAllWaiterTable/>} path='/displayallwaitertable' />  
              <Route element={<FoodBooking/>} path='/foodbooking' />  
              <Route element={<Reports/>} path="/reports" />
              <Route element={<Summary/>} path="/summary" />
          </Routes>    
         </Grid>
      </Grid>
    </Box>
    )
}