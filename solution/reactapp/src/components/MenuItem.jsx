import React from 'react';
import PropTypes from 'prop-types';
import './MenuItem.css';

const MenuItem = ({ itemName, category, price, quantity, onIncrease, onDecrease }) => {
  return (
    <div className="menu-row">
      <div className="item-info">
        <h2 className="item-name">{itemName}</h2>
        <p className="item-category">Category: {category}</p>
        <p className="item-price">Price: ${price}</p>
      </div>
      <div className="qty-controls">
        <button className="decrease-btn" onClick={onDecrease}>
          -
        </button>
        <span className="qty-value">{quantity}</span>
        <button className="increase-btn" onClick={onIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
};

export default MenuItem;
