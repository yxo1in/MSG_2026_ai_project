import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/admin.module.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Project } from "../components/Project";

const formatDate = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [sort, setSort] = useState("latest");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/projects?sort=${sort}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });
    return () => controller.abort();
  }, [sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("이 프로젝트를 삭제할까요?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.admin}>
      <Header />
      <div className={styles.bodyWrap}>
        <div className={styles.sortWrap}>
          <p
            className={styles.sortText}
            onClick={() => setSort((s) => (s === "latest" ? "oldest" : "latest"))}
            style={{ cursor: "pointer" }}
          >
            {sort === "latest" ? "최신순" : "오래된순"}
          </p>
        </div>
        {error && <p>목록을 불러오지 못했습니다. ({error})</p>}
        <div className={styles.projectWrap}>
          {projects.map((p) => (
            <Project
              key={p.id}
              title={p.title ?? "이름 없는 작품"}
              date={formatDate(p.createdAt)}
              previewUrl={p.hasPreview ? `/api/admin/projects/${p.id}/preview` : null}
              onClick={() => navigate(`/chat/${p.id}`)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
