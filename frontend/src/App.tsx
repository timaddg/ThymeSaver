import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IngredientSection from './components/IngredientSection';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroceryPage from './components/GroceryPage';
import './App.css';

function App() {
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/grocery" element={<GroceryPage />} />
            <Route path="/" element={
              <>
                <HeroSection mealPlan={mealPlan} setMealPlan={setMealPlan} />
                <IngredientSection />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 