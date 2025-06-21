-- Add photo_url column to purchase_request_items table
ALTER TABLE purchase_request_items 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add receipt_url column to packages table  
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_purchase_request_items_photo_url ON purchase_request_items(photo_url);
CREATE INDEX IF NOT EXISTS idx_packages_receipt_url ON packages(receipt_url);

-- Add comments for documentation
COMMENT ON COLUMN purchase_request_items.photo_url IS 'URL to uploaded product photo stored in Vercel Blob';
COMMENT ON COLUMN packages.receipt_url IS 'URL to uploaded receipt stored in Vercel Blob';
