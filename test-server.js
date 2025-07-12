async function testServer() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing ThymeSaver Server...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await fetch(baseUrl);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint:', rootData.message);
    
    // Test chat endpoint (without API key - should show error)
    console.log('\n3. Testing chat endpoint (without API key)...');
    const chatResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, test message'
      })
    });
    const chatData = await chatResponse.json();
    console.log('✅ Chat endpoint (expected error):', chatData.error);
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy env.example to .env');
    console.log('2. Add your Gemini API key to .env');
    console.log('3. Run: npm run dev');
    console.log('4. Test with a real API key!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 3000');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testServer();
}

module.exports = { testServer }; 