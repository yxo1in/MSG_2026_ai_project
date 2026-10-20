require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // DB(DATETIME)는 UTC 기준으로 저장되므로 UTC로 해석해 올바른 시각을 반환
  timezone: 'Z',
});

module.exports = pool;
