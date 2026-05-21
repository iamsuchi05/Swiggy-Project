import React, { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import RestaurantCard from "./RestaurantCard";
import { fetchWithProxy } from "../utils/helpers";

const RestaurantCollection = ({ collectionId, tags, title, onBack, onCardClick }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollection();
  }, [collectionId, tags]);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.97530&lng=77.59100&collection=${collectionId}&tags=${tags}&type=rcv2`;
      const json = await fetchWithProxy(url);
      const cards = json?.data?.cards || [];
      
      const seenIds = new Set();
      const list = [];
      cards.forEach(card => {
        const cCard = card?.card?.card;
        if (cCard?.info && cCard?.["@type"]?.includes("Restaurant")) {
          const id = cCard.info.id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            list.push({ info: cCard.info });
          }
        }
        const resList = cCard?.gridElements?.infoWithStyle?.restaurants;
        if (resList && Array.isArray(resList)) {
          resList.forEach(r => {
            const id = r?.info?.id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              list.push(r);
            }
          });
        }
      });

      setRestaurants(list);
      if (list.length === 0) {
        setError("No restaurants found in this collection.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="collection-page"><Shimmer /></div>;

  return (
    <div className="collection-page">
      <div className="collection-header">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <h1 className="collection-title">{title}</h1>
        <p className="collection-subtitle">Gourmet options curated for you</p>
      </div>

      {error ? (
        <div className="error-box">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchCollection}>Retry</button>
        </div>
      ) : (
        <div className="res-grid">
          {restaurants.map(r => (
            <RestaurantCard key={r.info.id} info={r.info} onClick={() => onCardClick(r.info.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantCollection;
