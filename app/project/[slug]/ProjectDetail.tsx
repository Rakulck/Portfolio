"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectDetailData } from "../../projectData";

type ProjectSlide = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export default function ProjectDetail({ project }: { project: ProjectDetailData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelDistanceRef = useRef(0);
  const wheelResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionLockRef = useRef(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const slides: ProjectSlide[] = [
    { eyebrow: project.meta, title: project.name, body: project.summary, image: project.images[0] },
    { eyebrow: "Approach / What I built", title: project.approachTitle, body: project.approach, image: project.images[1] },
    { eyebrow: "Outcome / What changed", title: project.outcomeTitle, body: project.outcome, image: project.images[2] },
  ];

  const moveSlide = useCallback((direction: 1 | -1) => {
    if (transitionLockRef.current) return;

    setActiveIndex((current) => {
      const next = Math.min(slides.length - 1, Math.max(0, current + direction));
      if (next === current) return current;

      transitionLockRef.current = true;
      transitionTimerRef.current = setTimeout(() => {
        transitionLockRef.current = false;
      }, 760);
      return next;
    });
  }, [slides.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      wheelDistanceRef.current += event.deltaY;
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
      wheelResetRef.current = setTimeout(() => {
        wheelDistanceRef.current = 0;
      }, 140);

      if (Math.abs(wheelDistanceRef.current) >= 42) {
        moveSlide(wheelDistanceRef.current > 0 ? 1 : -1);
        wheelDistanceRef.current = 0;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        moveSlide(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        moveSlide(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(slides.length - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [moveSlide, slides.length]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartRef.current === null) return;
    const endY = event.changedTouches[0]?.clientY ?? touchStartRef.current;
    const distance = touchStartRef.current - endY;
    touchStartRef.current = null;
    if (Math.abs(distance) > 44) moveSlide(distance > 0 ? 1 : -1);
  };

  return (
    <main className="project-detail" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <section className="project-detail__stage" aria-label={`${project.name} case study`}>
        <header className="project-detail__nav">
          <a href="/">Rakul CK</a>
          <nav aria-label="Project navigation">
            <a href="/#projects">Work</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
            <a className="project-detail__close" href="/#projects" aria-label="Close project">×</a>
          </nav>
        </header>

        <div className="project-detail__copy-window" aria-live="polite">
          {slides.map((slide, index) => (
            <article
              className="project-detail__copy-slide"
              key={slide.eyebrow}
              aria-hidden={activeIndex !== index}
              style={{
                transform: `translate3d(0, ${(index - activeIndex) * 112}%, 0)`,
                opacity: activeIndex === index ? 1 : 0,
                visibility: Math.abs(index - activeIndex) > 1 ? "hidden" : "visible",
              }}
            >
              <p className="project-detail__eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="project-detail__body">{slide.body}</p>
              {index === 0 ? <a className="project-detail__more" href={project.externalUrl} target="_blank" rel="noreferrer">See project ↗</a> : null}
            </article>
          ))}
        </div>

        <div className="project-detail__media-window" aria-hidden="true">
          {slides.map((slide, index) => (
            <figure
              className="project-detail__media-slide"
              key={`${slide.image}-${index}`}
              style={{
                transform: `translate3d(0, ${(index - activeIndex) * 102}%, 0)`,
                visibility: Math.abs(index - activeIndex) > 1 ? "hidden" : "visible",
              }}
            >
              <img src={slide.image} alt="" />
              <figcaption>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>

        <footer className="project-detail__meta">
          <div><span>Role</span><strong>{project.role}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
        </footer>

        <div className="project-detail__progress" aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}>
          <span>Scroll</span>
          <strong>{String(activeIndex + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</strong>
        </div>
      </section>
    </main>
  );
}
