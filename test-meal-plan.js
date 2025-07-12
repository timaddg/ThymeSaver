async function testMealPlanGeneration() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🍽️ Testing Meal Plan Generation...\n');
  
  try {
    // Test meal plan generation
    console.log('1. Testing meal plan generation...');
    const mealPlanResponse = await fetch(`${baseUrl}/api/generate-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dietaryRestrictions: ['vegetarian'],
        cuisinePreferences: ['italian', 'mediterranean'],
        cookingTime: 'quick',
        servings: 2,
        ingredients: ['pasta', 'tomatoes', 'olive oil', 'garlic'],
        skillLevel: 'beginner'
      })
    });
    
    const mealPlanData = await mealPlanResponse.json();
    
    if (mealPlanData.success) {
      console.log('✅ Meal plan generated successfully!');
      console.log('\n📋 Generated Meal Plan:');
      console.log('='.repeat(50));
      console.log(mealPlanData.mealPlan);
      console.log('='.repeat(50));
      console.log('\n📊 Parameters used:', mealPlanData.parameters);
    } else {
      console.log('❌ Meal plan generation failed:', mealPlanData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running and you have a valid Gemini API key');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testMealPlanGeneration();
}

module.exports = { testMealPlanGeneration }; 