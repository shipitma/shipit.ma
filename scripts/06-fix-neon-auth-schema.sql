-- First, let's update existing sessions to have proper tokens
UPDATE sessions 
SET access_token = 'neon_' || encode(
  ('{"sub":"' || COALESCE(user_id, 'temp') || '","phone":"' || phone_number || '","iat":' || 
   extract(epoch from created_at)::bigint || ',"exp":' || 
   (extract(epoch from expires_at)::bigint) || ',"iss":"shipit.ma","aud":"shipit-users"}')::bytea, 
  'base64'
)
WHERE session_type = 'authenticated' AND access_token IS NULL;

-- Update pending registration sessions to have empty access_token
UPDATE sessions 
SET access_token = NULL
WHERE session_type = 'pending_registration';

-- Add refresh tokens to existing authenticated sessions
UPDATE sessions 
SET refresh_token = 'refresh_' || encode(gen_random_bytes(32), 'hex')
WHERE session_type = 'authenticated' AND refresh_token IS NULL;

-- Now add the columns if they don't exist (safe approach)
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_verified') THEN
        ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'access_token') THEN
        ALTER TABLE sessions ADD COLUMN access_token TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'refresh_token') THEN
        ALTER TABLE sessions ADD COLUMN refresh_token TEXT;
    END IF;
END $$;

-- Update existing users to have phone_verified = true (since they passed OTP)
UPDATE users SET phone_verified = true WHERE phone_verified IS NULL OR phone_verified = false;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_number, phone_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_access_token ON sessions(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token) WHERE refresh_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_type ON sessions(user_id, session_type);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Now add the constraint (modified to be less restrictive)
DO $$
BEGIN
    -- Drop constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chk_session_tokens' AND table_name = 'sessions') THEN
        ALTER TABLE sessions DROP CONSTRAINT chk_session_tokens;
    END IF;
    
    -- Add the modified constraint
    ALTER TABLE sessions ADD CONSTRAINT chk_session_tokens 
        CHECK (
            (session_type = 'authenticated' AND access_token IS NOT NULL AND access_token != '') OR 
            (session_type = 'pending_registration')
        );
END $$;

-- Create or replace view for active sessions
DROP VIEW IF EXISTS active_sessions;
CREATE VIEW active_sessions AS
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

-- Clean up any invalid sessions that might cause issues
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- Verify the fix worked
SELECT 
    session_type,
    COUNT(*) as count,
    COUNT(access_token) as with_access_token,
    COUNT(refresh_token) as with_refresh_token
FROM sessions 
GROUP BY session_type;
