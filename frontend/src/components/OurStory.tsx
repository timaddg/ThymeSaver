import React from 'react';
import './OurStory.css';

const OurStory: React.FC = () => {
  return (
    <div className="our-story-container">
      <div className="our-story-header">
        <h1 className="our-story-title">Our Story</h1>
        <p className="our-story-subtitle">
          How a busy professional's frustration became a solution for everyone
        </p>
      </div>

      <div className="our-story-content">
        <div className="story-section">
          <div className="story-image-section">
            <div className="story-image-placeholder">
              <span className="story-icon">🏠</span>
            </div>
          </div>
          <div className="story-text-section">
            <h2 className="story-section-title">The Problem</h2>
            <p className="story-text">
              As a working professional, I found myself constantly struggling with meal planning. 
              Every evening, I'd open my fridge, stare at random ingredients, and wonder what I could 
              possibly cook. The frustration was real - I had food, but no clear plan. Time was precious, 
              and I couldn't afford to spend 30 minutes every day figuring out what to make for dinner.
            </p>
            <p className="story-text">
              Sound familiar? If you're like me, you've probably experienced that moment of standing 
              in front of an open refrigerator, hoping inspiration would strike. But it rarely did.
            </p>
          </div>
        </div>

        <div className="story-section story-section-reverse">
          <div className="story-text-section">
            <h2 className="story-section-title">The Lightbulb Moment</h2>
            <p className="story-text">
              One particularly frustrating evening, after staring at my groceries for what felt like 
              forever, I had an epiphany. What if there was an app that could look at what I had 
              and tell me exactly what I could cook? No more guessing, no more wasted time, no more 
              staring blankly into the fridge.
            </p>
            <p className="story-text">
              That's when the idea for ThymeSaver was born. A smart assistant that would take my 
              available ingredients and transform them into delicious meal suggestions, complete with 
              step-by-step instructions.
            </p>
          </div>
          <div className="story-image-section">
            <div className="story-image-placeholder">
              <span className="story-icon">💡</span>
            </div>
          </div>
        </div>

        <div className="story-section">
          <div className="story-image-section">
            <div className="story-image-placeholder">
              <span className="story-icon">🤖</span>
            </div>
          </div>
          <div className="story-text-section">
            <h2 className="story-section-title">The Solution</h2>
            <p className="story-text">
              ThymeSaver combines the power of AI with the simplicity of everyday cooking. 
              Simply add your ingredients to your grocery list, and our AI assistant will suggest 
              delicious meals you can make with what you have.
            </p>
            <p className="story-text">
              No more recipe hunting, no more ingredient shopping for one-off dishes, no more 
              food waste. Just smart, personalized meal suggestions that work with your lifestyle 
              and your schedule.
            </p>
          </div>
        </div>

        <div className="story-section story-section-reverse">
          <div className="story-text-section">
            <h2 className="story-section-title">Built for Busy People</h2>
            <p className="story-text">
              I designed ThymeSaver specifically for working professionals like myself - people 
              who value their time and want to eat well without the stress of meal planning. 
              Whether you're a busy parent, a career-focused individual, or just someone who 
              wants to simplify their cooking routine, ThymeSaver is here to help.
            </p>
            <p className="story-text">
              Our mission is simple: make cooking easier, faster, and more enjoyable. Because 
              everyone deserves to eat delicious meals without the hassle.
            </p>
          </div>
          <div className="story-image-section">
            <div className="story-image-placeholder">
              <span className="story-icon">⏰</span>
            </div>
          </div>
        </div>

        <div className="story-cta-section">
          <h2 className="story-cta-title">Ready to Save Time?</h2>
          <p className="story-cta-text">
            Join thousands of busy professionals who have already transformed their cooking experience 
            with ThymeSaver. Start your journey to stress-free meal planning today.
          </p>
          <div className="story-cta-buttons">
            <button 
              className="story-cta-btn primary"
              onClick={() => window.location.href = '/'}
            >
              Start Cooking Smarter
            </button>
            <button 
              className="story-cta-btn secondary"
              onClick={() => window.location.href = '/grocery'}
            >
              Add Your Ingredients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory; 