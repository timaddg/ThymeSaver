import React, { useState } from 'react';
import './CartPage.css';
import { useAuth } from '../context/AuthContext';

const INGREDIENTS = [
  { id: 1, name: 'Bell Peppers', price: 1.29, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Onions', price: 1.29, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Avocado', price: 1.29, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Green Beans', price: 1.29, image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Tomato Sauce', price: 1.29, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Chicken Breasts', price: 1.29, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
];

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(q => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }));
  };

  const handleAddToCart = async (ingredient: any) => {
    setMessage(null);
    if (!user) {
      setMessage('You must be logged in to add ingredients.');
      return;
    }
    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, name: ingredient.name, quantity: quantities[ingredient.id] || 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`${ingredient.name} added to your ingredients!`);
      } else {
        setMessage('Failed to add ingredient.');
      }
    } catch {
      setMessage('Failed to add ingredient.');
    }
  };

  return (
    <div className="cart-page-root">
      <aside className="cart-sidebar">
        <h2 className="sidebar-title">Filteoors</h2>
        <div className="sidebar-section">
          <div className="sidebar-label">Category</div>
          <div className="sidebar-option">Produce</div>
          <div className="sidebar-option">Dairy & Eggs</div>
          <div className="sidebar-option">Meat & Seafood</div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Dietary</div>
          <div className="sidebar-option">Organic</div>
          <div className="sidebar-option">Gluten Free</div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Price Range</div>
          <input type="range" min={1} max={10} className="sidebar-slider" />
        </div>
      </aside>
      <main className="cart-main">
        <h1 className="cart-title">Ingredients</h1>
        {message && <div className="cart-message">{message}</div>}
        <div className="cart-grid">
          {INGREDIENTS.map(ingredient => (
            <div className="cart-card" key={ingredient.id}>
              <img src={ingredient.image} alt={ingredient.name} className="cart-card-img" />
              <div className="cart-card-name">{ingredient.name}</div>
              <div className="cart-card-price">${ingredient.price.toFixed(2)}/ea</div>
              <div className="cart-card-qty">
                <button onClick={() => handleQuantityChange(ingredient.id, -1)}>-</button>
                <span>{quantities[ingredient.id] || 1}</span>
                <button onClick={() => handleQuantityChange(ingredient.id, 1)}>+</button>
              </div>
              <button className="cart-card-btn" onClick={() => handleAddToCart(ingredient)} disabled={!user}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CartPage; 