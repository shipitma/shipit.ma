-- Create payments table for user payment submissions
-- This table stores the actual payments submitted by users in response to payment_requests

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    payment_request_id VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    payment_proof_url TEXT,
    payment_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    admin_notes TEXT,
    verified_at TIMESTAMP,
    verified_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_request_id) REFERENCES payment_requests(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_request_id ON payments(payment_request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Create payments timeline table for tracking payment status changes
CREATE TABLE IF NOT EXISTS payment_timeline (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Create index for payment timeline
CREATE INDEX IF NOT EXISTS idx_payment_timeline_payment_id ON payment_timeline(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_timeline_status ON payment_timeline(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Add comment to explain the table purpose
COMMENT ON TABLE payments IS 'User payment submissions in response to payment requests';
COMMENT ON TABLE payment_timeline IS 'Timeline tracking for payment status changes'; 