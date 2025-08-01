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

async function checkBusinessLogic() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    
    console.log('🔍 BUSINESS LOGIC & DATA RELATIONSHIPS CHECK');
    console.log('=============================================\n');
    
    // 1. CHECK PAYMENT REQUEST RELATIONSHIPS
    console.log('💰 PAYMENT REQUEST RELATIONSHIPS');
    console.log('--------------------------------');
    
    const paymentRequestsWithDetails = await sql`
      SELECT 
        pr.id,
        pr.type,
        pr.related_id,
        pr.amount,
        pr.status,
        pr.due_date,
        CASE 
          WHEN pr.type = 'purchase' THEN 'Purchase Request'
          WHEN pr.type = 'shipping' THEN 'Package'
          ELSE 'Unknown'
        END as related_type,
        CASE 
          WHEN pr.type = 'purchase' THEN prr.status
          WHEN pr.type = 'shipping' THEN pkg.status
          ELSE 'N/A'
        END as related_status
      FROM payment_requests pr
      LEFT JOIN purchase_requests prr ON pr.type = 'purchase' AND pr.related_id = prr.id
      LEFT JOIN packages pkg ON pr.type = 'shipping' AND pr.related_id = pkg.id
      ORDER BY pr.created_at DESC
    `;
    
    paymentRequestsWithDetails.forEach(req => {
      console.log(`  - ${req.id} (${req.type})`);
      console.log(`    Related: ${req.related_id} (${req.related_type} - ${req.related_status})`);
      console.log(`    Amount: $${req.amount} | Status: ${req.status} | Due: ${req.due_date}`);
      console.log('');
    });
    
    // 2. CHECK PAYMENT SUBMISSIONS
    console.log('💳 PAYMENT SUBMISSIONS');
    console.log('----------------------');
    
    const paymentsWithDetails = await sql`
      SELECT 
        p.id,
        p.payment_request_id,
        p.amount,
        p.payment_method,
        p.status,
        p.payment_date,
        pr.type as request_type,
        pr.related_id
      FROM payments p
      JOIN payment_requests pr ON p.payment_request_id = pr.id
      ORDER BY p.created_at DESC
    `;
    
    paymentsWithDetails.forEach(payment => {
      console.log(`  - ${payment.id} (${payment.status})`);
      console.log(`    Request: ${payment.payment_request_id} (${payment.request_type})`);
      console.log(`    Amount: $${payment.amount} | Method: ${payment.payment_method}`);
      console.log(`    Date: ${payment.payment_date}`);
      console.log('');
    });
    
    // 3. CHECK PACKAGE ITEMS
    console.log('📦 PACKAGE ITEMS');
    console.log('----------------');
    
    const packageItems = await sql`
      SELECT 
        pkg.description as package_description,
        pkg.status as package_status,
        pi.name as item_name,
        pi.quantity,
        pi.value
      FROM package_items pi
      JOIN packages pkg ON pi.package_id = pkg.id
      ORDER BY pkg.created_at DESC
    `;
    
    packageItems.forEach(item => {
      console.log(`  - ${item.package_description} (${item.package_status})`);
      console.log(`    Item: ${item.item_name} x${item.quantity} | Value: $${item.value || 0}`);
      console.log('');
    });
    
    // 4. CHECK PURCHASE REQUEST ITEMS
    console.log('🛒 PURCHASE REQUEST ITEMS');
    console.log('-------------------------');
    
    const purchaseItems = await sql`
      SELECT 
        pr.id as request_id,
        pr.status as request_status,
        pri.name as item_name,
        pri.quantity,
        pri.price,
        pri.url
      FROM purchase_request_items pri
      JOIN purchase_requests pr ON pri.purchase_request_id = pr.id
      ORDER BY pr.created_at DESC
    `;
    
    purchaseItems.forEach(item => {
      console.log(`  - ${item.request_id} (${item.request_status})`);
      console.log(`    Item: ${item.item_name} x${item.quantity} | Price: $${item.price}`);
      console.log(`    URL: ${item.url || 'N/A'}`);
      console.log('');
    });
    
    // 5. CHECK TIMELINE ENTRIES
    console.log('⏰ TIMELINE ENTRIES');
    console.log('-------------------');
    
    // Package timelines
    const packageTimelines = await sql`
      SELECT 
        pkg.description,
        pt.status,
        pt.date,
        pt.completed,
        pt.description as timeline_description
      FROM package_timeline pt
      JOIN packages pkg ON pt.package_id = pkg.id
      ORDER BY pt.created_at DESC
      LIMIT 10
    `;
    
    console.log('Package Timelines:');
    packageTimelines.forEach(timeline => {
      console.log(`  - ${timeline.description} (${timeline.status})`);
      console.log(`    Package: ${timeline.package_description} | Date: ${timeline.date}`);
      console.log(`    Completed: ${timeline.completed} | ${timeline.timeline_description}`);
      console.log('');
    });
    
    // Purchase request timelines
    const purchaseTimelines = await sql`
      SELECT 
        pr.id as request_id,
        prt.status,
        prt.date,
        prt.completed,
        prt.description as timeline_description
      FROM purchase_request_timeline prt
      JOIN purchase_requests pr ON prt.purchase_request_id = pr.id
      ORDER BY prt.created_at DESC
      LIMIT 10
    `;
    
    console.log('Purchase Request Timelines:');
    purchaseTimelines.forEach(timeline => {
      console.log(`  - ${timeline.request_id} (${timeline.status})`);
      console.log(`    Date: ${timeline.date} | Completed: ${timeline.completed}`);
      console.log(`    Description: ${timeline.timeline_description}`);
      console.log('');
    });
    
    // 6. CHECK ATTACHMENT RELATIONSHIPS
    console.log('📎 ATTACHMENT RELATIONSHIPS');
    console.log('---------------------------');
    
    const attachments = await sql`
      SELECT 
        a.file_name,
        a.attachment_type,
        a.related_type,
        a.related_id,
        a.file_size,
        a.uploaded_at
      FROM attachments a
      ORDER BY a.uploaded_at DESC
    `;
    
    attachments.forEach(attachment => {
      console.log(`  - ${attachment.file_name} (${attachment.attachment_type})`);
      console.log(`    Related: ${attachment.related_type} - ${attachment.related_id || 'N/A'}`);
      console.log(`    Size: ${attachment.file_size} bytes | Uploaded: ${attachment.uploaded_at}`);
      console.log('');
    });
    
    // 7. CHECK PAYMENT BREAKDOWNS
    console.log('💵 PAYMENT BREAKDOWNS');
    console.log('---------------------');
    
    const paymentBreakdowns = await sql`
      SELECT 
        pr.id as payment_request_id,
        pr.amount as total_amount,
        pr.status as request_status,
        pb.item_key,
        pb.item_value
      FROM payment_breakdowns pb
      JOIN payment_requests pr ON pb.payment_request_id = pr.id
      ORDER BY pr.created_at DESC
    `;
    
    const breakdownsByRequest = {};
    paymentBreakdowns.forEach(breakdown => {
      if (!breakdownsByRequest[breakdown.payment_request_id]) {
        breakdownsByRequest[breakdown.payment_request_id] = {
          total: breakdown.total_amount,
          status: breakdown.request_status,
          items: []
        };
      }
      breakdownsByRequest[breakdown.payment_request_id].items.push({
        key: breakdown.item_key,
        value: breakdown.item_value
      });
    });
    
    Object.entries(breakdownsByRequest).forEach(([requestId, data]) => {
      console.log(`  - ${requestId} (${data.status}) - Total: $${data.total}`);
      data.items.forEach(item => {
        console.log(`    ${item.key}: $${item.value}`);
      });
      console.log('');
    });
    
    // 8. CHECK DATA CONSISTENCY
    console.log('🔍 DATA CONSISTENCY CHECKS');
    console.log('--------------------------');
    
    // Check for orphaned records
    const orphanedPackageItems = await sql`
      SELECT COUNT(*) as count FROM package_items pi
      LEFT JOIN packages p ON pi.package_id = p.id
      WHERE p.id IS NULL
    `;
    
    const orphanedPurchaseItems = await sql`
      SELECT COUNT(*) as count FROM purchase_request_items pri
      LEFT JOIN purchase_requests pr ON pri.purchase_request_id = pr.id
      WHERE pr.id IS NULL
    `;
    
    const orphanedPaymentBreakdowns = await sql`
      SELECT COUNT(*) as count FROM payment_breakdowns pb
      LEFT JOIN payment_requests pr ON pb.payment_request_id = pr.id
      WHERE pr.id IS NULL
    `;
    
    console.log(`  - Orphaned package items: ${orphanedPackageItems[0].count}`);
    console.log(`  - Orphaned purchase items: ${orphanedPurchaseItems[0].count}`);
    console.log(`  - Orphaned payment breakdowns: ${orphanedPaymentBreakdowns[0].count}`);
    
    // Check for missing required data
    const packagesWithoutTracking = await sql`
      SELECT COUNT(*) as count FROM packages WHERE tracking_number IS NULL OR tracking_number = ''
    `;
    
    const purchaseRequestsWithoutItems = await sql`
      SELECT COUNT(*) as count FROM purchase_requests pr
      LEFT JOIN purchase_request_items pri ON pr.id = pri.purchase_request_id
      WHERE pri.id IS NULL
    `;
    
    console.log(`  - Packages without tracking: ${packagesWithoutTracking[0].count}`);
    console.log(`  - Purchase requests without items: ${purchaseRequestsWithoutItems[0].count}`);
    
    console.log('\n✅ Business Logic Check Complete!');
    
  } catch (error) {
    console.error('❌ Database Error:', error);
  }
}

checkBusinessLogic(); 