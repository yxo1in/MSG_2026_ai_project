require('dotenv').config();
const mysql = require('mysql2/promise');
 
async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
 
  console.log('DB 연결 성공, 테이블 생성 시작...');
 
  await connection.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nickname VARCHAR(50),
      latest_code LONGTEXT,
      thumbnail_url VARCHAR(500),
      is_public BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('sessions 테이블 생성 완료');
 
  await connection.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      role ENUM('user', 'assistant') NOT NULL,
      content TEXT NOT NULL,
      code_snapshot LONGTEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);
  console.log('messages 테이블 생성 완료');
 
  await connection.end();
  console.log('마이그레이션 완료!');
}
 
migrate().catch((err) => {
  console.error('마이그레이션 실패:', err);
  process.exit(1);
});