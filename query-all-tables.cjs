require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function queryAllTables() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔍 Querying all database tables...\n');
    
    // Get all table names
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log('📋 Found Tables:');
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    console.log('');
    
    // Query each table for structure and data
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\n📊 Table: ${tableName.toUpperCase()}`);
      console.log('='.repeat(50));
      
      // Get column information
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position
      `;
      
      console.log('\n🏗️  Structure:');
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
      });
      
      // Get row count
      const countResult = await sql.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = countResult.rows && countResult.rows.length > 0 ? parseInt(countResult.rows[0].count) : 0;
      console.log(`\n📈 Row Count: ${rowCount}`);
      
      // Get sample data (first 5 rows)
      if (rowCount > 0) {
        console.log('\n📄 Sample Data (first 5 rows):');
        const sampleData = await sql.query(`SELECT * FROM "${tableName}" LIMIT 5`);
        console.log(JSON.stringify(sampleData.rows, null, 2));
      } else {
        console.log('\n📄 Sample Data: No data found');
      }
      
      console.log('\n' + '-'.repeat(50));
    }
    
    // Summary
    console.log('\n🎯 Database Summary:');
    console.log(`Total Tables: ${tables.length}`);
    
    let totalRows = 0;
    for (const table of tables) {
      const countResult = await sql.query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
      totalRows += countResult.rows && countResult.rows.length > 0 ? parseInt(countResult.rows[0].count) : 0;
    }
    console.log(`Total Rows: ${totalRows}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

queryAllTables();
