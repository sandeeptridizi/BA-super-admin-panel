import { useState, useEffect, useCallback } from "react";
import './Activity.css';
import { FiActivity } from "react-icons/fi"
import { MdAccessTime } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import luxuryVilla from '../../assets/Luxury Villa.png';
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

const LISTING_LABELS = { MARKETPLACE: "Marketplace", BUY_NOW: "Buy Now", AUCTIONS: "Auctions", TO_LET: "To-let" };
const CATEGORY_LABELS = { REAL_ESTATE: "Properties", CARS: "Cars", BIKES: "Bikes", FURNITURE: "Furniture", JEWELLERY_AND_WATCHES: "Watches", ARTS_AND_PAINTINGS: "Arts", ANTIQUES: "Antiques", COLLECTABLES: "Collectables" };
const formatCurrency = (v) => v != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(v)) : "N/A";
const getLocation = (meta) => meta && typeof meta === "object" && (meta.location || meta.city || [meta.area, meta.city].filter(Boolean).join(", ") || meta.state || meta.address) || "—";
const getViews = (meta) => (meta && typeof meta === "object" && Number(meta.views)) || 0;
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";



const Activitypage = () => {
    const [activeTab, setActiveTab] = useState("approvals");
    const [isEnabled, setIsEnabled] = useState(false);
    const handleToggle = () => { setIsEnabled(!isEnabled); };
    const [pendingProducts, setPendingProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actioningId, setActioningId] = useState(null);
    const [featuredSearch, setFeaturedSearch] = useState("");

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

    const handleApprove = async (id, approvalStatus, tier) => {
        setActioningId(id);
        try {
            await apiApproveProduct(id, approvalStatus === "APPROVED" ? { approvalStatus: "APPROVED", tier } : { approvalStatus: "REJECTED" });
            setPendingProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const handleFeaturedRecommended = async (id, isFeatured, isRecommended) => {
        setActioningId(id);
        try {
            await apiUpdateFeaturedRecommended(id, { isFeatured, isRecommended });
            setFeaturedProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured, isRecommended } : p)));
        } catch (err) {
            setError(err?.response?.data?.message || "Update failed");
        } finally {
            setActioningId(null);
        }
    };

    const pendingCount = pendingProducts.length;
    const featuredCount = featuredProducts.filter((p) => p.isFeatured || p.isRecommended).length;
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
            <h2 className='analyticnum1'>3</h2>
            <span className='analyticdesc1'>Currently running campaigns</span>
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
        <li className={`catmenu2 ${activeTab === "ads" ? "active-ads" : ""}`} onClick={() => setActiveTab("ads")}><FaArrowTrendUp />Advertisements <span className='catnum'>3</span> </li>
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
                        {product.tier && <li className='plancat'><LuCrown />{product.tier}</li>}
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
    <div className="activitydetail">
        <div className='detailheader1'>
            <h2 className='detailheading1'>Advertisement Management</h2>
            <span className='detaildesc1'>Manage product advertisements across Home Page Top, Home Page Bottom, and Product Pages</span>
        </div>
        <div className="advertcreate">
            <h2 className="advertheader"><FaArrowTrendUp />Create New Advertisement</h2>
            <div className="adverttitlediv">
                <h3 className="adverttitle"><BsStars />Title of Advertisement  </h3>
                <input type="text" placeholder="Enter advertisement title..." className="advertinputitle" />
            </div>
            <div className="adverttitlediv">
                <h3 className="adverttitle">Description</h3>
                <input type="text" placeholder="Enter advertisement title..." className="advertinputdesc" />
            </div>
            <div className="advertinputrow">
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><SlBadge />Button Text</h3>
                    <input type="text" placeholder="Enter advertisement title..." className="advertinputtext" />
                </div>
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><FaLink />Button Link</h3>
                    <input type="text" placeholder="Enter advertisement title..." className="advertinputtext" />
                </div>
            </div>
            <div className="advertinputrow">
                <div className="adverttitlediv">
                    <h3 className="adverttitle"><MdOutlineFileUpload />Banner / Image Upload</h3>
                    <input type="file" className="advertinputtext" />
                </div>
                <div className="adverttitlediv">
                    <h3 className="adverttitle">Ad Placement</h3>
                    <select className="advertinputtext">
                        <option>Home Page Banner</option>
                        <option>Popup Ad</option>
                        <option>Product Listing</option>
                    </select>
                </div>
            </div>
            <span className="formdesclaimer">⚠️ Select Ad Placement first to see recommended dimensions</span>
            <button className="adcreatebutton">Create Advertisement</button>
        </div>
        <h2 className="detailheading3"><FaRegEye />Active Advertisements</h2>
        <div className="advertdiv">
            <div className="advertinfo">
                <h2 className="advertheading">Luxury Villa - Bandra West<span className="adverttag">Active</span></h2>
                <ul className="advertinputs">
                    <li className="advertinput">
                        <span className="advertinputtitle">Placement</span><br></br>
                        <span className="advertproductname">Home Page Top</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Impressions</span><br></br>
                        <span className="advertinputinfo">45,234</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Clicks</span><br></br>
                        <span className="advertinputinfo">2,156</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Duration</span><br></br>
                        <span className="advertinputinfo">2024-02-01 - 2024-02-15</span>
                    </li>
                </ul>
            </div>
            <div className="toggleContainer"><label className="switch">
                <input
                type="checkbox"
                checked={isEnabled}
                onChange={handleToggle}
                />
                <span className="slider"></span>
            </label>
                <span className="toggleStatus">{isEnabled ? "Active" : "Inactive"}</span>
            </div>
        </div>
        <div className="advertdiv">
            <div className="advertinfo">
                <h2 className="advertheading">Lamborghini Aventador<span className="adverttag">Active</span></h2>
                <ul className="advertinputs">
                    <li className="advertinput">
                        <span className="advertinputtitle">Placement</span><br></br>
                        <span className="advertproductname">Product Page</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Impressions</span><br></br>
                        <span className="advertinputinfo">28,567</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Clicks</span><br></br>
                        <span className="advertinputinfo">1,423</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Duration</span><br></br>
                        <span className="advertinputinfo">2024-01-28 - 2024-02-12</span>
                    </li>
                </ul>
            </div>
            <div className="toggleContainer"><label className="switch">
                <input
                type="checkbox"
                checked={isEnabled}
                onChange={handleToggle}
                />
                <span className="slider"></span>
            </label>
                <span className="toggleStatus">{isEnabled ? "Active" : "Inactive"}</span>
            </div>
        </div>
        <div className="advertdiv">
            <div className="advertinfo">
                <h2 className="advertheading">Rolex Daytona - Limited Edition<span className="adverttag">Active</span></h2>
                <ul className="advertinputs">
                    <li className="advertinput">
                        <span className="advertinputtitle">Placement</span><br></br>
                        <span className="advertproductname">Home Page Bottom</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Impressions</span><br></br>
                        <span className="advertinputinfo">18,234</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Clicks</span><br></br>
                        <span className="advertinputinfo">892</span>
                    </li>
                    <li className="advertinput">
                        <span className="advertinputtitle">Duration</span><br></br>
                        <span className="advertinputinfo">2024-02-03 - 2024-02-17</span>
                    </li>
                </ul>
            </div>
            <div className="toggleContainer"><label className="switch">
                <input
                type="checkbox"
                checked={isEnabled}
                onChange={handleToggle}
                />
                <span className="slider"></span>
            </label>
                <span className="toggleStatus">{isEnabled ? "Active" : "Inactive"}</span>
            </div>
        </div>
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
                        <li className='viewcat'><FaRegEye />{getViews(product.meta).toLocaleString()} views</li>
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
                                onChange={() => handleFeaturedRecommended(product.id, !product.isFeatured, product.isRecommended)}
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
                                onChange={() => handleFeaturedRecommended(product.id, product.isFeatured, !product.isRecommended)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="switchedtag"><FaArrowTrendUp /> Recommended</span>
                    </div>
                </div>
            </div>
        </div>
            );
        })}
    </div>
    )}
  </div>;
};

export default Activitypage;