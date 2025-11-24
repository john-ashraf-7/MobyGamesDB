import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const platform = searchParams.get('platform');
    const publisher = searchParams.get('publisher');
    const developer = searchParams.get('developer');

    let sql = `
      SELECT DISTINCT
        g.game_id,
        g.name,
        g.release_date,
        g.moby_score,
        g.description,
        GROUP_CONCAT(DISTINCT gen.name) as genres,
        GROUP_CONCAT(DISTINCT p.name) as platforms,
        GROUP_CONCAT(DISTINCT pub.name) as publishers,
        GROUP_CONCAT(DISTINCT dev.name) as developers
      FROM game g
      LEFT JOIN game_genre gg ON g.game_id = gg.game_id
      LEFT JOIN genre gen ON gg.genre_id = gen.genre_id
      LEFT JOIN game_platform gp ON g.game_id = gp.game_id
      LEFT JOIN platform p ON gp.platform_id = p.platform_id
      LEFT JOIN game_publisher gpub ON g.game_id = gpub.game_id
      LEFT JOIN publisher pub ON gpub.publisher_id = pub.publisher_id
      LEFT JOIN game_developer gdev ON g.game_id = gdev.game_id
      LEFT JOIN developer dev ON gdev.developer_id = dev.developer_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (genre) {
      sql += ` AND gen.name = ?`;
      params.push(genre);
    }

    if (platform) {
      sql += ` AND p.name = ?`;
      params.push(platform);
    }

    if (publisher) {
      sql += ` AND pub.name = ?`;
      params.push(publisher);
    }

    if (developer) {
      sql += ` AND dev.name = ?`;
      params.push(developer);
    }

    sql += `
      GROUP BY g.game_id, g.name, g.release_date, g.moby_score, g.description
      ORDER BY g.moby_score DESC, g.name
    `;

    const results = await query(sql, params);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
