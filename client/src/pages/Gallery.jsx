import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import styles from "../styles/Gallery.module.css";

const PAGE_SIZE = 6;
const REFRESH_INTERVAL_MS = 60_000;
const projectTitle = (project) => project.title?.trim() || "이름 없는 작품";

function GalleryImage({ project, featured = false }) {
  const [failed, setFailed] = useState(false);

  if (!project.thumbnail || failed) {
    return (
      <span className={styles.missingImage}>
        {featured ? "미리보기 이미지가 없습니다." : "이미지 없음"}
      </span>
    );
  }

  return (
    <img
      className={styles.projectImage}
      src={project.thumbnail}
      alt={featured ? `${projectTitle(project)} 작품 미리보기` : ""}
      onError={() => setFailed(true)}
    />
  );
}

export const Gallery = () => {
  const [result, setResult] = useState({ status: "loading", projects: [], activeIndex: 0 });
  const [attempt, setAttempt] = useState(0);
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;

    const refresh = async () => {
      if (inFlight || controller.signal.aborted || document.visibilityState === "hidden") return;
      inFlight = true;

      try {
        const response = await fetch("/api/gallery", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projects = await response.json();
        if (!Array.isArray(projects)) throw new Error("Invalid gallery response");
        if (controller.signal.aborted) return;

        setResult((previous) => {
          const selectedId = previous.projects[previous.activeIndex]?.id;
          const selectedIndex = projects.findIndex((project) => project.id === selectedId);
          return {
            status: "ready",
            projects,
            activeIndex: selectedIndex >= 0
              ? selectedIndex
              : Math.min(previous.activeIndex, Math.max(0, projects.length - 1)),
          };
        });
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          // Keep the last successful list visible during temporary refresh failures.
          setResult((previous) => previous.status === "ready"
            ? previous
            : { status: "error", projects: [], activeIndex: 0 });
        }
      } finally {
        inFlight = false;
      }
    };

    refresh();
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      controller.abort();
    };
  }, [attempt]);

  const { projects, status, activeIndex } = result;
  const setActiveIndex = (nextIndex) => {
    setResult((previous) => ({
      ...previous,
      activeIndex: typeof nextIndex === "function" ? nextIndex(previous.activeIndex) : nextIndex,
    }));
  };
  const selected = projects[activeIndex];
  const pageStart = Math.floor(activeIndex / PAGE_SIZE) * PAGE_SIZE;
  const visibleProjects = projects.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    const track = thumbnailsRef.current;
    const active = track?.querySelector(`[data-project-index="${activeIndex}"]`);
    if (!active) return;

    const trackBounds = track.getBoundingClientRect();
    const activeBounds = active.getBoundingClientRect();
    if (activeBounds.left < trackBounds.left + 4) {
      track.scrollLeft += activeBounds.left - trackBounds.left - 4;
    } else if (activeBounds.right > trackBounds.right - 4) {
      track.scrollLeft += activeBounds.right - trackBounds.right + 4;
    }
  }, [activeIndex, status, projects]);

  const retry = () => {
    setResult({ status: "loading", projects: [], activeIndex: 0 });
    setAttempt((previous) => previous + 1);
  };

  const selectWithKeyboard = (event) => {
    if (!selected) return;
    const targets = {
      ArrowLeft: Math.max(0, activeIndex - 1),
      ArrowRight: Math.min(projects.length - 1, activeIndex + 1),
      Home: 0,
      End: projects.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const nextIndex = targets[event.key];
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => {
      thumbnailsRef.current
        ?.querySelector(`[data-project-index="${nextIndex}"]`)
        ?.focus({ preventScroll: true });
    });
  };

  return (
    <div className={styles.gallery}>
      <Header className={styles.header} />
      <main className={styles.content} aria-busy={status === "loading"}>
        <h1 className={styles.srOnly}>작품 갤러리</h1>
        <figure className={styles.featured}>
          <div id="gallery-preview" className={styles.preview}>
            {selected ? (
              <GalleryImage key={`${selected.id}:${selected.thumbnail}`} project={selected} featured />
            ) : (
              <div className={styles.status}>
                {status === "loading" && <p role="status">작품을 불러오는 중입니다.</p>}
                {status === "error" && (
                  <>
                    <p role="alert">작품을 불러오지 못했습니다.</p>
                    <button type="button" className={styles.retry} onClick={retry}>
                      다시 시도
                    </button>
                  </>
                )}
                {status === "ready" && (
                  <div role="status">
                    <p>아직 전시된 작품이 없습니다.</p>
                    <p className={styles.statusHint}>운영자가 승인한 작품이 이곳에 전시됩니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <figcaption
            className={styles.title}
            title={selected ? projectTitle(selected) : undefined}
            aria-live="polite"
            aria-atomic="true"
          >
            {selected && projectTitle(selected)}
            {selected && <span className={styles.srOnly}> · {activeIndex + 1} / {projects.length}</span>}
          </figcaption>
        </figure>

          <section className={styles.carousel} aria-label="갤러리 작품 선택">
            <button
              type="button"
              className={styles.arrow}
              aria-label="이전 작품"
              aria-controls="gallery-preview"
              disabled={!selected || activeIndex === 0}
              onClick={() => setActiveIndex((index) => index - 1)}
            >
              <img src="/assets/gallery/previous.svg" alt="" width="49" height="85" />
            </button>
            <div className={styles.thumbnails} ref={thumbnailsRef} onKeyDown={selectWithKeyboard}>
              {visibleProjects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={styles.thumbnail}
                  data-project-index={pageStart + index}
                  aria-label={`${projectTitle(project)} 작품 선택`}
                  aria-pressed={pageStart + index === activeIndex}
                  aria-controls="gallery-preview"
                  onClick={() => setActiveIndex(pageStart + index)}
                >
                  <GalleryImage key={`${project.id}:${project.thumbnail}`} project={project} />
                </button>
              ))}
              {Array.from({ length: PAGE_SIZE - visibleProjects.length }, (_, index) => (
                <div
                  key={`empty-${index}`}
                  className={`${styles.thumbnail} ${styles.placeholder}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.arrow}
              aria-label="다음 작품"
              aria-controls="gallery-preview"
              disabled={!selected || activeIndex === projects.length - 1}
              onClick={() => setActiveIndex((index) => index + 1)}
            >
              <img src="/assets/gallery/next.svg" alt="" width="49" height="85" />
            </button>
          </section>
      </main>
    </div>
  );
};
