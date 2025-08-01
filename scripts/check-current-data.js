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

async function checkCurrentData() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    
    console.log('🔍 CHECKING CURRENT DATABASE STATE');
    console.log('==================================\n');
    
    // Check all tables for record counts
    const tableCounts = await sql`
      SELECT
        (SELECT COUNT(*) FROM attachments) AS attachments_count,
        (SELECT COUNT(*) FROM otp_codes) AS otp_codes_count,
        (SELECT COUNT(*) FROM package_items) AS package_items_count,
        (SELECT COUNT(*) FROM package_timeline) AS package_timeline_count,
        (SELECT COUNT(*) FROM packages) AS packages_count,

        (SELECT COUNT(*) FROM purchase_request_items) AS purchase_request_items_count,
        (SELECT COUNT(*) FROM purchase_request_timeline) AS purchase_request_timeline_count,
        (SELECT COUNT(*) FROM purchase_requests) AS purchase_requests_count,
        (SELECT COUNT(*) FROM sessions) AS sessions_count,
        (SELECT COUNT(*) FROM users) AS users_count,
        (SELECT COUNT(*) FROM warehouses) AS warehouses_count
    `;
    
    if (tableCounts && tableCounts.length > 0) {
      const counts = tableCounts[0];
      console.log('📊 CURRENT TABLE RECORD COUNTS:');
      console.log('--------------------------------');
      
      Object.entries(counts).forEach(([table, count]) => {
        const tableName = table.replace('_count', '');
        console.log(`  ${tableName}: ${count} records`);
      });
      
      // Check if there are any records that shouldn't be there
      const totalRecords = Object.values(counts).reduce((sum, count) => sum + parseInt(count), 0);
      console.log(`\n📈 Total records across all tables: ${totalRecords}`);
      
      // Check for old data patterns
      const oldDataTables = [];
      Object.entries(counts).forEach(([table, count]) => {
        const tableName = table.replace('_count', '');
        if (count > 0 && !['users', 'warehouses'].includes(tableName)) {
          oldDataTables.push(tableName);
        }
      });
      
      if (oldDataTables.length > 0) {
        console.log('\n⚠️ Tables with potential old data:');
        oldDataTables.forEach(table => {
          console.log(`  - ${table}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database state:', error);
  }
}

checkCurrentData(); 