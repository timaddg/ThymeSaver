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
    <section className="hero-section hero-redesign">
      <div className="hero-bg-image" />
      <div className="hero-content">
        <h1 className="hero-title">Cooking choices made easy</h1>
        <button className="hero-cta-btn">Ask Gemini</button>
      </div>
    </section>
  );
};

export default HeroSection; 