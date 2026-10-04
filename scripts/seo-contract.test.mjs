import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const robots = await readFile(new URL('robots.txt', root), 'utf8');

function jsonLdBlocks(source) {
  return [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test('public facts remain visible without JavaScript', () => {
  for (const fact of ['>150<', '>7<', '>20<', '>2<']) {
    assert.ok(html.includes(fact), `missing server-rendered fact ${fact}`);
  }
});

test('brand logos beside visible brand text stay decorative for screen readers', () => {
  assert.match(html, /<img src="assets\/images\/brand\/mfl\.png" alt="" class="nav-logo-img"/);
  assert.match(html, /<img src="assets\/images\/brand\/fbc\.png" alt="" class="hero-logo zoomable"/);
  assert.match(html, /<img src="assets\/images\/brand\/mfl\.png" alt="" class="footer-logo-img"/);
});

test('FAQ answers the committee question with all seven committee names', () => {
  assert.match(html, /MFL FBÇ komiteleri nelerdir\?/);
  for (const committee of [
    'Kuantum Fiziği',
    'Nöropsikoloji',
    'Yapay Zekâ, Veri ve Doğal Dil İşleme',
    'Uçak ve Havacılık',
    'Moleküler Biyoloji ve Genetik',
    'Adli Bilimler, Kriminalistik ve Toksikoloji',
    'Akıllı Sistemler ve Mühendislik',
  ]) {
    assert.ok(html.includes(committee), `missing committee ${committee}`);
  }
});

test('structured data exposes the canonical Event URLs and committee FAQ entry', () => {
  const blocks = jsonLdBlocks(html);
  const event = blocks.find((block) => block['@type'] === 'Event');
  const faq = blocks.find((block) => block['@type'] === 'FAQPage');

  assert.equal(event.url, 'https://maltepefencalistay.org/');
  assert.equal(event.image, 'https://maltepefencalistay.org/assets/images/optimized/social-share.png');
  assert.equal(event.organizer.url, 'https://maltepefenlisesi.meb.k12.tr/');
  assert.ok(faq.mainEntity.some((item) => item.name === 'MFL FBÇ komiteleri nelerdir?'));
});

test('AI search crawlers can access public pages while operational paths stay excluded', () => {
  for (const crawler of ['OAI-SearchBot', 'Google-Extended', 'PerplexityBot']) {
    const group = new RegExp(`User-agent: ${crawler}\\r?\\nAllow: /\\r?\\nDisallow: /tara`, 'i');
    assert.match(robots, group);
  }
});
