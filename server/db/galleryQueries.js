const pool = require('./pool');

async function findPublicProjects() {
  const [rows] = await pool.query(
    `SELECT id, nickname, thumbnail_url, created_at
       FROM sessions
      WHERE is_public = ?
      ORDER BY created_at DESC, id DESC`,
    [true]
  );
  return rows;
}

module.exports = { findPublicProjects };
