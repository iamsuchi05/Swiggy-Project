import React from "react";

const Shimmer = () => (
  <div className="shimmer-grid">
    {Array(8).fill("").map((_, i) => (
      <div key={i} className="shimmer-card">
        <div className="shimmer-img" />
        <div className="shimmer-line w70" />
        <div className="shimmer-line w50" />
        <div className="shimmer-line w30" />
      </div>
    ))}
  </div>
);

export default Shimmer;
