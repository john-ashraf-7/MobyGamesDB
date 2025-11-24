import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');

    let sql = `
      SELECT 
        dev.developer_id,
        dev.name,
        dev.overview,
        gen.name as genre_name,
        AVG(cr.score) as avg_critic_rating,
        COUNT(DISTINCT g.game_id) as game_count
      FROM developer dev
      JOIN game_developer gd ON dev.developer_id = gd.developer_id
      JOIN game g ON gd.game_id = g.game_id
      JOIN game_genre gg ON g.game_id = gg.game_id
      JOIN genre gen ON gg.genre_id = gen.genre_id
      JOIN critic_rating cr ON g.game_id = cr.game_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (genre) {
      sql += ` AND gen.name = ?`;
      params.push(genre);
    }

    sql += `
      GROUP BY dev.developer_id, dev.name, dev.overview, gen.name
      ORDER BY avg_critic_rating DESC
      LIMIT 5
    `;

    const results = await query(sql, params);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top developers' },
      { status: 500 }
    );
  }
}
