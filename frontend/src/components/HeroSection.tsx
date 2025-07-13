import React, { useState } from 'react';
import './HeroSection.css';
import heroImg from '../assets/hero-bowl.jpg'; // You should add a food image to this path

const USER_ID = 1; // Replace with actual user id from auth/session if available

const HeroSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);

  const handleAskGemini = async () => {
    setLoading(true);
    setError(null);
    setMealPlan(null);
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
          <div style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: '1.5rem',
            marginTop: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            whiteSpace: 'pre-line',
            fontSize: '1.08rem',
            color: '#222',
            maxWidth: 520
          }}>
            {mealPlan}
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