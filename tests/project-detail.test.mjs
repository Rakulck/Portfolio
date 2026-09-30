import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = await readFile(new URL("../app/projectData.ts", import.meta.url), "utf8");
const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const detail = await readFile(new URL("../app/project/[slug]/ProjectDetail.tsx", import.meta.url), "utf8");

test("every portfolio card opens a local project screen", () => {
  assert.match(home, /href={`\/project\/\$\{project\.slug\}`}/);
  assert.doesNotMatch(home, /target=\{project\.external/);
  assert.match(data, /slug: "slidez"/);
  assert.match(data, /slug: "verso-ai"/);
  assert.match(data, /slug: "bookmydoc"/);
  assert.match(data, /slug: "innara"/);
  assert.match(data, /slug: "founders-inc-stylist-sdk"/);
  assert.match(data, /slug: "yc-voice-agent"/);
  assert.match(data, /slug: "e-mess"/);
  assert.match(data, /slug: "frontend-claude-skill"/);
});

test("project screen stays fixed and drives both columns from wheel steps", () => {
  assert.match(detail, /className="project-detail__stage"/);
  assert.match(detail, /document\.body\.style\.overflow = "hidden"/);
  assert.match(detail, /window\.addEventListener\("wheel", onWheel, \{ passive: false \}\)/);
  assert.match(detail, /event\.preventDefault\(\)/);
  assert.match(detail, /\(index - activeIndex\) \* 112/);
  assert.match(detail, /\(index - activeIndex\) \* 102/);
});
