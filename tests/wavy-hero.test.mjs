import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/WavyHero.tsx", import.meta.url), "utf8");

test("uses one bounded WebGL2 canvas with a procedural liquid shader", () => {
  assert.match(source, /getContext\("webgl2"/);
  assert.match(source, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/);
  assert.match(source, /gl\.drawArrays\(gl\.TRIANGLES, 0, 3\)/);
  assert.match(source, /const float LIQUID_INK = 0\.024;/);
  assert.match(source, /float liquidSurface/);
  assert.match(source, /float cursorRipple/);
  assert.match(source, /uPointer/);
});

test("keeps the liquid surface subtle on pure white", () => {
  assert.match(source, /float luminance = 1\.000 - ink/);
  assert.doesNotMatch(source, /paperVariation/);
  assert.doesNotMatch(source, /float contour/);
});

test("handles accessibility and GPU lifecycle safely", () => {
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /webglcontextlost/);
  assert.match(source, /webglcontextrestored/);
  assert.match(source, /cancelAnimationFrame/);
  assert.match(source, /deleteProgram/);
});
