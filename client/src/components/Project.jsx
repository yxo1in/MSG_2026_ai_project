import styles from "../styles/components/Project.module.css";

export const Project = ({ title, date, previewUrl, onClick, onDelete }) => {
  return (
    <div
      className={`${styles.wrap} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.image}>
        {previewUrl && (
          <iframe
            className={styles.preview}
            src={previewUrl}
            title={`${title ?? "프로젝트"} 미리보기`}
            // 생성된 코드가 앱 자체에 접근하지 못하도록 스크립트만 허용
            sandbox="allow-scripts allow-forms"
            loading="lazy"
            tabIndex={-1}
          />
        )}
        {onDelete && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={(e) => {
              // 카드 클릭(채팅 이동)으로 전달되지 않도록 막음
              e.stopPropagation();
              onDelete();
            }}
            aria-label="프로젝트 삭제"
          >
            ✕
          </button>
        )}
      </div>
      <div className={styles.textWrap}>
        <p className={styles.title} title={title}>
          {title}
        </p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};
