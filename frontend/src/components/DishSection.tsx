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

// Function to get a food image based on dish name
const getDishImage = (dishName: string): string => {
  const name = dishName.toLowerCase();
  
  // Map common dish types to specific images
  if (name.includes('pasta') || name.includes('noodle')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('salad')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('soup')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('rice')) {
    return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('chicken')) {
    return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('fish') || name.includes('salmon')) {
    return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80';
  }
  if (name.includes('beef') || name.includes('steak')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80';
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
    <div className="dish-section">
      <div className="dish-cards">
        {dishes.map((dish, idx) => (
          <div key={idx} className="dish-card">
            <div className="dish-logo">
              <span className="logo-text">ThymeSaver</span>
            </div>
            <div className="dish-image">
              <img
                src={getDishImage(dish.name)}
                alt={dish.name}
                className="dish-img"
                onError={(e) => {
                  // Fallback to default image if loading fails
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
            <h3 className="dish-title">{dish.name || `Dish ${idx + 1}`}</h3>
            <p className="dish-description">
              {dish.description || 'A delicious dish made with available ingredients'}
            </p>
            <div className="dish-cooking-time">
              {dish.ingredients && dish.ingredients.length > 0 
                ? `${Math.max(15, dish.ingredients.length * 5)} min Cooking Time`
                : '15 min Cooking Time'
              }
            </div>
            <button
              className="select-button"
              onClick={() => onCookThis(idx, dish)}
              disabled={selectedDish === idx}
            >
              {selectedDish === idx ? 'COOKING...' : 'SELECT'}
            </button>
            {selectedDish === idx && confirmation && (
              <div className="cook-confirmation">{confirmation}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishSection; 