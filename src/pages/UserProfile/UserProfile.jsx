import "./UserProfile.css";
import { useState, useEffect } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";

import { LuUsers } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { PiCube } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";

import { MdEmail } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { IoTimeOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { getUser, updateUser, deleteUser } from "../../lib/users";




const UserProfile = () => {

  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", city: "", state: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUser(id);
        if (!cancelled) setUser(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load user.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const getInitials = (name) => (name || "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const tierLabel = (s) => (s === "ACTIVE" ? "Elite" : s === "INACTIVE" ? "Basic" : s === "EXPIRED" ? "Expired" : s === "CANCELLED" ? "Cancelled" : s || "Basic");
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "";

  const openEditModal = () => {
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      city: user.city || "",
      state: user.state || "",
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await updateUser(id, editForm);
      setUser((prev) => ({ ...prev, ...res.data }));
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) return;
    try {
      await deleteUser(id);
      navigate("/users");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleToggleActive = async () => {
    const newStatus = !user.isActive;
    if (!window.confirm(`${newStatus ? "Activate" : "Deactivate"} this user?`)) return;
    try {
      const res = await updateUser(id, { isActive: newStatus });
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <div className="userProfileContainer"><div className="userTopBar"><div className="backUsers" onClick={() => navigate("/users")}><BiLeftArrowAlt /> Back to Users</div></div><p>Loading...</p></div>;
  if (error || !user) return <div className="userProfileContainer"><div className="userTopBar"><div className="backUsers" onClick={() => navigate("/users")}><BiLeftArrowAlt /> Back to Users</div></div><p>{error || "User not found."}</p></div>;

  const productCount = user.ownedProducts?.length ?? 0;

  return (
    <div className="userProfileContainer">
      <div className="userTopBar">
        <div className="backUsers" onClick={() => navigate("/users")}><BiLeftArrowAlt /> Back to Users</div>
        <div className="userTopBarActions">
          <button className="toggleActiveBtn" onClick={handleToggleActive}>
            {user.isActive ? "Deactivate" : "Activate"}
          </button>
          <button className="deleteUserBtn" onClick={handleDelete}><FiTrash2 /></button>
          <button className="editUserBtn" onClick={openEditModal}><FaRegEdit /> Edit User</button>
        </div>
      </div>
      <div className="userMainCard">
        <div className="usermainleft">
        <div className="avatarCircle">{getInitials(user.name)}</div>
        <p className="userplantag">{tierLabel(user.subscriptionStatus)} User</p></div>
        <div className="userInfoSection">
          <h2 className="userprofilenameheader">
            {user.name} <span className="activeBadge">{user.isActive ? "active" : "inactive"}</span>
          </h2>
          <p className="memberSince">Member since {formatDate(user.createdAt)}</p>
          <div className="infoGrid">
            <div className="infoBox blue"><MdOutlineEmail  className="useremailicon blue1" /> {user.email}</div>
            <div className="infoBox green"><FiPhone className="useremailicon green1"/> {user.phone || "\u2014"}</div>
            <div className="infoBox purple"><IoLocationOutline className="useremailicon purple1"/> {[user.city, user.state].filter(Boolean).join(", ") || "\u2014"}</div>
            <div className="infoBox yellow"><CiCalendar className="useremailicon yellow1"/>Joined: {formatDate(user.createdAt)}</div>
          </div>
        </div>
      </div>

      <div className="statsGrid">

        <div className="statCard">
            <div className="statcardrow">
          <HiOutlineCube className="useremailicon blue1" />
          <p className="statcardname blue2">PRODUCTS</p></div>
          <h3 className="statcardvalue">{productCount}</h3>
        </div>

        <div className="statCard">
            <div className="statcardrow">
          <LuUsers className="useremailicon green1" />
          <p className="statcardname green2">LEADS</p></div>
          <h3 className="statcardvalue">0</h3>
        </div>

        <div className="statCard">
            <div className="statcardrow">
          <LuUsers className="useremailicon yellow1" />
          <p className="statcardname yellow2">REVENUE</p></div>
          <h3 className="statcardvalue gold">\u2014</h3>
        </div>


      </div>

       <ul className='activitycat'>
              <li className={`catmenu3 ${activeTab === "products" ? "active-products" : ""}`} onClick={() => setActiveTab("products")}><PiCube />Products <span className='catnum1'>({productCount})</span> </li>
              <li className={`catmenu3 ${activeTab === "leads" ? "active-leads" : ""}`} onClick={() => setActiveTab("leads")}><LuUsers />Leads <span className='catnum1'>(0)</span> </li>
              <li className={`catmenu3 ${activeTab === "activity" ? "active-activity" : ""}`} onClick={() => setActiveTab("activity")}><FaArrowTrendUp />Activity</li>
        </ul>
        {activeTab === "products" && (<div className="productTable">

        <h3 className="publishedproducts"> <PiCube className="publishedicon"/>Published Products</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Leads</th>
            </tr>
          </thead>
          <tbody>
            {(!user.ownedProducts || user.ownedProducts.length === 0) ? (
              <tr><td colSpan={7}>No products</td></tr>
            ) : (
              user.ownedProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.title}</b>
                    {p.meta?.location && <div className="sub"><IoLocationOutline />{p.meta.location}</div>}
                  </td>
                  <td><span className="tag">{p.category?.replace(/_/g, " ") || "\u2014"}</span></td>
                  <td className="price">{p.value != null ? `\u20B9${(p.value / 1e5).toFixed(1)}L` : "\u2014"}</td>
                  <td className="pricetier">{p.tier || "\u2014"}</td>
                  <td><span className={`status ${p.approvalStatus?.toLowerCase()}`}>{p.approvalStatus?.toLowerCase() || "\u2014"}</span></td>
                  <td className="userleads">0</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>)}
        {activeTab === "leads" && (<div className="leadsWrapper">
      <div className="leadsHeader">
        <h3 className="userleadsheader"><LuUsers className="userleadsheadericon"/>Leads Received</h3>
      </div>

      <table className="leadsTable">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Contact</th>
            <th>Product Interest</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <div className="leadInfo">
                <div className="avatar">SN</div>
                <span>Suresh Nair</span>
              </div>
            </td>

            <td>
              <div className="contactBox email">
                <MdEmail className="icon" /> suresh@example.com
              </div>
              <div className="contactBox phone">
                <FiPhone className="icon" /> +91 98765 12345
              </div>
            </td>

            <td className="productinterest">2BHK Apartment</td>

            <td>
              <div className="dateBox">
                <IoCalendarOutline className="dateIcon" /> 28 Jan 2024
              </div>
            </td>

            <td>
              <span className="status new">new</span>
            </td>
          </tr>

          <tr>
            <td>
              <div className="leadInfo">
                <div className="avatar">MS</div>
                <span>Meera Shah</span>
              </div>
            </td>

            <td>
              <div className="contactBox email">
                <MdEmail className="icon" /> meera@example.com
              </div>
              <div className="contactBox phone">
                <FiPhone className="icon" /> +91 98765 12346
              </div>
            </td>

            <td className="productinterest">Vintage Watch</td>

            <td>
              <div className="dateBox">
                <IoCalendarOutline className="dateIcon" /> 27 Jan 2024
              </div>
            </td>

            <td>
              <span className="status contacted">contacted</span>
            </td>
          </tr>

          <tr>
            <td>
              <div className="leadInfo">
                <div className="avatar">KJ</div>
                <span>Karan Johar</span>
              </div>
            </td>

            <td>
              <div className="contactBox email">
                <MdEmail className="icon" /> karan@example.com
              </div>
              <div className="contactBox phone">
                <FiPhone className="icon" /> +91 98765 12347
              </div>
            </td>

            <td className="productinterest">2BHK Apartment</td>

            <td>
              <div className="dateBox">
                <IoCalendarOutline className="dateIcon" /> 26 Jan 2024
              </div>
            </td>

            <td>
              <span className="status qualified">qualified</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>)}
        {activeTab === "activity" && (<div className="activityWrapper">
      <div className="activityHeader">
        <HiOutlineTrendingUp className="activityHeaderIcon" />
        <h3>Recent Activity</h3>
      </div>

      <div className="timeline">

        <div className="timelineItem">
          <div className="timelineLeft">
            <div className="circle">1</div>
            <div className="verticalLine"></div>
          </div>

          <div className="timelineContent">
            <div>
              <h4>Listed a new product</h4>
              <p>2BHK Apartment</p>
            </div>

            <span className="timeBadge">
              <IoTimeOutline /> 2 days ago
            </span>
          </div>
        </div>

        <div className="timelineItem">
          <div className="timelineLeft">
            <div className="circle">2</div>
            <div className="verticalLine"></div>
          </div>

          <div className="timelineContent">
            <div>
              <h4>Received a lead</h4>
              <p>From Suresh Nair</p>
            </div>

            <span className="timeBadge">
              <IoTimeOutline /> 3 days ago
            </span>
          </div>
        </div>

        <div className="timelineItem">
          <div className="timelineLeft">
            <div className="circle">3</div>
            <div className="verticalLine"></div>
          </div>

          <div className="timelineContent">
            <div>
              <h4>Updated product</h4>
              <p>Vintage Watch</p>
            </div>

            <span className="timeBadge">
              <IoTimeOutline /> 5 days ago
            </span>
          </div>
        </div>

        <div className="timelineItem">
          <div className="timelineLeft">
            <div className="circle">4</div>
          </div>

          <div className="timelineContent">
            <div>
              <h4>Product sold</h4>
              <p>Antique Chair</p>
            </div>

            <span className="timeBadge">
              <IoTimeOutline /> 1 week ago
            </span>
          </div>
        </div>

      </div>
    </div>)}

      {showEditModal && (
        <div className="editModalOverlay" onClick={() => setShowEditModal(false)}>
          <div className="editModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="editModalHeader">
              <h2>Edit User</h2>
              <button className="editModalClose" onClick={() => setShowEditModal(false)}><IoClose /></button>
            </div>
            <div className="editModalBody">
              <label>Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <label>Phone</label>
              <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              <label>City</label>
              <input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
              <label>State</label>
              <input type="text" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
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

export default UserProfile;
