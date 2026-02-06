import './Sidebar.css';

import { Link } from 'react-router-dom';
import { useState } from 'react';

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

const linksData = [
  {
    id: 1,
    icon: <LuLayoutDashboard />,
    title: 'Dashboard',
    link: '/',
  },
  {
    id: 2,
    icon: <FiShoppingBag />,
    title: 'Products',
    link: 'products',
  },
  {
    id: 3,
    icon: <GoPeople />,
    title: 'Users',
    link: 'users',
  },
  {
    id: 4,
    icon: <FiTarget />,
    title: 'Leads',
    link: 'leads',
  },
  {
    id: 5,
    icon: <RxPerson />,
    title: 'Employees',
    link: 'employees',
  },
  {
    id: 6,
    icon: <LuDollarSign />,
    title: 'Financials',
    link: 'financials',
  },
  {
    id: 7,
    icon: <LuMessageSquare />,
    title: 'Enquiries',
    link: 'enquiries',
  },
  {
    id: 8,
    icon: <IoSettingsOutline />,
    title: 'Settings',
    link: 'settings',
  },
];

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(
    linksData[0].title.toLowerCase(),
  );

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
        {linksData.map((item) => {
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
          <div className='admin-icon-container'>SA</div>
          <div className='admin-content-container'>
            <p className='admin-title'>Super Admin</p>
            <p className='admin-mail'>admin@billionaire.com</p>
          </div>
          <div className='admin-online-container'></div>
        </div>
      </div>
      <div className='logout-container'>
        <MdLogout className='logout-icon' /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
