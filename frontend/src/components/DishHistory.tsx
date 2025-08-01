import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import './DishHistory.css';

interface DishHistoryItem {
  id: number;
  dish_name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  selected_at: string;
}

const DishHistory: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [dishes, setDishes] = useState<DishHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if this is the recipes page or history page
  const isRecipesPage = location.pathname === '/recipes';

  useEffect(() => {
    if (user) {
      fetchDishHistory();
    }
  }, [user]);

  const fetchDishHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/dish-history?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Parse JSON fields back to arrays
        const parsedDishes = data.dishes.map((dish: any) => ({
          ...dish,
          ingredients: typeof dish.ingredients === 'string' ? JSON.parse(dish.ingredients) : dish.ingredients || [],
          instructions: typeof dish.instructions === 'string' ? JSON.parse(dish.instructions) : dish.instructions || []
        }));
        setDishes(parsedDishes);
      } else {
        setError(data.error || 'Failed to fetch dish history');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dish history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="dish-history-container">
        <div className="dish-history-empty">
          <h2>Please log in to view your dish history</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dish-history-container">
        <div className="dish-history-loading">
          <h2>Loading your dish history...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dish-history-container">
        <div className="dish-history-error">
          <h2>Error loading dish history</h2>
          <p>{error}</p>
          <button onClick={fetchDishHistory} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dish-history-container">
      <div className="dish-history-header">
        <h1 className="dish-history-title">
          {isRecipesPage ? 'Your Recipe Collection' : 'Your Cooking History'}
        </h1>
        <p className="dish-history-subtitle">
          {isRecipesPage 
            ? 'Discover and revisit all the delicious recipes you\'ve selected'
            : 'Track all the delicious dishes you\'ve selected and cooked'
          }
        </p>
      </div>

      {dishes.length === 0 ? (
        <div className="dish-history-empty">
          <h2>
            {isRecipesPage ? 'No recipes in your collection yet' : 'No dishes in your history yet'}
          </h2>
          <p>
            {isRecipesPage 
              ? 'Start building your recipe collection by selecting dishes from your meal recommendations!'
              : 'Start cooking by selecting dishes from your meal recommendations!'
            }
          </p>
        </div>
      ) : (
        <div className="dish-history-grid">
          {dishes.map((dish) => (
            <div key={dish.id} className="dish-history-card">
              <div className="dish-history-card-header">
                <h3 className="dish-history-dish-name">{dish.dish_name}</h3>
                <span className="dish-history-date">{formatDate(dish.selected_at)}</span>
              </div>
              
              {dish.description && (
                <p className="dish-history-description">{dish.description}</p>
              )}
              
              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="dish-history-ingredients">
                  <h4>Ingredients Used:</h4>
                  <ul>
                    {dish.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {dish.instructions && dish.instructions.length > 0 && (
                <div className="dish-history-instructions">
                  <h4>Cooking Instructions:</h4>
                  <ol>
                    {dish.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DishHistory; 