import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, gender, age, birthdate, country, password } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const sql = `
      INSERT INTO app_user (email, username, gender, age, birthdate, country)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [email, username, gender, age, birthdate, country]);

    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully' 
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
