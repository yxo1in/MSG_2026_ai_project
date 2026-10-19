const assert = require('node:assert/strict');
const { after, before, mock, test } = require('node:test');
const { once } = require('node:events');
const http = require('node:http');
const express = require('express');
const pool = require('../db/pool');

let server;
let baseUrl;

before(async () => {
  // Capture the real application without opening its normal development port.
  let app;
  const listener = mock.method(express.application, 'listen', function () {
    app = this;
  });
  require('../server');
  listener.mock.restore();

  server = http.createServer(app).listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

test('gallery only queries approved sessions and returns public display fields', async (t) => {
  t.mock.method(pool, 'query', async (sql, parameters) => {
    assert.match(sql, /WHERE\s+is_public\s*=\s*\?/i);
    assert.deepEqual(parameters, [true]);
    assert.match(sql, /ORDER BY\s+created_at DESC,\s*id DESC/i);
    return [[{
      id: 7,
      nickname: '우리 동네 축제',
      thumbnail_url: '/images/festival.png',
      created_at: new Date('2026-10-19T01:00:00Z'),
      latest_code: 'private implementation',
      messages: ['private conversation'],
    }]];
  });

  const response = await fetch(`${baseUrl}/api/gallery`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{
    id: 7,
    title: '우리 동네 축제',
    thumbnail: '/images/festival.png',
    createdAt: '2026-10-19T01:00:00.000Z',
  }]);
});

test('gallery returns an empty list when no sessions are approved', async (t) => {
  t.mock.method(pool, 'query', async () => [[]]);
  const response = await fetch(`${baseUrl}/api/gallery`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('gallery uses the server error response without leaking database details', async (t) => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(pool, 'query', async () => {
    throw new Error('Database credentials must not appear in the response');
  });
  const response = await fetch(`${baseUrl}/api/gallery`);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { message: '서버 오류가 발생했습니다.' });
});
