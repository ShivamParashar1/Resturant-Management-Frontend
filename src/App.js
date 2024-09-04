import './App.css';
import LoginPage from './screens/superadmin/LoginPage'
import Dashboard from './screens/superadmin/Dashboard';
import AdminLoginPage from './screens/admin/LoginPage'
import AdminDashboard from './screens/admin/Dashboard'
import FoodBooking from './screens/FoodBooking/FoodBooking';
import Reports from './screens/Reports/Reports';
import { Navigate,BrowserRouter as Router,Route,Routes  } from 'react-router-dom';

function App() {
  return (
          <div>
            <Router>
              <Routes>
                <Route element={<LoginPage/>} path="/loginpage" />
                <Route path="/" element={<Navigate to="/adminlogin" replace={true} />}></Route>
                <Route element={<Dashboard/>} path="/dashboard/*" />
                <Route element={<AdminLoginPage/>} path="/adminlogin" />
                <Route element={<AdminDashboard/>} path="/admindashboard/*" />
                <Route element={<Reports/>} path="reports" />
              </Routes>
            </Router>
          </div>
      );
}

export default App;
