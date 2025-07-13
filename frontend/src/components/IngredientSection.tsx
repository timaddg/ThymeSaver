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
      <form className="ingredient-form" style={{marginBottom: '2rem'}} onSubmit={handleAdd} autoComplete="off">
        <div style={{position: 'relative', width: '60%', display: 'inline-block', marginRight: '1rem'}}>
          <input
            type="text"
            placeholder="Enter an ingredient (e.g., onions, tomato)"
            value={ingredient}
            onChange={handleIngredientChange}
            style={{padding: '0.7rem 1.2rem', borderRadius: '1.5rem', border: '1.5px solid #e0e0e0', fontSize: '1rem', width: '100%'}}
            onFocus={() => ingredient && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{position: 'absolute', left: 0, right: 0, top: '110%', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '1rem', zIndex: 10, listStyle: 'none', margin: 0, padding: '0.3rem 0'}}>
              {suggestions.map(s => (
                <li
                  key={s}
                  style={{padding: '0.5rem 1.2rem', cursor: 'pointer'}}
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
          style={{padding: '0.7rem 1.2rem', borderRadius: '1.5rem', border: '1.5px solid #e0e0e0', fontSize: '1rem', width: '25%', marginRight: '1rem'}}
        />
        <button type="submit" style={{padding: '0.7rem 2rem', borderRadius: '1.5rem', background: '#2ecc40', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem'}}>Add</button>
      </form>
      {added.length > 0 && (
        <div style={{marginTop: '1.5rem'}}>
          <h3 style={{fontSize: '1.1rem', marginBottom: '0.7rem'}}>Your Ingredients</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {added.map((item, idx) => (
              <li key={idx} style={{marginBottom: '0.5rem', fontSize: '1.05rem'}}>
                <span style={{fontWeight: 600}}>{item.name}</span>
                {item.quantity && <span style={{color: '#888'}}> &nbsp;({item.quantity})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default IngredientSection; 