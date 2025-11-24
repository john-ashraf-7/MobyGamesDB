import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `SELECT developer_id, name FROM developer ORDER BY name`;
    const results = await query(sql);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}
