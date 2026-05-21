import React from "react";

const FilterBar = ({ searchText, setSearchText, filters, toggleFilter, sortBy, setSortBy, count }) => (
  <div className="section-container section-border">
    <h2 className="section-title">Restaurants with online food delivery in Bangalore</h2>
    <div className="filter-bar">
      <div className="search-wrap">
        <input type="text" placeholder="Search restaurant, food..." value={searchText} onChange={e => setSearchText(e.target.value)} className="search-input" />
        {searchText && <button className="search-clear" onClick={() => setSearchText("")}>×</button>}
      </div>
      <button className={`pill ${filters.topRated ? "active" : ""}`} onClick={() => toggleFilter("topRated")}>Ratings 4.4+</button>
      <button className={`pill ${filters.fastDelivery ? "active" : ""}`} onClick={() => toggleFilter("fastDelivery")}>Fast Delivery</button>
      <button className={`pill ${filters.pureVeg ? "active" : ""}`} onClick={() => toggleFilter("pureVeg")}>Pure Veg</button>
      <button className={`pill ${filters.lessThan300 ? "active" : ""}`} onClick={() => toggleFilter("lessThan300")}>Less than ₹300</button>
      <button className={`pill ${filters.offers ? "active" : ""}`} onClick={() => toggleFilter("offers")}>Offers</button>
      <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="default">Sort By</option>
        <option value="rating">Rating</option>
        <option value="deliveryTime">Delivery Time</option>
        <option value="costLow">Cost: Low to High</option>
        <option value="costHigh">Cost: High to Low</option>
      </select>
    </div>
    <p className="res-count">{count} restaurants</p>
  </div>
);

export default FilterBar;
