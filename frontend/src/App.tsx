import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IngredientSection from './components/IngredientSection';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <IngredientSection />
    </div>
  );
}

export default App;
