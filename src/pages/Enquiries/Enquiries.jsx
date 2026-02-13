<<<<<<< HEAD
import React from "react";
import "./Enquiries.css";
import {
  FiMessageSquare,
  FiClock,
  FiSend,
  FiSearch,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { useState } from "react";



export default function Enquiries() {

  const [activeTab, setActiveTab] = useState("approvals");
  const navigate = useNavigate();

  return (
    <div className="enquiries-wrapper">

      <div className="enquiries-header">
        <h1>Enquiries</h1>
        <p>Chat and form enquiries across all business modes</p>
      </div>

      <div className="stats-row">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Enquiries</span>
            <FiMessageSquare className="stat-icon1" />
          </div>
          <h2>1,856</h2>
          <div className="stat-line blue"></div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="statcardtext">Unread</span>
            <GoDotFill className="stat-icon2"  />
          </div>
          <h2 className="blue-text">23</h2>
          <div className="stat-line blue"></div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="statcardtext1">Pending</span>
            <IoMdTime className="stat-icon1" />
          </div>
          <h2 className="orange-text">45</h2>
          <div className="stat-line orange"></div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="statcardtext2">Avg Response Time</span>
            <FiSend className="stat-icon3" />
          </div>
          <h2 className="yellow-text">12 min</h2>
          <div className="stat-line yellow"></div>
        </div>

      </div>

      {/* BUSINESS MODE */}
      <div className="section-card">
        <h3>Enquiries by Business Mode</h3>
        <p>Distribution across different business categories</p>

        <div className="business-grid">

          <div className="business-card active">
            <div className="business-top">
              <span>Buy Now</span>
              <BsChatDots className="business-icon yellow-bg" />
            </div>
            <p className="gapspace">Total<b>623</b></p>
            <p className="gapspace">Unread <span className="badge1">9</span></p>
          </div>

          <div className="business-card">
            <div className="business-top">
              <span>Marketplace</span>
              <BsChatDots className="business-icon blue-bg" />
            </div>
            <p className="gapspace">Total <b>487</b></p>
            <p className="gapspace">Unread <span className="badge1">6</span></p>
          </div>

          <div className="business-card">
            <div className="business-top">
              <span>Auctions</span>
              <BsChatDots className="business-icon purple-bg" />
            </div>
            <p className="gapspace">Total <b>312</b></p>
            <p className="gapspace">Unread <span className="badge1">4</span></p>
          </div>

          <div className="business-card">
            <div className="business-top">
              <span>To-Let</span>
              <BsChatDots className="business-icon green-bg" />
            </div>
            <p className="gapspace">Total <b>276</b></p>
            <p className="gapspace">Unread <span className="badge1">3</span></p>
          </div>

          <div className="business-card">
            <div className="business-top">
              <span>Digital Advertise</span>
              <BsChatDots className="business-icon orange-bg" />
            </div>
            <p className="gapspace">Total <b>158</b></p>
            <p className="gapspace">Unread <span className="badge1">1</span></p>
          </div>

        </div>
      </div>

      <div className="search-box">
        <FiSearch />
        <input placeholder="Search enquiries by user, product, message..." />
      </div>

      <ul className='activitycat1'>
        <li className={`catmenu4 ${activeTab === "allenquiries" ? "active-allenquiries" : ""}`}onClick={() => setActiveTab("allenquiries")}>All Enquiries</li>
        <li className={`catmenu4 ${activeTab === "chatsystem" ? "active-chatsystem" : ""}`}onClick={() => setActiveTab("chatsystem")}>Chat System</li>
        <li className={`catmenu4 ${activeTab === "formsubmissions" ? "active-formsubmissions" : ""}`}onClick={() => setActiveTab("formsubmissions")}>Form Submissions</li>
      </ul>

      {activeTab === "allenquiries" && (<div><div className="enquiry-card">

        <div className="enquiry-header" onClick={() => navigate("/enquirydetails")}>

          <div className="user-info">
            <div className="avatar">PN</div>
            <div>
              <h4>
                Priyanka Nair
                <span className="status unread">unread</span>
              </h4>
              <p>Luxury Villa - Juhu</p>
            </div>
          </div>

          <div className="agent-section">
            <div className="agent-badge">
              <HiOutlineUserCircle />
              <div className="enquiryagentinfo" >
                <span>Vikram Mehta</span>
                <span>Property Sales</span>
              </div>
            </div>
            <button className="reply-btn">Click to Reply</button>
          </div>

        </div>

        <div className="message-box">
          <strong>Message</strong>
          <p className="enquirymessage">
            Hi, I'm interested in the Juhu property. Can you provide more details?
          </p>
        </div>

        <div className="enquiry-footer">
          <span><FiClock /> 5 min ago</span>
          <span className="type">Chat Enquiry</span>
        </div>

      </div>
      <div className="enquiry-card">

        <div className="enquiry-header" onClick={() => navigate("/enquirydetails")}>

          <div className="user-info">
            <div className="avatar">PN</div>
            <div>
              <h4>
                Akash Khanna
                <span className="status unread">replied</span>
              </h4>
              <p>Rolls-Royce Phantom</p>
            </div>
          </div>

          <div className="agent-section">
            <div className="agent-badge">
              <HiOutlineUserCircle />
              <div className="enquiryagentinfo" >
                <span>Rajesh Kumar</span>
                <span>Luxury Cars</span>
              </div>
            </div>
            <button className="reply-btn">Click to Reply</button>
          </div>

        </div>

        <div className="message-box">
          <strong>Message</strong>
          <p className="enquirymessage">
            What's the condition of the Rolls-Royce? Has it been in any accidents?
          </p>
        </div>

        <div className="enquiry-footer">
          <span><FiClock /> 1 hour ago</span>
          <span className="type">Chat Enquiry</span>
        </div>

      </div>
      <div className="enquiry-card">

        <div className="enquiry-header" onClick={() => navigate("/enquirydetails")}>

          <div className="user-info">
            <div className="avatar">PN</div>
            <div>
              <h4>
                Siddharth Rao
                <span className="status unread">unread</span>
              </h4>
              <p>Patek Philippe Nautilus</p>
            </div>
          </div>

          <div className="agent-section">
            <div className="agent-badge">
              <HiOutlineUserCircle />
              <div className="enquiryagentinfo" >
                <span>Arun Kapoor</span>
                <span>Luxury Goods</span>
              </div>
            </div>
            <button className="reply-btn">Click to Reply</button>
          </div>

        </div>

        <div className="message-box">
          <strong>Message</strong>
          <p className="enquirymessage">
            I would like to know if the watch comes with original box and papers.
          </p>
        </div>

        <div className="enquiry-footer">
          <span><FiClock /> 1 hour ago</span>
          <span className="type">Chat Enquiry</span>
        </div>

      </div>
      </div>)}
      {activeTab === "chatsystem" && (<div><div className="enquiry-card">

        <div className="enquiry-header" onClick={() => navigate("/enquirydetails")}>

          <div className="user-info">
            <div className="avatar">PN</div>
            <div>
              <h4>
                Priyanka Nair
                <span className="status unread">unread</span>
              </h4>
              <p>Luxury Villa - Juhu</p>
            </div>
          </div>

          <div className="agent-section">
            <div className="agent-badge">
              <HiOutlineUserCircle />
              <div className="enquiryagentinfo">
                <span>Vikram Mehta</span>
                <span>Property Sales</span>
              </div>
            </div>
            <button className="reply-btn">Click to Reply</button>
          </div>

        </div>

        <div className="message-box">
          <strong>Message</strong>
          <p className="enquirymessage">
            Hi, I'm interested in the Juhu property. Can you provide more details?
          </p>
        </div>

        <div className="enquiry-footer">
          <span><FiClock /> 5 min ago</span>
          <span className="type">Chat Enquiry</span>
        </div>

      </div></div>)}
      {activeTab === "formsubmissions" && (<div><div className="enquiry-card">

        <div className="enquiry-header" onClick={() => navigate("/enquirydetails")}>

          <div className="user-info">
            <div className="avatar">PN</div>
            <div>
              <h4>
                Priyanka Nair
                <span className="status unread">unread</span>
              </h4>
              <p>Luxury Villa - Juhu</p>
            </div>
          </div>

          <div className="agent-section">
            <div className="agent-badge">
              <HiOutlineUserCircle />
              <div className="enquiryagentinfo">
                <span>Vikram Mehta</span>
                <span>Property Sales</span>
              </div>
            </div>
            <button className="reply-btn">Click to Reply</button>
          </div>

        </div>

        <div className="message-box">
          <strong>Message</strong>
          <p className="enquirymessage">
            Hi, I'm interested in the Juhu property. Can you provide more details?
          </p>
        </div>

        <div className="enquiry-footer">
          <span><FiClock /> 5 min ago</span>
          <span className="type">Chat Enquiry</span>
        </div>

      </div></div>)}

    </div>
  );
}
=======
import './Enquiries.css';

const Enquiries = () => {
  return <h1>Enquiries</h1>;
};

export default Enquiries;
>>>>>>> 033d7f0c6160f31e50e9c7b4d002ace7e8e79d0b
