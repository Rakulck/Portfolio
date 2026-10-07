import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const projectData = readFileSync(new URL("../app/projectData.ts", import.meta.url), "utf8");

test("shows the intro loader no more than once per browser day", () => {
  assert.match(page, /rakul-portfolio-intro-day/);
  assert.match(page, /localStorage\.getItem/);
  assert.match(page, /intro--\$\{introState\}/);
});

test("fades the portfolio gallery up on entry and down on exit", () => {
  assert.match(page, /setProjectsVisible\(entry\.isIntersecting\)/);
  assert.match(page, /projects--visible/);
  assert.match(css, /\.project-gallery-window \{ opacity: 0; transform: translate3d\(0,4rem,0\)/);
  assert.match(css, /\.projects--visible \.project-gallery-window \{ opacity: 1; transform: translate3d\(0,0,0\)/);
});

test("tilts and enlarges portfolio cards smoothly on hover", () => {
  assert.match(css, /\.project-card \{[^}]*transition: transform \.72s cubic-bezier/);
  assert.match(css, /rotateY\(var\(--hover-tilt\)\)[^;]*scale\(1\.055\)/);
  assert.match(css, /\.project-card:nth-child\(2\), \.project-card:nth-child\(5\) \{ --hover-shift: -1\.8rem; --hover-tilt: 4deg/);
  assert.match(css, /translate3d\(var\(--hover-shift\),-1rem,2rem\)/);
});

test("keeps hero and portfolio cards free of section and date labels", () => {
  assert.doesNotMatch(page, />Selected work</);
  assert.doesNotMatch(page, /Work \/ Independent projects/);
  assert.doesNotMatch(page, /\{project\.year\}/);
});

test("uses the supplied IBM and BookMyDoc artwork", () => {
  assert.match(projectData, /slug: "ibm"[\s\S]*?logo: "\/ibm-logo\.jpg"/);
  assert.match(projectData, /slug: "bookmydoc"[\s\S]*?logo: "\/bookmydoc-logo\.png"/);
  assert.match(css, /\.project-card__logo--ibm, \.project-card__logo--bookmydoc/);
});

test("uses the supplied Founders Inc, YC, and Claude artwork", () => {
  assert.match(projectData, /slug: "founders-inc-stylist-sdk"[\s\S]*?logo: "\/founderinc\.jpg"/);
  assert.match(projectData, /slug: "yc-voice-agent"[\s\S]*?logo: "\/yc\.webp"/);
  assert.match(projectData, /slug: "frontend-claude-skill"[\s\S]*?logo: "\/claude\.webp"/);
  assert.match(css, /\.project-card__logo--founders-inc-stylist-sdk/);
  assert.match(css, /\.project-card__logo--yc-voice-agent/);
  assert.match(css, /\.project-card__logo--frontend-claude-skill/);
});
