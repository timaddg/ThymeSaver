import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './HeroSection.css';
import DishSection from './DishSection';

// Proper TypeScript interfaces
interface Dish {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

interface HeroSectionProps {
  mealPlan: string | null;
  setMealPlan: (plan: string | null) => void;
}

function parseDishes(response: string): Dish[] {
  console.log('Raw Gemini response:', response); // Debug log

  // Try multiple parsing strategies
  let dishes: Dish[] | null = null;

  // Strategy 1: Improved pattern that better captures the Gemini response format
  const dishRegex = /\d+\.\s*([^\n]+)\n([^\n]+)\nMain ingredients:\s*([^\n]+)(?:\nDietary compliance:\s*([^\n]+))?\nInstructions:\n((?:\d+\. .+\n?)+)/gi;
  let matches = Array.from(response.matchAll(dishRegex));

  if (matches.length > 0) {
    dishes = matches.map((m) => ({
      name: m[1].trim(),
      description: m[2].trim(),
      ingredients: m[3].split(',').map((i) => i.trim()),
      instructions: m[5] ? m[5]
        .split(/\n/)
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, '').trim()) : [],
    }));
  } else {
    // Strategy 2: More flexible parsing for different formats
    const lines = response.split('\n').filter(line => line.trim());
    const dishBlocks = [];
    let currentBlock: Dish | null = null;
    let inInstructions = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (/^\d+\./.test(line)) {
        // New dish block
        if (currentBlock) {
          dishBlocks.push(currentBlock);
        }
        currentBlock = {
          name: line.replace(/^\d+\.\s*/, '').trim(),
          description: '',
          ingredients: [],
          instructions: []
        };
        inInstructions = false;
      } else if (currentBlock) {
        if (!currentBlock.description && line.trim() && !line.includes('Main ingredients:') && !line.includes('Instructions:') && !line.includes('Dietary compliance:')) {
          // First non-empty line after dish name is description
          currentBlock.description = line.trim();
        } else if (line.includes('Main ingredients:')) {
          // Extract ingredients
          const ingredientsText = line.replace('Main ingredients:', '').trim();
          currentBlock.ingredients = ingredientsText.split(',').map(i => i.trim());
        } else if (line.includes('Instructions:')) {
          // Start collecting instructions
          inInstructions = true;
        } else if (inInstructions && /^\d+\./.test(line)) {
          // This is an instruction step
          currentBlock.instructions.push(line.replace(/^\d+\.\s*/, '').trim());
        }
      }
    }
    
    if (currentBlock) {
      dishBlocks.push(currentBlock);
    }
    
    if (dishBlocks.length > 0) {
      dishes = dishBlocks.slice(0, 3).map((block, idx) => ({
        name: block.name || `Dish ${idx + 1}`,
        description: block.description || 'A delicious dish made with available ingredients',
        ingredients: block.ingredients || [],
        instructions: block.instructions || [],
      }));
    }
  }

  // Strategy 3: Fallback parsing for simpler formats
  if (!dishes || dishes.length === 0) {
    const sections = response.split(/\d+\./).filter(section => section.trim());
    dishes = sections.slice(0, 3).map((section, idx) => {
      const lines = section.split('\n').filter(line => line.trim());
      const name = lines[0]?.trim() || `Dish ${idx + 1}`;
      const description = lines[1]?.trim() || 'A delicious dish made with available ingredients';
      
      // Look for ingredients and instructions in the section
      let ingredients: string[] = [];
      let instructions: string[] = [];
      
      for (const line of lines) {
        if (line.includes('Main ingredients:')) {
          ingredients = line.replace('Main ingredients:', '').trim().split(',').map(i => i.trim());
        } else if (line.includes('Instructions:')) {
          // Find all numbered instruction lines after this
          const instructionLines = lines.slice(lines.indexOf(line) + 1);
          instructions = instructionLines
            .filter(l => /^\d+\./.test(l))
            .map(l => l.replace(/^\d+\.\s*/, '').trim());
          break;
        }
      }
      
      return {
        name,
        description,
        ingredients,
        instructions
      };
    });
  }

  console.log('Parsed dishes:', dishes); // Debug log
  return dishes;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mealPlan, setMealPlan }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [hasIngredients, setHasIngredients] = useState<boolean | null>(null);

  const handleAskGemini = async () => {
    if (!user) {
      setError('Please log in to generate meal plans');
      return;
    }

    setError(null);
    setMealPlan(null);
    setSelectedDish(null);
    
    try {
      // 1. Fetch ingredients for the user first
      const ingRes = await fetch(`/api/ingredients?user_id=${user.id}`);
      const ingData = await ingRes.json();
      if (!ingData.success) throw new Error('Failed to fetch ingredients');
      const ingredients = ingData.ingredients.map((i: any) => i.name);

      if (ingredients.length === 0) {
        setHasIngredients(false);
        setError('No ingredients found. Please add some ingredients to your grocery list first.');
        return;
      }

      setHasIngredients(true);
      // Only set loading to true if we have ingredients to work with
      setLoading(true);

      // 2. Send to Gemini meal plan endpoint
      const planRes = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients,
          user_id: user.id  // Include user_id to fetch dietary preferences
        }),
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
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    setSelectedDish(idx);
    setConfirmation(null);
    try {
      // Save dish to history first
      const historyRes = await fetch('/api/dish-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          dish_name: dish.name,
          description: dish.description,
          ingredients: dish.ingredients,
          instructions: dish.instructions
        }),
      });
      
      if (!historyRes.ok) {
        console.error('Failed to save dish to history');
      }

      // Then remove ingredients from grocery list
      const res = await fetch('/api/ingredients/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ingredients: dish.ingredients }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmation('Dish saved to history and grocery items updated!');
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
        <button 
          className="hero-cta-btn" 
          onClick={handleAskGemini}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Ask Gemini'}
        </button>
        {error && <div className="hero-error">{error}</div>}
        {loading && <div className="hero-loading">Generating your meal plan...</div>}
        
        {/* Display "Time to stock up" when no ingredients */}
        {hasIngredients === false && (
          <div className="stock-up-section">
            <h2 className="stock-up-title">Time to stock up</h2>
            <p className="stock-up-message">
              Add some ingredients to your grocery list to get personalized meal suggestions.
            </p>
            <button 
              className="stock-up-btn"
              onClick={() => window.location.href = '/grocery'}
            >
              Go to Grocery List
            </button>
          </div>
        )}
        
        {/* Display generated meal plan */}
        {dishes && dishes.length > 0 && (
          <DishSection
            dishes={dishes}
            onCookThis={handleCookThis}
            selectedDish={selectedDish}
            confirmation={confirmation}
          />
        )}
        
        {/* Display raw meal plan if parsing failed */}
        {mealPlan && (!dishes || dishes.length === 0) && (
          <div className="meal-plan-raw">
            <h2 className="meal-plan-title">Your Meal Plan</h2>
            <pre className="meal-plan-text">{mealPlan}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection; 