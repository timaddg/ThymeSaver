import React from 'react';
import './DishSection.css';
import imageService from '../services/imageService';

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
                src={imageService.getDishImage(dish.name, dish.ingredients)}
                alt={dish.name}
                className="recommendation-img"
                loading="lazy"
                onError={(e) => {
                  // Fallback to default image if loading fails
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=500&q=90';
                }}
                onLoad={(e) => {
                  // Add loaded class for smooth transitions
                  e.currentTarget.style.opacity = '1';
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