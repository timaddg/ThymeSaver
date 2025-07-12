const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory ingredient storage
const ingredients = [];

// Add a new ingredient
app.post('/api/ingredients', (req, res) => {
  const { name, details } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Ingredient name is required and must be a non-empty string.' });
  }
  const ingredient = { id: ingredients.length + 1, name: name.trim(), details: details || '' };
  ingredients.push(ingredient);
  res.status(201).json({ success: true, ingredient });
});

// List all ingredients
app.get('/api/ingredients', (req, res) => {
  res.json({ success: true, ingredients });
});

// Delete an ingredient
app.delete('/api/ingredients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ingredients.findIndex(ingredient => ingredient.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Ingredient not found' });
  }
  
  ingredients.splice(index, 1);
  res.json({ success: true, message: 'Ingredient deleted successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ThymeSaver API server is running',
    timestamp: new Date().toISOString()
  });
});

// Generate Meal Plan endpoint
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { 
      dietaryRestrictions = [], 
      cuisinePreferences = [], 
      cookingTime = 'medium', 
      servings = 2,
      ingredients: userIngredients = [],
      skillLevel = 'intermediate'
    } = req.body;

    // Use all stored ingredients if userIngredients is empty
    const allIngredients = userIngredients.length > 0
      ? userIngredients
      : ingredients.map(i => i.name);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Build the prompt for meal planning
    const prompt = `Generate a detailed meal plan with the following requirements:

Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
Cuisine Preferences: ${cuisinePreferences.join(', ') || 'Any'}
Cooking Time: ${cookingTime}
Number of Servings: ${servings}
Available Ingredients: ${allIngredients.join(', ') || 'Any'}
Skill Level: ${skillLevel}

Please provide:
1. 3-5 dish suggestions with names
2. Brief description of each dish
3. Estimated cooking time
4. Difficulty level
5. Key ingredients needed
6. Any special tips or variations

Format the response as a structured meal plan that's easy to read and follow.`;

    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      mealPlan: text,
      parameters: {
        dietaryRestrictions,
        cuisinePreferences,
        cookingTime,
        servings,
        ingredients: allIngredients,
        skillLevel
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Meal Plan Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate meal plan',
      details: error.message 
    });
  }
});

// Gemini AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'gemini-pro' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const geminiModel = genAI.getGenerativeModel({ model: model === 'gemini-pro' ? 'gemini-1.5-flash' : model });
    const result = await geminiModel.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({ 
    message: 'ThymeSaver API Server', 
    status: 'running',
    endpoints: {
      '/api/ingredients': 'GET - List ingredients, POST - Add ingredient, DELETE - Delete ingredient',
      '/api/generate-plan': 'POST - Generate meal plans with Gemini AI',
      '/api/chat': 'POST - Chat with Gemini AI',
      '/api/health': 'GET - Health check'
    },
    note: 'Frontend is served separately on port 3001'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ThymeSaver API server running on http://localhost:${PORT}`);
  console.log(`📝 Frontend should be running on http://localhost:3001`);
}); 