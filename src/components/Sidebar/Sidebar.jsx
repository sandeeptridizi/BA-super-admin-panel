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
<<<<<<< HEAD
import { FiActivity } from "react-icons/fi";

=======
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b

const linksData = [
  {
    id: 1,
    icon: <LuLayoutDashboard />,
    title: 'Dashboard',
    link: '/',
  },
<<<<<<< HEAD
   {
    id: 2,
    icon: <FiActivity />,
    title: 'Activity Center',
    link: 'activity',
  },
  {
    id: 3,
=======
  {
    id: 2,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <FiShoppingBag />,
    title: 'Products',
    link: 'products',
  },
  {
<<<<<<< HEAD
    id: 4,
=======
    id: 3,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <GoPeople />,
    title: 'Users',
    link: 'users',
  },
  {
<<<<<<< HEAD
    id: 5,
=======
    id: 4,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <FiTarget />,
    title: 'Leads',
    link: 'leads',
  },
  {
<<<<<<< HEAD
    id: 6,
=======
    id: 5,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <RxPerson />,
    title: 'Employees',
    link: 'employees',
  },
  {
<<<<<<< HEAD
    id: 7,
=======
    id: 6,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <LuDollarSign />,
    title: 'Financials',
    link: 'financials',
  },
  {
<<<<<<< HEAD
    id: 8,
=======
    id: 7,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
    icon: <LuMessageSquare />,
    title: 'Enquiries',
    link: 'enquiries',
  },
  {
<<<<<<< HEAD
    id: 9,
=======
    id: 8,
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
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
