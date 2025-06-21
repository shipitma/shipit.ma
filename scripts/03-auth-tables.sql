-- Create authentication tables for OTP and session management

-- OTP codes table for managing verification codes
CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('login', 'register')),
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP
);

-- Sessions table for managing user sessions
CREATE TABLE sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50),
    phone_number VARCHAR(20) NOT NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('authenticated', 'pending_registration')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_otp_codes_phone ON otp_codes(phone_number);
CREATE INDEX idx_otp_codes_code ON otp_codes(code);
CREATE INDEX idx_otp_codes_expires ON otp_codes(expires_at);
CREATE INDEX idx_otp_codes_purpose ON otp_codes(purpose);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_phone ON sessions(phone_number);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_type ON sessions(session_type);

-- Create a function to clean up expired OTP codes and sessions
CREATE OR REPLACE FUNCTION cleanup_expired_auth_data()
RETURNS void AS $$
BEGIN
    -- Delete expired OTP codes
    DELETE FROM otp_codes WHERE expires_at < NOW();
    
    -- Delete expired sessions
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up expired data (optional)
-- This can be run periodically via a cron job instead
-- SELECT cleanup_expired_auth_data();
