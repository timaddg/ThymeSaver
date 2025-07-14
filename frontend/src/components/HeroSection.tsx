import React, { useState } from 'react';
import './HeroSection.css';
import heroImg from '../assets/hero-bowl.jpg'; // You should add a food image to this path

interface HeroSectionProps {
  mealPlan: string | null;
  setMealPlan: (plan: string | null) => void;
}

const USER_ID = 1; // Replace with actual user id from auth/session if available

function parseDishes(response: string) {
  // Simple parser: expects each dish to start with a number or bullet
  // and main ingredients to be listed after 'Main ingredients:' or similar
  const dishRegex = /\d+\.\s*([^\n]+)\n([^\n]+)\n-?\s*Main ingredients?:?\s*([^\n]+)/gi;
  const matches = Array.from(response.matchAll(dishRegex));
  if (matches.length === 0) return null;
  return matches.map((m) => ({
    name: m[1].trim(),
    description: m[2].trim(),
    ingredients: m[3].split(',').map((i) => i.trim()),
  }));
}

const HeroSection: React.FC<HeroSectionProps> = ({ mealPlan, setMealPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleAskGemini = async () => {
    setLoading(true);
    setError(null);
    setMealPlan(null);
    setSelectedDish(null);
    try {
      // 1. Fetch ingredients for the user
      const ingRes = await fetch(`/api/ingredients?user_id=${USER_ID}`);
      const ingData = await ingRes.json();
      if (!ingData.success) throw new Error('Failed to fetch ingredients');
      const ingredients = ingData.ingredients.map((i: any) => i.name);

      // 2. Send to Gemini meal plan endpoint
      const planRes = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
      const planData = await planRes.json();
      if (!planData.success) throw new Error(planData.error || 'Failed to generate meal plan');
      setMealPlan(planData.mealPlan);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCookThis = async (idx: number, dish: any) => {
    setSelectedDish(idx);
    setConfirmation(null);
    try {
      const res = await fetch('/api/ingredients/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: USER_ID, ingredients: dish.ingredients }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmation('Grocery items updated');
        // Optionally, you could refresh the ingredient list here
      } else {
        setConfirmation('Failed to update grocery items');
      }
    } catch (err) {
      setConfirmation('Failed to update grocery items');
    }
  };

  let dishes = mealPlan ? parseDishes(mealPlan.replace(/\*\*/g, '')) : null;

  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-title">What would you like to cook Today ?</h1>
        <p className="hero-subtitle">
          Ask AI to simplify your cooking today
        </p>
        <div className="hero-cta">
          <button className="hero-btn-primary" onClick={handleAskGemini} disabled={loading}>
            {loading ? 'Asking Gemini...' : 'Ask Gemini'}
          </button>
        </div>
        {error && <div style={{ color: '#dc3545', marginTop: 16 }}>{error}</div>}
        {mealPlan && (
          <div className="gemini-response-card">
            <div className="gemini-response-header">
              <span className="gemini-response-title">Gemini Suggestions</span>
              <span className="gemini-response-date">{new Date().toLocaleString()}</span>
            </div>
            <div className="gemini-response-body">
              {confirmation && (
                <div className="grocery-confirmation">{confirmation}</div>
              )}
              {dishes ? (
                <div className="dish-cards-container">
                  {dishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className={`dish-card${selectedDish === idx ? ' selected' : ''}`}
                    >
                      <div className="dish-card-title">{dish.name}</div>
                      <div className="dish-card-desc">{dish.description}</div>
                      <div className="dish-card-ingredients">
                        <span>Main ingredients:</span> {dish.ingredients.join(', ')}
                      </div>
                      <button
                        className="cook-this-btn"
                        onClick={() => handleCookThis(idx, dish)}
                        disabled={selectedDish !== null && selectedDish !== idx}
                      >
                        {selectedDish === idx ? 'Selected' : 'Cook This'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                mealPlan.replace(/\*\*/g, '')
              )}
            </div>
            <div className="gemini-response-footer">
              <a href="#" className="gemini-response-link">View Details</a>
            </div>
          </div>
        )}
      </div>
      <div className="hero-right">
        <img src={heroImg} alt="Healthy Bowl" className="hero-img" />
      </div>
    </section>
  );
};

export default HeroSection; 