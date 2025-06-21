-- Step 1: Enable pgcrypto extension if available, otherwise use alternative
DO $$ 
BEGIN
    -- Try to enable pgcrypto extension
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
    EXCEPTION WHEN OTHERS THEN
        -- If pgcrypto is not available, we'll use alternative methods
        NULL;
    END;
END $$;

-- Step 2: Add columns first (safe approach)
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

-- Step 3: Create a function to generate random strings (compatible alternative)
CREATE OR REPLACE FUNCTION generate_random_string(length INTEGER)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Update existing sessions with proper tokens
UPDATE sessions 
SET access_token = 'neon_' || encode(
  ('{"sub":"' || COALESCE(user_id::text, 'temp_' || id::text) || '","phone":"' || phone_number || '","iat":' || 
   extract(epoch from created_at)::bigint || ',"exp":' || 
   (extract(epoch from expires_at)::bigint) || ',"iss":"shipit.ma","aud":"shipit-users"}')::bytea, 
  'base64'
)
WHERE session_type = 'authenticated' AND (access_token IS NULL OR access_token = '');

-- Step 5: Add refresh tokens using our custom function
UPDATE sessions 
SET refresh_token = 'refresh_' || generate_random_string(64)
WHERE session_type = 'authenticated' AND (refresh_token IS NULL OR refresh_token = '');

-- Step 6: Update existing users to have phone_verified = true
UPDATE users SET phone_verified = true WHERE phone_verified IS NULL OR phone_verified = false;

-- Step 7: Update users updated_at timestamp
UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_number, phone_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_access_token ON sessions(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token) WHERE refresh_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_type ON sessions(user_id, session_type);

-- Step 9: Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Clean up expired sessions
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- Step 12: Add the constraint (after data is properly set)
DO $$
BEGIN
    -- Drop constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chk_session_tokens' AND table_name = 'sessions') THEN
        ALTER TABLE sessions DROP CONSTRAINT chk_session_tokens;
    END IF;
    
    -- Add the constraint (only for authenticated sessions)
    ALTER TABLE sessions ADD CONSTRAINT chk_session_tokens 
        CHECK (
            (session_type = 'authenticated' AND access_token IS NOT NULL AND access_token != '') OR 
            (session_type = 'pending_registration')
        );
END $$;

-- Step 13: Create view for active sessions
DROP VIEW IF EXISTS active_sessions;
CREATE VIEW active_sessions AS
SELECT 
    s.id,
    s.user_id,
    s.phone_number,
    s.session_type,
    s.expires_at,
    s.created_at,
    s.last_accessed,
    s.user_agent,
    s.ip_address,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_verified,
    u.email_verified,
    u.last_login
FROM sessions s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.expires_at > CURRENT_TIMESTAMP;

-- Step 14: Verify the migration
SELECT 
    'Migration Summary' as info,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE phone_verified = true) as verified_users,
    (SELECT COUNT(*) FROM sessions) as total_sessions,
    (SELECT COUNT(*) FROM sessions WHERE session_type = 'authenticated' AND access_token IS NOT NULL) as authenticated_sessions_with_tokens,
    (SELECT COUNT(*) FROM sessions WHERE refresh_token IS NOT NULL) as sessions_with_refresh_tokens;

-- Step 15: Show sample tokens (for verification)
SELECT 
    'Sample Tokens' as info,
    LEFT(access_token, 50) || '...' as sample_access_token,
    LEFT(refresh_token, 20) || '...' as sample_refresh_token
FROM sessions 
WHERE access_token IS NOT NULL 
LIMIT 1;
