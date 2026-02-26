import './MobileNavbar.css';

import { HiMenu } from 'react-icons/hi';

import companyLogo from '../../assets/company-logo.png';
import { useState } from 'react';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { FiMessageSquare } from 'react-icons/fi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { GoPeople } from 'react-icons/go';
import { GoPerson } from 'react-icons/go';
import { LuDollarSign } from 'react-icons/lu';

import { Link } from 'react-router-dom';

const linksData = [
  {
    id: 1,
    icon: <LuLayoutDashboard />,
    title: 'Dashboard',
    link: 'dashboard',
  },
  {
    id: 2,
    icon: <TbActivityHeartbeat />,
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
    icon: <GoPerson />,
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
    id: 8,
    icon: <FiMessageSquare />,
    title: 'Enquiries',
    link: 'enquiries',
  },
  {
    id: 9,
    icon: <IoSettingsOutline />,
    title: 'Settings',
    link: 'settings',
  },
];

const MobileNavbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [activeLink, setActiveLink] = useState(
    linksData[0].title.toLowerCase(),
  );

  return (
    <div className='mobile-navbar-container'>
      <img src={companyLogo} alt='company' className='mobile-logo' />
      <HiMenu
        className='mobile-menu-icon'
        onClick={() => setShowLinks(!showLinks)}
      />
      {showLinks && (
        <div
          className='mobile-nav-links-container'
          onClick={() => setShowLinks(!showLinks)}
        >
          {linksData.map((item) => {
            const { id, icon, title, link } = item;
            return (
              <Link to={link}>
                <div
                  className={
                    activeLink === title.toLowerCase()
                      ? 'mobile-link-container mobile-active-link'
                      : 'mobile-link-container'
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
      )}
    </div>
  );
};

export default MobileNavbar;
