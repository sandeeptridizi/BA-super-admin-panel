import './Dashboard.css';
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
import { IoCardOutline } from 'react-icons/io5';
import { VscPercentage } from 'react-icons/vsc';
import { BsStars } from 'react-icons/bs';
import { LuAward } from 'react-icons/lu';
import { LuCrown } from 'react-icons/lu';
import { RiCoupon3Line } from 'react-icons/ri';

const DashboardPage = () => {
  const navigate = useNavigate();

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
          <h2>16,234</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> +18.2% from last month
          </div>
        </div>
        <div className='dashinsight1' onClick={() => navigate('/users')}>
          <div className='dashinsightrow'>
            <p>Total Users</p>
            <span>
              <LuUsers />
            </span>
          </div>
          <h2>8,956</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> +14.8% from last month
          </div>
        </div>
        <div className='dashinsight2' onClick={() => navigate('/leads')}>
          <div className='dashinsightrow'>
            <p>Active Leads</p>
            <span>
              <LuTarget />
            </span>
          </div>
          <h2>1,456</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> +26.4% from last month
          </div>
        </div>
        <div className='dashinsight3' onClick={() => navigate('/financials')}>
          <div className='dashinsightrow'>
            <p>Monthly Revenue</p>
            <span>
              <BsCurrencyRupee />
            </span>
          </div>
          <h2>₹2.8Cr</h2>
          <div className='dashgrowth'>
            <MdArrowOutward /> +18.7% from last month
          </div>
        </div>
      </div>
      <div className='categoryperformance'>
        <div className='catperformanceheader'>
          <h2>
            <GoDotFill className='catperformdoticon' />
            Category Performance
          </h2>
          <p>Revenue and listings by category</p>
        </div>
        <div className='catperfomancerow'>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Real Estate</h2>
                <p className='catperformerleftnote'>3,847 listings</p>
              </div>
              <div className='catperformerright'>
                <FiHome />
              </div>
            </div>
            <h3 className='catperformerprice'>₹1.6Cr</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag'>100% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Cars</h2>
                <p className='catperformerleftnote'>2,456 listings</p>
              </div>
              <div className='catperformerright1'>
                <FaCarSide />
              </div>
            </div>
            <h3 className='catperformerprice1'>₹1.2Cr</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag1'>63% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Furniture</h2>
                <p className='catperformerleftnote'>1,623 listings</p>
              </div>
              <div className='catperformerright2'>
                <RiSofaFill />
              </div>
            </div>
            <h3 className='catperformerprice2'>₹54L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag2'>42% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Jewellery & Watches</h2>
                <p className='catperformerleftnote'>1,892 listings</p>
              </div>
              <div className='catperformerright3'>
                <FiWatch />
              </div>
            </div>
            <h3 className='catperformerprice3'>₹98L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag3'>49% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
        </div>
        <div className='catperfomancerow'>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Arts & Paintings</h2>
                <p className='catperformerleftnote'>987 listings</p>
              </div>
              <div className='catperformerright4'>
                <PiPaintBrushBold />
              </div>
            </div>
            <h3 className='catperformerprice4'>₹67L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag4'>25% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Antiques</h2>
                <p className='catperformerleftnote'>745 listings</p>
              </div>
              <div className='catperformerright5'>
                <BsBank />
              </div>
            </div>
            <h3 className='catperformerprice5'>₹45L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag5'>19% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Collectables</h2>
                <p className='catperformerleftnote'>1,234 listings</p>
              </div>
              <div className='catperformerright6'>
                <GoTrophy />
              </div>
            </div>
            <h3 className='catperformerprice6'>₹72L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag6'>32% of top</p>
              <p className='catperformerdetails'>View Details →</p>
            </div>
          </div>
          <div className='catperformer' onClick={() => navigate('/products')}>
            <div className='catperformerrow'>
              <div className='catperformerleft'>
                <h2 className='catperformerlefttitle'>Others</h2>
                <p className='catperformerleftnote'>856 listings</p>
              </div>
              <div className='catperformerright7'>
                <BsThreeDots />
              </div>
            </div>
            <h3 className='catperformerprice7'>₹38L</h3>
            <div className='catperformerbottom'>
              <p className='catperformertag7'>22% of top</p>
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
            <h2 className='dashactivitynum'>24</h2>
            <p className='dashactivitynote'>Product Approvals</p>
            <p className='dashactivityendnotes'>
              8 Marketplace • 10 Buy Now • 6 Auctions
            </p>
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
            <h2 className='dashactivitynum'>12</h2>
            <p className='dashactivitynote'>Active Ads</p>
            <p className='dashactivityendnotes1'>
              5 Home Top • 4 Home Bottom • 3 Product
            </p>
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
            <h2 className='dashactivitynum'>45</h2>
            <p className='dashactivitynote'>Featured Products</p>
            <p className='dashactivityendnotes2'>
              Premium listings across all modes
            </p>
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
            <h2 className='dashactivitynum'>38</h2>
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
        <div className='dashboardrow'>
          <div className='finservshort' onClick={() => navigate('/financials')}>
            <div className='finserveshorticon'>
              <IoCardOutline />
            </div>
            <div className='finservshortdetails'>
              <h2>₹85.6L</h2>
              <p>Subscriptions</p>
            </div>
          </div>
          <div
            className='finservshort1'
            onClick={() => navigate('/financials')}
          >
            <div className='finserveshorticon1'>
              <VscPercentage />
            </div>
            <div className='finservshortdetails'>
              <h2>₹12.4L</h2>
              <p>Coupon Discounts</p>
            </div>
          </div>
          <div
            className='finservshort2'
            onClick={() => navigate('/financials')}
          >
            <div className='finserveshorticon2'>
              <LuUsers />
            </div>
            <div className='finservshortdetails'>
              <h2>₹25.9L</h2>
              <p>Lead Unlocks</p>
            </div>
          </div>
          <div
            className='finservshort3'
            onClick={() => navigate('/financials')}
          >
            <div className='finserveshorticon3'>
              <BsStars />
            </div>
            <div className='finservshortdetails'>
              <h2>₹60L</h2>
              <p>Digital Media</p>
            </div>
          </div>
        </div>
      </div>
      <div className='dashboardrow'>
        <div className='lastdashinsight' onClick={() => navigate('/employees')}>
          <p className='lastdashinsighttitle'>Total Employees</p>
          <h2 className='lastdashinsightvalue'>
            163 <LuAward className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote'>Managing 5 business categories</p>
        </div>
        <div
          className='lastdashinsight1'
          onClick={() => navigate('/enquiries')}
        >
          <p className='lastdashinsighttitle'>Pending Enquiries</p>
          <h2 className='lastdashinsightvalue'>
            31 <GoDotFill className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote'>Across all 5 modes</p>
        </div>
        <div className='lastdashinsight2' onClick={() => navigate('/products')}>
          <p className='lastdashinsighttitle'>Active Auctions</p>
          <h2 className='lastdashinsightvalue'>
            87 <TbActivityHeartbeat className='lastdashicon' />
          </h2>
          <p className='lastdashinsightnote1'>
            <MdArrowOutward /> +12 new this week
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
