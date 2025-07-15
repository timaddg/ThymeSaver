import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './GroceryPage.css';

const GroceryPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ingredients?user_id=${userId}`);
        const data = await res.json();
        if (data.success && data.ingredients) {
          setIngredients(data.ingredients.map((i: any) => i.name));
        } else {
          setIngredients([]);
        }
      } catch {
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [userId]);

  return (
    <div className="grocery-page-container">
      <div className="grocery-header">
        <span role="img" aria-label="grocery" className="grocery-icon">🛒</span>
        <h2>Your Grocery List</h2>
      </div>
      {loading ? (
        <div className="grocery-loading">Loading...</div>
      ) : ingredients.length === 0 ? (
        <div className="grocery-empty-state">
          <span role="img" aria-label="empty" className="grocery-empty-icon">🥕</span>
          <div className="grocery-empty-text">Out of Ingredients</div>
        </div>
      ) : (
        <div className="grocery-list-cards">
          {ingredients.map((ing, idx) => (
            <div className="grocery-card" key={idx}>
              <span className="grocery-card-icon">🥗</span>
              <span className="grocery-card-name">{ing}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryPage; 