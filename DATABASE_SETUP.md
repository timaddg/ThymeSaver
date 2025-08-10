# Database Setup for ThymeSaver

This guide will help you set up the database for storing user dietary restrictions and preferences.

## Prerequisites

- PostgreSQL database server running
- Access to create tables and indexes
- Environment variables configured (see `.env` file)

## Database Setup

### 1. Create the Dietary Preferences Table

Run the following SQL script in your PostgreSQL database:

```sql
-- Run the contents of database_schema.sql
-- Or execute these commands directly:

CREATE TABLE IF NOT EXISTS user_dietary_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    restriction_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, restriction_type)
);

CREATE INDEX IF NOT EXISTS idx_user_dietary_preferences_user_id ON user_dietary_preferences(user_id);
```

### 2. Verify Table Creation

```sql
-- Check if table was created
\d user_dietary_preferences

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_dietary_preferences';
```

### 3. Test the API Endpoints

After starting your server, you can test the new endpoints:

#### Save Dietary Preferences
```bash
curl -X POST http://localhost:3000/api/dietary-preferences \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "dietary_restrictions": ["gluten", "nuts", "vegetarian"]
  }'
```

#### Get Dietary Preferences
```bash
curl http://localhost:3000/api/dietary-preferences/1
```

## Environment Variables

Make sure your `.env` file contains:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thymesaver
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

## Features

The dietary restrictions system supports:

- **Allergies**: Gluten, Nuts, Shellfish, Soy, Dairy, Eggs, Fish, Sesame
- **Dietary Preferences**: Vegetarian, Vegan, Keto, Paleo, Mediterranean, Low Carb
- **Other Preferences**: Halal, Kosher, Low Sodium, Diabetic Friendly

## Data Flow

1. User selects dietary restrictions in the frontend
2. Frontend sends data to `/api/dietary-preferences` endpoint
3. Backend stores preferences in `user_dietary_preferences` table
4. Preferences are loaded when user opens profile
5. Data can be used for meal planning and recipe filtering

## Troubleshooting

### Common Issues

1. **Table already exists**: The `IF NOT EXISTS` clause will prevent errors
2. **Foreign key constraint**: Ensure the `users` table exists first
3. **Permission errors**: Check database user permissions
4. **Connection issues**: Verify database connection settings in `.env`

### Testing

```sql
-- Insert test data
INSERT INTO user_dietary_preferences (user_id, restriction_type) 
VALUES (1, 'gluten'), (1, 'vegetarian');

-- Query test data
SELECT * FROM user_dietary_preferences WHERE user_id = 1;
```

## Next Steps

After setting up the database:

1. Restart your Node.js server
2. Test the dietary preferences in the user profile
3. Verify data is being saved and loaded correctly
4. Consider adding dietary restrictions to meal planning algorithms
