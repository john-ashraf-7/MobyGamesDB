import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        p.platform_id,
        p.name as platform_name,
        COUNT(DISTINCT gp.game_id) as game_count,
        AVG(cr.score) as avg_critic_rating,
        AVG(pr.score) as avg_player_rating
      FROM platform p
      LEFT JOIN game_platform gp ON p.platform_id = gp.platform_id
      LEFT JOIN game g ON gp.game_id = g.game_id
      LEFT JOIN critic_rating cr ON g.game_id = cr.game_id
      LEFT JOIN player_rating pr ON g.game_id = pr.game_id
      GROUP BY p.platform_id, p.name
      ORDER BY game_count DESC
    `;

    const results = await query(sql);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    );
  }
}
