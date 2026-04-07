import './MobileNavbar.css';

import { HiMenu } from 'react-icons/hi';

import { getFile } from '../../lib/s3';
import { useState } from 'react';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiMessageSquare } from 'react-icons/fi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { GoPeople } from 'react-icons/go';
import { GoPerson } from 'react-icons/go';
import { LuDollarSign } from 'react-icons/lu';

import { Link, useLocation } from 'react-router-dom';
import { getUserType } from '../../lib/auth';

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

const EMPLOYEE_HIDDEN_LINKS = ['Employees', 'Financials'];

const isLinkActive = (pathname, link) => {
  const path = pathname.replace(/^\//, '');
  if (link === 'dashboard') return path === '' || path === 'dashboard';
  return path === link || path.startsWith(link + '/');
};

const MobileNavbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const location = useLocation();
  const isEmployee = getUserType() === 'employee';

  const visibleLinks = isEmployee
    ? linksData.filter((item) => !EMPLOYEE_HIDDEN_LINKS.includes(item.title))
    : linksData;

  return (
    <div className='mobile-navbar-container'>
      <img src={getFile("static/logo.png")} alt='company' className='mobile-logo' />
      <HiMenu
        className='mobile-menu-icon'
        onClick={() => setShowLinks(!showLinks)}
      />
      {showLinks && (
        <div
          className='mobile-nav-links-container'
          onClick={() => setShowLinks(!showLinks)}
        >
          {visibleLinks.map((item) => {
            const { id, icon, title, link } = item;
            const active = isLinkActive(location.pathname, link);
            return (
              <Link to={link} key={id}>
                <div
                  className={
                    active
                      ? 'mobile-link-container mobile-active-link'
                      : 'mobile-link-container'
                  }
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
