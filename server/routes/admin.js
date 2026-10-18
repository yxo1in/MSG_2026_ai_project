const express = require('express');
const {
  findAllProjects,
  findProjectById,
  updateProjectVisibility,
  deleteProject,
} = require('../db/adminQueries');

const router = express.Router();

// 클라이언트 Project 컴포넌트 형식(title, date, thumbnail)으로 변환
function toProject(row) {
  return {
    id: row.id,
    title: row.nickname,
    thumbnail: row.thumbnail_url,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
  };
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: '잘못된 프로젝트 id입니다.' });
    return null;
  }
  return id;
}

// GET /api/admin/projects?sort=latest|oldest
router.get('/projects', async (req, res) => {
  const rows = await findAllProjects({ sort: req.query.sort });
  res.json(rows.map(toProject));
});

// GET /api/admin/projects/:id
router.get('/projects/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const project = await findProjectById(id);
  if (!project) return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });

  res.json({
    ...toProject(project),
    latestCode: project.latest_code,
    messages: project.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      codeSnapshot: m.code_snapshot,
      createdAt: m.created_at,
    })),
  });
});

// PATCH /api/admin/projects/:id/visibility  body: { isPublic: boolean }
router.patch('/projects/:id/visibility', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const { isPublic } = req.body ?? {};
  if (typeof isPublic !== 'boolean') {
    return res.status(400).json({ message: 'isPublic은 boolean이어야 합니다.' });
  }

  const updated = await updateProjectVisibility(id, isPublic);
  if (!updated) return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
  res.json({ id, isPublic });
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const deleted = await deleteProject(id);
  if (!deleted) return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
  res.status(204).end();
});

module.exports = router;
