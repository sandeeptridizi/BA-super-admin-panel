import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { getToken, isAdmin } from "./lib/auth";
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import DashboardPage from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Users from './pages/Users/Users';
import Leads from './pages/Leads/Leads';
import Employees from './pages/Employees/Employees';
import Financials from './pages/Financials/Financials';
import Enquiries from './pages/Enquiries/Enquiries';
import Settings from './pages/Settings/Settings';
import Activity from './pages/ActivityCenter/Activity';
import ProductCreation from './pages/ProductCreation/productcreation';
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductEdit from "./pages/ProductEdit/ProductEdit";
import CreateNewUser from "./pages/CreateNewUser/CreateNewUser";
import UserProfile from "./pages/UserProfile/UserProfile";
import LeadDetails from "./pages/LeadDetails/LeadDetails";
import AddLead from "./pages/AddLead/AddLead";
import EmployeeDetails from "./pages/EmployeeDetails/EmployeeDetails";
import CreateEmployee from "./pages/CreateEmployee/CreateEmployee";
import EnquiryDetails from "./pages/EnquiryDetails/EnquiryDetails";
import EmployeeDashboard from "./pages/EmloyeeDashboard/EmployeeDashboard";
import MobileNavbar from "./components/MobileNavbar/MobileNavbar";


const App = () => {
  return (
    <BrowserRouter>
      <MobileNavbar />
      <Routes>
        <Route path="/login" element={getToken() ? <Navigate to="/" replace /> : <Login />} />
        <Route path='/' element={getToken() ? <LandingPage /> : <Navigate to="/login" replace />}>
          <Route index element={<DashboardPage />} />
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='products' element={<Products />} />
          <Route path='users' element={<Users />} />
          <Route path='activity' element={<Activity />} />
          <Route path='leads' element={<Leads />} />
          <Route path='employees' element={isAdmin() ? <Employees /> : <Navigate to="/dashboard" replace />} />
          <Route path='financials' element={isAdmin() ? <Financials /> : <Navigate to="/dashboard" replace />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='settings' element={<Settings />} />
          <Route path='productcreation' element={<ProductCreation/>} />
          <Route path='productcreation/:mode' element={<ProductCreation/>} />
          <Route path='productpage/:id' element={<ProductPage/>} />
          <Route path='productedit/:id' element={<ProductEdit/>} />
          <Route path="create-user" element={<CreateNewUser />} />
          <Route path="userprofile/:id" element={<UserProfile />} />
          <Route path='leaddetails' element={ <LeadDetails /> } />
          <Route path="/addlead" element={<AddLead />} />
          <Route path="/employeedetails/:id" element={isAdmin() ? <EmployeeDetails /> : <Navigate to="/dashboard" replace />} />
          <Route path="/createemployee" element={isAdmin() ? <CreateEmployee /> : <Navigate to="/dashboard" replace />} />
          <Route path="/enquirydetails/:id" element={<EnquiryDetails />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
