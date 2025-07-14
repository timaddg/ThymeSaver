import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IngredientSection from './components/IngredientSection';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  return (
    <AuthProvider>
      <div className="App">
        <Navbar hideLogo={!!mealPlan} />
        <HeroSection mealPlan={mealPlan} setMealPlan={setMealPlan} />
        <IngredientSection />
      </div>
    </AuthProvider>
  );
}

export default App; 