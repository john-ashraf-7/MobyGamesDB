import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        dir.name as director_name,
        dev.name as developer_name,
        COUNT(DISTINCT g.game_id) as collaboration_count,
        GROUP_CONCAT(DISTINCT g.name ORDER BY g.name) as games
      FROM game_director gdir
      JOIN director dir ON gdir.director_id = dir.director_id
      JOIN game g ON gdir.game_id = g.game_id
      JOIN game_developer gdev ON g.game_id = gdev.game_id
      JOIN developer dev ON gdev.developer_id = dev.developer_id
      GROUP BY dir.director_id, dir.name, dev.developer_id, dev.name
      ORDER BY collaboration_count DESC
      LIMIT 5
    `;

    const results = await query(sql);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top collaborations' },
      { status: 500 }
    );
  }
}
