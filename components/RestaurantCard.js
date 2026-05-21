import React from "react";
import { CDN_URL } from "../utils/constants";

const RestaurantCard = ({ info, onClick, horizontal }) => {
  const { name, cloudinaryImageId, cuisines, avgRating, sla, aggregatedDiscountInfoV3, areaName } = info;
  const discount = aggregatedDiscountInfoV3;

  return (
    <div className={`res-card ${horizontal ? "res-card-horizontal" : ""}`} onClick={onClick}>
      <div className="res-card-img-wrap">
        <img src={CDN_URL + cloudinaryImageId} alt={name} className="res-card-img" loading="lazy" />
        {discount && (
          <div className="res-card-offer">
            <span>{discount.header} {discount.subHeader || ""}</span>
          </div>
        )}
      </div>
      <div className="res-card-body">
        <h3 className="res-card-name">{name}</h3>
        <div className="res-card-meta">
          <span className="res-card-rating">⭐ {avgRating || "NEW"}</span>
          <span className="res-card-dot">•</span>
          <span>{sla?.slaString || "30-35 mins"}</span>
        </div>
        <p className="res-card-cuisines">{cuisines?.join(", ")}</p>
        <p className="res-card-area">{areaName}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
