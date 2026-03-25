import './Leads.css';
import { useState, useEffect } from "react";
import { AiOutlineShop } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { TbHammer } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RiComputerLine } from "react-icons/ri";
import { FiEye } from "react-icons/fi";
import { FiPhone } from "react-icons/fi";
import { MdOutlineVilla } from "react-icons/md";
import { FiMail } from "react-icons/fi";

import { getEnquiries, getEnquiryStats, deleteEnquiry } from '../../lib/enquiries';
import { FiTrash2 } from "react-icons/fi";

const listingTypeMap = {
  marketplace: 'MARKETPLACE',
  buynow: 'BUY_NOW',
  auctions: 'AUCTIONS',
  tolet: 'TO_LET',
};

const statusBadgeClass = {
  NEW: 'statusBadge',
  IN_PROGRESS: 'statusBadge',
  RESOLVED: 'statusBadge',
  CLOSED: 'statusBadge',
};

const Leads = () => {
  const [selectedCat, setSelectedCat] = useState("marketplace");
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, resolved: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      setDeletingId(id);
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getEnquiryStats();
        if (data) {
          const byStatus = data.byStatus || {};
          setStats({
            total: (byStatus.NEW || 0) + (byStatus.IN_PROGRESS || 0) + (byStatus.RESOLVED || 0) + (byStatus.CLOSED || 0),
            new: byStatus.NEW || 0,
            inProgress: byStatus.IN_PROGRESS || 0,
            resolved: (byStatus.RESOLVED || 0) + (byStatus.CLOSED || 0),
          });
        }
      } catch {}
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (selectedCat !== 'advertise') {
          params.listingType = listingTypeMap[selectedCat] || 'MARKETPLACE';
        }
        if (search) params.search = search;
        const res = await getEnquiries(params);
        setEnquiries(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch {
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [selectedCat, page, search]);

  const catStats = enquiries.length;

  return <div className='leadscontainer'>
    <div className='producthead'>
      <div className='productheadinfo'>
        <h1 className='productsheader'>Leads</h1>
        <span className='productheaddesc'>Product and Package Enquiries</span>
      </div>
      <button onClick={() => navigate("/addlead")} className='addproduct'><FiUserPlus />Add Lead</button>
    </div>
    <ul className='userstats'>
      <li className='userstat'>
        <div className='userstattitle'>Total Leads</div>
        <div className='userstatvalue'>{stats.total.toLocaleString('en-IN')}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon'></span>New Leads</div>
        <div className='userstatvalue'>{stats.new.toLocaleString('en-IN')}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon1'></span>In Progress</div>
        <div className='userstatvalue'>{stats.inProgress.toLocaleString('en-IN')}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon2'></span>Resolved</div>
        <div className='userstatvalue'>{stats.resolved.toLocaleString('en-IN')}</div>
      </li>
    </ul>
    <div className='userproductstats'>
      <ul className='productcat2'>
        <li
          className={`productcatname ${selectedCat === "marketplace" ? "active" : ""}`}
          onClick={() => { setSelectedCat("marketplace"); setPage(1); }}
        >
          <AiOutlineShop /> Marketplace
        </li>
        <li
          className={`productcatname ${selectedCat === "buynow" ? "active" : ""}`}
          onClick={() => { setSelectedCat("buynow"); setPage(1); }}
        >
          <BsLightningCharge /> Buy Now
        </li>
        <li
          className={`productcatname ${selectedCat === "auctions" ? "active" : ""}`}
          onClick={() => { setSelectedCat("auctions"); setPage(1); }}
        >
          <TbHammer /> Auctions
        </li>
        <li
          className={`productcatname ${selectedCat === "tolet" ? "active" : ""}`}
          onClick={() => { setSelectedCat("tolet"); setPage(1); }}
        >
          <FiHome /> To-let
        </li>
      </ul>
    </div>
    <div className="productcatmain2">
      <input
        type="text"
        placeholder="Search leads by name, email, product..."
        className="searchInput1"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />
    </div>
    {loading ? (
      <p style={{ padding: '20px', textAlign: 'center' }}>Loading leads...</p>
    ) : enquiries.length === 0 ? (
      <p style={{ padding: '20px', textAlign: 'center' }}>No leads found.</p>
    ) : (
      enquiries.map((enq) => (
        <div className="leadCard" key={enq.id}>
          <div className="leadTop">
            <div>
              <div className="leadNameRow">
                <h3>{enq.visitorName}</h3>
                <span className="statusBadge">{enq.status}</span>
              </div>
              <div className="leadDate">
                <span className="dot"></span>
                {new Date(enq.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
            <div className="leadActions">
              <button className="viewBtn" onClick={() => navigate(`/enquirydetails/${enq.id}`)}>
                <FiEye /> View Details
              </button>
              {enq.visitorPhone && (
                <button className="contactBtn" onClick={() => window.open(`tel:${enq.visitorPhone}`)}>
                  <FiPhone /> Contact
                </button>
              )}
              <button className="deleteBtn" onClick={(e) => handleDelete(e, enq.id)} disabled={deletingId === enq.id}>
                <FiTrash2 /> {deletingId === enq.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
          <div className="leadBottom">
            <div className="infoBox2">
              <div className="iconCircle">
                <MdOutlineVilla />
              </div>
              <div>
                <p className="propertyTitle">{enq.product?.title || 'Unknown Product'}</p>
                <p className="propertyCat">{enq.product?.category?.replace(/_/g, ' ') || 'Product Enquiry'}</p>
              </div>
            </div>
            <div className="infoBox1">
              <p className="label">EMAIL</p>
              <p className="valueRow">
                <FiMail className="smallIcon" />
                {enq.visitorEmail}
              </p>
            </div>
            {enq.visitorPhone && (
              <div className="infoBox1">
                <p className="label">PHONE</p>
                <p className="valueRow">
                  <FiPhone className="smallIcon" />
                  {enq.visitorPhone}
                </p>
              </div>
            )}
            <div className="infoBox1 highlightValueBox">
              <p className="label1">PRODUCT VALUE</p>
              <p className="leadValue">
                {enq.product?.value
                  ? `₹${Number(enq.product.value).toLocaleString('en-IN')}`
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      ))
    )}
    {totalPages > 1 && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="viewBtn">Previous</button>
        <span style={{ padding: '8px 16px' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="viewBtn">Next</button>
      </div>
    )}
  </div>;
};

export default Leads;
