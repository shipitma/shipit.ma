import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const sql = getDatabase();
    const warehouses = await sql`SELECT * FROM warehouses ORDER BY country, name`;
    return NextResponse.json({ warehouses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouses', details: error }, { status: 500 });
  }
} 