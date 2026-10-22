const express = require('express');
const {
  createSessionWithPrompt,
  sessionExists,
  findLatestCode,
  findMessages,
  addMessage,
  addUserMessageWithLimit,
  updateLatestCode,
} = require('../db/sessionQueries');
const { createReply, extractHtml } = require('../openai');

const router = express.Router();

const MAX_PROMPT_LENGTH = 2000;
// 세션(페이지)당 입력할 수 있는 프롬프트 수
const MAX_PROMPTS = 5;

// 같은 세션에서 응답 생성이 중복 실행되지 않도록 막는다
const generating = new Set();

function toMessage(row) {
  return { id: row.id, role: row.role, content: row.content, createdAt: row.created_at };
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: '잘못된 세션 id입니다.' });
    return null;
  }
  return id;
}

function readPrompt(body, res) {
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) {
    res.status(400).json({ message: 'prompt는 비어 있을 수 없습니다.' });
    return null;
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ message: `prompt는 ${MAX_PROMPT_LENGTH}자 이하여야 합니다.` });
    return null;
  }
  return prompt;
}

// POST /api/sessions  body: { prompt }  → 세션 생성 + 첫 user 메시지 저장
router.post('/', async (req, res) => {
  const prompt = readPrompt(req.body, res);
  if (prompt === null) return;

  const sessionId = await createSessionWithPrompt(prompt);
  res.status(201).json({ sessionId });
});

// GET /api/sessions/:id  → 대화 내역
router.get('/:id', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  if (!(await sessionExists(id))) {
    return res.status(404).json({ message: '세션을 찾을 수 없습니다.' });
  }

  const [messages, latestCode] = await Promise.all([findMessages(id), findLatestCode(id)]);
  res.json({ id, maxPrompts: MAX_PROMPTS, latestCode, messages: messages.map(toMessage) });
});

// POST /api/sessions/:id/messages  body: { prompt }  → user 메시지 저장
router.post('/:id/messages', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const prompt = readPrompt(req.body, res);
  if (prompt === null) return;
  if (!(await sessionExists(id))) {
    return res.status(404).json({ message: '세션을 찾을 수 없습니다.' });
  }

  const message = await addUserMessageWithLimit(id, prompt, MAX_PROMPTS);
  if (!message) {
    return res
      .status(403)
      .json({ message: `프롬프트는 페이지당 ${MAX_PROMPTS}번까지 입력할 수 있습니다.` });
  }
  res.status(201).json(toMessage(message));
});

// POST /api/sessions/:id/reply  → 마지막 user 메시지에 대한 assistant 응답 생성/저장
router.post('/:id/reply', async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  if (!(await sessionExists(id))) {
    return res.status(404).json({ message: '세션을 찾을 수 없습니다.' });
  }
  if (generating.has(id)) {
    return res.status(409).json({ message: '이미 응답을 생성 중입니다.' });
  }

  generating.add(id);
  try {
    const history = await findMessages(id);
    if (history.length === 0 || history[history.length - 1].role !== 'user') {
      return res.status(409).json({ message: '응답할 user 메시지가 없습니다.' });
    }

    const content = await createReply(history.map((m) => ({ role: m.role, content: m.content })));
    const code = extractHtml(content);
    const message = await addMessage(id, 'assistant', content, code);
    if (code) await updateLatestCode(id, code);
    res.status(201).json({ ...toMessage(message), code });
  } finally {
    generating.delete(id);
  }
});

module.exports = router;
