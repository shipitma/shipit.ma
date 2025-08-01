# WhatsApp OTP Troubleshooting Guide

## Issue: Not Receiving OTP on WhatsApp

### 1. Check WasenderAPI Configuration

Your OTP implementation has been updated to use WasenderAPI. Here's what was changed:

**Before (Old API):**
```javascript
// Old implementation using otpsender.ship-it.me
const otpResponse = await fetch("https://otpsender.ship-it.me/api/sendText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    chatId: chatId,
    text: text,
    session: "default",
  }),
})
```

**After (WasenderAPI):**
```javascript
// New implementation using WasenderAPI
const otpResponse = await fetch("https://wasenderapi.com/api/send-message", {
  method: "POST",
  headers: {
    "Authorization": "Bearer 05dacfccde5e02a41517764948a82825ab896e3f9a7c878142309eb1346b003c",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: phoneNumber,
    text: text,
  }),
})
```

### 2. Environment Variables

Make sure your `.env.local` file contains:

```env
# WhatsApp API (WasenderAPI)
WHATSAPP_API_TOKEN=05dacfccde5e02a41517764948a82825ab896e3f9a7c878142309eb1346b003c
WHATSAPP_API_URL=https://wasenderapi.com/api/send-message
```

### 3. Common Issues and Solutions

#### Issue 1: API Token Invalid
- **Symptom**: 401 Unauthorized error
- **Solution**: Verify your WasenderAPI token is correct and active

#### Issue 2: Phone Number Format
- **Symptom**: Message not delivered
- **Solution**: Ensure phone numbers are in international format (e.g., +212612345678)

#### Issue 3: WhatsApp Session Not Connected
- **Symptom**: API returns success but no message received
- **Solution**: Check if your WhatsApp session is properly connected in WasenderAPI dashboard

#### Issue 4: Rate Limiting
- **Symptom**: 429 Too Many Requests error
- **Solution**: Implement rate limiting in your application

### 4. Testing Your Setup

Run the test script to verify WasenderAPI is working:

```bash
node scripts/test-whatsapp-api.js
```

**Before running the test:**
1. Replace the phone number in the test script with your actual number
2. Make sure your WhatsApp is connected to the internet

### 5. Debugging Steps

1. **Check API Response**: The updated code now returns detailed error messages
2. **Verify Phone Number**: Ensure it's in the correct format
3. **Test with Curl**: Use the curl command you provided to test directly
4. **Check WasenderAPI Dashboard**: Verify your session status

### 6. Curl Test Command

```bash
curl -X POST "https://wasenderapi.com/api/send-message" \
  -H "Authorization: Bearer 05dacfccde5e02a41517764948a82825ab896e3f9a7c878142309eb1346b003c" \
  -H "Content-Type: application/json" \
  -d '{"to": "+212612345678", "text": "Test message from API!"}'
```

### 7. Environment Cleanup

Your `.env.local` file has been cleaned up to include only the essential variables:

- ✅ Database configuration
- ✅ WhatsApp API settings
- ✅ Neon Auth credentials
- ✅ File storage settings
- ✅ Redis configuration
- ✅ MinIO settings
- ✅ Analytics configuration

### 8. Next Steps

1. **Update NEXTAUTH_SECRET**: Replace `your-nextauth-secret-key-here` with a secure random string
2. **Test the API**: Run the test script with your phone number
3. **Monitor Logs**: Check your application logs for detailed error messages
4. **Contact WasenderAPI Support**: If issues persist, contact their support team

### 9. Monitoring

The updated code now provides better error handling and logging:

```javascript
if (!otpResponse.ok) {
  const errorText = await otpResponse.text()
  console.error("Failed to send OTP via WasenderAPI:", errorText)
  
  return NextResponse.json({ 
    error: "Échec de l'envoi de l'OTP via WhatsApp",
    details: errorText
  }, { status: 500 })
}
```

This will help you identify the specific issue with your WhatsApp OTP delivery. 