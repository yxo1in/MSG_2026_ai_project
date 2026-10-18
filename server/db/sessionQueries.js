const pool = require('./pool');

// 세션을 만들고 첫 user 메시지를 한 트랜잭션으로 저장
async function createSessionWithPrompt(prompt) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [session] = await conn.query('INSERT INTO sessions () VALUES ()');
    await conn.query(
      `INSERT INTO messages (session_id, role, content) VALUES (?, 'user', ?)`,
      [session.insertId, prompt]
    );
    await conn.commit();
    return session.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { createSessionWithPrompt };
