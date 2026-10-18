import styles from "../styles/MainPage.module.css";
import { Header } from "../components/Header";

export const MainPage = () => {
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
      </div>
    </div>
  );
};
