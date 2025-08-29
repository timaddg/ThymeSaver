import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReceiptUpload from './ReceiptUpload';
import './GroceryPage.css';


const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=500&q=90';

const PRODUCT_INGREDIENTS = [
  { ingredient_id: 1, name: 'Onion', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 2, name: 'Tomato', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 3, name: 'Cucumber', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 4, name: 'Potato', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 5, name: 'Garlic', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 6, name: 'Carrot', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 7, name: 'Spinach', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 8, name: 'Broccoli', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 9, name: 'Chicken Breast', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 10, name: 'Eggs', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 11, name: 'Milk', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 12, name: 'Cheese', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 13, name: 'Rice', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 14, name: 'Pasta', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 15, name: 'Beef', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 16, name: 'Pork', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 17, name: 'Fish', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 18, name: 'Salt', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 19, name: 'Pepper', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 20, name: 'Oil', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 21, name: 'Butter', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 22, name: 'Flour', quantity: '0', created_at: '2024-02-01T10:00:00Z' },
  { ingredient_id: 23, name: 'Sugar', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 24, name: 'Chicken Thighs', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 25, name: 'Steak', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
  { ingredient_id: 26, name: 'Salmon', quantity: '0', created_at: '2024-06-01T10:00:00Z' },
];

interface IngredientItem {
  name: string;
  image?: string;
}

const getIngredientImage = (ingredient: IngredientItem): string => {
  // If a local image is provided, use it
  if (ingredient.image && !ingredient.image.includes('unsplash.com')) return ingredient.image;
  
  // Enhanced ingredient image mapping with better quality and more specific images
  const ingredientImageMap: { [key: string]: string } = {
    // Fresh Vegetables - High quality, vibrant images
    'onion': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=90',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=90',
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=90',
    'cucumber': 'https://images.unsplash.com/photo-1447175008436-170170e8a4d3?auto=format&fit=crop&w=500&q=90',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=90',
    'tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=90',
    'garlic': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=90',
    'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=90',
    
    // Grains & Pasta
    'rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=90',
    'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=500&q=90',
    
    // Proteins - High-quality meat photography
    'beef': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=90',
    'pork': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90',
    'fish': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=90',
    'steak': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=90',
    'chicken breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=90',
    'chicken thighs': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=90',
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=90',
    
    // Dairy & Eggs
    'eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=90',
    'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=90',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=90',
    
    // Baking & Seasonings
    'sugar': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=90',
    'salt': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=90',
    'pepper': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=90',
    'oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=90',
    'butter': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=500&q=90',
    'flour': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=90'
  };
  
  const ingredientName = ingredient.name.toLowerCase();
  return ingredientImageMap[ingredientName] || PLACEHOLDER_IMG;
};

const GroceryPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [message, setMessage] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(q => {
      const currentQuantity = q[id] || 0;
      const newQuantity = currentQuantity + delta;
      return { ...q, [id]: Math.max(0, newQuantity) };
    });
  };

  const handleSubmitAll = async () => {
    setMessage(null);
    if (!userId) {
      setMessage('You must be logged in to add ingredients.');
      return;
    }
    // Prepare only ingredients with quantity > 0
    const ingredientsToAdd = PRODUCT_INGREDIENTS
      .map(ingredient => ({
        name: ingredient.name,
        quantity: quantities[ingredient.ingredient_id] || 0,
      }))
      .filter(ingredient => ingredient.quantity > 0);
    
    if (ingredientsToAdd.length === 0) {
      setMessage('Please select at least one ingredient to add.');
      return;
    }
    
    try {
      const res = await fetch('/api/ingredients/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ingredients: ingredientsToAdd }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`${ingredientsToAdd.length} ingredient(s) added to your grocery list!`);
        // Reset quantities after successful submission
        setQuantities({});
      } else {
        setMessage('Failed to add ingredients.');
      }
    } catch {
      setMessage('Failed to add ingredients.');
    }
  };

  return (
    <div className="grocery-page-root">
      {/* Receipt Upload Section - Right below Navbar */}
      <div className="receipt-upload-section">
        <ReceiptUpload />
      </div>
      
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
              <span>{quantities[ingredient.ingredient_id] || 0}</span>
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