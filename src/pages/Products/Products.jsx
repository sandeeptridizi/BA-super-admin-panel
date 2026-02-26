import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import { FaPlus } from 'react-icons/fa6';
import { IoCubeOutline } from 'react-icons/io5';
import { IoEyeOutline } from 'react-icons/io5';
import { LuCrown } from 'react-icons/lu';
import { AiOutlineShop } from 'react-icons/ai';
import { BsLightningCharge } from 'react-icons/bs';
import { TbHammer } from 'react-icons/tb';
import { FiHome } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { CiFilter } from 'react-icons/ci';
import { PiBuildingOfficeBold } from 'react-icons/pi';
import { LiaCarSideSolid } from 'react-icons/lia';
import { MdDirectionsBike } from 'react-icons/md';
import { RiSofaLine } from 'react-icons/ri';
import { IoDiamondOutline } from 'react-icons/io5';
import { PiPaintBrushFill } from 'react-icons/pi';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCube } from 'react-icons/hi2';
import { BsThreeDots } from 'react-icons/bs';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { LiaCertificateSolid } from 'react-icons/lia';
import api from '../../lib/api';

const LISTING_TYPE_BY_TAB = {
  marketplace: 'MARKETPLACE',
  buynow: 'BUY_NOW',
  auctions: 'AUCTIONS',
  tolet: 'TO_LET',
};

const LISTING_LABEL_BY_TAB = {
  marketplace: 'Marketplace',
  buynow: 'Buy Now',
  auctions: 'Auctions',
  tolet: 'To-let',
};

const CATEGORY_LABELS = {
  REAL_ESTATE: 'Real Estate',
  CARS: 'Cars',
  BIKES: 'Bikes',
  FURNITURE: 'Furniture',
  JEWELLERY_AND_WATCHES: 'Jewellery & Watches',
  ARTS_AND_PAINTINGS: 'Arts & Paintings',
  ANTIQUES: 'Antiques',
  COLLECTABLES: 'Collectables',
};

const CATEGORY_FILTERS = [
  { value: 'ALL', label: 'All Categories', icon: CiFilter },
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: PiBuildingOfficeBold },
  { value: 'CARS', label: 'Cars', icon: LiaCarSideSolid },
  { value: 'BIKES', label: 'Bikes', icon: MdDirectionsBike },
  { value: 'FURNITURE', label: 'Furniture', icon: RiSofaLine },
  {
    value: 'JEWELLERY_AND_WATCHES',
    label: 'Jewellery & Watches',
    icon: IoDiamondOutline,
  },
  {
    value: 'ARTS_AND_PAINTINGS',
    label: 'Arts & Paintings',
    icon: PiPaintBrushFill,
  },
  { value: 'ANTIQUES', label: 'Antiques', icon: BsStars },
  { value: 'COLLECTABLES', label: 'Collectables', icon: HiOutlineCube },
  { value: 'OTHERS', label: 'Others', icon: BsThreeDots },
];

const statusToLabel = (status) => {
  if (status === 'APPROVED') return 'active';
  if (status === 'REJECTED') return 'rejected';
  return 'inactive';
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatCount = (value) =>
  new Intl.NumberFormat('en-IN').format(Number(value || 0));

const getLocationText = (meta) => {
  if (!meta || typeof meta !== 'object') return 'Location not added';
  const location =
    meta.location ||
    meta.city ||
    [meta.area, meta.city].filter(Boolean).join(', ') ||
    meta.state ||
    meta.address;
  return location || 'Location not added';
};

const getViews = (meta) => {
  if (!meta || typeof meta !== 'object') return 0;
  return Number(meta.views || 0);
};

const chunkProducts = (items, size = 3) => {
  const rows = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
};

const Products = () => {
  const [selectedCat, setSelectedCat] = useState('marketplace');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await api.get('/api/product');
        setProducts(response?.data?.data || []);
        console.log(response?.data?.data);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch products.';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeListings = products.filter(
      (item) => item.approvalStatus === 'APPROVED',
    ).length;
    const totalViews = products.reduce(
      (sum, item) => sum + getViews(item.meta),
      0,
    );
    const totalValue = products.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0,
    );
    return { totalProducts, activeListings, totalViews, totalValue };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const listingType = LISTING_TYPE_BY_TAB[selectedCat];
    const query = search.trim().toLowerCase();

    return products.filter((item) => {
      if (item.listingType !== listingType) return false;
      if (selectedCategoryFilter !== 'ALL') {
        if (selectedCategoryFilter === 'OTHERS') {
          if (
            Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, item.category)
          ) {
            return false;
          }
        } else if (item.category !== selectedCategoryFilter) {
          return false;
        }
      }
      if (!query) return true;

      const location = getLocationText(item.meta).toLowerCase();
      const category = (
        CATEGORY_LABELS[item.category] ||
        item.category ||
        ''
      ).toLowerCase();
      const title = (item.title || '').toLowerCase();
      const value = String(item.value || '').toLowerCase();
      return (
        title.includes(query) ||
        category.includes(query) ||
        location.includes(query) ||
        value.includes(query)
      );
    });
  }, [products, search, selectedCat, selectedCategoryFilter]);

  const productRows = useMemo(
    () => chunkProducts(visibleProducts),
    [visibleProducts],
  );

  const renderFilters = () => {
    return (
      <ul className='categoryfilters'>
        {CATEGORY_FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedCategoryFilter === filter.value;
          return (
            <li
              key={filter.value}
              className={`categoryselection ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategoryFilter(filter.value)}
            >
              <Icon className='categoryicon' />
              {filter.label}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='productscontainer'>
      <div className='producthead'>
        <div className='productheadinfo'>
          <h1 className='productsheader'>Product Management</h1>
          <span className='productheaddesc'>
            Manage products across Marketplace, Buy Now, Auctions & To-Let
          </span>
        </div>
        <button
          className='addproduct'
          onClick={() => navigate('/productcreation')}
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      <ul className='producthighlights'>
        <li className='producthighlight'>
          <div className='producthighlightinfo'>
            <span className='producthighlighttitle'>Total Products</span>
            <br />
            <span className='producthighlightnum'>
              {formatCount(stats.totalProducts)}
            </span>
          </div>
          <div className='producthighlighticon'>
            <IoCubeOutline />
          </div>
        </li>
        <li className='producthighlight1'>
          <div className='producthighlightinfo'>
            <span className='producthighlighttitle'>Active Listings</span>
            <br />
            <span className='producthighlightnum1'>
              {formatCount(stats.activeListings)}
            </span>
          </div>
          <div className='producthighlighticon1'>
            <IoEyeOutline />
          </div>
        </li>
        <li className='producthighlight1'>
          <div className='producthighlightinfo'>
            <span className='producthighlighttitle'>Total Views</span>
            <br />
            <span className='producthighlightnum1'>
              {formatCount(stats.totalViews)}
            </span>
          </div>
          <div className='producthighlighticon2'>
            <IoEyeOutline />
          </div>
        </li>
        <li className='producthighlight1'>
          <div className='producthighlightinfo'>
            <span className='producthighlighttitle'>Total Value</span>
            <br />
            <span className='producthighlightnum'>
              {formatCurrency(stats.totalValue)}
            </span>
          </div>
          <div className='producthighlighticon3'>
            <LuCrown />
          </div>
        </li>
      </ul>

      <div className='productcatmain'>
        <ul className='productcat1'>
          <li
            className={`productcatname ${selectedCat === 'marketplace' ? 'active' : ''}`}
            onClick={() => setSelectedCat('marketplace')}
          >
            <AiOutlineShop /> Marketplace
          </li>
          <li
            className={`productcatname ${selectedCat === 'buynow' ? 'active' : ''}`}
            onClick={() => setSelectedCat('buynow')}
          >
            <BsLightningCharge /> Buy Now
          </li>
          <li
            className={`productcatname ${selectedCat === 'auctions' ? 'active' : ''}`}
            onClick={() => setSelectedCat('auctions')}
          >
            <TbHammer /> Auctions
          </li>
          <li
            className={`productcatname ${selectedCat === 'tolet' ? 'active' : ''}`}
            onClick={() => setSelectedCat('tolet')}
          >
            <FiHome /> To-let
          </li>
        </ul>
      </div>

      <div className='below-content'>
        <div>
          <div className='productcatmain1'>
            <FiSearch className='searchIcon1' />
            <input
              type='text'
              placeholder='Search products by name, category, location, or price...'
              className='searchInput1'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className='categoryfilter'>
            <h2 className='filterheading'>Filter by Category</h2>
            {renderFilters()}
          </div>

          <div className='categoryproducts'>
            {isLoading && <p>Loading products...</p>}
            {!isLoading && errorMessage && <p>{errorMessage}</p>}
            {!isLoading && !errorMessage && productRows.length === 0 && (
              <p>No products found for this listing type.</p>
            )}

            {!isLoading &&
              !errorMessage &&
              productRows.map((row, rowIndex) => (
                <div className='categoryproductrow' key={`row-${rowIndex}`}>
                  {row.map((product) => (
                    <div
                      className='categoryproduct'
                      key={product.id}
                      onClick={() =>
                        navigate('/productpage', {
                          state: { productId: product.id },
                        })
                      }
                    >
                      <div className='producttagrow'>
                        <div className='producttagrow1'>
                          {selectedCat !== 'tolet' && (
                            <>
                              <span className='productbusinesstag'>
                                {LISTING_LABEL_BY_TAB[selectedCat]}
                              </span>
                              <span className='productcattag'>
                                {CATEGORY_LABELS[product.category] ||
                                  product.category}
                              </span>
                            </>
                          )}
                          {selectedCat === 'tolet' && (
                            <h2 className='producattitle'>{product.title}</h2>
                          )}
                        </div>
                        <div className='producttaggrow2'>
                          <BsThreeDotsVertical />
                        </div>
                      </div>

                      {selectedCat !== 'tolet' && (
                        <h2 className='producattitle'>{product.title}</h2>
                      )}

                      <span className='productcatdesc'>
                        📍 {getLocationText(product.meta)}
                      </span>
                      <div className='productpricetag'>
                        <h3 className='productprice'>
                          {formatCurrency(product.value)}
                        </h3>
                        <span className='productactivetag'>
                          {statusToLabel(product.approvalStatus)}
                        </span>
                      </div>
                      <div className='productviewtag'>
                        <h3 className='productviews'>
                          <IoEyeOutline />
                          {formatCount(getViews(product.meta))} views
                        </h3>
                        {product.tier === 'LUXURY' && (
                          <span className='producttag1'>
                            <LuCrown />
                            Luxury
                          </span>
                        )}
                        {product.tier === 'CLASSIC' && (
                          <span className='producttag2'>
                            <LiaCertificateSolid />
                            Classic
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
