(() => {
  const D = window.DATA;

  // ——— язык: ?lang=… → сохранённый выбор → язык браузера ———
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };
  const urlLang = new URLSearchParams(location.search || "").get("lang");
  let LANG = urlLang || storage.get("lang") || (/^ru|^uk|^be|^ka/i.test(navigator.language || "") ? "ru" : "en");
  if (!["ru", "en"].includes(LANG)) LANG = "ru";
  if (urlLang) storage.set("lang", LANG);
  const T = window.I18N[LANG];
  if (LANG === "en") {
    const missing = window.I18N.applyContent(D, window.DATA_EN);
    if (missing.length) console.warn("[i18n] no English text for", missing);
  }
  const DAY = 86400000;
  const START = Date.UTC(2022, 1, 24);
  // игра идёт до сегодняшнего дня (по часам игрока), но не раньше даты последних событий
  const NOW = new Date();
  const END = Math.max(Date.UTC(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()), Date.UTC(2026, 10, 22));
  const SPEEDS = [1, 2, 4, 8, 16];
  const BASE_INTERVAL = 1900;
  // еда, транспорт, хинкали — $ в месяц сверх аренды: бедные живут скромнее
  const livingCost = income => 260 + 0.1 * income;
  const VISA_DAYS = 345;

  const $ = sel => document.querySelector(sel);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const parse = str => { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const fmt = t => { const d = new Date(t); return T.fmt(d.getUTCDate(), d.getUTCMonth(), d.getUTCFullYear(), T.months); };
  const esc = str => String(str).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  D.FIXED.forEach(e => (e.t = parse(e.date)));
  D.FIXED.sort((a, b) => a.t - b.t);
  D.POOL.forEach(e => { e.tFrom = e.from ? parse(e.from) : START; e.tTo = e.to ? parse(e.to) : END; });
  D.AMBIENT.forEach(e => (e.t = parse(e.from)));

  let s = null;          // состояние жизни
  let timer = null;
  let speedIdx = 0;
  let paused = false;
  let awaiting = null;   // карточка, ждущая выбора
  let autopilot = false;

  function newLife() {
    const gender = Math.random() < 0.5 ? "m" : "f";
    const base = pick(D.PROFS);
    const prof = { ...base, name: gender === "f" && base.nameF ? base.nameF : base.name };
    const st = {
      char: { name: pick(D.NAMES[gender]), age: rnd(22, 38), gender, city: pick(D.CITIES), prof },
      date: START,
      money: rnd(prof.money[0], prof.money[1]),
      income: prof.income,
      rent: 450,
      mental: 62, geo: 0, tusa: 15,
      counters: { khinkali: 0, beer: 0, chacha: 0, dumpster: 0, protests: 0, fights: 0, partners: 0, borderruns: 0 },
      flags: new Set(),
      fired: {},
      lastEntry: parse("2022-03-01"),
      arrived: false,
      ended: null,
      ambientSeen: new Set(),
      path: [],
      times: {},
      fillerUsed: new Set(),
      roll: Math.random(),  // судьба этой жизни: от неё зависят редкие развилки
      binge: null,          // { refusals, offer, fillerUsed } пока идёт запой
    };
    st.g = (m, f) => (st.char.gender === "m" ? m : f);
    st.has = f => st.flags.has(f);
    st.month = () => new Date(st.date).getUTCMonth() + 1;
    return st;
  }

  // ——— механика ———

  function applyFx(fx = {}) {
    for (const [k, v] of Object.entries(fx)) {
      if (k === "money") s.money += v;
      else if (["mental", "geo", "tusa"].includes(k)) s[k] = clamp(s[k] + v, 0, 100);
      else if (k in s.counters) s.counters[k] += v;
      else if (k === "flag") s.flags.add(v);
      else if (k === "unflag") s.flags.delete(v);
      else if (k === "rent") s.rent = v;
      else if (k === "income") s.income = Math.round(s.char.prof.income * v);
      else if (k === "resetVisa") s.lastEntry = s.date;
      else if (k === "end") s.ended = v;
      else if (k === "unbinge") { s.binge = null; s.mental = 35; s.income = Math.round(s.char.prof.income * (s.has("layoff") && !s.has("rehired") ? 0.55 : 1)); }
      else if (k === "bingeRefuse") s.binge && (s.binge.refusals += 1);
    }
  }

  function economy(days) {
    if (!s.arrived) return;
    if (s.binge) { // работы нет, деньги уходят на чачу и доставку
      s.money -= ((s.rent + 30 * 25) * days) / 30;
      s.counters.chacha += Math.round(days * 1.5);
      s.counters.beer += Math.round(days);
      return;
    }
    s.money += ((s.income - s.rent - livingCost(s.income)) * days) / 30;
    s.mental = clamp(s.mental - 0.08 * days, 0, 100);
    s.geo = clamp(s.geo - 0.045 * days, 0, 100); // язык без практики забывается
  }

  function eligible(e) {
    if (s.date < e.tFrom || s.date > e.tTo) return false;
    if (e.cond && !e.cond(s)) return false;
    const last = s.fired[e.id];
    if (last == null) return true;
    // повторяемые события: не больше max раз за жизнь и не чаще раза в cd дней
    if (!e.repeat || (s.times[e.id] || 0) >= (e.max || 2)) return false;
    return s.date - last >= (e.cd || 300) * DAY;
  }

  function pickPool() {
    const list = D.POOL.filter(eligible);
    if (!list.length) return null;
    const total = list.reduce((a, e) => a + (e.w || 1), 0);
    let r = Math.random() * total;
    for (const e of list) { r -= e.w || 1; if (r <= 0) return e; }
    return list[list.length - 1];
  }

  function borderRunEvent() {
    const year = new Date(s.date).getUTCFullYear();
    const base = year < 2024 ? 0 : year === 2024 ? 0.04 : 0.1;
    // с декабря 2024 иностранцев с протестов депортируют и разворачивают на границе
    const protestRisk = s.date >= parse("2024-12-01") ? Math.min(0.25, s.counters.protests * 0.02) : 0;
    const risk = base * (s.geo >= 40 ? 0.4 : 1) + protestRisk;
    const roll = () => { const r = Math.random() < risk; if (r && protestRisk > 0 && Math.random() < protestRisk / risk) s.flags.add("refused_protest"); return r; };
    const B = T.border;
    return {
      id: "borderrun", tag: "life", repeat: true,
      text: B.text(s, protestRisk, base),
      choices: [
        { t: B.armT, r: st => { if (roll()) { st.ended = "refused"; return B.armBad; } return B.armOk; }, fx: { borderruns: 1, money: -40, resetVisa: true } },
        { t: B.turT, r: st => { if (roll()) { st.ended = "refused"; return B.turBad; } return B.turOk; }, fx: { borderruns: 1, money: -180, mental: 6, resetVisa: true } },
      ],
    };
  }

  // Следующий шаг запоя: попытка выбраться (если отказов меньше трёх) или строчка из запоя
  function bingeStep() {
    const B = D.BINGE, b = s.binge;
    const v = x => (typeof x === "function" ? x(s) : x);
    if (b.refusals >= 3 && !b.lostShown) { b.lostShown = true; s.flags.add("binge_lost"); return { filler: { text: B.lost, fx: {} }, tag: "binge" }; }
    if (b.refusals < 3 && Math.random() < 0.6) {
      const o = B.offers[b.offer % B.offers.length];
      b.offer += 1;
      return { ev: {
        id: `binge_${b.offer}`, tag: "binge", text: o.text,
        choices: [
          { t: v(o.yes[0]), r: o.yes[1], fx: { unbinge: true } },
          { t: v(o.no[0]), r: o.no[1], fx: { bingeRefuse: true } },
        ],
      } };
    }
    const free = B.filler.map((_, i) => i).filter(i => !b.fillerUsed.has(i));
    const i = free.length ? pick(free) : rnd(0, B.filler.length - 1);
    b.fillerUsed.add(i);
    return { filler: { text: B.filler[i], fx: {} }, tag: "binge" };
  }

  // Один шаг времени: 5–10 дней. Возвращает событие, фоновую строчку или null (тихая неделя).
  function step() {
    const target = Math.min(s.date + rnd(5, 10) * DAY, END);
    const fixed = D.FIXED.find(e => !(e.id in s.fired) && e.t <= target && (!e.cond || e.cond(s)));
    // пропускаем фиксированные события, у которых не выполнилось условие
    D.FIXED.forEach(e => { if (!(e.id in s.fired) && e.t <= target && e.cond && !e.cond(s)) s.fired[e.id] = e.t; });

    const prev = s.date;
    s.date = fixed ? Math.max(fixed.t, s.date) : target;
    economy((s.date - prev) / DAY);
    if (s.date >= parse("2022-03-01")) s.arrived = true;

    if (fixed) return { ev: fixed };
    if (!s.arrived) return null;
    if (s.binge) return bingeStep();
    if (!s.has("vnzh") && (s.date - s.lastEntry) / DAY > VISA_DAYS) return { ev: borderRunEvent() };
    if (Math.random() < 0.62) { const ev = pickPool(); if (ev) return { ev }; }
    if (Math.random() < 0.45) {
      const free = D.FILLER.map((_, i) => i).filter(i => !s.fillerUsed.has(i));
      if (free.length) { const i = pick(free); s.fillerUsed.add(i); return { filler: D.FILLER[i](s) }; }
    }
    return null;
  }

  function tick() {
    if (!s || s.ended || awaiting || paused) return;

    // тихие недели проматываем, пока не случится что-нибудь (но не больше 5 шагов за тик)
    let res = null;
    for (let i = 0; i < 5 && !res && s.date < END; i++) res = step();

    if (res?.ev) {
      s.fired[res.ev.id] = s.date;
      s.times[res.ev.id] = (s.times[res.ev.id] || 0) + 1;
      showEvent(res.ev);
    } else if (res?.filler) {
      applyFx(res.filler.fx);
      addCard({ text: res.filler.text, tag: res.tag || "filler" });
    }

    maybeAmbient();
    render();
    checkEnd();
  }

  function checkEnd() {
    if (awaiting) return;
    if (!s.ended) {
      if (s.money < -1500) s.ended = "home";
      else if (s.mental <= 0 && !s.binge && s.date < END) {
        s.binge = { refusals: 0, offer: 0, fillerUsed: new Set() };
        s.income = 0;
        addCard({ text: D.BINGE.start, tag: "binge" });
      }
      else if (s.date >= END) s.ended = "final";
    }
    if (s.ended) { stop(); setTimeout(showEnding, 900); }
  }

  // ——— отрисовка ———

  const txt = (v, st) => (typeof v === "function" ? v(st) : v);

  function showEvent(ev) {
    const text = ev.textFn ? ev.textFn(s) : txt(ev.text, s);
    if (ev.tweet) addTweet(ev.tweet.who, txt(ev.tweet.text, s));
    if (!ev.choices) {
      applyFx(ev.fx);
      addCard({ text, tag: ev.tag });
      return;
    }
    applyFx(ev.fx);
    const card = addCard({ text, tag: ev.tag, choices: ev.choices });
    awaiting = card;
    // на телефоне развилку легко пропустить: переключаемся на ленту и прокручиваем к ней
    if (document.body.classList.contains("mob-tl")) setTab("feed");
    if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.classList.add("awaiting");
    const btns = card.querySelectorAll(".choice");
    card._ev = { date: s.date, tag: ev.tag, text, options: ev.choices.map(c => c.t) };
    btns.forEach((b, i) => b.addEventListener("click", () => choose(card, ev.choices[i], b, i)));
    if (autopilot) card._auto = setTimeout(() => autoPick(card), Math.max(700, 2400 / SPEEDS[speedIdx]));
  }

  function autoPick(card) {
    const b = card.querySelectorAll(".choice");
    card._byAuto = true;
    b[Math.floor(Math.random() * b.length)].click();
  }

  function choose(card, ch, btn, idx) {
    if (awaiting !== card) return;
    clearTimeout(card._auto);
    applyFx(ch.fx);
    const result = txt(ch.r, s);
    s.path.push({ ...card._ev, picked: idx, result, auto: !!card._byAuto });
    card.querySelectorAll(".choice").forEach(b => { b.disabled = true; if (b !== btn) b.classList.add("faded"); });
    btn.classList.add("picked");
    const p = document.createElement("p");
    p.className = "result";
    p.textContent = result;
    card.querySelector(".body").appendChild(p);
    awaiting = null;
    document.body.classList.remove("awaiting");
    render();
    checkEnd();
  }

  const TAGS = T.tags;

  function addCard({ text, tag, choices }) {
    const el = document.createElement("article");
    el.className = `card tag-${tag}`;
    el.innerHTML = `
      <div class="meta"><time>${fmt(s.date)}</time>${TAGS[tag] ? `<span class="badge">${TAGS[tag]}</span>` : ""}</div>
      <div class="body"><p>${esc(text)}</p>
      ${choices ? `<div class="choices">${choices.map(c => `<button class="choice">${esc(c.t)}</button>`).join("")}</div>` : ""}
      </div>`;
    const feed = $("#feed");
    feed.prepend(el);
    while (feed.children.length > 80) feed.lastChild.remove();
    return el;
  }

  const AVA_COLORS = ["#c0392b", "#8e44ad", "#16a085", "#d35400", "#2c3e50", "#7f8c2d", "#b03a6b"];
  function addTweet(who, text) {
    const el = document.createElement("div");
    el.className = "tweet";
    const color = AVA_COLORS[[...who].reduce((a, c) => a + c.charCodeAt(0), 0) % AVA_COLORS.length];
    el.innerHTML = `<div class="ava" style="background:${color}">${esc(who[0].toUpperCase())}</div>
      <div><div class="who">@${esc(who)} <span>· ${fmt(s.date)}</span></div><div class="ttext">${esc(text)}</div></div>`;
    const tl = $("#tl");
    tl.prepend(el);
    while (tl.children.length > 40) tl.lastChild.remove();
    const badge = $("#tlCount");
    if (document.body.classList.contains("mob-feed")) { badge.textContent = String((+badge.textContent || 0) + 1); badge.hidden = false; }
  }

  function maybeAmbient() {
    if (Math.random() > 0.3) return;
    const list = D.AMBIENT.filter(a => a.t <= s.date && !s.ambientSeen.has(a.text));
    if (!list.length) return;
    const a = pick(list);
    s.ambientSeen.add(a.text);
    addTweet(a.who, a.text);
  }

  function render() {
    $("#date").textContent = fmt(s.date);
    const days = Math.max(0, Math.floor((s.date - parse("2022-03-01")) / DAY));
    $("#days").textContent = s.arrived ? T.day(days + 1) : T.notYet;
    const m = Math.round(s.money);
    $("#money").textContent = `${m < 0 ? "−" : ""}$${Math.abs(m).toLocaleString(T.locale)}`;
    $("#money").classList.toggle("neg", m < 0);
    $("#flow").textContent = T.flow(s.income, s.rent);
    for (const k of ["mental", "geo", "tusa"]) {
      $(`#${k}`).style.width = `${s[k]}%`;
      $(`#${k}`).parentElement.classList.toggle("low", s[k] < 20);
      $(`#${k}N`).textContent = Math.round(s[k]);
    }
    const c = s.counters;
    const L = T.counters;
    $("#counters").innerHTML = [
      ["🥟", c.khinkali, L.khinkali], ["🍺", c.beer, L.beer], ["🥃", c.chacha, L.chacha], ["🗑️", c.dumpster, L.dumpster],
      ["📣", c.protests, L.protests], ["👊", c.fights, L.fights], ["💞", c.partners, L.partners], ["🛂", c.borderruns, L.borderruns],
    ].map(([i, n, l]) => `<span title="${l}">${i} <b>${n}</b> <em>${l}</em></span>`).join("");
    renderNews();
    const pct = ((s.date - START) / (END - START)) * 100;
    $("#progress").style.width = `${clamp(pct, 0, 100)}%`;
  }

  // Параллельная лента реальных новостей России и Украины: последняя на текущую дату
  const NEWS = (window.NEWS || []).map(n => ({ ...n, t: parse(n.date) })).sort((a, b) => a.t - b.t);
  let shownNews = null;
  function renderNews() {
    let cur = null;
    for (const n of NEWS) if (n.t <= s.date) cur = n;
    const box = $("#news");
    box.hidden = !cur;
    if (!cur || cur === shownNews) return;
    shownNews = cur;
    $("#newsDate").textContent = fmt(cur.t);
    $("#newsText").textContent = cur[LANG];
    box.classList.remove("fresh");
    void box.offsetWidth; // перезапуск анимации
    box.classList.add("fresh");
  }

  // ——— управление ———

  function start() {
    stop();
    timer = setInterval(tick, BASE_INTERVAL / SPEEDS[speedIdx]);
  }
  function stop() { clearInterval(timer); timer = null; }

  function setSpeed(i) {
    speedIdx = i;
    document.querySelectorAll("[data-speed]").forEach(b => b.classList.toggle("on", +b.dataset.speed === i));
    if (!paused && s && !s.ended) start();
  }

  function togglePause(force) {
    paused = force ?? !paused;
    $("#pause").textContent = paused ? "▶" : "❚❚";
    $("#pause").setAttribute("aria-label", paused ? T.resume : T.pause);
    if (paused) stop(); else if (s && !s.ended) start();
  }

  // ——— экраны ———

  function rollCharacter() {
    s = newLife();
    const c = s.char;
    $("#who").innerHTML = T.who(c, esc);
    $("#whoMoney").textContent = T.whoMoney(s.money, c.prof.income, T.locale);
  }


  function beginLife() {
    $("#intro").hidden = true;
    $("#ending").hidden = true;
    $("#game").hidden = false;
    $("#feed").innerHTML = "";
    shownNews = null;
    $("#tl").innerHTML = "";
    awaiting = null;
    togglePause(false);
    render();
    tick();
    start();
  }

  function finalText() {
    return T.final(s, fmt(END), Math.floor((END - parse("2022-03-01")) / DAY));
  }

  function showEnding() {
    const e = D.ENDINGS[s.ended];
    $("#game").hidden = true;
    $("#ending").hidden = false;
    $("#endDays").textContent = T.congrats(s, Math.max(0, Math.floor((s.date - parse("2022-03-01")) / DAY)));
    $("#endTitle").textContent = e.title;
    $("#endText").textContent = e.text ? e.text(s) : finalText();
    $("#endDate").textContent = `${esc(s.char.name)} · ${fmt(START)} — ${fmt(s.date)}`;
    const c = s.counters;
    const rows = T.rows({
      ...c, days: Math.max(0, Math.floor((s.date - parse("2022-03-01")) / DAY)),
      geo: `${Math.round(s.geo)}/100`, mental: `${Math.round(s.mental)}/100`, money: `$${Math.round(s.money).toLocaleString(T.locale)}`,
    });
    $("#endStats").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    renderPath();
  }

  // Карта выборов: каждая развилка жизни, выбранный вариант и те, что остались непрожитыми
  function renderPath() {
    const short = t => (t.length > 150 ? t.slice(0, t.lastIndexOf(" ", 150)) + "…" : t);
    const nodes = s.path.map((n, i) => `
      <li class="node tag-${n.tag}">
        <div class="dot" aria-hidden="true"></div>
        <div class="nmeta"><time>${fmt(n.date)}</time>${TAGS[n.tag] ? `<span class="badge">${TAGS[n.tag]}</span>` : ""}${n.auto ? `<span class="autotag">${T.autoTag}</span>` : ""}</div>
        <p class="ntext">${esc(short(n.text))}</p>
        <ul class="opts">${n.options.map((o, j) => `<li class="${j === n.picked ? "yes" : "no"}">${j === n.picked ? "●" : "○"} ${esc(o)}</li>`).join("")}</ul>
        <p class="nres">${esc(n.result)}</p>
      </li>`).join("");
    const end = D.ENDINGS[s.ended];
    $("#path").innerHTML = nodes + `<li class="node final"><div class="dot" aria-hidden="true"></div><div class="nmeta"><time>${fmt(s.date)}</time></div><p class="ntext"><b>${esc(end.title)}</b></p></li>`;
    $("#pathCount").textContent = T.forks(s.path.length);
    $("#pathLegend").textContent = T.pathLegend(s);
  }

  function shareText() {
    return `${T.share(s, D.ENDINGS[s.ended].title)}\nhttps://tbilisi-lor.com/?lang=${LANG}`;
  }

  // ——— события UI ———

  $("#reroll").addEventListener("click", rollCharacter);
  $("#begin").addEventListener("click", beginLife);
  $("#again").addEventListener("click", () => { $("#ending").hidden = true; $("#intro").hidden = false; rollCharacter(); });
  $("#share").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(shareText()); $("#share").textContent = T.copied; }
    catch { $("#share").textContent = T.copyFail; }
    setTimeout(() => ($("#share").textContent = T.static.share), 2000);
  });
  $("#pause").addEventListener("click", () => togglePause());
  document.querySelectorAll("[data-speed]").forEach(b => b.addEventListener("click", () => setSpeed(+b.dataset.speed)));
  $("#auto").addEventListener("change", e => {
    autopilot = e.target.checked;
    if (autopilot && awaiting) autoPick(awaiting);
  });
  function setTab(tab) {
    document.body.classList.toggle("mob-feed", tab === "feed");
    document.body.classList.toggle("mob-tl", tab === "tl");
    document.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("on", x.dataset.tab === tab));
    if (tab === "tl") { $("#tlCount").hidden = true; $("#tlCount").textContent = "0"; }
  }
  document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  document.addEventListener("keydown", e => {
    if (e.code === "Space" && !$("#game").hidden && e.target.tagName !== "BUTTON") { e.preventDefault(); togglePause(); }
  });

  // статические подписи страницы
  function applyStatic() {
    document.documentElement.lang = LANG;
    document.title = T.docTitle;
    document.querySelectorAll("[data-i18n]").forEach(el => { const v = T.static[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $("#tl").dataset.empty = T.tlEmpty;
    $("#lang").textContent = T.switchTo;
    $("#pause").setAttribute("aria-label", T.pause);
  }
  $("#lang").addEventListener("click", () => {
    const next = LANG === "ru" ? "en" : "ru";
    storage.set("lang", next);
    location.search = `?lang=${next}`;
  });

  $("#news").addEventListener("click", () => $("#news").classList.toggle("open"));
  applyStatic();
  document.body.classList.add("mob-feed");
  rollCharacter();

  // для отладки: window.__sim() — прогнать жизнь целиком без UI-таймера
  window.__state = () => s;
  window.__lang = LANG;
})();
