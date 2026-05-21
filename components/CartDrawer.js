import React from "react";

const CartDrawer = ({ isOpen, onClose, cartItems, onAdd, onRemove, onCheckout }) => {
  if (!isOpen) return null;
  const itemTotal = cartItems.reduce((s, c) => s + ((c.item.price || c.item.defaultPrice || 15000) / 100) * c.qty, 0);
  const deliveryFee = 29;
  const platformFee = 5;
  const gst = Math.round(itemTotal * 0.05);
  const total = itemTotal + deliveryFee + platformFee + gst;
  const resName = cartItems[0]?.restaurant?.name || "";

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <h2 className="cart-title">My Cart</h2>
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <>
            <p className="cart-from">ORDERING FROM<br /><strong>{resName}</strong></p>
            <div className="cart-items">
              {cartItems.map(c => {
                const price = (c.item.price || c.item.defaultPrice || 15000) / 100;
                return (
                  <div key={c.item.id} className="cart-item-row">
                    <span className={`veg-icon-sm ${c.item.itemAttribute?.vegClassifier === "NONVEG" ? "nonveg" : "veg"}`}>●</span>
                    <span className="cart-item-name">{c.item.name}</span>
                    <div className="qty-control-sm">
                      <button onClick={() => onRemove(c.item.id)}>−</button>
                      <span>{c.qty}</span>
                      <button onClick={() => onAdd(c.item, c.restaurant)}>+</button>
                    </div>
                    <span className="cart-item-price">₹{(price * c.qty).toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
            <div className="cart-bill">
              <h3>BILL DETAILS</h3>
              <div className="bill-row"><span>Item Total</span><span>₹{itemTotal.toFixed(0)}</span></div>
              <div className="bill-row"><span>Delivery Partner Fee</span><span>₹{deliveryFee}</span></div>
              <div className="bill-row"><span>Platform Fee</span><span>₹{platformFee}</span></div>
              <div className="bill-row"><span>GST & Restaurant Charges</span><span>₹{gst}</span></div>
              <div className="bill-row bill-total"><span>TO PAY</span><span>₹{total.toFixed(0)}</span></div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>Proceed to Pay ₹{total.toFixed(0)}</button>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
