import React, { useState } from "react";
import { useRef } from "react";
import api from "../../../src/lib/api";
import { MAJOR_CITIES } from "../../../src/lib/cities";
import './productcreation.css';
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineShop } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { TbHammer } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";
import { MdDirectionsBike } from "react-icons/md";
import { RiSofaLine } from "react-icons/ri";
import { IoDiamondOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
import { BsStars } from "react-icons/bs";
import { HiOutlineCube } from "react-icons/hi";
import { GiPaintBrush } from "react-icons/gi";
import { FiUpload } from "react-icons/fi";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { MdShoppingCart } from "react-icons/md";
import { LuWarehouse } from "react-icons/lu";
import { LuLandPlot } from "react-icons/lu";
import { LuBedDouble } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";



const ProductCreation = () => {

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const marketplacePreviewsRef = useRef([]);
  const selectedMarketplaceFilesRef = useRef([]);
  const marketplaceFormRef = useRef(null);
  const marketplaceTitleRef = useRef(null);
  const marketplaceDescriptionRef = useRef(null);
  const marketplaceValueRef = useRef(null);
  const marketplaceStatusRef = useRef(null);
  const marketplaceTierRef = useRef(null);
  const marketplaceCountryRef = useRef(null);
  const [propertyType, setPropertyType] = useState("");
  const [ItemType, setItemType] = useState("");
  const [selectedMarketplaceFiles, setSelectedMarketplaceFiles] = useState([]);
  const [marketplaceFilePreviews, setMarketplaceFilePreviews] = useState([]);
  const [isMarketplaceSubmitting, setIsMarketplaceSubmitting] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleIconClick = () => { fileInputRef.current.click(); };
  const handleVideoIconClick = () => { videoInputRef.current.click(); };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setSelectedVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setSelectedVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);
    if (incomingFiles.length === 0) return;

    const currentFiles = selectedMarketplaceFilesRef.current;
    const seen = new Set(
      currentFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );
    const newUniqueFiles = incomingFiles.filter((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (newUniqueFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const nextFiles = [...currentFiles, ...newUniqueFiles];
    selectedMarketplaceFilesRef.current = nextFiles;
    setSelectedMarketplaceFiles(nextFiles);

    const nextPreviews = [
      ...marketplacePreviewsRef.current,
      ...newUniqueFiles.map((file) => ({
        name: file.name,
        isVideo: file.type.startsWith("video/"),
        url: URL.createObjectURL(file),
      })),
    ];
    marketplacePreviewsRef.current = nextPreviews;
    setMarketplaceFilePreviews(nextPreviews);

    event.target.value = "";
  };

    const [activeTab, setActiveTab] = useState("realestate");
    const [listingMode, setListingMode] = useState("marketplace");
    const navigate = useNavigate();
    const { mode } = useParams();
    const modeByRoute = {
      marketplace: "marketplace",
      buynow: "buynow",
      auction: "auction",
      auctions: "auction",
      tolet: "tolet",
      "to-let": "tolet",
    };

    React.useEffect(() => {
      marketplacePreviewsRef.current = marketplaceFilePreviews;
    }, [marketplaceFilePreviews]);

    React.useEffect(() => {
      selectedMarketplaceFilesRef.current = selectedMarketplaceFiles;
    }, [selectedMarketplaceFiles]);

    React.useEffect(() => () => {
      marketplacePreviewsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    }, []);

    React.useEffect(() => {
      const nextMode = modeByRoute[(mode || "").toLowerCase()];
      if (nextMode) {
        setListingMode(nextMode);
        if (nextMode === "tolet") setActiveTab("residential");
        else setActiveTab("realestate");
      }
    }, [mode]);

    const categoryByTab = {
      realestate: "REAL_ESTATE",
      cars: "CARS",
      bikes: "BIKES",
      furniture: "FURNITURE",
      jewellery: "JEWELLERY_AND_WATCHES",
      arts: "ARTS_AND_PAINTINGS",
      antiques: "ANTIQUES",
      collectables: "COLLECTABLES",
    };

    const normalizeMetaKey = (label) =>
      label
        .replace(/[^\w\s]/g, " ")
        .trim()
        .split(/\s+/)
        .map((part, index) =>
          index === 0
            ? part.toLowerCase()
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join("");

    const getFieldLabel = (element) => {
      const wrapper = element.closest(".basicinfoinputdiv");
      const wrapperTitle = wrapper?.querySelector(".basicinfotitle")?.textContent?.trim();
      if (wrapperTitle) return wrapperTitle;

      const container = element.parentElement;
      if (!container) return "";
      const headings = Array.from(container.children).filter((child) =>
        child.classList?.contains("basicinfotitle"),
      );
      const elementIndex = Array.from(container.children).indexOf(element);
      let nearestHeading = "";
      for (const heading of headings) {
        if (Array.from(container.children).indexOf(heading) < elementIndex) {
          nearestHeading = heading.textContent?.trim() || "";
        }
      }
      return nearestHeading;
    };

    const CORE_PLACEHOLDERS = new Set([
      marketplaceTitleRef,
      marketplaceDescriptionRef,
      marketplaceValueRef,
      marketplaceStatusRef,
      marketplaceTierRef,
      marketplaceCountryRef,
    ]);

    const collectMarketplaceMeta = (stateOverrides = {}) => {
      const formRoot = marketplaceFormRef.current;
      const meta = {};

      if (formRoot) {
        const elements = Array.from(
          formRoot.querySelectorAll("input, select, textarea"),
        );

        for (const element of elements) {
          if ([...CORE_PLACEHOLDERS].some((r) => r.current === element)) continue;
          if (element.type === "file") continue;
          if (!element.value?.trim()) continue;

          const rawLabel = getFieldLabel(element) || element.placeholder || element.name;
          if (!rawLabel) continue;
          let key = normalizeMetaKey(rawLabel);
          if (!key) continue;

          if (meta[key] !== undefined) {
            let suffix = 2;
            while (meta[`${key}${suffix}`] !== undefined) suffix += 1;
            key = `${key}${suffix}`;
          }
          meta[key] = element.value.trim();
        }
      }

      // Merge explicit state overrides — these guarantee controlled-select values
      // and any state-driven fields are always present in meta.
      for (const [k, v] of Object.entries(stateOverrides)) {
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          meta[k] = String(v).trim();
        }
      }

      return meta;
    };

    const buildMediaKey = (file, productId) => {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const safeName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .slice(0, 50);
      return `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}.${ext}`;
    };

    const uploadFileWithPresignedUrl = async (file, productId) => {
      const key = buildMediaKey(file, productId);
      const presignedResponse = await api.get("/api/media/presigned", {
        params: { key },
      });
      const uploadUrl = presignedResponse?.data?.data?.url;
      const returnedKey = presignedResponse?.data?.data?.key || key;
      if (!uploadUrl) {
        throw new Error("Presigned URL missing from response");
      }

      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error(`File upload failed for ${file.name}`);
      }

      return returnedKey;
    };

    const listingTypeByMode = {
      marketplace: "MARKETPLACE",
      buynow: "BUY_NOW",
      auction: "AUCTIONS",
      tolet: "TO_LET",
    };

    const resolveTitle = (formRoot) =>
      marketplaceTitleRef.current?.value?.trim() ||
      formRoot?.querySelector("input.basicinfoinput")?.value?.trim() ||
      "";

    const resolveDescription = (formRoot) =>
      marketplaceDescriptionRef.current?.value?.trim() ||
      formRoot
        ?.querySelector('input[placeholder*="description" i], textarea[placeholder*="description" i]')
        ?.value?.trim() ||
      "";

    const resolveRawValue = (formRoot) => {
      const fromRef = marketplaceValueRef.current?.value?.trim();
      if (fromRef) return fromRef;
      const numericCandidate = Array.from(
        formRoot?.querySelectorAll(".basicinfoinput1, .basicinfoinput4") || [],
      )
        .map((element) => element.value?.trim() || "")
        .find(Boolean);
      return numericCandidate || "";
    };

    const handleCreateProduct = async () => {
      if (isMarketplaceSubmitting) return;

      const listingType = listingTypeByMode[listingMode];
      if (!listingType) {
        alert("Unsupported listing mode.");
        return;
      }

      const formRoot = marketplaceFormRef.current;
      const title = resolveTitle(formRoot);
      const description = resolveDescription(formRoot);
      const rawValue = resolveRawValue(formRoot);
      const status = marketplaceStatusRef.current?.value || "ACTIVE";
      const tier = marketplaceTierRef.current?.value || "GENERAL";
      const country = marketplaceCountryRef.current?.value || "INDIA";
      const category = listingMode === "tolet" ? "REAL_ESTATE" : categoryByTab[activeTab];
      const parsedValue = rawValue
        ? Number.parseInt(rawValue.replace(/[^0-9]/g, ""), 10)
        : undefined;

      if (!title) {
        alert("Title is required.");
        return;
      }

      if (rawValue && Number.isNaN(parsedValue)) {
        alert("Value must contain numbers only.");
        return;
      }

      if (!category) {
        alert("Selected category is not supported for this listing.");
        return;
      }

      // ── Universal mandatory field validation (all modes) ───────────────
      {
        const root = marketplaceFormRef.current;
        const missing = [];

        if (!title) missing.push("Title");
        if (!description?.trim()) missing.push("Description");
        if (!rawValue) missing.push(listingMode === "tolet" ? "Rent" : "Value");
        if (marketplaceFilePreviews.length === 0) missing.push("At least one product image");

        const inputDivs = Array.from(root?.querySelectorAll(".basicinfoinputdiv") || []);
        for (const div of inputDivs) {
          const h = div.querySelector(".basicinfotitle");
          if (!h) continue;
          const label = h.textContent?.replace(/\*/g, "").trim();
          if (!label) continue;
          if (label === "Product Video") continue;
          if (label === "Social Media Link") continue;
          const input = div.querySelector("input, select, textarea");
          if (!input || input.type === "file") continue;
          if (!input.value?.trim()) missing.push(label);
        }

        if (missing.length > 0) {
          alert(`Please fill the required fields:\n${Array.from(new Set(missing)).join(", ")}`);
          return;
        }
      }

      try {
        setIsMarketplaceSubmitting(true);

        const stateOverrides = {};
        if (propertyType) stateOverrides.propertyType = propertyType;
        if (ItemType) stateOverrides.itemType = ItemType;
        if (listingMode === "tolet") stateOverrides.toletCategory = activeTab;

        const createPayload = {
          title,
          description: description || undefined,
          listingType,
          category,
          tier,
          country,
          approveNow: status === "ACTIVE",
          value: parsedValue,
          meta: JSON.stringify(collectMarketplaceMeta(stateOverrides)),
        };

        const createdProductResponse = await api.post("/api/product", createPayload);
        const productId = createdProductResponse?.data?.data?.id;

        if (!productId) {
          throw new Error("Product ID missing after creation");
        }

        const mediaPatch = {};

        if (selectedMarketplaceFiles.length > 0) {
          const uploadedKeys = [];
          for (const file of selectedMarketplaceFiles) {
            const key = await uploadFileWithPresignedUrl(file, productId);
            uploadedKeys.push(key);
          }
          if (uploadedKeys.length > 0) {
            mediaPatch.media = uploadedKeys;
          }
        }

        if (selectedVideoFile) {
          const videoKey = await uploadFileWithPresignedUrl(selectedVideoFile, productId);
          mediaPatch.video = videoKey;
        }

        if (Object.keys(mediaPatch).length > 0) {
          await api.patch(`/api/product/${productId}/media`, mediaPatch);
        }

        alert("Product created successfully.");
        setMarketplaceFilePreviews((current) => {
          current.forEach((item) => URL.revokeObjectURL(item.url));
          return [];
        });
        setSelectedMarketplaceFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setSelectedVideoFile(null);
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        navigate("/products");
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create product.";
        alert(message);
      } finally {
        setIsMarketplaceSubmitting(false);
      }
    };

  return ( <div className='productcontainer1'>
    <div className='producthead1'>
        <div className='backbutton' onClick={() => navigate("/products")}><BiLeftArrowAlt /></div>
          <div className='productheadinfo'>
                <h1 className='productsheader'>Create New Product</h1>
                <span className='productheaddesc'>Add a new luxury item to the auction</span>
            </div>
     </div>
    <div className="productselection">

        <ul
  className={
    listingMode === "marketplace"
      ? "selectedcategory"
      : "selectedcategory1"
  }
  onClick={() => navigate("/productcreation/marketplace", { replace: true })}
>
        <li
            className={
            listingMode === "marketplace"
                ? "selectedcaticon"
                : "selectedcaticon1"
            }
        >
            <AiOutlineShop />
        </li>

        <li
            className={
            listingMode === "marketplace"
                ? "selectedcatname"
                : "selectedcatname1"
            }
        >
            Marketplace
        </li>

        <li className="selectedcatdesc">
            List and connect directly with buyers.
        </li>

        {listingMode === "marketplace" && (
            <li className="selectedcattag">Selected</li>
        )}
        </ul>


        <ul
        className={
            listingMode === "buynow"
            ? "selectedcategory"
            : "selectedcategory1"
        }
        onClick={() => navigate("/productcreation/buynow", { replace: true })}
        >
        <li
            className={
            listingMode === "buynow"
                ? "selectedcaticon"
                : "selectedcaticon1"
            }
        >
            <BsLightningCharge />
        </li>

        <li
            className={
            listingMode === "buynow"
                ? "selectedcatname"
                : "selectedcatname1"
            }
        >
            Buy Now
        </li>

        <li className="selectedcatdesc">
            We manage the sale for you, end-to-end.
        </li>

        {listingMode === "buynow" && (
            <li className="selectedcattag">Selected</li>
        )}
        </ul>


        <ul
        className={
            listingMode === "auction"
            ? "selectedcategory"
            : "selectedcategory1"
        }
        onClick={() => navigate("/productcreation/auction", { replace: true })}
        >
        <li
            className={
            listingMode === "auction"
                ? "selectedcaticon"
                : "selectedcaticon1"
            }
        >
            <TbHammer />
        </li>

        <li
            className={
            listingMode === "auction"
                ? "selectedcatname"
                : "selectedcatname1"
            }
        >
            Auctions
        </li>

        <li className="selectedcatdesc">
            List items for competitive offline bidding.
        </li>

        {listingMode === "auction" && (
            <li className="selectedcattag">Selected</li>
        )}
        </ul>


        <ul
            className={
                listingMode === "tolet"
                ? "selectedcategory"
                : "selectedcategory1"
            }
            onClick={() => navigate("/productcreation/tolet", { replace: true })}
            >
            <li
                className={
                listingMode === "tolet"
                    ? "selectedcaticon"
                    : "selectedcaticon1"
                }
            >
                <FiHome />
            </li>

            <li
                className={
                listingMode === "tolet"
                    ? "selectedcatname"
                    : "selectedcatname1"
                }
            >
                To Let
            </li>

            <li className="selectedcatdesc">
                List your property and find tenants easily
            </li>

            {listingMode === "tolet" && (
                <li className="selectedcattag">Selected</li>
            )}
            </ul>


    </div>
    {listingMode === "marketplace" && <div ref={marketplaceFormRef}>
    <div className="categoryfilter1">
        <div className='categoryselctionheader1'>
            <div className='productcategoryselector'><AiOutlineShop /></div>
          <div className='productheadinfo'>
                <h1 className='productcreatehead'>Select Product Category</h1>
                <span className='productheaddesc1'>Choose the type of product for marketplace</span>
            </div>
        </div>
        <ul className="categoryfilters1">
            <li
                className={`categoryselection4 ${activeTab === "realestate" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("realestate")}
            >
                <PiBuildingOfficeBold className="categoryicon" /> Real Estate
            </li>

            <li
                className={`categoryselection4 ${activeTab === "cars" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("cars")}
            >
                <LiaCarSideSolid className="categoryicon" /> Cars
            </li>

            <li
                className={`categoryselection4 ${activeTab === "bikes" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("bikes")}
            >
                <MdDirectionsBike className="categoryicon" /> Bikes
            </li>

            <li
                className={`categoryselection4 ${activeTab === "furniture" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("furniture")}
            >
                <RiSofaLine className="categoryicon" /> Furniture
            </li>

            <li
                className={`categoryselection4 ${activeTab === "jewellery" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("jewellery")}
            >
                <IoDiamondOutline className="categoryicon" /> Jewellery & Watches
            </li>

            <li
                className={`categoryselection4 ${activeTab === "arts" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("arts")}
            >
                <GiPaintBrush  className="categoryicon" /> Arts & Paintings
            </li>

            <li
                className={`categoryselection4 ${activeTab === "antiques" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("antiques")}
            >
                <BsStars className="categoryicon" /> Antiques
            </li>

            <li
                className={`categoryselection4 ${activeTab === "collectables" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("collectables")}
            >
                <HiOutlineCube className="categoryicon" /> Collectables
            </li>

            <li
                className={`categoryselection4 ${activeTab === "others" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("others")}
            >
                <PiDotsThreeBold  className="categoryicon" /> Others
            </li>
        </ul>

    </div>
    <div className='basicinfoform'>
        <h3 className='basicinfotitle'>Basic Information</h3>
        <span className='basicinfodesc'>Enter the basic details and upload media for the product</span>
        <h3 className='basicinfotitle'>Product Images / Video<span className="required-star">*</span></h3>
        <ul className='selectedcategory2'>
                <li className='selectedcaticon2' onClick={handleIconClick} style={{ cursor: "pointer" }}><FiUpload /></li>
                <li className='selectedcatname1'>Click to upload or drag and drop</li>
                <li className='selectedcatdesc'>PNG, JPG, WEBP, MP4 up to 10MB • Maximum 10 files</li>
        </ul>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple accept=".png,.jpg,.jpeg,.webp,.mp4" onChange={handleFileChange}/>
        {marketplaceFilePreviews.length > 0 && (
          <div className="basicinforow marketplacePreviewsRow">
            {marketplaceFilePreviews.map((file) => (
              <div className='basicinfoinputdiv marketplacePreviewItem' key={file.url}>
                {file.isVideo ? (
                  <video src={file.url} controls style={{ width: "180px", maxHeight: "140px", borderRadius: "8px" }} />
                ) : (
                  <img src={file.url} alt={file.name} style={{ width: "180px", maxHeight: "140px", objectFit: "cover", borderRadius: "8px" }} />
                )}
                <span className='selectedcatdesc'>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <h3 className='basicinfotitle'>Product Video</h3>
        {!videoPreview ? (
          <ul className='selectedcategory2 videoUploadBox' onClick={handleVideoIconClick} style={{ cursor: "pointer" }}>
            <li className='selectedcaticon2'><FiUpload /></li>
            <li className='selectedcatname1'>Click to upload a product video</li>
            <li className='selectedcatdesc'>MP4, WEBM, MOV up to 50MB</li>
          </ul>
        ) : (
          <div className="videoPreviewContainer">
            <video src={videoPreview} controls style={{ width: "320px", maxHeight: "220px", borderRadius: "8px" }} />
            <div className="videoPreviewInfo">
              <span className='selectedcatdesc'>{selectedVideoFile?.name}</span>
              <button type="button" className="removeVideoBtn" onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}
        <input type="file" ref={videoInputRef} style={{ display: "none" }} accept=".mp4,.webm,.mov" onChange={handleVideoChange}/>
        <h3 className='basicinfotitle'>Title<span className="required-star">*</span></h3>
        <input ref={marketplaceTitleRef} type="text" placeholder="e.g., Luxury 4BHK Penthouse in South Mumbai" className="basicinfoinput" />
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Value<span className="required-star">*</span></h3>
                <input
                  ref={marketplaceValueRef}
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g., 55000000"
                  className="basicinfoinput1"
                />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>City<span className="required-star">*</span></h3>
                <input type="text" list="majorCitiesList" placeholder="Select or type city" className="basicinfoinput1" />
                <datalist id="majorCitiesList">
                    {MAJOR_CITIES.map((c) => (<option key={c} value={c} />))}
                </datalist>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Country<span className="required-star">*</span></h3>
                <select ref={marketplaceCountryRef} defaultValue="INDIA" className="basicinfoinput1">
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
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Social Media Link</h3>
                <input type="url" placeholder="Youtube, Instagram url" className="basicinfoinput1" />
            </div>
        </div>
        <h3 className='basicinfotitle'>Description<span className="required-star">*</span></h3>
        <textarea ref={marketplaceDescriptionRef} rows={4} placeholder="Provide a detailed description of the product..." className="basicinfoinput" />
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Status<span className="required-star">*</span></h3>
                <select ref={marketplaceStatusRef} defaultValue="ACTIVE" className="basicinfoinput2">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Tier<span className="required-star">*</span></h3>
                <select ref={marketplaceTierRef} defaultValue="GENERAL" className="basicinfoinput2">
                    <option value="GENERAL">General</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="CLASSIC">Classic</option>
                </select>
            </div>
        </div>
    </div>
    {activeTab === "realestate" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Real Estate Details</h3>
        <span className='basicinfodesc'>Enter property-specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Property Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Plot">Plot</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Area / Locality<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bandra West" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Landmark<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Near City Mall" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Ownership Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Freehold</option>
                    <option>Leasehold</option>
                    <option>Co-Operative Society</option>
                    <option>Power of Attorney</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>RERA Approved</option>
                    <option>Authority Approved</option>
                    <option>Not Approved</option>
                    <option>Under Process</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Availability<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>Immediate</option>
                    <option>Ready to Move</option>
                    <option>Under Construction</option>
                    <option>Within 3 Months</option>
                    <option>Within 6 Months</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Property<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 5" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Facing<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>North</option>
                    <option>East</option>
                    <option>West</option>
                    <option>South</option>
                    <option>North-East</option>
                    <option>North-West</option>
                    <option>South-East</option>
                    <option>South-West</option>
                </select>
            </div>  
        </div>
         <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Car Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
         </div> 
         {propertyType === "House" && (<div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            </div>
        )}
        {propertyType === "Villa" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div></div>)}
        {propertyType === "Apartment" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Flat" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Plot" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div>
            </div>)}
        {propertyType === "Land" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div></div>)}
        {propertyType === "Commercial" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Commercial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Shop</option>
                    <option>Showroom</option>
                    <option>Warehouse</option>
                    <option>Industrial</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Suitable For <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Retail </option>
                    <option>Clinic</option>
                    <option>Restaurant</option>
                    <option>Storage</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Washroom<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Private</option>
                    <option>Common </option>
                    <option>None</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Power Load<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 5 KW" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnished Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fire Safety Compliance<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div></div>
            </div>)}
    </div>
    }
    {activeTab === "cars" && <div className='basiccarinputs'>
        <h3 className='basicinfotitle'>Car Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Mercedes-Benz" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., S-Class" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Transmission<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Manual</option>
                    <option>Automatic</option>
                    <option>AMT</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Tyres<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Used / Part-Own</option>
                    <option>Worn Out</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Silver" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Accident History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Service History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Number of Keys<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>More</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Maharashtra" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Validity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Active</option>
                    <option>Expired</option>    
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "bikes" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Bike Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Royal Enfield" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Classic 350" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Variant<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Standard" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="Select" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Valid</option>
                    <option>Expired</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>PUC<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Current</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "furniture" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Furniture Details</h3>
        <span className='basicinfodesc'>Furniture specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furniture Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sofa</option>
                    <option>Sofa Set</option>
                    <option>Bed</option>
                    <option>Dining Table</option>
                    <option>Chair</option>
                    <option>Wardrobe</option>
                    <option>Study Table</option>
                    <option>TV Unit</option>
                    <option>Cabinet</option>
                    <option>Mattress</option>
                    <option>Office Furniture</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Solid Wood</option>
                    <option>Engineered Wood</option>
                    <option>Metal</option>
                    <option>Plastic</option>
                    <option>Fabric</option>
                    <option>Leather</option>
                    <option>Cane</option>
                    <option>Rattan</option>
                    <option>Mixed</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Never Used</option>
                    <option>Lightly Used</option>
                    <option>Moderately Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Custom</option>
                    <option>Branded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 180 × 90 × 75 cm" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color / Finish<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Color" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seating Capacity<span className="required-star">*</span></h3>
                <input type="number" placeholder="Enter Seating Capacity" className="basicinfoinput2" />
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Furniture<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Less than 1 Year</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Assembly Required<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Purchase Price<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 45000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Relocation</option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Closing Business</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "jewellery" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Jewellery & Watches Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={ItemType} onChange={(e) => setItemType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Watch">Watch</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gender<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unisex</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Invoice Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>  
        </div>
        {ItemType === "Jewellery" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Ring</option>
                    <option>Necklace</option>
                    <option>Bracelet</option>
                    <option>Earrings</option>
                    <option>Bangles</option>
                    <option>Chain Sets</option>
                    <option>Ear Studs</option>
                    <option>Custom</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Platinum</option>
                    <option>Diamond</option>
                    <option>Mixed</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Weight<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 10g" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>18K</option>
                    <option>20K</option>
                    <option>22K</option>
                    <option>24K</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certification<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>GIA</option>
                    <option>IGI</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Making Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Hallmark Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>International</option>
                    <option>Others</option>
                </select>
            </div>  
        </div>
        </div>)}
        {ItemType === "Watch" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Rolex" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., X100" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Analog</option>
                    <option>Digital </option>
                    <option>Automatic</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Strap Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Leather</option>
                    <option>Metal</option>
                    <option>Rubber</option>
                    <option>Fabric</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Box & Papers<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Purchase<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Working Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Working</option>
                    <option>Needs Repair</option>
                </select>
            </div>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Parts<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
        </div></div>)}
    </div>}
    {activeTab === "arts" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Arts & Paintings Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Art Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sculpture</option>
                    <option>Painting</option>
                    <option>Print</option>
                    <option>Digital</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Artist Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Monica" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Medium<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Oil</option>
                    <option>Arcylic</option>
                    <option>Watercolor</option>
                    <option>Mixed</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Size<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4ft" className="basicinfoinput2" />
            </div>
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year Created<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Signed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certificate<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Framed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
        </div>
    </div>}
    {activeTab === "antiques" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Antique Details</h3>
        <span className='basicinfodesc'>Antique specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Antique Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furniture</option>
                    <option>Coins</option>
                    <option>Artefacts</option>
                    <option>Decor</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approximate Age<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 150" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Origin<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Indian, Japanese" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bronze, Wood" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Restoration<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Documentation<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Historical Period<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Colonial</option>
                    <option>Victorial</option>
                    <option>Mughal</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "collectables" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Collectables Details</h3>
        <span className='basicinfodesc'>Collectable specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Type" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rarity Level<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Common</option>
                    <option>Rare</option>
                    <option>Very Rare</option>
                    <option>One-of-One</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Limited Edition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Serial Number<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Authentication<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition Grade<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Fair</option>
                    <option>Excellent</option>
                    <option>Mint</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "others" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Item Details</h3>
        <span className='basicinfodesc'>General Item information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Category<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Electronics, Books" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Sony, Apple" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>New</option>
                    <option>Used</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unused</option>
                    <option>Lightly Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Warranty<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purchase Year<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2021" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Financial</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Additional Notes<span className="required-star">*</span></h3>
                <input type="text" placeholder="Any additional information..." className="basicinfoinput2" />
            </div>  
        </div>
    </div>}
    <div className='formsubmissiontags'>
        <button className='submittbutton' onClick={handleCreateProduct} disabled={isMarketplaceSubmitting}>
          {isMarketplaceSubmitting ? (
            <>
              <span className="buttonspinner" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
        <button className='cancelbutton' onClick={() => navigate("/products")}>Cancel</button>
    </div>
    </div>}
    {listingMode === "buynow" && <div ref={marketplaceFormRef}>
    <div className="categoryfilter1">
        <div className='categoryselctionheader1'>
            <div className='productcategoryselector'><AiOutlineShop /></div>
          <div className='productheadinfo'>
                <h1 className='productcreatehead'>Select Product Category</h1>
                <span className='productheaddesc1'>Choose the type of product for marketplace</span>
            </div>
        </div>
        <ul className="categoryfilters1">
            <li
                className={`categoryselection4 ${activeTab === "realestate" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("realestate")}
            >
                <PiBuildingOfficeBold className="categoryicon" /> Real Estate
            </li>

            <li
                className={`categoryselection4 ${activeTab === "cars" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("cars")}
            >
                <LiaCarSideSolid className="categoryicon" /> Cars
            </li>

            <li
                className={`categoryselection4 ${activeTab === "bikes" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("bikes")}
            >
                <MdDirectionsBike className="categoryicon" /> Bikes
            </li>

            <li
                className={`categoryselection4 ${activeTab === "furniture" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("furniture")}
            >
                <RiSofaLine className="categoryicon" /> Furniture
            </li>

            <li
                className={`categoryselection4 ${activeTab === "jewellery" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("jewellery")}
            >
                <IoDiamondOutline className="categoryicon" /> Jewellery & Watches
            </li>

            <li
                className={`categoryselection4 ${activeTab === "arts" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("arts")}
            >
                <GiPaintBrush  className="categoryicon" /> Arts & Paintings
            </li>

            <li
                className={`categoryselection4 ${activeTab === "antiques" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("antiques")}
            >
                <BsStars className="categoryicon" /> Antiques
            </li>

            <li
                className={`categoryselection4 ${activeTab === "collectables" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("collectables")}
            >
                <HiOutlineCube className="categoryicon" /> Collectables
            </li>

            <li
                className={`categoryselection4 ${activeTab === "others" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("others")}
            >
                <PiDotsThreeBold  className="categoryicon" /> Others
            </li>
        </ul>

    </div>
    <div className='basicinfoform'>
        <h3 className='basicinfotitle'>Basic Information</h3>
        <span className='basicinfodesc'>Enter the basic details and upload media for the product</span>
        <h3 className='basicinfotitle'>Product Images / Video<span className="required-star">*</span></h3>
        <ul className='selectedcategory2'>
                <li className='selectedcaticon2' onClick={handleIconClick} style={{ cursor: "pointer" }}><FiUpload /></li>
                <li className='selectedcatname1'>Click to upload or drag and drop</li>
                <li className='selectedcatdesc'>PNG, JPG, WEBP, MP4 up to 10MB • Maximum 10 files</li>
        </ul>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple accept=".png,.jpg,.jpeg,.webp,.mp4" onChange={handleFileChange}/>
        {marketplaceFilePreviews.length > 0 && (
          <div className="basicinforow marketplacePreviewsRow">
            {marketplaceFilePreviews.map((file) => (
              <div className='basicinfoinputdiv marketplacePreviewItem' key={file.url}>
                {file.isVideo ? (
                  <video src={file.url} controls style={{ width: "180px", maxHeight: "140px", borderRadius: "8px" }} />
                ) : (
                  <img src={file.url} alt={file.name} style={{ width: "180px", maxHeight: "140px", objectFit: "cover", borderRadius: "8px" }} />
                )}
                <span className='selectedcatdesc'>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <h3 className='basicinfotitle'>Product Video</h3>
        {!videoPreview ? (
          <ul className='selectedcategory2 videoUploadBox' onClick={handleVideoIconClick} style={{ cursor: "pointer" }}>
            <li className='selectedcaticon2'><FiUpload /></li>
            <li className='selectedcatname1'>Click to upload a product video</li>
            <li className='selectedcatdesc'>MP4, WEBM, MOV up to 50MB</li>
          </ul>
        ) : (
          <div className="videoPreviewContainer">
            <video src={videoPreview} controls style={{ width: "320px", maxHeight: "220px", borderRadius: "8px" }} />
            <div className="videoPreviewInfo">
              <span className='selectedcatdesc'>{selectedVideoFile?.name}</span>
              <button type="button" className="removeVideoBtn" onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}
        <input type="file" ref={videoInputRef} style={{ display: "none" }} accept=".mp4,.webm,.mov" onChange={handleVideoChange}/>
        <h3 className='basicinfotitle'>Title<span className="required-star">*</span></h3>
        <input type="text" placeholder="e.g., Luxury 4BHK Penthouse in South Mumbai" className="basicinfoinput" />
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Value<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 55000000" className="basicinfoinput1" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>City<span className="required-star">*</span></h3>
                <input type="text" list="majorCitiesList" placeholder="Select or type city" className="basicinfoinput1" />
                <datalist id="majorCitiesList">
                    {MAJOR_CITIES.map((c) => (<option key={c} value={c} />))}
                </datalist>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Country<span className="required-star">*</span></h3>
                <select ref={marketplaceCountryRef} defaultValue="INDIA" className="basicinfoinput1">
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
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Social Media Link</h3>
                <input type="url" placeholder="Youtube, Instagram url" className="basicinfoinput1" />
            </div>
        </div>
        <h3 className='basicinfotitle'>Description<span className="required-star">*</span></h3>
        <textarea rows={4} placeholder="Provide a detailed description of the product..." className="basicinfoinput" />
    </div>
    {activeTab === "realestate" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Real Estate Details</h3>
        <span className='basicinfodesc'>Enter property-specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Property Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Plot">Plot</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Area / Locality<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bandra West" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Landmark<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Near City Mall" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Ownership Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Freehold</option>
                    <option>Leasehold</option>
                    <option>Co-Operative Society</option>
                    <option>Power of Attorney</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>RERA Approved</option>
                    <option>Authority Approved</option>
                    <option>Not Approved</option>
                    <option>Under Process</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Availability<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>Immediate</option>
                    <option>Ready to Move</option>
                    <option>Under Construction</option>
                    <option>Within 3 Months</option>
                    <option>Within 6 Months</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Property<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 5" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Facing<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>North</option>
                    <option>East</option>
                    <option>West</option>
                    <option>South</option>
                    <option>North-East</option>
                    <option>North-West</option>
                    <option>South-East</option>
                    <option>South-West</option>
                </select>
            </div>  
        </div>
         <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Car Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
         </div> 
         {propertyType === "House" && (<div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            </div>
        )}
        {propertyType === "Villa" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div></div>)}
        {propertyType === "Apartment" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Flat" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Plot" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div>
            </div>)}
        {propertyType === "Land" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div></div>)}
        {propertyType === "Commercial" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Commercial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Shop</option>
                    <option>Showroom</option>
                    <option>Warehouse</option>
                    <option>Industrial</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Suitable For <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Retail </option>
                    <option>Clinic</option>
                    <option>Restaurant</option>
                    <option>Storage</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Washroom<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Private</option>
                    <option>Common </option>
                    <option>None</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Power Load<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 5 KW" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnished Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fire Safety Compliance<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div></div>
            </div>)}
    </div>
    }
    {activeTab === "cars" && <div className='basiccarinputs'>
        <h3 className='basicinfotitle'>Car Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Mercedes-Benz" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., S-Class" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Transmission<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Manual</option>
                    <option>Automatic</option>
                    <option>AMT</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Tyres<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Used / Part-Own</option>
                    <option>Worn Out</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Silver" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Accident History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Service History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Number of Keys<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>More</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Maharashtra" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Validity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Active</option>
                    <option>Expired</option>    
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "bikes" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Bike Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Royal Enfield" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Classic 350" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Variant<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Standard" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="Select" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Valid</option>
                    <option>Expired</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>PUC<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Current</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "furniture" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Furniture Details</h3>
        <span className='basicinfodesc'>Furniture specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furniture Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sofa</option>
                    <option>Sofa Set</option>
                    <option>Bed</option>
                    <option>Dining Table</option>
                    <option>Chair</option>
                    <option>Wardrobe</option>
                    <option>Study Table</option>
                    <option>TV Unit</option>
                    <option>Cabinet</option>
                    <option>Mattress</option>
                    <option>Office Furniture</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Solid Wood</option>
                    <option>Engineered Wood</option>
                    <option>Metal</option>
                    <option>Plastic</option>
                    <option>Fabric</option>
                    <option>Leather</option>
                    <option>Cane</option>
                    <option>Rattan</option>
                    <option>Mixed</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Never Used</option>
                    <option>Lightly Used</option>
                    <option>Moderately Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Custom</option>
                    <option>Branded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 180 × 90 × 75 cm" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color / Finish<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Color" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seating Capacity<span className="required-star">*</span></h3>
                <input type="number" placeholder="Enter Seating Capacity" className="basicinfoinput2" />
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Furniture<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Less than 1 Year</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Assembly Required<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Purchase Price<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 45000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Relocation</option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Closing Business</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "jewellery" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Jewellery & Watches Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={ItemType} onChange={(e) => setItemType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Watch">Watch</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gender<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unisex</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Invoice Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>  
        </div>
        {ItemType === "Jewellery" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Ring</option>
                    <option>Necklace</option>
                    <option>Bracelet</option>
                    <option>Earrings</option>
                    <option>Bangles</option>
                    <option>Chain Sets</option>
                    <option>Ear Studs</option>
                    <option>Custom</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Platinum</option>
                    <option>Diamond</option>
                    <option>Mixed</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Weight<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 10g" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>18K</option>
                    <option>20K</option>
                    <option>22K</option>
                    <option>24K</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certification<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>GIA</option>
                    <option>IGI</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Making Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Hallmark Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>International</option>
                    <option>Others</option>
                </select>
            </div>  
        </div>
        </div>)}
        {ItemType === "Watch" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Rolex" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., X100" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Analog</option>
                    <option>Digital </option>
                    <option>Automatic</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Strap Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Leather</option>
                    <option>Metal</option>
                    <option>Rubber</option>
                    <option>Fabric</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Box & Papers<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Purchase<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Working Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Working</option>
                    <option>Needs Repair</option>
                </select>
            </div>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Parts<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
        </div></div>)}
    </div>}
    {activeTab === "arts" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Arts & Paintings Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Art Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sculpture</option>
                    <option>Painting</option>
                    <option>Print</option>
                    <option>Digital</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Artist Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Monica" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Medium<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Oil</option>
                    <option>Arcylic</option>
                    <option>Watercolor</option>
                    <option>Mixed</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Size<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4ft" className="basicinfoinput2" />
            </div>
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year Created<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Signed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certificate<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Framed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
        </div>
    </div>}
    {activeTab === "antiques" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Antique Details</h3>
        <span className='basicinfodesc'>Antique specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Antique Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furniture</option>
                    <option>Coins</option>
                    <option>Artefacts</option>
                    <option>Decor</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approximate Age<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 150" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Origin<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Indian, Japanese" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bronze, Wood" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Restoration<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Documentation<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Historical Period<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Colonial</option>
                    <option>Victorial</option>
                    <option>Mughal</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "collectables" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Collectables Details</h3>
        <span className='basicinfodesc'>Collectable specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Type" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rarity Level<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Common</option>
                    <option>Rare</option>
                    <option>Very Rare</option>
                    <option>One-of-One</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Limited Edition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Serial Number<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Authentication<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition Grade<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Fair</option>
                    <option>Excellent</option>
                    <option>Mint</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "others" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Item Details</h3>
        <span className='basicinfodesc'>General Item information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Category<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Electronics, Books" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Sony, Apple" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>New</option>
                    <option>Used</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unused</option>
                    <option>Lightly Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Warranty<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purchase Year<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2021" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Financial</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Additional Notes<span className="required-star">*</span></h3>
                <input type="text" placeholder="Any additional information..." className="basicinfoinput2" />
            </div>  
        </div>
    </div>}
    <div className='formsubmissiontags'>
        <button className='submittbutton' onClick={handleCreateProduct} disabled={isMarketplaceSubmitting}>Create Product</button>
        <button className='cancelbutton' onClick={() => navigate("/products")}>Cancel</button>
    </div>
    </div>}
    {listingMode === "auction" && <div ref={marketplaceFormRef}>
    <div className="categoryfilter1">
        <div className='categoryselctionheader1'>
            <div className='productcategoryselector'><AiOutlineShop /></div>
          <div className='productheadinfo'>
                <h1 className='productcreatehead'>Select Product Category</h1>
                <span className='productheaddesc1'>Choose the type of product for marketplace</span>
            </div>
        </div>
        <ul className="categoryfilters1">
            <li
                className={`categoryselection4 ${activeTab === "realestate" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("realestate")}
            >
                <PiBuildingOfficeBold className="categoryicon" /> Real Estate
            </li>

            <li
                className={`categoryselection4 ${activeTab === "cars" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("cars")}
            >
                <LiaCarSideSolid className="categoryicon" /> Cars
            </li>

            <li
                className={`categoryselection4 ${activeTab === "bikes" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("bikes")}
            >
                <MdDirectionsBike className="categoryicon" /> Bikes
            </li>

            <li
                className={`categoryselection4 ${activeTab === "furniture" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("furniture")}
            >
                <RiSofaLine className="categoryicon" /> Furniture
            </li>

            <li
                className={`categoryselection4 ${activeTab === "jewellery" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("jewellery")}
            >
                <IoDiamondOutline className="categoryicon" /> Jewellery & Watches
            </li>

            <li
                className={`categoryselection4 ${activeTab === "arts" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("arts")}
            >
                <GiPaintBrush  className="categoryicon" /> Arts & Paintings
            </li>

            <li
                className={`categoryselection4 ${activeTab === "antiques" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("antiques")}
            >
                <BsStars className="categoryicon" /> Antiques
            </li>

            <li
                className={`categoryselection4 ${activeTab === "collectables" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("collectables")}
            >
                <HiOutlineCube className="categoryicon" /> Collectables
            </li>

            <li
                className={`categoryselection4 ${activeTab === "others" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("others")}
            >
                <PiDotsThreeBold  className="categoryicon" /> Others
            </li>
        </ul>

    </div>
    <div className='basicinfoform'>
        <h3 className='basicinfotitle'>Basic Information</h3>
        <span className='basicinfodesc'>Enter the basic details and upload media for the product</span>
        <h3 className='basicinfotitle'>Product Images / Video<span className="required-star">*</span></h3>
        <ul className='selectedcategory2'>
                <li className='selectedcaticon2'onClick={handleIconClick} style={{ cursor: "pointer" }}><FiUpload /></li>
                <li className='selectedcatname1'>Click to upload or drag and drop</li>
                <li className='selectedcatdesc'>PNG, JPG, WEBP, MP4 up to 10MB • Maximum 10 files</li>
        </ul>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple accept=".png,.jpg,.jpeg,.webp,.mp4" onChange={handleFileChange}/>
        {marketplaceFilePreviews.length > 0 && (
          <div className="basicinforow marketplacePreviewsRow">
            {marketplaceFilePreviews.map((file) => (
              <div className='basicinfoinputdiv marketplacePreviewItem' key={file.url}>
                {file.isVideo ? (
                  <video src={file.url} controls style={{ width: "180px", maxHeight: "140px", borderRadius: "8px" }} />
                ) : (
                  <img src={file.url} alt={file.name} style={{ width: "180px", maxHeight: "140px", objectFit: "cover", borderRadius: "8px" }} />
                )}
                <span className='selectedcatdesc'>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <h3 className='basicinfotitle'>Product Video</h3>
        {!videoPreview ? (
          <ul className='selectedcategory2 videoUploadBox' onClick={handleVideoIconClick} style={{ cursor: "pointer" }}>
            <li className='selectedcaticon2'><FiUpload /></li>
            <li className='selectedcatname1'>Click to upload a product video</li>
            <li className='selectedcatdesc'>MP4, WEBM, MOV up to 50MB</li>
          </ul>
        ) : (
          <div className="videoPreviewContainer">
            <video src={videoPreview} controls style={{ width: "320px", maxHeight: "220px", borderRadius: "8px" }} />
            <div className="videoPreviewInfo">
              <span className='selectedcatdesc'>{selectedVideoFile?.name}</span>
              <button type="button" className="removeVideoBtn" onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}
        <input type="file" ref={videoInputRef} style={{ display: "none" }} accept=".mp4,.webm,.mov" onChange={handleVideoChange}/>
        <h3 className='basicinfotitle'>Title<span className="required-star">*</span></h3>
        <input type="text" placeholder="e.g., Luxury 4BHK Penthouse in South Mumbai" className="basicinfoinput" />
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Value<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 55000000" className="basicinfoinput1" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>City<span className="required-star">*</span></h3>
                <input type="text" list="majorCitiesList" placeholder="Select or type city" className="basicinfoinput1" />
                <datalist id="majorCitiesList">
                    {MAJOR_CITIES.map((c) => (<option key={c} value={c} />))}
                </datalist>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Country<span className="required-star">*</span></h3>
                <select ref={marketplaceCountryRef} defaultValue="INDIA" className="basicinfoinput1">
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
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Social Media Link</h3>
                <input type="url" placeholder="Youtube, Instagram url" className="basicinfoinput1" />
            </div>
        </div>
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Auction Venue<span className="required-star">*</span></h3>
                <input type='text' placeholder='e.g., Taj Palace, Mumbai' className='basicinfoinput1' />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Auction Date<span className="required-star">*</span></h3>
                <input type='date' className='basicinfoinput1' />
            </div>
        </div>
        <h3 className='basicinfotitle'>Description<span className="required-star">*</span></h3>
        <textarea rows={4} placeholder="Provide a detailed description of the product..." className="basicinfoinput" />
    </div>
    {activeTab === "realestate" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Real Estate Details</h3>
        <span className='basicinfodesc'>Enter property-specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Property Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Plot">Plot</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Area / Locality<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bandra West" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Landmark<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Near City Mall" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Ownership Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Freehold</option>
                    <option>Leasehold</option>
                    <option>Co-Operative Society</option>
                    <option>Power of Attorney</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>RERA Approved</option>
                    <option>Authority Approved</option>
                    <option>Not Approved</option>
                    <option>Under Process</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Availability<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>Immediate</option>
                    <option>Ready to Move</option>
                    <option>Under Construction</option>
                    <option>Within 3 Months</option>
                    <option>Within 6 Months</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Property<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 5" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Facing<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type <FaChevronDown /></option>
                    <option>North</option>
                    <option>East</option>
                    <option>West</option>
                    <option>South</option>
                    <option>North-East</option>
                    <option>North-West</option>
                    <option>South-East</option>
                    <option>South-West</option>
                </select>
            </div>  
        </div>
         <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Car Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
         </div> 
         {propertyType === "House" && (<div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            </div>
        )}
        {propertyType === "Villa" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floors <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Garden<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gated Community<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div></div>)}
        {propertyType === "Apartment" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Flat" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor Number<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total Floors <span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 4" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., My Home Booja" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded </option>
                    <option>On Request</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lift<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Amenities  <span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Gym, Pool" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Balcony Count<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>No</option>
                    <option>Open</option>
                    <option>Covered</option>
                </select>
            </div> 
            </div>
            </div>)}
        {propertyType === "Plot" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div>
            </div>)}
        {propertyType === "Land" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 300 x 400" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Plot Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Road Width<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 20 ft" className="basicinfoinput2" />
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approval Type <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>DTCP</option>
                    <option>HMDA</option>
                    <option>RERA</option>
                    <option>Panchayat </option>
                    <option>NA</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Boundary Wall <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Corner Plot<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Electricity Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Water Connection <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Municipal</option>
                    <option>Borewell</option>
                    <option>Both</option>
                    <option>None </option>
                </select>
            </div>
            </div></div>)}
        {propertyType === "Commercial" && (<div><div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Commercial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Shop</option>
                    <option>Showroom</option>
                    <option>Warehouse</option>
                    <option>Industrial</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 1200 sq.ft" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Floor<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 3" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Parking<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Suitable For <span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Office</option>
                    <option>Retail </option>
                    <option>Clinic</option>
                    <option>Restaurant</option>
                    <option>Storage</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Washroom<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Private</option>
                    <option>Common </option>
                    <option>None</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Power Load<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 5 KW" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnished Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Furnished</option>
                </select>
            </div> 
            </div>
            <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fire Safety Compliance<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div></div>
            </div>)}
    </div>
    }
    {activeTab === "cars" && <div className='basiccarinputs'>
        <h3 className='basicinfotitle'>Car Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Mercedes-Benz" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., S-Class" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Transmission<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Manual</option>
                    <option>Automatic</option>
                    <option>AMT</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Tyres<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Used / Part-Own</option>
                    <option>Worn Out</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Silver" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Accident History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Service History<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Number of Keys<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1</option>
                    <option>2</option>
                    <option>More</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Maharashtra" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Validity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Active</option>
                    <option>Expired</option>    
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "bikes" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Bike Details</h3>
        <span className='basicinfodesc'>Vehicle specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Royal Enfield" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Classic 350" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Variant<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Standard" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Manufacture<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2020" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>KM Driven<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 25000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>No of Owners<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Fuel Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Negotiable<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Registration State<span className="required-star">*</span></h3>
                <input type="text" placeholder="Select" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Insurance Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Valid</option>
                    <option>Expired</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>RC Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes / Available</option>
                    <option>No / Missing</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>PUC<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Current</option>
                    <option>Not Available</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "furniture" && <div className='basicbikeinputs'>
        <h3 className='basicinfotitle'>Furniture Details</h3>
        <span className='basicinfodesc'>Furniture specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furniture Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sofa</option>
                    <option>Sofa Set</option>
                    <option>Bed</option>
                    <option>Dining Table</option>
                    <option>Chair</option>
                    <option>Wardrobe</option>
                    <option>Study Table</option>
                    <option>TV Unit</option>
                    <option>Cabinet</option>
                    <option>Mattress</option>
                    <option>Office Furniture</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Solid Wood</option>
                    <option>Engineered Wood</option>
                    <option>Metal</option>
                    <option>Plastic</option>
                    <option>Fabric</option>
                    <option>Leather</option>
                    <option>Cane</option>
                    <option>Rattan</option>
                    <option>Mixed</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Never Used</option>
                    <option>Lightly Used</option>
                    <option>Moderately Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Custom</option>
                    <option>Branded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dimensions<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 180 × 90 × 75 cm" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Color / Finish<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Color" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seating Capacity<span className="required-star">*</span></h3>
                <input type="number" placeholder="Enter Seating Capacity" className="basicinfoinput2" />
            </div>  
        </div>
         <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Age of Furniture<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Less than 1 Year</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Assembly Required<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Purchase Price<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 45000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Relocation</option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Closing Business</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Seller Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Dealer</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "jewellery" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Jewellery & Watches Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2" value={ItemType} onChange={(e) => setItemType(e.target.value)}>
                    <option value="">Select type<FaChevronDown /></option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Watch">Watch</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Brand New</option>
                    <option>Pre-Owned</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Gender<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unisex</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Invoice Available<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>  
        </div>
        {ItemType === "Jewellery" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Ring</option>
                    <option>Necklace</option>
                    <option>Bracelet</option>
                    <option>Earrings</option>
                    <option>Bangles</option>
                    <option>Chain Sets</option>
                    <option>Ear Studs</option>
                    <option>Custom</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Platinum</option>
                    <option>Diamond</option>
                    <option>Mixed</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Weight<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 10g" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purity<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>18K</option>
                    <option>20K</option>
                    <option>22K</option>
                    <option>24K</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certification<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>GIA</option>
                    <option>IGI</option>
                    <option>Others</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Making Charges<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Included</option>
                    <option>Excluded</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Hallmark Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>BIS</option>
                    <option>International</option>
                    <option>Others</option>
                </select>
            </div>  
        </div>
        </div>)}
        {ItemType === "Watch" && (<div><div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Rolex" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Model<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., X100" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Dial Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Analog</option>
                    <option>Digital </option>
                    <option>Automatic</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Strap Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Leather</option>
                    <option>Metal</option>
                    <option>Rubber</option>
                    <option>Fabric</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Box & Papers<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year of Purchase<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Working Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Working</option>
                    <option>Needs Repair</option>
                </select>
            </div>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Original Parts<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
        </div></div>)}
    </div>}
    {activeTab === "arts" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Arts & Paintings Details</h3>
        <span className='basicinfodesc'>Item specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Art Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Sculpture</option>
                    <option>Painting</option>
                    <option>Print</option>
                    <option>Digital</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Artist Name<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Monica" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Medium<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Oil</option>
                    <option>Arcylic</option>
                    <option>Watercolor</option>
                    <option>Mixed</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Size<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4ft" className="basicinfoinput2" />
            </div>
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Year Created<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2024" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Signed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Certificate<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Framed<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div>
        </div>
    </div>}
    {activeTab === "antiques" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Antique Details</h3>
        <span className='basicinfodesc'>Antique specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Antique Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furniture</option>
                    <option>Coins</option>
                    <option>Artefacts</option>
                    <option>Decor</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Approximate Age<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 150" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Origin<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Indian, Japanese" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Material<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Bronze, Wood" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Restoration<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Documentation<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Historical Period<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Colonial</option>
                    <option>Victorial</option>
                    <option>Mughal</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "collectables" && <div className='basicjewelinputs'>
        <h3 className='basicinfotitle'>Collectables Details</h3>
        <span className='basicinfodesc'>Collectable specific information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Type<span className="required-star">*</span></h3>
                <input type="text" placeholder="Enter Type" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rarity Level<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Common</option>
                    <option>Rare</option>
                    <option>Very Rare</option>
                    <option>One-of-One</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Limited Edition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Serial Number<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                </select>
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Authentication<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition Grade<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Fair</option>
                    <option>Excellent</option>
                    <option>Mint</option>
                </select>
            </div>  
        </div>
    </div>}
    {activeTab === "others" && <div className='basicantiqueinputs'>
        <h3 className='basicinfotitle'>Item Details</h3>
        <span className='basicinfodesc'>General Item information</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Item Category<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Electronics, Books" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Brand<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Sony, Apple" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Condition<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>New</option>
                    <option>Used</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Usage<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Unused</option>
                    <option>Lightly Used</option>
                    <option>Heavily Used</option>
                </select>
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Warranty<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Available</option>
                    <option>Not Available</option>
                    <option>Refurbished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Purchase Year<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2021" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Reason for Selling<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Upgrade</option>
                    <option>Not in Use</option>
                    <option>Financial</option>
                    <option>Other</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Additional Notes<span className="required-star">*</span></h3>
                <input type="text" placeholder="Any additional information..." className="basicinfoinput2" />
            </div>  
        </div>
    </div>}
    <div className='formsubmissiontags'>
        <button className='submittbutton' onClick={handleCreateProduct} disabled={isMarketplaceSubmitting}>Create Product</button>
        <button className='cancelbutton' onClick={() => navigate("/products")}>Cancel</button>
    </div>
    </div>}
    {listingMode === "tolet" && <div ref={marketplaceFormRef}>
    <div className="categoryfilter1">
        <div className='categoryselctionheader1'>
            <div className='productcategoryselector'><AiOutlineShop /></div>
          <div className='productheadinfo'>
                <h1 className='productcreatehead'>Select Product Category</h1>
                <span className='productheaddesc1'>Choose the type of product for marketplace</span>
            </div>
        </div>
        <ul className="categoryfilters1">
            <li
                className={`categoryselection5 ${activeTab === "residential" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("residential")}
            >
                <PiBuildingOfficeBold className="categoryicon" /> Residential
            </li>

            <li
                className={`categoryselection5 ${activeTab === "office" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("office")}
            >
                <FiBriefcase className="categoryicon" /> Office Space
            </li>

            <li
                className={`categoryselection5 ${activeTab === "shops" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("shops")}
            >
                <MdShoppingCart className="categoryicon" /> Shops
            </li>

            <li
                className={`categoryselection5 ${activeTab === "warehouses" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("warehouses")}
            >
                <LuWarehouse className="categoryicon" /> Godowns & Warehouses
            </li>

            <li
                className={`categoryselection5 ${activeTab === "plots" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("plots")}
            >
                <LuLandPlot className="categoryicon" /> Open Plots
            </li>

            <li
                className={`categoryselection5 ${activeTab === "hostels" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("hostels")}
            >
                <LuBedDouble  className="categoryicon" /> PG & Hostels
            </li>

            <li
                className={`categoryselection5 ${activeTab === "coliving" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("coliving")}
            >
                <LuUsers className="categoryicon" /> Luxury Coliving
            </li>

            <li
                className={`categoryselection5 ${activeTab === "others" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("others")}
            >
                <PiDotsThreeBold  className="categoryicon" /> Others
            </li>
        </ul>
    </div>
    <div className='basicinfoform'>
        <h3 className='basicinfotitle'>Basic Information</h3>
        <span className='basicinfodesc'>Enter the basic details and upload media for the product</span>
        <h3 className='basicinfotitle'>Product Images / Video<span className="required-star">*</span></h3>
        <ul className='selectedcategory2'>
                <li className='selectedcaticon2'onClick={handleIconClick} style={{ cursor: "pointer" }}><FiUpload /></li>
                <li className='selectedcatname1'>Click to upload or drag and drop</li>
                <li className='selectedcatdesc'>PNG, JPG, WEBP, MP4 up to 10MB • Maximum 10 files</li>
        </ul>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple accept=".png,.jpg,.jpeg,.webp,.mp4" onChange={handleFileChange}/>
        {marketplaceFilePreviews.length > 0 && (
          <div className="basicinforow marketplacePreviewsRow">
            {marketplaceFilePreviews.map((file) => (
              <div className='basicinfoinputdiv marketplacePreviewItem' key={file.url}>
                {file.isVideo ? (
                  <video src={file.url} controls style={{ width: "180px", maxHeight: "140px", borderRadius: "8px" }} />
                ) : (
                  <img src={file.url} alt={file.name} style={{ width: "180px", maxHeight: "140px", objectFit: "cover", borderRadius: "8px" }} />
                )}
                <span className='selectedcatdesc'>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <h3 className='basicinfotitle'>Product Video</h3>
        {!videoPreview ? (
          <ul className='selectedcategory2 videoUploadBox' onClick={handleVideoIconClick} style={{ cursor: "pointer" }}>
            <li className='selectedcaticon2'><FiUpload /></li>
            <li className='selectedcatname1'>Click to upload a product video</li>
            <li className='selectedcatdesc'>MP4, WEBM, MOV up to 50MB</li>
          </ul>
        ) : (
          <div className="videoPreviewContainer">
            <video src={videoPreview} controls style={{ width: "320px", maxHeight: "220px", borderRadius: "8px" }} />
            <div className="videoPreviewInfo">
              <span className='selectedcatdesc'>{selectedVideoFile?.name}</span>
              <button type="button" className="removeVideoBtn" onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}
        <input type="file" ref={videoInputRef} style={{ display: "none" }} accept=".mp4,.webm,.mov" onChange={handleVideoChange}/>
        <h3 className='basicinfotitle'>Title<span className="required-star">*</span></h3>
        <input type="text" placeholder="e.g., Luxury 4BHK Penthouse in South Mumbai" className="basicinfoinput" />
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 55000000" className="basicinfoinput1" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>City<span className="required-star">*</span></h3>
                <input type="text" list="majorCitiesList" placeholder="Select or type city" className="basicinfoinput1" />
                <datalist id="majorCitiesList">
                    {MAJOR_CITIES.map((c) => (<option key={c} value={c} />))}
                </datalist>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Country<span className="required-star">*</span></h3>
                <select ref={marketplaceCountryRef} defaultValue="INDIA" className="basicinfoinput1">
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
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Social Media Link</h3>
                <input type="url" placeholder="Youtube, Instagram url" className="basicinfoinput1" />
            </div>
        </div>
        <h3 className='basicinfotitle'>Description<span className="required-star">*</span></h3>
        <textarea rows={4} placeholder="Provide a detailed description of the product..." className="basicinfoinput" />
    </div>
    {activeTab === "residential" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Ownership<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Owner</option>
                    <option>Agent</option>
                    <option>Builder</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rental Type<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Flat</option>
                    <option>Apartment</option>
                    <option>Independent House</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Penthouse</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bedrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2021" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Bathrooms<span className="required-star">*</span></h3>
                <input type="number" placeholder="e.g., 2021" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Property Floor<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 4" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Total No of Floors<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 10" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Carpet Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 3000 sft" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Built-up Area<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 2500 sft" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Facing<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., North" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Maintenance Charges<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 10,000" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Available From<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., 01/03/2026" className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Preferred Tenants<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Families" className="basicinfoinput2" />
            </div>  
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnished Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Fully - Furnished</option>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Items<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Sofa, TV," className="basicinfoinput2" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Society Amenities<span className="required-star">*</span></h3>
                <input type="text" placeholder="e.g., Lift, Power Backup" className="basicinfoinput2" />
            </div>
        </div>
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput2" />
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput2" />
            </div>
        </div>
        <div className='basicinforow'>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div>
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput2">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div>
        </div>
    </div>
    }
    {activeTab === "office" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div> 
        </div>
    </div>
    }
    {activeTab === "shops" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
           <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div> 
        </div>
    </div>
    }
    {activeTab === "warehouses" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
           <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
    </div>
    }
    {activeTab === "plots" &&
       <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
           <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div> 
        </div>
    </div>
    }
    {activeTab === "hostels" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
           <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div>  
        </div>
    </div>
    }
    {activeTab === "coliving" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div>   
        </div>
    </div>
    }
    {activeTab === "others" &&
        <div className='basiccatinputs'>
        <h3 className='basicinfotitle'>Rental Settings</h3>
        <span className='basicinfodesc'>Property rental configuration</span>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Rent per Month (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 250000" className="basicinfoinput4" />
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Security Deposit (₹)<span className="required-star">*</span></h3>
                <input type="number" inputMode="numeric" placeholder="e.g., 500000" className="basicinfoinput4" />
            </div> 
        </div>
        <div className='basicinforow'>  
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Lease Duration<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>11 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                </select>
            </div> 
            <div className='basicinfoinputdiv'>
                <h3 className='basicinfotitle'>Furnishing Status<span className="required-star">*</span></h3>
                <select className="basicinfoinput4">
                    <option value="">Select type<FaChevronDown /></option>
                    <option>Furnished</option>
                    <option>Semi Furnished</option>
                    <option>Unfurnished</option>
                    <option>Other</option>
                </select>
            </div> 
        </div>
    </div>
    }
    <div className='formsubmissiontags'>
        <button className='submittbutton' onClick={handleCreateProduct} disabled={isMarketplaceSubmitting}>Create Product</button>
        <button className='cancelbutton' onClick={() => navigate("/products")}>Cancel</button>
    </div>
    </div>}
  </div>);
};

export default ProductCreation;