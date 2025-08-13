const fetch = require('node-fetch');
require('dotenv').config();

async function testWasenderAPI() {
  const phoneNumber = "+212612345678"; // Replace with your test phone number
  const message = "Test message from WasenderAPI - " + new Date().toISOString();
  
  // Get environment variables
  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
  
  if (!whatsappApiUrl || !whatsappApiToken) {
    console.error('❌ Missing WhatsApp API configuration. Please set WHATSAPP_API_URL and WHATSAPP_API_TOKEN in your .env file');
    return;
  }
  
  try {
    console.log('🧪 Testing WasenderAPI...');
    console.log(`📱 Sending to: ${phoneNumber}`);
    console.log(`💬 Message: ${message}`);
    
    const response = await fetch(whatsappApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${whatsappApiToken}`,
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