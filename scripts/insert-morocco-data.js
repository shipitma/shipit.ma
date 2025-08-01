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

async function insertMoroccoData() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables');
      return;
    }
    
    const sql = neon(databaseUrl);
    const user_id = 'neon_user_1750733042197_p07n59m8t';
    
    console.log('🌱 Inserting Morocco Market Data...');
    console.log('===================================\n');
    
    // Insert Purchase Requests
    console.log('📝 Inserting purchase requests...');
    await sql`
      INSERT INTO purchase_requests (id, user_id, date, status, total_amount, payment_due, items_cost, shipping_fee, service_fee, processing_fee, taxes, admin_notes, created_at) VALUES
      ('PR-2025-001', ${user_id}, CURRENT_DATE - INTERVAL '15 days', 'completed', 2899.00, NULL, 2799.00, 50.00, 28.00, 14.00, 8.00, 'iPhone 15 Pro Max et AirPods Pro livrés avec succès', CURRENT_DATE - INTERVAL '15 days'),
      ('PR-2025-002', ${user_id}, CURRENT_DATE - INTERVAL '10 days', 'purchasing', 1899.00, NULL, 1799.00, 50.00, 18.00, 9.00, 23.00, 'MacBook Air M2 en cours d''achat', CURRENT_DATE - INTERVAL '10 days'),
      ('PR-2025-003', ${user_id}, CURRENT_DATE - INTERVAL '8 days', 'pending_payment', 1599.00, 1650.00, 1499.00, 50.00, 15.00, 7.50, 28.50, 'Samsung Galaxy S24 Ultra - Paiement en attente', CURRENT_DATE - INTERVAL '8 days'),
      ('PR-2025-004', ${user_id}, CURRENT_DATE - INTERVAL '5 days', 'pending_review', 899.00, NULL, 899.00, NULL, NULL, NULL, NULL, 'Nike Air Jordan 1 - En cours de vérification', CURRENT_DATE - INTERVAL '5 days'),
      ('PR-2025-005', ${user_id}, CURRENT_DATE - INTERVAL '3 days', 'pending_review', 1299.00, NULL, 1299.00, NULL, NULL, NULL, NULL, 'PlayStation 5 + manettes - Vérification des stocks', CURRENT_DATE - INTERVAL '3 days'),
      ('PR-2025-006', ${user_id}, CURRENT_DATE - INTERVAL '1 day', 'pending_review', 599.00, NULL, 599.00, NULL, NULL, NULL, NULL, 'Apple Watch Series 9 - Nouvelle demande', CURRENT_DATE - INTERVAL '1 day')
    `;
    
    // Insert Purchase Request Items
    console.log('📦 Inserting purchase request items...');
    await sql`
      INSERT INTO purchase_request_items (purchase_request_id, name, url, price, quantity, image_url, specifications, variant, created_at) VALUES
      ('PR-2025-001', 'iPhone 15 Pro Max', 'https://www.apple.com/iphone-15-pro/', 1299.00, 1, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', '256GB, Titanium Naturel, A17 Pro', 'Titanium Naturel', CURRENT_DATE - INTERVAL '15 days'),
      ('PR-2025-001', 'AirPods Pro (2ème Génération)', 'https://www.apple.com/airpods-pro/', 249.00, 1, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Annulation de bruit active, Audio spatial', 'Blanc', CURRENT_DATE - INTERVAL '15 days'),
      ('PR-2025-001', 'Coque iPhone 15 Pro Max', 'https://www.apple.com/shop/product/MM2Y3ZM/A/', 49.00, 1, 'https://images.unsplash.com/photo-1603314585442-ee3b5c815e49?w=400', 'Coque FineWoven avec MagSafe', 'Noir', CURRENT_DATE - INTERVAL '15 days'),
      ('PR-2025-002', 'MacBook Air M2', 'https://www.apple.com/macbook-air-m2/', 1799.00, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', '13 pouces, 8GB RAM, 256GB SSD, Minuit', 'Minuit', CURRENT_DATE - INTERVAL '10 days'),
      ('PR-2025-003', 'Samsung Galaxy S24 Ultra', 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/', 1499.00, 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', '256GB, Titanium Gray, S Pen inclus', 'Titanium Gray', CURRENT_DATE - INTERVAL '8 days'),
      ('PR-2025-004', 'Nike Air Jordan 1 Retro High OG', 'https://www.nike.com/t/air-jordan-1-retro-high-og-shoes-86f1ZW', 899.00, 1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Taille 42, Chicago Red', 'Chicago Red', CURRENT_DATE - INTERVAL '5 days'),
      ('PR-2025-005', 'PlayStation 5 Console', 'https://www.playstation.com/en-us/ps5/', 499.00, 1, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'Édition Disque, Blanc', 'Édition Disque', CURRENT_DATE - INTERVAL '3 days'),
      ('PR-2025-005', 'Manette DualSense PS5', 'https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/', 69.00, 2, 'https://images.unsplash.com/photo-1592840496694-26d035b52b0c?w=400', 'Manette sans fil DualSense', 'Blanc', CURRENT_DATE - INTERVAL '3 days'),
      ('PR-2025-006', 'Apple Watch Series 9', 'https://www.apple.com/apple-watch-series-9/', 599.00, 1, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', '45mm, GPS + Cellular, Bleu', 'Bleu', CURRENT_DATE - INTERVAL '1 day')
    `;
    
    // Insert Packages
    console.log('📦 Inserting packages...');
    await sql`
      INSERT INTO packages (id, user_id, description, status, tracking_number, weight, dimensions, estimated_value, shipping_cost, insurance, progress, eta, carrier, origin, destination, retailer, shipping_method, service, transit_time, tracking_url, insurance_details, created_at) VALUES
      ('PKG-2025-001', ${user_id}, 'iPhone 15 Pro Max Package', 'delivered', 'DHL123456789', '2.5 kg', '30x20x15 cm', 2899.00, 45.00, 15.00, 100, 'Livré', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'Express Worldwide', '3-5 jours ouvrables', 'https://www.dhl.com/track?AWB=DHL123456789', 'Inclus jusqu''à 3000€', CURRENT_DATE - INTERVAL '18 days'),
      ('PKG-2025-002', ${user_id}, 'MacBook Air M2 Package', 'in_transit', 'UPS987654321', '3.2 kg', '35x25x20 cm', 1899.00, 55.00, 20.00, 75, '25 Jan 2025', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'UPS Standard', '5-7 jours ouvrables', 'https://www.ups.com/track?loc=en_US&tracknum=UPS987654321', 'Inclus jusqu''à 2000€', CURRENT_DATE - INTERVAL '12 days'),
      ('PKG-2025-003', ${user_id}, 'Samsung Galaxy S24 Ultra', 'arrived', 'FED456789123', '1.8 kg', '25x15x10 cm', 1599.00, 35.00, 10.00, 50, '28 Jan 2025', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Samsung Store', 'Standard Air', 'FedEx Express', '3-5 jours ouvrables', 'https://www.fedex.com/fedextrack/?trknbr=FED456789123', 'Inclus jusqu''à 1600€', CURRENT_DATE - INTERVAL '8 days'),
      ('PKG-2025-004', ${user_id}, 'Nike Air Jordan 1 Package', 'expected', 'DHL789123456', '2.1 kg', '40x30x15 cm', 899.00, 40.00, 12.00, 25, '30 Jan 2025', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Nike Store', 'Express Air', 'Express Worldwide', '3-5 jours ouvrables', 'https://www.dhl.com/track?AWB=DHL789123456', 'Inclus jusqu''à 1000€', CURRENT_DATE - INTERVAL '5 days'),
      ('PKG-2025-005', ${user_id}, 'PlayStation 5 Gaming Bundle', 'processing', 'UPS321654987', '4.5 kg', '50x40x25 cm', 1299.00, 65.00, 25.00, 10, '2 Feb 2025', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Amazon', 'Standard Air', 'UPS Standard', '5-7 jours ouvrables', 'https://www.ups.com/track?loc=en_US&tracknum=UPS321654987', 'Inclus jusqu''à 1500€', CURRENT_DATE - INTERVAL '3 days'),
      ('PKG-2025-006', ${user_id}, 'Apple Watch Series 9', 'expected', 'FED654321987', '1.2 kg', '20x15x10 cm', 599.00, 30.00, 8.00, 15, '5 Feb 2025', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'FedEx Express', '3-5 jours ouvrables', 'https://www.fedex.com/fedextrack/?trknbr=FED654321987', 'Inclus jusqu''à 700€', CURRENT_DATE - INTERVAL '1 day')
    `;
    
    // Insert Payment Requests
    console.log('💰 Inserting payment requests...');
    await sql`
      INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, paid_date, receipt_url, payment_methods, created_at) VALUES
      ('PAY-REQ-001', ${user_id}, 'purchase', 'PR-2025-003', 1650.00, CURRENT_DATE + INTERVAL '3 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'cashplus'], CURRENT_DATE - INTERVAL '8 days'),
      ('PAY-REQ-002', ${user_id}, 'purchase', 'PR-2025-004', 950.00, CURRENT_DATE + INTERVAL '7 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank'], CURRENT_DATE - INTERVAL '5 days'),
      ('PAY-REQ-003', ${user_id}, 'purchase', 'PR-2025-005', 1400.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '3 days'),
      ('PAY-REQ-004', ${user_id}, 'purchase', 'PR-2025-006', 650.00, CURRENT_DATE + INTERVAL '12 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '1 day'),
      ('PAY-REQ-005', ${user_id}, 'shipping', 'PKG-2025-003', 45.00, CURRENT_DATE - INTERVAL '2 days', 'paid', CURRENT_DATE - INTERVAL '3 days', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', ARRAY['attijariwafa-bank'], CURRENT_DATE - INTERVAL '8 days'),
      ('PAY-REQ-006', ${user_id}, 'shipping', 'PKG-2025-004', 52.00, CURRENT_DATE + INTERVAL '5 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
      ('PAY-REQ-007', ${user_id}, 'shipping', 'PKG-2025-005', 90.00, CURRENT_DATE + INTERVAL '8 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '3 days'),
      ('PAY-REQ-008', ${user_id}, 'shipping', 'PKG-2025-006', 38.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['cashplus', 'wafacash'], CURRENT_DATE - INTERVAL '1 day')
    `;
    
    // Insert Payments
    console.log('💳 Inserting payments...');
    await sql`
      INSERT INTO payments (id, user_id, payment_request_id, amount, payment_method, transaction_id, payment_proof_url, payment_date, status, admin_notes, verified_at, verified_by, created_at) VALUES
      ('PAY-001', ${user_id}, 'PAY-REQ-005', 45.00, 'attijariwafa-bank', 'TXN-001-2025', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', CURRENT_DATE - INTERVAL '3 days', 'completed', 'Paiement vérifié et traité', CURRENT_DATE - INTERVAL '3 days', 'admin_001', CURRENT_DATE - INTERVAL '3 days'),
      ('PAY-002', ${user_id}, 'PAY-REQ-001', 1650.00, 'cih-bank', 'TXN-002-2025', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', CURRENT_DATE, 'submitted', NULL, NULL, NULL, CURRENT_DATE)
    `;
    
    // Insert Attachments
    console.log('📎 Inserting attachments...');
    await sql`
      INSERT INTO attachments (user_id, file_url, file_name, file_size, file_type, attachment_type, related_type, related_id, uploaded_at, created_at) VALUES
      (${user_id}, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'recu-paiement-001.jpg', 245000, 'image/jpeg', 'receipt', 'payment_request', 'PAY-REQ-005', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'recu-paiement-002.jpg', 189000, 'image/jpeg', 'receipt', 'payment_request', 'PAY-REQ-001', CURRENT_DATE, CURRENT_DATE),
      (${user_id}, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'iphone-package-001.jpg', 1250000, 'image/jpeg', 'photo', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'airpods-package-001.jpg', 980000, 'image/jpeg', 'photo', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'macbook-package-001.jpg', 2100000, 'image/jpeg', 'photo', 'package', 'PKG-2025-002', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '12 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'samsung-package-001.jpg', 1650000, 'image/jpeg', 'photo', 'package', 'PKG-2025-003', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'iphone-15-pro-max-001.jpg', 890000, 'image/jpeg', 'photo', 'purchase_request_item', '1', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'airpods-pro-001.jpg', 650000, 'image/jpeg', 'photo', 'purchase_request_item', '2', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'nike-jordan-001.jpg', 750000, 'image/jpeg', 'photo', 'purchase_request_item', '4', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'playstation-5-001.jpg', 1200000, 'image/jpeg', 'photo', 'purchase_request_item', '5', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'etiquette-expedition-001.pdf', 156000, 'application/pdf', 'document', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE - INTERVAL '17 days'),
      (${user_id}, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'formulaire-douane-001.pdf', 89000, 'application/pdf', 'document', 'package', 'PKG-2025-003', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days')
    `;
    
    console.log('✅ Morocco market data inserted successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 6 Purchase Requests');
    console.log('  - 6 Packages');
    console.log('  - 8 Payment Requests');
    console.log('  - 2 Payments');
    console.log('  - 12 Attachments');
    console.log('\n🎉 Database now contains realistic Morocco market data!');
    
  } catch (error) {
    console.error('❌ Error inserting Morocco data:', error);
  }
}

insertMoroccoData(); 