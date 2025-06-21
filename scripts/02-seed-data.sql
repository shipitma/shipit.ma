-- Seed script for package forwarding application
-- This script populates all tables with mock data

-- Insert Users
INSERT INTO users (id, phone_number, first_name, last_name, email, address_line, city, state, zip, country, created_at) VALUES
('USR-001', '+212 123 456 789', 'John', 'Doe', 'john.doe@example.com', '123 Main Street, Apt 4B', 'Casablanca', 'Grand Casablanca', '20000', 'Morocco', '2024-01-01 00:00:00');

-- Insert Purchase Requests
INSERT INTO purchase_requests (id, user_id, date, status, total_amount, payment_due, items_cost, shipping_fee, service_fee, processing_fee, taxes, admin_notes, created_at) VALUES
('PR-001', 'USR-001', '2024-01-15', 'pending_payment', 1299.00, 1350.00, 1248.00, 50.00, 62.40, 24.96, 14.64, 'Items found and available for purchase. Payment required to proceed with order.', '2024-01-15 09:00:00'),
('PR-002', 'USR-001', '2024-01-14', 'confirmed', 245.00, NULL, 200.00, 25.00, 20.00, NULL, NULL, 'Payment confirmed, purchasing items', '2024-01-14 10:00:00'),
('PR-003', 'USR-001', '2024-01-13', 'completed', 1199.00, NULL, 1199.00, NULL, NULL, NULL, NULL, 'Items purchased and shipped to warehouse', '2024-01-13 11:00:00'),
('PR-004', 'USR-001', '2024-01-12', 'purchasing', 1098.00, NULL, 1098.00, NULL, NULL, NULL, NULL, 'Currently purchasing items from suppliers', '2024-01-12 12:00:00'),
('PR-005', 'USR-001', '2024-01-11', 'pending_review', 499.00, NULL, 499.00, NULL, NULL, NULL, NULL, 'Checking availability with suppliers', '2024-01-11 13:00:00'),
('PR-006', 'USR-001', '2024-01-10', 'confirmed', 1299.00, NULL, 1299.00, NULL, NULL, NULL, NULL, 'Payment confirmed, purchasing items', '2024-01-10 14:00:00');

-- Insert Purchase Request Items
INSERT INTO purchase_request_items (purchase_request_id, name, url, price, quantity, image_url, specifications, variant) VALUES
-- PR-001 items
('PR-001', 'iPhone 15 Pro', 'https://apple.com/iphone-15-pro', 999.00, 1, '/placeholder.svg?height=100&width=100', '256GB, Natural Titanium', NULL),
('PR-001', 'AirPods Pro', 'https://apple.com/airpods-pro', 249.00, 1, '/placeholder.svg?height=100&width=100', '2nd Generation with MagSafe Case', NULL),
-- PR-002 items
('PR-002', 'Nike Air Max', 'https://nike.com/air-max', 120.00, 1, NULL, NULL, NULL),
('PR-002', 'Adidas Hoodie', 'https://adidas.com/hoodie', 80.00, 1, NULL, NULL, NULL),
-- PR-003 items
('PR-003', 'MacBook Air M2', 'https://apple.com/macbook-air', 1199.00, 1, NULL, NULL, NULL),
-- PR-004 items
('PR-004', 'Samsung Galaxy S24', 'https://samsung.com/galaxy-s24', 899.00, 1, NULL, NULL, NULL),
('PR-004', 'Galaxy Buds Pro', 'https://samsung.com/galaxy-buds-pro', 199.00, 1, NULL, NULL, NULL),
-- PR-005 items
('PR-005', 'PlayStation 5', 'https://playstation.com/ps5', 499.00, 1, NULL, NULL, NULL),
-- PR-006 items
('PR-006', 'Dell XPS 13', 'https://dell.com/xps-13', 1299.00, 1, NULL, NULL, NULL);

-- Insert Purchase Request Timeline
INSERT INTO purchase_request_timeline (purchase_request_id, status, date, time, completed, description) VALUES
-- PR-001 timeline
('PR-001', 'Request Submitted', '2024-01-15', '09:00:00', true, 'Purchase request submitted by customer'),
('PR-001', 'Under Review', '2024-01-15', '10:30:00', true, 'Admin reviewing item availability and pricing'),
('PR-001', 'Quote Prepared', '2024-01-15', '14:15:00', true, 'Final quote prepared with all fees included'),
('PR-001', 'Payment Pending', '2024-01-15', '14:30:00', false, 'Waiting for customer payment confirmation'),
('PR-001', 'Purchase Confirmed', '2024-01-15', '00:00:00', false, 'Items will be purchased after payment');

-- Insert Packages
INSERT INTO packages (id, user_id, description, status, tracking_number, weight, dimensions, estimated_value, shipping_cost, insurance, progress, eta, carrier, origin, destination, retailer, shipping_method, service, transit_time, tracking_url, insurance_details, created_at) VALUES
('PKG-001', 'USR-001', 'Electronics Package', 'in_transit', 'TK123456789', '2.5 kg', '30x20x15 cm', 1299.00, 45.00, 15.00, 75, 'Jan 20, 2024', 'DHL Express', 'Casablanca, Morocco', 'Istanbul, Turkey', NULL, 'Express Air', 'Express Worldwide', '3-5 business days', 'https://dhl.com/track', 'Included up to $1,500', '2024-01-10 09:00:00'),
('PKG-002', 'USR-001', 'Clothing Package', 'arrived', 'TK987654321', '1.8 kg', '40x30x10 cm', 200.00, 35.00, 5.00, 50, 'Jan 22, 2024', 'UPS', 'Casablanca, Morocco', 'Istanbul, Turkey', NULL, 'Standard Air', 'UPS Standard', '5-7 business days', 'https://ups.com/track', 'Included up to $500', '2024-01-11 10:00:00'),
('PKG-003', 'USR-001', 'Books Package', 'expected', 'TK456789123', '3.2 kg', '35x25x20 cm', 150.00, NULL, 10.00, 25, 'Jan 25, 2024', 'FedEx', 'Casablanca, Morocco', 'Istanbul, Turkey', NULL, 'Economy Air', 'FedEx Economy', '7-10 business days', 'https://fedex.com/track', 'Included up to $300', '2024-01-12 11:00:00'),
('PKG-004', 'USR-001', 'Gaming Package', 'delivered', 'TK789123456', '4.1 kg', '45x35x25 cm', 300.00, 55.00, 15.00, 100, 'Delivered', 'DHL Express', 'Casablanca, Morocco', 'Istanbul, Turkey', NULL, 'Express Air', 'Express Worldwide', '3-5 business days', 'https://dhl.com/track', 'Included up to $1,000', '2024-01-13 12:00:00'),
('PKG-005', 'USR-001', 'Kitchen Package', 'processing', 'TK321654987', '6.8 kg', '50x40x30 cm', 400.00, NULL, 20.00, 10, 'Jan 28, 2024', 'UPS', 'Casablanca, Morocco', 'Istanbul, Turkey', NULL, 'Standard Air', 'UPS Standard', '5-7 business days', 'https://ups.com/track', 'Included up to $800', '2024-01-14 13:00:00');

-- Insert Package Items
INSERT INTO package_items (package_id, name, quantity, value, image_url) VALUES
-- PKG-001 items
('PKG-001', 'iPhone 15 Pro', 1, 999.00, '/placeholder.svg?height=80&width=80'),
('PKG-001', 'AirPods Pro', 1, 249.00, '/placeholder.svg?height=80&width=80'),
('PKG-001', 'Phone Case', 1, 49.00, '/placeholder.svg?height=80&width=80'),
-- PKG-002 items
('PKG-002', 'Nike Shoes', 1, 120.00, NULL),
('PKG-002', 'Adidas Hoodie', 1, 80.00, NULL),
-- PKG-003 items
('PKG-003', 'Programming Books (5x)', 5, 100.00, NULL),
('PKG-003', 'Laptop Stand', 1, 30.00, NULL),
('PKG-003', 'Mouse Pad', 1, 20.00, NULL),
-- PKG-004 items
('PKG-004', 'Gaming Keyboard', 1, 150.00, NULL),
('PKG-004', 'Gaming Mouse', 1, 100.00, NULL),
('PKG-004', 'Mousepad', 1, 50.00, NULL),
-- PKG-005 items
('PKG-005', 'Coffee Maker', 1, 200.00, NULL),
('PKG-005', 'Blender', 1, 150.00, NULL),
('PKG-005', 'Kitchen Scale', 1, 50.00, NULL);

-- Insert Package Timeline
INSERT INTO package_timeline (package_id, status, location, date, time, completed, description, icon) VALUES
-- PKG-001 timeline
('PKG-001', 'Package Created', 'Casablanca, Morocco', '2024-01-10', '09:00 AM', true, 'Package received at our Morocco warehouse', 'Package'),
('PKG-001', 'Processing', 'Casablanca, Morocco', '2024-01-11', '02:30 PM', true, 'Package processed and prepared for shipping', 'CheckCircle'),
('PKG-001', 'Departed Origin', 'Mohammed V Airport, Morocco', '2024-01-12', '11:45 PM', true, 'Package departed from Morocco', 'Truck'),
('PKG-001', 'In Transit', 'Istanbul Distribution Center', '2024-01-15', '08:20 AM', true, 'Package arrived at distribution center', 'MapPin'),
('PKG-001', 'Out for Delivery', 'Istanbul, Turkey', '2024-01-20', 'Estimated', false, 'Package will be out for delivery', 'Truck'),
('PKG-001', 'Delivered', 'Your Address', '2024-01-20', 'Estimated', false, 'Package delivered to recipient', 'CheckCircle');

-- Insert Package Documents
INSERT INTO package_documents (package_id, name, type, size, upload_date, file_url) VALUES
-- PKG-001 documents
('PKG-001', 'Purchase Receipt', 'PDF', '245 KB', '2024-01-10', '#'),
('PKG-001', 'Shipping Label', 'PDF', '156 KB', '2024-01-12', '#'),
('PKG-001', 'Package Photos', 'Images', '2.1 MB', '2024-01-10', '#');

-- Insert Payment Requests
INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, paid_date, receipt_url, created_at) VALUES
('PAY-001', 'USR-001', 'purchase', 'PR-001', 1350.00, '2024-01-20', 'pending', NULL, NULL, '2024-01-15 14:30:00'),
('PAY-002', 'USR-001', 'shipping', 'PKG-002', 45.00, '2024-01-18', 'paid', '2024-01-16', '/receipts/PAY-002.pdf', '2024-01-16 10:00:00'),
('PAY-003', 'USR-001', 'purchase', 'PR-003', 1245.00, '2024-01-15', 'overdue', NULL, NULL, '2024-01-13 11:00:00'),
('PAY-004', 'USR-001', 'shipping', 'PKG-004', 65.00, '2024-01-22', 'pending', NULL, NULL, '2024-01-20 15:00:00'),
('PAY-005', 'USR-001', 'purchase', 'PR-005', 899.00, '2024-01-25', 'paid', '2024-01-20', '/receipts/PAY-005.pdf', '2024-01-20 16:00:00'),
('PAY-006', 'USR-001', 'shipping', 'PKG-006', 35.00, '2024-01-28', 'processing', NULL, NULL, '2024-01-25 17:00:00');

-- Insert Payment Breakdowns
INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value) VALUES
-- PAY-001 breakdown
('PAY-001', 'itemCost', 1248.00),
('PAY-001', 'serviceFee', 62.40),
('PAY-001', 'processingFee', 24.96),
('PAY-001', 'taxes', 14.64),
-- PAY-002 breakdown
('PAY-002', 'shippingCost', 35.00),
('PAY-002', 'insurance', 5.00),
('PAY-002', 'handlingFee', 5.00),
-- PAY-003 breakdown
('PAY-003', 'itemCost', 1199.00),
('PAY-003', 'serviceFee', 23.98),
('PAY-003', 'processingFee', 11.99),
('PAY-003', 'taxes', 10.03),
-- PAY-004 breakdown
('PAY-004', 'shippingCost', 55.00),
('PAY-004', 'insurance', 10.00),
-- PAY-005 breakdown
('PAY-005', 'itemCost', 850.00),
('PAY-005', 'serviceFee', 42.50),
('PAY-005', 'taxes', 6.50),
-- PAY-006 breakdown
('PAY-006', 'shippingCost', 30.00),
('PAY-006', 'handlingFee', 5.00);

-- Insert Payment Methods
INSERT INTO payment_methods (payment_request_id, method) VALUES
-- PAY-001 methods
('PAY-001', 'Bank Transfer'),
('PAY-001', 'Credit Card'),
('PAY-001', 'PayPal'),
-- PAY-002 methods
('PAY-002', 'Bank Transfer'),
-- PAY-003 methods
('PAY-003', 'Bank Transfer'),
('PAY-003', 'Credit Card'),
-- PAY-004 methods
('PAY-004', 'Bank Transfer'),
('PAY-004', 'Credit Card'),
-- PAY-005 methods
('PAY-005', 'Credit Card'),
-- PAY-006 methods
('PAY-006', 'PayPal');

-- Update timestamps for realistic data
UPDATE users SET updated_at = created_at;
UPDATE purchase_requests SET updated_at = created_at;
UPDATE packages SET updated_at = created_at;
UPDATE payment_requests SET updated_at = created_at;
