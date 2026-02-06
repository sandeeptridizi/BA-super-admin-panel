import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className='landing-page-container'>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default LandingPage;
