import React, { useState } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import "./PackageCreation.css";
import { createPackage, updatePackage } from "../../lib/financials";

const CATEGORY_OPTIONS = [
  { value: "SUBSCRIPTION_PLAN", label: "Subscription Plan" },
  { value: "BANNER_AD", label: "Banner Ad" },
  { value: "FEATURED_LISTING", label: "Featured Listing" },
  { value: "LEAD_UNLOCK", label: "Lead Unlock" },
  { value: "DIGITAL_MEDIA", label: "Digital Media" },
];

export default function PackageCreation({ onClose, onSaved, pkg, defaultCategory }) {
  const isEditing = Boolean(pkg);

  const [form, setForm] = useState({
    category: pkg?.category || defaultCategory || "SUBSCRIPTION_PLAN",
    title: pkg?.title || "",
    price: pkg?.price ?? "",
    tag: pkg?.tag || "",
    sortOrder: pkg?.sortOrder ?? 0,
  });

  const [features, setFeatures] = useState(
    pkg?.features?.length ? pkg.features : [""]
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || form.price === "") {
      setError("Title and price are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category: form.category,
        title: form.title,
        price: Number(form.price),
        tag: form.tag || null,
        sortOrder: Number(form.sortOrder) || 0,
        features: features.filter((f) => f.trim() !== ""),
      };

      if (isEditing) {
        await updatePackage(pkg.id, payload);
      } else {
        await createPackage(payload);
      }

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save package."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pkg-overlay">
      <div className="pkg-modal">
        <div className="pkg-modal-header">
          <div>
            <h2>{isEditing ? "Edit Package" : "Create New Package"}</h2>
            <p>
              {isEditing
                ? "Update the package details"
                : "Add a new pricing package"}
            </p>
          </div>
          <FiX className="close-icon" onClick={onClose} />
        </div>

        <div className="pkg-modal-body">
          <form className="pkg-form" onSubmit={handleSubmit}>
            <div className="pkg-form-grid">
              <div className="form-row">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={isEditing}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., PRO, Enterprise Starter"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g., 6999"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-row">
                <label>Tag</label>
                <input
                  type="text"
                  name="tag"
                  placeholder="e.g., + GST, Most Popular, Free"
                  value={form.tag}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Sort Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  placeholder="e.g., 1"
                  value={form.sortOrder}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="features-section">
              <label>Features</label>
              <p className="features-hint">
                For key-value features use format: <code>Label:Value</code> (e.g., "Leads:10 / listing")
              </p>
              {features.map((f, i) => (
                <div key={i} className="feature-row">
                  <input
                    type="text"
                    placeholder="e.g., Support:Priority"
                    value={f}
                    onChange={(e) => handleFeatureChange(i, e.target.value)}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      className="feature-remove-btn"
                      onClick={() => removeFeature(i)}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-feature-btn" onClick={addFeature}>
                <FiPlus /> Add Feature
              </button>
            </div>

            {error && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
            )}

            <div className="pkg-modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="create-btn" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Package"
                    : "Create Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
