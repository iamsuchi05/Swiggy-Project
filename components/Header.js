import React from "react";
import { LOGO_URL } from "../utils/constants";

const POPULAR_LOCATIONS = [
  { name: "Bangalore", lat: 12.97530, lng: 77.59100 },
  { name: "Delhi", lat: 28.61390, lng: 77.20900 },
  { name: "Mumbai", lat: 19.07600, lng: 72.87770 },
  { name: "Hyderabad", lat: 17.38500, lng: 78.48670 },
  { name: "Chennai", lat: 13.08270, lng: 80.27070 },
  { name: "Pune", lat: 18.52040, lng: 73.85670 },
];

const Header = ({ cartCount, locationName, onCartClick, onHomeClick, onLocationChange, onTriggerGeolocation }) => {
  // Check if current name matches one of our popular cities
  const isPopularSelected = POPULAR_LOCATIONS.some(l => l.name === locationName);
  const selectValue = isPopularSelected ? locationName : "custom";

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src={LOGO_URL} alt="Swiggy Logo" className="header-logo" onClick={onHomeClick} style={{ cursor: "pointer" }} />
          <div className="header-location">
            <span className="location-label">📍 Location</span>
            <select
              className="location-select"
              value={selectValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "geo") {
                  onTriggerGeolocation();
                } else if (val !== "custom") {
                  const loc = POPULAR_LOCATIONS.find(l => l.name === val);
                  if (loc) onLocationChange(loc.lat, loc.lng, loc.name);
                }
              }}
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
              {!isPopularSelected && (
                <option value="custom">
                  {locationName && locationName.length > 15 ? locationName.slice(0, 15) + "..." : locationName}
                </option>
              )}
              <option value="geo">🛰️ Get Live Location</option>
            </select>
          </div>
        </div>
        <nav className="header-nav">
          <div className="nav-link" onClick={onHomeClick}><span>🏠</span> Home</div>
          <div className="nav-link"><span>🔍</span> Search</div>
          <div className="nav-link"><span>🎫</span> Offers</div>
          <div className="nav-link"><span>❓</span> Help</div>
          <div className="nav-link"><span>👤</span> Sign In</div>
          <div className="nav-link cart-link" onClick={onCartClick}>
            <span>🛒</span> Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
