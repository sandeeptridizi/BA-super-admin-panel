import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./EnquiryDetails.css";
import { LuMessageSquare } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { getEnquiry, updateEnquiry, deleteEnquiry } from "../../lib/enquiries";
import { FiTrash2 } from "react-icons/fi";
import { getEmployees } from "../../lib/employees";

const statusLabel = { NEW: "new", IN_PROGRESS: "in progress", RESOLVED: "resolved", CLOSED: "closed" };
const listingTypeLabel = { BUY_NOW: "Buy Now", MARKETPLACE: "Marketplace", AUCTIONS: "Auctions", TO_LET: "To-Let" };

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function EnquiryDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [enquiry, setEnquiry] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [status, setStatus] = useState("");
    const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
      try {
        setDeleting(true);
        await deleteEnquiry(id);
        navigate("/enquiries");
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete enquiry.");
        setDeleting(false);
      }
    };

    useEffect(() => {
      async function fetchData() {
        try {
          const [enqRes, empRes] = await Promise.all([
            getEnquiry(id),
            getEmployees(),
          ]);
          const enq = enqRes.data || enqRes;
          setEnquiry(enq);
          setStatus(enq.status);
          setAssignedEmployeeId(enq.assignedEmployeeId || "");
          setEmployees(empRes.data || []);
        } catch (err) {
          console.error("Failed to fetch enquiry", err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [id]);

    const handleUpdate = async () => {
      setUpdating(true);
      try {
        const payload = { status };
        if (assignedEmployeeId !== (enquiry.assignedEmployeeId || "")) {
          payload.assignedEmployeeId = assignedEmployeeId || null;
        }
        const res = await updateEnquiry(id, payload);
        setEnquiry(res.data || res);
      } catch (err) {
        console.error("Failed to update enquiry", err);
      } finally {
        setUpdating(false);
      }
    };

    if (loading) return <div className="enquirypagecontainer" style={{ padding: 40 }}>Loading...</div>;
    if (!enquiry) return <div className="enquirypagecontainer" style={{ padding: 40 }}>Enquiry not found.</div>;

  return (
    <div className="enquirypagecontainer">
        <div className="enquiryleadheader">
            <div className="lead-header-left" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button className="back-btn" onClick={() => navigate("/enquiries")}>
                    <FaArrowLeft />
                  </button>

                <div>
                    <h1 className="enquirynameheader">{enquiry.product?.title || enquiry.source || "Enquiry"}</h1>
                    <div className="lead-meta">
                      <span className="badge">{statusLabel[enquiry.status] || enquiry.status}</span>
                      <span className="lead-id">{listingTypeLabel[enquiry.product?.listingType] || enquiry.source || ""}</span>
                    </div>
                </div>
                </div>
                <button onClick={handleDelete} disabled={deleting} style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
                  <FiTrash2 /> {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
         </div>
        <div className="enquirydetailssection">
            <div className="enquirydetailsleft">
                <div className="originalenquiry">
                    <div className="originalenquiryheader">
                        <span className="originalenquirytitle"><LuMessageSquare className="originalenquiryicon"/>Original Enquiry</span>
                        <p className="originalenquirydate"><CiCalendar />{formatDate(enquiry.createdAt)}</p>
                    </div>
                        <p className="originalenquirymessage">
                            {enquiry.message}
                        </p>
                </div>
                {enquiry.assignedEmployee && (
                <div className="originalenquiry">
                    <div className="originalenquiryheader">
                        <span className="originalenquirytitle"><LuMessageSquare className="conversationheadicon"/>Assigned Employee</span>
                        <p className="originalenquirydate">{enquiry.assignedEmployee.designation || ""}</p>
                    </div>
                    <div className="originalenquirynote">
                        <div className="threadheader">
                            <div className="threadheaderleft"><FiUser className="conversationicon" /> {enquiry.assignedEmployee.name} </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className="enquirydetailsright">
                <div className="enquirycontactinfo">
                    <div className="enquirycontactheader">Contact Information</div>
                    <div className="enquirycontactname">
                        <div className="enquirycontacticon"><FiUser className="contactusericon" /></div>
                        <div className="enquirycontactdetails">
                            <h3 className="enquirycontacttitle">NAME</h3>
                            <p className="enquirycontactvalue">{enquiry.visitorName}</p>
                        </div>
                    </div>
                    <div className="enquirycontactname">
                        <div className="enquirycontacticon"><MdOutlineEmail className="contactusericon1" /></div>
                        <div className="enquirycontactdetails">
                            <h3 className="enquirycontacttitle">EMAIL</h3>
                            <p className="enquirycontactvalue">{enquiry.visitorEmail}</p>
                        </div>
                    </div>
                    <div className="enquirycontactname">
                        <div className="enquirycontacticon"><FiPhone  className="contactusericon2" /></div>
                        <div className="enquirycontactdetails">
                            <h3 className="enquirycontacttitle">PHONE</h3>
                            <p className="enquirycontactvalue">{enquiry.visitorPhone || "N/A"}</p>
                        </div>
                    </div>
                </div>
                <div className="enquirystatusinfo">
                    <div className="enquirystatusheader">
                    <span className="enquirystatustitle">Enquiry Status</span>
                    <p className="originalenquirydate">Update Status</p></div>
                    <h2 className="currentstatustitle">Current Status</h2>
                    <select className="currentstatusdropdown" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="NEW">New</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <p className="updatestatus" style={{ cursor: "pointer" }} onClick={handleUpdate}>
                      {updating ? "Updating..." : "Update Status"}
                    </p>
                </div>
                <div className="enquirystatusinfo">
                    <div className="enquirystatusheader">
                    <span className="enquirystatustitle">Assign Employee</span>
                    <p className="originalenquirydate">Select an employee</p></div>
                    <h2 className="currentstatustitle">Employee</h2>
                    <select className="currentstatusdropdown" value={assignedEmployeeId} onChange={(e) => setAssignedEmployeeId(e.target.value)}>
                        <option value="">Unassigned</option>
                        {employees.filter(emp => emp.isActive).map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.name}{emp.designation ? ` — ${emp.designation}` : ""}</option>
                        ))}
                    </select>
                    <p className="updatestatus" style={{ cursor: "pointer" }} onClick={handleUpdate}>
                      {updating ? "Updating..." : "Assign"}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
