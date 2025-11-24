const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    const ca = fs.readFileSync(path.join(__dirname, 'ca-certificate.pem'), 'utf8');
    
    const connection = await mysql.createConnection({
      host: 'mysql-9bedf75-mysqlmobygamesdb.k.aivencloud.com',
      port: 26245,
      user: 'avnadmin',
      password: 'AVNS_4eZWwoVd-DwQKrzO6-3',
      database: 'defaultdb',
      ssl: {
        ca: ca,
        rejectUnauthorized: true
      }
    });

    console.log('✅ Connection successful!');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM game');
    console.log('✅ Query successful! Game count:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
}

testConnection();
