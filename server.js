const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize PostgreSQL pool
const pool = new Pool(); // uses .env for config

// In-memory ingredient storage (fallback)
const ingredients = [];

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

// --- API ROUTES ---

// Add a new ingredient
app.post('/api/ingredients', async (req, res) => {
  const { user_id, name, quantity } = req.body;
  // If user_id is provided, use PostgreSQL
  if (user_id) {
    if (!user_id || !name) {
      return res.status(400).json({ error: 'user_id and name are required' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO ingredients (user_id, name, quantity) VALUES ($1, $2, $3) RETURNING *',
        [user_id, name, quantity]
      );
      res.status(201).json({ success: true, ingredient: result.rows[0] });
    } catch (err) {
      console.error('Error inserting ingredient:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    // Fallback to in-memory storage
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Ingredient name is required and must be a non-empty string.' });
    }
    const ingredient = { id: ingredients.length + 1, name: name.trim(), details: quantity || '' };
    ingredients.push(ingredient);
    res.status(201).json({ success: true, ingredient });
  }
});

// List all ingredients
app.get('/api/ingredients', async (req, res) => {
  const { user_id } = req.query;
  if (user_id) {
    try {
      const result = await pool.query('SELECT * FROM ingredients WHERE user_id = $1', [user_id]);
      res.json({ success: true, ingredients: result.rows });
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.json({ success: true, ingredients });
  }
});

// Delete an ingredient
app.delete('/api/ingredients/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { user_id } = req.query;
  if (user_id) {
    try {
      const result = await pool.query(
        'DELETE FROM ingredients WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, user_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }
      res.json({ success: true, message: 'Ingredient deleted successfully' });
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    const index = ingredients.findIndex(ingredient => ingredient.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    ingredients.splice(index, 1);
    res.json({ success: true, message: 'Ingredient deleted successfully' });
  }
});

// Remove multiple ingredients for a user
app.post('/api/ingredients/remove', async (req, res) => {
  const { user_id, ingredients } = req.body;
  if (!user_id || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'user_id and ingredients array are required' });
  }
  try {
    const result = await pool.query(
      'DELETE FROM ingredients WHERE user_id = $1 AND name = ANY($2::text[])',
      [user_id, ingredients]
    );
    res.json({ success: true, removed: result.rowCount });
  } catch (err) {
    console.error('Error removing ingredients:', err);
    res.status(500).json({ error: 'Failed to remove ingredients' });
  }
});

// Bulk insert ingredients for a user
app.post('/api/ingredients/bulk', async (req, res) => {
  const { user_id, ingredients } = req.body;
  if (!user_id || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'user_id and ingredients array are required' });
  }
  // Validate each ingredient
  for (const ing of ingredients) {
    if (!ing.name || typeof ing.name !== 'string' || !ing.name.trim()) {
      return res.status(400).json({ error: 'Each ingredient must have a non-empty name.' });
    }
  }
  try {
    // Build bulk insert query
    const values = [];
    const params = [];
    let paramIndex = 1;
    for (const ing of ingredients) {
      values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
      params.push(user_id, ing.name.trim(), ing.quantity || 1);
    }
    const query = `INSERT INTO ingredients (user_id, name, quantity) VALUES ${values.join(", ")} RETURNING *`;
    const result = await pool.query(query, params);
    res.status(201).json({ success: true, ingredients: result.rows });
  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add user directly (for admin or testing)
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password and create user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    res.status(201).json({ 
      success: true, 
      user: result.rows[0],
      message: 'User added successfully' 
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
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
    // Build the prompt for dish suggestions
    const prompt = `You are a helpful cooking assistant. Based on the following available ingredients, suggest exactly 3 dishes that can be made using only these ingredients. 

Please format your response exactly like this example:

1. Dish Name
Brief description of the dish
Main ingredients: ingredient1, ingredient2, ingredient3

2. Dish Name
Brief description of the dish  
Main ingredients: ingredient1, ingredient2, ingredient3

3. Dish Name
Brief description of the dish
Main ingredients: ingredient1, ingredient2, ingredient3

Available Ingredients: ${allIngredients.join(', ') || 'None'}

You do not have to use all the ingredients in each dish. Only suggest dishes that can reasonably be made with the provided ingredients. Keep descriptions short and appetizing.`;
    try {
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
      console.error('Gemini API error (generate-plan):', error);
      res.status(500).json({ error: 'Failed to generate meal plan', details: error.message });
    }
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
    try {
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
      console.error('Gemini API error (chat):', error);
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password and create user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    res.status(201).json({ 
      success: true, 
      user: result.rows[0],
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    // Verify password
    const bcrypt = require('bcrypt');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- END API ROUTES ---

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 ThymeSaver server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend and API served from single port`);
}); 