import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    // Parse the connection URL and extract components
    const dbUrl = process.env.DATABASE_URL!;
    const url = new URL(dbUrl);
    
    pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results as T[];
  } finally {
    connection.release();
  }
}
