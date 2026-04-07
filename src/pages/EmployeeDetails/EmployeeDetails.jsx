import React, { useState, useEffect } from "react";
import "./EmployeeDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { GoLock } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { FiCreditCard } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
import { MdWorkOutline } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { CiDroplet } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { getEmployee, updateEmployee, deleteEmployee } from "../../lib/employees";

const fmt = (v) => (v != null && v !== "" ? String(v) : "\u2014");
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "\u2014";

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid employee.");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getEmployee(id);
        if (!cancelled) setEmployee(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load employee.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const openEditModal = () => {
    setEditForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      designation: employee.designation || "",
      department: employee.department || "",
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await updateEmployee(id, editForm);
      setEmployee((prev) => ({ ...prev, ...res.data }));
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`)) return;
    try {
      await deleteEmployee(id);
      navigate("/employees");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  const handleToggleActive = async () => {
    const newStatus = !employee.isActive;
    if (!window.confirm(`${newStatus ? "Activate" : "Deactivate"} this employee?`)) return;
    try {
      const res = await updateEmployee(id, { isActive: newStatus });
      setEmployee((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="employeeDetails-container">
        <div className="details-loading">Loading employee...</div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="employeeDetails-container">
        <div className="details-error" role="alert">
          {error || "Employee not found."}
        </div>
        <button
          className="outline-btn"
          onClick={() => navigate("/employees")}
        >
          <GoArrowLeft /> Back to Employees
        </button>
      </div>
    );
  }

  const addressLines = [employee.completeAddress, employee.city, employee.state, employee.country, employee.postalCode].filter(Boolean);

  return (
    <div className="employeeDetails-container">

      <div className="details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <GoArrowLeft />
          </button>
          <div>
            <h1>{employee.name}</h1>
            <div className="role-row">
              <span className="role-badge">{fmt(employee.designation)}</span>
              <span className={`status-badge ${employee.isActive ? "active" : ""}`}>
                {employee.isActive ? "active" : "inactive"}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="toggle-active-btn" onClick={handleToggleActive}>
            {employee.isActive ? "Deactivate" : "Activate"}
          </button>
          <button className="delete-emp-btn" onClick={handleDelete}><FiTrash2 /></button>
          <button className="edit-btn" onClick={openEditModal}><FiEdit />Edit Employee</button>
        </div>
      </div>

      <div className="details-grid">

        <div className="left-column">

          <div className="card">
            <h3 className="empdatainfo"><FiPhone className="statcardicon" />Contact Information</h3>
            <div className="info-box">
              <div className="empinfoicon color1"><MdOutlineEmail /></div>
              <div>
                <label>Email Address</label>
                <p>{employee.email}</p>
              </div>
            </div>
            <div className="info-box">
              <div className="empinfoicon color2"><FiPhone /></div>
              <div>
                <label>Phone Number</label>
                <p>{fmt(employee.phone)}</p>
              </div>
            </div>
            {employee.alternatePhone && (
              <div className="info-box">
                <div className="empinfoicon color2"><FiPhone /></div>
                <div>
                  <label>Alternate Phone</label>
                  <p>{employee.alternatePhone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="empdatainfo"><GoLock className="statcardicon" />Account</h3>
            <div className="info-box highlight">
              <div className="empinfoicon color3"><FiUser /></div>
              <div>
                <label>Email (login)</label>
                <p>{employee.email}</p>
              </div>
            </div>
            <button className="outline-btn">Reset Password</button>
          </div>

          <div className="card">
            <h3 className="empdatainfo"><FiUser className="statcardicon" />Personal Information</h3>
            <div className="row">
              <div className="info-box2">
                <label>Date of Birth</label>
                <p>{fmtDate(employee.dateOfBirth)}</p>
              </div>
              <div className="info-box2">
                <label>Gender</label>
                <p>{fmt(employee.gender)}</p>
              </div>
            </div>
            {employee.fatherName && (
              <div className="info-box2">
                <label>Father's Name</label>
                <p>{employee.fatherName}</p>
              </div>
            )}
          </div>

          {(employee.completeAddress || employee.city || employee.state || employee.postalCode) && (
            <div className="card">
              <h3 className="empdatainfo"><IoLocationOutline className="statcardicon" />Address Information</h3>
              <div className="info-box highlight">
                <div className="empinfoicon color5"><IoLocationOutline /></div>
                <div>
                  <label>Address</label>
                  <p>{addressLines.join(", ") || "\u2014"}</p>
                </div>
              </div>
            </div>
          )}

          {(employee.aadhaarNumber || employee.panNumber) && (
            <div className="card">
              <h3 className="empdatainfo"><FiCreditCard className="statcardicon" />Government IDs</h3>
              {employee.aadhaarNumber && (
                <div className="info-box">
                  <div className="empinfoicon color6"><FiCreditCard /></div>
                  <div>
                    <label>AADHAR NUMBER</label>
                    <p>{employee.aadhaarNumber}</p>
                  </div>
                </div>
              )}
              {employee.panNumber && (
                <div className="info-box">
                  <div className="empinfoicon color7"><FiCreditCard /></div>
                  <div>
                    <label>PAN NUMBER</label>
                    <p>{employee.panNumber}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {(employee.emergencyContactName || employee.emergencyContactPhone) && (
            <div className="card red-border">
              <h3 className="empdatainfo"><LuUsers className="statcardicon" />Emergency Contact</h3>
              {employee.emergencyContactName && (
                <div className="info-box colored light-red">
                  <div className="empinfoicon color4"><LuUsers /></div>
                  <div>
                    <label>CONTACT NAME</label>
                    <p>{employee.emergencyContactName}</p>
                  </div>
                </div>
              )}
              {employee.emergencyContactPhone && (
                <div className="info-box colored light-orange">
                  <div className="empinfoicon color8"><FiPhone /></div>
                  <div>
                    <label>CONTACT PHONE</label>
                    <p>{employee.emergencyContactPhone}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {(employee.bankAccountNumber || employee.bankName || employee.ifscCode) && (
            <div className="card">
              <h3 className="empdatainfo"><LuBuilding2 className="statcardicon" />Banking Information</h3>
              {employee.bankAccountName && (
                <div className="info-box">
                  <div className="empinfoicon color9"><LuBuilding2 /></div>
                  <div>
                    <label>ACCOUNT NAME</label>
                    <p>{employee.bankAccountName}</p>
                  </div>
                </div>
              )}
              {employee.bankAccountNumber && (
                <div className="info-box">
                  <div className="empinfoicon color9"><LuBuilding2 /></div>
                  <div>
                    <label>ACCOUNT NUMBER</label>
                    <p>{employee.bankAccountNumber}</p>
                  </div>
                </div>
              )}
              {employee.ifscCode && (
                <div className="info-box">
                  <div className="empinfoicon color10"><LuBuilding2 /></div>
                  <div>
                    <label>IFSC CODE</label>
                    <p>{employee.ifscCode}</p>
                  </div>
                </div>
              )}
              {employee.bankName && (
                <div className="info-box">
                  <div className="empinfoicon color10"><LuBuilding2 /></div>
                  <div>
                    <label>BANK NAME</label>
                    <p>{employee.bankName}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div className="right-column">

          <div className="card1">
            <h3 className="empdatainfo"><MdWorkOutline className="statcardicon" />Employment Details</h3>
            <div className="info-box1 highlight">
              <label>Role</label>
              <p>{fmt(employee.designation)}</p>
            </div>
            <div className="info-box1 highlight">
              <label>Department</label>
              <p>{fmt(employee.department)}</p>
            </div>
            {employee.salary != null && (
              <div className="info-box1 highlight-yellow">
                <label>Monthly Salary</label>
                <p className="salary">\u20B9 {Number(employee.salary).toLocaleString("en-IN")}</p>
              </div>
            )}
          </div>

          <div className="card1">
            <h3 className="empdatainfo"><CiCalendar className="statcardicon" />Timeline</h3>
            <div className="timeline joined">
              <div className="empinfoicon color2"><CiCalendar /></div>
              <div>
                <label>JOINED</label>
                <p>{fmtDate(employee.joiningDate || employee.createdAt)}</p>
              </div>
            </div>
            <div className="timeline active">
              <div className="empinfoicon"><CiCalendar /></div>
              <div>
                <label>LAST UPDATED</label>
                <p>{fmtDate(employee.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="card1">
            <button className="edit-btn full" onClick={openEditModal}><FiEdit />Edit Employee</button>
            <button className="delete-btn full" onClick={handleDelete}><FiTrash2 />Delete Employee</button>
            <button
              className="outline-btn full"
              onClick={() => navigate("/employees")}
            >
              <GoArrowLeft /> Back to Employees
            </button>
          </div>

        </div>

      </div>

      {showEditModal && (
        <div className="editModalOverlay" onClick={() => setShowEditModal(false)}>
          <div className="editModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="editModalHeader">
              <h2>Edit Employee</h2>
              <button className="editModalClose" onClick={() => setShowEditModal(false)}><IoClose /></button>
            </div>
            <div className="editModalBody">
              <label>Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <label>Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              <label>Phone</label>
              <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              <label>Designation</label>
              <input type="text" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} />
              <label>Department</label>
              <input type="text" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
            </div>
            <div className="editModalFooter">
              <button className="editModalCancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="editModalSave" onClick={handleEditSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDetails;
