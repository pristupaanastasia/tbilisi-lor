// Запускает игру в Node без браузера: фейковый DOM + ручное управление таймерами.
// Файлы игры подключаются через require, чтобы их видело покрытие node --test.
const path = require("path");

const ROOT = path.join(__dirname, "..");

function makeEl(id) {
  const el = {
    id, textContent: "", hidden: false, disabled: false, style: {}, dataset: {}, children: [], handlers: {}, tagName: "DIV",
    _html: "",
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c, f) { (f ?? !this._s.has(c)) ? this._s.add(c) : this._s.delete(c); },
      contains(c) { return this._s.has(c); },
    },
    set innerHTML(v) { this._html = v; if (v === "") this.children = []; this._btns = null; this._body = null; },
    get innerHTML() { return this._html; },
    addEventListener(t, f) { (this.handlers[t] ||= []).push(f); },
    click() { if (!this.disabled) (this.handlers.click || []).forEach(f => f({ target: this })); },
    setAttribute() {},
    prepend(c) { this.children.unshift(c); },
    appendChild(c) { this.children.push(c); },
    get lastChild() { const self = this; return { remove() { self.children.pop(); } }; },
    get parentElement() { return makeEl("parent"); },
    querySelectorAll(sel) {
      if (sel === ".choice") {
        if (!this._btns) {
          const n = (this._html.match(/class="choice"/g) || []).length;
          this._btns = Array.from({ length: n }, (_, i) => makeEl("btn" + i));
        }
        return this._btns;
      }
      return [];
    },
    querySelector(sel) { return sel === ".body" ? (this._body ||= makeEl("body")) : makeEl(sel); },
  };
  return el;
}

// Загружает игру заново (с чистыми модулями) на нужном языке.
function load({ lang = "ru" } = {}) {
  const els = {};
  const cards = [];   // все тексты, которые появились в ленте
  const tweets = [];
  let intervalFn = null;
  let timeouts = [];
  const store = { lang };

  const document = {
    body: makeEl("body"),
    documentElement: makeEl("html"),
    title: "",
    querySelector: sel => (els[sel] ||= makeEl(sel)),
    querySelectorAll: () => [],
    createElement: () => {
      const e = makeEl("new");
      const d = Object.getOwnPropertyDescriptor(e, "innerHTML");
      Object.defineProperty(e, "innerHTML", {
        set(v) {
          d.set.call(e, v);
          const m = v.match(/<div class="body"><p>([^<]*)<\/p>/);
          if (m) cards.push(m[1]);
          const t = v.match(/<div class="ttext">([^<]*)<\/div>/);
          if (t) tweets.push(t[1]);
        },
        get() { return d.get.call(e); },
      });
      return e;
    },
    addEventListener() {},
  };

  Object.assign(globalThis, {
    __fast: true, // в тестах не ждём время чтения
    window: globalThis,
    document,
    location: { href: "https://tbilisi-lor.com/", search: "", pathname: "/" },
    history: { replaceState() {} },
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)) },
    setInterval: f => { intervalFn = f; return 1; },
    clearInterval: () => { intervalFn = null; },
    setTimeout: f => { timeouts.push(f); return 1; },
    clearTimeout() {},
  });
  Object.defineProperty(globalThis, "navigator", { value: { language: lang, clipboard: { writeText: async () => {} } }, configurable: true, writable: true });

  for (const f of ["js/data.js", "js/news.js", "js/data.en.js", "js/i18n.js", "js/game.js"]) {
    const p = path.join(ROOT, f);
    delete require.cache[require.resolve(p)];
    require(p);
  }

  const $ = sel => document.querySelector(sel);

  // Прожить одну жизнь со случайными выборами. Возвращает итоговое состояние.
  function live({ maxSteps = 3000 } = {}) {
    cards.length = 0;
    tweets.length = 0;
    $("#reroll").click();
    $("#begin").click();
    for (let i = 0; i < maxSteps; i++) {
      const card = $("#feed").children[0];
      const btns = card && card.querySelectorAll(".choice");
      if (btns && btns.length && !btns[0].disabled) btns[Math.floor(Math.random() * btns.length)].click();
      if (timeouts.length) { const t = timeouts; timeouts = []; t.forEach(f => f()); }
      const s = globalThis.__state();
      if (s.ended && !intervalFn) break;
      if (intervalFn) intervalFn();
    }
    return globalThis.__state();
  }

  return { $, live, cards, tweets, DATA: globalThis.DATA, els, tick: () => intervalFn && intervalFn(), flushTimeouts: () => { const t = timeouts; timeouts = []; t.forEach(f => f()); } };
}

module.exports = { load, ROOT };
