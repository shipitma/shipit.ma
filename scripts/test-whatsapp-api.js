const fetch = require('node-fetch');

async function testWasenderAPI() {
  const phoneNumber = "+212612345678"; // Replace with your test phone number
  const message = "Test message from WasenderAPI - " + new Date().toISOString();
  
  try {
    console.log('🧪 Testing WasenderAPI...');
    console.log(`📱 Sending to: ${phoneNumber}`);
    console.log(`💬 Message: ${message}`);
    
    const response = await fetch("https://wasenderapi.com/api/send-message", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 05dacfccde5e02a41517764948a82825ab896e3f9a7c878142309eb1346b003c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        text: message,
      }),
    });

    const responseText = await response.text();
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response: ${responseText}`);
    
    if (response.ok) {
      console.log('✅ WasenderAPI test successful!');
    } else {
      console.log('❌ WasenderAPI test failed!');
    }
  } catch (error) {
    console.error('💥 Error testing WasenderAPI:', error.message);
  }
}

testWasenderAPI(); 