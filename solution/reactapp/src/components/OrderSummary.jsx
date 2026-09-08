import React from 'react';
import PropTypes from 'prop-types';

const OrderSummary = ({ orderedItems, totalAmount }) => {
  return (
    <div id="order-summary">
      <h2 id="summary-title">Order Summary</h2>
      {orderedItems.length === 0 ? (
        <p id="empty-order">No items ordered yet.</p>
      ) : (
        <ul id="summary-list">
          {orderedItems.map((item) => (
            <li className="summary-row" key={item.id}>
              {item.itemName} x {item.quantity} = ${item.price * item.quantity}
            </li>
          ))}
        </ul>
      )}
      <p id="total-amount">Total Amount: ${totalAmount}</p>
    </div>
  );
};

OrderSummary.propTypes = {
  orderedItems: PropTypes.array.isRequired,
  totalAmount: PropTypes.number.isRequired,
};

export default OrderSummary;
