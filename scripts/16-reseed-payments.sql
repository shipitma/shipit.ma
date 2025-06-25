-- Drop and Reseed Payment Requests and Payments Tables
-- This script implements the proper architecture where:
-- 1. Admin creates payment_requests (demanding money)
-- 2. Users submit payments (with proof) in response
-- 3. Standardized status codes are used

-- Set the user ID variable
DO $$
DECLARE
    user_id VARCHAR(50) := 'neon_user_1750733042197_p07n59m8t';
BEGIN

-- First, drop existing data (in correct order due to foreign keys)
DELETE FROM payment_timeline;
DELETE FROM payment_breakdowns;
DELETE FROM payments;
DELETE FROM payment_requests;

-- Insert Payment Requests (Admin creates these - demanding money from users)
-- Using standardized status codes: pending, paid, overdue, processing
INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, paid_date, receipt_url, payment_methods, created_at) VALUES
-- Purchase payment requests
('PAY-REQ-001', user_id, 'purchase', 'PR-2024-001', 1350.00, CURRENT_DATE + INTERVAL '3 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-002', user_id, 'purchase', 'PR-2024-003', 1245.00, CURRENT_DATE - INTERVAL '5 days', 'overdue', NULL, NULL, ARRAY['cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '15 days'),
('PAY-REQ-003', user_id, 'purchase', 'PR-2024-004', 1098.00, CURRENT_DATE + INTERVAL '7 days', 'processing', NULL, NULL, ARRAY['cih-bank'], CURRENT_DATE - INTERVAL '3 days'),

-- Shipping payment requests
('PAY-REQ-004', user_id, 'shipping', 'PKG-2024-002', 45.00, CURRENT_DATE - INTERVAL '2 days', 'paid', CURRENT_DATE - INTERVAL '3 days', '/receipts/PAY-REQ-004.pdf', ARRAY['attijariwafa-bank'], CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-005', user_id, 'shipping', 'PKG-2024-004', 65.00, CURRENT_DATE + INTERVAL '5 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cashplus'], CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-006', user_id, 'shipping', 'PKG-2024-005', 75.00, CURRENT_DATE + INTERVAL '10 days', 'pending', NULL, NULL, ARRAY['attijariwafa-bank', 'cih-bank', 'wafacash'], CURRENT_DATE - INTERVAL '2 days'),
('PAY-REQ-007', user_id, 'shipping', 'PKG-2024-006', 60.00, CURRENT_DATE + INTERVAL '12 days', 'pending', NULL, NULL, ARRAY['cashplus', 'wafacash'], CURRENT_DATE - INTERVAL '1 day');

-- Insert Payments (Users submit these in response to payment requests)
-- Using standardized status codes: submitted, verified, rejected, completed
INSERT INTO payments (id, user_id, payment_request_id, amount, payment_method, transaction_id, payment_proof_url, payment_date, status, admin_notes, verified_at, verified_by, created_at) VALUES
-- Payment for PAY-REQ-004 (shipping - already paid)
('PAY-001', user_id, 'PAY-REQ-004', 45.00, 'attijariwafa-bank', 'TXN-001-2024', 'https://blob.vercel-storage.com/payments/payment-proof-001.jpg', CURRENT_DATE - INTERVAL '3 days', 'completed', 'Payment verified and processed', CURRENT_DATE - INTERVAL '3 days', 'admin_001', CURRENT_DATE - INTERVAL '3 days'),

-- Payment for PAY-REQ-003 (purchase - processing)
('PAY-002', user_id, 'PAY-REQ-003', 1098.00, 'cih-bank', 'TXN-002-2024', 'https://blob.vercel-storage.com/payments/payment-proof-002.jpg', CURRENT_DATE - INTERVAL '1 day', 'verified', 'Payment verified, processing purchase', CURRENT_DATE - INTERVAL '1 day', 'admin_001', CURRENT_DATE - INTERVAL '1 day'),

-- Payment for PAY-REQ-001 (purchase - pending verification)
('PAY-003', user_id, 'PAY-REQ-001', 1350.00, 'attijariwafa-bank', 'TXN-003-2024', 'https://blob.vercel-storage.com/payments/payment-proof-003.jpg', CURRENT_DATE, 'submitted', NULL, NULL, NULL, CURRENT_DATE),

-- Payment for PAY-REQ-005 (shipping - pending verification)
('PAY-004', user_id, 'PAY-REQ-005', 65.00, 'cashplus', 'TXN-004-2024', 'https://blob.vercel-storage.com/payments/payment-proof-004.jpg', CURRENT_DATE, 'submitted', NULL, NULL, NULL, CURRENT_DATE);

-- Insert Payment Breakdowns (for payment requests)
INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value, created_at) VALUES
-- PAY-REQ-001 breakdown (iPhone purchase)
('PAY-REQ-001', 'items_cost', 1248.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-001', 'service_fee', 62.40, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-001', 'processing_fee', 24.96, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-001', 'taxes', 14.64, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-REQ-002 breakdown (MacBook purchase - overdue)
('PAY-REQ-002', 'items_cost', 1199.00, CURRENT_DATE - INTERVAL '15 days'),
('PAY-REQ-002', 'service_fee', 23.98, CURRENT_DATE - INTERVAL '15 days'),
('PAY-REQ-002', 'processing_fee', 11.99, CURRENT_DATE - INTERVAL '15 days'),
('PAY-REQ-002', 'taxes', 10.03, CURRENT_DATE - INTERVAL '15 days'),

-- PAY-REQ-003 breakdown (Samsung purchase)
('PAY-REQ-003', 'items_cost', 1098.00, CURRENT_DATE - INTERVAL '3 days'),

-- PAY-REQ-004 breakdown (Clothing shipping - paid)
('PAY-REQ-004', 'shipping_cost', 35.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-004', 'insurance', 5.00, CURRENT_DATE - INTERVAL '8 days'),
('PAY-REQ-004', 'handling_fee', 5.00, CURRENT_DATE - INTERVAL '8 days'),

-- PAY-REQ-005 breakdown (Gaming shipping)
('PAY-REQ-005', 'shipping_cost', 55.00, CURRENT_DATE - INTERVAL '5 days'),
('PAY-REQ-005', 'insurance', 10.00, CURRENT_DATE - INTERVAL '5 days'),

-- PAY-REQ-006 breakdown (Kitchen shipping)
('PAY-REQ-006', 'shipping_cost', 65.00, CURRENT_DATE - INTERVAL '2 days'),
('PAY-REQ-006', 'insurance', 10.00, CURRENT_DATE - INTERVAL '2 days'),

-- PAY-REQ-007 breakdown (Electronics shipping)
('PAY-REQ-007', 'shipping_cost', 50.00, CURRENT_DATE - INTERVAL '1 day'),
('PAY-REQ-007', 'insurance', 10.00, CURRENT_DATE - INTERVAL '1 day');

-- Insert Payment Timeline (using standardized status codes)
INSERT INTO payment_timeline (payment_id, status, date, time, completed, description, created_at) VALUES
-- PAY-001 timeline (completed payment)
('PAY-001', 'submitted', CURRENT_DATE - INTERVAL '3 days', '14:30:00', true, 'Payment submitted by user', CURRENT_DATE - INTERVAL '3 days'),
('PAY-001', 'verified', CURRENT_DATE - INTERVAL '3 days', '16:45:00', true, 'Payment verified by admin', CURRENT_DATE - INTERVAL '3 days'),
('PAY-001', 'completed', CURRENT_DATE - INTERVAL '3 days', '17:00:00', true, 'Payment processed and completed', CURRENT_DATE - INTERVAL '3 days'),

-- PAY-002 timeline (verified payment)
('PAY-002', 'submitted', CURRENT_DATE - INTERVAL '1 day', '11:20:00', true, 'Payment submitted by user', CURRENT_DATE - INTERVAL '1 day'),
('PAY-002', 'verified', CURRENT_DATE - INTERVAL '1 day', '15:30:00', true, 'Payment verified by admin', CURRENT_DATE - INTERVAL '1 day'),

-- PAY-003 timeline (submitted payment)
('PAY-003', 'submitted', CURRENT_DATE, '09:15:00', false, 'Payment submitted by user', CURRENT_DATE),

-- PAY-004 timeline (submitted payment)
('PAY-004', 'submitted', CURRENT_DATE, '13:45:00', false, 'Payment submitted by user', CURRENT_DATE);

-- Update timestamps
UPDATE payment_requests SET updated_at = created_at;
UPDATE payments SET updated_at = created_at;

END $$;

-- Display summary of reseeded data
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
    'Payment Timeline' as table_name,
    COUNT(*) as record_count
FROM payment_timeline pt
JOIN payments p ON pt.payment_id = p.id
WHERE p.user_id = 'neon_user_1750733042197_p07n59m8t'; 