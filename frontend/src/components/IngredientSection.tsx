import React, { useState } from 'react';
import './IngredientSection.css';
import { ingredientApi } from '../services/api';

const COMMON_INGREDIENTS = [
  'Onion', 'Onions', 'Tomato', 'Tomatoes', 'Potato', 'Potatoes', 'Garlic', 'Carrot', 'Spinach', 'Broccoli', 'Chicken', 'Eggs', 'Milk', 'Cheese', 'Rice', 'Pasta', 'Beef', 'Pork', 'Fish', 'Salt', 'Pepper', 'Oil', 'Butter', 'Flour', 'Sugar', 'Lettuce', 'Cucumber', 'Peas', 'Beans', 'Corn', 'Mushroom', 'Chili', 'Ginger', 'Lemon', 'Lime', 'Apple', 'Banana', 'Orange', 'Grapes', 'Strawberry', 'Blueberry', 'Yogurt', 'Cream', 'Celery', 'Cabbage', 'Cauliflower', 'Pumpkin', 'Zucchini', 'Eggplant', 'Avocado', 'Turkey', 'Lamb', 'Shrimp', 'Tofu', 'Paneer', 'Oats', 'Honey', 'Vinegar', 'Soy Sauce', 'Ketchup', 'Mustard', 'Mayonnaise', 'Basil', 'Parsley', 'Cilantro', 'Mint', 'Rosemary', 'Thyme', 'Dill', 'Cinnamon', 'Nutmeg', 'Cloves', 'Cardamom', 'Cumin', 'Coriander', 'Paprika', 'Turmeric', 'Saffron', 'Chives', 'Sage', 'Bay Leaf', 'Vanilla', 'Coconut', 'Almond', 'Walnut', 'Peanut', 'Cashew', 'Pistachio', 'Hazelnut', 'Sunflower Seeds', 'Pumpkin Seeds', 'Sesame Seeds', 'Quinoa', 'Barley', 'Lentils', 'Chickpeas', 'Black Beans', 'Kidney Beans', 'White Beans', 'Green Beans', 'Sweet Potato', 'Radish', 'Turnip', 'Parsnip', 'Leek', 'Shallot', 'Scallion', 'Artichoke', 'Asparagus', 'Brussels Sprouts', 'Okra', 'Bok Choy', 'Kale', 'Swiss Chard', 'Arugula', 'Endive', 'Fennel', 'Rutabaga', 'Collard Greens', 'Mustard Greens', 'Watercress', 'Beet', 'Beetroot', 'Peach', 'Pear', 'Plum', 'Pineapple', 'Mango', 'Papaya', 'Melon', 'Watermelon', 'Cantaloupe', 'Fig', 'Date', 'Raisin', 'Prune', 'Apricot', 'Cherry', 'Pomegranate', 'Guava', 'Lychee', 'Passion Fruit', 'Kiwi', 'Starfruit', 'Dragonfruit', 'Jackfruit', 'Durian', 'Tamarind', 'Gooseberry', 'Mulberry', 'Blackberry', 'Raspberry', 'Cranberry', 'Currant', 'Elderberry', 'Persimmon', 'Sapote', 'Soursop', 'Breadfruit', 'Longan', 'Rambutan', 'Mangosteen', 'Salak', 'Jujube', 'Medlar', 'Loquat', 'Quince', 'Miracle Fruit', 'Ackee', 'Cupuacu', 'Camu Camu', 'Lucuma', 'Mamey', 'Noni', 'Pitaya', 'Soursop', 'Ugli Fruit', 'Yuzu', 'Ziziphus', 'Other'
];

interface IngredientItem {
  name: string;
  quantity: string;
}

const USER_ID = 1; // Replace with actual user id from auth/session

const IngredientSection: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [added, setAdded] = useState<IngredientItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIngredient(value);
    if (value.length > 0) {
      const filtered = COMMON_INGREDIENTS.filter(item =>
        item.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIngredient(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredient.trim()) return;
    // Send to backend
    await ingredientApi.add({
      user_id: USER_ID,
      name: ingredient.trim(),
      quantity: quantity.trim(),
    });
    setAdded(prev => [...prev, { name: ingredient.trim(), quantity: quantity.trim() }]);
    setIngredient('');
    setQuantity('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <section className="recipe-section">
      <h2 className="recipe-section-title">Ingredients & Ideas</h2>
      <form className="ingredient-form" onSubmit={handleAdd} autoComplete="off">
        <div className="ingredient-input-group">
          <input
            type="text"
            placeholder="Enter an ingredient (e.g., onions, tomato)"
            value={ingredient}
            onChange={handleIngredientChange}
            className="ingredient-input"
            onFocus={() => ingredient && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(s => (
                <li
                  key={s}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="text"
          placeholder="Quantity (e.g., 2, 1 cup, 500g)"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="quantity-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      {added.length > 0 && (
        <div className="ingredients-list">
          <h3 className="ingredients-title">Your Ingredients</h3>
          <ul className="ingredients-ul">
            {added.map((item, idx) => (
              <li key={idx} className="ingredient-item">
                <span className="ingredient-name">{item.name}</span>
                {item.quantity && <span className="ingredient-quantity">({item.quantity})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default IngredientSection; 