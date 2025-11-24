import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `SELECT DISTINCT YEAR(release_date) as year FROM game WHERE release_date IS NOT NULL ORDER BY year DESC`;
    const results = await query(sql);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch years' },
      { status: 500 }
    );
  }
}
