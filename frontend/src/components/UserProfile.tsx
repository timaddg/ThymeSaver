import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

interface UserStats {
  totalDishesCooked: number;
  favoriteCuisine: string;
  totalIngredients: number;
  memberSince: string;
  lastActive: string;
}

interface DietaryRestriction {
  id: string;
  name: string;
  icon: string;
  category: 'allergy' | 'diet' | 'preference';
}

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'stats'>('profile');
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>([]);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Comprehensive dietary restrictions list
  const dietaryRestrictions: DietaryRestriction[] = [
    // Allergies
    { id: 'gluten', name: 'Gluten Allergy/Celiac', icon: '🌾', category: 'allergy' },
    { id: 'nuts', name: 'Nut Allergy', icon: '🥜', category: 'allergy' },
    { id: 'shellfish', name: 'Shellfish Allergy', icon: '🦐', category: 'allergy' },
    { id: 'soy', name: 'Soy Allergy', icon: '🫘', category: 'allergy' },
    { id: 'dairy', name: 'Dairy/Lactose Intolerance', icon: '🥛', category: 'allergy' },
    { id: 'eggs', name: 'Egg Allergy', icon: '🥚', category: 'allergy' },
    { id: 'fish', name: 'Fish Allergy', icon: '🐟', category: 'allergy' },
    { id: 'sesame', name: 'Sesame Allergy', icon: '🌰', category: 'allergy' },
    
    // Dietary preferences
    { id: 'vegetarian', name: 'Vegetarian', icon: '🌱', category: 'diet' },
    { id: 'vegan', name: 'Vegan', icon: '🥬', category: 'diet' },
    { id: 'keto', name: 'Ketogenic', icon: '🥩', category: 'diet' },
    { id: 'paleo', name: 'Paleo', icon: '🦴', category: 'diet' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🫒', category: 'diet' },
    { id: 'lowcarb', name: 'Low Carb', icon: '🥒', category: 'diet' },
    
    // Other preferences
    { id: 'halal', name: 'Halal', icon: '☪️', category: 'preference' },
    { id: 'kosher', name: 'Kosher', icon: '✡️', category: 'preference' },
    { id: 'lowsodium', name: 'Low Sodium', icon: '🧂', category: 'preference' },
    { id: 'diabetic', name: 'Diabetic Friendly', icon: '💉', category: 'preference' }
  ];

  useEffect(() => {
    if (user) {
      fetchUserStats();
      loadDietaryPreferences();
    }
  }, [user]);

  const loadDietaryPreferences = async () => {
    if (!user) return;
    
    try {
      // For now, load from localStorage. In production, this would be from your API
      const savedPreferences = localStorage.getItem(`dietary_preferences_${user.id}`);
      if (savedPreferences) {
        setSelectedDietaryRestrictions(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading dietary preferences:', error);
    }
  };

  const saveDietaryPreferences = async () => {
    if (!user) return;
    
    try {
      setIsSavingPreferences(true);
      // For now, save to localStorage. In production, this would be sent to your API
      localStorage.setItem(`dietary_preferences_${user.id}`, JSON.stringify(selectedDietaryRestrictions));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success feedback (you could add a toast notification here)
      console.log('Dietary preferences saved successfully');
    } catch (error) {
      console.error('Error saving dietary preferences:', error);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const toggleDietaryRestriction = (restrictionId: string) => {
    setSelectedDietaryRestrictions(prev => {
      if (prev.includes(restrictionId)) {
        return prev.filter(id => id !== restrictionId);
      } else {
        return [...prev, restrictionId];
      }
    });
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Fetch user statistics from the API
      const [dishHistoryRes, ingredientsRes] = await Promise.all([
        fetch(`/api/dish-history?user_id=${user.id}`),
        fetch(`/api/ingredients?user_id=${user.id}`)
      ]);

      const dishHistoryData = await dishHistoryRes.json();
      const ingredientsData = await ingredientsRes.json();

      // Calculate user statistics
      const totalDishesCooked = dishHistoryData.success ? dishHistoryData.dishes.length : 0;
      const totalIngredients = ingredientsData.success ? ingredientsData.ingredients.length : 0;
      
      // Analyze favorite cuisine from dish history
      const favoriteCuisine = analyzeFavoriteCuisine(dishHistoryData.dishes || []);
      
      // Get member since date (for now, using a placeholder)
      const memberSince = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const lastActive = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      setStats({
        totalDishesCooked,
        favoriteCuisine,
        totalIngredients,
        memberSince,
        lastActive
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFavoriteCuisine = (dishes: any[]): string => {
    if (!dishes || dishes.length === 0) return 'No dishes cooked yet';

    const cuisineCounts: { [key: string]: number } = {};
    
    dishes.forEach(dish => {
      const text = `${dish.dish_name} ${dish.description}`.toLowerCase();
      
      if (text.includes('pasta') || text.includes('italian')) cuisineCounts['Italian'] = (cuisineCounts['Italian'] || 0) + 1;
      if (text.includes('taco') || text.includes('mexican')) cuisineCounts['Mexican'] = (cuisineCounts['Mexican'] || 0) + 1;
      if (text.includes('curry') || text.includes('asian')) cuisineCounts['Asian'] = (cuisineCounts['Asian'] || 0) + 1;
      if (text.includes('salad') || text.includes('mediterranean')) cuisineCounts['Mediterranean'] = (cuisineCounts['Mediterranean'] || 0) + 1;
      if (text.includes('burger') || text.includes('american')) cuisineCounts['American'] = (cuisineCounts['American'] || 0) + 1;
    });

    const favorite = Object.entries(cuisineCounts).sort(([,a], [,b]) => b - a)[0];
    return favorite ? favorite[0] : 'Varied';
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-profile-header">
          <h2 className="user-profile-title">User Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="user-profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        <div className="user-profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="user-avatar">
                <div className="avatar-circle">
                  <span className="avatar-text">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              
              <div className="user-info">
                <div className="info-group">
                  <label className="info-label">Username</label>
                  <p className="info-value">{user.username}</p>
                </div>
                
                <div className="info-group">
                  <label className="info-label">Email</label>
                  <p className="info-value">{user.email}</p>
                </div>
                
                <div className="info-group">
                  <label className="info-label">Member Since</label>
                  <p className="info-value">{stats?.memberSince || 'Recently'}</p>
                </div>
                
                <div className="info-group">
                  <label className="info-label">Last Active</label>
                  <p className="info-value">{stats?.lastActive || 'Now'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-tab">
              {loading ? (
                <div className="loading-stats">
                  <div className="loading-spinner"></div>
                  <p>Loading your statistics...</p>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🍳</div>
                    <div className="stat-content">
                      <h3 className="stat-number">{stats?.totalDishesCooked || 0}</h3>
                      <p className="stat-label">Dishes Cooked</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">🥘</div>
                    <div className="stat-content">
                      <h3 className="stat-number">{stats?.favoriteCuisine || 'None'}</h3>
                      <p className="stat-label">Favorite Cuisine</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">🥬</div>
                    <div className="stat-content">
                      <h3 className="stat-number">{stats?.totalIngredients || 0}</h3>
                      <p className="stat-label">Ingredients Used</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <h3 className="stat-number">Beginner</h3>
                      <p className="stat-label">Cooking Level</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="preferences-section">
                <h3 className="preferences-title">Dietary Restrictions & Allergies</h3>
                <p className="preferences-subtitle">Select all that apply to help us personalize your meal recommendations</p>
                
                <div className="dietary-categories">
                  <div className="category-section">
                    <h4 className="category-title">🚨 Allergies & Intolerances</h4>
                    <div className="dietary-grid">
                      {dietaryRestrictions
                        .filter(restriction => restriction.category === 'allergy')
                        .map(restriction => (
                          <div 
                            key={restriction.id}
                            className={`dietary-item ${selectedDietaryRestrictions.includes(restriction.id) ? 'selected' : ''}`}
                            onClick={() => toggleDietaryRestriction(restriction.id)}
                          >
                            <span className="dietary-icon">{restriction.icon}</span>
                            <span className="dietary-name">{restriction.name}</span>
                            <div className="dietary-checkbox">
                              {selectedDietaryRestrictions.includes(restriction.id) && '✓'}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <div className="category-section">
                    <h4 className="category-title">🌱 Dietary Preferences</h4>
                    <div className="dietary-grid">
                      {dietaryRestrictions
                        .filter(restriction => restriction.category === 'diet')
                        .map(restriction => (
                          <div 
                            key={restriction.id}
                            className={`dietary-item ${selectedDietaryRestrictions.includes(restriction.id) ? 'selected' : ''}`}
                            onClick={() => toggleDietaryRestriction(restriction.id)}
                          >
                            <span className="dietary-icon">{restriction.icon}</span>
                            <span className="dietary-name">{restriction.name}</span>
                            <div className="dietary-checkbox">
                              {selectedDietaryRestrictions.includes(restriction.id) && '✓'}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <div className="category-section">
                    <h4 className="category-title">🍽️ Other Preferences</h4>
                    <div className="dietary-grid">
                      {dietaryRestrictions
                        .filter(restriction => restriction.category === 'preference')
                        .map(restriction => (
                          <div 
                            key={restriction.id}
                            className={`dietary-item ${selectedDietaryRestrictions.includes(restriction.id) ? 'selected' : ''}`}
                            onClick={() => toggleDietaryRestriction(restriction.id)}
                          >
                            <span className="dietary-icon">{restriction.icon}</span>
                            <span className="dietary-name">{restriction.name}</span>
                            <div className="dietary-checkbox">
                              {selectedDietaryRestrictions.includes(restriction.id) && '✓'}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="preferences-actions">
                  <button 
                    className="save-preferences-btn"
                    onClick={saveDietaryPreferences}
                    disabled={isSavingPreferences}
                  >
                    {isSavingPreferences ? (
                      <>
                        <div className="saving-spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17,21 17,13 7,13 7,21"></polyline>
                          <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        Save Preferences
                      </>
                    )}
                  </button>
                  
                  {selectedDietaryRestrictions.length > 0 && (
                    <p className="selection-summary">
                      {selectedDietaryRestrictions.length} restriction{selectedDietaryRestrictions.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
