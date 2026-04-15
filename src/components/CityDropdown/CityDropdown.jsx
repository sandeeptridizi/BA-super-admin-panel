import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import "./CityDropdown.css";

const CityDropdown = ({
  value,
  onChange,
  suggestions = [],
  placeholder = "Select or type city",
  name = "city",
  className = "basicinfoinput1",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions.filter(
    (s) => !value || s.toLowerCase().includes(String(value).toLowerCase())
  );

  return (
    <div className="city-dropdown" ref={containerRef}>
      <div className="city-dropdown-input-wrapper">
        <input
          type="text"
          name={name}
          className={`${className} city-dropdown-input`}
          placeholder={placeholder}
          value={value || ""}
          required={required}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        <LuChevronDown
          className={`city-dropdown-chevron ${isOpen ? "rotated" : ""}`}
        />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="city-dropdown-menu">
          {filteredSuggestions.map((s) => (
            <div
              key={s}
              className="city-dropdown-item"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setIsOpen(false);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
