import './Sidebar.css';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getUserType, clearAuth } from '../../lib/auth';

import companyLogo from '../../assets/company-logo.png';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { FiTarget } from 'react-icons/fi';
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
    id: 5,
    icon: <FiTarget />,
    title: 'Leads',
    link: 'leads',
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

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('');
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
          src={companyLogo}
          alt='Billionaire Auction'
          className='company-logo'
        />
      </div>
      <div className='sidebar-links-container'>
        {visibleLinks.map((item) => {
          const { id, icon, title, link } = item;
          return (
            <Link to={link}>
              <div
                className={
                  activeLink === title.toLowerCase()
                    ? 'link-container active-link'
                    : 'link-container'
                }
                key={id}
                onClick={() => setActiveLink(title.toLowerCase())}
              >
                {icon} {title}
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
