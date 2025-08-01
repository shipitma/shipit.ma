# Database Setup & Seeding

This directory contains scripts for setting up and seeding the database with realistic Morocco market data.

## 🚀 Quick Setup

To completely reset and set up your database with fresh data:

```bash
npm run db:setup
```

This command will:
1. Reset the database (drop all tables)
2. Push the current schema
3. Generate the Prisma client
4. Seed with realistic Morocco market data

## 📋 Individual Commands

### Database Reset
```bash
npm run db:reset
```
Drops all tables and recreates them from the current schema.

### Schema Push
```bash
npm run db:push
```
Pushes the current Prisma schema to the database.

### Generate Client
```bash
npm run db:generate
```
Generates the Prisma client from the current schema.

### Seed Data
```bash
npm run db:seed
```
Runs the seed script to populate the database with sample data.

## 📊 Seeded Data

The seed script creates realistic data for a Morocco package forwarding service:

### Users
- Test user with phone number `+212667997544`
- User ID: `neon_user_1750733042197_p07n59m8t`

### Purchase Requests (6 total)
- **Completed**: iPhone 15 Pro Max + AirPods Pro
- **Purchasing**: MacBook Air M2
- **Pending Review**: Samsung Galaxy S24 Ultra, Nike Air Jordan 1, PlayStation 5, Apple Watch Series 9

### Packages (6 total)
- **Delivered**: iPhone 15 Pro Max Package
- **In Transit**: MacBook Air M2 Package
- **Arrived**: Samsung Galaxy S24 Ultra
- **Expected**: Nike Air Jordan 1, Apple Watch Series 9
- **Processing**: PlayStation 5 Gaming Bundle

### Attachments
- Package photos (iPhone, MacBook, Samsung, etc.)
- Purchase request photos
- Documents (shipping labels, customs forms)

### Authentication
- OTP codes for testing login/register
- Active sessions for testing

## 🌍 Localization

All data includes:
- **French content** for the local Morocco market
- **Arabic references** where appropriate
- **Realistic pricing** in MAD (Moroccan Dirham)
- **Local shipping carriers** (DHL, UPS, FedEx)
- **Morocco-specific locations** (Casablanca, etc.)

## 🔧 Schema Changes

The current schema has been simplified by removing:
- Payment models (PaymentRequest, Payment, PaymentBreakdown, PaymentTimeline)
- Payment-related fields from other models
- Payment UI components and routes

This focuses the MVP on core package forwarding functionality.

## 📁 Files

- `18-morocco-seed-no-payments.sql` - Main seed script (no payment models)
- `cleanup-database.sql` - Database cleanup script
- `run-seed.js` - Node.js script to run the seed
- `setup-database.js` - Comprehensive setup script
- `check-current-data.js` - Script to verify current data

## 🧪 Testing

After seeding, you can test the application with:
- Phone number: `+212667997544`
- OTP codes: `123456` (login) or `654321` (register)

The seeded data provides a complete user journey from purchase request to package delivery. 