-- Comprehensive Seed Script for Package Forwarding Application
-- Uses existing user: neon_user_1750733042197_p07n59m8t
-- This script populates all tables with realistic test data

-- Set the user ID variable
DO $$
DECLARE
    user_id VARCHAR(50) := 'neon_user_1750733042197_p07n59m8t';
BEGIN

-- Insert Purchase Requests (various statuses for testing)
INSERT INTO purchase_requests (id, user_id, date, status, total_amount, payment_due, items_cost, shipping_fee, service_fee, processing_fee, taxes, admin_notes, created_at) VALUES
('PR-2024-001', user_id, CURRENT_DATE - INTERVAL '5 days', 'pending_payment', 1299.00, 1350.00, 1248.00, 50.00, 62.40, 24.96, 14.64, 'iPhone 15 Pro and AirPods available. Payment required to proceed.', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-002', user_id, CURRENT_DATE - INTERVAL '10 days', 'confirmed', 245.00, NULL, 200.00, 25.00, 20.00, NULL, NULL, 'Payment confirmed, purchasing Nike shoes and Adidas hoodie', CURRENT_DATE - INTERVAL '10 days'),
('PR-2024-003', user_id, CURRENT_DATE - INTERVAL '15 days', 'completed', 1199.00, NULL, 1199.00, NULL, NULL, NULL, NULL, 'MacBook Air M2 purchased and shipped to warehouse', CURRENT_DATE - INTERVAL '15 days'),
('PR-2024-004', user_id, CURRENT_DATE - INTERVAL '3 days', 'purchasing', 1098.00, NULL, 1098.00, NULL, NULL, NULL, NULL, 'Currently purchasing Samsung Galaxy S24 and Galaxy Buds', CURRENT_DATE - INTERVAL '3 days'),
('PR-2024-005', user_id, CURRENT_DATE - INTERVAL '1 day', 'pending_review', 499.00, NULL, 499.00, NULL, NULL, NULL, NULL, 'Checking PlayStation 5 availability with suppliers', CURRENT_DATE - INTERVAL '1 day'),
('PR-2024-006', user_id, CURRENT_DATE - INTERVAL '20 days', 'cancelled', 1299.00, NULL, 1299.00, NULL, NULL, NULL, NULL, 'Customer requested cancellation', CURRENT_DATE - INTERVAL '20 days');

-- Insert Purchase Request Items
INSERT INTO purchase_request_items (purchase_request_id, name, url, price, quantity, image_url, specifications, variant, created_at) VALUES
-- PR-2024-001 items (iPhone package)
('PR-2024-001', 'iPhone 15 Pro', 'https://www.apple.com/iphone-15-pro/', 999.00, 1, '/placeholder.svg?height=100&width=100', '256GB, Natural Titanium, A17 Pro chip', 'Natural Titanium', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-001', 'AirPods Pro (2nd Generation)', 'https://www.apple.com/airpods-pro/', 249.00, 1, '/placeholder.svg?height=100&width=100', 'Active Noise Cancellation, Spatial Audio', 'White', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-001', 'iPhone 15 Pro Case', 'https://www.apple.com/shop/product/MM2Y3ZM/A/iphone-15-pro-leather-case-with-magsafe', 49.00, 1, '/placeholder.svg?height=100&width=100', 'FineWoven case with MagSafe', 'Black', CURRENT_DATE - INTERVAL '5 days'),

-- PR-2024-002 items (Clothing)
('PR-2024-002', 'Nike Air Max 270', 'https://www.nike.com/t/air-max-270-shoes-KkLcGR', 120.00, 1, '/placeholder.svg?height=100&width=100', 'Size 42, Black/White', 'Black/White', CURRENT_DATE - INTERVAL '10 days'),
('PR-2024-002', 'Adidas Originals Hoodie', 'https://www.adidas.com/us/originals-hoodie/HP8459.html', 80.00, 1, '/placeholder.svg?height=100&width=100', 'Size L, Grey', 'Grey', CURRENT_DATE - INTERVAL '10 days'),

-- PR-2024-003 items (MacBook)
('PR-2024-003', 'MacBook Air M2', 'https://www.apple.com/macbook-air-m2/', 1199.00, 1, '/placeholder.svg?height=100&width=100', '13-inch, 8GB RAM, 256GB SSD, Midnight', 'Midnight', CURRENT_DATE - INTERVAL '15 days'),

-- PR-2024-004 items (Samsung package)
('PR-2024-004', 'Samsung Galaxy S24 Ultra', 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/', 899.00, 1, '/placeholder.svg?height=100&width=100', '256GB, Titanium Gray', 'Titanium Gray', CURRENT_DATE - INTERVAL '3 days'),
('PR-2024-004', 'Samsung Galaxy Buds2 Pro', 'https://www.samsung.com/us/audio-sound/galaxy-buds2-pro/', 199.00, 1, '/placeholder.svg?height=100&width=100', 'Active Noise Cancellation, Graphite', 'Graphite', CURRENT_DATE - INTERVAL '3 days'),

-- PR-2024-005 items (Gaming)
('PR-2024-005', 'PlayStation 5 Console', 'https://www.playstation.com/en-us/ps5/', 499.00, 1, '/placeholder.svg?height=100&width=100', 'Disc Edition, White', 'Disc Edition', CURRENT_DATE - INTERVAL '1 day'),

-- PR-2024-006 items (Cancelled)
('PR-2024-006', 'Dell XPS 13 Plus', 'https://www.dell.com/en-us/shop/laptops/xps-13-plus/spd/xps-13-9320-laptop', 1299.00, 1, '/placeholder.svg?height=100&width=100', '13.4-inch, 16GB RAM, 512GB SSD', 'Platinum Silver', CURRENT_DATE - INTERVAL '20 days');

-- Insert Purchase Request Timeline
INSERT INTO purchase_request_timeline (purchase_request_id, status, date, time, completed, description, created_at) VALUES
-- PR-2024-001 timeline
('PR-2024-001', 'Request Submitted', CURRENT_DATE - INTERVAL '5 days', '09:00:00', true, 'Purchase request submitted by customer', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-001', 'Under Review', CURRENT_DATE - INTERVAL '5 days', '10:30:00', true, 'Admin reviewing item availability and pricing', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-001', 'Quote Prepared', CURRENT_DATE - INTERVAL '5 days', '14:15:00', true, 'Final quote prepared with all fees included', CURRENT_DATE - INTERVAL '5 days'),
('PR-2024-001', 'Payment Pending', CURRENT_DATE - INTERVAL '5 days', '14:30:00', false, 'Waiting for customer payment confirmation', CURRENT_DATE - INTERVAL '5 days'),

-- PR-2024-002 timeline
('PR-2024-002', 'Request Submitted', CURRENT_DATE - INTERVAL '10 days', '11:00:00', true, 'Purchase request submitted', CURRENT_DATE - INTERVAL '10 days'),
('PR-2024-002', 'Payment Confirmed', CURRENT_DATE - INTERVAL '9 days', '15:20:00', true, 'Payment received, proceeding with purchase', CURRENT_DATE - INTERVAL '9 days'),
('PR-2024-002', 'Purchasing', CURRENT_DATE - INTERVAL '8 days', '09:15:00', true, 'Items being purchased from suppliers', CURRENT_DATE - INTERVAL '8 days'),

-- PR-2024-003 timeline
('PR-2024-003', 'Request Submitted', CURRENT_DATE - INTERVAL '15 days', '13:00:00', true, 'Purchase request submitted', CURRENT_DATE - INTERVAL '15 days'),
('PR-2024-003', 'Payment Confirmed', CURRENT_DATE - INTERVAL '14 days', '16:45:00', true, 'Payment received', CURRENT_DATE - INTERVAL '14 days'),
('PR-2024-003', 'Purchasing', CURRENT_DATE - INTERVAL '13 days', '10:30:00', true, 'MacBook Air being purchased', CURRENT_DATE - INTERVAL '13 days'),
('PR-2024-003', 'Completed', CURRENT_DATE - INTERVAL '12 days', '14:20:00', true, 'Items purchased and shipped to warehouse', CURRENT_DATE - INTERVAL '12 days'),

-- PR-2024-004 timeline
('PR-2024-004', 'Request Submitted', CURRENT_DATE - INTERVAL '3 days', '08:30:00', true, 'Purchase request submitted', CURRENT_DATE - INTERVAL '3 days'),
('PR-2024-004', 'Payment Confirmed', CURRENT_DATE - INTERVAL '2 days', '11:15:00', true, 'Payment received', CURRENT_DATE - INTERVAL '2 days'),
('PR-2024-004', 'Purchasing', CURRENT_DATE - INTERVAL '1 day', '09:00:00', false, 'Currently purchasing Samsung devices', CURRENT_DATE - INTERVAL '1 day'),

-- PR-2024-005 timeline
('PR-2024-005', 'Request Submitted', CURRENT_DATE - INTERVAL '1 day', '16:00:00', true, 'Purchase request submitted', CURRENT_DATE - INTERVAL '1 day'),
('PR-2024-005', 'Under Review', CURRENT_DATE - INTERVAL '1 day', '17:30:00', false, 'Checking PlayStation 5 availability', CURRENT_DATE - INTERVAL '1 day'),

-- PR-2024-006 timeline (Cancelled)
('PR-2024-006', 'Request Submitted', CURRENT_DATE - INTERVAL '20 days', '10:00:00', true, 'Purchase request submitted', CURRENT_DATE - INTERVAL '20 days'),
('PR-2024-006', 'Cancelled', CURRENT_DATE - INTERVAL '19 days', '14:00:00', true, 'Customer requested cancellation', CURRENT_DATE - INTERVAL '19 days');

-- Insert Packages (various statuses) - CORRECTED: Turkey to Morocco
INSERT INTO packages (id, user_id, description, status, tracking_number, weight, dimensions, estimated_value, shipping_cost, insurance, progress, eta, carrier, origin, destination, retailer, shipping_method, service, transit_time, tracking_url, insurance_details, created_at) VALUES
('PKG-2024-001', user_id, 'iPhone 15 Pro Package', 'in_transit', 'DHL123456789', '2.5 kg', '30x20x15 cm', 1299.00, 45.00, 15.00, 75, 'Jan 25, 2024', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'Express Worldwide', '3-5 business days', 'https://www.dhl.com/track?AWB=DHL123456789', 'Included up to $1,500', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2024-002', user_id, 'Clothing Package', 'arrived', 'UPS987654321', '1.8 kg', '40x30x10 cm', 200.00, 35.00, 5.00, 50, 'Jan 28, 2024', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Nike Store', 'Standard Air', 'UPS Standard', '5-7 business days', 'https://www.ups.com/track?loc=en_US&tracknum=UPS987654321', 'Included up to $500', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2024-003', user_id, 'MacBook Air Package', 'delivered', 'FED456789123', '3.2 kg', '35x25x20 cm', 1199.00, 55.00, 20.00, 100, 'Delivered', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Apple Store', 'Express Air', 'FedEx Express', '3-5 business days', 'https://www.fedex.com/fedextrack/?trknbr=FED456789123', 'Included up to $1,200', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2024-004', user_id, 'Gaming Package', 'expected', 'DHL789123456', '4.1 kg', '45x35x25 cm', 300.00, 65.00, 15.00, 25, 'Feb 2, 2024', 'DHL Express', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Amazon', 'Express Air', 'Express Worldwide', '3-5 business days', 'https://www.dhl.com/track?AWB=DHL789123456', 'Included up to $1,000', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2024-005', user_id, 'Kitchen Appliances', 'processing', 'UPS321654987', '6.8 kg', '50x40x30 cm', 400.00, 75.00, 20.00, 10, 'Feb 5, 2024', 'UPS', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Best Buy', 'Standard Air', 'UPS Standard', '5-7 business days', 'https://www.ups.com/track?loc=en_US&tracknum=UPS321654987', 'Included up to $800', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2024-006', user_id, 'Electronics Bundle', 'expected', 'FED654321987', '5.2 kg', '40x30x25 cm', 899.00, 60.00, 18.00, 15, 'Feb 8, 2024', 'FedEx', 'Istanbul, Turkey', 'Casablanca, Morocco', 'Samsung Store', 'Express Air', 'FedEx Express', '3-5 business days', 'https://www.fedex.com/fedextrack/?trknbr=FED654321987', 'Included up to $900', CURRENT_DATE - INTERVAL '1 day');

-- Insert Package Items
INSERT INTO package_items (package_id, name, quantity, value, image_url, created_at) VALUES
-- PKG-2024-001 items (iPhone package)
('PKG-2024-001', 'iPhone 15 Pro', 1, 999.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2024-001', 'AirPods Pro (2nd Generation)', 1, 249.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2024-001', 'iPhone 15 Pro Case', 1, 49.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '8 days'),

-- PKG-2024-002 items (Clothing)
('PKG-2024-002', 'Nike Air Max 270', 1, 120.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2024-002', 'Adidas Originals Hoodie', 1, 80.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '12 days'),

-- PKG-2024-003 items (MacBook)
('PKG-2024-003', 'MacBook Air M2', 1, 1199.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '18 days'),

-- PKG-2024-004 items (Gaming)
('PKG-2024-004', 'Gaming Keyboard', 1, 150.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2024-004', 'Gaming Mouse', 1, 100.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2024-004', 'Gaming Mousepad', 1, 50.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '5 days'),

-- PKG-2024-005 items (Kitchen)
('PKG-2024-005', 'Coffee Maker', 1, 200.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2024-005', 'Blender', 1, 150.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2024-005', 'Kitchen Scale', 1, 50.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '2 days'),

-- PKG-2024-006 items (Samsung)
('PKG-2024-006', 'Samsung Galaxy S24 Ultra', 1, 899.00, '/placeholder.svg?height=80&width=80', CURRENT_DATE - INTERVAL '1 day');

-- Insert Package Timeline - CORRECTED: Turkey to Morocco flow
INSERT INTO package_timeline (package_id, status, location, date, time, completed, description, icon, created_at) VALUES
-- PKG-2024-001 timeline (In Transit)
('PKG-2024-001', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '8 days', '09:00 AM', true, 'Package received at our Turkey warehouse', 'Package', CURRENT_DATE - INTERVAL '8 days'),
('PKG-2024-001', 'Processing', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '7 days', '02:30 PM', true, 'Package processed and prepared for shipping', 'CheckCircle', CURRENT_DATE - INTERVAL '7 days'),
('PKG-2024-001', 'Departed Origin', 'Istanbul Airport, Turkey', CURRENT_DATE - INTERVAL '6 days', '11:45 PM', true, 'Package departed from Turkey', 'Truck', CURRENT_DATE - INTERVAL '6 days'),
('PKG-2024-001', 'In Transit', 'Casablanca Distribution Center', CURRENT_DATE - INTERVAL '3 days', '08:20 AM', true, 'Package arrived at distribution center', 'MapPin', CURRENT_DATE - INTERVAL '3 days'),
('PKG-2024-001', 'Out for Delivery', 'Casablanca, Morocco', CURRENT_DATE + INTERVAL '2 days', 'Estimated', false, 'Package will be out for delivery', 'Truck', CURRENT_DATE - INTERVAL '1 day'),

-- PKG-2024-002 timeline (Arrived)
('PKG-2024-002', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '12 days', '10:00 AM', true, 'Package received at warehouse', 'Package', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2024-002', 'Processing', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '11 days', '03:15 PM', true, 'Package processed for shipping', 'CheckCircle', CURRENT_DATE - INTERVAL '11 days'),
('PKG-2024-002', 'Departed Origin', 'Istanbul Airport, Turkey', CURRENT_DATE - INTERVAL '10 days', '10:30 PM', true, 'Package departed Turkey', 'Truck', CURRENT_DATE - INTERVAL '10 days'),
('PKG-2024-002', 'Arrived at Destination', 'Casablanca Airport, Morocco', CURRENT_DATE - INTERVAL '2 days', '06:45 AM', true, 'Package arrived in Morocco', 'MapPin', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2024-002', 'Customs Clearance', 'Casablanca Customs', CURRENT_DATE - INTERVAL '1 day', '11:20 AM', false, 'Package undergoing customs clearance', 'Shield', CURRENT_DATE - INTERVAL '1 day'),

-- PKG-2024-003 timeline (Delivered)
('PKG-2024-003', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '18 days', '08:30 AM', true, 'Package received at warehouse', 'Package', CURRENT_DATE - INTERVAL '18 days'),
('PKG-2024-003', 'Processing', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '17 days', '01:45 PM', true, 'Package processed for shipping', 'CheckCircle', CURRENT_DATE - INTERVAL '17 days'),
('PKG-2024-003', 'Departed Origin', 'Istanbul Airport, Turkey', CURRENT_DATE - INTERVAL '16 days', '09:15 PM', true, 'Package departed Turkey', 'Truck', CURRENT_DATE - INTERVAL '16 days'),
('PKG-2024-003', 'In Transit', 'Casablanca Distribution Center', CURRENT_DATE - INTERVAL '13 days', '07:30 AM', true, 'Package arrived at distribution center', 'MapPin', CURRENT_DATE - INTERVAL '13 days'),
('PKG-2024-003', 'Out for Delivery', 'Casablanca, Morocco', CURRENT_DATE - INTERVAL '12 days', '08:00 AM', true, 'Package out for delivery', 'Truck', CURRENT_DATE - INTERVAL '12 days'),
('PKG-2024-003', 'Delivered', 'Your Address, Casablanca', CURRENT_DATE - INTERVAL '12 days', '02:15 PM', true, 'Package successfully delivered', 'CheckCircle', CURRENT_DATE - INTERVAL '12 days'),

-- PKG-2024-004 timeline (Expected)
('PKG-2024-004', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '5 days', '11:00 AM', true, 'Package received at warehouse', 'Package', CURRENT_DATE - INTERVAL '5 days'),
('PKG-2024-004', 'Processing', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '4 days', '04:20 PM', true, 'Package processed for shipping', 'CheckCircle', CURRENT_DATE - INTERVAL '4 days'),
('PKG-2024-004', 'Departed Origin', 'Istanbul Airport, Turkey', CURRENT_DATE - INTERVAL '3 days', '12:30 AM', true, 'Package departed Turkey', 'Truck', CURRENT_DATE - INTERVAL '3 days'),

-- PKG-2024-005 timeline (Processing)
('PKG-2024-005', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '2 days', '09:15 AM', true, 'Package received at warehouse', 'Package', CURRENT_DATE - INTERVAL '2 days'),
('PKG-2024-005', 'Processing', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '1 day', '03:45 PM', false, 'Package being processed for shipping', 'CheckCircle', CURRENT_DATE - INTERVAL '1 day'),

-- PKG-2024-006 timeline (Expected)
('PKG-2024-006', 'Package Created', 'Istanbul, Turkey', CURRENT_DATE - INTERVAL '1 day', '10:30 AM', true, 'Package received at warehouse', 'Package', CURRENT_DATE - INTERVAL '1 day');

-- Insert Payment Requests (various statuses) - FIXED: Using proper PostgreSQL array syntax
INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, paid_date, receipt_url, payment_methods, created_at) VALUES
('PAY-2024-001', user_id, 'purchase', 'PR-2024-001', 1350.00, CURRENT_DATE + INTERVAL '3 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-002', user_id, 'shipping', 'PKG-2024-002', 45.00, CURRENT_DATE - INTERVAL '2 days', 'paid', CURRENT_DATE - INTERVAL '3 days', '/receipts/PAY-2024-002.pdf', ARRAY['attijariwafa-bank'], CURRENT_DATE - INTERVAL '8 days'),
('PAY-2024-003', user_id, 'purchase', 'PR-2024-003', 1245.00, CURRENT_DATE - INTERVAL '5 days', 'overdue', NULL, NULL, ARRAY['cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '15 days'),
('PAY-2024-004', user_id, 'shipping', 'PKG-2024-004', 65.00, CURRENT_DATE + INTERVAL '5 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-005', user_id, 'purchase', 'PR-2024-004', 1098.00, CURRENT_DATE + INTERVAL '7 days', 'processing', NULL, NULL, ARRAY['cih-bank'], CURRENT_DATE - INTERVAL '3 days'),
('PAY-2024-006', user_id, 'shipping', 'PKG-2024-005', 75.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '2 days'),
('PAY-2024-007', user_id, 'shipping', 'PKG-2024-006', 60.00, CURRENT_DATE + INTERVAL '12 days', 'pending', NULL, NULL, ARRAY['cashplus', 'wafacash'], CURRENT_DATE - INTERVAL '1 day');

-- Insert Payment Breakdowns
INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value, created_at) VALUES
-- PAY-2024-001 breakdown (iPhone purchase)
('PAY-2024-001', 'items_cost', 1248.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-001', 'service_fee', 62.40, CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-001', 'processing_fee', 24.96, CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-001', 'taxes', 14.64, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-2024-002 breakdown (Clothing shipping)
('PAY-2024-002', 'shipping_cost', 35.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-2024-002', 'insurance', 5.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-2024-002', 'handling_fee', 5.00, CURRENT_DATE - INTERVAL '8 days'),

-- PAY-2024-003 breakdown (MacBook purchase - overdue)
('PAY-2024-003', 'items_cost', 1199.00, CURRENT_DATE - INTERVAL '15 days'),
('PAY-2024-003', 'service_fee', 23.98, CURRENT_DATE - INTERVAL '15 days'),
('PAY-2024-003', 'processing_fee', 11.99, CURRENT_DATE - INTERVAL '15 days'),
('PAY-2024-003', 'taxes', 10.03, CURRENT_DATE - INTERVAL '15 days'),

-- PAY-2024-004 breakdown (Gaming shipping)
('PAY-2024-004', 'shipping_cost', 55.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-2024-004', 'insurance', 10.00, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-2024-005 breakdown (Samsung purchase)
('PAY-2024-005', 'items_cost', 1098.00, CURRENT_DATE - INTERVAL '3 days'),

-- PAY-2024-006 breakdown (Kitchen shipping)
('PAY-2024-006', 'shipping_cost', 65.00, CURRENT_DATE - INTERVAL '2 days'),
('PAY-2024-006', 'insurance', 10.00, CURRENT_DATE - INTERVAL '2 days'),

-- PAY-2024-007 breakdown (Electronics shipping)
('PAY-2024-007', 'shipping_cost', 50.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-2024-007', 'insurance', 10.00, CURRENT_DATE - INTERVAL '1 day');

-- Insert Attachments (sample files)
INSERT INTO attachments (user_id, file_url, file_name, file_size, file_type, attachment_type, related_type, related_id, uploaded_at, created_at) VALUES
-- Receipts
(user_id, 'https://blob.vercel-storage.com/receipts/receipt-001.pdf', 'receipt-001.pdf', 245000, 'application/pdf', 'receipt', 'payment_request', 'PAY-2024-002', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days'),
(user_id, 'https://blob.vercel-storage.com/receipts/receipt-002.pdf', 'receipt-002.pdf', 189000, 'application/pdf', 'receipt', 'payment_request', 'PAY-2024-005', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day'),

-- Package photos
(user_id, 'https://blob.vercel-storage.com/photos/iphone-package-001.jpg', 'iphone-package-001.jpg', 1250000, 'image/jpeg', 'photo', 'package', 'PKG-2024-001', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days'),
(user_id, 'https://blob.vercel-storage.com/photos/iphone-package-002.jpg', 'iphone-package-002.jpg', 980000, 'image/jpeg', 'photo', 'package', 'PKG-2024-001', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days'),
(user_id, 'https://blob.vercel-storage.com/photos/macbook-package-001.jpg', 'macbook-package-001.jpg', 2100000, 'image/jpeg', 'photo', 'package', 'PKG-2024-003', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),

-- Purchase request photos
(user_id, 'https://blob.vercel-storage.com/photos/iphone-15-pro-001.jpg', 'iphone-15-pro-001.jpg', 890000, 'image/jpeg', 'photo', 'purchase_request_item', '1', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days'),
(user_id, 'https://blob.vercel-storage.com/photos/airpods-pro-001.jpg', 'airpods-pro-001.jpg', 650000, 'image/jpeg', 'photo', 'purchase_request_item', '2', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days'),

-- Documents
(user_id, 'https://blob.vercel-storage.com/documents/shipping-label-001.pdf', 'shipping-label-001.pdf', 156000, 'application/pdf', 'document', 'package', 'PKG-2024-001', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '7 days'),
(user_id, 'https://blob.vercel-storage.com/documents/customs-form-001.pdf', 'customs-form-001.pdf', 89000, 'application/pdf', 'document', 'package', 'PKG-2024-002', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '11 days');

-- Insert OTP codes (for testing authentication)
INSERT INTO otp_codes (phone_number, code, purpose, expires_at, verified, attempts, max_attempts, created_at) VALUES
('+212 123 456 789', '123456', 'login', CURRENT_TIMESTAMP + INTERVAL '10 minutes', false, 0, 3, CURRENT_TIMESTAMP),
('+212 123 456 789', '654321', 'register', CURRENT_TIMESTAMP + INTERVAL '10 minutes', false, 0, 3, CURRENT_TIMESTAMP);

-- Insert Sessions (for testing authentication)
INSERT INTO sessions (id, user_id, phone_number, session_type, expires_at, created_at, last_accessed, user_agent, ip_address, access_token, refresh_token) VALUES
('session_001', user_id, '+212 123 456 789', 'authenticated', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', 'access_token_001', 'refresh_token_001'),
('session_002', user_id, '+212 123 456 789', 'authenticated', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.101', 'access_token_002', 'refresh_token_002');

-- Update timestamps for realistic data
UPDATE purchase_requests SET updated_at = created_at;
UPDATE packages SET updated_at = created_at;
UPDATE payment_requests SET updated_at = created_at;
UPDATE attachments SET updated_at = created_at;

-- Seed data for warehouses
INSERT INTO warehouses (name, country, address_line, city, state, zip, phone, notes)
VALUES
  ('Turkey Warehouse', 'Turkey', 'Atatürk Mahallesi, İstanbul Caddesi No: 123', 'Kadıköy', NULL, '34710', '+90 212 555 0123', 'Incluez toujours votre nom complet comme destinataire.'),
  ('France Warehouse', 'France', '12 Rue de la Logistique', 'Paris', NULL, '75010', '+33 1 23 45 67 89', 'Incluez toujours votre nom complet comme destinataire.'),
  ('Spain Warehouse', 'Spain', 'Calle de la Logística, 45', 'Madrid', NULL, '28001', '+34 91 234 5678', 'Incluez toujours votre nom complet comme destinataire.'),
  ('USA Warehouse', 'USA', '1234 Shipping Lane, Suite 100', 'Miami', 'FL', '33101', '+1 305 123 4567', 'Always include your full name as the recipient.');

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
    'Attachments' as table_name,
    COUNT(*) as record_count
FROM attachments 
WHERE user_id = 'neon_user_1750733042197_p07n59m8t';