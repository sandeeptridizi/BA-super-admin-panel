import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";
import { getFile } from "../../lib/s3";
import { AiOutlineShop } from "react-icons/ai";
import { BsLightningCharge, BsStars } from "react-icons/bs";
import { TbHammer } from "react-icons/tb";
import { FiHome, FiUpload, FiBriefcase } from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";
import { MdDirectionsBike, MdShoppingCart } from "react-icons/md";
import { RiSofaLine } from "react-icons/ri";
import { IoDiamondOutline } from "react-icons/io5";
import { PiDotsThreeBold, PiBuildingOfficeBold } from "react-icons/pi";
import { HiOutlineCube } from "react-icons/hi";
import { GiPaintBrush } from "react-icons/gi";
import { LuWarehouse, LuLandPlot, LuBedDouble, LuUsers } from "react-icons/lu";
import { BiLeftArrowAlt } from "react-icons/bi";
import "../ProductCreation/productcreation.css";
import "./ProductEdit.css";

// ── helpers ──────────────────────────────────────────────────────────────────
const normalizeMetaKey = (label) =>
  label
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");

// Legacy meta keys produced by old form labels → canonical keys expected now.
// On load we migrate values so edit fields populate; on save old keys are gone.
const LEGACY_KEY_MAP = {
  ageOfPropertyYears: 'ageOfProperty',
  dimensionsLWH: 'dimensions',
  seatingCapacityIfApplicable: 'seatingCapacity',
  approximateAgeYears: 'approximateAge',
  boxPappers: 'boxPapers',
  raretyLevel: 'rarityLevel',
  builtUpAreaInSqYards: 'builtUpArea',
  plotAreaInSqYards: 'plotArea',
};

// ── mapping tables ───────────────────────────────────────────────────────────
const listingTypeToMode = {
  MARKETPLACE: "marketplace",
  BUY_NOW: "buynow",
  AUCTIONS: "auction",
  TO_LET: "tolet",
};
const modeToListingType = {
  marketplace: "MARKETPLACE",
  buynow: "BUY_NOW",
  auction: "AUCTIONS",
  tolet: "TO_LET",
};

const categoryToTab = {
  REAL_ESTATE: "realestate",
  CARS: "cars",
  BIKES: "bikes",
  FURNITURE: "furniture",
  JEWELLERY_AND_WATCHES: "jewellery",
  ARTS_AND_PAINTINGS: "arts",
  ANTIQUES: "antiques",
  COLLECTABLES: "collectables",
};
const tabToCategory = {
  realestate: "REAL_ESTATE",
  cars: "CARS",
  bikes: "BIKES",
  furniture: "FURNITURE",
  jewellery: "JEWELLERY_AND_WATCHES",
  arts: "ARTS_AND_PAINTINGS",
  antiques: "ANTIQUES",
  collectables: "COLLECTABLES",
  others: "OTHERS",
};

// ── listing mode cards ───────────────────────────────────────────────────────
const LISTING_MODES = [
  { key: "marketplace", label: "Marketplace", desc: "List on marketplace", icon: <AiOutlineShop /> },
  { key: "buynow", label: "Buy Now", desc: "Direct purchase listing", icon: <BsLightningCharge /> },
  { key: "auction", label: "Auction", desc: "Auction style listing", icon: <TbHammer /> },
  { key: "tolet", label: "To-Let", desc: "Rental listing", icon: <FiHome /> },
];

// ── category tabs ────────────────────────────────────────────────────────────
const STANDARD_TABS = [
  { key: "realestate", label: "Real Estate", icon: <PiBuildingOfficeBold /> },
  { key: "cars", label: "Cars", icon: <LiaCarSideSolid /> },
  { key: "bikes", label: "Bikes", icon: <MdDirectionsBike /> },
  { key: "furniture", label: "Furniture", icon: <RiSofaLine /> },
  { key: "jewellery", label: "Jewellery & Watches", icon: <IoDiamondOutline /> },
  { key: "arts", label: "Arts & Paintings", icon: <GiPaintBrush /> },
  { key: "antiques", label: "Antiques", icon: <BsStars /> },
  { key: "collectables", label: "Collectables", icon: <HiOutlineCube /> },
  { key: "others", label: "Others", icon: <PiDotsThreeBold /> },
];

const TOLET_TABS = [
  { key: "residential", label: "Residential", icon: <PiBuildingOfficeBold /> },
  { key: "office", label: "Office Space", icon: <FiBriefcase /> },
  { key: "shops", label: "Shops", icon: <MdShoppingCart /> },
  { key: "warehouses", label: "Godowns & Warehouses", icon: <LuWarehouse /> },
  { key: "plots", label: "Open Plots", icon: <LuLandPlot /> },
  { key: "hostels", label: "PG & Hostels", icon: <LuBedDouble /> },
  { key: "coliving", label: "Luxury Coliving", icon: <LuUsers /> },
  { key: "others", label: "Others", icon: <PiDotsThreeBold /> },
];

// ── field configs ────────────────────────────────────────────────────────────
// Each field: { label, type:"text"|"number"|"select", options?:string[] }
const f = (label, type = "text", options, required = false) => ({ label, type, options, required });
const sel = (label, opts, required = false) => f(label, "select", opts, required);

const REAL_ESTATE_COMMON = [
  [
    sel("Property Type", ["House", "Villa", "Apartment", "Flat", "Plot", "Land", "Commercial"]),
    f("Area / Locality"),
    f("Landmark"),
    sel("Ownership Type", ["Freehold", "Leasehold", "Co-Operative Society", "Power of Attorney"]),
  ],
  [
    sel("Approval Status", ["RERA Approved", "Authority Approved", "Not Approved", "Under Process"]),
    sel("Availability", ["Immediate", "Ready to Move", "Under Construction", "Within 3 Months", "Within 6 Months"]),
    f("Age of Property", "number"),
    sel("Facing", ["North", "East", "West", "South", "North-East", "North-West", "South-East", "South-West"]),
  ],
  [sel("No of Car Parking", ["1", "2", "3", "4"])],
];

const RE_HOUSE_VILLA = [
  [f("Built-up Area"), f("Plot Area"), f("Bedrooms", "number"), f("Bathrooms", "number")],
  [f("Floors", "number"), sel("Furnishing", ["Unfurnished", "Semi-Furnished", "Furnished"]), sel("Garden", ["Yes", "No"]), sel("Gated Community", ["Yes", "No"])],
];

const RE_APARTMENT_FLAT = [
  [f("Built-up Area"), f("Floor Number", "number"), f("Bedrooms", "number"), f("Bathrooms", "number")],
  [f("Total Floors", "number"), sel("Furnishing", ["Unfurnished", "Semi-Furnished", "Furnished"]), f("Society Name"), sel("Maintenance Charges", ["Included", "Excluded", "On Request"])],
  [sel("Lift", ["Yes", "No"]), f("Amenities"), f("Balcony Count", "number"), sel("Parking Type", ["No", "Open", "Covered"])],
];

const RE_PLOT_LAND = [
  [f("Plot Dimensions"), f("Plot Area"), f("Facing"), f("Road Width")],
  [sel("Approval Type", ["DTCP", "HMDA", "RERA", "Panchayat", "NA"]), sel("Boundary Wall", ["Yes", "No"]), sel("Corner Plot", ["Yes", "No"]), sel("Electricity Available", ["Yes", "No"])],
  [sel("Water Connection", ["Municipal", "Borewell", "Both", "None"])],
];

const RE_COMMERCIAL = [
  [sel("Commercial Type", ["Office", "Shop", "Showroom", "Warehouse", "Industrial"]), f("Built-up Area"), f("Floor", "number"), sel("Parking", ["Yes", "No"])],
  [sel("Suitable For", ["Office", "Retail", "Clinic", "Restaurant", "Storage"]), sel("Washroom", ["Private", "Common", "None"]), f("Power Load"), sel("Furnished Status", ["Unfurnished", "Semi-Furnished", "Furnished"], true)],
  [sel("Fire Safety Compliance", ["Yes", "No"])],
];

const CARS_FIELDS = [
  [f("Brand"), f("Model"), f("Year of Manufacture", "number"), f("KM Driven", "number")],
  [sel("No of Owners", ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner"]), sel("Fuel Type", ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]), sel("Condition", ["Excellent", "Good", "Fair"]), sel("Transmission", ["Manual", "Automatic", "AMT"])],
  [sel("Tyres", ["Brand New", "Used / Part-Own", "Worn Out"]), f("Color"), sel("Accident History", ["Yes", "No"]), sel("Service History", ["Available", "Not Available"])],
  [sel("Number of Keys", ["1", "2", "More"]), sel("Seller Type", ["Owner", "Dealer"]), sel("Negotiable", ["Yes", "No"]), f("Registration State")],
  [sel("Insurance Validity", ["Active", "Expired"]), sel("RC Available", ["Yes / Available", "No / Missing"])],
];

const BIKES_FIELDS = [
  [f("Brand"), f("Model"), f("Variant"), f("Year of Manufacture", "number")],
  [f("KM Driven", "number"), sel("No of Owners", ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner"]), sel("Fuel Type", ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]), sel("Condition", ["Excellent", "Good", "Fair"])],
  [sel("Seller Type", ["Owner", "Dealer"]), sel("Negotiable", ["Yes", "No"]), f("Registration State"), sel("Insurance Status", ["Valid", "Expired"])],
  [sel("RC Available", ["Yes / Available", "No / Missing"]), sel("PUC", ["Current", "Not Available"])],
];

const FURNITURE_FIELDS = [
  [sel("Furniture Type", ["Sofa", "Sofa Set", "Bed", "Dining Table", "Chair", "Wardrobe", "Study Table", "TV Unit", "Cabinet", "Mattress", "Office Furniture", "Other"]), sel("Material", ["Solid Wood", "Engineered Wood", "Metal", "Plastic", "Fabric", "Leather", "Cane", "Rattan", "Mixed", "Others"]), sel("Condition", ["Brand New", "Pre-Owned", "Refurbished"]), sel("Usage Condition", ["Never Used", "Lightly Used", "Moderately Used", "Heavily Used"])],
  [sel("Brand", ["Custom", "Branded"]), f("Dimensions"), f("Color / Finish"), f("Seating Capacity", "number")],
  [sel("Age of Furniture", ["Less than 1 Year", "1-3 Years", "3-5 Years", "5+ Years"]), sel("Assembly Required", ["Yes", "No"]), f("Original Purchase Price", "number"), sel("Reason for Selling", ["Relocation", "Upgrade", "Not in Use", "Closing Business", "Other"])],
  [sel("Seller Type", ["Owner", "Dealer"])],
];

const JEWELLERY_COMMON = [
  [sel("Item Type", ["Jewellery", "Watch"]), sel("Condition", ["Brand New", "Pre-Owned"]), sel("Gender", ["Male", "Female", "Unisex"]), sel("Invoice Available", ["Yes", "No"])],
];

const JEWELLERY_SUB = [
  [sel("Type", ["Ring", "Necklace", "Bracelet", "Earrings", "Bangles", "Chain Sets", "Ear Studs", "Custom"]), sel("Material", ["Gold", "Silver", "Platinum", "Diamond", "Mixed"]), f("Weight"), sel("Purity", ["18K", "20K", "22K", "24K"])],
  [sel("Certification", ["BIS", "GIA", "IGI", "Others"]), sel("Making Charges", ["Included", "Excluded"]), sel("Hallmark Type", ["BIS", "International", "Others"])],
];

const WATCH_SUB = [
  [f("Brand"), f("Model"), sel("Dial Type", ["Analog", "Digital", "Automatic"]), sel("Strap Type", ["Leather", "Metal", "Rubber", "Fabric"])],
  [sel("Box & Papers", ["Available", "Not Available"]), f("Year of Purchase", "number"), sel("Working Condition", ["Working", "Needs Repair"]), sel("Original Parts", ["Yes", "No"])],
];

const ARTS_FIELDS = [
  [sel("Art Type", ["Sculpture", "Painting", "Print", "Digital"]), f("Artist Name"), sel("Medium", ["Oil", "Acrylic", "Watercolor", "Mixed"]), f("Size")],
  [f("Year Created", "number"), sel("Signed", ["Yes", "No"]), sel("Certificate", ["Yes", "No"]), sel("Framed", ["Yes", "No"])],
];

const ANTIQUES_FIELDS = [
  [sel("Antique Type", ["Furniture", "Coins", "Artefacts", "Decor"]), f("Approximate Age", "number"), f("Origin"), f("Material")],
  [sel("Condition", ["Excellent", "Good", "Fair"]), sel("Restoration", ["Yes", "No"]), sel("Documentation", ["Available", "Not Available"]), sel("Historical Period", ["Colonial", "Victorian", "Mughal", "Other"])],
];

const COLLECTABLES_FIELDS = [
  [f("Item Type"), sel("Rarity Level", ["Common", "Rare", "Very Rare", "One-of-One"]), sel("Limited Edition", ["Yes", "No"]), sel("Serial Number", ["Available", "Not Available"])],
  [sel("Authentication", ["Yes", "No"]), sel("Condition Grade", ["Fair", "Excellent", "Mint"])],
];

const OTHERS_FIELDS = [
  [f("Item Category"), f("Brand"), sel("Condition", ["New", "Used"]), sel("Usage", ["Unused", "Lightly Used", "Heavily Used"])],
  [sel("Warranty", ["Available", "Not Available", "Refurbished"]), f("Purchase Year", "number"), sel("Reason for Selling", ["Upgrade", "Not in Use", "Financial", "Other"]), f("Additional Notes")],
];

const TOLET_RESIDENTIAL = [
  [sel("Ownership", ["Owner", "Agent", "Builder"]), sel("Rental Type", ["Flat", "Apartment", "Independent House", "Villa", "Studio", "Penthouse"]), f("Bedrooms", "number"), f("Bathrooms", "number")],
  [f("Property Floor", "number"), f("Total No of Floors", "number"), f("Carpet Area"), f("Built-up Area")],
  [f("Facing"), f("Maintenance Charges"), f("Available From"), f("Preferred Tenants")],
  [sel("Furnished Status", ["Fully - Furnished", "Unfurnished", "Semi-Furnished"], true), f("Furnishing Items"), f("Society Amenities")],
];

const TOLET_GENERIC = [
  [f("Rent per Month (₹)", "number", undefined, true), f("Security Deposit (₹)", "number", undefined, true)],
  [sel("Lease Duration", ["11 Months", "1 Year", "2 Years", "3 Years"], true), sel("Furnishing Status", ["Furnished", "Semi Furnished", "Unfurnished", "Other"], true)],
];

// ── get fields for current state ─────────────────────────────────────────────
function getCategoryFields(mode, tab, meta) {
  if (mode === "tolet") {
    if (tab === "residential") return [...TOLET_RESIDENTIAL, ...TOLET_GENERIC];
    return TOLET_GENERIC;
  }
  switch (tab) {
    case "realestate": {
      const pt = (meta.propertyType || "").toLowerCase();
      let sub = [];
      if (pt === "house" || pt === "villa") sub = RE_HOUSE_VILLA;
      else if (pt === "apartment" || pt === "flat") sub = RE_APARTMENT_FLAT;
      else if (pt === "plot" || pt === "land") sub = RE_PLOT_LAND;
      else if (pt === "commercial") sub = RE_COMMERCIAL;
      return [...REAL_ESTATE_COMMON, ...sub];
    }
    case "cars": return CARS_FIELDS;
    case "bikes": return BIKES_FIELDS;
    case "furniture": return FURNITURE_FIELDS;
    case "jewellery": {
      const itemType = (meta.itemType || "").toLowerCase();
      let sub = [];
      if (itemType === "jewellery") sub = JEWELLERY_SUB;
      else if (itemType === "watch") sub = WATCH_SUB;
      return [...JEWELLERY_COMMON, ...sub];
    }
    case "arts": return ARTS_FIELDS;
    case "antiques": return ANTIQUES_FIELDS;
    case "collectables": return COLLECTABLES_FIELDS;
    case "others": return OTHERS_FIELDS;
    default: return [];
  }
}

// ── component ────────────────────────────────────────────────────────────────
const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // core fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [tier, setTier] = useState("GENERAL");
  const [pendingTier, setPendingTier] = useState(null);
  const [country, setCountry] = useState("INDIA");
  const [approvalStatus, setApprovalStatus] = useState("PENDING");

  // mode / tab
  const [mode, setMode] = useState("marketplace");
  const [tab, setTab] = useState("realestate");
  const [toletTab, setToletTab] = useState("residential");

  // meta
  const [meta, setMeta] = useState({});

  // media
  const [existingMedia, setExistingMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);

  // video
  const videoInputRef = useRef(null);
  const [existingVideo, setExistingVideo] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [removeExistingVideo, setRemoveExistingVideo] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Product not found");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/product/${id}`);
        const p = res?.data?.data;
        if (!p) { setError("Product not found"); return; }

        setTitle(p.title || "");
        setDescription(p.description || "");
        setValue(p.value != null ? String(p.value) : "");
        setTier(p.tier || "GENERAL");
        setCountry(p.country || "INDIA");
        setApprovalStatus(p.approvalStatus || "PENDING");

        const m = p.meta && typeof p.meta === "object" ? { ...p.meta } : {};
        // Migrate legacy meta keys to canonical keys
        for (const [oldKey, newKey] of Object.entries(LEGACY_KEY_MAP)) {
          if (m[oldKey] !== undefined && !m[newKey]) {
            m[newKey] = m[oldKey];
          }
          delete m[oldKey];
        }
        setCity(m.city || "");
        setSocialMediaLink(m.socialMediaLink || "");
        setStatus(m.status || "ACTIVE");
        setMeta(m);

        const modeKey = listingTypeToMode[p.listingType] || "marketplace";
        setMode(modeKey);

        if (modeKey === "tolet") {
          setToletTab(m.toletCategory || "residential");
        } else {
          const tabKey = categoryToTab[p.category] || "realestate";
          setTab(tabKey);
        }

        if (Array.isArray(p.media)) {
          setExistingMedia(p.media);
        }
        if (p.video) {
          setExistingVideo(p.video);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── meta helpers ───────────────────────────────────────────────────────
  const getMetaVal = (label) => meta[normalizeMetaKey(label)] || "";
  const setMetaVal = (label, val) =>
    setMeta((prev) => ({ ...prev, [normalizeMetaKey(label)]: val }));

  // ── file handling ──────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setNewPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExistingMedia = (key) => {
    setExistingMedia((prev) => prev.filter((k) => k !== key));
    setRemovedMedia((prev) => [...prev, key]);
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── video handling ──────────────────────────────────────────────────
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setSelectedVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setRemoveExistingVideo(true);
    e.target.value = "";
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setSelectedVideoFile(null);
    setVideoPreview(null);
    setExistingVideo(null);
    setRemoveExistingVideo(true);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // ── upload helper ──────────────────────────────────────────────────────
  const uploadFile = async (file) => {
    const ext = file.name.split(".").pop();
    const key = `products/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const presignedRes = await api.get("/api/media/presigned", { params: { key } });
    const uploadUrl = presignedRes?.data?.data?.url;
    const returnedKey = presignedRes?.data?.data?.key || key;
    if (!uploadUrl) throw new Error("Presigned URL missing from response");
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    return returnedKey;
  };

  // ── save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!id) return;

    // ── validate required fields ──��────────────────────────────────────
    const activeTabVal = mode === "tolet" ? toletTab : tab;
    const fields = getCategoryFields(mode, activeTabVal, meta);
    const missing = [];
    for (const row of fields) {
      for (const field of row) {
        if (field.required) {
          const key = normalizeMetaKey(field.label);
          if (!meta[key]?.trim()) missing.push(field.label);
        }
      }
    }
    if (missing.length > 0) {
      alert(`Please fill the required fields:\n${missing.join(", ")}`);
      return;
    }

    try {
      setSaving(true);

      // build meta
      const finalMeta = { ...meta, city, socialMediaLink, status };
      if (mode === "tolet") finalMeta.toletCategory = toletTab;

      const activeTab = mode === "tolet" ? toletTab : tab;
      const categoryVal =
        mode === "tolet"
          ? "REAL_ESTATE"
          : tabToCategory[activeTab] || "REAL_ESTATE";

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        listingType: modeToListingType[mode],
        category: categoryVal,
        tier,
        country,
        value: value.trim() ? parseInt(value, 10) : null,
        approvalStatus,
        meta: finalMeta,
      };

      await api.patch(`/api/product/${id}`, payload);

      // upload new files & update media
      const mediaPatch = {};
      if (newFiles.length > 0 || removedMedia.length > 0) {
        const uploadedKeys = [];
        for (const file of newFiles) {
          const key = await uploadFile(file);
          uploadedKeys.push(key);
        }
        mediaPatch.media = [...existingMedia, ...uploadedKeys];
      }

      // upload video
      if (selectedVideoFile) {
        const videoKey = await uploadFile(selectedVideoFile);
        mediaPatch.video = videoKey;
      } else if (removeExistingVideo) {
        mediaPatch.video = null;
      }

      if (Object.keys(mediaPatch).length > 0) {
        await api.patch(`/api/product/${id}/media`, mediaPatch);
      }

      navigate(`/productpage/${id}`);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // ── render helpers ─────────────────────────────────────────────────────
  const renderField = (field) => {
    const key = normalizeMetaKey(field.label);
    const val = meta[key] || "";
    const star = field.required ? <span className="required-star">*</span> : null;
    if (field.type === "select") {
      return (
        <div className="basicinfoinputdiv" key={key}>
          <div className="basicinfotitle">{field.label}{star}</div>
          <select
            className="basicinfoinput2"
            value={val}
            onChange={(e) => setMetaVal(field.label, e.target.value)}
          >
            <option value="">Select</option>
            {field.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <div className="basicinfoinputdiv" key={key}>
        <div className="basicinfotitle">{field.label}{star}</div>
        <input
          className="basicinfoinput2"
          type={field.type === "number" ? "number" : "text"}
          value={val}
          onChange={(e) => setMetaVal(field.label, e.target.value)}
          placeholder={field.label}
        />
      </div>
    );
  };

  const renderFieldRows = (rows) =>
    rows.map((row, ri) => (
      <div className="basicinforow" key={ri}>
        {row.map(renderField)}
      </div>
    ));

  // ── loading / error ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="productcontainer1">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="productcontainer1">
        <div className="producthead1">
          <div className="backbutton" onClick={() => navigate("/products")}>
            <BiLeftArrowAlt />
          </div>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  const activeTab = mode === "tolet" ? toletTab : tab;
  const categoryRows = getCategoryFields(mode, activeTab, meta);
  const tabs = mode === "tolet" ? TOLET_TABS : STANDARD_TABS;
  const tabClassName = mode === "tolet" ? "categoryselection5" : "categoryselection4";

  return (
    <div className="productcontainer1">
      {/* ── header ─────────────────────────────────────────────────────── */}
      <div className="producthead1">
        <div className="backbutton" onClick={() => navigate(`/productpage/${id}`)}>
          <BiLeftArrowAlt />
        </div>
        <div className="productheadinfo">
          <h1 className="productsheader">Edit Product</h1>
          <span className="productheaddesc">Update product details</span>
        </div>
      </div>

      {/* ── listing mode cards ─────────────────────────────────────────── */}
      <div className="categoryselection3">
        <div className="categoryselctionheader">
          <div className="headericon"><AiOutlineShop /></div>
          <div>
            <div className="productcreatehead">Listing Type</div>
            <span className="productheaddesc1">Select the listing mode</span>
          </div>
        </div>
        <div className="productselection">
          {LISTING_MODES.map((lm) => {
            const active = mode === lm.key;
            return (
              <div
                key={lm.key}
                className={active ? "selectedcategory" : "selectedcategory1"}
                onClick={() => {
                  setMode(lm.key);
                  if (lm.key === "tolet") setToletTab("residential");
                  else setTab("realestate");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className={active ? "selectedcaticon" : "selectedcaticon1"}>
                  {lm.icon}
                </div>
                <div className={active ? "selectedcatname" : "selectedcatname1"}>
                  {lm.label}
                </div>
                <div className="selectedcatdesc">{lm.desc}</div>
                {active && <div className="selectedcattag">Selected</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── category tabs ──────────────────────────────────────────────── */}
      <div className="categoryfilter1">
        <div className="categoryselctionheader1">
          <div className="productcategoryselector"><PiBuildingOfficeBold /></div>
          <div>
            <div className="productcreatehead">
              {mode === "tolet" ? "Property Type" : "Category"}
            </div>
            <span className="productheaddesc1">
              {mode === "tolet"
                ? "Select the rental property type"
                : "Select the product category"}
            </span>
          </div>
        </div>
        <div className="categoryfilters1">
          {tabs.map((t) => {
            const isActive =
              mode === "tolet" ? toletTab === t.key : tab === t.key;
            return (
              <div
                key={t.key}
                className={`${tabClassName}${isActive ? " active-tab" : ""}`}
                onClick={() =>
                  mode === "tolet" ? setToletTab(t.key) : setTab(t.key)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="selectedcaticon2">{t.icon}</div>
                {t.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── basic info ─────────────────────────────────────────────────── */}
      <div className="basicinfoform">
        <div className="productcreatehead">Basic Information</div>
        <span className="productheaddesc1">Fill in the product details</span>

        <div className="basicinfotitle">Title</div>
        <input
          className="basicinfoinput"
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="basicinforow" style={{ marginTop: 12 }}>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">
              {mode === "tolet" ? "Rent" : "Value"}
            </div>
            <input
              className="basicinfoinput1"
              type="number"
              placeholder={mode === "tolet" ? "Monthly rent" : "Value (₹)"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">City</div>
            <input
              className="basicinfoinput1"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">Country</div>
            <select
              className="basicinfoinput1"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="INDIA">India</option>
              <option value="UNITED STATES">United States</option>
              <option value="UNITED KINGDOM">United Kingdom</option>
              <option value="CANADA">Canada</option>
              <option value="AUSTRALIA">Australia</option>
              <option value="SINGAPORE">Singapore</option>
              <option value="DUBAI">Dubai</option>
              <option value="MALAYSIA">Malaysia</option>
              <option value="QATAR">Qatar</option>
              <option value="SAUDI ARABIA">Saudi Arabia</option>
              <option value="SWITZERLAND">Switzerland</option>
              <option value="KUWAIT">Kuwait</option>
            </select>
          </div>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">Social Media Link</div>
            <input
              className="basicinfoinput1"
              type="url"
              placeholder="Social media link"
              value={socialMediaLink}
              onChange={(e) => setSocialMediaLink(e.target.value)}
            />
          </div>
        </div>

        <div className="basicinfotitle">Description</div>
        <textarea
          className="basicinfoinput"
          rows={4}
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="basicinforow" style={{ marginTop: 12 }}>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">Status</div>
            <select
              className="basicinfoinput2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">Tier</div>
            <select
              className="basicinfoinput2"
              value={tier}
              onChange={(e) => {
                const selected = e.target.value;
                if (selected !== tier) setPendingTier(selected);
              }}
            >
              <option value="GENERAL">GENERAL</option>
              <option value="LUXURY">LUXURY</option>
              <option value="CLASSIC">CLASSIC</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="basicinfoinputdiv">
            <div className="basicinfotitle">Approval Status</div>
            <select
              className="basicinfoinput2"
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── category-specific fields ───────────────────────────────────── */}
      {categoryRows.length > 0 && (
        <div className="basicinfoform">
          <div className="productcreatehead">
            {mode === "tolet"
              ? toletTab === "residential"
                ? "Rental Settings"
                : "Rental Details"
              : `${
                  tabs.find(
                    (t) => t.key === activeTab
                  )?.label || "Category"
                } Details`}
          </div>
          <span className="productheaddesc1">
            Fill in category-specific details
          </span>
          <div style={{ marginTop: 12 }}>{renderFieldRows(categoryRows)}</div>
        </div>
      )}

      {/* ── media section ──────────────────────────────────────────────── */}
      <div className="basicinfoform">
        <div className="productcreatehead">Media</div>
        <span className="productheaddesc1">
          Upload product images and media
        </span>

        <div
          className="basicinforow marketplacePreviewsRow"
          style={{ marginTop: 16 }}
        >
          {existingMedia.map((key) => (
            <div key={key} className="marketplacePreviewItem" style={{ position: "relative" }}>
              <img
                src={getFile(key)}
                alt="media"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #E4E4E7",
                }}
              />
              <button
                type="button"
                onClick={() => removeExistingMedia(key)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: "24px",
                  textAlign: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}

          {newPreviews.map((src, idx) => (
            <div key={`new-${idx}`} className="marketplacePreviewItem" style={{ position: "relative" }}>
              <img
                src={src}
                alt="preview"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #E4E4E7",
                }}
              />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: "24px",
                  textAlign: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          className="cancelbutton"
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
          onClick={() => fileRef.current?.click()}
        >
          <FiUpload /> Upload Files
        </button>

        <div className="productcreatehead" style={{ marginTop: 24 }}>Product Video</div>
        <span className="productheaddesc1" style={{ display: "block", marginBottom: 12 }}>
          Upload an optional product video
        </span>

        {!videoPreview && !existingVideo ? (
          <ul className="selectedcategory2 videoUploadBox" onClick={() => videoInputRef.current?.click()} style={{ cursor: "pointer" }}>
            <li className="selectedcaticon2"><FiUpload /></li>
            <li className="selectedcatname1">Click to upload a product video</li>
            <li className="selectedcatdesc">MP4, WEBM, MOV up to 50MB</li>
          </ul>
        ) : (
          <div className="videoPreviewContainer">
            <video
              src={videoPreview || getFile(existingVideo)}
              controls
              style={{ width: "320px", maxHeight: "220px", borderRadius: "8px" }}
            />
            <div className="videoPreviewInfo">
              <span className="selectedcatdesc">
                {selectedVideoFile ? selectedVideoFile.name : "Existing video"}
              </span>
              <button type="button" className="removeVideoBtn" onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}
        <input type="file" ref={videoInputRef} style={{ display: "none" }} accept=".mp4,.webm,.mov" onChange={handleVideoChange} />
      </div>

      {/* ── actions ────────────────────────────────────────────────────── */}
      <div className="formsubmissiontags">
        <button
          type="button"
          className="cancelbutton"
          onClick={() => navigate(`/productpage/${id}`)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="submittbutton"
          disabled={saving}
          onClick={handleSave}
        >
          {saving && <span className="buttonspinner" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {pendingTier && (
        <div className="tierModalOverlay" onClick={() => setPendingTier(null)}>
          <div className="tierModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="tierModalHeader">
              <h2>Confirm Tier Change</h2>
            </div>
            <div className="tierModalBody">
              <p>
                Are you sure you want to approve the product as{" "}
                <strong>{pendingTier}</strong>?
              </p>
            </div>
            <div className="tierModalFooter">
              <button
                className="tierModalCancel"
                onClick={() => setPendingTier(null)}
              >
                Cancel
              </button>
              <button
                className="tierModalConfirm"
                onClick={() => {
                  setTier(pendingTier);
                  setPendingTier(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
