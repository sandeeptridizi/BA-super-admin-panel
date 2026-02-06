import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Users from './pages/Users/Users';
import Leads from './pages/Leads/Leads';
import Employees from './pages/Employees/Employees';
import Financials from './pages/Financials/Financials';
import Enquiries from './pages/Enquiries/Enquiries';
import Settings from './pages/Settings/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />}>
          <Route index element={<DashboardPage />} />
          <Route path='products' element={<Products />} />
          <Route path='users' element={<Users />} />
          <Route path='leads' element={<Leads />} />
          <Route path='employees' element={<Employees />} />
          <Route path='financials' element={<Financials />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='settings' element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
