import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🚀 Starting comprehensive database setup...');
    console.log('==========================================\n');

    // Step 1: Reset database (drop all tables)
    console.log('🗑️ Step 1: Resetting database...');
    try {
      execSync('npx prisma db push --force-reset', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Database reset completed');
    } catch (error) {
      console.log('⚠️ Database reset failed, continuing with existing schema...');
    }

    // Step 2: Push schema
    console.log('\n📋 Step 2: Pushing schema...');
    try {
      execSync('npx prisma db push', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Schema pushed successfully');
    } catch (error) {
      console.error('❌ Schema push failed:', error.message);
      throw error;
    }

    // Step 3: Generate Prisma client
    console.log('\n🔧 Step 3: Generating Prisma client...');
    try {
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Prisma client generated');
    } catch (error) {
      console.error('❌ Prisma client generation failed:', error.message);
      throw error;
    }

    // Step 4: Run seed script
    console.log('\n🌱 Step 4: Running seed script...');
    try {
      execSync('node scripts/run-seed.js', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Seed script completed');
    } catch (error) {
      console.error('❌ Seed script failed:', error.message);
      throw error;
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('✨ Your MVP is ready with:');
    console.log('   📦 Package forwarding system');
    console.log('   📋 Purchase request management');
    console.log('   📱 Phone-based authentication');
    console.log('   🌍 Multi-language support (French/Arabic)');
    console.log('   📊 Realistic Morocco market data');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 