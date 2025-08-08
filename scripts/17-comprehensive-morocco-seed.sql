-- Comprehensive Morocco Market Seed Script
-- Realistic data for package forwarding service in Morocco
-- Content in French and Arabic for local market

-- Set the user ID variable
DO $$
DECLARE
    user_id VARCHAR(50) := 'neon_user_1750733042197_p07n59m8t';
BEGIN

-- Insert Purchase Requests (Realistic Morocco market items)
INSERT INTO purchase_requests (id, user_id, date, status, total_amount, payment_due, items_cost, shipping_fee, service_fee, processing_fee, taxes, admin_notes, created_at) VALUES
('PR-2025-001', user_id, CURRENT_DATE - INTERVAL '15 days', 'completed', 2899.00, NULL, 2799.00, 50.00, 28.00, 14.00, 8.00, 'iPhone 15 Pro Max et AirPods Pro livrés avec succès', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-002', user_id, CURRENT_DATE - INTERVAL '10 days', 'purchasing', 1899.00, NULL, 1799.00, 50.00, 18.00, 9.00, 23.00, 'MacBook Air M2 en cours d\'achat', CURRENT_DATE - INTERVAL '10 days'),
('PR-2025-003', user_id, CURRENT_DATE - INTERVAL '8 days', 'pending_payment', 1599.00, 1650.00, 1499.00, 50.00, 15.00, 7.50, 28.50, 'Samsung Galaxy S24 Ultra - Paiement en attente', CURRENT_DATE - INTERVAL '8 days'),
('PR-2025-004', user_id, CURRENT_DATE - INTERVAL '5 days', 'pending_review', 899.00, NULL, 899.00, NULL, NULL, NULL, NULL, 'Nike Air Jordan 1 - En cours de vérification', CURRENT_DATE - INTERVAL '5 days'),
('PR-2025-005', user_id, CURRENT_DATE - INTERVAL '3 days', 'pending_review', 1299.00, NULL, 1299.00, NULL, NULL, NULL, NULL, 'PlayStation 5 + manettes - Vérification des stocks', CURRENT_DATE - INTERVAL '3 days'),
('PR-2025-006', user_id, CURRENT_DATE - INTERVAL '1 day', 'pending_review', 599.00, NULL, 599.00, NULL, NULL, NULL, NULL, 'Apple Watch Series 9 - Nouvelle demande', CURRENT_DATE - INTERVAL '1 day');

-- Insert Purchase Request Items (Realistic items for Morocco market)
INSERT INTO purchase_request_items (purchase_request_id, name, url, price, quantity, image_url, specifications, variant, created_at) VALUES
-- PR-2025-001 (iPhone 15 Pro Max - Completed)
('PR-2025-001', 'iPhone 15 Pro Max', 'https://www.apple.com/iphone-15-pro/', 1299.00, 1, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', '256GB, Titanium Naturel, A17 Pro', 'Titanium Naturel', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-001', 'AirPods Pro (2ème Génération)', 'https://www.apple.com/airpods-pro/', 249.00, 1, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Annulation de bruit active, Audio spatial', 'Blanc', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-001', 'Coque iPhone 15 Pro Max', 'https://www.apple.com/shop/product/MM2Y3ZM/A/', 49.00, 1, 'https://images.unsplash.com/photo-1603314585442-ee3b5c815e49?w=400', 'Coque FineWoven avec MagSafe', 'Noir', CURRENT_DATE - INTERVAL '15 days'),

-- PR-2025-002 (MacBook Air - Purchasing)
('PR-2025-002', 'MacBook Air M2', 'https://www.apple.com/macbook-air-m2/', 1799.00, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', '13 pouces, 8GB RAM, 256GB SSD, Minuit', 'Minuit', CURRENT_DATE - INTERVAL '10 days'),

-- PR-2025-003 (Samsung - Pending Payment)
('PR-2025-003', 'Samsung Galaxy S24 Ultra', 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/', 1499.00, 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', '256GB, Titanium Gray, S Pen inclus', 'Titanium Gray', CURRENT_DATE - INTERVAL '8 days'),

-- PR-2025-004 (Nike - Pending Review)
('PR-2025-004', 'Nike Air Jordan 1 Retro High OG', 'https://www.nike.com/t/air-jordan-1-retro-high-og-shoes-86f1ZW', 899.00, 1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Taille 42, Chicago Red', 'Chicago Red', CURRENT_DATE - INTERVAL '5 days'),

-- PR-2025-005 (PlayStation - Pending Review)
('PR-2025-005', 'PlayStation 5 Console', 'https://www.playstation.com/en-us/ps5/', 499.00, 1, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'Édition Disque, Blanc', 'Édition Disque', CURRENT_DATE - INTERVAL '3 days'),
('PR-2025-005', 'Manette DualSense PS5', 'https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/', 69.00, 2, 'https://images.unsplash.com/photo-1592840496694-26d035b52b0c?w=400', 'Manette sans fil DualSense', 'Blanc', CURRENT_DATE - INTERVAL '3 days'),

-- PR-2025-006 (Apple Watch - Pending Review)
('PR-2025-006', 'Apple Watch Series 9', 'https://www.apple.com/apple-watch-series-9/', 599.00, 1, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', '45mm, GPS + Cellular, Bleu', 'Bleu', CURRENT_DATE - INTERVAL '1 day');

-- Insert Purchase Request Timeline
INSERT INTO purchase_request_timeline (purchase_request_id, status, date, time, completed, description, created_at) VALUES
-- PR-2025-001 timeline (Completed)
('PR-2025-001', 'Demande Soumise', CURRENT_DATE - INTERVAL '15 days', '09:00:00', true, 'Demande d\'achat iPhone 15 Pro Max soumise', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-001', 'En Révision', CURRENT_DATE - INTERVAL '15 days', '10:30:00', true, 'Administrateur vérifie la disponibilité', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-001', 'Devis Préparé', CURRENT_DATE - INTERVAL '15 days', '14:15:00', true, 'Devis final préparé avec tous les frais', CURRENT_DATE - INTERVAL '15 days'),
('PR-2025-001', 'Paiement Confirmé', CURRENT_DATE - INTERVAL '14 days', '16:45:00', true, 'Paiement reçu, procédure d\'achat', CURRENT_DATE - INTERVAL '14 days'),
('PR-2025-001', 'Achat en Cours', CURRENT_DATE - INTERVAL '13 days', '09:15:00', true, 'Articles en cours d\'achat', CURRENT_DATE - INTERVAL '13 days'),
('PR-2025-001', 'Terminé', CURRENT_DATE - INTERVAL '12 days', '14:20:00', true, 'Articles achetés et expédiés vers l\'entrepôt', CURRENT_DATE - INTERVAL '12 days'),

-- PR-2025-002 timeline (Purchasing)
('PR-2025-002', 'Demande Soumise', CURRENT_DATE - INTERVAL '10 days', '11:00:00', true, 'Demande d\'achat MacBook Air soumise', CURRENT_DATE - INTERVAL '10 days'),
('PR-2025-002', 'Paiement Confirmé', CURRENT_DATE - INTERVAL '9 days', '15:20:00', true, 'Paiement reçu, procédure d\'achat', CURRENT_DATE - INTERVAL '9 days'),
('PR-2025-002', 'Achat en Cours', CURRENT_DATE - INTERVAL '8 days', '09:15:00', false, 'MacBook Air M2 en cours d\'achat', CURRENT_DATE - INTERVAL '8 days'),

-- PR-2025-003 timeline (Pending Payment)
('PR-2025-003', 'Demande Soumise', CURRENT_DATE - INTERVAL '8 days', '13:00:00', true, 'Demande d\'achat Samsung Galaxy S24 Ultra', CURRENT_DATE - INTERVAL '8 days'),
('PR-2025-003', 'En Révision', CURRENT_DATE - INTERVAL '8 days', '14:30:00', true, 'Administrateur vérifie la disponibilité', CURRENT_DATE - INTERVAL '8 days'),
('PR-2025-003', 'Devis Préparé', CURRENT_DATE - INTERVAL '8 days', '16:15:00', true, 'Devis final préparé avec tous les frais', CURRENT_DATE - INTERVAL '8 days'),
('PR-2025-003', 'En Attente de Paiement', CURRENT_DATE - INTERVAL '8 days', '16:30:00', false, 'En attente de confirmation du paiement', CURRENT_DATE - INTERVAL '8 days'),

-- PR-2025-004 timeline (Pending Review)
('PR-2025-004', 'Demande Soumise', CURRENT_DATE - INTERVAL '5 days', '16:00:00', true, 'Demande d\'achat Nike Air Jordan 1', CURRENT_DATE - INTERVAL '5 days'),
('PR-2025-004', 'En Révision', CURRENT_DATE - INTERVAL '5 days', '17:30:00', false, 'Vérification de la disponibilité Nike', CURRENT_DATE - INTERVAL '5 days'),

-- PR-2025-005 timeline (Pending Review)
('PR-2025-005', 'Demande Soumise', CURRENT_DATE - INTERVAL '3 days', '10:00:00', true, 'Demande d\'achat PlayStation 5', CURRENT_DATE - INTERVAL '3 days'),
('PR-2025-005', 'En Révision', CURRENT_DATE - INTERVAL '3 days', '11:30:00', false, 'Vérification de la disponibilité PlayStation 5', CURRENT_DATE - INTERVAL '3 days'),

-- PR-2025-006 timeline (Pending Review)
('PR-2025-006', 'Demande Soumise', CURRENT_DATE - INTERVAL '1 day', '14:00:00', true, 'Demande d\'achat Apple Watch Series 9', CURRENT_DATE - INTERVAL '1 day'),
('PR-2025-006', 'En Révision', CURRENT_DATE - INTERVAL '1 day', '15:30:00', false, 'Vérification de la disponibilité Apple Watch', CURRENT_DATE - INTERVAL '1 day');

-- Insert Packages (Realistic Morocco shipping scenarios)
INSERT INTO packages (id, user_id, description, status, tracking_number, weight, dimensions, estimated_value, shipping_cost, insurance, progress, eta, carrier, origin, destination, retailer, shipping_method, service, transit_time, tracking_url, insurance_details, created_at) VALUES
('PKG-2025-001', user_id, 'iPhone 15 Pro Max Package', 'delivered', 'DHL123456789', '2.5 kg', '30x20x15 cm', 2899.00, 45.00, 15.00, 100, 'Livré', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'Express Worldwide', '3-5 jours ouvrables', 'https://www.dhl.com/track?AWB=DHL123456789', 'Inclus jusqu\'à 3000 MAD', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2025-002', user_id, 'MacBook Air M2 Package', 'in_transit', 'UPS987654321', '3.2 kg', '35x25x20 cm', 1899.00, 55.00, 20.00, 75, '25 Jan 2025', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'UPS Standard', '5-7 jours ouvrables', 'https://www.ups.com/track?loc=en_US&tracknum=UPS987654321', 'Inclus jusqu\'à 2000 MAD', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2025-003', user_id, 'Samsung Galaxy S24 Ultra', 'arrived', 'FED456789123', '1.8 kg', '25x15x10 cm', 1599.00, 35.00, 10.00, 50, '28 Jan 2025', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Samsung Store', 'Standard Air', 'FedEx Express', '3-5 jours ouvrables', 'https://www.fedex.com/fedextrack/?trknbr=FED456789123', 'Inclus jusqu\'à 1600 MAD', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2025-004', user_id, 'Nike Air Jordan 1 Package', 'expected', 'DHL789123456', '2.1 kg', '40x30x15 cm', 899.00, 40.00, 12.00, 25, '30 Jan 2025', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Nike Store', 'Express Air', 'Express Worldwide', '3-5 jours ouvrables', 'https://www.dhl.com/track?AWB=DHL789123456', 'Inclus jusqu\'à 1000 MAD', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2025-005', user_id, 'PlayStation 5 Gaming Bundle', 'processing', 'UPS321654987', '4.5 kg', '50x40x25 cm', 1299.00, 65.00, 25.00, 10, '2 Feb 2025', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Amazon', 'Standard Air', 'UPS Standard', '5-7 jours ouvrables', 'https://www.ups.com/track?loc=en_US&tracknum=UPS321654987', 'Inclus jusqu\'à 1500 MAD', CURRENT_DATE - INTERVAL '3 days'),
('PKG-2025-006', user_id, 'Apple Watch Series 9', 'expected', 'FED654321987', '1.2 kg', '20x15x10 cm', 599.00, 30.00, 8.00, 15, '5 Feb 2025', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'FedEx Express', '3-5 jours ouvrables', 'https://www.fedex.com/fedextrack/?trknbr=FED654321987', 'Inclus jusqu\'à 700 MAD', CURRENT_DATE - INTERVAL '1 day');

-- Insert Package Items
INSERT INTO package_items (package_id, name, quantity, value, image_url, created_at) VALUES
-- PKG-2025-001 items (iPhone - Delivered)
('PKG-2025-001', 'iPhone 15 Pro Max', 1, 1299.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2025-001', 'AirPods Pro (2ème Génération)', 1, 249.00, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2025-001', 'Coque iPhone 15 Pro Max', 1, 49.00, 'https://images.unsplash.com/photo-1603314585442-ee3b5c815e49?w=400', CURRENT_DATE - INTERVAL '18 days'),

-- PKG-2025-002 items (MacBook - In Transit)
('PKG-2025-002', 'MacBook Air M2', 1, 1799.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', CURRENT_DATE - INTERVAL '12 days'),

-- PKG-2025-003 items (Samsung - Arrived)
('PKG-2025-003', 'Samsung Galaxy S24 Ultra', 1, 1499.00, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', CURRENT_DATE - INTERVAL '8 days'),

-- PKG-2025-004 items (Nike - Expected)
('PKG-2025-004', 'Nike Air Jordan 1 Retro High OG', 1, 899.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', CURRENT_DATE - INTERVAL '5 days'),

-- PKG-2025-005 items (PlayStation - Processing)
('PKG-2025-005', 'PlayStation 5 Console', 1, 499.00, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', CURRENT_DATE - INTERVAL '3 days'),
('PKG-2025-005', 'Manette DualSense PS5', 2, 69.00, 'https://images.unsplash.com/photo-1592840496694-26d035b52b0c?w=400', CURRENT_DATE - INTERVAL '3 days'),

-- PKG-2025-006 items (Apple Watch - Expected)
('PKG-2025-006', 'Apple Watch Series 9', 1, 599.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', CURRENT_DATE - INTERVAL '1 day');

-- Insert Package Timeline (Realistic Morocco shipping flow)
INSERT INTO package_timeline (package_id, status, location, date, time, completed, description, icon, created_at) VALUES
-- PKG-2025-001 timeline (Delivered)
('PKG-2025-001', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '18 days', '09:00 AM', true, 'Colis reçu à notre entrepôt en Turquie', 'Package', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2025-001', 'En Traitement', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '17 days', '02:30 PM', true, 'Colis traité et préparé pour l\'expédition', 'CheckCircle', CURRENT_DATE - INTERVAL '17 days'),
('PKG-2025-001', 'Départ Origine', 'Aéroport Istanbul, Turkey', CURRENT_DATE - INTERVAL '16 days', '11:45 PM', true, 'Colis parti de Turquie', 'Truck', CURRENT_DATE - INTERVAL '16 days'),
('PKG-2025-001', 'En Transit', 'Centre de Distribution Casablanca', CURRENT_DATE - INTERVAL '13 days', '08:20 AM', true, 'Colis arrivé au centre de distribution', 'MapPin', CURRENT_DATE - INTERVAL '13 days'),
('PKG-2025-001', 'En Livraison', 'Casablanca, Morocco', CURRENT_DATE - INTERVAL '12 days', '08:00 AM', true, 'Colis en cours de livraison', 'Truck', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2025-001', 'Livré', 'Votre Adresse, Casablanca', CURRENT_DATE - INTERVAL '12 days', '02:15 PM', true, 'Colis livré avec succès', 'CheckCircle', CURRENT_DATE - INTERVAL '12 days'),

-- PKG-2025-002 timeline (In Transit)
('PKG-2025-002', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '12 days', '10:00 AM', true, 'Colis reçu à l\'entrepôt', 'Package', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2025-002', 'En Traitement', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '11 days', '03:15 PM', true, 'Colis traité pour l\'expédition', 'CheckCircle', CURRENT_DATE - INTERVAL '11 days'),
('PKG-2025-002', 'Départ Origine', 'Aéroport Istanbul, Turkey', CURRENT_DATE - INTERVAL '10 days', '10:30 PM', true, 'Colis parti de Turquie', 'Truck', CURRENT_DATE - INTERVAL '10 days'),
('PKG-2025-002', 'En Transit', 'Centre de Distribution Casablanca', CURRENT_DATE - INTERVAL '5 days', '07:30 AM', true, 'Colis arrivé au centre de distribution', 'MapPin', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2025-002', 'En Livraison', 'Casablanca, Morocco', CURRENT_DATE + INTERVAL '2 days', 'Estimé', false, 'Colis sera en livraison', 'Truck', CURRENT_DATE - INTERVAL '1 day'),

-- PKG-2025-003 timeline (Arrived)
('PKG-2025-003', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '8 days', '08:30 AM', true, 'Colis reçu à l\'entrepôt', 'Package', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2025-003', 'En Traitement', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '7 days', '01:45 PM', true, 'Colis traité pour l\'expédition', 'CheckCircle', CURRENT_DATE - INTERVAL '7 days'),
('PKG-2025-003', 'Départ Origine', 'Aéroport Istanbul, Turkey', CURRENT_DATE - INTERVAL '6 days', '09:15 PM', true, 'Colis parti de Turquie', 'Truck', CURRENT_DATE - INTERVAL '6 days'),
('PKG-2025-003', 'Arrivé Destination', 'Aéroport Casablanca, Morocco', CURRENT_DATE - INTERVAL '2 days', '06:45 AM', true, 'Colis arrivé au Maroc', 'MapPin', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2025-003', 'Dédouanement', 'Douanes Casablanca', CURRENT_DATE - INTERVAL '1 day', '11:20 AM', false, 'Colis en cours de dédouanement', 'Shield', CURRENT_DATE - INTERVAL '1 day'),

-- PKG-2025-004 timeline (Expected)
('PKG-2025-004', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '5 days', '11:00 AM', true, 'Colis reçu à l\'entrepôt', 'Package', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2025-004', 'En Traitement', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '4 days', '04:20 PM', true, 'Colis traité pour l\'expédition', 'CheckCircle', CURRENT_DATE - INTERVAL '4 days'),
('PKG-2025-004', 'Départ Origine', 'Aéroport Istanbul, Turkey', CURRENT_DATE - INTERVAL '3 days', '12:30 AM', true, 'Colis parti de Turquie', 'Truck', CURRENT_DATE - INTERVAL '3 days'),

-- PKG-2025-005 timeline (Processing)
('PKG-2025-005', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '3 days', '09:15 AM', true, 'Colis reçu à l\'entrepôt', 'Package', CURRENT_DATE - INTERVAL '3 days'),
('PKG-2025-005', 'En Traitement', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '2 days', '03:45 PM', false, 'Colis en cours de traitement', 'CheckCircle', CURRENT_DATE - INTERVAL '2 days'),

-- PKG-2025-006 timeline (Expected)
('PKG-2025-006', 'Colis Créé', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '1 day', '10:30 AM', true, 'Colis reçu à l\'entrepôt', 'Package', CURRENT_DATE - INTERVAL '1 day');

-- Insert Payment Requests (Admin creates these)
INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, paid_date, receipt_url, payment_methods, created_at) VALUES
-- Purchase payment requests
('PAY-REQ-001', user_id, 'purchase', 'PR-2025-003', 1650.00, CURRENT_DATE + INTERVAL '3 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'cashplus'], CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-002', user_id, 'purchase', 'PR-2025-004', 950.00, CURRENT_DATE + INTERVAL '7 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-003', user_id, 'purchase', 'PR-2025-005', 1400.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-004', user_id, 'purchase', 'PR-2025-006', 650.00, CURRENT_DATE + INTERVAL '12 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '1 day'),

-- Shipping payment requests
('PAY-REQ-005', user_id, 'shipping', 'PKG-2025-003', 45.00, CURRENT_DATE - INTERVAL '2 days', 'paid', CURRENT_DATE - INTERVAL '3 days', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', ARRAY['attijariwafa-bank'], CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-006', user_id, 'shipping', 'PKG-2025-004', 52.00, CURRENT_DATE + INTERVAL '5 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-007', user_id, 'shipping', 'PKG-2025-005', 90.00, CURRENT_DATE + INTERVAL '8 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-008', user_id, 'shipping', 'PKG-2025-006', 38.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['cashplus', 'wafacash'], CURRENT_DATE - INTERVAL '1 day');

-- Insert Payments (Users submit these)
INSERT INTO payments (id, user_id, payment_request_id, amount, payment_method, transaction_id, payment_proof_url, payment_date, status, admin_notes, verified_at, verified_by, created_at) VALUES
-- Payment for PAY-REQ-005 (shipping - already paid)
('PAY-001', user_id, 'PAY-REQ-005', 45.00, 'attijariwafa-bank', 'TXN-001-2025', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', CURRENT_DATE - INTERVAL '3 days', 'completed', 'Paiement vérifié et traité', CURRENT_DATE - INTERVAL '3 days', 'admin_001', CURRENT_DATE - INTERVAL '3 days'),

-- Payment for PAY-REQ-001 (purchase - pending verification)
('PAY-002', user_id, 'PAY-REQ-001', 1650.00, 'cih-bank', 'TXN-002-2025', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', CURRENT_DATE, 'submitted', NULL, NULL, NULL, CURRENT_DATE);

-- Insert Payment Breakdowns
INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value, created_at) VALUES
-- PAY-REQ-001 breakdown (Samsung purchase)
('PAY-REQ-001', 'items_cost', 1499.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-001', 'service_fee', 15.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-001', 'processing_fee', 7.50, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-001', 'taxes', 28.50, CURRENT_DATE - INTERVAL '8 days'),

-- PAY-REQ-002 breakdown (Nike purchase)
('PAY-REQ-002', 'items_cost', 899.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-002', 'service_fee', 9.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-002', 'processing_fee', 4.50, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-002', 'taxes', 37.50, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-REQ-003 breakdown (PlayStation purchase)
('PAY-REQ-003', 'items_cost', 1299.00, CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-003', 'service_fee', 13.00, CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-003', 'processing_fee', 6.50, CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-003', 'taxes', 81.50, CURRENT_DATE - INTERVAL '3 days'),

-- PAY-REQ-004 breakdown (Apple Watch purchase)
('PAY-REQ-004', 'items_cost', 599.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-004', 'service_fee', 6.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-004', 'processing_fee', 3.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-004', 'taxes', 42.00, CURRENT_DATE - INTERVAL '1 day'),

-- PAY-REQ-005 breakdown (Samsung shipping - paid)
('PAY-REQ-005', 'shipping_cost', 35.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-005', 'insurance', 5.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-005', 'handling_fee', 5.00, CURRENT_DATE - INTERVAL '8 days'),

-- PAY-REQ-006 breakdown (Nike shipping)
('PAY-REQ-006', 'shipping_cost', 40.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-006', 'insurance', 7.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-006', 'handling_fee', 5.00, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-REQ-007 breakdown (PlayStation shipping)
('PAY-REQ-007', 'shipping_cost', 65.00, CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-007', 'insurance', 15.00, CURRENT_DATE - INTERVAL '3 days'),
('PAY-REQ-007', 'handling_fee', 10.00, CURRENT_DATE - INTERVAL '3 days'),

-- PAY-REQ-008 breakdown (Apple Watch shipping)
('PAY-REQ-008', 'shipping_cost', 30.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-008', 'insurance', 5.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-008', 'handling_fee', 3.00, CURRENT_DATE - INTERVAL '1 day');

-- Insert Payment Timeline
INSERT INTO payment_timeline (payment_id, status, date, time, completed, description, created_at) VALUES
-- PAY-001 timeline (completed payment)
('PAY-001', 'soumis', CURRENT_DATE - INTERVAL '3 days', '14:30:00', true, 'Paiement soumis par l\'utilisateur', CURRENT_DATE - INTERVAL '3 days'),
('PAY-001', 'vérifié', CURRENT_DATE - INTERVAL '3 days', '16:45:00', true, 'Paiement vérifié par l\'administrateur', CURRENT_DATE - INTERVAL '3 days'),
('PAY-001', 'terminé', CURRENT_DATE - INTERVAL '3 days', '17:00:00', true, 'Paiement traité et terminé', CURRENT_DATE - INTERVAL '3 days'),

-- PAY-002 timeline (submitted payment)
('PAY-002', 'soumis', CURRENT_DATE, '09:15:00', false, 'Paiement soumis par l\'utilisateur', CURRENT_DATE);

-- Insert Attachments (Realistic files with Unsplash images)
INSERT INTO attachments (user_id, file_url, file_name, file_size, file_type, attachment_type, related_type, related_id, uploaded_at, created_at) VALUES
-- Receipts
(user_id, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'recu-paiement-001.jpg', 245000, 'image/jpeg', 'receipt', 'payment_request', 'PAY-REQ-005', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days'),
(user_id, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'recu-paiement-002.jpg', 189000, 'image/jpeg', 'receipt', 'payment_request', 'PAY-REQ-001', CURRENT_DATE, CURRENT_DATE),

-- Package photos
(user_id, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'iphone-package-001.jpg', 1250000, 'image/jpeg', 'photo', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),
(user_id, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'airpods-package-001.jpg', 980000, 'image/jpeg', 'photo', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),
(user_id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'macbook-package-001.jpg', 2100000, 'image/jpeg', 'photo', 'package', 'PKG-2025-002', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '12 days'),
(user_id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'samsung-package-001.jpg', 1650000, 'image/jpeg', 'photo', 'package', 'PKG-2025-003', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days'),

-- Purchase request photos
(user_id, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'iphone-15-pro-max-001.jpg', 890000, 'image/jpeg', 'photo', 'purchase_request_item', '1', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days'),
(user_id, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'airpods-pro-001.jpg', 650000, 'image/jpeg', 'photo', 'purchase_request_item', '2', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days'),
(user_id, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'nike-jordan-001.jpg', 750000, 'image/jpeg', 'photo', 'purchase_request_item', '4', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days'),
(user_id, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'playstation-5-001.jpg', 1200000, 'image/jpeg', 'photo', 'purchase_request_item', '5', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days'),

-- Documents
(user_id, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'etiquette-expedition-001.pdf', 156000, 'application/pdf', 'document', 'package', 'PKG-2025-001', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE - INTERVAL '17 days'),
(user_id, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'formulaire-douane-001.pdf', 89000, 'application/pdf', 'document', 'package', 'PKG-2025-003', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days');

-- Insert OTP codes (for testing authentication)
INSERT INTO otp_codes (phone_number, code, purpose, expires_at, verified, attempts, max_attempts, created_at) VALUES
('+212667997544', '123456', 'login', CURRENT_TIMESTAMP + INTERVAL '10 minutes', false, 0, 3, CURRENT_TIMESTAMP),
('+212667997544', '654321', 'register', CURRENT_TIMESTAMP + INTERVAL '10 minutes', false, 0, 3, CURRENT_TIMESTAMP);

-- Insert Sessions (for testing authentication)
INSERT INTO sessions (id, user_id, phone_number, session_type, expires_at, created_at, last_accessed, user_agent, ip_address, access_token, refresh_token) VALUES
('session_001', user_id, '+212667997544', 'authenticated', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', 'access_token_001', 'refresh_token_001'),
('session_002', user_id, '+212667997544', 'authenticated', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.101', 'access_token_002', 'refresh_token_002');

-- Update timestamps for realistic data
UPDATE purchase_requests SET updated_at = created_at;
UPDATE packages SET updated_at = created_at;
UPDATE payment_requests SET updated_at = created_at;
UPDATE payments SET updated_at = created_at;
UPDATE attachments SET updated_at = created_at;

END $$;

-- Display summary of seeded data
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
WHERE user_id = 'neon_user_1750733042197_p07n59m8t'; 