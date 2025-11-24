import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const setting = searchParams.get('setting');

    let sql = `
      SELECT 
        g.game_id,
        g.name,
        g.moby_score,
        g.release_date,
        gen.name as genre_name,
        s.name as setting_name
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre gen ON gg.genre_id = gen.genre_id
      LEFT JOIN game_setting gs ON g.game_id = gs.game_id
      LEFT JOIN setting s ON gs.setting_id = s.setting_id
      WHERE g.moby_score IS NOT NULL
    `;

    const params: any[] = [];

    if (genre) {
      sql += ` AND gen.name = ?`;
      params.push(genre);
    }

    if (setting) {
      sql += ` AND s.name = ?`;
      params.push(setting);
    }

    sql += `
      ORDER BY g.moby_score DESC
      LIMIT 5
    `;

    const results = await query(sql, params);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top games by moby score' },
      { status: 500 }
    );
  }
}
