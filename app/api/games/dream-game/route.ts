import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        GROUP_CONCAT(DISTINCT gen.name) as genres,
        GROUP_CONCAT(DISTINCT s.name) as settings,
        GROUP_CONCAT(DISTINCT dev.name) as developers,
        GROUP_CONCAT(DISTINCT pub.name) as publishers,
        AVG(pr.score) as avg_player_rating,
        COUNT(DISTINCT g.game_id) as game_count
      FROM game g
      JOIN game_genre gg ON g.game_id = gg.game_id
      JOIN genre gen ON gg.genre_id = gen.genre_id
      JOIN game_setting gs ON g.game_id = gs.game_id
      JOIN setting s ON gs.setting_id = s.setting_id
      JOIN game_developer gdev ON g.game_id = gdev.game_id
      JOIN developer dev ON gdev.developer_id = dev.developer_id
      JOIN game_publisher gpub ON g.game_id = gpub.game_id
      JOIN publisher pub ON gpub.publisher_id = pub.publisher_id
      LEFT JOIN player_rating pr ON g.game_id = pr.game_id
      GROUP BY gen.genre_id, s.setting_id, dev.developer_id, pub.publisher_id
      ORDER BY avg_player_rating DESC
      LIMIT 1
    `;

    const results = await query(sql);

    return NextResponse.json(results[0] || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dream game specs' },
      { status: 500 }
    );
  }
}
