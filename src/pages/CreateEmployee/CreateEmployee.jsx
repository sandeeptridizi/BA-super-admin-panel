import React, { useState } from "react";
import "./CreateEmployee.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../../lib/employees";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    joiningDate: "",
    completeAddress: "",
    city: "",
    state: "",
    postalCode: "",
    aadhaarNumber: "",
    panNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    salary: "",
    bankAccountNumber: "",
    ifscCode: "",
    employmentStatus: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name?.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!form.email?.trim()) {
      setError("Email is required.");
      return;
    }
    if (!form.password) {
      setError("Password is required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      await createEmployee({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        designation: form.designation.trim() || undefined,
        department: form.department.trim() || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        bloodGroup: form.bloodGroup || undefined,
        joiningDate: form.joiningDate || undefined,
        completeAddress: form.completeAddress.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        postalCode: form.postalCode.trim() || undefined,
        aadhaarNumber: form.aadhaarNumber.trim() || undefined,
        panNumber: form.panNumber.trim() || undefined,
        emergencyContactName: form.emergencyContactName.trim() || undefined,
        emergencyContactPhone: form.emergencyContactPhone.trim() || undefined,
        salary: form.salary ? Number(form.salary.replace(/,/g, "")) : undefined,
        bankAccountNumber: form.bankAccountNumber.trim() || undefined,
        ifscCode: form.ifscCode.trim() || undefined,
        employmentStatus: form.employmentStatus || undefined,
      });
      navigate("/employees");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create employee.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/employees");

  return (
    <div className="create-employee-wrapper">

      <div className="page-header">
        <div className="back-btn" onClick={() => navigate("/employees")}>
          <FiArrowLeft />
        </div>
        <div>
          <h1>Create New Employee</h1>
          <p>Add a new team member to your organization</p>
        </div>
      </div>

      {error && (
        <div className="create-employee-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
      <div className="card-section">
        <div className="card-header">
          <h2>Employee Information</h2>
          <span>Enter the basic details of the employee</span>
        </div>

        <div className="form-grid">

          <div className="form-group full">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Sayyad Basheer Ahamad"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select
              className="inputtextoption"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select
              className="inputtextoption"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Joining Date *</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full">
            <label>Address *</label>
            <input
              type="text"
              name="completeAddress"
              value={form.completeAddress}
              onChange={handleChange}
              placeholder="e.g., 123, MG Road, Sector 5"
            />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g., Hyderabad"
            />
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="e.g., Telangana"
            />
          </div>

          <div className="form-group">
            <label>Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="e.g., 400001"
            />
          </div>

          <div className="form-group">
            <label>Aadhar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              placeholder="e.g., 1234 5678 9012"
            />
          </div>

          <div className="form-group">
            <label>PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              placeholder="e.g., ABCDE1234F"
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              placeholder="e.g., Priya Verma"
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input
              type="text"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              placeholder="+91 98765 12345"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="inputtextoption"
              name="designation"
              value={form.designation}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g., Sales, Operations"
            />
          </div>

          <div className="form-group">
            <label>Monthly Salary (₹)</label>
            <input
              type="text"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g., 75,000"
            />
          </div>

          <div className="form-group">
            <label>Bank Account Number</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              onChange={handleChange}
              placeholder="1234567890123456"
            />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
              placeholder="HDFC0001234"
            />
          </div>

        </div>
      </div>

      <div className="card-section yellow">
        <div className="card-header">
          <h2>Account Credentials</h2>
          <span>Create login credentials for admin panel access</span>
        </div>

        <div className="form-grid three">
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter strong password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="card-header">
          <h2>Employment Status</h2>
          <span>Set the initial account status for this employee</span>
        </div>

        <div className="form-group status-width">
          <label>Status *</label>
          <select
            className="inputtextoption"
            name="employmentStatus"
            value={form.employmentStatus}
            onChange={handleChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="PROBATION">Probation</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="RESIGNED">Resigned</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        <div className="form-footer">
          <button type="button" className="btn cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Creating…" : "Create Employee"}
          </button>
        </div>
      </div>
      </form>

    </div>
  );
}
