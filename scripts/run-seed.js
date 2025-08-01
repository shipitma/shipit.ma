import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (value && !key.startsWith('#')) {
          envVars[key.trim()] = value;
        }
      }
    });
    
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
  } catch (error) {
    console.log('⚠️ Could not load .env file, using system environment variables');
  }
}

loadEnv();

async function runSeed() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    
    console.log('🗑️ Clearing ALL existing data...');
    console.log('================================\n');
    
    // Clear ALL data in correct order (due to foreign keys)
    console.log('Deleting payment_timeline...');
    await sql`DELETE FROM payment_timeline`;
    
    console.log('Deleting payment_breakdowns...');
    await sql`DELETE FROM payment_breakdowns`;
    
    console.log('Deleting payments...');
    await sql`DELETE FROM payments`;
    
    console.log('Deleting payment_requests...');
    await sql`DELETE FROM payment_requests`;
    
    console.log('Deleting package_timeline...');
    await sql`DELETE FROM package_timeline`;
    
    console.log('Deleting package_items...');
    await sql`DELETE FROM package_items`;
    
    console.log('Deleting purchase_request_timeline...');
    await sql`DELETE FROM purchase_request_timeline`;
    
    console.log('Deleting purchase_request_items...');
    await sql`DELETE FROM purchase_request_items`;
    
    console.log('Deleting attachments...');
    await sql`DELETE FROM attachments`;
    
    console.log('Deleting packages...');
    await sql`DELETE FROM packages`;
    
    console.log('Deleting purchase_requests...');
    await sql`DELETE FROM purchase_requests`;
    
    console.log('Deleting sessions...');
    await sql`DELETE FROM sessions`;
    
    console.log('Deleting otp_codes...');
    await sql`DELETE FROM otp_codes`;
    
    console.log('✅ ALL existing data cleared!');
    console.log('\n🌱 Running Comprehensive Morocco Market Seed...');
    console.log('==============================================\n');
    
    // Read the SQL file
    const sqlPath = join(process.cwd(), 'scripts', '17-comprehensive-morocco-seed.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Executing seed script...');
    
    // Execute the SQL content
    await sql.unsafe(sqlContent);
    
    console.log('✅ Seed script executed successfully!');
    console.log('\n📊 Summary of seeded data:');
    
    // Get summary counts
    const summary = await sql`
      SELECT 
        'Purchase Requests' as table_name,
        COUNT(*) as record_count
      FROM purchase_requests 
      WHERE user_id = 'neon_user_1750733042197_p07n59m8t'
      UNION ALL
      SELECT 
        'Packages' as table_name,
        COUNT(*) as record_count
      FROM packages 
      WHERE user_id = 'neon_user_1750733042197_p07n59m8t'
      UNION ALL
      SELECT 
        'Payment Requests' as table_name,
        COUNT(*) as record_count
      FROM payment_requests 
      WHERE user_id = 'neon_user_1750733042197_p07n59m8t'
      UNION ALL
      SELECT 
        'Payments' as table_name,
        COUNT(*) as record_count
      FROM payments 
      WHERE user_id = 'neon_user_1750733042197_p07n59m8t'
      UNION ALL
      SELECT 
        'Attachments' as table_name,
        COUNT(*) as record_count
      FROM attachments 
      WHERE user_id = 'neon_user_1750733042197_p07n59m8t'
    `;
    
    summary.forEach(item => {
      console.log(`  - ${item.table_name}: ${item.record_count} records`);
    });
    
    console.log('\n🎉 Morocco market seed completed successfully!');
    console.log('📱 Content includes French and Arabic for local market');
    console.log('🖼️ All images use Unsplash for clear visualization');
    console.log('💰 Realistic pricing and payment methods for Morocco');
    
  } catch (error) {
    console.error('❌ Error running seed script:', error);
  }
}

runSeed(); 