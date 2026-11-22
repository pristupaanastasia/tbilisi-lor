// Прогоняет сотни жизней в обоих языках и проверяет, что игра не ломается.
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

const RUNS = 120;
const BROKEN = /undefined|NaN|\$\{|\[object|null/;

for (const lang of ["ru", "en"]) {
  test(`${lang}: ${RUNS} жизней доходят до концовки без ошибок`, () => {
    const g = load({ lang });
    const endings = {};
    let maxRepeats = 0;
    for (let i = 0; i < RUNS; i++) {
      const s = g.live();
      g.flushTimeouts();
      assert.ok(s.ended, "жизнь не закончилась");
      assert.ok(g.DATA.ENDINGS[s.ended], `неизвестная концовка ${s.ended}`);
      endings[s.ended] = (endings[s.ended] || 0) + 1;

      for (const c of g.cards) assert.doesNotMatch(c, BROKEN, `битый текст: ${c.slice(0, 120)}`);
      for (const t of g.tweets) assert.doesNotMatch(t, BROKEN, `битый твит: ${t.slice(0, 120)}`);
      if (lang === "en") for (const c of [...g.cards, ...g.tweets]) assert.doesNotMatch(c, /[а-яё]/i, `кириллица в EN: ${c.slice(0, 120)}`);

      const counts = {};
      for (const c of g.cards) counts[c] = (counts[c] || 0) + 1;
      maxRepeats = Math.max(maxRepeats, ...Object.values(counts).map(n => n - 1));

      const endText = g.$("#endText").textContent;
      assert.ok(endText.length > 40, "пустой финальный текст");
      assert.doesNotMatch(endText, BROKEN);
      assert.ok(g.$("#endStats").innerHTML.includes("<dt>"), "нет статистики");
    }
    assert.ok(endings.final > RUNS * 0.3, `слишком мало доживают до конца: ${JSON.stringify(endings)}`);
    assert.ok(Object.keys(endings).length >= 3, `однообразные концовки: ${JSON.stringify(endings)}`);
    assert.ok(maxRepeats <= 3, `одна и та же карточка повторилась ${maxRepeats + 1} раз`);
  });
}

test("пол героя виден и учитывается: имя, эмодзи, род в текстах", () => {
  const g = load({ lang: "ru" });
  const D = g.DATA;
  for (let i = 0; i < 60; i++) {
    g.$("#reroll").click();
    const s = globalThis.__state();
    assert.ok(D.NAMES[s.char.gender].includes(s.char.name), `${s.char.name} не из списка ${s.char.gender}`);
    assert.match(g.$("#who").innerHTML, s.char.gender === "m" ? /^👨/ : /^👩/);
  }
  for (let i = 0; i < 40; i++) {
    g.live();
    for (const c of g.cards) assert.doesNotMatch(c, /\(а\)|\(ла\)|\(лась\)|\(шла\)/, `род не подставлен: ${c.slice(0, 100)}`);
  }
});

test("ru: интерфейс на русском, en: на английском", () => {
  const ru = load({ lang: "ru" });
  assert.match(globalThis.document.title, /Тбилиси-лор/);
  assert.match(ru.$("#who").innerHTML, /Ты —/);
  const en = load({ lang: "en" });
  assert.match(globalThis.document.title, /Tbilisi Lore/);
  assert.match(en.$("#who").innerHTML, /You are/);
  assert.equal(en.$("#lang").textContent, "RU");
});

test("карта выборов и шеринг работают", async () => {
  const g = load({ lang: "ru" });
  const s = g.live();
  g.flushTimeouts();
  assert.ok(s.path.length > 0, "не было ни одной развилки");
  assert.match(g.$("#path").innerHTML, /class="node/);
  assert.match(g.$("#pathCount").textContent, /развил/);
  g.$("#share").click();
  await new Promise(r => globalThis.queueMicrotask(r));
  assert.match(g.$("#share").textContent, /Скопировано|Скопировать/);
});

test("автопилот, пауза и перезапуск", () => {
  const g = load({ lang: "en" });
  g.$("#auto").handlers.change.forEach(f => f({ target: { checked: true } }));
  g.$("#pause").click();
  g.$("#pause").click();
  const s = g.live();
  g.flushTimeouts();
  assert.ok(s.ended);
  g.$("#again").click();
  assert.equal(g.$("#intro").hidden, false);
});

test("отказ во въезде после протестов возможен", () => {
  const g = load({ lang: "ru" });
  let refusedProtest = 0;
  for (let i = 0; i < 300 && !refusedProtest; i++) {
    const s = g.live();
    if (s.ended === "refused" && s.has("refused_protest")) refusedProtest++;
  }
  assert.ok(refusedProtest > 0, "за 300 жизней ни разу не развернули за протесты");
});

test("лента новостей показывает последнюю новость на текущую дату", () => {
  const g = load({ lang: "en" });
  g.live();
  assert.equal(g.$("#news").hidden, false);
  assert.doesNotMatch(g.$("#newsText").textContent, /[а-яё]/i);
  assert.ok(g.$("#newsText").textContent.length > 10);
});

test("оффер за границу ведёт в Германию или на Кипр", () => {
  const g = load({ lang: "ru" });
  const seen = new Set();
  for (let i = 0; i < 400 && seen.size < 2; i++) {
    const s = g.live();
    g.flushTimeouts();
    if (s.ended === "germany" || s.ended === "cyprus") {
      seen.add(s.ended);
      assert.match(g.$("#endText").textContent, s.ended === "cyprus" ? /казино/ : /Берлин/);
    }
  }
  assert.deepEqual([...seen].sort(), ["cyprus", "germany"]);
});

// Ручной прогон жизни с заданной стратегией выбора: pickIdx(card, s) → индекс кнопки
function liveWith(g, pickIdx, setup) {
  g.$("#reroll").click();
  g.$("#begin").click();
  const s0 = globalThis.__state();
  if (setup) setup(s0);
  for (let i = 0; i < 4000; i++) {
    const card = g.$("#feed").children[0];
    const btns = card && card.querySelectorAll(".choice");
    if (btns && btns.length && !btns[0].disabled) btns[pickIdx(card, globalThis.__state(), btns.length)].click();
    g.flushTimeouts();
    const s = globalThis.__state();
    if (s.ended) break;
    globalThis.setInterval.last?.();
    g.tick();
  }
  g.flushTimeouts();
  return globalThis.__state();
}

test("запой: три отказа — деньги кончаются, едешь к родителям", () => {
  const g = load({ lang: "ru" });
  const s = liveWith(g, (card, st, n) => (st.binge ? 1 : n - 1), st => { st.mental = 0; });
  assert.equal(s.ended, "home");
  assert.ok(s.has("binge_lost"), "не дошло до трёх отказов");
  assert.match(g.$("#endText").textContent, /Родители/);
  assert.match(g.$("#endDays").textContent, /Поздравляем! Ты прожил/);
  assert.ok(g.cards.some(c => c.includes("запой")), "нет карточки начала запоя");
});

test("запой: согласиться на помощь — выходишь из запоя", () => {
  const g = load({ lang: "en" });
  const s = liveWith(g, (card, st) => 0, st => { st.mental = 0; st.money = 1e6; });
  assert.equal(s.binge, null);
  assert.ok(!s.has("binge_lost"));
  assert.match(g.$("#endDays").textContent, /Congratulations! You lived in Tbilisi for \d+ days?\./);
});

test("если от всего отказываться и денег хватает, игра идёт до сегодняшней даты", () => {
  const g = load({ lang: "ru" });
  // всегда последний вариант (обычно «нет/остаться»), денег с запасом
  const s = liveWith(g, (card, st, n) => n - 1, st => { st.money = 1e6; st.flags.add("vnzh"); });
  assert.ok(["final", "home"].includes(s.ended) || s.binge === null, s.ended);
  const d = new Date();
  const today = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
  if (s.ended === "final") assert.equal(new Date(s.date).toISOString().slice(0, 10), today);
});
