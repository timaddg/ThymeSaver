import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './HeroSection.css';
import heroImg from '../assets/hero-bowl.jpg'; // You should add a food image to this path
import DishSection from './DishSection';

interface HeroSectionProps {
  mealPlan: string | null;
  setMealPlan: (plan: string | null) => void;
}

function parseDishes(response: string) {
  console.log('Raw Gemini response:', response); // Debug log

  // Try multiple parsing strategies
  let dishes = null;

  // Strategy 1: New structured format pattern with instructions
  const dishRegex = /\d+\.\s*([^\n]+)\n([^\n]+)\nMain ingredients:\s*([^\n]+)\nInstructions:\n((?:\d+\. .+\n?)+)/gi;
  let matches = Array.from(response.matchAll(dishRegex));

  if (matches.length > 0) {
    dishes = matches.map((m) => ({
      name: m[1].trim(),
      description: m[2].trim(),
      ingredients: m[3].split(',').map((i) => i.trim()),
      instructions: m[4]
        .split(/\n/)
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, '').trim()),
    }));
  } else {
    // Strategy 2: Split by lines and look for dish patterns
    const lines = response.split('\n').filter(line => line.trim());
    const dishLines = lines.filter(line => /^\d+\./.test(line));

    if (dishLines.length > 0) {
      dishes = dishLines.slice(0, 3).map((line, idx) => {
        const name = line.replace(/^\d+\.\s*/, '').trim();
        return {
          name: name || `Dish ${idx + 1}`,
          description: 'A delicious dish made with available ingredients',
          ingredients: [],
          instructions: [],
        };
      });
    }
  }

  console.log('Parsed dishes:', dishes); // Debug log
  return dishes;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mealPlan, setMealPlan }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleAskGemini = async () => {
    if (!user) {
      setError('Please log in to generate meal plans');
      return;
    }

    setLoading(true);
    setError(null);
    setMealPlan(null);
    setSelectedDish(null);
    try {
      // 1. Fetch ingredients for the user
      const ingRes = await fetch(`/api/ingredients?user_id=${user.id}`);
      const ingData = await ingRes.json();
      if (!ingData.success) throw new Error('Failed to fetch ingredients');
      const ingredients = ingData.ingredients.map((i: any) => i.name);

      if (ingredients.length === 0) {
        setError('No ingredients found. Please add some ingredients to your grocery list first.');
        return;
      }

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
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    setSelectedDish(idx);
    setConfirmation(null);
    try {
      const res = await fetch('/api/ingredients/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ingredients: dish.ingredients }),
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
    <section className="hero-section hero-redesign">
      <div className="hero-bg-image" />
      <div className="hero-content">
        <h1 className="hero-title">Cooking choices made easy</h1>
        <button 
          className="hero-cta-btn" 
          onClick={handleAskGemini}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Ask Gemini'}
        </button>
        {error && <div className="hero-error">{error}</div>}
        {loading && <div className="hero-loading">Generating your meal plan...</div>}
        
        {/* Display generated meal plan */}
        {dishes && dishes.length > 0 && (
          <DishSection
            dishes={dishes}
            onCookThis={handleCookThis}
            selectedDish={selectedDish}
            confirmation={confirmation}
          />
        )}
        
        {/* Display raw meal plan if parsing failed */}
        {mealPlan && (!dishes || dishes.length === 0) && (
          <div className="meal-plan-raw">
            <h2 className="meal-plan-title">Your Meal Plan</h2>
            <pre className="meal-plan-text">{mealPlan}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection; 