import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Advertisements.css";
import {
  getAdvertisements,
  getAdvertisementStats,
  deleteAdvertisement,
} from "../../lib/advertisements";
import { getFile } from "../../lib/s3";
import { FiSearch, FiClock, FiPlus, FiExternalLink } from "react-icons/fi";
import { MdCampaign } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { BiLink } from "react-icons/bi";

const statusLabels = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PAUSED: "Paused",
  ENDED: "Ended",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Advertisements() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const [adsRes, statsData] = await Promise.all([
        getAdvertisements(params),
        stats ? Promise.resolve({ data: stats }) : getAdvertisementStats(),
      ]);

      setAds(adsRes.data || []);
      setPagination(adsRes.pagination || { page: 1, totalPages: 1, total: 0 });
      if (!stats) setStats(statsData.data || statsData);
    } catch (err) {
      console.error("Failed to fetch advertisements", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, statusFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      setDeletingId(id);
      await deleteAdvertisement(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
      setStats(null); // refresh stats on next fetch
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete advertisement.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="ads-wrapper">
      <div className="ads-header">
        <div className="ads-header-left">
          <h1>Advertisements</h1>
          <p>Create and manage promotional campaigns</p>
        </div>
        <button className="ads-create-btn" onClick={() => navigate("/advertisements/create")}>
          <FiPlus /> Create Advertisement
        </button>
      </div>

      {/* Stats */}
      <div className="ads-stats-row">
        <div className="ads-stat-card">
          <div className="ads-stat-top">
            <span>Total</span>
            <MdCampaign className="ads-stat-icon blue" />
          </div>
          <h2 className="ads-stat-value blue">{stats?.total ?? "—"}</h2>
          <div className="ads-stat-line blue"></div>
        </div>
        <div className="ads-stat-card">
          <div className="ads-stat-top">
            <span>Active</span>
            <GoDotFill className="ads-stat-icon green" />
          </div>
          <h2 className="ads-stat-value green">{stats?.active ?? "—"}</h2>
          <div className="ads-stat-line green"></div>
        </div>
        <div className="ads-stat-card">
          <div className="ads-stat-top">
            <span>Paused</span>
            <IoMdTime className="ads-stat-icon orange" />
          </div>
          <h2 className="ads-stat-value orange">{stats?.paused ?? "—"}</h2>
          <div className="ads-stat-line orange"></div>
        </div>
        <div className="ads-stat-card">
          <div className="ads-stat-top">
            <span>Draft</span>
            <GoDotFill className="ads-stat-icon gray" />
          </div>
          <h2 className="ads-stat-value gray">{stats?.draft ?? "—"}</h2>
          <div className="ads-stat-line gray"></div>
        </div>
      </div>

      {/* Search */}
      <form className="ads-search-box" onSubmit={handleSearch}>
        <FiSearch />
        <input
          placeholder="Search advertisements by title or content..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      {/* Status Tabs */}
      <ul className="ads-tabs">
        {["", "ACTIVE", "DRAFT", "PAUSED", "ENDED"].map((s) => (
          <li
            key={s}
            className={`ads-tab ${statusFilter === s ? "active" : ""}`}
            onClick={() => {
              setStatusFilter(s);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            {s === "" ? "All" : statusLabels[s]}
          </li>
        ))}
      </ul>

      {/* List */}
      {loading ? (
        <p className="ads-empty">Loading advertisements...</p>
      ) : ads.length === 0 ? (
        <p className="ads-empty">No advertisements found.</p>
      ) : (
        <div>
          {ads.map((ad) => (
            <div className="ads-card" key={ad.id}>
              <div className="ads-card-header">
                <div className="ads-card-info">
                  {ad.media ? (
                    <img src={getFile(ad.media)} alt="" className="ads-card-media" />
                  ) : (
                    <div className="ads-card-icon">
                      <MdCampaign />
                    </div>
                  )}
                  <div>
                    <h4 className="ads-card-title">
                      {ad.title}
                      <span className={`ads-status-badge ${ad.status}`} style={{ marginLeft: 10 }}>
                        {statusLabels[ad.status]}
                      </span>
                    </h4>
                    <p className="ads-card-placement">
                      {ad.placement ? `Placement: ${ad.placement}` : "No placement set"}
                    </p>
                  </div>
                </div>
                <div className="ads-card-actions">
                  <button
                    className="ads-edit-btn"
                    onClick={() => navigate(`/advertisements/edit/${ad.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="ads-delete-btn"
                    disabled={deletingId === ad.id}
                    onClick={(e) => handleDelete(e, ad.id)}
                  >
                    {deletingId === ad.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {(ad.content || ad.ctaText || ad.ctaUrl) && (
                <div className="ads-card-body">
                  {ad.content && <p className="ads-card-content">{ad.content}</p>}
                  <div className="ads-card-cta">
                    {ad.ctaText && (
                      <span>
                        <FiExternalLink /> CTA: {ad.ctaText}
                      </span>
                    )}
                    {ad.ctaUrl && (
                      <span>
                        <BiLink />{" "}
                        <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer">
                          {ad.ctaUrl}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="ads-card-footer">
                <span>
                  <FiClock /> {timeAgo(ad.createdAt)}
                </span>
                <span>Starts: {formatDate(ad.startsAt)}</span>
                <span>Ends: {formatDate(ad.endsAt)}</span>
                {ad.createdBy && <span>By: {ad.createdBy.name || ad.createdBy.email}</span>}
              </div>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="ads-pagination">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                Prev
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
