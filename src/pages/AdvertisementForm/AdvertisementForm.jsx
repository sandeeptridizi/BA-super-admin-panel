import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdvertisementForm.css";
import api from "../../lib/api";
import { getFile } from "../../lib/s3";
import {
  createAdvertisement,
  getAdvertisement,
  updateAdvertisement,
} from "../../lib/advertisements";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";

const PLACEMENT_OPTIONS = [
  "homepage_banner",
  "sidebar",
  "product_listing",
  "category_page",
  "checkout",
  "other",
];

function toDatetimeLocal(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdvertisementForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    ctaText: "",
    ctaUrl: "",
    placement: "",
    status: "DRAFT",
    startsAt: "",
    endsAt: "",
  });
  const [mediaKey, setMediaKey] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  // Load existing ad for editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getAdvertisement(id);
        const ad = res.data;
        setForm({
          title: ad.title || "",
          content: ad.content || "",
          ctaText: ad.ctaText || "",
          ctaUrl: ad.ctaUrl || "",
          placement: ad.placement || "",
          status: ad.status || "DRAFT",
          startsAt: toDatetimeLocal(ad.startsAt),
          endsAt: toDatetimeLocal(ad.endsAt),
        });
        if (ad.media) {
          setMediaKey(ad.media);
          setFilePreview(getFile(ad.media));
        }
      } catch (err) {
        setError("Failed to load advertisement.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (filePreview && !mediaKey) URL.revokeObjectURL(filePreview);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeMedia = () => {
    if (filePreview && !mediaKey) URL.revokeObjectURL(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
    setMediaKey(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (file, adId) => {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 50);
    const key = `advertisements/${adId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`;

    const presignedRes = await api.get("/api/media/presigned", {
      params: { key },
    });

    const uploadUrl =
      presignedRes.data?.data?.url ||
      presignedRes.data?.url ||
      presignedRes.data?.data;

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    return presignedRes.data?.data?.key || presignedRes.data?.key || key;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim() || null,
        ctaText: form.ctaText.trim() || null,
        ctaUrl: form.ctaUrl.trim() || null,
        placement: form.placement || null,
        status: form.status,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      };

      if (isEdit) {
        // Handle media upload for edit
        let updatedMedia = mediaKey;
        if (selectedFile) {
          updatedMedia = await uploadFile(selectedFile, id);
        }
        payload.media = updatedMedia;

        await updateAdvertisement(id, payload);
      } else {
        // Create first, then upload media
        const res = await createAdvertisement(payload);
        const adId = res.data?.id;

        if (selectedFile && adId) {
          const uploadedKey = await uploadFile(selectedFile, adId);
          await updateAdvertisement(adId, { media: uploadedKey });
        }
      }

      navigate("/advertisements");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save advertisement.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="adform-wrapper">
        <p style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="adform-wrapper">
      <button className="adform-back" onClick={() => navigate("/advertisements")}>
        <BiLeftArrowAlt size={20} /> Back to Advertisements
      </button>

      <div className="adform-header">
        <h1>{isEdit ? "Edit Advertisement" : "Create Advertisement"}</h1>
        <p>{isEdit ? "Update advertisement details" : "Set up a new promotional campaign"}</p>
      </div>

      {error && <div className="adform-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="adform-card">
          <h3>Basic Information</h3>

          <div className="adform-row full">
            <div className="adform-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Advertisement title"
              />
            </div>
          </div>

          <div className="adform-row full">
            <div className="adform-group">
              <label>Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Description or body text for the advertisement"
              />
            </div>
          </div>
        </div>

        {/* CTA & Placement */}
        <div className="adform-card">
          <h3>Call-to-Action & Placement</h3>

          <div className="adform-row">
            <div className="adform-group">
              <label>CTA Text</label>
              <input
                type="text"
                name="ctaText"
                value={form.ctaText}
                onChange={handleChange}
                placeholder="e.g. Shop Now, Learn More"
              />
            </div>
            <div className="adform-group">
              <label>CTA URL</label>
              <input
                type="text"
                name="ctaUrl"
                value={form.ctaUrl}
                onChange={handleChange}
                placeholder="https://example.com or /products"
              />
            </div>
          </div>

          <div className="adform-row">
            <div className="adform-group">
              <label>Placement</label>
              <select name="placement" value={form.placement} onChange={handleChange}>
                <option value="">Select placement</option>
                {PLACEMENT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="adform-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="ENDED">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="adform-card">
          <h3>Schedule</h3>

          <div className="adform-row">
            <div className="adform-group">
              <label>Starts At</label>
              <input
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={handleChange}
              />
            </div>
            <div className="adform-group">
              <label>Ends At</label>
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="adform-card">
          <h3>Media</h3>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileSelect}
          />

          {filePreview ? (
            <div className="adform-preview-container">
              <img src={filePreview} alt="Preview" className="adform-preview" />
              <button type="button" className="adform-preview-remove" onClick={removeMedia}>
                &times;
              </button>
            </div>
          ) : (
            <div className="adform-upload-area" onClick={() => fileInputRef.current?.click()}>
              <FiUpload className="adform-upload-icon" />
              <p>Click to upload banner image</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="adform-actions">
          <button
            type="button"
            className="adform-cancel-btn"
            onClick={() => navigate("/advertisements")}
          >
            Cancel
          </button>
          <button type="submit" className="adform-submit-btn" disabled={submitting}>
            {submitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Advertisement"
                : "Create Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
}
