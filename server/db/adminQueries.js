const pool = require('./pool');

// 관리자 페이지 프로젝트 목록 (공개 여부와 관계없이 전체 세션)
async function findAllProjects({ sort = 'latest' } = {}) {
  const order = sort === 'oldest' ? 'ASC' : 'DESC';
  const [rows] = await pool.query(
    `SELECT s.id, s.nickname, s.thumbnail_url, s.is_public, s.created_at,
            s.latest_code IS NOT NULL AS has_code,
            (SELECT m.content
               FROM messages m
              WHERE m.session_id = s.id AND m.role = 'user'
              ORDER BY m.id
              LIMIT 1) AS first_prompt
       FROM sessions s
      ORDER BY s.created_at ${order}, s.id ${order}`
  );
  return rows;
}

// 미리보기용 최신 코드
async function findProjectCode(id) {
  const [[row]] = await pool.query('SELECT latest_code FROM sessions WHERE id = ?', [id]);
  return row?.latest_code ?? null;
}

// 프로젝트 상세 (세션 + 대화 내역)
async function findProjectById(id) {
  const [[session]] = await pool.query(
    `SELECT id, nickname, latest_code, thumbnail_url, is_public, created_at
       FROM sessions
      WHERE id = ?`,
    [id]
  );
  if (!session) return null;

  const [messages] = await pool.query(
    `SELECT id, role, content, code_snapshot, created_at
       FROM messages
      WHERE session_id = ?
      ORDER BY created_at ASC, id ASC`,
    [id]
  );
  return { ...session, messages };
}

// 갤러리 공개 여부 변경
async function updateProjectVisibility(id, isPublic) {
  const [result] = await pool.query(
    'UPDATE sessions SET is_public = ? WHERE id = ?',
    [isPublic, id]
  );
  return result.affectedRows > 0;
}

// 프로젝트 삭제 (messages는 ON DELETE CASCADE로 함께 삭제)
async function deleteProject(id) {
  const [result] = await pool.query('DELETE FROM sessions WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAllProjects,
  findProjectById,
  findProjectCode,
  updateProjectVisibility,
  deleteProject,
};
