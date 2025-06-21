-- Create centralized attachments table for all file uploads
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  attachment_type VARCHAR(50) NOT NULL, -- 'photo', 'receipt', 'document'
  related_type VARCHAR(50), -- 'purchase_request_item', 'package', 'payment'
  related_id VARCHAR(255), -- ID of the related entity
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_attachments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attachments_user_id ON attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_attachments_type ON attachments(attachment_type);
CREATE INDEX IF NOT EXISTS idx_attachments_related ON attachments(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_at ON attachments(uploaded_at);

-- Add comments for documentation
COMMENT ON TABLE attachments IS 'Centralized table for storing all file attachments from Vercel Blob';
COMMENT ON COLUMN attachments.attachment_type IS 'Type of attachment: photo, receipt, document';
COMMENT ON COLUMN attachments.related_type IS 'Type of entity this attachment belongs to';
COMMENT ON COLUMN attachments.related_id IS 'ID of the related entity';
