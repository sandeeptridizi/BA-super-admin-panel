import './Users.css';
import { useState, useEffect, useRef } from "react";

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
import api from "../../lib/api";

const Users = () => {

  const [selectedCat, setSelectedCat] = useState("marketplace");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMenuId, setActionMenuId] = useState(null);
  const actionMenuRef = useRef(null);
  const [productStats, setProductStats] = useState({ marketplace: 0, buynow: 0, auctions: 0, tolet: 0 });

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
    (async () => {
      try {
        const res = await api.get("/api/product");
        const products = res?.data?.data || [];
        setProductStats({
          marketplace: products.filter((p) => p.listingType === "MARKETPLACE").length,
          buynow: products.filter((p) => p.listingType === "BUY_NOW").length,
          auctions: products.filter((p) => p.listingType === "AUCTIONS").length,
          tolet: products.filter((p) => p.listingType === "TO_LET").length,
        });
      } catch {}
    })();
  }, []);

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
      <td><span onClick={() => navigate(`/userprofile/${u.id}`)} className='userproductnum'>{u._count?.ownedProducts ?? 0}</span></td>
      <td><span onClick={() => navigate(`/userprofile/${u.id}?tab=leads`)} className='userleadsnum'>{u.leads ?? 0}</span></td>
      <td><span className='userdatenum'>{formatDate(u.createdAt)}</span></td>
      <td className="actionCell">
        <div className="actionWrapper" ref={actionMenuId === u.id ? actionMenuRef : null}>
          <BsThreeDotsVertical className="actionDotsBtn" onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === u.id ? null : u.id); }} />
          {actionMenuId === u.id && (
            <div className="actionMenu">
              <button onClick={() => { setActionMenuId(null); navigate(`/userprofile/${u.id}`); }}><FiEye /> View</button>
              <button onClick={() => { setActionMenuId(null); navigate(`/userprofile/${u.id}?edit=true`); }}><FiEdit /> Edit</button>
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
      <div className='productstatsrow'>
        <div className='productstatbox'>
          <span className='productstatlabel'><AiOutlineShop /> Marketplace</span>
          <span className='productstatcount'>{productStats.marketplace}</span>
        </div>
        <div className='productstatbox'>
          <span className='productstatlabel'><BsLightningCharge /> Buy Now</span>
          <span className='productstatcount'>{productStats.buynow}</span>
        </div>
        <div className='productstatbox'>
          <span className='productstatlabel'><TbHammer /> Auctions</span>
          <span className='productstatcount'>{productStats.auctions}</span>
        </div>
        <div className='productstatbox'>
          <span className='productstatlabel'><FiHome /> To-let</span>
          <span className='productstatcount'>{productStats.tolet}</span>
        </div>
      </div>
      </div>
      {selectedCat === "marketplace" && renderCategoryTable("marketplace")}
      {selectedCat === "buynow" && renderCategoryTable("buynow")}
      {selectedCat === "auctions" && renderCategoryTable("auctions")}
      {selectedCat === "tolet" && renderCategoryTable("tolet")}
  </div>;
};

export default Users;
