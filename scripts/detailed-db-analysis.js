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

async function detailedAnalysis() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    
    console.log('🔍 DETAILED DATABASE ANALYSIS');
    console.log('================================\n');
    
    // 1. USER ANALYSIS
    console.log('👥 USER ANALYSIS');
    console.log('----------------');
    const users = await sql`SELECT * FROM users`;
    console.log(`Total Users: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name}`);
      console.log(`    Phone: ${user.phone_number}`);
      console.log(`    ID: ${user.id}`);
      console.log(`    Created: ${user.created_at}`);
      console.log(`    Country: ${user.country}`);
      console.log('');
    });
    
    // 2. PACKAGE ANALYSIS
    console.log('📦 PACKAGE ANALYSIS');
    console.log('-------------------');
    const packages = await sql`SELECT * FROM packages ORDER BY created_at DESC`;
    console.log(`Total Packages: ${packages.length}`);
    
    const packageStatusCounts = {};
    packages.forEach(pkg => {
      packageStatusCounts[pkg.status] = (packageStatusCounts[pkg.status] || 0) + 1;
    });
    
    Object.entries(packageStatusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} packages`);
    });
    
    console.log('\nRecent Packages:');
    packages.slice(0, 3).forEach(pkg => {
      console.log(`  - ${pkg.description} (${pkg.status})`);
      console.log(`    Tracking: ${pkg.tracking_number || 'N/A'}`);
      console.log(`    Value: $${pkg.estimated_value || 0}`);
      console.log(`    Created: ${pkg.created_at}`);
      console.log('');
    });
    
    // 3. PURCHASE REQUEST ANALYSIS
    console.log('🛒 PURCHASE REQUEST ANALYSIS');
    console.log('----------------------------');
    const purchaseRequests = await sql`SELECT * FROM purchase_requests ORDER BY created_at DESC`;
    console.log(`Total Purchase Requests: ${purchaseRequests.length}`);
    
    const purchaseStatusCounts = {};
    purchaseRequests.forEach(req => {
      purchaseStatusCounts[req.status] = (purchaseStatusCounts[req.status] || 0) + 1;
    });
    
    Object.entries(purchaseStatusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} requests`);
    });
    
    console.log('\nRecent Purchase Requests:');
    purchaseRequests.slice(0, 3).forEach(req => {
      console.log(`  - ${req.id} (${req.status})`);
      console.log(`    Total Amount: $${req.total_amount}`);
      console.log(`    Payment Due: $${req.payment_due || 0}`);
      console.log(`    Created: ${req.created_at}`);
      console.log('');
    });
    
    // 4. PAYMENT ANALYSIS
    console.log('💰 PAYMENT ANALYSIS');
    console.log('-------------------');
    
    // Payment Requests
    const paymentRequests = await sql`SELECT * FROM payment_requests ORDER BY created_at DESC`;
    console.log(`Total Payment Requests: ${paymentRequests.length}`);
    
    const paymentRequestStatusCounts = {};
    paymentRequests.forEach(req => {
      paymentRequestStatusCounts[req.status] = (paymentRequestStatusCounts[req.status] || 0) + 1;
    });
    
    Object.entries(paymentRequestStatusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} requests`);
    });
    
    // Payments
    const payments = await sql`SELECT * FROM payments ORDER BY created_at DESC`;
    console.log(`\nTotal Payments Submitted: ${payments.length}`);
    
    const paymentStatusCounts = {};
    payments.forEach(payment => {
      paymentStatusCounts[payment.status] = (paymentStatusCounts[payment.status] || 0) + 1;
    });
    
    Object.entries(paymentStatusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} payments`);
    });
    
    console.log('\nRecent Payments:');
    payments.slice(0, 3).forEach(payment => {
      console.log(`  - ${payment.id} (${payment.status})`);
      console.log(`    Amount: $${payment.amount}`);
      console.log(`    Method: ${payment.payment_method}`);
      console.log(`    Date: ${payment.payment_date}`);
      console.log('');
    });
    
    // 5. WAREHOUSE ANALYSIS
    console.log('🏢 WAREHOUSE ANALYSIS');
    console.log('---------------------');
    const warehouses = await sql`SELECT * FROM warehouses`;
    console.log(`Total Warehouses: ${warehouses.length}`);
    
    warehouses.forEach(warehouse => {
      console.log(`  - ${warehouse.name}`);
      console.log(`    Location: ${warehouse.city}, ${warehouse.country}`);
      console.log(`    Address: ${warehouse.address_line}`);
      console.log(`    Phone: ${warehouse.phone}`);
      console.log('');
    });
    
    // 6. TIMELINE ANALYSIS
    console.log('⏰ TIMELINE ANALYSIS');
    console.log('-------------------');
    
    // Package timeline entries
    const packageTimeline = await sql`SELECT COUNT(*) as count FROM package_timeline`;
    console.log(`Package Timeline Entries: ${packageTimeline[0].count}`);
    
    // Purchase request timeline entries
    const purchaseTimeline = await sql`SELECT COUNT(*) as count FROM purchase_request_timeline`;
    console.log(`Purchase Request Timeline Entries: ${purchaseTimeline[0].count}`);
    
    // Payment timeline entries
    const paymentTimeline = await sql`SELECT COUNT(*) as count FROM payment_timeline`;
    console.log(`Payment Timeline Entries: ${paymentTimeline[0].count}`);
    
    // 7. ATTACHMENT ANALYSIS
    console.log('\n📎 ATTACHMENT ANALYSIS');
    console.log('----------------------');
    const attachments = await sql`SELECT * FROM attachments`;
    console.log(`Total Attachments: ${attachments.length}`);
    
    const attachmentTypes = {};
    attachments.forEach(attachment => {
      attachmentTypes[attachment.attachment_type] = (attachmentTypes[attachment.attachment_type] || 0) + 1;
    });
    
    Object.entries(attachmentTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} files`);
    });
    
    // 8. SESSION ANALYSIS
    console.log('\n🔐 SESSION ANALYSIS');
    console.log('-------------------');
    const sessions = await sql`SELECT * FROM sessions WHERE expires_at > NOW()`;
    console.log(`Active Sessions: ${sessions.length}`);
    
    const sessionTypes = {};
    sessions.forEach(session => {
      sessionTypes[session.session_type] = (sessionTypes[session.session_type] || 0) + 1;
    });
    
    Object.entries(sessionTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} sessions`);
    });
    
    // 9. OTP ANALYSIS
    console.log('\n📱 OTP ANALYSIS');
    console.log('----------------');
    const otpCodes = await sql`SELECT * FROM otp_codes WHERE expires_at > NOW()`;
    console.log(`Active OTP Codes: ${otpCodes.length}`);
    
    const otpPurposes = {};
    otpCodes.forEach(otp => {
      otpPurposes[otp.purpose] = (otpPurposes[otp.purpose] || 0) + 1;
    });
    
    Object.entries(otpPurposes).forEach(([purpose, count]) => {
      console.log(`  - ${purpose}: ${count} codes`);
    });
    
    // 10. DATA RELATIONSHIPS
    console.log('\n🔗 DATA RELATIONSHIPS');
    console.log('---------------------');
    
    // Packages per user
    const packagesPerUser = await sql`
      SELECT u.first_name, u.last_name, COUNT(p.id) as package_count
      FROM users u
      LEFT JOIN packages p ON u.id = p.user_id
      GROUP BY u.id, u.first_name, u.last_name
    `;
    
    packagesPerUser.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name}: ${user.package_count} packages`);
    });
    
    // Purchase requests per user
    const purchasesPerUser = await sql`
      SELECT u.first_name, u.last_name, COUNT(pr.id) as purchase_count
      FROM users u
      LEFT JOIN purchase_requests pr ON u.id = pr.user_id
      GROUP BY u.id, u.first_name, u.last_name
    `;
    
    purchasesPerUser.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name}: ${user.purchase_count} purchase requests`);
    });
    
    // Payment requests per user
    const paymentsPerUser = await sql`
      SELECT u.first_name, u.last_name, COUNT(pay_req.id) as payment_request_count
      FROM users u
      LEFT JOIN payment_requests pay_req ON u.id = pay_req.user_id
      GROUP BY u.id, u.first_name, u.last_name
    `;
    
    paymentsPerUser.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name}: ${user.payment_request_count} payment requests`);
    });
    
    console.log('\n✅ Analysis Complete!');
    
  } catch (error) {
    console.error('❌ Database Error:', error);
  }
}

detailedAnalysis(); 