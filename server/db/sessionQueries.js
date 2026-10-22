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

async function sessionExists(id) {
  const [rows] = await pool.query('SELECT 1 FROM sessions WHERE id = ?', [id]);
  return rows.length > 0;
}

async function findLatestCode(sessionId) {
  const [[row]] = await pool.query('SELECT latest_code FROM sessions WHERE id = ?', [sessionId]);
  return row?.latest_code ?? null;
}

async function findMessages(sessionId) {
  const [rows] = await pool.query(
    `SELECT id, role, content, created_at
       FROM messages
      WHERE session_id = ?
      ORDER BY created_at ASC, id ASC`,
    [sessionId]
  );
  return rows;
}

async function addMessage(sessionId, role, content, codeSnapshot = null) {
  const [result] = await pool.query(
    `INSERT INTO messages (session_id, role, content, code_snapshot) VALUES (?, ?, ?, ?)`,
    [sessionId, role, content, codeSnapshot]
  );
  const [[row]] = await pool.query(
    'SELECT id, role, content, created_at FROM messages WHERE id = ?',
    [result.insertId]
  );
  return row;
}

// user 메시지가 한도 미만일 때만 저장 (확인과 저장을 한 쿼리로 처리). 한도 초과면 null 반환
async function addUserMessageWithLimit(sessionId, content, maxPrompts) {
  const [result] = await pool.query(
    `INSERT INTO messages (session_id, role, content)
     SELECT ?, 'user', ?
       FROM DUAL
      WHERE (SELECT COUNT(*) FROM messages WHERE session_id = ? AND role = 'user') < ?`,
    [sessionId, content, sessionId, maxPrompts]
  );
  if (result.affectedRows === 0) return null;

  const [[row]] = await pool.query(
    'SELECT id, role, content, created_at FROM messages WHERE id = ?',
    [result.insertId]
  );
  return row;
}

async function updateLatestCode(sessionId, code) {
  await pool.query('UPDATE sessions SET latest_code = ? WHERE id = ?', [code, sessionId]);
}

module.exports = {
  createSessionWithPrompt,
  sessionExists,
  findLatestCode,
  findMessages,
  addMessage,
  addUserMessageWithLimit,
  updateLatestCode,
};
