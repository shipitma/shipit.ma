-- Add payment_methods column to payment_requests table
ALTER TABLE payment_requests 
ADD COLUMN payment_methods TEXT[];

-- Update existing records with default payment methods
UPDATE payment_requests 
SET payment_methods = ARRAY['Bank Transfer', 'Credit Card'] 
WHERE payment_methods IS NULL;
