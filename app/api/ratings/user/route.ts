import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, rating, reviewText } = body;

    if (!userId || !gameId || !rating) {
      return NextResponse.json(
        { error: 'User ID, game ID, and rating are required' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO user_rating (user_id, game_id, rating, review_text)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        rating = VALUES(rating),
        review_text = VALUES(review_text),
        updated_at = NOW()
    `;

    await query(sql, [userId, gameId, rating, reviewText]);

    return NextResponse.json({ 
      success: true, 
      message: 'Rating added successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        ur.user_id,
        ur.game_id,
        ur.rating,
        ur.review_text,
        ur.created_at,
        ur.updated_at,
        g.name as game_name,
        g.moby_score
      FROM user_rating ur
      JOIN game g ON ur.game_id = g.game_id
      WHERE ur.user_id = ?
      ORDER BY ur.created_at DESC
    `;

    const ratings = await query(sql, [userId]);

    return NextResponse.json(ratings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
