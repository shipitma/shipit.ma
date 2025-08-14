require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function checkAndCleanOTP() {
  try {
    console.log('🔍 Checking OTP codes for phone number +212667997544...')
    
    // Check existing OTP codes
    const otpCodes = await sql`
      SELECT phone_number, code, purpose, verified, expires_at, created_at 
      FROM otp_codes 
      WHERE phone_number LIKE '%212667997544%' 
      ORDER BY created_at DESC
    `
    
    console.log('\n📋 Found OTP codes:')
    console.table(otpCodes)
    
    if (otpCodes.length > 0) {
      console.log('\n🧹 Cleaning up old OTP codes...')
      
      // Delete all OTP codes for this phone number
      const result = await sql`
        DELETE FROM otp_codes 
        WHERE phone_number LIKE '%212667997544%'
      `
      
      console.log(`✅ Deleted ${result.length} OTP codes`)
    }
    
    // Check sessions
    console.log('\n🔍 Checking sessions...')
    const sessions = await sql`
      SELECT id, phone_number, session_type, expires_at 
      FROM sessions 
      WHERE phone_number LIKE '%212667997544%'
      ORDER BY created_at DESC
    `
    
    console.log('\n📋 Found sessions:')
    console.table(sessions)
    
    if (sessions.length > 0) {
      console.log('\n🧹 Cleaning up old sessions...')
      
      const sessionResult = await sql`
        DELETE FROM sessions 
        WHERE phone_number LIKE '%212667997544%'
      `
      
      console.log(`✅ Deleted ${sessionResult.length} sessions`)
    }
    
    // Check user
    console.log('\n🔍 Checking user...')
    const user = await sql`
      SELECT id, phone_number, first_name, last_name, phone_verified 
      FROM users 
      WHERE phone_number = '+212667997544'
    `
    
    console.log('\n📋 User found:')
    console.table(user)
    
    console.log('\n✅ Cleanup completed! You can now try logging in again.')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkAndCleanOTP()
