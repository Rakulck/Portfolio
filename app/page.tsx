"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { WavyHero } from "./WavyHero";
import { personalProjects, workProjects } from "./projectData";

const navItems = [
  ["Work", "projects"],
  ["Projects", "projects"],
  ["About", "about"],
  ["Contact", "contact"],
] as const;

export default function Home() {
  const [introState, setIntroState] = useState<"checking" | "active" | "done">("checking");
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<"work" | "projects">("work");
  const [activeSection, setActiveSection] = useState("hero");
  const [projectsVisible, setProjectsVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const introKey = "rakul-portfolio-intro-day";

    try {
      if (window.localStorage.getItem(introKey) === today) {
        setProgress(100);
        setIntroState("done");
        return;
      }
      window.localStorage.setItem(introKey, today);
    } catch {
      // If storage is unavailable, the loader still runs normally for this visit.
    }

    setIntroState("active");
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 4));
    }, 34);
    const finish = window.setTimeout(() => {
      window.clearInterval(interval);
      setProgress(100);
      setIntroState("done");
    }, 1250);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(finish);
    };
  }, []);

  useEffect(() => {
    const projects = document.getElementById("projects");
    if (!projects) return;

    const observer = new IntersectionObserver(
      ([entry]) => setProjectsVisible(entry.isIntersecting),
      { rootMargin: "-8% 0px -8%", threshold: 0.03 },
    );
    observer.observe(projects);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.2, 0.45, 0.7] },
    );
    document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const chooseView = (next: "work" | "projects", shouldScroll = false) => {
    setView(next);
    if (shouldScroll) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={`intro intro--${introState}`} aria-hidden="true">
        <div className="intro__name">Rakul CK</div>
        <div className="intro__count">{progress}</div>
      </div>

      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-nav" aria-label="Primary navigation">
        <a className="site-nav__role" href="#hero">AI Product Engineer</a>
        <nav className="site-nav__links">
          {navItems.map(([label, section]) => (
            <a
              key={label}
              className={activeSection === section ? "is-active" : ""}
              href={`#${section}`}
              onClick={
                label === "Work" || label === "Projects"
                  ? (event) => {
                      event.preventDefault();
                      chooseView(label === "Work" ? "work" : "projects", true);
                    }
                  : undefined
              }
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <WavyHero />
          <div className="hero__eyebrow">Founder / Engineer / Designer</div>
          <h1 id="hero-title">Rakul CK</h1>
          <p className="hero__statement">
            I build AI products from first sketch to real users—combining product thinking,
            full-stack engineering and a slightly unreasonable eye for detail.
          </p>
          <a className="hero__scroll" href="#showreel" aria-label="Scroll to showreel">
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="showreel" id="showreel" aria-label="Portfolio showreel">
          <div className="showreel__sticky">
            <div className="showreel__label">Showreel / 2026</div>
            <div className="orbit" aria-hidden="true">
              <div className="orbit__ring orbit__ring--one" />
              <div className="orbit__ring orbit__ring--two" />
              <div className="orbit__core"><span>CK</span></div>
              <div className="orbit__card orbit__card--one"><small>01 / STYLE</small><strong>SLIDEZ</strong><span>ASK → STYLE → TRY</span></div>
              <div className="orbit__card orbit__card--two"><small>02 / SOUND</small><strong>VERSO</strong><span>LISTEN → FEEL → SAVE</span></div>
              <div className="orbit__card orbit__card--three"><small>03 / VOICE</small><strong>LOCAL AI</strong><span>SPEAK → UNDERSTAND → ACT</span></div>
            </div>
            <p className="showreel__caption">Zero-to-one products for style, sound, memory and the messy parts in between.</p>
          </div>
        </section>

        <section className={`projects${projectsVisible ? " projects--visible" : ""}`} id="projects" aria-label="Work and projects">
          <div className="projects-switcher-shell">
            <div className="projects-switcher" role="group" aria-label="Portfolio view">
              <span className={`projects-switcher__thumb projects-switcher__thumb--${view}`} aria-hidden="true" />
              <button type="button" aria-pressed={view === "work"} onClick={() => chooseView("work")}>Work</button>
              <button type="button" aria-pressed={view === "projects"} onClick={() => chooseView("projects")}>Projects</button>
            </div>
          </div>

          <div className="project-gallery-window">
            <div className={`project-gallery-world project-gallery-world--${view}`}>
              {(["work", "projects"] as const).map((galleryView) => {
                const galleryItems = galleryView === "work" ? workProjects : personalProjects;
                return (
                  <div
                    className={`project-gallery project-gallery--${galleryView}`}
                    aria-hidden={view !== galleryView}
                    key={galleryView}
                  >
                    {galleryItems.map((project, index) => (
                      <a
                        className="project-card"
                        href={`/project/${project.slug}`}
                        key={project.name}
                        tabIndex={view === galleryView ? 0 : -1}
                        style={{
                          "--float-delay": `${index * -700}ms`,
                          "--ring-rotation": `${index * 19}deg`,
                          "--line-rotation": `${-11 + index * 7}deg`,
                        } as CSSProperties}
                      >
                        <span className="project-card__inner">
                          <span className={`project-card__visual${project.logo ? ` project-card__visual--logo project-card__visual--${project.slug}` : ""}`} aria-hidden="true">
                            {project.logo ? (
                              <img className={`project-card__logo project-card__logo--${project.slug}`} src={project.logo} alt="" />
                            ) : (
                              <span className="project-card__visual-name">{project.name}</span>
                            )}
                          </span>
                          <span className="project-card__info">
                            <strong>{project.name}</strong>
                            <span>{project.meta}</span>
                            <small aria-hidden="true">↗</small>
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about__label">About / Rakul CK</div>
          <div className="about__content">
            <h2 id="about-title">I like products that feel simple on the outside and obsessive underneath.</h2>
            <div className="about__copy">
              <p>I’m Rakul, an AI product engineer and founder of Slidez. I build mobile and web products where applied AI has a clear job: help somebody decide, create, find or act faster.</p>
              <p>My work moves between consumer AI, agentic systems, retrieval, voice and full-stack product engineering. The common thread is ownership—I enjoy the whole path from ambiguous idea to interaction design, architecture, launch and the first uncomfortable user feedback.</p>
              <p>I studied software engineering at George Mason University. These days I’m building, running, and testing what the next generation of AI-native products should feel like.</p>
            </div>
          </div>
          <div className="about__footer"><span>Washington, DC / Open to the right problem</span><span>AI · Mobile · Full-stack · Product</span></div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact__label">Have something ambitious in mind?</div>
          <a className="contact__cta" href="mailto:rakulck31@gmail.com">
            <span id="contact-title">Let’s build</span><span>something useful</span>
          </a>
          <footer className="contact__footer">
            <a href="mailto:rakulck31@gmail.com">Mail</a>
            <a href="https://github.com/Rakulck" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.slidez.social/" target="_blank" rel="noreferrer">Slidez</a>
            <span>© {new Date().getFullYear()} Rakul CK</span>
          </footer>
        </section>
      </main>
    </>
  );
}
