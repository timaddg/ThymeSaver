import React, { useState, useEffect } from 'react';
import { Ingredient } from './types';
import { ingredientApi } from './services/api';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load ingredients on component mount
  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientApi.getAll();
      setIngredients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load ingredients');
      console.error('Error loading ingredients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIngredient.name.trim()) {
      setError('Please enter an ingredient name');
      return;
    }

    try {
      setLoading(true);
      const addedIngredient = await ingredientApi.add({
        name: newIngredient.name.trim(),
        details: newIngredient.details.trim() || undefined,
      });
      
      setIngredients(prev => [...prev, addedIngredient]);
      setNewIngredient({ name: '', details: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add ingredient');
      console.error('Error adding ingredient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this item?')) {
      return;
    }

    try {
      setLoading(true);
      await ingredientApi.delete(id);
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete ingredient');
      console.error('Error deleting ingredient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient(e);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🌿 ThymeSaver</h1>
          <p>Manage your grocery list and plan your meals</p>
        </div>
        
        <div className="content">
          <div className="form-section">
            <h2>Add to Grocery List</h2>
            <form onSubmit={handleAddIngredient}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter ingredient name (e.g., tomatoes, chicken breast)"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  maxLength={100}
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Optional details (e.g., organic, 2 lbs)"
                  value={newIngredient.details}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, details: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  maxLength={200}
                  disabled={loading}
                />
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="stats">
            <div className="stat">
              <div className="stat-number">{ingredients.length}</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat">
              <div className="stat-number">1</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Your Grocery List</h2>
            <div className="ingredients-list">
              {loading && ingredients.length === 0 ? (
                <div className="empty-state">
                  <p>Loading...</p>
                </div>
              ) : ingredients.length === 0 ? (
                <div className="empty-state">
                  <p>Your grocery list is empty</p>
                  <p>Start adding ingredients above!</p>
                </div>
              ) : (
                ingredients.map(ingredient => (
                  <div key={ingredient.id} className="ingredient-item">
                    <div className="ingredient-info">
                      <div className="ingredient-name">{ingredient.name}</div>
                      {ingredient.details && (
                        <div className="ingredient-details">{ingredient.details}</div>
                      )}
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
