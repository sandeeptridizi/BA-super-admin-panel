import './Sidebar.css';

import { Link, useLocation } from 'react-router-dom';
import { getUserType, clearAuth } from '../../lib/auth';

import { getFile } from '../../lib/s3';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { RxPerson } from 'react-icons/rx';
import { LuDollarSign } from 'react-icons/lu';
import { LuMessageSquare } from 'react-icons/lu';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiActivity } from 'react-icons/fi';


const linksData = [
  {
    id: 1,
    icon: <LuLayoutDashboard />,
    title: 'Dashboard',
    link: 'dashboard',
  },
  {
    id: 2,
    icon: <FiActivity />,
    title: 'Activity Center',
    link: 'activity',
  },
  {
    id: 3,
    icon: <FiShoppingBag />,
    title: 'Products',
    link: 'products',
  },
  {
    id: 4,
    icon: <GoPeople />,
    title: 'Users',
    link: 'users',
  },
  {
    id: 6,
    icon: <RxPerson />,
    title: 'Employees',
    link: 'employees',
  },
  {
    id: 7,
    icon: <LuDollarSign />,
    title: 'Financials',
    link: 'financials',
  },
  {
    id: 9,
    icon: <LuMessageSquare />,
    title: 'Enquiries',
    link: 'enquiries',
  },
  {
    id: 10,
    icon: <IoSettingsOutline />,
    title: 'Settings',
    link: 'settings',
  },
];

const EMPLOYEE_HIDDEN_LINKS = ['Employees', 'Financials'];

const isLinkActive = (pathname, link) => {
  const path = pathname.replace(/^\//, '');
  if (link === 'dashboard') return path === '' || path === 'dashboard';
  return path === link || path.startsWith(link + '/');
};

const Sidebar = () => {
  const location = useLocation();
  const userType = getUserType();
  const isEmployee = userType === 'employee';

  const visibleLinks = isEmployee
    ? linksData.filter((item) => !EMPLOYEE_HIDDEN_LINKS.includes(item.title))
    : linksData;

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className='sidebar-container'>
      <div className='sibebar-logo-container'>
        <img
          src={getFile("static/logo.png")}
          alt='Billionaire Auction'
          className='company-logo'
        />
      </div>
      <div className='sidebar-links-container'>
        {visibleLinks.map((item) => {
          const { id, icon, title, link } = item;
          const active = isLinkActive(location.pathname, link);
          return (
            <Link to={link} key={id}>
              <div
                className={
                  active
                    ? 'link-container active-link'
                    : 'link-container'
                }
              >
                <span className='link-icon'>{icon}</span>
                <span className='link-title'>{title}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className='sidebar-admin-logout-container'>
        <div className='admin-container'>
          <div className='admin-icon-container'>{isEmployee ? 'EM' : 'SA'}</div>
          <div className='admin-content-container'>
            <p className='admin-title'>{isEmployee ? 'Employee' : 'Super Admin'}</p>
          </div>
          <div className='admin-online-container'></div>
        </div>
      </div>
      <div className='logout-container' onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <MdLogout className='logout-icon' /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
