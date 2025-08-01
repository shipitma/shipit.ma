import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up existing data...');
  
  // Clean up existing data
  await prisma.packageTimeline.deleteMany();
  await prisma.packageItem.deleteMany();
  await prisma.purchaseRequestTimeline.deleteMany();
  await prisma.purchaseRequestItem.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.package.deleteMany();
  await prisma.purchaseRequest.deleteMany();
  await prisma.session.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Data cleanup completed');

  console.log('🌱 Seeding database...');

  // Create user
  const user = await prisma.user.create({
    data: {
      id: 'neon_user_1750733042197_p07n59m8t',
      phone_number: '+212667997544',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      address_line: '123 Test Street',
      city: 'Casablanca',
      state: 'Casablanca-Settat',
      zip: '20000',
      country: 'Morocco',
      email_verified: true,
      phone_verified: true
    }
  });

  // Create warehouses
  const warehouses = await prisma.warehouse.createMany({
    data: [
      {
        name: 'Entrepôt Principal Istanbul',
        country: 'Turkey',
        address_line: 'Atatürk Havalimanı, Istanbul, Turkey',
        city: 'Istanbul',
        state: 'Istanbul',
        phone: '+90 212 555 0123',
        notes: 'Principal warehouse for international shipments'
      },
      {
        name: 'Centre de Distribution Casablanca',
        country: 'Morocco',
        address_line: 'Aéroport Mohammed V, Casablanca, Morocco',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        phone: '+212 522 555 0123',
        notes: 'Main distribution center for Morocco'
      }
    ]
  });

  // Create purchase requests
  const purchaseRequests = await prisma.purchaseRequest.createMany({
    data: [
      {
        id: 'PR-2025-001',
        user_id: user.id,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'completed',
        total_amount: 2899.00,
        items_cost: 2799.00,
        shipping_fee: 50.00,
        service_fee: 28.00,
        processing_fee: 14.00,
        taxes: 8.00,
        admin_notes: 'iPhone 15 Pro Max et AirPods Pro livrés avec succès'
      },
      {
        id: 'PR-2025-002',
        user_id: user.id,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'purchasing',
        total_amount: 1899.00,
        items_cost: 1799.00,
        shipping_fee: 50.00,
        service_fee: 18.00,
        processing_fee: 9.00,
        taxes: 23.00,
        admin_notes: 'MacBook Air M2 en cours d\'achat'
      },
      {
        id: 'PR-2025-003',
        user_id: user.id,
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        status: 'pending_review',
        total_amount: 1599.00,
        items_cost: 1499.00,
        shipping_fee: 50.00,
        service_fee: 15.00,
        processing_fee: 7.50,
        taxes: 28.50,
        admin_notes: 'Samsung Galaxy S24 Ultra - En cours de vérification'
      },
      {
        id: 'PR-2025-004',
        user_id: user.id,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'pending_review',
        total_amount: 899.00,
        items_cost: 899.00,
        admin_notes: 'Nike Air Jordan 1 - En cours de vérification'
      },
      {
        id: 'PR-2025-005',
        user_id: user.id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'pending_review',
        total_amount: 1299.00,
        items_cost: 1299.00,
        admin_notes: 'PlayStation 5 + manettes - Vérification des stocks'
      },
      {
        id: 'PR-2025-006',
        user_id: user.id,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'pending_review',
        total_amount: 599.00,
        items_cost: 599.00,
        admin_notes: 'Apple Watch Series 9 - Nouvelle demande'
      }
    ]
  });

  // Create purchase request items
  const purchaseRequestItems = await prisma.purchaseRequestItem.createMany({
    data: [
      // PR-2025-001 (iPhone 15 Pro Max - Completed)
      {
        purchase_request_id: 'PR-2025-001',
        name: 'iPhone 15 Pro Max',
        url: 'https://www.apple.com/iphone-15-pro/',
        price: 1299.00,
        quantity: 1,
        specifications: '256GB, Titanium Naturel, A17 Pro',
        variant: 'Titanium Naturel'
      },
      {
        purchase_request_id: 'PR-2025-001',
        name: 'AirPods Pro (2ème Génération)',
        url: 'https://www.apple.com/airpods-pro/',
        price: 249.00,
        quantity: 1,
        specifications: 'Annulation de bruit active, Audio spatial',
        variant: 'Blanc'
      },
      {
        purchase_request_id: 'PR-2025-001',
        name: 'Coque iPhone 15 Pro Max',
        url: 'https://www.apple.com/shop/product/MM2Y3ZM/A/',
        price: 49.00,
        quantity: 1,
        specifications: 'Coque FineWoven avec MagSafe',
        variant: 'Noir'
      },

      // PR-2025-002 (MacBook Air - Purchasing)
      {
        purchase_request_id: 'PR-2025-002',
        name: 'MacBook Air M2',
        url: 'https://www.apple.com/macbook-air-m2/',
        price: 1799.00,
        quantity: 1,
        specifications: '13 pouces, 8GB RAM, 256GB SSD, Minuit',
        variant: 'Minuit'
      },

      // PR-2025-003 (Samsung - Pending Review)
      {
        purchase_request_id: 'PR-2025-003',
        name: 'Samsung Galaxy S24 Ultra',
        url: 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/',
        price: 1499.00,
        quantity: 1,
        specifications: '256GB, Titanium Gray, S Pen inclus',
        variant: 'Titanium Gray'
      },

      // PR-2025-004 (Nike - Pending Review)
      {
        purchase_request_id: 'PR-2025-004',
        name: 'Nike Air Jordan 1 Retro High OG',
        url: 'https://www.nike.com/t/air-jordan-1-retro-high-og-shoes-86f1ZW',
        price: 899.00,
        quantity: 1,
        specifications: 'Taille 42, Chicago Red',
        variant: 'Chicago Red'
      },

      // PR-2025-005 (PlayStation - Pending Review)
      {
        purchase_request_id: 'PR-2025-005',
        name: 'PlayStation 5 Console',
        url: 'https://www.playstation.com/en-us/ps5/',
        price: 499.00,
        quantity: 1,
        specifications: 'Édition Disque, Blanc',
        variant: 'Édition Disque'
      },
      {
        purchase_request_id: 'PR-2025-005',
        name: 'Manette DualSense PS5',
        url: 'https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/',
        price: 69.00,
        quantity: 2,
        specifications: 'Manette sans fil DualSense',
        variant: 'Blanc'
      },

      // PR-2025-006 (Apple Watch - Pending Review)
      {
        purchase_request_id: 'PR-2025-006',
        name: 'Apple Watch Series 9',
        url: 'https://www.apple.com/apple-watch-series-9/',
        price: 599.00,
        quantity: 1,
        specifications: '45mm, GPS + Cellular, Bleu',
        variant: 'Bleu'
      }
    ]
  });

  // Create packages
  const packages = await prisma.package.createMany({
    data: [
      {
        id: 'PKG-2025-001',
        user_id: user.id,
        description: 'iPhone 15 Pro Max Package',
        status: 'delivered',
        tracking_number: 'DHL123456789',
        weight: '2.5 kg',
        dimensions: '30x20x15 cm',
        estimated_value: 2899.00,
        shipping_cost: 45.00,
        insurance: 15.00,
        progress: 100,
        eta: 'Livré',
        carrier: 'DHL Express',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Apple Store',
        shipping_method: 'Express Air',
        service: 'Express Worldwide',
        transit_time: '3-5 jours ouvrables',
        tracking_url: 'https://www.dhl.com/track?AWB=DHL123456789',
        insurance_details: 'Inclus jusqu\'à 3000€'
      },
      {
        id: 'PKG-2025-002',
        user_id: user.id,
        description: 'MacBook Air M2 Package',
        status: 'in_transit',
        tracking_number: 'UPS987654321',
        weight: '3.2 kg',
        dimensions: '35x25x20 cm',
        estimated_value: 1899.00,
        shipping_cost: 55.00,
        insurance: 20.00,
        progress: 75,
        eta: '25 Jan 2025',
        carrier: 'UPS',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Apple Store',
        shipping_method: 'Express Air',
        service: 'UPS Standard',
        transit_time: '5-7 jours ouvrables',
        tracking_url: 'https://www.ups.com/track?loc=en_US&tracknum=UPS987654321',
        insurance_details: 'Inclus jusqu\'à 2000€'
      },
      {
        id: 'PKG-2025-003',
        user_id: user.id,
        description: 'Samsung Galaxy S24 Ultra',
        status: 'arrived',
        tracking_number: 'FED456789123',
        weight: '1.8 kg',
        dimensions: '25x15x10 cm',
        estimated_value: 1599.00,
        shipping_cost: 35.00,
        insurance: 10.00,
        progress: 50,
        eta: '28 Jan 2025',
        carrier: 'FedEx',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Samsung Store',
        shipping_method: 'Standard Air',
        service: 'FedEx Express',
        transit_time: '3-5 jours ouvrables',
        tracking_url: 'https://www.fedex.com/fedextrack/?trknbr=FED456789123',
        insurance_details: 'Inclus jusqu\'à 1600€'
      },
      {
        id: 'PKG-2025-004',
        user_id: user.id,
        description: 'Nike Air Jordan 1 Package',
        status: 'expected',
        tracking_number: 'DHL789123456',
        weight: '2.1 kg',
        dimensions: '40x30x15 cm',
        estimated_value: 899.00,
        shipping_cost: 40.00,
        insurance: 12.00,
        progress: 25,
        eta: '30 Jan 2025',
        carrier: 'DHL Express',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Nike Store',
        shipping_method: 'Express Air',
        service: 'Express Worldwide',
        transit_time: '3-5 jours ouvrables',
        tracking_url: 'https://www.dhl.com/track?AWB=DHL789123456',
        insurance_details: 'Inclus jusqu\'à 1000€'
      },
      {
        id: 'PKG-2025-005',
        user_id: user.id,
        description: 'PlayStation 5 Gaming Bundle',
        status: 'processing',
        tracking_number: 'UPS321654987',
        weight: '4.5 kg',
        dimensions: '50x40x25 cm',
        estimated_value: 1299.00,
        shipping_cost: 65.00,
        insurance: 25.00,
        progress: 10,
        eta: '2 Feb 2025',
        carrier: 'UPS',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Amazon',
        shipping_method: 'Standard Air',
        service: 'UPS Standard',
        transit_time: '5-7 jours ouvrables',
        tracking_url: 'https://www.ups.com/track?loc=en_US&tracknum=UPS321654987',
        insurance_details: 'Inclus jusqu\'à 1500€'
      },
      {
        id: 'PKG-2025-006',
        user_id: user.id,
        description: 'Apple Watch Series 9',
        status: 'expected',
        tracking_number: 'FED654321987',
        weight: '1.2 kg',
        dimensions: '20x15x10 cm',
        estimated_value: 599.00,
        shipping_cost: 30.00,
        insurance: 8.00,
        progress: 15,
        eta: '5 Feb 2025',
        carrier: 'FedEx',
        origin: 'Istanbul, Turkey',
        destination: 'Casablanca, Morocco',
        retailer: 'Apple Store',
        shipping_method: 'Express Air',
        service: 'FedEx Express',
        transit_time: '3-5 jours ouvrables',
        tracking_url: 'https://www.fedex.com/fedextrack/?trknbr=FED654321987',
        insurance_details: 'Inclus jusqu\'à 700€'
      }
    ]
  });

  // Create package items
  const packageItems = await prisma.packageItem.createMany({
    data: [
      // PKG-2025-001 items (iPhone - Delivered)
      {
        package_id: 'PKG-2025-001',
        name: 'iPhone 15 Pro Max',
        quantity: 1,
        value: 1299.00
      },
      {
        package_id: 'PKG-2025-001',
        name: 'AirPods Pro (2ème Génération)',
        quantity: 1,
        value: 249.00
      },
      {
        package_id: 'PKG-2025-001',
        name: 'Coque iPhone 15 Pro Max',
        quantity: 1,
        value: 49.00
      },

      // PKG-2025-002 items (MacBook - In Transit)
      {
        package_id: 'PKG-2025-002',
        name: 'MacBook Air M2',
        quantity: 1,
        value: 1799.00
      },

      // PKG-2025-003 items (Samsung - Arrived)
      {
        package_id: 'PKG-2025-003',
        name: 'Samsung Galaxy S24 Ultra',
        quantity: 1,
        value: 1499.00
      },

      // PKG-2025-004 items (Nike - Expected)
      {
        package_id: 'PKG-2025-004',
        name: 'Nike Air Jordan 1 Retro High OG',
        quantity: 1,
        value: 899.00
      },

      // PKG-2025-005 items (PlayStation - Processing)
      {
        package_id: 'PKG-2025-005',
        name: 'PlayStation 5 Console',
        quantity: 1,
        value: 499.00
      },
      {
        package_id: 'PKG-2025-005',
        name: 'Manette DualSense PS5',
        quantity: 2,
        value: 69.00
      },

      // PKG-2025-006 items (Apple Watch - Expected)
      {
        package_id: 'PKG-2025-006',
        name: 'Apple Watch Series 9',
        quantity: 1,
        value: 599.00
      }
    ]
  });

  // Create attachments
  const attachments = await prisma.attachment.createMany({
    data: [
      // Package photos
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        file_name: 'iphone-package-001.jpg',
        file_size: 1250000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package',
        related_id: 'PKG-2025-001'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        file_name: 'airpods-package-001.jpg',
        file_size: 980000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package',
        related_id: 'PKG-2025-001'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        file_name: 'macbook-package-001.jpg',
        file_size: 2100000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package',
        related_id: 'PKG-2025-002'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        file_name: 'samsung-package-001.jpg',
        file_size: 1650000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package',
        related_id: 'PKG-2025-003'
      },

      // Package item photos
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        file_name: 'iphone-15-pro-max-item.jpg',
        file_size: 890000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package_item',
        related_id: '1'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        file_name: 'airpods-pro-item.jpg',
        file_size: 650000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package_item',
        related_id: '2'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        file_name: 'macbook-air-item.jpg',
        file_size: 1200000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'package_item',
        related_id: '4'
      },

      // Purchase request photos
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        file_name: 'iphone-15-pro-max-request.jpg',
        file_size: 890000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request',
        related_id: 'PR-2025-001'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        file_name: 'airpods-pro-request.jpg',
        file_size: 650000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request',
        related_id: 'PR-2025-001'
      },

      // Purchase request item photos
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        file_name: 'iphone-15-pro-max-item.jpg',
        file_size: 890000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request_item',
        related_id: '1'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        file_name: 'airpods-pro-item.jpg',
        file_size: 650000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request_item',
        related_id: '2'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        file_name: 'nike-jordan-item.jpg',
        file_size: 750000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request_item',
        related_id: '6'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
        file_name: 'playstation-5-item.jpg',
        file_size: 1200000,
        file_type: 'image/jpeg',
        attachment_type: 'photo',
        related_type: 'purchase_request_item',
        related_id: '7'
      },

      // Documents
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        file_name: 'etiquette-expedition-001.pdf',
        file_size: 156000,
        file_type: 'application/pdf',
        attachment_type: 'document',
        related_type: 'package',
        related_id: 'PKG-2025-001'
      },
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        file_name: 'formulaire-douane-001.pdf',
        file_size: 89000,
        file_type: 'application/pdf',
        attachment_type: 'document',
        related_type: 'package',
        related_id: 'PKG-2025-003'
      },

      // Receipts
      {
        user_id: user.id,
        file_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        file_name: 'recu-paiement-001.jpg',
        file_size: 245000,
        file_type: 'image/jpeg',
        attachment_type: 'receipt',
        related_type: 'package',
        related_id: 'PKG-2025-001'
      }
    ]
  });

  // Create OTP codes
  const otpCodes = await prisma.otpCode.createMany({
    data: [
      {
        phone_number: '+212667997544',
        code: '123456',
        purpose: 'login',
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
        attempts: 0,
        max_attempts: 3
      },
      {
        phone_number: '+212667997544',
        code: '654321',
        purpose: 'register',
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
        attempts: 0,
        max_attempts: 3
      }
    ]
  });

  // Create sessions
  const sessions = await prisma.session.createMany({
    data: [
      {
        id: 'session_001',
        user_id: user.id,
        phone_number: '+212667997544',
        session_type: 'authenticated',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip_address: '192.168.1.100',
        access_token: 'access_token_001',
        refresh_token: 'refresh_token_001'
      },
      {
        id: 'session_002',
        user_id: user.id,
        phone_number: '+212667997544',
        session_type: 'authenticated',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        ip_address: '192.168.1.101',
        access_token: 'access_token_002',
        refresh_token: 'refresh_token_002'
      }
    ]
  });

  console.log('✅ Database seeded successfully!');

  // Verify data
  const userCount = await prisma.user.count();
  const warehouseCount = await prisma.warehouse.count();
  const purchaseRequestCount = await prisma.purchaseRequest.count();
  const purchaseRequestItemCount = await prisma.purchaseRequestItem.count();
  const packageCount = await prisma.package.count();
  const packageItemCount = await prisma.packageItem.count();
  const attachmentCount = await prisma.attachment.count();
  const sessionCount = await prisma.session.count();
  const otpCodeCount = await prisma.otpCode.count();

  console.log('\n📊 Seeded Data Summary:');
  console.log(`Users: ${userCount}`);
  console.log(`Warehouses: ${warehouseCount}`);
  console.log(`Purchase Requests: ${purchaseRequestCount}`);
  console.log(`Purchase Request Items: ${purchaseRequestItemCount}`);
  console.log(`Packages: ${packageCount}`);
  console.log(`Package Items: ${packageItemCount}`);
  console.log(`Attachments: ${attachmentCount}`);
  console.log(`Sessions: ${sessionCount}`);
  console.log(`OTP Codes: ${otpCodeCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 