import "./ProductPage.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFile } from "../../lib/s3";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

import { CiCalendar } from "react-icons/ci";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlayCircle } from "react-icons/fa";
import { AiOutlineShop } from "react-icons/ai";
import { BsStars } from "react-icons/bs";


import api from "../../lib/api";
import { isAdmin } from "../../lib/auth";

const PLACEHOLDER_IMAGES = [];

const LISTING_TYPE_LABELS = {
  MARKETPLACE: "Marketplace",
  BUY_NOW: "Buy Now",
  AUCTIONS: "Auctions",
  TO_LET: "To-Let",
};

const TIER_LABELS = {
  GENERAL: "General",
  LUXURY: "Luxury",
  CLASSIC: "Classic",
};

const formatMetaLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

const META_SKIP_KEYS = ["views", "features", "keyFeatures"];

const CATEGORY_LABELS = {
  REAL_ESTATE: "Real Estate",
  CARS: "Cars",
  BIKES: "Bikes",
  FURNITURE: "Furniture",
  JEWELLERY_AND_WATCHES: "Jewellery & Watches",
  ARTS_AND_PAINTINGS: "Arts & Paintings",
  ANTIQUES: "Antiques",
  COLLECTABLES: "Collectables",
};

const statusToLabel = (status) => {
  if (status === "APPROVED") return "active";
  if (status === "REJECTED") return "rejected";
  return "inactive";
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const getLocationText = (meta) => {
  if (!meta || typeof meta !== "object") return "Location not added";
  const location =
    meta.location ||
    meta.city ||
    [meta.area, meta.city].filter(Boolean).join(", ") ||
    meta.state ||
    meta.address;
  return location || "Location not added";
};



const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState(PLACEHOLDER_IMAGES);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Product not found");
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/api/product/${id}`);
        const data = response?.data?.data;
        setProduct(data);
        const urls = Array.isArray(data?.media) && data.media.length > 0
          ? data.media
          : PLACEHOLDER_IMAGES;
        setImages(urls);
        setSelectedImageIndex(0);
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to fetch product.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await api.delete(`/api/product/${id}`);
      navigate("/products");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="productpagecontainer">
        <p>Loading...</p>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="productpagecontainer">
        <div className="producthead1">
          <div className="backbutton" onClick={() => navigate("/products")}>
            <BiLeftArrowAlt />
          </div>
        </div>
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  const meta = product.meta || {};
  const features = Array.isArray(meta.features) ? meta.features : (meta.keyFeatures ? [meta.keyFeatures] : []);
  const owner = product.owner || {};

  return (
    <div className="productpagecontainer">
      <div className="producthead1">
        <div className="backbutton" onClick={() => navigate("/products")}>
          <BiLeftArrowAlt />
        </div>
        <div className="producthead">
          <div className="productheadinfo">
            <h1 className="productsheader">{product.title}</h1>
            <span className="productheaddesc1">
              <HiOutlineCube />{" "}
              {CATEGORY_LABELS[product.category] || product.category}
            </span>
            {product.listingType !== "AUCTIONS" && (
              <span className="productheaddesc1">
                <IoLocationOutline /> {getLocationText(meta)}
              </span>
            )}
            {product.listingType && (
              <span className="productheaddesc1">
                <AiOutlineShop />{" "}
                {LISTING_TYPE_LABELS[product.listingType] || product.listingType}
              </span>
            )}
            {product.tier && (
              <span className="productheaddesc1">
                <BsStars />{" "}
                {TIER_LABELS[product.tier] || product.tier}
              </span>
            )}
            {product.country && (
              <span className="productheaddesc1">
                {product.country}
              </span>
            )}
          </div>
          <button
            className="addproduct"
            onClick={() => navigate(`/productedit/${product.id}`)}
          >
            {" "}
            <FaRegEdit /> Edit Product
          </button>
        </div>
      </div>
      <div className="productpagedetail">
        <div className="productpageleft">
          <div className="productpageimage">
            <img
              src={getFile(images[selectedImageIndex])}
              alt="product"
              className="productheaderimage"
            />
            <ul className="productimagescroller">
              {images.map((img, index) => (
                <li key={index} onClick={() => setSelectedImageIndex(index)}>
                  <img
                    src={getFile(img)}
                    alt="product"
                    className={`productimageone ${index === selectedImageIndex ? "productimageone-active" : ""}`}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="productdescription">
            <h2 className="producttitle">Product Description</h2>
            <p className="productdescpara">
              {product.description || "No description."}
            </p>
          </div>

          {product.video && (
            <div className="productdescription">
              <h2 className="producttitle">
                <FaPlayCircle style={{ color: 'rgba(212, 175, 55, 1)', marginRight: '6px' }} /> Product Video
              </h2>
              <div className="product-video-wrapper">
                <video
                  src={getFile(product.video)}
                  controls
                  className="product-video-player"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {Object.keys(meta).filter(
            (key) =>
              !META_SKIP_KEYS.includes(key) &&
              meta[key] !== null &&
              meta[key] !== undefined &&
              meta[key] !== ""
          ).length > 0 && (
            <div className="productdescription">
              <h2 className="producttitle">Product Details</h2>
              <div className="productdetailsgrid">
                {Object.entries(meta)
                  .filter(
                    ([key, value]) =>
                      !META_SKIP_KEYS.includes(key) &&
                      value !== null &&
                      value !== undefined &&
                      value !== ""
                  )
                  .map(([key, value]) => (
                    <div key={key} className="productdetailitem">
                      <div className="detaillabel">{formatMetaLabel(key)}</div>
                      <div className="detailvalue">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {features.length > 0 && (
            <div className="productdescription">
              <h2 className="producttitle">Key Features</h2>
              <div className="productfeatures">
                <ul className="productfeaturesleft">
                  {features.slice(0, 3).map((f, i) => (
                    <li key={i} className="productfeaturelist">
                      <LuDot className="featuredoticon" />
                      {typeof f === "string" ? f : JSON.stringify(f)}
                    </li>
                  ))}
                </ul>
                <ul className="productfeaturesright">
                  {features.slice(3, 6).map((f, i) => (
                    <li key={i} className="productfeaturelist">
                      <LuDot className="featuredoticon" />
                      {typeof f === "string" ? f : JSON.stringify(f)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="productowner">
            <h2 className="producttitle">Owner Information</h2>
            <div className="productownerinfo">
              <div className="productownericon">
                <FiUser />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Owner Name</li>
                <li className="productownername">{owner.name || "—"}</li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <LuPhone />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Contact Number</li>
                <li className="productownername">{owner.phone || "—"}</li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <MdOutlineEmail />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Email Address</li>
                <li className="productownername">{owner.email || "—"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="productpageright">
          <div className="productstatus">
            <h2 className="producttitle">Product Status</h2>
            <span className="currentstatus">Current Status</span>
            <p className="productpageactivetag">
              {statusToLabel(product.approvalStatus)}
            </p>
            <div className="productbreakline"></div>
            <span className="currentstatus">Listed Price</span>
            <p className="productpagepricetag">
              {formatCurrency(product.value)}
            </p>
            <span className="currentstatus">
              {formatCurrency(product.value)}
            </span>
          </div>
          <div className="productperformance">
            <h2 className="producttitle">Performance</h2>
            <div className="performanceviews">
              <span className="currentstatus1">
                <FiUser />
                Leads Generated
              </span>
              <span className={`performancecount${product.owner?.leads && (product._count?.enquiries || 0) >= product.owner.leads ? ' performancecount-exceeded' : ''}`}>{product._count?.enquiries || 0}</span>
            </div>
          </div>
          <div className="productowner1">
            <h2 className="producttitle">Timeline</h2>
            <div className="productownerinfo">
              <div className="productownericon">
                <CiCalendar />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Created</li>
                <li className="productownername">
                  {formatDate(product.createdAt)}
                </li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <CiCalendar />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Last Updated</li>
                <li className="productownername">
                  {formatDate(product.updatedAt)}
                </li>
              </ul>
            </div>
          </div>
          <div className="productpagebuttons">
            <button
              className="editproductbutton"
              onClick={() => navigate(`/productedit/${product.id}`)}
            >
              <FiEdit />
              Edit Product
            </button>
            {isAdmin() && (
              <button
                className="deleteproductbutton"
                onClick={handleDelete}
                disabled={deleting}
              >
                <FiTrash2 />
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            )}
            <button
              className="productsbackbutton"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
