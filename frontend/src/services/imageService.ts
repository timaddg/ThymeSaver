// Enhanced Image Service for ThymeSaver
// Provides intelligent image selection, caching, and fallback strategies

interface ImageCategory {
  keywords: string[];
  primaryImage: string;
  fallbackImages: string[];
}

class ImageService {
  private imageCache: Map<string, string> = new Map();
  private readonly categories: { [key: string]: ImageCategory } = {
    // Italian Cuisine
    italian: {
      keywords: ['pasta', 'spaghetti', 'lasagna', 'risotto', 'pizza', 'bruschetta'],
      primaryImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Asian Cuisine
    asian: {
      keywords: ['rice', 'noodle', 'stir fry', 'curry', 'sushi', 'ramen', 'dumpling'],
      primaryImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Mexican Cuisine
    mexican: {
      keywords: ['taco', 'burrito', 'enchilada', 'quesadilla', 'tortilla', 'guacamole'],
      primaryImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Mediterranean
    mediterranean: {
      keywords: ['salad', 'olive', 'hummus', 'falafel', 'tzatziki', 'feta'],
      primaryImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Proteins
    protein: {
      keywords: ['chicken', 'beef', 'steak', 'pork', 'fish', 'salmon', 'tuna', 'lamb'],
      primaryImage: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Vegetables
    vegetables: {
      keywords: ['tomato', 'onion', 'garlic', 'potato', 'carrot', 'cucumber', 'spinach', 'broccoli'],
      primaryImage: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Comfort Food
    comfort: {
      keywords: ['soup', 'stew', 'casserole', 'mac and cheese', 'grilled cheese'],
      primaryImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Baking & Desserts
    baking: {
      keywords: ['cake', 'bread', 'cookie', 'pastry', 'muffin', 'brownie'],
      primaryImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=90'
      ]
    },

    // Breakfast
    breakfast: {
      keywords: ['egg', 'pancake', 'waffle', 'oatmeal', 'yogurt', 'smoothie'],
      primaryImage: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=90',
      fallbackImages: [
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=90',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=90'
      ]
    }
  };

  // Premium fallback images for when no specific match is found
  private readonly premiumFallbacks = [
    'https://images.unsplash.com/photo-1504674902479-cc8363a57a48?auto=format&fit=crop&w=500&q=90',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=500&q=90',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=90',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=90',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=90'
  ];

  /**
   * Get the best matching image for a dish based on name and ingredients
   */
  getDishImage(dishName: string, ingredients: string[]): string {
    const cacheKey = `${dishName}-${ingredients.join(',')}`;
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const text = [dishName.toLowerCase(), ...ingredients.map(i => i.toLowerCase())].join(' ');
    const imageUrl = this.findBestMatch(text);
    
    // Cache the result
    this.imageCache.set(cacheKey, imageUrl);
    
    return imageUrl;
  }

  /**
   * Find the best matching image based on text content
   */
  private findBestMatch(text: string): string {
    let bestCategory: string | null = null;
    let bestScore = 0;

    // Score each category based on keyword matches
    for (const [categoryName, category] of Object.entries(this.categories)) {
      const score = this.calculateMatchScore(text, category.keywords);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = categoryName;
      }
    }

    // If we found a good match, return the primary image
    if (bestCategory && bestScore > 5) {
      return this.categories[bestCategory].primaryImage;
    }

    // If no good match, return a random premium fallback
    return this.getRandomFallback();
  }

  /**
   * Calculate match score based on keyword presence
   */
  private calculateMatchScore(text: string, keywords: string[]): number {
    let score = 0;
    const words = text.split(' ');

    for (const keyword of keywords) {
      // Exact match gets highest score
      if (text.includes(keyword)) {
        score += 10;
      }
      
      // Partial word matches get medium score
      for (const word of words) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score += 5;
        }
      }
    }

    return score;
  }

  /**
   * Get a random premium fallback image
   */
  private getRandomFallback(): string {
    const randomIndex = Math.floor(Math.random() * this.premiumFallbacks.length);
    return this.premiumFallbacks[randomIndex];
  }

  /**
   * Preload images for better performance
   */
  preloadImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.imageCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.imageCache.size,
      keys: Array.from(this.imageCache.keys())
    };
  }
}

// Export singleton instance
export const imageService = new ImageService();
export default imageService; 