import React from 'react';
import './RecipeGrid.css';
import bowl1 from '../assets/hero-bowl.jpg'; // Placeholder image, use the same as hero for now

const recipes = [
  {
    id: 1,
    title: 'Fresh Veggie Bowl',
    img: bowl1,
    tag: 'New',
  },
  {
    id: 2,
    title: 'Protein Power Salad',
    img: bowl1,
    tag: 'Hot',
  },
  {
    id: 3,
    title: 'Classic Oats',
    img: bowl1,
    tag: 'Vegan',
  },
  {
    id: 4,
    title: 'Chickpea Curry',
    img: bowl1,
    tag: 'Popular',
  },
];

const RecipeGrid: React.FC = () => {
  return (
    <section className="recipe-section">
      <h2 className="recipe-section-title">Cups et proricIes</h2>
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <div className="recipe-card" key={recipe.id}>
            <div className="recipe-img-wrap">
              <img src={recipe.img} alt={recipe.title} className="recipe-img" />
              <span className="recipe-tag">{recipe.tag}</span>
            </div>
            <div className="recipe-title">{recipe.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipeGrid; 