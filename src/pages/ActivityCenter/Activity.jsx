import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Activity.css';
import { FiActivity } from "react-icons/fi"
import { MdAccessTime, MdVerified } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

import { AiOutlineShop } from "react-icons/ai";
import { LuCrown } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { BsStars } from "react-icons/bs";
import { SlBadge } from "react-icons/sl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbHammer } from "react-icons/tb";
import { BsLightningCharge } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import {
  fetchPendingApprovals,
  fetchAllApprovedProducts,
  approveProduct as apiApproveProduct,
  updateFeaturedRecommended as apiUpdateFeaturedRecommended,
} from "../../lib/activity";
import { getFile } from "../../lib/s3";
import api from "../../lib/api";
import {
  getAdvertisements,
  getAdvertisementStats,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../../lib/advertisements";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const LISTING_LABELS = { MARKETPLACE: "Marketplace", BUY_NOW: "Buy Now", AUCTIONS: "Auctions", TO_LET: "To-let" };
const CATEGORY_LABELS = { REAL_ESTATE: "Properties", CARS: "Cars", BIKES: "Bikes", FURNITURE: "Furniture", JEWELLERY_AND_WATCHES: "Watches", ARTS_AND_PAINTINGS: "Arts", ANTIQUES: "Antiques", COLLECTABLES: "Collectables" };
const formatCurrency = (v) => v != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(v)) : "N/A";
const getLocation = (meta) => meta && typeof meta === "object" && (meta.location || meta.city || [meta.area, meta.city].filter(Boolean).join(", ") || meta.state || meta.address) || "—";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";

const PLACEMENT_OPTIONS = ["homepage_banner", "popup_ad", "product_listing"];
const PLACEMENT_LABELS = { homepage_banner: "Homepage Banner", popup_ad: "Popup Ad", product_listing: "Product Listing" };
const PLACEMENT_DIMENSIONS = { homepage_banner: "1356 × 428", popup_ad: "398 × 404", product_listing: "398 × 404" };

const Activitypage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("approvals");
    const [pendingProducts, setPendingProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actioningId, setActioningId] = useState(null);
    const [featuredSearch, setFeaturedSearch] = useState("");

    const [ads, setAds] = useState([]);
    const [adStats, setAdStats] = useState({ total: 0 });
    const [adsLoading, setAdsLoading] = useState(false);
    const [adForm, setAdForm] = useState({ title: "", content: "", ctaText: "", ctaUrl: "", placement: "" });
    const [editingAdId, setEditingAdId] = useState(null);
    const [adMediaKey, setAdMediaKey] = useState(null);
    const [adSelectedFile, setAdSelectedFile] = useState(null);
    const [adFilePreview, setAdFilePreview] = useState(null);
    const [adSubmitting, setAdSubmitting] = useState(false);
    const adFileInputRef = useRef(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [pRes, fRes] = await Promise.all([fetchPendingApprovals(), fetchAllApprovedProducts()]);
            setPendingProducts(pRes.data || []);
            setFeaturedProducts(fRes.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load activity");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const loadAds = useCallback(async () => {
        setAdsLoading(true);
        try {
            const [adsRes, statsRes] = await Promise.all([getAdvertisements(), getAdvertisementStats()]);
            setAds(adsRes.data || []);
            setAdStats(statsRes.data || { total: 0 });
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load advertisements");
        } finally {
            setAdsLoading(false);
        }
    }, []);

    useEffect(() => { loadAds(); }, [loadAds]);

    const resetAdForm = () => {
        setAdForm({ title: "", content: "", ctaText: "", ctaUrl: "", placement: "" });
        setEditingAdId(null);
        setAdMediaKey(null);
        setAdSelectedFile(null);
        setAdFilePreview(null);
        if (adFileInputRef.current) adFileInputRef.current.value = "";
    };

    const handleAdFormChange = (e) => {
        const { name, value } = e.target;
        setAdForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (adFilePreview && !adMediaKey) URL.revokeObjectURL(adFilePreview);
        setAdSelectedFile(file);
        setAdFilePreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    const uploadAdFile = async (file, adId) => {
        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 50);
        const key = `advertisements/${adId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`;
        const presignedRes = await api.get("/api/media/presigned", { params: { key } });
        const uploadUrl = presignedRes.data?.data?.url || presignedRes.data?.url || presignedRes.data?.data;
        await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
        return presignedRes.data?.data?.key || presignedRes.data?.key || key;
    };

    const handleAdSubmit = async (e) => {
        e.preventDefault();
        if (!adForm.title.trim()) { setError("Title is required."); return; }
        setAdSubmitting(true);
        setError("");
        try {
            const payload = {
                title: adForm.title.trim(),
                content: adForm.content.trim() || null,
                ctaText: adForm.ctaText.trim() || null,
                ctaUrl: adForm.ctaUrl.trim() || null,
                placement: adForm.placement || null,
            };
            if (editingAdId) {
                let updatedMedia = adMediaKey;
                if (adSelectedFile) updatedMedia = await uploadAdFile(adSelectedFile, editingAdId);
                payload.media = updatedMedia;
                await updateAdvertisement(editingAdId, payload);
            } else {
                const res = await createAdvertisement(payload);
                const adId = res.data?.id;
                if (adSelectedFile && adId) {
                    const uploadedKey = await uploadAdFile(adSelectedFile, adId);
                    await updateAdvertisement(adId, { media: uploadedKey });
                }
            }
            resetAdForm();
            loadAds();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to save advertisement.");
        } finally {
            setAdSubmitting(false);
        }
    };

    const handleAdEdit = (ad) => {
        setEditingAdId(ad.id);
        setAdForm({
            title: ad.title || "",
            content: ad.content || "",
            ctaText: ad.ctaText || "",
            ctaUrl: ad.ctaUrl || "",
            placement: ad.placement || "",
        });
        if (ad.media) {
            setAdMediaKey(ad.media);
            setAdFilePreview(getFile(ad.media));
        } else {
            setAdMediaKey(null);
            setAdFilePreview(null);
        }
        setAdSelectedFile(null);
    };

    const handleAdDelete = async (id) => {
        if (!confirm("Delete this advertisement?")) return;
        setActioningId(id);
        try {
            await deleteAdvertisement(id);
            setAds((prev) => prev.filter((a) => a.id !== id));
            setAdStats((prev) => ({ ...prev, total: prev.total - 1 }));
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to delete advertisement");
        } finally {
            setActioningId(null);
        }
    };

    const [rejectModal, setRejectModal] = useState({ open: false, productId: null });
    const [rejectReason, setRejectReason] = useState("");

    const [auctionModal, setAuctionModal] = useState({ open: false, productId: null, tier: null });
    const [auctionOption, setAuctionOption] = useState("tba");
    const [auctionVenue, setAuctionVenue] = useState("");
    const [auctionDate, setAuctionDate] = useState("");

    const [tierModal, setTierModal] = useState({ open: false, productId: null, tier: null, productTitle: "" });

    const handleApprove = async (id, approvalStatus, tier) => {
        if (approvalStatus === "REJECTED") {
            setRejectModal({ open: true, productId: id });
            setRejectReason("");
            return;
        }
        const product = pendingProducts.find((p) => p.id === id);
        if (product?.listingType === "AUCTIONS") {
            setAuctionModal({ open: true, productId: id, tier });
            setAuctionOption("tba");
            setAuctionVenue("");
            setAuctionDate("");
            return;
        }
        setTierModal({ open: true, productId: id, tier, productTitle: product?.title || "" });
    };

    const handleTierApproveConfirm = async () => {
        const { productId: id, tier } = tierModal;
        setTierModal({ open: false, productId: null, tier: null, productTitle: "" });
        setActioningId(id);
        try {
            await apiApproveProduct(id, { approvalStatus: "APPROVED", tier });
            setPendingProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const handleAuctionApproveConfirm = async () => {
        if (auctionOption === "enter" && (!auctionVenue.trim() || !auctionDate)) return;
        const { productId: id, tier } = auctionModal;
        setAuctionModal({ open: false, productId: null, tier: null });
        setActioningId(id);
        try {
            const product = pendingProducts.find((p) => p.id === id);
            const existingMeta = product?.meta && typeof product.meta === "object" ? product.meta : {};
            const auctionMeta = auctionOption === "tba"
                ? { auctionVenue: "Will be announced soon", auctionDate: "TBA" }
                : { auctionVenue: auctionVenue.trim(), auctionDate: new Date(auctionDate).toISOString() };
            await apiApproveProduct(id, {
                approvalStatus: "APPROVED",
                tier,
                meta: { ...existingMeta, ...auctionMeta },
            });
            setPendingProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) return;
        const id = rejectModal.productId;
        setRejectModal({ open: false, productId: null });
        setActioningId(id);
        try {
            await apiApproveProduct(id, { approvalStatus: "REJECTED", rejectionReason: rejectReason.trim() });
            setPendingProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const handleFeaturedRecommended = async (id, isFeatured, isRecommended, isVerified) => {
        setActioningId(id);
        try {
            await apiUpdateFeaturedRecommended(id, { isFeatured, isRecommended, isVerified });
            setFeaturedProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured, isRecommended, isVerified } : p)));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const pendingCount = pendingProducts.length;
    const featuredCount = featuredProducts.filter((p) => p.isFeatured || p.isRecommended || p.isVerified).length;
    const featuredFiltered = !featuredSearch.trim()
        ? featuredProducts
        : featuredProducts.filter((p) => {
            const q = featuredSearch.trim().toLowerCase();
            const title = (p.title || "").toLowerCase();
            const cat = (CATEGORY_LABELS[p.category] || p.category || "").toLowerCase();
            const loc = getLocation(p.meta).toLowerCase();
            const val = String(p.value || "").toLowerCase();
            return title.includes(q) || cat.includes(q) || loc.includes(q) || val.includes(q);
          });

    return <div className='activitycontainer'>
    <div className='activityheader'>
        <h1 className='activityheadline'><FiActivity className="activityicon" /><span className="gradient-text">Activity Center</span></h1>
        <p className='activitydesc'>Manage product approvals, advertisements, and featured listings</p>
    </div>
    <div className='activityanalytics'>
        <div className='activityanalytic'>
            <div className='analyticheader'>
                <h2>Pending Approvals</h2>
                <span className='analyticsicon'><MdAccessTime /></span>
            </div>
            <h2 className='analyticnum'>{loading ? "—" : pendingCount}</h2>
            <span className='analyticdesc'>Products awaiting review</span>
        </div>
        <div className='activityanalytic1'>
            <div className='analyticheader1'>
                <h2>Active Ads</h2>
                <span className='analyticsicon'><FaArrowTrendUp /></span>
            </div>
            <h2 className='analyticnum1'>{adsLoading ? "—" : adStats.total || 0}</h2>
            <span className='analyticdesc1'>Total advertisements</span>
        </div>
        <div className='activityanalytic2'>
            <div className='analyticheader2'>
                <h2>Featured Items</h2>
                <span className='analyticsicon'><FaRegStar /></span>
            </div>
            <h2 className='analyticnum2'>{loading ? "—" : featuredCount}</h2>
            <span className='analyticdesc2'>Premium highlighted products</span>
        </div>
    </div>
    <ul className='activitycat'>
        <li className={`catmenu2 ${activeTab === "approvals" ? "active-approvals" : ""}`} onClick={() => setActiveTab("approvals")}><IoCheckmarkCircleOutline />Product Approvals <span className='catnum'>{pendingCount}</span> </li>
        <li className={`catmenu2 ${activeTab === "ads" ? "active-ads" : ""}`} onClick={() => setActiveTab("ads")}><FaArrowTrendUp />Advertisements <span className='catnum'>{adStats.total || 0}</span> </li>
        <li className={`catmenu2 ${activeTab === "featured" ? "active-featured" : ""}`} onClick={() => setActiveTab("featured")}><FaRegStar />Featured & Recommended <span className='catnum'>{featuredCount}</span> </li>
    </ul>
    {error && <p className='analyticdesc' style={{ marginLeft: 20 }}>{error}</p>}
    {activeTab === "approvals" && (
    <div className='activitydetail'>
        <div className='detailheader'>
            <h2 className='detailheading'>Pending Product Approvals</h2>
            <span className='detaildesc'>Review and approve products for Marketplace, Buy Now, and Auctions as General, Luxury, or Classic tier</span>
        </div>
        {loading ? <p className='activityinfoicon'>Loading…</p> : pendingProducts.length === 0 ? <p className='activityinfoicon'>No pending approvals</p> : pendingProducts.map((product) => {
            const isMarketplace = product.listingType === "MARKETPLACE";
            const ListingIcon = product.listingType === "AUCTIONS" ? TbHammer : product.listingType === "BUY_NOW" ? BsLightningCharge : AiOutlineShop;
            return (
        <div key={product.id} className='activityinfo'>
            <img src={getFile(product.media?.[0] || "")} alt='' className='activityimg'/>
            <div className='activityinfodiv'>
                <div className='activityinfoheader'>
                    <div className='activityinfohead'>
                        <h2 className='activityinfoheading'>{product.title}</h2>
                        <h3 className='activityinfoprice'>{formatCurrency(product.value)}</h3>
                    </div>
                    <ul className='activityinfotags'>
                        <li className={isMarketplace ? 'businesscat' : 'businesscat1'}><ListingIcon />{LISTING_LABELS[product.listingType] || product.listingType}</li>
                        <li className='productcat'>{CATEGORY_LABELS[product.category] || product.category}</li>
                        {product.tier && product.tier !== "GENERAL" && <li className='plancat'><LuCrown />{product.tier}</li>}
                    </ul>
                </div>
                <div className='activityinfodetails'>
                    <div className='activityinfodetailrow'>
                        <span className='activityinfoicon'><CiLocationOn />{getLocation(product.meta)}</span>
                        <span className='activityinfoicon'><MdAccessTime />Submitted: {formatDate(product.createdAt)}</span>
                    </div>
                    <div className='activityinfodetailrow'>
                        <span className='activityinfoicon'>By: {product.owner?.name || "—"}</span>
                    </div>
                </div>
                <div className='activityapprovedtags'>
                    <h2 className='activityapprovedtitle'>Approve as Tier:</h2>
                    <ul className='activityapprovedtag'>
                        <li className='viewtag' onClick={() => navigate(`/productpage/${product.id}`)} style={{ cursor: "pointer" }}><FaRegEye />View</li>
                        <li className='generaltag' onClick={() => !actioningId && handleApprove(product.id, "APPROVED", "GENERAL")} style={{ cursor: actioningId ? "default" : "pointer" }}><SlBadge />General</li>
                        <li className='luxurytag' onClick={() => !actioningId && handleApprove(product.id, "APPROVED", "LUXURY")} style={{ cursor: actioningId ? "default" : "pointer" }}><LuCrown />Luxury</li>
                        <li className='classictag' onClick={() => !actioningId && handleApprove(product.id, "APPROVED", "CLASSIC")} style={{ cursor: actioningId ? "default" : "pointer" }}><BsStars />Classic</li>
                        <li className='rejecttag' onClick={() => !actioningId && handleApprove(product.id, "REJECTED")} style={{ cursor: actioningId ? "default" : "pointer" }}><IoIosCloseCircleOutline />Reject</li>
                    </ul>
                </div>
            </div>
        </div>
            );
        })}
    </div>
    )}
    {activeTab === "ads" && (
    <div className="activitydetail" style={{ height: "auto", paddingBottom: 20 }}>
        <div className='detailheader1'>
            <h2 className='detailheading1'>Advertisement Management</h2>
            <span className='detaildesc1'>Create, edit, and manage advertisements across the platform</span>
        </div>
        <form className="advertcreate" onSubmit={handleAdSubmit} style={{ height: "auto" }}>
            <h2 className="advertheader"><FaArrowTrendUp />{editingAdId ? "Edit Advertisement" : "Create New Advertisement"}</h2>
            <div className="adverttitlediv">
                <h3 className="adverttitle"><BsStars />Title *</h3>
                <input type="text" name="title" value={adForm.title} onChange={handleAdFormChange} placeholder="Enter advertisement title..." className="advertinputitle" />
            </div>
            <div className="adverttitlediv">
                <h3 className="adverttitle">Description</h3>
                <textarea name="content" value={adForm.content} onChange={handleAdFormChange} placeholder="Enter advertisement description..." className="advertinputdesc" />
            </div>
            <div className="advertinputrow">
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><SlBadge />Button Text</h3>
                    <input type="text" name="ctaText" value={adForm.ctaText} onChange={handleAdFormChange} placeholder="e.g. Shop Now, Learn More" className="advertinputtext" />
                </div>
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><FaLink />Button Link</h3>
                    <input type="text" name="ctaUrl" value={adForm.ctaUrl} onChange={handleAdFormChange} placeholder="https://example.com or /products" className="advertinputtext" />
                </div>
            </div>
            <div className="advertinputrow">
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><MdOutlineFileUpload />Banner / Image Upload</h3>
                    <input type="file" ref={adFileInputRef} accept="image/*" onChange={handleAdFileSelect} className="advertinputtext" />
                    {adForm.placement ? (
                        <p className="banner-dimension-note">Recommended: {PLACEMENT_DIMENSIONS[adForm.placement]} px ({PLACEMENT_LABELS[adForm.placement]})</p>
                    ) : (
                        <p className="banner-dimension-note">Select Banner Placement to see Dimensions</p>
                    )}
                    {adFilePreview && (
                        <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                            <img src={adFilePreview} alt="Preview" style={{ maxHeight: 100, borderRadius: 8 }} />
                            <button type="button" onClick={() => { if (adFilePreview && !adMediaKey) URL.revokeObjectURL(adFilePreview); setAdSelectedFile(null); setAdFilePreview(null); setAdMediaKey(null); if (adFileInputRef.current) adFileInputRef.current.value = ""; }} style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                        </div>
                    )}
                </div>
                <div className="adverttitlediv">
                    <h3 className="adverttitle">Ad Placement</h3>
                    <select name="placement" value={adForm.placement} onChange={handleAdFormChange} className="advertinputtext">
                        <option value="">Select placement</option>
                        {PLACEMENT_OPTIONS.map((p) => <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button type="submit" className="adcreatebutton" disabled={adSubmitting}>
                    {adSubmitting ? (editingAdId ? "Updating..." : "Creating...") : (editingAdId ? "Update Advertisement" : "Create Advertisement")}
                </button>
                {editingAdId && <button type="button" className="adcreatebutton" style={{ backgroundColor: "#6b7280", borderColor: "#6b7280" }} onClick={resetAdForm}>Cancel Edit</button>}
            </div>
        </form>
        <h2 className="detailheading3"><FaRegEye />All Advertisements ({ads.length})</h2>
        {adsLoading ? <p className='activityinfoicon' style={{ marginLeft: 20 }}>Loading...</p> : ads.length === 0 ? <p className='activityinfoicon' style={{ marginLeft: 20 }}>No advertisements found</p> : ads.map((ad) => (
        <div key={ad.id} className="advertdiv" style={{ height: "auto", gap: 16 }}>
            {ad.media && <img src={getFile(ad.media)} alt={ad.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }} />}
            <div className="advertinfo">
                <h2 className="advertheading">{ad.title}</h2>
                <ul className="advertinputs">
                    <li className="advertinput">
                        <span className="advertinputtitle">Placement</span><br />
                        <span className="advertproductname">{PLACEMENT_LABELS[ad.placement] || ad.placement || "—"}</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">CTA</span><br />
                        <span className="advertinputinfo">{ad.ctaText || "—"}</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Created</span><br />
                        <span className="advertinputinfo">{formatDate(ad.createdAt)}</span>
                    </li>
                </ul>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => handleAdEdit(ad)} style={{ background: "none", border: "1px solid #8ec5ff", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#1447e6", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><FiEdit2 size={14} />Edit</button>
                <button onClick={() => handleAdDelete(ad.id)} disabled={actioningId === ad.id} style={{ background: "none", border: "1px solid #ffa2a2", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#c10007", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><FiTrash2 size={14} />Delete</button>
            </div>
        </div>
        ))}
    </div>
    )}
    {activeTab === "featured" && (
    <div className="activitydetail">
      <div className='detailheader2'>
            <h2 className='detailheading2'>Featured & Recommended Products</h2>
            <span className='detaildesc2'>Mark products as Featured or Recommended to highlight them across the platform</span>
        </div>
        <div className="searchBox">
            <FiSearch className="searchIcon" />
            <input
                type="text"
                value={featuredSearch}
                onChange={(e) => setFeaturedSearch(e.target.value)}
                placeholder="Search products by name, category, location, or price..."
                className="searchInput"
            />
        </div>
        <span className="searchdesc">{loading ? "…" : `${featuredFiltered.length} products found`}</span>
        {loading ? <p className='activityinfoicon'>Loading…</p> : featuredFiltered.length === 0 ? <p className='activityinfoicon'>No products found</p> : featuredFiltered.map((product) => {
            const isMarketplace = product.listingType === "MARKETPLACE";
            const ListingIcon = product.listingType === "AUCTIONS" ? TbHammer : product.listingType === "BUY_NOW" ? BsLightningCharge : AiOutlineShop;
            return (
        <div key={product.id} className='activityinfo1'>
            <img src={getFile(product.media?.[0] || "")} alt='' className='activityimg1'/>
            <div className='activityinfodiv'>
                <div className='activityinfoheader'>
                    <div className='activityinfohead'>
                        <h2 className='activityinfoheading'>{product.title}</h2>
                        <h3 className='activityinfoprice'>{formatCurrency(product.value)}</h3>
                    </div>
                    <ul className='activityinfotags'>
                        <li className={isMarketplace ? 'businesscat' : 'businesscat1'}><ListingIcon />{LISTING_LABELS[product.listingType] || product.listingType}</li>
                        <li className='productcat'>{CATEGORY_LABELS[product.category] || product.category}</li>
                        <li className={`subscriptiontag ${product.owner?.subscriptionStatus === 'ACTIVE' ? 'substag-active' : 'substag-inactive'}`}>
                            {product.owner?.subscriptionPlan && product.owner.subscriptionPlan !== 'NONE' ? product.owner.subscriptionPlan : ''} {product.owner?.subscriptionStatus || 'N/A'}
                        </li>
                    </ul>
                </div>
                <span className='activityinfoicon'><CiLocationOn />{getLocation(product.meta)}</span>
                <div className='activityapprovedtags1'>
                    <div>
                        <label className="switcher">
                            <input
                                type="checkbox"
                                checked={!!product.isFeatured}
                                disabled={actioningId === product.id}
                                onChange={() => handleFeaturedRecommended(product.id, !product.isFeatured, product.isRecommended, product.isVerified)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="switchedtag">⭐ Featured</span>
                    </div>
                    <div>
                        <label className="switcher">
                            <input
                                type="checkbox"
                                checked={!!product.isRecommended}
                                disabled={actioningId === product.id}
                                onChange={() => handleFeaturedRecommended(product.id, product.isFeatured, !product.isRecommended, product.isVerified)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="switchedtag"><FaArrowTrendUp /> Recommended</span>
                    </div>
                    <div>
                        <label className="switcher">
                            <input
                                type="checkbox"
                                checked={!!product.isVerified}
                                disabled={actioningId === product.id}
                                onChange={() => handleFeaturedRecommended(product.id, product.isFeatured, product.isRecommended, !product.isVerified)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="switchedtag"><MdVerified /> Verified</span>
                    </div>
                </div>
            </div>
        </div>
            );
        })}
    </div>
    )}

    {rejectModal.open && (
        <div className="reject-modal-overlay" onClick={() => setRejectModal({ open: false, productId: null })}>
            <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="reject-modal-title">Reject Product</h3>
                <p className="reject-modal-desc">Please provide a reason for rejecting this product. This will be visible to the seller.</p>
                <textarea
                    className="reject-modal-textarea"
                    rows={4}
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                />
                <div className="reject-modal-actions">
                    <button className="reject-modal-cancel" onClick={() => setRejectModal({ open: false, productId: null })}>Cancel</button>
                    <button className="reject-modal-confirm" disabled={!rejectReason.trim()} onClick={handleRejectConfirm}>Reject Product</button>
                </div>
            </div>
        </div>
    )}

    {tierModal.open && (
        <div className="reject-modal-overlay" onClick={() => setTierModal({ open: false, productId: null, tier: null, productTitle: "" })}>
            <div className="reject-modal" onClick={(e) => e.stopPropagation()} style={{ borderTop: "4px solid #d4af37" }}>
                <h3 className="reject-modal-title" style={{ color: "#92710a" }}>Confirm Approval</h3>
                <p className="reject-modal-desc">
                    Are you sure you want to approve <strong style={{ color: "#18181b" }}>{tierModal.productTitle}</strong> as <strong style={{ color: "#92710a" }}>{tierModal.tier}</strong> tier?
                </p>
                <div className="reject-modal-actions">
                    <button className="reject-modal-cancel" onClick={() => setTierModal({ open: false, productId: null, tier: null, productTitle: "" })}>Cancel</button>
                    <button
                        className="reject-modal-confirm"
                        style={{ background: "#d4af37" }}
                        onClick={handleTierApproveConfirm}
                    >
                        Approve as {tierModal.tier}
                    </button>
                </div>
            </div>
        </div>
    )}

    {auctionModal.open && (
        <div className="reject-modal-overlay" onClick={() => setAuctionModal({ open: false, productId: null, tier: null })}>
            <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="reject-modal-title">Approve Auction Product</h3>
                <p className="reject-modal-desc">Choose how to set the auction venue and date.</p>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 12px", borderRadius: 8, border: auctionOption === "tba" ? "2px solid #d4af37" : "1px solid #e4e4e7", background: auctionOption === "tba" ? "#fefce8" : "#fff", marginBottom: 8 }}>
                        <input type="radio" name="auctionOption" value="tba" checked={auctionOption === "tba"} onChange={() => setAuctionOption("tba")} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Will be announced soon</div>
                            <div style={{ fontSize: 12, color: "#71717b" }}>Venue and date will be set as "To be announced"</div>
                        </div>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 12px", borderRadius: 8, border: auctionOption === "enter" ? "2px solid #d4af37" : "1px solid #e4e4e7", background: auctionOption === "enter" ? "#fefce8" : "#fff" }}>
                        <input type="radio" name="auctionOption" value="enter" checked={auctionOption === "enter"} onChange={() => setAuctionOption("enter")} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#18181b" }}>Enter date and venue</div>
                            <div style={{ fontSize: 12, color: "#71717b" }}>Provide the auction venue and date now</div>
                        </div>
                    </label>
                </div>
                {auctionOption === "enter" && (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#3f3f47", marginBottom: 6 }}>Auction Venue</label>
                            <input
                                type="text"
                                className="reject-modal-textarea"
                                style={{ height: 40, resize: "none" }}
                                placeholder="Enter auction venue..."
                                value={auctionVenue}
                                onChange={(e) => setAuctionVenue(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#3f3f47", marginBottom: 6 }}>Auction Date</label>
                            <input
                                type="datetime-local"
                                className="reject-modal-textarea"
                                style={{ height: 40, resize: "none" }}
                                value={auctionDate}
                                onChange={(e) => setAuctionDate(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <div className="reject-modal-actions">
                    <button className="reject-modal-cancel" onClick={() => setAuctionModal({ open: false, productId: null, tier: null })}>Cancel</button>
                    <button
                        className="reject-modal-confirm"
                        style={{ background: "#d4af37" }}
                        disabled={auctionOption === "enter" && (!auctionVenue.trim() || !auctionDate)}
                        onClick={handleAuctionApproveConfirm}
                    >
                        Approve Auction
                    </button>
                </div>
            </div>
        </div>
    )}
  </div>;
};

export default Activitypage;