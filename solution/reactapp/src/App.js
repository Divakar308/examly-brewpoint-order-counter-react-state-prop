import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MenuItem from './components/MenuItem';
import OrderSummary from './components/OrderSummary';
import './App.css';

const App = () => {
  const [items, setItems] = useState([
    { id: 1, itemName: 'Espresso', category: 'Hot', price: 120, quantity: 0 },
    { id: 2, itemName: 'Cold Brew', category: 'Cold', price: 180, quantity: 0 },
    { id: 3, itemName: 'Cappuccino', category: 'Hot', price: 150, quantity: 0 },
  ]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    console.log(`Total items in cart: ${totalItems}`);
  }, [totalItems]);

  const handleIncrease = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const orderedItems = items.filter((item) => item.quantity > 0);

  return (
    <Router>
      <div id="app-container">
        <h1 id="page-title">BrewPoint Order Counter</h1>
        <span id="total-items">Total Items: {totalItems}</span>
        <nav id="main-nav">
          <Link to="/">Menu</Link>
          <Link to="/summary">Summary</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div id="menu-list">
                {items.map((item) => (
                  <MenuItem
                    key={item.id}
                    itemName={item.itemName}
                    category={item.category}
                    price={item.price}
                    quantity={item.quantity}
                    onIncrease={() => handleIncrease(item.id)}
                    onDecrease={() => handleDecrease(item.id)}
                  />
                ))}
              </div>
            }
          />
          <Route
            path="/summary"
            element={<OrderSummary orderedItems={orderedItems} totalAmount={totalAmount} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
