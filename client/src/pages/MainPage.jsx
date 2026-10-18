import { useRef } from "react";
import styles from "../styles/MainPage.module.css";
import { Header } from "../components/Header";
import { Tag } from "../components/Tag";

export const MainPage = () => {
  const inputRef = useRef(null);
  const TAGS = [
    "공부 계획표를 짜주는 웹사이트",
    "독서기록 할 수 있는 웹사이트",
    "여행계획을 정리해주는 웹사이트",
    "나만의 귀여운 메모장 만들기"
  ]

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
            />
            <button type="button" className={styles.searchButton} aria-label="전송">
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
              <Tag
                text={t}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
