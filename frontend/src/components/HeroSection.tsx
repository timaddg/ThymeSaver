import React from 'react';
import './HeroSection.css';
import heroImg from '../assets/hero-bowl.jpg'; // You should add a food image to this path

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-title">Ask me about your next meal</h1>
        <p className="hero-subtitle">
          Lets find a meal for you to cook
        </p>
        <form className="hero-search">
          <input type="text" placeholder="Searching an inspiration..." />
          <button type="submit">Search</button>
        </form>
        <div className="hero-tags">
          <span>#MealPlans</span>
          <span>#HealthyLiving</span>
          <span>#FreshFood</span>
        </div>
      </div>
      <div className="hero-right">
        <img src={heroImg} alt="Healthy Bowl" className="hero-img" />
      </div>
    </section>
  );
};

export default HeroSection; 