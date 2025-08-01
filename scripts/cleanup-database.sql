-- Database Cleanup Script
-- Drops all tables and recreates them fresh
-- Run this before seeding with the new schema

-- Drop all tables in the correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS payment_timeline CASCADE;
DROP TABLE IF EXISTS payment_breakdowns CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_requests CASCADE;
DROP TABLE IF EXISTS package_timeline CASCADE;
DROP TABLE IF EXISTS package_items CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS purchase_request_timeline CASCADE;
DROP TABLE IF EXISTS purchase_request_items CASCADE;
DROP TABLE IF EXISTS purchase_requests CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;

-- Reset sequence counters
-- Note: PostgreSQL will automatically recreate sequences when tables are recreated
-- This is just to ensure a clean state

-- Display cleanup confirmation
SELECT 'Database cleanup completed. All tables dropped.' as status; 