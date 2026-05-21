import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Import Utilities
import { SWIGGY_LIST_URL } from "./utils/constants";
import { fetchWithProxy, getCollectionParams } from "./utils/helpers";

// Import Modular Components
import Header from "./components/Header";
import Shimmer from "./components/Shimmer";
import MindCarousel from "./components/MindCarousel";
import TopChains from "./components/TopChains";
import RestaurantCard from "./components/RestaurantCard";
import FilterBar from "./components/FilterBar";
import RestaurantCollection from "./components/RestaurantCollection";
import RestaurantMenu from "./components/RestaurantMenu";
import CartDrawer from "./components/CartDrawer";
import OrderSuccess from "./components/OrderSuccess";

const App = () => {
  const [mindItems, setMindItems] = useState([]);
  const [topChains, setTopChains] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState({ page: "home" });
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ topRated: false, fastDelivery: false, pureVeg: false, lessThan300: false, offers: false });
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchWithProxy(SWIGGY_LIST_URL);
      const cards = json?.data?.cards || [];

      // Parse "What's on your mind?" carousel
      let mind = [];
      const mindCard = cards.find(c => c?.card?.card?.imageGridCards?.info);
      if (mindCard) {
        mind = mindCard.card.card.imageGridCards.info;
      }
      setMindItems(mind);

      // Parse "Top restaurant chains" (horizontal scroll)
      let chains = [];
      const chainsCard = cards.find(c =>
        c?.card?.card?.gridElements?.infoWithStyle?.restaurants &&
        c?.card?.card?.id === "top_brands_for_you"
      );
      if (chainsCard) {
        chains = chainsCard.card.card.gridElements.infoWithStyle.restaurants;
      }
      setTopChains(chains);

      // Parse ALL restaurants from every card
      const seenIds = new Set();
      const allRes = [];
      cards.forEach(card => {
        const resList = card?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        if (resList && Array.isArray(resList)) {
          resList.forEach(r => {
            const id = r?.info?.id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              allRes.push(r);
            }
          });
        }
      });
      setAllRestaurants(allRes);
      setFiltered(allRes);

      if (allRes.length === 0 && chains.length === 0) {
        setError("No restaurants found in API response. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch from Swiggy API. CORS proxy may be down. Please refresh or try again later.");
    } finally {
      setLoading(false);
      const spinner = document.querySelector(".initial-shimmer-container");
      if (spinner) spinner.remove();
    }
  };

  // Filtering & sorting logic
  useEffect(() => {
    let result = [...allRestaurants];
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(r =>
        r.info.name.toLowerCase().includes(q) ||
        r.info.cuisines?.some(c => c.toLowerCase().includes(q))
      );
    }
    if (filters.topRated) result = result.filter(r => r.info.avgRating >= 4.4);
    if (filters.fastDelivery) result = result.filter(r => (r.info.sla?.deliveryTime || 99) <= 30);
    if (filters.pureVeg) result = result.filter(r => r.info.veg === true);
    if (filters.lessThan300) {
      result = result.filter(r => {
        const cost = parseInt((r.info.costForTwo || "").replace(/[^0-9]/g, ""), 10) || 999;
        return cost <= 300;
      });
    }
    if (filters.offers) result = result.filter(r => r.info.aggregatedDiscountInfoV3);

    if (sortBy === "rating") result.sort((a, b) => (b.info.avgRating || 0) - (a.info.avgRating || 0));
    else if (sortBy === "deliveryTime") result.sort((a, b) => (a.info.sla?.deliveryTime || 99) - (b.info.sla?.deliveryTime || 99));
    else if (sortBy === "costLow") result.sort((a, b) => {
      const ca = parseInt((a.info.costForTwo || "").replace(/[^0-9]/g, ""), 10) || 999;
      const cb = parseInt((b.info.costForTwo || "").replace(/[^0-9]/g, ""), 10) || 999;
      return ca - cb;
    });
    else if (sortBy === "costHigh") result.sort((a, b) => {
      const ca = parseInt((a.info.costForTwo || "").replace(/[^0-9]/g, ""), 10) || 0;
      const cb = parseInt((b.info.costForTwo || "").replace(/[^0-9]/g, ""), 10) || 0;
      return cb - ca;
    });
    setFiltered(result);
  }, [searchText, filters, sortBy, allRestaurants]);

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  const handleMindSelect = (item) => {
    const link = item?.action?.link || item?.entityId || "";
    const text = item?.action?.text || "Collection";
    const params = getCollectionParams(link);
    if (params) {
      setView({ page: "collection", collectionId: params.collectionId, tags: params.tags, title: text });
    } else if (text) {
      setSearchText(text);
    }
  };

  // Cart action items
  const addToCart = (item, restaurant) => {
    setCart(prev => {
      if (prev.length > 0 && prev[0].restaurant.id !== restaurant.id) {
        if (!window.confirm("Items from different restaurant will be removed. Start fresh?")) return prev;
        return [{ item, qty: 1, restaurant }];
      }
      const idx = prev.findIndex(c => c.item.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, { item, qty: 1, restaurant }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.item.id === itemId);
      if (idx === -1) return prev;
      const updated = [...prev];
      if (updated[idx].qty > 1) { updated[idx].qty -= 1; return updated; }
      return updated.filter(c => c.item.id !== itemId);
    });
  };

  const checkout = () => {
    setCartOpen(false);
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setCart([]);
    setView({ page: "home" });
  };

  const cartQty = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + ((c.item.price || c.item.defaultPrice || 15000) / 100) * c.qty, 0);

  return (
    <div className="app">
      <Header cartCount={cartQty} onCartClick={() => setCartOpen(true)} onHomeClick={() => setView({ page: "home" })} />

      <main className="main">
        {view.page === "home" ? (
          <>
            {loading ? (
              <Shimmer />
            ) : error ? (
              <div className="error-box">
                <p>{error}</p>
                <button className="retry-btn" onClick={fetchData}>Retry</button>
              </div>
            ) : (
              <>
                <MindCarousel items={mindItems} onSelect={handleMindSelect} />
                <TopChains restaurants={topChains} onCardClick={(id) => setView({ page: "menu", resId: id })} />
                <FilterBar searchText={searchText} setSearchText={setSearchText} filters={filters} toggleFilter={toggleFilter} sortBy={sortBy} setSortBy={setSortBy} count={filtered.length} />
                {filtered.length === 0 ? (
                  <div className="no-results">
                    <h3>No restaurants found</h3>
                    <p>Try a different search or clear filters</p>
                    <button className="retry-btn" onClick={() => { setSearchText(""); setFilters({ topRated: false, fastDelivery: false, pureVeg: false, lessThan300: false, offers: false }); setSortBy("default"); }}>Clear All</button>
                  </div>
                ) : (
                  <div className="res-grid">
                    {filtered.map(r => (
                      <RestaurantCard key={r.info.id} info={r.info} onClick={() => setView({ page: "menu", resId: r.info.id })} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : view.page === "collection" ? (
          <RestaurantCollection
            collectionId={view.collectionId}
            tags={view.tags}
            title={view.title}
            onBack={() => setView({ page: "home" })}
            onCardClick={(id) => setView({ page: "menu", resId: id })}
          />
        ) : (
          <RestaurantMenu resId={view.resId} onBack={() => setView({ page: "home" })} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} cartItems={cart} />
        )}
      </main>

      {/* Floating cart bar for mobile / desktop popups */}
      {cartQty > 0 && !cartOpen && (
        <div className="floating-cart" onClick={() => setCartOpen(true)}>
          <span>{cartQty} Item{cartQty > 1 ? "s" : ""} | ₹{cartTotal.toFixed(0)}</span>
          <span>VIEW CART 🛒</span>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cart} onAdd={addToCart} onRemove={removeFromCart} onCheckout={checkout} />
      <OrderSuccess isVisible={showSuccess} onClose={closeSuccess} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);