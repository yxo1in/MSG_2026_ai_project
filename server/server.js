require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRouter = require('./routes/admin');
const galleryRouter = require('./routes/gallery');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/sessions', sessionsRouter);

// Express 5는 async 핸들러의 에러를 자동으로 여기로 전달
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
