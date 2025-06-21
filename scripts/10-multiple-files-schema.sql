-- Create tables for storing multiple file uploads

-- Table for purchase request item photos
CREATE TABLE IF NOT EXISTS purchase_request_item_photos (
  id SERIAL PRIMARY KEY,
  purchase_request_item_id INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (purchase_request_item_id) REFERENCES purchase_request_items(id) ON DELETE CASCADE
);

-- Table for package receipts
CREATE TABLE IF NOT EXISTS package_receipts (
  id SERIAL PRIMARY KEY,
  package_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchase_request_item_photos_item_id ON purchase_request_item_photos(purchase_request_item_id);
CREATE INDEX IF NOT EXISTS idx_package_receipts_package_id ON package_receipts(package_id);

-- Add comments for documentation
COMMENT ON TABLE purchase_request_item_photos IS 'Stores multiple photos for each purchase request item';
COMMENT ON TABLE package_receipts IS 'Stores multiple receipts for each package';
