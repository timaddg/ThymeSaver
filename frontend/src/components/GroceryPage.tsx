import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './GroceryPage.css';
import salmonImg from '../assets/Salmon.jpg';
import chickenTacosImg from '../assets/ChickenTacos.jpg';
import mushroomImg from '../assets/mushroom.jpg';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

const PRODUCT_INGREDIENTS = [
  { id: 1, name: 'Lemon Herb Salmon', price: 6.99, image: salmonImg, tag: 'Gluten-Free', size: '12 oz', rating: 153, stars: 5 },
  { id: 2, name: 'Spicy Chicken Tacos', price: 4.99, image: chickenTacosImg, tag: 'Gluten-Free', size: '8 oz', rating: 244, stars: 5 },
  { id: 3, name: 'Mushroom Risotto', price: 5.49, image: mushroomImg, tag: 'Gluten-Free', size: '10 oz', rating: 121, stars: 5 },
  { id: 4, name: 'Onion', price: 0.99, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '1 lb', rating: 200, stars: 5 },
  { id: 5, name: 'Tomato', price: 1.29, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '1 lb', rating: 180, stars: 5 },
  { id: 6, name: 'Potato', price: 0.89, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '1 lb', rating: 170, stars: 5 },
  { id: 7, name: 'Garlic', price: 1.19, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '3 oz', rating: 160, stars: 5 },
  { id: 8, name: 'Carrot', price: 1.09, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '1 lb', rating: 150, stars: 5 },
  { id: 9, name: 'Spinach', price: 2.49, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '8 oz', rating: 140, stars: 5 },
  { id: 10, name: 'Broccoli', price: 2.29, image: PLACEHOLDER_IMG, tag: 'Vegetable', size: '1 lb', rating: 130, stars: 5 },
  { id: 11, name: 'Chicken Breast', price: 5.99, image: PLACEHOLDER_IMG, tag: 'Meat', size: '1 lb', rating: 120, stars: 5 },
  { id: 12, name: 'Eggs', price: 2.99, image: PLACEHOLDER_IMG, tag: 'Dairy', size: '12 ct', rating: 110, stars: 5 },
  { id: 13, name: 'Milk', price: 3.49, image: PLACEHOLDER_IMG, tag: 'Dairy', size: '1 gal', rating: 100, stars: 5 },
  { id: 14, name: 'Cheese', price: 4.49, image: PLACEHOLDER_IMG, tag: 'Dairy', size: '8 oz', rating: 90, stars: 5 },
  { id: 15, name: 'Rice', price: 2.99, image: PLACEHOLDER_IMG, tag: 'Grain', size: '2 lb', rating: 80, stars: 5 },
  { id: 16, name: 'Pasta', price: 1.99, image: PLACEHOLDER_IMG, tag: 'Grain', size: '1 lb', rating: 70, stars: 5 },
  { id: 17, name: 'Beef', price: 7.99, image: PLACEHOLDER_IMG, tag: 'Meat', size: '1 lb', rating: 60, stars: 5 },
  { id: 18, name: 'Pork', price: 6.99, image: PLACEHOLDER_IMG, tag: 'Meat', size: '1 lb', rating: 50, stars: 5 },
  { id: 19, name: 'Fish', price: 8.99, image: PLACEHOLDER_IMG, tag: 'Meat', size: '1 lb', rating: 40, stars: 5 },
  { id: 20, name: 'Salt', price: 0.79, image: PLACEHOLDER_IMG, tag: 'Pantry', size: '8 oz', rating: 30, stars: 5 },
  { id: 21, name: 'Pepper', price: 1.29, image: PLACEHOLDER_IMG, tag: 'Pantry', size: '4 oz', rating: 20, stars: 5 },
  { id: 22, name: 'Oil', price: 3.99, image: PLACEHOLDER_IMG, tag: 'Pantry', size: '16 oz', rating: 10, stars: 5 },
  { id: 23, name: 'Butter', price: 2.99, image: PLACEHOLDER_IMG, tag: 'Dairy', size: '8 oz', rating: 10, stars: 5 },
  { id: 24, name: 'Flour', price: 2.49, image: PLACEHOLDER_IMG, tag: 'Pantry', size: '2 lb', rating: 10, stars: 5 },
  { id: 25, name: 'Sugar', price: 1.99, image: PLACEHOLDER_IMG, tag: 'Pantry', size: '2 lb', rating: 10, stars: 5 },
];

const GroceryPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [message, setMessage] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(q => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }));
  };

  const handleAddToCart = async (ingredient: any) => {
    setMessage(null);
    if (!userId) {
      setMessage('You must be logged in to add ingredients.');
      return;
    }
    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name: ingredient.name, quantity: quantities[ingredient.id] || 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`${ingredient.name} added to your grocery list!`);
      } else {
        setMessage('Failed to add ingredient.');
      }
    } catch {
      setMessage('Failed to add ingredient.');
    }
  };

  return (
    <div className="grocery-page-root">
      <h2 className="grocery-page-title">Grocery Ingredients</h2>
      {message && <div className="grocery-page-message">{message}</div>}
      <div className="grocery-product-grid">
        {PRODUCT_INGREDIENTS.map(ingredient => (
          <div className="grocery-product-card" key={ingredient.id}>
            <img src={ingredient.image} alt={ingredient.name} className="grocery-product-img" />
            <div className="grocery-product-tag">{ingredient.tag}</div>
            <div className="grocery-product-name">{ingredient.name}</div>
            <div className="grocery-product-price">${ingredient.price.toFixed(2)}</div>
            <div className="grocery-product-size">{ingredient.size}</div>
            <div className="grocery-product-rating">
              {'★'.repeat(ingredient.stars)}
              <span className="grocery-product-rating-count">({ingredient.rating})</span>
            </div>
            <div className="grocery-product-qty">
              <button onClick={() => handleQuantityChange(ingredient.id, -1)}>-</button>
              <span>{quantities[ingredient.id] || 1}</span>
              <button onClick={() => handleQuantityChange(ingredient.id, 1)}>+</button>
            </div>
            <button className="grocery-product-btn" onClick={() => handleAddToCart(ingredient)} disabled={!userId}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryPage; 