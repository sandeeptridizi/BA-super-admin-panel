import './Users.css';
import { useState, useEffect, useRef } from "react";
import PublishedProductsPopup from "../../components/ProductPopup/productpopup";
import LeadsPopup from "../../components/LeadsPopup/LeadsPopup";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { AiOutlineShop } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { TbHammer } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { getUsers, deleteUser } from "../../lib/users";

const Users = () => {

  const [selectedCat, setSelectedCat] = useState("marketplace");
  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => {setShowPopup(true);};
  const closePopup = () => {setShowPopup(false);};
  const navigate = useNavigate();
  const [showLeadsPopup, setShowLeadsPopup] = useState(false);
  const openLeadsPopup = () => setShowLeadsPopup(true);
  const closeLeadsPopup = () => setShowLeadsPopup(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMenuId, setActionMenuId] = useState(null);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUsers({ search: searchQuery || undefined });
        if (!cancelled) setUsers(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteUser = async (id, name) => {
    setActionMenuId(null);
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const getInitials = (name) => (name || "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "";
  const tierLabel = (s) => (s === "ACTIVE" ? "Elite" : s === "INACTIVE" ? "Basic" : s === "EXPIRED" ? "Expired" : s === "CANCELLED" ? "Cancelled" : s || "Basic");
  const tierClass = (s) => (s === "ACTIVE" ? "userplantags1" : s === "INACTIVE" ? "userplantags" : "userplantags2");

  const renderUserRow = (u) => (
    <tr key={u.id}>
      <td onClick={() => navigate(`/userprofile/${u.id}`)}>
        <div className='userrowdata'>
          <div className={u.subscriptionStatus === "ACTIVE" ? "userprofile1" : u.subscriptionStatus === "INACTIVE" ? "userprofile" : "userprofile2"}>{getInitials(u.name)}</div>
          <div className='userprofileinfo'>
            <div className='userprofilename'>{u.name}</div>
            <div className='userprofileemail'>{u.email}</div>
          </div>
        </div>
      </td>
      <td><span className={tierClass(u.subscriptionStatus)}>{tierLabel(u.subscriptionStatus)}</span></td>
      <td><span className={u.isActive ? 'userstatustags' : 'userstatustags1'}>{u.isActive ? "active" : "inactive"}</span></td>
      <td><span onClick={() => setShowPopup(true)} className='userproductnum'>{u._count?.ownedProducts ?? 0}</span></td>
      <td><span onClick={openLeadsPopup} className='userleadsnum'>0</span></td>
      <td><span className='userdatenum'>{formatDate(u.createdAt)}</span></td>
      <td className="actionCell">
        <div className="actionWrapper" ref={actionMenuId === u.id ? actionMenuRef : null}>
          <BsThreeDotsVertical className="actionDotsBtn" onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === u.id ? null : u.id); }} />
          {actionMenuId === u.id && (
            <div className="actionMenu">
              <button onClick={() => { setActionMenuId(null); navigate(`/userprofile/${u.id}`); }}><FiEye /> View</button>
              <button onClick={() => { setActionMenuId(null); navigate(`/userprofile/${u.id}`); }}><FiEdit /> Edit</button>
              <button className="actionMenuDelete" onClick={() => handleDeleteUser(u.id, u.name)}><FiTrash2 /> Delete</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );

  const renderCategoryTable = (catKey) => (
    <div>
      <div className="productcatmain2">
        {catKey !== "marketplace" && <FiSearch className="searchIcon1" />}
        <input type="text" placeholder="Search users by name or email..." className="searchInput1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <ul className='userscategory'>
        <li className='usercategoryname'>All Users</li>
        <li className='usercategoryname'>Basic</li>
        <li className='usercategoryname'>Elite</li>
        <li className='usercategoryname'>Pro</li>
      </ul>
      {error && <p className="userError">{error}</p>}
      <table className="producttable">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Status</th>
            <th>Products</th>
            <th>Leads</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7}>Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={7}>No users found</td></tr>
          ) : (
            users.map(renderUserRow)
          )}
        </tbody>
      </table>
      <PublishedProductsPopup open={showPopup} onClose={() => setShowPopup(false)}/>
      <LeadsPopup open={showLeadsPopup} onClose={closeLeadsPopup} />
    </div>
  );


  return <div className='userscontainer'>
    <div className='producthead'>
          <div className='productheadinfo'>
            <h1 className='productsheader'>Users</h1>
            <span className='productheaddesc'>Complete User Management</span>
          </div>
          <button  onClick={() => navigate("/create-user")} className='addproduct'><FiUserPlus />Add User</button>
    </div>
    <ul className='userstats'>
      <li className='userstat'>
        <div className='userstattitle'>Total Users</div>
        <div className='userstatvalue'>{loading ? "\u2026" : totalUsers.toLocaleString()}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon'></span>Basic Users</div>
        <div className='userstatvalue'>{loading ? "\u2026" : (users.filter((u) => u.subscriptionStatus === "INACTIVE").length).toLocaleString()}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon1'></span>Elite Users</div>
        <div className='userstatvalue'>{loading ? "\u2026" : (users.filter((u) => u.subscriptionStatus === "ACTIVE").length).toLocaleString()}</div>
      </li>
      <li className='userstat'>
        <div className='userstattitle'><span className='userdoticon2'></span>Pro Users</div>
        <div className='userstatvalue'>{loading ? "\u2026" : (users.filter((u) => u.subscriptionStatus === "EXPIRED" || u.subscriptionStatus === "CANCELLED").length).toLocaleString()}</div>
      </li>
    </ul>
    <div className='userproductstats'>
      <ul className='productcat1'>
          <li
            className={`productcatname ${selectedCat === "marketplace" ? "active" : ""}`}
            onClick={() => setSelectedCat("marketplace")}
          >
            <AiOutlineShop /> Marketplace
          </li>

          <li
            className={`productcatname ${selectedCat === "buynow" ? "active" : ""}`}
            onClick={() => setSelectedCat("buynow")}
          >
            <BsLightningCharge /> Buy Now
          </li>

          <li
            className={`productcatname ${selectedCat === "auctions" ? "active" : ""}`}
            onClick={() => setSelectedCat("auctions")}
          >
            <TbHammer /> Auctions
          </li>

          <li
            className={`productcatname ${selectedCat === "tolet" ? "active" : ""}`}
            onClick={() => setSelectedCat("tolet")}
          >
            <FiHome /> To-let
          </li>
      </ul>

      {selectedCat === "marketplace" && <div>
      <ul className='userstats1'>
        <li className='userstat1'>
          <div className='userstattitle'>Users Selling</div>
          <div className='userstatvalue'>2,345</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle'>Active Listings</div>
          <div className='userstatvalue'>8,932</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle'>Avg Price</div>
          <div className='userstatvalue'>\u20B945L</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle'>Total Value</div>
          <div className='userstatvalue'>\u20B9165Cr</div>
        </li>
      </ul>
      </div>}
      {selectedCat === "buynow" && <div>
      <ul className='userstats1'>
        <li className='userstat1'>
          <div className='userstattitle1'>Users Selling</div>
          <div className='userstatvalue1'>2,345</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle1'>Active Listings</div>
          <div className='userstatvalue1'>8,932</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle1'>Avg Price</div>
          <div className='userstatvalue1'>\u20B945L</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle1'>Total Value</div>
          <div className='userstatvalue1'>\u20B9165Cr</div>
        </li>
      </ul>
      </div>}
      {selectedCat === "auctions" && <div>
      <ul className='userstats1'>
        <li className='userstat1'>
          <div className='userstattitle2'>Users Selling</div>
          <div className='userstatvalue2'>2,345</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle2'>Active Listings</div>
          <div className='userstatvalue2'>8,932</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle2'>Avg Price</div>
          <div className='userstatvalue2'>\u20B945L</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle2'>Total Value</div>
          <div className='userstatvalue2'>\u20B9165Cr</div>
        </li>
      </ul>
      </div>}
      {selectedCat === "tolet" && <div>
      <ul className='userstats1'>
        <li className='userstat1'>
          <div className='userstattitle3'>Users Selling</div>
          <div className='userstatvalue3'>2,345</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle3'>Active Listings</div>
          <div className='userstatvalue3'>8,932</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle3'>Avg Price</div>
          <div className='userstatvalue3'>\u20B945L</div>
        </li>
        <li className='userstat1'>
          <div className='userstattitle3'>Total Value</div>
          <div className='userstatvalue3'>\u20B9165Cr</div>
        </li>
      </ul>
      </div>}
      </div>
      {selectedCat === "marketplace" && renderCategoryTable("marketplace")}
      {selectedCat === "buynow" && renderCategoryTable("buynow")}
      {selectedCat === "auctions" && renderCategoryTable("auctions")}
      {selectedCat === "tolet" && renderCategoryTable("tolet")}
  </div>;
};

export default Users;
