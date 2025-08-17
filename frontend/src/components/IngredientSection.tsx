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

// Helper function to get ingredient icon based on name
const getIngredientIcon = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();
  if (name.includes('tomato') || name.includes('tomatoes')) return '🍅';
  if (name.includes('flour') || name.includes('wheat')) return '🌾';
  if (name.includes('olive') || name.includes('oil')) return '🫒';
  if (name.includes('berry') || name.includes('berries')) return '🫐';
  if (name.includes('chicken') || name.includes('meat')) return '🍗';
  if (name.includes('fish') || name.includes('salmon')) return '🐟';
  if (name.includes('mushroom')) return '🍄';
  if (name.includes('garlic')) return '🧄';
  if (name.includes('onion')) return '🧅';
  if (name.includes('pepper')) return '🫑';
  if (name.includes('cucumber')) return '🥒';
  if (name.includes('butter')) return '🧈';
  if (name.includes('sugar') || name.includes('salt')) return '🧂';
  return '🥬'; // Default icon
};

// Helper function to get ingredient description
const getIngredientDescription = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();
  if (name.includes('tomato') || name.includes('tomatoes')) return 'Freshly, sun-ripened';
  if (name.includes('flour') || name.includes('wheat')) return 'Freshly picked, milled, organic';
  if (name.includes('olive') || name.includes('oil')) return 'Cold-pressed, extra virgin';
  if (name.includes('berry') || name.includes('berries')) return 'Organically grown';
  if (name.includes('chicken') || name.includes('meat')) return 'Free-range, hormone-free';
  if (name.includes('fish') || name.includes('salmon')) return 'Wild-caught, sustainable';
  if (name.includes('mushroom')) return 'Freshly harvested, organic';
  if (name.includes('garlic')) return 'Freshly picked, organic';
  if (name.includes('onion')) return 'Freshly harvested, organic';
  if (name.includes('pepper')) return 'Freshly picked, organic';
  if (name.includes('cucumber')) return 'Freshly harvested, organic';
  if (name.includes('butter')) return 'Grass-fed, organic';
  if (name.includes('sugar') || name.includes('salt')) return 'Pure, unrefined';
  return 'Freshly harvested, organic'; // Default description
};

// Helper function to get dietary classification
const getDietaryClassification = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();
  
  // Non-vegetarian ingredients (meat, fish, eggs)
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('lamb') || name.includes('turkey') || name.includes('duck') ||
      name.includes('fish') || name.includes('salmon') || name.includes('tuna') ||
      name.includes('shrimp') || name.includes('crab') || name.includes('lobster') ||
      name.includes('egg') || name.includes('eggs') || name.includes('meat')) {
    return 'Non-Vegetarian';
  }
  
  // Vegan ingredients (no animal products)
  if (name.includes('tomato') || name.includes('tomatoes') || 
      name.includes('flour') || name.includes('wheat') ||
      name.includes('mushroom') || name.includes('garlic') ||
      name.includes('onion') || name.includes('pepper') ||
      name.includes('cucumber') || name.includes('olive') ||
      name.includes('oil') || name.includes('sugar') ||
      name.includes('salt') || name.includes('rice') ||
      name.includes('pasta') || name.includes('bean') ||
      name.includes('lentil') || name.includes('chickpea') ||
      name.includes('quinoa') || name.includes('oat')) {
    return 'Vegan';
  }
  
  // Vegetarian ingredients (dairy, honey, etc.)
  if (name.includes('butter') || name.includes('cheese') || name.includes('milk') ||
      name.includes('yogurt') || name.includes('cream') || name.includes('honey')) {
    return 'Vegetarian';
  }
  
  // Default to vegetarian for unknown ingredients
  return 'Vegetarian';
};

const IngredientSection: React.FC = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleDeleteIngredient = async (ingredientId: number) => {
    if (!user) return;
    
    setDeletingId(ingredientId);
    try {
      const response = await fetch(`/api/ingredients/${ingredientId}?user_id=${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the ingredient from the local state
        setIngredients(prevIngredients => 
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
      } else {
        setError('Failed to delete ingredient');
      }
    } catch (err) {
      setError('Failed to delete ingredient');
    } finally {
      setDeletingId(null);
    }
  };

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
      <div className="ingredient-header">
        <h2 className="ingredient-section-title">Ingredients</h2>
        <div className="ingredient-header-icons">
          <span className="ingredient-icon">🧪</span>
          <span className="ingredient-icon">🌱</span>
        </div>
      </div>
      {loading && <div className="ingredient-section-message">Loading...</div>}
      {error && <div className="ingredient-section-message">{error}</div>}
      <div className="ingredient-list">
        {ingredients.map(ingredient => {
          const dietaryType = getDietaryClassification(ingredient.name);
          
          return (
            <div className="ingredient-entry" key={ingredient.id}>
              <div className="ingredient-entry-content">
                <div className="ingredient-name">{ingredient.name}</div>
                <div className="ingredient-actions">
                  <div className="dietary-classification">
                    <span className={`dietary-tag ${dietaryType.toLowerCase().replace(/\s+/g, '-')}`}>
                      {dietaryType}
                    </span>
                  </div>
                  <button
                    className="delete-ingredient-btn"
                    onClick={() => handleDeleteIngredient(ingredient.id)}
                    disabled={deletingId === ingredient.id}
                    title="Delete ingredient"
                  >
                    {deletingId === ingredient.id ? '🗑️' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ingredient-footer">
        <a href="/ingredients" className="view-all-link">View all ingredients</a>
      </div>
    </section>
  );
};

export default IngredientSection; 