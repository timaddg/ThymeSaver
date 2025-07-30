import React from 'react';
import './DishSection.css';

interface Dish {
  name: string;
  description: string;
  ingredients: string[];
  instructions?: string[];
}

interface DishSectionProps {
  dishes: Dish[] | null;
  onCookThis: (idx: number, dish: Dish) => void;
  selectedDish: number | null;
  confirmation: string | null;
}

// Function to get a food image based on dish name or main ingredients
const getDishImage = (dishName: string, ingredients: string[]): string => {
  const name = dishName.toLowerCase();
  const all = [name, ...(ingredients || []).map(i => i.toLowerCase())].join(' ');

  // Ingredient keyword to image mapping
  const ingredientImageMap: { [key: string]: string } = {
    'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80',
    'beef': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80',
    'steak': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80',
    'fish': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
    'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=300&q=80',
    'noodle': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=300&q=80',
    'rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300&q=80',
    'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80',
    'tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=300&q=80',
    'onion': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
    'garlic': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80',
    'cucumber': 'https://images.unsplash.com/photo-1447175008436-170170e8a4d3?auto=format&fit=crop&w=300&q=80',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
    'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=300&q=80',
    'eggplant': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=300&q=80',
    'mushroom': 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=300&q=80',
    'tortilla': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=300&q=80',
    'sugar': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=300&q=80',
    'butter': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=300&q=80',
    'flour': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=300&q=80',
  };

  for (const key of Object.keys(ingredientImageMap)) {
    if (all.includes(key)) {
      return ingredientImageMap[key];
    }
  }

  // Default food image
  return 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=300&q=80';
};

const DishSection: React.FC<DishSectionProps> = ({
  dishes,
  onCookThis,
  selectedDish,
  confirmation,
}) => {
  if (!dishes || dishes.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2 className="recommendations-title">My Recommendations</h2>
        <p className="recommendations-subtitle">
          We consider all the drivers of change gives you the components you need to change to create a truly happens.
        </p>
      </div>
      <div className="recommendations-grid">
        {dishes.map((dish, idx) => (
          <div key={idx} className="recommendation-card">
            <div className="recommendation-image">
              <img
                src={getDishImage(dish.name, dish.ingredients)}
                alt={dish.name}
                className="recommendation-img"
                onError={(e) => {
                  // Fallback to default image if loading fails
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
            <div className="recommendation-content">
              <h3 className="recommendation-title">{dish.name || `Dish ${idx + 1}`}</h3>
              <p className="recommendation-description">
                {dish.description || 'Made with fresh ingredients and prepared with care.'}
              </p>
              {dish.instructions && dish.instructions.length > 0 && (
                <div className="cooking-instructions">
                  <h4 className="instructions-title">How to cook:</h4>
                  <ol className="instructions-list">
                    {dish.instructions.map((instruction, index) => (
                      <li key={index} className="instruction-item">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="recommendation-actions">
                <button
                  className="select-btn"
                  onClick={() => onCookThis(idx, dish)}
                  disabled={selectedDish === idx}
                >
                  {selectedDish === idx ? 'COOKING...' : 'Select'}
                </button>
              </div>
              {selectedDish === idx && confirmation && (
                <div className="cook-confirmation">{confirmation}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishSection; 