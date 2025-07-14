import React from 'react';
import './HeroSection.css';
import heroImg from '../assets/hero-bowl.jpg'; // You should add a food image to this path

interface HeroSectionProps {
  mealPlan: string | null;
  setMealPlan: (plan: string | null) => void;
}

const USER_ID = 1; // Replace with actual user id from auth/session if available

const HeroSection: React.FC<HeroSectionProps> = ({ mealPlan, setMealPlan }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
          <div className="gemini-response-card">
            <div className="gemini-response-header">
              <span className="gemini-response-title">Gemini Suggestions</span>
              <span className="gemini-response-date">{new Date().toLocaleString()}</span>
            </div>
            <div className="gemini-response-body">
              {mealPlan.replace(/\*\*/g, '')}
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