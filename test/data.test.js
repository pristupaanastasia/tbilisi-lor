// Проверки содержимого: события корректно описаны, английский перевод полный.
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

const { DATA } = load({ lang: "ru" });
const EN = globalThis.DATA_EN;
const ALL = [...DATA.FIXED, ...DATA.POOL];
const START = Date.UTC(2022, 1, 24);
const NOW = new Date();
const END = Math.max(Date.UTC(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()), Date.UTC(2026, 10, 22));
const FX_KEYS = new Set(["money", "mental", "geo", "tusa", "khinkali", "beer", "chacha", "dumpster", "protests", "fights", "partners", "borderruns", "flag", "unflag", "rent", "income", "resetVisa", "end"]);
const TAGS = new Set(["news", "life", "love", "freegan", "fight", "bar", "drama"]);
const parse = d => { const [y, m, dd] = d.split("-").map(Number); return Date.UTC(y, m - 1, dd); };

test("у всех событий уникальные id", () => {
  const ids = ALL.map(e => e.id);
  assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), []);
});

test("фиксированные события имеют дату в пределах игры", () => {
  for (const e of DATA.FIXED) {
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, e.id);
    assert.ok(parse(e.date) >= START && parse(e.date) <= END, `${e.id}: ${e.date}`);
  }
});

test("случайные события: окно дат корректно, даты не перепутаны с фиксированными", () => {
  for (const e of DATA.POOL) {
    assert.equal(e.date, undefined, `${e.id} в POOL не должен иметь date`);
    if (e.from && e.to) assert.ok(parse(e.from) <= parse(e.to), e.id);
  }
});

test("у каждого события есть текст, тег и корректные эффекты", () => {
  for (const e of ALL) {
    assert.ok(e.text || e.textFn, `${e.id}: нет текста`);
    assert.ok(TAGS.has(e.tag), `${e.id}: неизвестный тег ${e.tag}`);
    const fxs = [e.fx, ...(e.choices || []).map(c => c.fx)].filter(Boolean);
    for (const fx of fxs) for (const k of Object.keys(fx)) assert.ok(FX_KEYS.has(k), `${e.id}: неизвестный эффект ${k}`);
    for (const c of e.choices || []) assert.ok(c.t && c.r, `${e.id}: у выбора нет текста`);
  }
});

test("концовки из эффектов существуют", () => {
  for (const e of ALL) for (const c of e.choices || []) if (c.fx?.end) assert.ok(DATA.ENDINGS[c.fx.end], c.fx.end);
});

test("английский перевод покрывает все события и выборы", () => {
  for (const e of ALL) {
    const t = EN.EV[e.id];
    assert.ok(t, `нет перевода для ${e.id}`);
    assert.ok(t.text, `${e.id}: нет английского текста`);
    if (e.choices) assert.equal(t.choices?.length, e.choices.length, `${e.id}: разное число выборов`);
    if (e.tweet) assert.ok(t.tweet, `${e.id}: нет перевода твита`);
  }
  const extra = Object.keys(EN.EV).filter(id => !ALL.some(e => e.id === id));
  assert.deepEqual(extra, [], "лишние переводы без событий");
});

test("английские списки совпадают по длине с русскими", () => {
  assert.equal(EN.FILLER.length, DATA.FILLER.length);
  assert.equal(EN.AMBIENT.length, DATA.AMBIENT.length);
  assert.deepEqual(Object.keys(EN.ENDINGS).sort(), Object.keys(DATA.ENDINGS).sort());
  assert.equal(EN.NAMES.m.length, DATA.NAMES.m.length);
  assert.equal(EN.NAMES.f.length, DATA.NAMES.f.length);
  for (const c of DATA.CITIES) assert.ok(EN.CITIES[c.id], c.id);
  for (const p of DATA.PROFS) assert.ok(EN.PROFS[p.id], p.id);
});

test("в английских строках нет кириллицы", () => {
  const strings = [];
  const walk = v => {
    if (typeof v === "string") strings.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(EN);
  const bad = strings.filter(x => /[а-яё]/i.test(x));
  assert.deepEqual(bad, []);
});

test("лента новостей: даты корректны, по порядку, оба языка", () => {
  const N = globalThis.NEWS;
  assert.ok(N.length >= 20);
  let prev = 0;
  for (const n of N) {
    assert.match(n.date, /^\d{4}-\d{2}-\d{2}$/);
    const t = parse(n.date);
    assert.ok(t >= START && t <= END, n.date);
    assert.ok(t >= prev, `не по порядку: ${n.date}`);
    prev = t;
    assert.ok(n.ru && n.en, n.date);
    assert.doesNotMatch(n.en, /[а-яё]/i, n.date);
  }
});
