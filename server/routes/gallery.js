const express = require('express');
const { findPublicProjects } = require('../db/galleryQueries');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await findPublicProjects();
  res.json(projects.map((project) => ({
    id: project.id,
    title: project.nickname,
    thumbnail: project.thumbnail_url,
    createdAt: project.created_at,
  })));
});

module.exports = router;
