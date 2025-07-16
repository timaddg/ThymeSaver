import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './GroceryPage.css';
import salmonImg from '../assets/Salmon.jpg';
import chickenTacosImg from '../assets/ChickenTacos.jpg';
import mushroomImg from '../assets/mushroom.jpg';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

const PRODUCT_INGREDIENTS = [
  { ingredient_id: 1, name: 'Onion', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 2, name: 'Tomato', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 3, name: 'Cucumber', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 4, name: 'Potato', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 5, name: 'Garlic', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 6, name: 'Carrot', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 7, name: 'Spinach', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 8, name: 'Broccoli', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 9, name: 'Chicken Breast', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 10, name: 'Eggs', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 11, name: 'Milk', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 12, name: 'Cheese', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 13, name: 'Rice', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 14, name: 'Pasta', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 15, name: 'Beef', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 16, name: 'Pork', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 17, name: 'Fish', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 18, name: 'Salt', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 19, name: 'Pepper', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 20, name: 'Oil', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 21, name: 'Butter', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 22, name: 'Flour', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 23, name: 'Sugar', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 24, name: 'Chicken Thighs', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 25, name: 'Steak', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: PLACEHOLDER_IMG },
  { ingredient_id: 26, name: 'Salmon', quantity: '1', created_at: '2024-06-01T10:00:00Z', image: salmonImg },
];

const getIngredientImage = (ingredient: any) => {
  // If a local image is provided, use it
  if (ingredient.image && !ingredient.image.includes('unsplash.com')) return ingredient.image;
  // Otherwise, use Spoonacular CDN
  const formattedName = ingredient.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `https://spoonacular.com/cdn/ingredients_100x100/${formattedName}.png`;
};

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
        body: JSON.stringify({ user_id: userId, name: ingredient.name, quantity: quantities[ingredient.ingredient_id] || 1 }),
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

  const handleSubmitAll = async () => {
    setMessage(null);
    if (!userId) {
      setMessage('You must be logged in to add ingredients.');
      return;
    }
    // Prepare all ingredients with their selected quantities
    const ingredientsToAdd = PRODUCT_INGREDIENTS.map(ingredient => ({
      name: ingredient.name,
      quantity: quantities[ingredient.ingredient_id] || ingredient.quantity,
    }));
    try {
      const res = await fetch('/api/ingredients/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ingredients: ingredientsToAdd }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('All ingredients added to your grocery list!');
      } else {
        setMessage('Failed to add ingredients.');
      }
    } catch {
      setMessage('Failed to add ingredients.');
    }
  };

  return (
    <div className="grocery-page-root">
      <h2 className="grocery-page-title">Grocery Ingredients</h2>
      {message && <div className="grocery-page-message">{message}</div>}
      <div className="grocery-product-grid">
        {PRODUCT_INGREDIENTS.map(ingredient => (
          <div className="grocery-product-card" key={ingredient.ingredient_id}>
            <img
              src={getIngredientImage(ingredient)}
              alt={ingredient.name}
              className="grocery-product-img"
              onError={e => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
              }}
            />
            <div className="grocery-product-name">{ingredient.name}</div>
            <div className="grocery-product-qty">
              <button onClick={() => handleQuantityChange(ingredient.ingredient_id, -1)}>-</button>
              <span>{quantities[ingredient.ingredient_id] || ingredient.quantity}</span>
              <button onClick={() => handleQuantityChange(ingredient.ingredient_id, 1)}>+</button>
            </div>
            <div className="grocery-product-created">Added: {new Date(ingredient.created_at).toLocaleDateString()}</div>
            {/* Remove individual Add to Cart button */}
          </div>
        ))}
      </div>
      <button
        className="grocery-submit-all-btn"
        onClick={handleSubmitAll}
        disabled={!userId}
        style={{ marginTop: 32, padding: '16px 32px', fontSize: 18, fontWeight: 700, background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 8, cursor: userId ? 'pointer' : 'not-allowed', fontFamily: 'Base Neue, sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        Submit All Ingredients
      </button>
    </div>
  );
};

export default GroceryPage; 