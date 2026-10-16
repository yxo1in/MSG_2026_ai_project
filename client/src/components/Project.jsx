import styles from "../styles/components/Project.module.css";

export const Project = ({ title, date }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.image}></div>
      <div className={styles.textWrap}>
        <p className={styles.title}>{title}</p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};
