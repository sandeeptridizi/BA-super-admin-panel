import React, { useState, useEffect } from "react";
import "./Financials.css";
import {
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";
import { MdCurrencyRupee } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { LuTarget } from "react-icons/lu";
import CouponCreation from "../../components/CouponCreation/CouponCreation";
import PackageCreation from "../../components/PackageCreation/PackageCreation";
import {
  getRevenueStats,
  getCoupons,
  getCouponStats,
  deleteCoupon as deleteCouponApi,
  getPackages,
  deletePackage as deletePackageApi,
} from "../../lib/financials";

const PERIOD_MAP = {
  Today: "today",
  "This Week": "this_week",
  "Last Week": "last_week",
  "This Month": "this_month",
  "Last Month": "last_month",
  "This Quarter": "this_quarter",
};

const TAB_CATEGORY_MAP = {
  subscriptionplans: "SUBSCRIPTION_PLAN",
  bannerads: "BANNER_AD",
  featuredlistings: "FEATURED_LISTING",
  leadunlocks: "LEAD_UNLOCK",
  digitalmedia: "DIGITAL_MEDIA",
};

function formatCurrency(paise) {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(2)}L`;
  if (rupees >= 1000) return `₹${rupees.toLocaleString("en-IN")}`;
  return `₹${rupees}`;
}

export default function FinancialDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState("subscriptionplans");
  const [period, setPeriod] = useState("today");

  // Data states
  const [revenue, setRevenue] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async (p) => {
    try {
      const res = await getRevenueStats(p);
      setRevenue(res.data);
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const [couponsRes, statsRes] = await Promise.all([
        getCoupons(),
        getCouponStats(),
      ]);
      setCoupons(couponsRes.data);
      setCouponStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
  };

  const fetchPackages = async (category) => {
    try {
      const res = await getPackages(category);
      setPackages(res.data);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchRevenue(period),
        fetchCoupons(),
        fetchPackages(TAB_CATEGORY_MAP[activeTab]),
      ]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchRevenue(period);
  }, [period]);

  useEffect(() => {
    fetchPackages(TAB_CATEGORY_MAP[activeTab]);
  }, [activeTab]);

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCouponApi(id);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleCouponSaved = () => {
    handleCloseModal();
    fetchCoupons();
  };

  const isCouponActive = (coupon) =>
    coupon.isActive && new Date(coupon.validTo) >= new Date();

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await deletePackageApi(id);
      fetchPackages(TAB_CATEGORY_MAP[activeTab]);
    } catch (err) {
      console.error("Failed to delete package:", err);
    }
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowPkgModal(true);
  };

  const handleClosePkgModal = () => {
    setShowPkgModal(false);
    setEditingPackage(null);
  };

  const handlePackageSaved = () => {
    handleClosePkgModal();
    fetchPackages(TAB_CATEGORY_MAP[activeTab]);
  };

  return (
    <div className="finance-page">
      <div className="finance-header">
        <div>
          <h1>Financials & Packages</h1>
          <p>Manage pricing, monitor revenue & track financial performance</p>
        </div>

        <select
          className="today-btn"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {Object.entries(PERIOD_MAP).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={revenue ? formatCurrency(revenue.totalRevenue) : "..."}
        />
        <StatCard
          title="Total Sales"
          value={revenue ? String(revenue.totalSales) : "..."}
        />
        <StatCard
          title="Avg Transaction"
          value={revenue ? formatCurrency(revenue.avgTransaction) : "..."}
        />
        <StatCard
          title="Monthly Recurring"
          value={revenue ? formatCurrency(revenue.monthlyRecurring) : "..."}
          highlight
        />
      </div>

      <div className="coupon-wrapper">
        <div className="coupon-header">
          <div>
            <h3>
              <RiCoupon3Line className="couponicon" />
              Coupon Management
            </h3>
            <p>Create and manage discount coupons for packages</p>
          </div>
          <button
            className="create-btn"
            onClick={() => {
              setEditingCoupon(null);
              setShowModal(true);
            }}
          >
            <FiPlus /> Create Coupon
          </button>
          {showModal && (
            <CouponCreation
              onClose={handleCloseModal}
              onSaved={handleCouponSaved}
              coupon={editingCoupon}
            />
          )}
        </div>

        <div className="coupon-grid">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              active={isCouponActive(coupon)}
              onEdit={() => handleEditCoupon(coupon)}
              onDelete={() => handleDeleteCoupon(coupon.id)}
            />
          ))}
          <CouponStatsCard stats={couponStats} />
        </div>
      </div>

      <ul className="activitycat2">
        <li
          className={`catmenu5 ${activeTab === "subscriptionplans" ? "active-subscriptionplans" : ""}`}
          onClick={() => setActiveTab("subscriptionplans")}
        >
          Subscription Plans
        </li>
        <li
          className={`catmenu5 ${activeTab === "bannerads" ? "active-bannerads" : ""}`}
          onClick={() => setActiveTab("bannerads")}
        >
          Banner Ads
        </li>
        <li
          className={`catmenu5 ${activeTab === "featuredlistings" ? "active-featuredlistings" : ""}`}
          onClick={() => setActiveTab("featuredlistings")}
        >
          Featured Listings
        </li>
        <li
          className={`catmenu5 ${activeTab === "leadunlocks" ? "active-leadunlocks" : ""}`}
          onClick={() => setActiveTab("leadunlocks")}
        >
          Lead Unlocks
        </li>
        <li
          className={`catmenu5 ${activeTab === "digitalmedia" ? "active-digitalmedia" : ""}`}
          onClick={() => setActiveTab("digitalmedia")}
        >
          Digital Media
        </li>
      </ul>

      <div className="subscription-wrapper">
        <div className="subscription-header">
          <h3>
            {activeTab === "subscriptionplans" && "Subscription Plans"}
            {activeTab === "bannerads" && "Banner Ads"}
            {activeTab === "featuredlistings" && "Featured Listings"}
            {activeTab === "leadunlocks" && "Lead Unlocks"}
            {activeTab === "digitalmedia" && "Digital Media"}
          </h3>
          <button
            className="create-btn"
            onClick={() => {
              setEditingPackage(null);
              setShowPkgModal(true);
            }}
          >
            <FiPlus /> Add Package
          </button>
        </div>

        {showPkgModal && (
          <PackageCreation
            onClose={handleClosePkgModal}
            onSaved={handlePackageSaved}
            pkg={editingPackage}
            defaultCategory={TAB_CATEGORY_MAP[activeTab]}
          />
        )}

        <div className={packages.length <= 3 ? "plans-grid1" : "plans-grid"}>
          {packages.length === 0 && !loading && (
            <p style={{ color: "#888", padding: "1rem" }}>
              No packages found. Add one to get started.
            </p>
          )}
          {packages.map((pkg) => (
            <PlanCard
              key={pkg.id}
              pkg={pkg}
              title={pkg.title}
              price={`₹ ${pkg.price.toLocaleString("en-IN")}`}
              tag={pkg.tag}
              features={pkg.features}
              onEdit={() => handleEditPackage(pkg)}
              onDelete={() => handleDeletePackage(pkg.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, growth, highlight }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <div className="stat-row">
        <h2 className={highlight ? "highlight-text" : ""}>{value}</h2>
        {growth && <span className="growth-badge">{growth}</span>}
      </div>
    </div>
  );
}

function CouponCard({ coupon, active, onEdit, onDelete }) {
  const discount =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue.toLocaleString("en-IN")} OFF`;

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
  };

  return (
    <div
      className={`coupon-card ${active ? "active" : ""} ${!active ? "expired" : ""}`}
    >
      <div className="coupon-top">
        <span className={`status ${active ? "green" : "gray"}`}>
          {active ? "ACTIVE" : "EXPIRED"}
        </span>
        <span className="discount-tag">{discount}</span>
      </div>

      <div className="coupon-code" onClick={handleCopy} style={{ cursor: "pointer" }}>
        {coupon.code}
        <FiCopy size={14} />
      </div>

      <ul className="coupon-details">
        {coupon.maxDiscount && (
          <li className="couponrow">
            <MdCurrencyRupee className="couponicon1" /> Max Discount: ₹
            {coupon.maxDiscount.toLocaleString("en-IN")}
          </li>
        )}
        <li className="couponrow">
          <LuUsers className="couponicon1" /> Used: {coupon.usedCount}
          {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ""}
        </li>
        <li className="couponrow">
          <CiCalendar className="couponicon1" /> Valid till:{" "}
          {new Date(coupon.validTo).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </li>
        <li className="couponrow">
          <LuTarget className="couponicon1" />
          Applies to: {coupon.appliesTo}
        </li>
      </ul>

      <div className="coupon-actions">
        {active ? (
          <>
            <button className="coupedit-btn" onClick={onEdit}>
              <FiEdit2 /> Edit
            </button>
            <button className="coupdelete-btn" onClick={onDelete}>
              <FiTrash2 /> Delete
            </button>
          </>
        ) : (
          <button className="coupdelete-btn" onClick={onDelete}>
            <FiTrash2 /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function CouponStatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="coupon-stats">
      <h4>Coupon Statistics</h4>

      <div className="stat-line">
        <span>Active Coupons</span>
        <b className="green-text">{stats.activeCoupons}</b>
      </div>
      <div className="stat-line">
        <span>Expired Coupons</span>
        <b>{stats.expiredCoupons}</b>
      </div>
      <div className="stat-line">
        <span>Total Uses</span>
        <b className="blue-text2">{stats.totalUses}</b>
      </div>
      <div className="stat-line">
        <span>Total Discount Given</span>
        <b className="gold-text">
          ₹{stats.totalDiscountGiven.toLocaleString("en-IN")}
        </b>
      </div>
    </div>
  );
}

function PlanCard({ title, price, tag, features, onEdit, onDelete }) {
  return (
    <div className="plan-card">
      {tag && <span className="plan-tag blue">{tag}</span>}
      <div className="plan-actions">
        <button className="plan-action-btn edit" onClick={onEdit} title="Edit">
          <FiEdit2 />
        </button>
        <button className="plan-action-btn delete" onClick={onDelete} title="Delete">
          <FiTrash2 />
        </button>
      </div>
      <h4>{title}</h4>
      <h2>{price}</h2>
      <p className="gst">{tag || "+ GST"}</p>
      {features && features.length > 0 && (
        <p className="features-count">{features.length} feature{features.length !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}
