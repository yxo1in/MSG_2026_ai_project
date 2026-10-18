import styles from "../styles/components/Project.module.css";

export const Project = ({ title, date, onDelete }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.image}>
        {onDelete && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onDelete}
            aria-label="프로젝트 삭제"
          >
            ✕
          </button>
        )}
      </div>
      <div className={styles.textWrap}>
        <p className={styles.title}>{title}</p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};
