import styles from "../styles/Admin.module.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Project } from "../components/Project";

export const Admin = () => {
  const exampleProjects = Array.from({ length: 8 }, (_, i) => ({
    title: `예제${i + 1}`,
    date: `${12 + i}:00`,
  }));
  return (
    <div className={styles.admin}>
      <Header />
      <div className={styles.bodyWrap}>
        <div className={styles.sortWrap}>
          <p className={styles.sortText}>최신순</p>
        </div>
        <div className={styles.projectWrap}>
          {exampleProjects.map((p) => (
            <Project key={p.title} title={p.title} date={p.date} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
