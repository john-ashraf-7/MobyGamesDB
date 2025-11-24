import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        dir.director_id,
        dir.name,
        dir.overview,
        COUNT(DISTINCT gdir.game_id) as game_count
      FROM director dir
      JOIN game_director gdir ON dir.director_id = gdir.director_id
      GROUP BY dir.director_id, dir.name, dir.overview
      ORDER BY game_count DESC
      LIMIT 5
    `;

    const results = await query(sql);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top directors' },
      { status: 500 }
    );
  }
}
