# ThymeSaver Server

A Node.js Express server with Google Gemini AI integration for intelligent time management and productivity features.

## Features

- 🚀 **Express.js Server** - Fast and lightweight web framework
- 🤖 **Gemini AI Integration** - Powered by Google's Generative AI
- 🔒 **Environment Configuration** - Secure API key management
- 📡 **RESTful API** - Clean and intuitive endpoints
- 🔄 **CORS Support** - Cross-origin resource sharing enabled
- 🛠️ **Development Tools** - Hot reload with nodemon

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Get a Gemini API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in your .env file).

## API Endpoints

### Health Check
```http
GET /api/health
```
Returns server status and timestamp.

### Generate Meal Plan
```http
POST /api/generate-plan
Content-Type: application/json

{
  "dietaryRestrictions": ["vegetarian", "gluten-free"],
  "cuisinePreferences": ["italian", "mediterranean"],
  "cookingTime": "quick",  // quick, medium, slow
  "servings": 2,
  "ingredients": ["pasta", "tomatoes", "olive oil"],
  "skillLevel": "beginner"  // beginner, intermediate, advanced
}
```

**Response:**
```json
{
  "success": true,
  "mealPlan": "Detailed meal plan with dish suggestions...",
  "parameters": {
    "dietaryRestrictions": ["vegetarian"],
    "cuisinePreferences": ["italian"],
    "cookingTime": "quick",
    "servings": 2,
    "ingredients": ["pasta", "tomatoes"],
    "skillLevel": "beginner"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Chat with Gemini AI
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Your message here",
  "model": "gemini-pro"  // optional, defaults to gemini-pro
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI generated response",
  "model": "gemini-pro",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Server Info
```http
GET /
```
Returns server information and available endpoints.

## Example Usage

### Using curl
```bash
# Health check
curl http://localhost:3000/api/health

# Generate meal plan
curl -X POST http://localhost:3000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "dietaryRestrictions": ["vegetarian"],
    "cuisinePreferences": ["italian"],
    "cookingTime": "quick",
    "servings": 2,
    "ingredients": ["pasta", "tomatoes", "olive oil"]
  }'

# Chat with Gemini
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me with time management?"}'
```

### Using JavaScript/Fetch
```javascript
// Generate meal plan
const mealPlanResponse = await fetch('http://localhost:3000/api/generate-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    dietaryRestrictions: ['vegetarian'],
    cuisinePreferences: ['italian', 'mediterranean'],
    cookingTime: 'quick',
    servings: 2,
    ingredients: ['pasta', 'tomatoes', 'olive oil'],
    skillLevel: 'beginner'
  })
});

const mealPlanData = await mealPlanResponse.json();
console.log(mealPlanData.mealPlan);

// Chat with Gemini
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Help me create a daily schedule',
    model: 'gemini-pro'
  })
});

const data = await response.json();
console.log(data.response);
```

## Project Structure

```
ThymeSaver/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── env.example        # Environment variables template
├── .env              # Your environment variables (create this)
└── README.md         # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `NODE_ENV` | Environment mode | `development` |

## Error Handling

The server includes comprehensive error handling:
- Missing API key validation
- Invalid request format
- Gemini API errors
- 404 for unknown endpoints
- General error middleware

## Security Notes

- Never commit your `.env` file to version control
- Keep your Gemini API key secure
- Consider rate limiting for production use
- Validate and sanitize all inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License 