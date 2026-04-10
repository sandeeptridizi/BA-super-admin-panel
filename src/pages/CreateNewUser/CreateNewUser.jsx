import "./CreateNewUser.css";
import { BiLeftArrowAlt } from "react-icons/bi";
import { AiOutlineShop } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { TbHammer } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../lib/users";

const CreateNewUser = () => {

  const [category, setCategory] = useState("marketplace");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isActive") setForm((f) => ({ ...f, isActive: value === "Active" }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError("Name, email and password are required.");
      return;
    }
    if (form.password.length < 6 || form.password.length > 12) {
      setError("Password must be between 6 and 12 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone?.trim() || undefined,
        city: form.city?.trim() || undefined,
        state: form.state?.trim() || undefined,
      });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createUserContainer">

      <div className="createUserHeader">
        <div className="backBtn" onClick={() => navigate("/users")}><BiLeftArrowAlt/></div>
        <div>
          <h2 className="createuserheading">Create New User</h2>
          <p className="createuserdesc">Add a new user to the Billionaire Auction platform</p>
        </div>
      </div>

      <div className="businessCard">

        <div className="cardTitle">
          <h3 className="usercreatecategory"> <AiOutlineShop className="businesscategoryicon"/> Business Category</h3>
          <span userinfoheader>Select the primary business mode for this user</span>
        </div>

        <p className="primaryLabel">Primary Category</p>

        <div className="categoryRow">

          <div 
            className={`categoryBox ${category==="marketplace"?"activeCat":""}`}
            onClick={()=>setCategory("marketplace")}
          >
            <AiOutlineShop/>
            <span>Marketplace</span>
          </div>

          <div 
            className={`categoryBox ${category==="buynow"?"activeCat":""}`}
            onClick={()=>setCategory("buynow")}
          >
            <BsLightningCharge/>
            <span>Buy Now</span>
          </div>

          <div 
            className={`categoryBox ${category==="auction"?"activeCat":""}`}
            onClick={()=>setCategory("auction")}
          >
            <TbHammer/>
            <span>Auctions</span>
          </div>

          <div 
            className={`categoryBox ${category==="tolet"?"activeCat":""}`}
            onClick={()=>setCategory("tolet")}
          >
            <FiHome/>
            <span>To-Let</span>
          </div>

        </div>
      </div>

      <div className="bottomGrid">

        <div className="userInfoCard">

          <div className="cardTitle1">
            <h3 className="usercardtitle">User Information</h3>
            <span className="userinfoheader">Enter the basic details of the user</span>
          </div>

          {error && <p className="createUserError">{error}</p>}
          <div className="formGroup">
              <label className="userinfotitle">Full Name</label>
              <input name="name" className="userforminput" placeholder="e.g., Priya Sharma" value={form.name} onChange={handleChange}/>
            </div>

          <div className="formGrid">

            <div className="formGroup">
              <label className="userinfotitle">Email Address</label>
              <input name="email" type="email" className="userforminput" placeholder="e.g., priya@example.com" value={form.email} onChange={handleChange}/>
            </div>

            <div className="formGroup">
              <label className="userinfotitle">Password</label>
              <input name="password" type="password" className="userforminput" placeholder="Set a password" value={form.password} onChange={handleChange}/>
            </div>

            <div className="formGroup">
              <label className="userinfotitle">Phone Number</label>
              <input name="phone" className="userforminput" placeholder="e.g., +91 98765 43210" value={form.phone} onChange={handleChange}/>
            </div>

            <div className="formGroup">
              <label className="userinfotitle">City</label>
              <input name="city" className="userforminput" placeholder="e.g., Mumbai" value={form.city} onChange={handleChange}/>
            </div>

            <div className="formGroup">
              <label className="userinfotitle">State</label>
              <input name="state" className="userforminput" placeholder="e.g., Maharashtra" value={form.state} onChange={handleChange}/>
            </div>

          </div>

        </div>

        <div className="accountCard">

          <div className="cardTitle1">
            <h3 className="usercardtitle">Account Settings</h3>
            <span className="userinfoheader">User account status</span>
          </div>

          <div className="formGroup">
            <label>Status</label>
            <select name="isActive" className="userforminput" value={form.isActive ? "Active" : "Inactive"} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "Active" }))}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        
          <button type="button" className="createBtn" onClick={handleSubmit} disabled={submitting}>{submitting ? "Creating…" : "Create User"}</button>
          <button type="button" className="cancelBtn" onClick={() => navigate("/users")}>Cancel</button>

        </div>

      </div>

    </div>
  );
};

export default CreateNewUser;
