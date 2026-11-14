import test from 'node:test';
import assert from 'node:assert/strict';

import { LABS } from '../../assets/js/labs/index.js';
import { GUIDES, GUIDE_CHROME, guideHTML } from '../../assets/js/labs/guides.js';

const LANGS = ['en', 'zh', 'de'];
const SECTIONS = ['read', 'params', 'dynamics', 'try', 'caveat'];

test('every registered laboratory has a complete guide in every language', () => {
  assert.equal(LABS.length, 16);
  for (const lab of LABS) {
    const guide = GUIDES[lab.id];
    assert.ok(guide, `missing guide for ${lab.id}`);
    for (const lang of LANGS) {
      assert.ok(guide[lang], `${lab.id} missing ${lang}`);
      for (const section of SECTIONS) {
        assert.ok(guide[lang][section] && guide[lang][section].length > 20, `${lab.id}.${lang}.${section} too short`);
      }
    }
  }
});

test('guide chrome is authored in three languages', () => {
  for (const lang of LANGS) {
    for (const key of ['summary', 'read', 'params', 'dynamics', 'try', 'caveat']) {
      assert.ok(GUIDE_CHROME[lang][key], `${lang}.${key}`);
    }
  }
});

test('guideHTML emits an openable details block with the read pane active', () => {
  const html = guideHTML('lattice', 'en');
  assert.match(html, /<details class="guide"/);
  assert.match(html, /guide-pane active" data-pane="read"/);
  assert.match(html, /data-tab="params"/);
  assert.equal(guideHTML('not-a-lab', 'en'), '');
});

import { existsSync } from 'node:fs';
import { ALGORITHM_ORDER, ALGORITHM_GUIDE, guideFor } from '../../assets/js/lib/algorithm-guide.js';

test('algorithm reader covers thirteen routines in three languages', () => {
  assert.equal(ALGORITHM_ORDER.length, 13);
  for (const id of ALGORITHM_ORDER) {
    const entry = ALGORITHM_GUIDE[id];
    assert.ok(entry, `missing algorithm ${id}`);
    for (const lang of ['en', 'zh', 'de']) {
      const g = guideFor(id, lang);
      assert.ok(g.purpose.length >= 1, `${id}.${lang}.purpose`);
      assert.ok(g.steps.length >= 3, `${id}.${lang}.steps`);
      assert.ok(g.invariant.length > 40, `${id}.${lang}.invariant`);
      assert.ok(g.complexity.length >= 2, `${id}.${lang}.complexity`);
      assert.ok(g.notes.length >= 2, `${id}.${lang}.notes`);
      assert.ok(g.pitfalls.length >= 2, `${id}.${lang}.pitfalls`);
    }
    assert.ok(entry.code.length >= 1);
    for (const c of entry.code) assert.ok(existsSync(c.path), `missing source ${c.path}`);
  }
});
