import React from "react";
import { LOGO_URL } from "../utils/constants";

const Header = ({ cartCount, onCartClick, onHomeClick }) => (
  <header className="header">
    <div className="header-content">
      <div className="header-left" onClick={onHomeClick} style={{ cursor: "pointer" }}>
        <img src={LOGO_URL} alt="Swiggy Logo" className="header-logo" />
        <div className="header-location">
          <span className="location-label">Other</span>
          <span className="location-detail">Bangalore, Karnataka, India</span>
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

export default Header;
