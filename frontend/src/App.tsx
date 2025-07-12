import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RecipeGrid from './components/RecipeGrid';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <RecipeGrid />
    </div>
  );
}

export default App;
