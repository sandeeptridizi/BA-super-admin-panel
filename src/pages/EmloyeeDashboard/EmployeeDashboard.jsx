import './EmployeeDashboard.css';
import { useState, useEffect } from 'react';

import { TbActivityHeartbeat } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';
import { BsBoxSeam } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { LuTarget } from 'react-icons/lu';
import { GoPerson } from 'react-icons/go';
import { FiPhone } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { RiErrorWarningLine } from 'react-icons/ri';
import { FaRegCircleCheck } from 'react-icons/fa6';

import { getEnquiries, getEnquiryStats } from '../../lib/enquiries';
import { getUsers } from '../../lib/users';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, users: 0, totalLeads: 0, employees: 0 });
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [pendingLeads, setPendingLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enquiryStats, usersRes, assignedRes, pendingRes] = await Promise.all([
          getEnquiryStats(),
          getUsers(),
          getEnquiries({ status: 'IN_PROGRESS', limit: 4 }),
          getEnquiries({ status: 'NEW', limit: 3 }),
        ]);

        const totalLeads = (enquiryStats?.total) || 0;
        const userCount = usersRes?.data?.length || 0;

        setStats({
          products: 0,
          users: userCount,
          totalLeads,
          employees: 0,
        });
        setAssignedLeads(assignedRes?.data || []);
        setPendingLeads(pendingRes?.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  if (loading) {
    return (
      <div className='employee-dashboard-container'>
        <p style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className='employee-dashboard-container'>
      <div className='employee-dashboard-header'>
        <h1 className='employee-dashboard-heading'>
          <TbActivityHeartbeat /> Employee Dashboard{' '}
          <BsStars className='star-icon' />
        </h1>
        <p className='employee-dashboard-text'>
          Your personalized workspace with assigned leads and tasks
        </p>
      </div>
      <div className='employee-dashboard-grid-container'>
        <div className='employee-dashboard-item2'>
          <div className='employee-dashboard-item-header'>
            <p className='employee-dashboard-item-text'>Total Users</p>
            <div className='item2-icon-container'>
              <GoPeople />
            </div>
          </div>
          <h2 className='employee-dashboard-item-heading'>{stats.users.toLocaleString('en-IN')}</h2>
        </div>
        <div className='employee-dashboard-item3'>
          <div className='employee-dashboard-item-header'>
            <p className='employee-dashboard-item-text'>Total Leads</p>
            <div className='item3-icon-container'>
              <LuTarget />
            </div>
          </div>
          <h2 className='employee-dashboard-item-heading'>{stats.totalLeads.toLocaleString('en-IN')}</h2>
        </div>
        <div className='employee-dashboard-item4'>
          <div className='employee-dashboard-item-header'>
            <p className='employee-dashboard-item-text'>In Progress</p>
            <div className='item4-icon-container'>
              <GoPerson />
            </div>
          </div>
          <h2 className='employee-dashboard-item-heading'>{assignedLeads.length}</h2>
        </div>
      </div>
      <div className='assigned-leads-container'>
        <div className='assigned-leads-header'>
          <div className='assigned-leads-content'>
            <h2 className='assigned-leads-heading'>
              <GoPerson className='leads-icon' /> In Progress Leads
            </h2>
            <p className='assigned-leads-text'>
              Leads currently being worked on
            </p>
          </div>
          <div className='leads-tag'>{assignedLeads.length} Active</div>
        </div>
        <div className='assigned-leads-grid-container'>
          {assignedLeads.length === 0 ? (
            <p style={{ padding: '20px', color: '#71717A' }}>No in-progress leads.</p>
          ) : (
            assignedLeads.map((lead) => (
              <div className='assigned-leads-item1' key={lead.id}>
                <div className='assigned-leads-item-header'>
                  <div className='assigned-leads-item-content'>
                    <div className='leads-tag-container'>
                      <div className='lead-number-tag'>{lead.product?.category?.replace(/_/g, ' ') || 'General'}</div>
                    </div>
                    <h3 className='item-name'>{lead.visitorName}</h3>
                    <p className='address'>{lead.product?.title || 'General Enquiry'}</p>
                  </div>
                  <div className='progress-tag'>{lead.status?.replace('_', ' ')}</div>
                </div>
                <div className='contact-detials-container'>
                  {lead.visitorPhone && (
                    <div className='contact-number'>
                      <FiPhone className='assigned-leads-icon' /> {lead.visitorPhone}
                    </div>
                  )}
                  <div className='contact-number'>
                    <FiMail className='assigned-leads-icon' /> {lead.visitorEmail}
                  </div>
                  <div className='contact-number'>
                    <MdOutlineCalendarToday className='assigned-leads-icon' />{' '}
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <div className='assigned-leads-btns'>
                  {lead.visitorPhone && (
                    <button className='call-btn' onClick={() => window.open(`tel:${lead.visitorPhone}`)}>
                      <FiPhone /> Call
                    </button>
                  )}
                  <button className='view-btn' onClick={() => navigate(`/enquirydetails/${lead.id}`)}>View Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className='pending-leads-container'>
        <div className='pending-leads-header'>
          <div className='pending-leads-header-content'>
            <h2 className='pending-leads-heading'>
              <RiErrorWarningLine className='warning-icon' /> New Leads
            </h2>
            <p className='pending-leads-text'>
              New leads waiting to be actioned
            </p>
          </div>
          <div className='pending-tag'>{pendingLeads.length} Pending</div>
        </div>
        <div className='pending-leads-grid-container'>
          {pendingLeads.length === 0 ? (
            <p style={{ padding: '20px', color: '#71717A' }}>No pending leads.</p>
          ) : (
            pendingLeads.map((lead) => (
              <div className='pending-leads-item' key={lead.id}>
                <div className='pending-leads-item-header'>
                  <div className='pending-leads-header-item-content'>
                    <div className='lead-number-tag'>{lead.product?.category?.replace(/_/g, ' ') || 'General'}</div>
                    <h3 className='item-name'>{lead.visitorName}</h3>
                    <p className='address'>{lead.product?.title || 'General Enquiry'}</p>
                  </div>
                </div>
                <div className='contact-detials-container'>
                  {lead.visitorPhone && (
                    <div className='contact-number'>
                      <FiPhone className='pending-leads-icon' /> {lead.visitorPhone}
                    </div>
                  )}
                  <div className='contact-number'>
                    <MdOutlineCalendarToday className='pending-leads-icon' />{' '}
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <button className='accept-btn' onClick={() => navigate(`/enquirydetails/${lead.id}`)}>
                  <FaRegCircleCheck /> View Lead
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
