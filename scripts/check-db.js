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
    
    // Set environment variables
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
  } catch (error) {
    console.log('⚠️ Could not load .env file, using system environment variables');
  }
}

// Load environment variables
loadEnv();

async function checkDatabase() {
  try {
    // Use the correct DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    
    console.log('🔍 Checking Database Connection...');
    
    // Check connection
    const [connection] = await sql`SELECT current_database(), current_user, version()`;
    console.log('✅ Database Connection:', connection);
    
    // List all tables
    console.log('\n📋 Database Tables:');
    const tables = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    tables.forEach(table => {
      console.log(`  - ${table.table_name} (${table.table_type})`);
    });
    
    // Check table counts
    console.log('\n📊 Table Record Counts:');
    const tableNames = tables.map(t => t.table_name).filter(name => !name.startsWith('pg_'));
    
    for (const tableName of tableNames) {
      try {
        const [count] = await sql`SELECT COUNT(*) as count FROM ${sql(tableName)}`;
        console.log(`  - ${tableName}: ${count.count} records`);
      } catch (error) {
        console.log(`  - ${tableName}: Error - ${error.message}`);
      }
    }
    
    // Check users
    console.log('\n👥 Users:');
    const users = await sql`SELECT id, phone_number, first_name, last_name, created_at FROM users LIMIT 5`;
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.phone_number}) - ${user.id}`);
    });
    
    // Check packages
    console.log('\n📦 Packages by Status:');
    const packageStats = await sql`
      SELECT status, COUNT(*) as count 
      FROM packages 
      GROUP BY status 
      ORDER BY count DESC
    `;
    packageStats.forEach(stat => {
      console.log(`  - ${stat.status}: ${stat.count} packages`);
    });
    
    // Check purchase requests
    console.log('\n🛒 Purchase Requests by Status:');
    const purchaseStats = await sql`
      SELECT status, COUNT(*) as count 
      FROM purchase_requests 
      GROUP BY status 
      ORDER BY count DESC
    `;
    purchaseStats.forEach(stat => {
      console.log(`  - ${stat.status}: ${stat.count} requests`);
    });
    
    // Check payment requests
    console.log('\n💰 Payment Requests by Status:');
    const paymentStats = await sql`
      SELECT status, COUNT(*) as count 
      FROM payment_requests 
      GROUP BY status 
      ORDER BY count DESC
    `;
    paymentStats.forEach(stat => {
      console.log(`  - ${stat.status}: ${stat.count} requests`);
    });
    
    // Check payments
    console.log('\n💳 Payments by Status:');
    const payments = await sql`
      SELECT status, COUNT(*) as count 
      FROM payments 
      GROUP BY status 
      ORDER BY count DESC
    `;
    payments.forEach(stat => {
      console.log(`  - ${stat.status}: ${stat.count} payments`);
    });
    
    // Check warehouses
    console.log('\n🏢 Warehouses:');
    const warehouses = await sql`SELECT name, country, city FROM warehouses`;
    warehouses.forEach(warehouse => {
      console.log(`  - ${warehouse.name} (${warehouse.city}, ${warehouse.country})`);
    });
    
    // Check recent activity
    console.log('\n⏰ Recent Activity (Last 7 days):');
    const recentPackages = await sql`
      SELECT COUNT(*) as count FROM packages 
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;
    const recentPurchases = await sql`
      SELECT COUNT(*) as count FROM purchase_requests 
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;
    const recentPayments = await sql`
      SELECT COUNT(*) as count FROM payments 
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;
    
    console.log(`  - New packages: ${recentPackages[0].count}`);
    console.log(`  - New purchase requests: ${recentPurchases[0].count}`);
    console.log(`  - New payments: ${recentPayments[0].count}`);
    
    // Check foreign key relationships
    console.log('\n🔗 Foreign Key Relationships:');
    const constraints = await sql`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, kcu.column_name
    `;
    
    constraints.forEach(constraint => {
      console.log(`  - ${constraint.table_name}.${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
    });
    
  } catch (error) {
    console.error('❌ Database Error:', error);
  }
}

checkDatabase(); 