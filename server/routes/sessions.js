const express = require('express');
const { createSessionWithPrompt } = require('../db/sessionQueries');

const router = express.Router();

const MAX_PROMPT_LENGTH = 2000;

// POST /api/sessions  body: { prompt: string }
router.post('/', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return res.status(400).json({ message: 'prompt는 비어 있을 수 없습니다.' });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ message: `prompt는 ${MAX_PROMPT_LENGTH}자 이하여야 합니다.` });
  }

  const sessionId = await createSessionWithPrompt(prompt);
  res.status(201).json({ sessionId });
});

module.exports = router;
