const API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = [
  '당신은 사용자의 말만으로 웹사이트를 만들어 주는 한국어 도우미입니다.',
  '사용자의 요청에 맞는 웹사이트를 한 페이지짜리 단일 HTML 파일로 작성하세요.',
  'HTML, CSS, JavaScript를 모두 한 파일 안에 넣고(<style>, <script> 인라인), 외부 파일이나 외부 라이브러리는 사용하지 마세요.',
  '이 코드는 화면에 바로 실행되어 보여지므로 반드시 동작하는 완전한 코드여야 합니다.',
  '답변은 한두 문장의 짧은 설명과 ```html 코드 블록 하나로 구성하세요.',
  '수정 요청이 와도 변경 부분만이 아니라 항상 전체 코드를 다시 출력하세요.',
].join('\n');

// history: [{ role: 'user' | 'assistant', content }]
async function createReply(history) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI 요청 실패 (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI 응답이 비어 있습니다.');
  return content;
}

// 응답에서 HTML 코드 추출: ```html 블록 우선, 없으면 HTML 문서로 보이는 일반 코드 블록
function extractHtml(text) {
  const html = text.match(/```html\s*([\s\S]*?)```/i);
  if (html) return html[1].trim();

  const fenced = text.match(/```\w*\s*([\s\S]*?)```/);
  if (fenced && /<(!doctype|html|body)/i.test(fenced[1])) return fenced[1].trim();
  return null;
}

module.exports = { createReply, extractHtml };
