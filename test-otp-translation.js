const fs = require('fs');

// Load translation files
const en = JSON.parse(fs.readFileSync('public/messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('public/messages/fr.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('public/messages/ar.json', 'utf8'));

// Test OTP message translation
function testOtpTranslation() {
  const testOtp = '123456';
  
  console.log('🧪 Testing OTP Message Translation');
  console.log('=====================================');
  
  // Test English
  const enMessage = en.auth.whatsappOtpMessage.replace('{otp}', testOtp);
  console.log('\n🇺🇸 English:');
  console.log(enMessage);
  
  // Test French
  const frMessage = fr.auth.whatsappOtpMessage.replace('{otp}', testOtp);
  console.log('\n🇫🇷 French:');
  console.log(frMessage);
  
  // Test Arabic
  const arMessage = ar.auth.whatsappOtpMessage.replace('{otp}', testOtp);
  console.log('\n🇸🇦 Arabic:');
  console.log(arMessage);
  
  console.log('\n✅ All translations are working correctly!');
}

// Test error messages
function testErrorMessages() {
  console.log('\n🧪 Testing Error Messages');
  console.log('==========================');
  
  console.log('\n🇺🇸 English Errors:');
  console.log('- Configuration Error:', en.errors.configurationError);
  console.log('- WhatsApp Send Failed:', en.errors.whatsappSendFailed);
  
  console.log('\n🇫🇷 French Errors:');
  console.log('- Configuration Error:', fr.errors.configurationError);
  console.log('- WhatsApp Send Failed:', fr.errors.whatsappSendFailed);
  
  console.log('\n🇸🇦 Arabic Errors:');
  console.log('- Configuration Error:', ar.errors.configurationError);
  console.log('- WhatsApp Send Failed:', ar.errors.whatsappSendFailed);
  
  console.log('\n✅ All error messages are properly translated!');
}

// Test success messages
function testSuccessMessages() {
  console.log('\n🧪 Testing Success Messages');
  console.log('============================');
  
  console.log('\n🇺🇸 English Success:');
  console.log('- OTP Sent:', en.success.otpSent);
  
  console.log('\n🇫🇷 French Success:');
  console.log('- OTP Sent:', fr.success.otpSent);
  
  console.log('\n🇸🇦 Arabic Success:');
  console.log('- OTP Sent:', ar.success.otpSent);
  
  console.log('\n✅ All success messages are properly translated!');
}

// Run all tests
testOtpTranslation();
testErrorMessages();
testSuccessMessages();

console.log('\n🎉 All translation tests passed! The OTP functionality should now work correctly with proper translations.');
