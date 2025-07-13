import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IngredientSection from './components/IngredientSection';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <HeroSection />
        <IngredientSection />
      </div>
    </AuthProvider>
  );
}

export default App; 