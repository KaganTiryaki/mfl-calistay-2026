import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const carousel = await readFile(new URL('js/carousel.js', root), 'utf8');
const stage = await readFile(new URL('js/scene/stage.js', root), 'utf8');
const main = await readFile(new URL('js/main.js', root), 'utf8');

test('committee controller has an explicit cleanup and lifecycle boundary', () => {
  assert.match(carousel, /cancelAnimationFrame/);
  assert.match(carousel, /stage\.destroy\(\)/);
  assert.match(carousel, /removeEventListener/);
  assert.match(carousel, /matchMedia\('[^']*prefers-reduced-motion/);
});

test('stage builds signatures incrementally and handles WebGL context loss', () => {
  assert.match(stage, /requestIdleCallback|setTimeout/);
  assert.match(stage, /webglcontextlost/);
  assert.match(stage, /webglcontextrestored/);
  assert.match(stage, /renderer\.forceContextLoss/);
});

test('lightbox keeps focus inside the dialog and restores the trigger', () => {
  assert.match(main, /activeElement/);
  assert.match(main, /returnFocus/);
  assert.match(main, /setPageInert\(true\)/);
  assert.match(main, /setPageInert\(false\)/);
});
