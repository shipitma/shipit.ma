require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function checkOTP() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const otpCodes = await sql`
      SELECT * FROM otp_codes 
      WHERE phone_number = '+212667997544' 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    
    console.log('OTP Codes for +212667997544:');
    console.log(JSON.stringify(otpCodes, null, 2));
    
    // Check if there's a valid unverified OTP
    const validOTP = await sql`
      SELECT * FROM otp_codes 
      WHERE phone_number = '+212667997544' 
      AND verified = false
      AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    console.log('\nValid unverified OTP:');
    console.log(JSON.stringify(validOTP, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOTP();
