(() => {
  const D = window.DATA;
  const DAY = 86400000;
  const START = Date.UTC(2022, 1, 24);
  const END = Date.UTC(2026, 10, 22);
  const SPEEDS = [1, 2, 4, 8, 16];
  const BASE_INTERVAL = 1900;
  // еда, транспорт, хинкали — $ в месяц сверх аренды: бедные живут скромнее
  const livingCost = income => 260 + 0.1 * income;
  const VISA_DAYS = 345;
  const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  const $ = sel => document.querySelector(sel);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const parse = str => { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const fmt = t => { const d = new Date(t); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
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
    const prof = pick(D.PROFS);
    const st = {
      char: { name: pick(D.NAMES), age: rnd(22, 38), gender, city: pick(D.CITIES), prof },
      date: START,
      money: rnd(prof.money[0], prof.money[1]),
      income: prof.income,
      rent: 450,
      kukuha: 62, geo: 0, tusa: 15,
      counters: { khinkali: 0, chacha: 0, dumpster: 0, protests: 0, fights: 0, partners: 0, borderruns: 0 },
      flags: new Set(),
      fired: {},
      lastEntry: parse("2022-03-01"),
      arrived: false,
      ended: null,
      ambientSeen: new Set(),
      path: [],
      times: {},
      fillerUsed: new Set(),
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
      else if (["kukuha", "geo", "tusa"].includes(k)) s[k] = clamp(s[k] + v, 0, 100);
      else if (k in s.counters) s.counters[k] += v;
      else if (k === "flag") s.flags.add(v);
      else if (k === "unflag") s.flags.delete(v);
      else if (k === "rent") s.rent = v;
      else if (k === "income") s.income = Math.round(s.char.prof.income * v);
      else if (k === "resetVisa") s.lastEntry = s.date;
      else if (k === "end") s.ended = v;
    }
  }

  function economy(days) {
    if (!s.arrived) return;
    s.money += ((s.income - s.rent - livingCost(s.income)) * days) / 30;
    s.kukuha = clamp(s.kukuha - 0.05 * days, 0, 100);
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
    return {
      id: "borderrun", tag: "life", repeat: true,
      text: `Прошло почти 365 дней с последнего въезда. Пора делать бордеран.${protestRisk ? ` Ты был${s.g("", "а")} на ${s.counters.protests} ${plural(s.counters.protests, "протесте", "протестах", "протестах")}, а в чатах пишут, что участников митингов разворачивают на границе. Ты долго смотришь на свои фото с Руставели в инстаграме.` : base ? " В чатах пишут про отказы во въезде. Ты нервничаешь." : ""}`,
      choices: [
        { t: "Садахло, Армения: туда и обратно", r: st => { if (roll()) { st.ended = "refused"; return "На обратном въезде пограничник долго смотрит в паспорт…"; } return "Ты выходишь в Армению, покупаешь коньяк и возвращаешься. Новый год визы пошёл. Пограничник говорит «კეთილი იყოს თქვენი მობრძანება». Тебе почти приятно."; }, fx: { borderruns: 1, money: -40, resetVisa: true } },
        { t: "Сарпи, Турция: заодно на море", r: st => { if (roll()) { st.ended = "refused"; return "На обратном въезде пограничник уходит «уточнить» и не возвращается полчаса…"; } return "Ты съедаешь балык-экмек в Хопе, купаешься и возвращаешься в Батуми. Бордеран как отпуск."; }, fx: { borderruns: 1, money: -180, kukuha: 6, resetVisa: true } },
      ],
    };
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
      addCard({ text: res.filler.text, tag: "filler" });
    }

    maybeAmbient();
    render();
    checkEnd();
  }

  function checkEnd() {
    if (awaiting) return;
    if (!s.ended) {
      if (s.money < -1500) s.ended = "home";
      else if (s.kukuha <= 0) s.ended = "kukuha";
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

  const TAGS = { news: "новости", life: "жизнь", love: "любовь", freegan: "фриганство", fight: "Кошини", bar: "бары", drama: "срач", filler: "" };

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
    $("#days").textContent = s.arrived ? `день ${days + 1} в Тбилиси` : "ещё не в Тбилиси";
    const m = Math.round(s.money);
    $("#money").textContent = `${m < 0 ? "−" : ""}$${Math.abs(m).toLocaleString("ru-RU")}`;
    $("#money").classList.toggle("neg", m < 0);
    $("#flow").textContent = `доход $${s.income} · аренда $${s.rent}`;
    for (const k of ["kukuha", "geo", "tusa"]) {
      $(`#${k}`).style.width = `${s[k]}%`;
      $(`#${k}`).parentElement.classList.toggle("low", s[k] < 20);
      $(`#${k}N`).textContent = Math.round(s[k]);
    }
    const c = s.counters;
    $("#counters").innerHTML = [
      ["🥟", c.khinkali, "хинкали"], ["🥃", c.chacha, "чачи"], ["🗑️", c.dumpster, "кг спасено"],
      ["📣", c.protests, "протестов"], ["👊", c.fights, "драк"], ["💞", c.partners, "партнёров"], ["🛂", c.borderruns, "бордеранов"],
    ].map(([i, n, l]) => `<span title="${l}">${i} <b>${n}</b> <em>${l}</em></span>`).join("");
    const pct = ((s.date - START) / (END - START)) * 100;
    $("#progress").style.width = `${clamp(pct, 0, 100)}%`;
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
    $("#pause").setAttribute("aria-label", paused ? "Продолжить" : "Пауза");
    if (paused) stop(); else if (s && !s.ended) start();
  }

  // ——— экраны ———

  function rollCharacter() {
    s = newLife();
    const c = s.char;
    $("#who").innerHTML = `Ты — <b>${esc(c.name)}</b>, ${c.age} ${plural(c.age, "год", "года", "лет")}, ${esc(c.prof.name)} из ${esc(c.city.from)}.`;
    $("#whoMoney").textContent = `На карте $${s.money.toLocaleString("ru-RU")}. Доход $${c.prof.income} в месяц. Грузинский: «гамарджоба» и «хинкали».`;
  }

  function plural(n, a, b, c) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b;
    return c;
  }

  function beginLife() {
    $("#intro").hidden = true;
    $("#ending").hidden = true;
    $("#game").hidden = false;
    $("#feed").innerHTML = "";
    $("#tl").innerHTML = "";
    awaiting = null;
    togglePause(false);
    render();
    tick();
    start();
  }

  function finalText() {
    const f = [];
    const c = s.counters;
    f.push(`Сегодня ${fmt(END)}. Ты всё ещё в Тбилиси, ${Math.floor((END - parse("2022-03-01")) / DAY)} дней спустя.`);
    if (s.has("married")) f.push("Ты в браке с Гиорги, и у тебя 400 новых родственников, которые ждут тебя на каждой супре.");
    else if (s.has("poly")) f.push("Триада жива. В Google Calendar уже 1400 событий «Круг чувств».");
    else if (s.has("gio")) f.push("Мама Гиорги до сих пор передаёт тебе хачапури через соседей.");
    else f.push("Личная жизнь: сложно, но на Мтацминде красиво.");
    if (s.has("cat") && s.has("dog")) f.push("Кот и собака по имени Хачапури тебя терпят. Это семья.");
    else if (s.has("cat")) f.push("Кот с помойки стал хозяином квартиры.");
    else if (s.has("dog")) f.push("Хачапури каждое утро ждёт тебя у подъезда.");
    if (s.geo >= 60) f.push("Ты свободно говоришь по-грузински, и таксисты наконец перестали переходить на русский.");
    else if (s.geo >= 30) f.push("Твой грузинский: уверенный уровень «тамада, пожалуйста, хватит».");
    else f.push("Грузинский так и остался на уровне «мадлоба» и «ара, спасибо».");
    if (c.dumpster >= 15) f.push(`Ты спас${s.g("", "ла")} от помойки ${c.dumpster} кг еды. Фриганы Ваке зовут тебя «старейшиной».`);
    if (c.fights >= 2) f.push("«Кошини» давно closed <3, но легенду о твоих хинкали-драках там до сих пор рассказывают те, кто не уехал.");
    if (c.protests >= 5) f.push(`За ${c.protests} протестов на Руставели тебя узнают продавцы кукурузы.`);
    if (s.tusa < 15) f.push("Из тусовки 2022 года остался один человек. Это ты.");
    return f.join(" ");
  }

  function showEnding() {
    const e = D.ENDINGS[s.ended];
    $("#game").hidden = true;
    $("#ending").hidden = false;
    $("#endTitle").textContent = e.title;
    $("#endText").textContent = e.text ? e.text(s) : finalText();
    $("#endDate").textContent = `${esc(s.char.name)} · ${fmt(START)} — ${fmt(s.date)}`;
    const c = s.counters;
    const rows = [
      ["Дней в Тбилиси", Math.max(0, Math.floor((s.date - parse("2022-03-01")) / DAY))],
      ["Хинкали съедено", c.khinkali], ["Рюмок чачи", c.chacha], ["Кг еды спасено с помоек", c.dumpster],
      ["Протестов на Руставели", c.protests], ["Драк в «Кошини»", c.fights], ["Партнёров", c.partners],
      ["Бордеранов", c.borderruns], ["Грузинский", `${Math.round(s.geo)}/100`], ["Кукуха", `${Math.round(s.kukuha)}/100`],
      ["Деньги", `$${Math.round(s.money).toLocaleString("ru-RU")}`],
    ];
    $("#endStats").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    renderPath();
  }

  // Карта выборов: каждая развилка жизни, выбранный вариант и те, что остались непрожитыми
  function renderPath() {
    const short = t => (t.length > 150 ? t.slice(0, t.lastIndexOf(" ", 150)) + "…" : t);
    const nodes = s.path.map((n, i) => `
      <li class="node tag-${n.tag}">
        <div class="dot" aria-hidden="true"></div>
        <div class="nmeta"><time>${fmt(n.date)}</time>${TAGS[n.tag] ? `<span class="badge">${TAGS[n.tag]}</span>` : ""}${n.auto ? `<span class="autotag">автопилот</span>` : ""}</div>
        <p class="ntext">${esc(short(n.text))}</p>
        <ul class="opts">${n.options.map((o, j) => `<li class="${j === n.picked ? "yes" : "no"}">${j === n.picked ? "●" : "○"} ${esc(o)}</li>`).join("")}</ul>
        <p class="nres">${esc(n.result)}</p>
      </li>`).join("");
    const end = D.ENDINGS[s.ended];
    $("#path").innerHTML = nodes + `<li class="node final"><div class="dot" aria-hidden="true"></div><div class="nmeta"><time>${fmt(s.date)}</time></div><p class="ntext"><b>${esc(end.title)}</b></p></li>`;
    $("#pathCount").textContent = `${s.path.length} ${plural(s.path.length, "развилка", "развилки", "развилок")}`;
  }

  function shareText() {
    const c = s.counters;
    return `«1 из 112 000»: ${s.char.name}, ${s.char.prof.name} из ${s.char.city.from}.\n${D.ENDINGS[s.ended].title}.\n🥟 ${c.khinkali} хинкали · 🗑️ ${c.dumpster} кг с помоек · 👊 ${c.fights} драк в Кошини · 💞 ${c.partners} партнёров · 📣 ${c.protests} протестов\n${location.href}`;
  }

  // ——— события UI ———

  $("#reroll").addEventListener("click", rollCharacter);
  $("#begin").addEventListener("click", beginLife);
  $("#again").addEventListener("click", () => { $("#ending").hidden = true; $("#intro").hidden = false; rollCharacter(); });
  $("#share").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(shareText()); $("#share").textContent = "Скопировано ✓"; }
    catch { $("#share").textContent = "Не вышло скопировать"; }
    setTimeout(() => ($("#share").textContent = "Скопировать итог"), 2000);
  });
  $("#pause").addEventListener("click", () => togglePause());
  document.querySelectorAll("[data-speed]").forEach(b => b.addEventListener("click", () => setSpeed(+b.dataset.speed)));
  $("#auto").addEventListener("change", e => {
    autopilot = e.target.checked;
    if (autopilot && awaiting) autoPick(awaiting);
  });
  document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => {
    document.body.classList.toggle("mob-feed", b.dataset.tab === "feed");
    document.body.classList.toggle("mob-tl", b.dataset.tab === "tl");
    document.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("on", x === b));
    if (b.dataset.tab === "tl") $("#tlCount").hidden = true, ($("#tlCount").textContent = "0");
  }));
  document.addEventListener("keydown", e => {
    if (e.code === "Space" && !$("#game").hidden && e.target.tagName !== "BUTTON") { e.preventDefault(); togglePause(); }
  });

  document.body.classList.add("mob-feed");
  rollCharacter();

  // для отладки: window.__sim() — прогнать жизнь целиком без UI-таймера
  window.__state = () => s;
})();
