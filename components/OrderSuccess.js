import React from "react";

const OrderSuccess = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-animation">
          <div className="road"><div className="road-line" /></div>
          <div className="bike">🛵</div>
        </div>
        <h2 className="success-title">Order Confirmed!</h2>
        <p className="success-text">Woohoo! Your payment was successful. The restaurant is preparing your hot meal and our delivery partner is on their way!</p>
        <button className="success-btn" onClick={onClose}>Track Order</button>
      </div>
    </div>
  );
};

export default OrderSuccess;
