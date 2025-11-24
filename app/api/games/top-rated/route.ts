import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const year = searchParams.get('year');

    let sql = `
      SELECT 
        g.game_id,
        g.name,
        g.release_date,
        g.moby_score,
        YEAR(g.release_date) as year,
        gen.name as genre_name,
        AVG(cr.score) as avg_critic_rating,
        AVG(pr.score) as avg_player_rating,
        COUNT(DISTINCT cr.critic_rating_id) as critic_count,
        COUNT(DISTINCT pr.player_rating_id) as player_count
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre gen ON gg.genre_id = gen.genre_id
      LEFT JOIN critic_rating cr ON g.game_id = cr.game_id
      LEFT JOIN player_rating pr ON g.game_id = pr.game_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (genre) {
      sql += ` AND gen.name = ?`;
      params.push(genre);
    }

    if (year) {
      sql += ` AND YEAR(g.release_date) = ?`;
      params.push(year);
    }

    sql += `
      GROUP BY g.game_id, g.name, g.release_date, g.moby_score, gen.name
      HAVING avg_critic_rating IS NOT NULL OR avg_player_rating IS NOT NULL
      ORDER BY 
        avg_critic_rating DESC,
        avg_player_rating DESC
      LIMIT 10
    `;

    const results = await query(sql, params);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top rated games' },
      { status: 500 }
    );
  }
}
