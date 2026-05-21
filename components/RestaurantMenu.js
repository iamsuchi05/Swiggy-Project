import React, { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { fetchWithProxy } from "../utils/helpers";
import { SWIGGY_MENU_URL, ITEM_CDN } from "../utils/constants";

const RestaurantMenu = ({ resId, lat, lng, onBack, onAddToCart, onRemoveFromCart, cartItems }) => {
  const [resInfo, setResInfo] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, [resId, lat, lng]);

  const fetchMenu = async () => {
    setLoading(true);
    setMenuError(null);
    try {
      const latVal = lat || 12.97530;
      const lngVal = lng || 77.59100;
      const menuUrl = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${latVal}&lng=${lngVal}&restaurantId=${resId}`;
      const json = await fetchWithProxy(menuUrl);
      console.log("Menu API response:", json);

      // Find restaurant info - try multiple paths
      let info = null;
      const dataCards = json?.data?.cards || [];
      for (const c of dataCards) {
        if (c?.card?.card?.info?.name) { info = c.card.card.info; break; }
        if (c?.card?.card?.["@type"]?.includes("RestaurantLicenseInfo")) continue;
        if (c?.card?.card?.["@type"]?.includes("Restaurant") && c?.card?.card?.info) { info = c.card.card.info; break; }
      }
      setResInfo(info);

      // Parse menu categories from all possible locations
      const cats = [];
      dataCards.forEach(card => {
        const group = card?.groupedCard?.cardGroupMap?.REGULAR?.cards;
        if (group) {
          group.forEach(g => {
            const cat = g?.card?.card;
            if (!cat) return;
            if (cat?.itemCards?.length > 0) {
              cats.push({ title: cat.title || "Menu", items: cat.itemCards });
            }
            if (cat?.categories && Array.isArray(cat.categories)) {
              cat.categories.forEach(sub => {
                if (sub?.itemCards?.length > 0) {
                  cats.push({ title: `${cat.title || ""} - ${sub.title || ""}`, items: sub.itemCards });
                }
              });
            }
          });
        }
      });
      setMenuCategories(cats);

      if (!info && cats.length === 0) {
        setMenuError("Could not parse menu data. The restaurant may be temporarily unavailable.");
      }
    } catch (err) {
      console.error("Menu fetch error:", err);
      setMenuError(err.message || "Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCartQty = (itemId) => {
    const found = cartItems.find(c => c.item.id === itemId);
    return found ? found.qty : 0;
  };

  if (loading) return <div className="menu-page"><Shimmer /></div>;

  if (menuError) {
    return (
      <div className="menu-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="error-box">
          <p>{menuError}</p>
          <button className="retry-btn" onClick={fetchMenu}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      {resInfo && (
        <div className="menu-header-card">
          <div className="menu-header-left">
            <h1 className="menu-res-name">{resInfo.name}</h1>
            <p className="menu-res-cuisines">{resInfo.cuisines?.join(", ")}</p>
            <p className="menu-res-area">{resInfo.areaName}, {resInfo.sla?.lastMileTravelString}</p>
          </div>
          <div className="menu-header-right">
            <div className="menu-rating-box">
              <span className="menu-rating-star">⭐ {resInfo.avgRating}</span>
              <span className="menu-rating-count">{resInfo.totalRatingsString}</span>
            </div>
          </div>
        </div>
      )}
      <div className="menu-info-bar">
        <span>🕐 {resInfo?.sla?.slaString}</span>
        <span>💰 {resInfo?.costForTwoMessage}</span>
      </div>
      <div className="menu-categories">
        {menuCategories.map((cat, idx) => (
          <div key={idx} className="menu-accordion">
            <div className="accordion-header" onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}>
              <span className="accordion-title">{cat.title} ({cat.items.length})</span>
              <span className={`accordion-chevron ${openIndex === idx ? "open" : ""}`}>▼</span>
            </div>
            {openIndex === idx && (
              <div className="accordion-body">
                {cat.items.map((ic, i) => {
                  const item = ic?.card?.info;
                  if (!item) return null;
                  const price = (item.price || item.defaultPrice || 0) / 100;
                  const qty = getCartQty(item.id);
                  return (
                    <div key={item.id || i} className="menu-item">
                      <div className="menu-item-left">
                        <span className={`veg-icon ${item.itemAttribute?.vegClassifier === "NONVEG" ? "nonveg" : "veg"}`}>●</span>
                        <div>
                          <h4 className="menu-item-name">{item.name}</h4>
                          <p className="menu-item-price">₹{price}</p>
                          {item.ratings?.aggregatedRating?.rating && (
                            <p className="menu-item-rating">⭐ {item.ratings.aggregatedRating.rating} ({item.ratings.aggregatedRating.ratingCountV2})</p>
                          )}
                          <p className="menu-item-desc">{item.description?.slice(0, 120)}{item.description?.length > 120 ? "..." : ""}</p>
                        </div>
                      </div>
                      <div className="menu-item-right">
                        {item.imageId && <img src={ITEM_CDN + item.imageId} alt={item.name} className="menu-item-img" />}
                        {qty === 0 ? (
                          <button className="add-btn" onClick={() => onAddToCart(item, { id: resId, name: resInfo?.name, area: resInfo?.areaName })}>ADD</button>
                        ) : (
                          <div className="qty-control">
                            <button onClick={() => onRemoveFromCart(item.id)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => onAddToCart(item, { id: resId, name: resInfo?.name, area: resInfo?.areaName })}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
