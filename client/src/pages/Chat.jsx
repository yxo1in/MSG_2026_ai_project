import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/Chat.module.css';

const postJson = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

// 말풍선에는 설명만 보여주고 코드 블록은 오른쪽 화면에서 실행한다
const stripCode = (content) =>
    content.replace(/```[\s\S]*?(```|$)/g, '').trim() || '웹사이트를 만들었어요.';

export const Chat = () => {
    const { sessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [maxPrompts, setMaxPrompts] = useState(5);
    const [code, setCode] = useState(null);
    const chatAreaRef = useRef(null);

    // 마지막 user 메시지에 대한 assistant 응답 요청
    const requestReply = async () => {
        setLoading(true);
        setError(null);
        try {
            const reply = await postJson(`/api/sessions/${sessionId}/reply`);
            setMessages((prev) => [...prev, reply]);
            if (reply.code) setCode(reply.code);
        } catch (err) {
            setError('응답을 받아오지 못했습니다. 잠시 후 다시 시도해주세요.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 대화 내역 불러오기. 마지막이 user 메시지면(메인에서 막 넘어온 경우) 응답을 요청한다
    useEffect(() => {
        const controller = new AbortController();
        fetch(`/api/sessions/${sessionId}`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setMessages(data.messages);
                setMaxPrompts(data.maxPrompts);
                setCode(data.latestCode);
                const last = data.messages[data.messages.length - 1];
                if (last?.role === 'user') requestReply();
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(
                    err.message === 'HTTP 404'
                        ? '존재하지 않는 대화입니다. 메인에서 새로 시작해주세요.'
                        : '대화를 불러오지 못했습니다.'
                );
            });
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    // 새 메시지가 오면 맨 아래로 스크롤
    useEffect(() => {
        const el = chatAreaRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, loading]);

    const usedPrompts = messages.filter((m) => m.role === 'user').length;
    const limitReached = usedPrompts >= maxPrompts;

    const send = async () => {
        const prompt = input.trim();
        if (!prompt || loading || limitReached) return;
        setInput('');
        setError(null);
        try {
            const saved = await postJson(`/api/sessions/${sessionId}/messages`, { prompt });
            setMessages((prev) => [...prev, saved]);
        } catch (err) {
            setError(
                err.message === 'HTTP 403'
                    ? `프롬프트는 페이지당 ${maxPrompts}번까지 입력할 수 있습니다.`
                    : '메시지를 전송하지 못했습니다.'
            );
            console.error(err);
            return;
        }
        await requestReply();
    };

    return (
        <div className={styles.layout}>
            <div className={styles.container}>
                {/* 상단 헤더 */}
                <header className={styles.header}>
                    <h1 className={styles.title}>vibe.lab</h1>
                </header>

                {/* 채팅 메시지 목록 */}
                <div className={styles.chatArea} ref={chatAreaRef}>
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`${styles.message} ${
                                m.role === 'user' ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            {m.role === 'assistant' ? stripCode(m.content) : m.content}
                        </div>
                    ))}

                    {/* 로딩 표시 (점 3개) */}
                    {loading && (
                        <div className={styles.loadingDots}>
                            <span />
                            <span />
                            <span />
                        </div>
                    )}

                    {error && <p>{error}</p>}
                </div>

                {/* 하단 메시지 입력창 */}
                <div className={styles.inputWrapper}>
                    <p className={styles.promptCount}>
                        프롬프트 {Math.min(usedPrompts, maxPrompts)}/{maxPrompts}
                    </p>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder={
                                limitReached ? '프롬프트를 모두 사용했어요' : '프롬프트 입력'
                            }
                            disabled={limitReached}
                            className={styles.inputField}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                // 한글 입력 조합 중 엔터는 무시
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) send();
                            }}
                        />
                        <button
                            className={styles.sendButton}
                            aria-label="전송"
                            disabled={loading || limitReached}
                            onClick={send}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="19" x2="12" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.preview}>
                {code ? (
                    <iframe
                        className={styles.previewFrame}
                        title="미리보기"
                        // 생성된 코드가 앱 자체에 접근하지 못하도록 스크립트만 허용
                        sandbox="allow-scripts"
                        srcDoc={code}
                    />
                ) : (
                    <p className={styles.previewEmpty}>
                        {loading ? '웹사이트를 만들고 있어요...' : '여기에 결과 화면이 나타나요'}
                    </p>
                )}
            </div>
        </div>
    );
};