-- Ensure payment_requests table exists with correct structure
CREATE TABLE IF NOT EXISTS payment_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'purchase',
    related_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    paid_date DATE,
    receipt_url TEXT,
    payment_methods JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure payment_breakdowns table exists
CREATE TABLE IF NOT EXISTS payment_breakdowns (
    id SERIAL PRIMARY KEY,
    payment_request_id VARCHAR(50) NOT NULL,
    item_key VARCHAR(100) NOT NULL,
    item_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_request_id) REFERENCES payment_requests(id) ON DELETE CASCADE
);

-- Add some sample data if none exists
INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, payment_methods)
SELECT 'PAY-001', 'user1', 'purchase', 'PR-001', 150.00, CURRENT_DATE + INTERVAL '7 days', 'pending', '["bank_transfer"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM payment_requests WHERE id = 'PAY-001');

INSERT INTO payment_requests (id, user_id, type, related_id, amount, due_date, status, payment_methods)
SELECT 'PAY-002', 'user1', 'shipping', 'PKG-001', 75.50, CURRENT_DATE + INTERVAL '3 days', 'overdue', '["cashplus"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM payment_requests WHERE id = 'PAY-002');

-- Add sample breakdowns
INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value)
SELECT 'PAY-001', 'items_cost', 120.00
WHERE NOT EXISTS (SELECT 1 FROM payment_breakdowns WHERE payment_request_id = 'PAY-001' AND item_key = 'items_cost');

INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value)
SELECT 'PAY-001', 'service_fee', 20.00
WHERE NOT EXISTS (SELECT 1 FROM payment_breakdowns WHERE payment_request_id = 'PAY-001' AND item_key = 'service_fee');

INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value)
SELECT 'PAY-001', 'taxes', 10.00
WHERE NOT EXISTS (SELECT 1 FROM payment_breakdowns WHERE payment_request_id = 'PAY-001' AND item_key = 'taxes');

INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value)
SELECT 'PAY-002', 'shipping_cost', 65.50
WHERE NOT EXISTS (SELECT 1 FROM payment_breakdowns WHERE payment_request_id = 'PAY-002' AND item_key = 'shipping_cost');

INSERT INTO payment_breakdowns (payment_request_id, item_key, item_value)
SELECT 'PAY-002', 'insurance', 10.00
WHERE NOT EXISTS (SELECT 1 FROM payment_breakdowns WHERE payment_request_id = 'PAY-002' AND item_key = 'insurance');
