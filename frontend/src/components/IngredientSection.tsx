import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './IngredientSection.css';
import salmonBowlImg from '../assets/Salmon.jpg';
import chickenTacosImg from '../assets/ChickenTacos.jpg';
import mushroomImg from '../assets/mushroom.jpg';

const RANDOM_DISHES = [
  {
    name: 'Lemon Herb Salmon',
    time: '25 MINS',
    image: salmonBowlImg,
  },
  {
    name: 'Spicy Chicken Tacos',
    time: '25 MINS',
    image: chickenTacosImg,
  },
  {
    name: 'Mushroom Risotto',
    time: '25 MINS',
    image: mushroomImg,
  },
];

const IngredientSection: React.FC = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    fetch(`/api/ingredients?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIngredients(data.ingredients);
        } else {
          setError('Failed to fetch ingredients.');
        }
      })
      .catch(() => setError('Failed to fetch ingredients.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <section className="ingredient-section-root menu-section">
        <h2 className="ingredient-section-title">This Week’s Menu</h2>
        <div className="menu-cards-row">
          {RANDOM_DISHES.map((dish, idx) => (
            <div className="menu-card" key={idx}>
              <img src={dish.image} alt={dish.name} className="menu-card-img" />
              <div className="menu-card-row">
                <div className="menu-card-name">{dish.name}</div>
                <div className="menu-card-time">{dish.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="ingredient-section-root">
      <h2 className="ingredient-section-title">Your Ingredients</h2>
      {loading && <div className="ingredient-section-message">Loading...</div>}
      {error && <div className="ingredient-section-message">{error}</div>}
      <div className="ingredient-section-grid">
        {ingredients.map(ingredient => (
          <div className="ingredient-card" key={ingredient.id}>
            <div className="ingredient-card-name">{ingredient.name}</div>
            {ingredient.quantity && <div className="ingredient-card-qty">Qty: {ingredient.quantity}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default IngredientSection; 