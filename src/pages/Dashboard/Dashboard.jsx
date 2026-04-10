import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCubeOutline } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import { LuTarget } from 'react-icons/lu';
import { BsCurrencyRupee } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { FiHome } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';
import { RiSofaFill } from 'react-icons/ri';
import { FiWatch } from 'react-icons/fi';
import { PiPaintBrushBold } from 'react-icons/pi';
import { BsBank } from 'react-icons/bs';
import { GoTrophy } from 'react-icons/go';
import { BsThreeDots } from 'react-icons/bs';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { IoMdTime } from 'react-icons/io';
import { BsLightningCharge } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa6';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { BsStars } from 'react-icons/bs';
import { LuAward } from 'react-icons/lu';
import { LuCrown } from 'react-icons/lu';
import { RiCoupon3Line } from 'react-icons/ri';

import api from '../../lib/api';
import { getUsers } from '../../lib/users';
import { getEnquiryStats } from '../../lib/enquiries';
import { getEmployees } from '../../lib/employees';
import { getAdvertisements } from '../../lib/advertisements';
import { isAdmin } from '../../lib/auth';

const categoryIcons = {
  REAL_ESTATE: <FiHome />,
  CARS: <FaCarSide />,
  FURNITURE: <RiSofaFill />,
  JEWELLERY_AND_WATCHES: <FiWatch />,
  ARTS_AND_PAINTINGS: <PiPaintBrushBold />,
  ANTIQUES: <BsBank />,
  COLLECTABLES: <GoTrophy />,
};

const categoryLabels = {
  REAL_ESTATE: 'Real Estate',
  CARS: 'Cars',
  FURNITURE: 'Furniture',
  JEWELLERY_AND_WATCHES: 'Jewellery & Watches',
  ARTS_AND_PAINTINGS: 'Arts & Paintings',
  ANTIQUES: 'Antiques',
  COLLECTABLES: 'Collectables',
};

const catStyleIndex = ['', '1', '2', '3', '4', '5', '6', '7'];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeLeads: 0,
    totalEmployees: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0,
    featuredCount: 0,
    recommendedCount: 0,
    auctionCount: 0,
    activeAds: 0,
    categoryCounts: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes, enquiryStats, employeesRes, pendingRes, featuredRes, recommendedRes, auctionRes, revenueRes, adsRes] = await Promise.all([
          api.get('/api/product').catch(() => ({ data: { data: [] } })),
          getUsers().catch(() => ({ data: [] })),
          getEnquiryStats().catch(() => ({})),
          getEmployees().catch(() => ({ data: [] })),
          api.get('/api/product', { params: { approvalStatus: 'PENDING' } }).catch(() => ({ data: { data: [] } })),
          api.get('/api/product', { params: { isFeatured: 'true', approvalStatus: 'APPROVED' } }).catch(() => ({ data: { data: [] } })),
          api.get('/api/product', { params: { isRecommended: 'true', approvalStatus: 'APPROVED' } }).catch(() => ({ data: { data: [] } })),
          api.get('/api/product', { params: { approvalStatus: 'APPROVED' } }).catch(() => ({ data: { data: [] } })),
          api.get('/api/revenue/stats').catch(() => ({ data: { data: {} } })),
          getAdvertisements({ status: 'ACTIVE' }).catch(() => ({ data: [] })),
        ]);

        const allProducts = productsRes.data?.data || [];
        const ads = adsRes?.data || [];
        const users = usersRes.data || [];
        const employees = employeesRes.data || [];
        const pending = pendingRes.data?.data || [];
        const featured = featuredRes.data?.data || [];
        const recommended = recommendedRes.data?.data || [];
        const approved = auctionRes.data?.data || [];
        const auctions = approved.filter(p => p.listingType === 'AUCTIONS');

        const totalNewEnquiries = enquiryStats?.new || 0;
        const totalInProgress = enquiryStats?.inProgress || 0;
        const monthlyRevenuePaise = revenueRes.data?.data?.monthlyRecurring || 0;

        const categoryCounts = {};
        allProducts.forEach(p => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });

        setStats({
          totalProducts: allProducts.length,
          totalUsers: users.length,
          activeLeads: totalNewEnquiries + totalInProgress,
          totalEmployees: employees.length,
          monthlyRevenue: monthlyRevenuePaise,
          pendingApprovals: pending.length,
          featuredCount: featured.length,
          recommendedCount: recommended.length,
          auctionCount: auctions.length,
          activeAds: ads.length,
          categoryCounts,
        });
      } catch (err) {
        console.error('Dashboard data fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fmt = (n) => (loading ? '...' : n.toLocaleString('en-IN'));

  const categoryEntries = Object.entries(categoryLabels);

  return (
    <div className='dashboardcontainer'>
      <div className='activityheader'>
        <h1 className='activityheadline'>
          <span className='gradient-text'>Dashboard</span>
        </h1>
        <p className='activitydesc'>
          Real-time analytics and insights for your auction platform
        </p>
      </div>
      <div className='dashboardinsights'>
        <div className='dashinsight' onClick={() => navigate('/products')}>
          <div className='dashinsightrow'>
            <p>Total Products</p>
            <span>
              <IoCubeOutline />
            </span>
          </div>
          <h2>{fmt(stats.totalProducts)}</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> View all products
          </div>
        </div>
        <div className='dashinsight1' onClick={() => navigate('/users')}>
          <div className='dashinsightrow'>
            <p>Total Users</p>
            <span>
              <LuUsers />
            </span>
          </div>
          <h2>{fmt(stats.totalUsers)}</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> View all users
          </div>
        </div>
        <div className='dashinsight2' onClick={() => navigate('/enquiries')}>
          <div className='dashinsightrow'>
            <p>Active Leads</p>
            <span>
              <LuTarget />
            </span>
          </div>
          <h2>{fmt(stats.activeLeads)}</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> New + In Progress enquiries
          </div>
        </div>
        {isAdmin() && (
          <div className='dashinsight3' onClick={() => navigate('/financials')}>
            <div className='dashinsightrow'>
              <p>Monthly Revenue</p>
              <span>
                <BsCurrencyRupee />
              </span>
            </div>
            <h2>{loading ? '...' : `₹${(stats.monthlyRevenue / 100).toLocaleString('en-IN')}`}</h2>
            <div className='dashgrowth'>
              <MdArrowOutward /> This month's revenue
            </div>
          </div>
        )}
      </div>
      <div className='categoryperformance'>
        <div className='catperformanceheader'>
          <h2>
            <GoDotFill className='catperformdoticon' />
            Category Performance
          </h2>
          <p>Listings by category</p>
        </div>
        <div className='catperfomancerow'>
          {categoryEntries.slice(0, 4).map(([key, label], i) => (
            <div className='catperformer' key={key} onClick={() => navigate('/products')}>
              <div className='catperformerrow'>
                <div className='catperformerleft'>
                  <h2 className='catperformerlefttitle'>{label}</h2>
                  <p className='catperformerleftnote'>{fmt(stats.categoryCounts[key] || 0)} listings</p>
                </div>
                <div className={`catperformerright${catStyleIndex[i]}`}>
                  {categoryIcons[key]}
                </div>
              </div>
              <div className='catperformerbottom'>
                <p className={`catperformertag${catStyleIndex[i]}`}>{fmt(stats.categoryCounts[key] || 0)} products</p>
                <p className='catperformerdetails'>View Details →</p>
              </div>
            </div>
          ))}
        </div>
        <div className='catperfomancerow'>
          {categoryEntries.slice(4).map(([key, label], i) => (
            <div className='catperformer' key={key} onClick={() => navigate('/products')}>
              <div className='catperformerrow'>
                <div className='catperformerleft'>
                  <h2 className='catperformerlefttitle'>{label}</h2>
                  <p className='catperformerleftnote'>{fmt(stats.categoryCounts[key] || 0)} listings</p>
                </div>
                <div className={`catperformerright${catStyleIndex[i + 4]}`}>
                  {categoryIcons[key] || <BsThreeDots />}
                </div>
              </div>
              <div className='catperformerbottom'>
                <p className={`catperformertag${catStyleIndex[i + 4]}`}>{fmt(stats.categoryCounts[key] || 0)} products</p>
                <p className='catperformerdetails'>View Details →</p>
              </div>
            </div>
          ))}
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Others</h2>
                <p className='catperformerleftnote'>—</p>
              </div>
              <div className='catperformerright7'>
                <BsThreeDots />
              </div>
            </div>
            <div className='catperformerbottom'>
              <p className='catperformertag7'>—</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
        </div>
      </div>
      <div className='dashactivity'>
        <div className='dashactivityhead'>
          <h2>
            <TbActivityHeartbeat className='dashactivityicon' />
            Activity Center Overview
          </h2>
          <p>Product approvals, advertisements, and featured listings</p>
        </div>
        <div className='dashboardrow'>
          <div
            className='dashactivitycont'
            onClick={() => navigate('/activity')}
          >
            <div className='dashactivityrow'>
              <p className='dashactivityicon'>
                <IoMdTime />
              </p>
              <p className='dashactivitytag'>Pending</p>
            </div>
            <h2 className='dashactivitynum'>{fmt(stats.pendingApprovals)}</h2>
            <p className='dashactivitynote'>Product Approvals</p>
          </div>
          <div
            className='dashactivitycont1'
            onClick={() => navigate('/activity')}
          >
            <div className='dashactivityrow'>
              <p className='dashactivityicon1'>
                <BsLightningCharge />
              </p>
              <p className='dashactivitytag1'>Live</p>
            </div>
            <h2 className='dashactivitynum'>{fmt(stats.activeAds)}</h2>
            <p className='dashactivitynote'>Active Ads</p>
          </div>
          <div
            className='dashactivitycont2'
            onClick={() => navigate('/activity')}
          >
            <div className='dashactivityrow'>
              <p className='dashactivityicon2'>
                <FaStar />
              </p>
              <p className='dashactivitytag2'>Featured</p>
            </div>
            <h2 className='dashactivitynum'>{fmt(stats.featuredCount)}</h2>
            <p className='dashactivitynote'>Featured Products</p>
          </div>
          <div
            className='dashactivitycont3'
            onClick={() => navigate('/activity')}
          >
            <div className='dashactivityrow'>
              <p className='dashactivityicon3'>
                <FaRegCircleCheck />
              </p>
              <p className='dashactivitytag3'>Active</p>
            </div>
            <h2 className='dashactivitynum'>{fmt(stats.recommendedCount)}</h2>
            <p className='dashactivitynote'>Recommended</p>
            <p className='dashactivityendnotes3'>Highlighted for users</p>
          </div>
        </div>
      </div>
      <div className='financialserv'>
        <div className='dashactivityhead'>
          <h2>
            <FaArrowTrendUp className='dashactivityicon' />
            Financial Services & Packages
          </h2>
          <p>
            Quick access to subscription plans, coupons, lead unlocks, and
            digital media
          </p>
        </div>
        <div className='dashboardrow'>
          <div
            className='dashactivitycont'
            onClick={() => navigate('/financials')}
          >
            <div className='dashactivityrow'>
              <p className='finserv'>
                <LuCrown />
              </p>
              <p className='dashactivitytag4'>4 Plans</p>
            </div>
            <h2 className='dashactivitynum1'>Subscription Plans</h2>
            <p className='dashactivitynote'>
              BASIC • PREMIUM • ELITE PLUS • ENTERPRISE
            </p>
            <p className='dashactivityendnotes4'>Manage Plans</p>
          </div>
          <div
            className='dashactivitycont1'
            onClick={() => navigate('/financials')}
          >
            <div className='dashactivityrow'>
              <p className='finserv1'>
                <RiCoupon3Line />
              </p>
              <p className='dashactivitytag5'>Active</p>
            </div>
            <h2 className='dashactivitynum1'>Discount Coupons</h2>
            <p className='dashactivitynote'>Create & manage discount codes</p>
            <p className='dashactivityendnotes5'>View Coupons</p>
          </div>
          <div
            className='dashactivitycont2'
            onClick={() => navigate('/financials')}
          >
            <div className='dashactivityrow'>
              <p className='finserv2'>
                <LuUsers />
              </p>
              <p className='dashactivitytag6'>4 Packs</p>
            </div>
            <h2 className='dashactivitynum1'>Lead Unlocks</h2>
            <p className='dashactivitynote'>
              Basic • Extra 1 • Extra 2 • Extra 3
            </p>
            <p className='dashactivityendnotes6'>Manage Packages</p>
          </div>
          <div
            className='dashactivitycont3'
            onClick={() => navigate('/financials')}
          >
            <div className='dashactivityrow'>
              <p className='finserv3'>
                <BsStars />
              </p>
              <p className='dashactivitytag7'>All-in-One</p>
            </div>
            <h2 className='dashactivitynum1'>Digital Media</h2>
            <p className='dashactivitynote'>
              Photo, video & social media package
            </p>
            <p className='dashactivityendnotes7'>View Package</p>
          </div>
        </div>
      </div>
      <div className='dashboardrow'>
        <div className='lastdashinsight' onClick={() => navigate('/employees')}>
          <p className='lastdashinsighttitle'>Total Employees</p>
          <h2 className='lastdashinsightvalue'>
            {fmt(stats.totalEmployees)} <LuAward className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote'>Managing all business categories</p>
        </div>
        <div
          className='lastdashinsight1'
          onClick={() => navigate('/enquiries')}
        >
          <p className='lastdashinsighttitle'>Active Enquiries</p>
          <h2 className='lastdashinsightvalue'>
            {fmt(stats.activeLeads)} <GoDotFill className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote'>New + In Progress</p>
        </div>
        <div className='lastdashinsight2' onClick={() => navigate('/products')}>
          <p className='lastdashinsighttitle'>Active Auctions</p>
          <h2 className='lastdashinsightvalue'>
            {fmt(stats.auctionCount)} <TbActivityHeartbeat className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote1'>
            Approved auction listings
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
