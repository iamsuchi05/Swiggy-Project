import React, { useRef } from "react";
import RestaurantCard from "./RestaurantCard";

const TopChains = ({ restaurants, onCardClick }) => {
  const scrollRef = useRef(null);
  if (!restaurants || restaurants.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 350, behavior: "smooth" });
    }
  };

  return (
    <div className="section-container section-border">
      <div className="section-header">
        <h2 className="section-title">Top restaurant chains in Bangalore</h2>
        <div className="scroll-arrows">
          <button className="arrow-btn" onClick={() => scroll(-1)}>←</button>
          <button className="arrow-btn" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="chains-scroll" ref={scrollRef}>
        {restaurants.map((r) => (
          <RestaurantCard key={r.info.id} info={r.info} onClick={() => onCardClick(r.info.id)} horizontal />
        ))}
      </div>
    </div>
  );
};

export default TopChains;
