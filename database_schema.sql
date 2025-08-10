-- ThymeSaver Database Schema
-- Run this script to create the necessary tables

-- Create user_dietary_preferences table
CREATE TABLE IF NOT EXISTS user_dietary_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    restriction_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, restriction_type)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_dietary_preferences_user_id ON user_dietary_preferences(user_id);

-- Add comment to table
COMMENT ON TABLE user_dietary_preferences IS 'Stores user dietary restrictions and preferences';

-- Add comments to columns
COMMENT ON COLUMN user_dietary_preferences.user_id IS 'Reference to users table';
COMMENT ON COLUMN user_dietary_preferences.restriction_type IS 'Type of dietary restriction (e.g., gluten, nuts, vegetarian)';
COMMENT ON COLUMN user_dietary_preferences.created_at IS 'When the preference was first added';
COMMENT ON COLUMN user_dietary_preferences.updated_at IS 'When the preference was last updated';
