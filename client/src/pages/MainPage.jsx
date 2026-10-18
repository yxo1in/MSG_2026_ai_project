import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPage.module.css";
import { Header } from "../components/Header";
import { Tag } from "../components/Tag";

export const MainPage = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const TAGS = [
    "공부 계획표를 짜주는 웹사이트",
    "독서기록 할 수 있는 웹사이트",
    "여행계획을 정리해주는 웹사이트",
    "나만의 귀여운 메모장 만들기"
  ]

  // 세션을 만들고 첫 메시지를 저장한 뒤 채팅 페이지로 이동
  const send = async (text) => {
    const prompt = text.trim();
    if (!prompt || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { sessionId } = await res.json();
      navigate(`/chat/${sessionId}`);
    } catch (err) {
      console.error("세션 생성 실패:", err);
      setSending(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.body}>
        <div className={styles.titleWrap}>
          <div className={styles.textWrap}>
            <p className={styles.title}>말만하면,</p>
            <div className={styles.wrap}>
              <div className={styles.container}>
                <p className={styles.title} style={{ color: "#FFF" }}>
                  코딩
                </p>
              </div>
              <div>
                <p className={styles.title}>이 돼요.</p>
              </div>
            </div>
          </div>
          <div className={styles.noteWrap}>
            <p className={styles.note}>떠오르는 생각들을 말해보세요!</p>
          </div>
        </div>
        <div className={styles.searchWrap}>
          <div
            className={styles.searchBox}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              placeholder="하루를 기록 할 수 있는 일기장 웹사이트 만들어줘"
              onKeyDown={(e) => {
                // 한글 입력 조합 중 엔터는 무시
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  send(e.currentTarget.value);
                }
              }}
            />
            <button
              type="button"
              className={styles.searchButton}
              aria-label="전송"
              disabled={sending}
              onClick={() => send(inputRef.current?.value ?? "")}
            >
              <svg
                className={styles.searchIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.tagContainer}>
          <div className={styles.tagWrap}>
            {TAGS.map((t) => (
              <Tag key={t} text={t} onClick={() => send(t)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
