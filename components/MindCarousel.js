import React, { useRef } from "react";
import { CAROUSEL_CDN } from "../utils/constants";

const MindCarousel = ({ items, onSelect }) => {
  const scrollRef = useRef(null);
  if (!items || items.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 350, behavior: "smooth" });
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">What's on your mind?</h2>
        <div className="scroll-arrows">
          <button className="arrow-btn" onClick={() => scroll(-1)}>←</button>
          <button className="arrow-btn" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="mind-scroll" ref={scrollRef}>
        {items.map((item, i) => (
          <div key={i} className="mind-item" onClick={() => onSelect(item)}>
            <img src={CAROUSEL_CDN + item.imageId} alt={item.action?.text || "food"} className="mind-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindCarousel;
