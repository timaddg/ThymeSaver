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

// Helper function to get ingredient tags
const getIngredientTags = (ingredientName: string): string[] => {
  const name = ingredientName.toLowerCase();
  const tags: string[] = [];
  
  // Add organic tag for most ingredients
  if (!name.includes('sugar') && !name.includes('salt')) {
    tags.push('Organic');
  }
  
  // Add specific tags based on ingredient type
  if (name.includes('tomato') || name.includes('tomatoes') || 
      name.includes('flour') || name.includes('wheat') ||
      name.includes('mushroom') || name.includes('garlic') ||
      name.includes('onion') || name.includes('pepper') ||
      name.includes('cucumber')) {
    tags.push('Vegan');
  }
  
  if (name.includes('flour') || name.includes('wheat')) {
    tags.push('Gluten-Free');
  }
  
  if (name.includes('olive') || name.includes('oil')) {
    tags.push('Cold-Pressed');
  }
  
  if (name.includes('chicken') || name.includes('meat')) {
    tags.push('Free-Range');
  }
  
  if (name.includes('fish') || name.includes('salmon')) {
    tags.push('Wild-Caught');
  }
  
  if (name.includes('butter')) {
    tags.push('Grass-Fed');
  }
  
  // Ensure we always have at least one tag
  if (tags.length === 0) {
    tags.push('Fresh');
  }
  
  return tags;
};

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
        {ingredients.map(ingredient => (
          <div className="ingredient-entry" key={ingredient.id}>
            <div className="ingredient-entry-content">
              <div className="ingredient-icon-container">
                <span className="ingredient-entry-icon">
                  {getIngredientIcon(ingredient.name)}
                </span>
              </div>
              <div className="ingredient-details">
                <div className="ingredient-name">{ingredient.name}</div>
                <div className="ingredient-description">
                  {getIngredientDescription(ingredient.name)}
                </div>
              </div>
              <div className="ingredient-tags">
                {getIngredientTags(ingredient.name).map((tag, index) => (
                  <span key={index} className={`ingredient-tag ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="ingredient-footer">
        <a href="/ingredients" className="view-all-link">View all ingredients</a>
      </div>
    </section>
  );
};

export default IngredientSection; 