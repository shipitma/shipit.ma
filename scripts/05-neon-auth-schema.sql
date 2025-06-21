-- Update users table for Neon Auth compatibility
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update sessions table for Neon Auth compatibility
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS access_token TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS refresh_token TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_number, phone_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified);
CREATE INDEX IF NOT EXISTS idx_sessions_access_token ON sessions(access_token);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_type ON sessions(user_id, session_type);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints for data integrity
ALTER TABLE sessions ADD CONSTRAINT chk_session_tokens 
    CHECK (
        (session_type = 'authenticated' AND access_token IS NOT NULL) OR 
        (session_type = 'pending_registration')
    );

-- Create view for active sessions
CREATE OR REPLACE VIEW active_sessions AS
SELECT 
    s.*,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_verified,
    u.email_verified
FROM sessions s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.expires_at > CURRENT_TIMESTAMP;

COMMENT ON VIEW active_sessions IS 'View of all active user sessions with user details';
