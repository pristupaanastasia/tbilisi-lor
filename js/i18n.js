// Строки интерфейса на двух языках и подмена контента событий английским переводом (js/data.en.js).
window.I18N = (() => {
  const plural = (n, a, b, c) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b;
    return c;
  };
  const en = (n, one, many) => (n === 1 ? one : many);

  const ru = {
    locale: "ru-RU",
    docTitle: "Тбилиси-лор: история русской эмиграции",
    switchTo: "EN",
    static: {
      title: "Тбилиси-лор",
      subtitle: "история русской эмиграции",
      lead: "К концу 2022 года в Грузию переехали больше 112 тысяч человек. Ты один из них. Жизнь идёт сама, по реальным датам. Иногда придётся выбирать.",
      begin: "Прожить эту жизнь", reroll: "Другая жизнь ↻",
      fine: "Игра шуточная. Герой и его приключения выдуманы, а бары, события и даты настоящие.",
      statMental: "Ментальное состояние", statGeo: "Грузинский", statTusa: "Тусовка",
      tabLife: "Жизнь", tl: "Твиттер", newsLabel: "Новости", autopilot: "автопилот",
      again: "Прожить другую жизнь", share: "Скопировать итог",
      pathTitle: "Карта выборов",
      pathLegend: "Сплошной кружок отмечает то, что ты выбрал(а), пустой отмечает жизни, которые остались непрожитыми.",
    },
    tlEmpty: "Пока тихо. Твиттер просыпается.",
    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    fmt: (d, m, y, M) => `${d} ${M[m]} ${y}`,
    day: n => `день ${n} в Тбилиси`,
    notYet: "ещё не в Тбилиси",
    flow: (inc, rent) => `доход $${inc} · аренда $${rent}`,
    counters: { khinkali: "хинкали", beer: "пива", chacha: "чачи", dumpster: "кг спасено", protests: "протестов", fights: "драк", partners: "партнёров", borderruns: "бордеранов" },
    tags: { news: "новости", life: "жизнь", love: "любовь", freegan: "фриганство", fight: "Кошини", bar: "бары", drama: "срач", binge: "запой", filler: "" },
    pause: "Пауза", resume: "Продолжить",
    who: (c, esc) => `Ты — <b>${esc(c.name)}</b>, ${c.age} ${plural(c.age, "год", "года", "лет")}, ${esc(c.prof.name)} из ${esc(c.city.from)}.`,
    whoMoney: (money, income, loc) => `На карте $${money.toLocaleString(loc)}. Доход $${income} в месяц. Грузинский: «гамарджоба» и «хинкали».`,
    rows: c => [
      ["Дней в Тбилиси", c.days], ["Хинкали съедено", c.khinkali], ["Бутылок пива", c.beer], ["Рюмок чачи", c.chacha],
      ["Кг еды спасено с помоек", c.dumpster], ["Протестов на Руставели", c.protests], ["Драк в «Кошини»", c.fights],
      ["Партнёров", c.partners], ["Бордеранов", c.borderruns], ["Грузинский", c.geo], ["Ментальное состояние", c.mental], ["Деньги", c.money],
    ],
    autoTag: "автопилот",
    congrats: (s, n) => `Поздравляем! Ты прожил${s.g("", "а")} в Тбилиси ${n} ${plural(n, "день", "дня", "дней")}.`,
    forks: n => `${n} ${plural(n, "развилка", "развилки", "развилок")}`,
    copied: "Скопировано ✓", copyFail: "Не вышло скопировать",
    share: (s, title) => { const c = s.counters; return `«Тбилиси-лор»: ${s.char.name}, ${s.char.prof.name} из ${s.char.city.from}.\n${title}.\n🥟 ${c.khinkali} хинкали · 🍺 ${c.beer} пива · 🗑️ ${c.dumpster} кг с помоек · 👊 ${c.fights} драк в Кошини · 💞 ${c.partners} партнёров · 📣 ${c.protests} протестов`; },
    border: {
      text: (s, protestRisk, base) => `Прошло почти 365 дней с последнего въезда. Пора делать бордеран.${protestRisk ? ` Ты был${s.g("", "а")} на ${s.counters.protests} ${plural(s.counters.protests, "протесте", "протестах", "протестах")}, а в чатах пишут, что участников митингов разворачивают на границе. Ты долго смотришь на свои фото с Руставели в инстаграме.` : base ? " В чатах пишут про отказы во въезде. Ты нервничаешь." : ""}`,
      armT: "Садахло, Армения: туда и обратно",
      armBad: "На обратном въезде пограничник долго смотрит в паспорт…",
      armOk: "Ты выходишь в Армению, покупаешь коньяк и возвращаешься. Новый год визы пошёл. Пограничник говорит «კეთილი იყოს თქვენი მობრძანება». Тебе почти приятно.",
      turT: "Сарпи, Турция: заодно на море",
      turBad: "На обратном въезде пограничник уходит «уточнить» и не возвращается полчаса…",
      turOk: "Ты съедаешь балык-экмек в Хопе, купаешься и возвращаешься в Батуми. Бордеран как отпуск.",
    },
    final: (s, today, days) => {
      const f = [], c = s.counters;
      f.push(`Сегодня ${today}. Ты всё ещё в Тбилиси, ${days} дней спустя.`);
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
      if (c.beer >= 60) f.push(`За эти годы ты выпил${s.g("", "а")} ${c.beer} бутылок пива. «Натахтари» мог бы присылать тебе открытки.`);
      if (c.fights >= 2) f.push("«Кошини» давно closed <3, но легенду о твоих хинкали-драках там до сих пор рассказывают те, кто не уехал.");
      if (c.protests >= 5) f.push(`За ${c.protests} протестов на Руставели тебя узнают продавцы кукурузы.`);
      if (s.tusa < 15) f.push("Из тусовки 2022 года остался один человек. Это ты.");
      return f.join(" ");
    },
  };

  const enUI = {
    locale: "en-US",
    docTitle: "Tbilisi Lore: a story of Russian emigration",
    switchTo: "RU",
    static: {
      title: "Tbilisi Lore",
      subtitle: "a story of Russian emigration",
      lead: "By the end of 2022 more than 112,000 people from Russia had moved to Georgia. You are one of them. Life plays out on its own, on real dates. Sometimes you will have to choose.",
      begin: "Live this life", reroll: "Another life ↻",
      fine: "It's a joke game. The hero and their adventures are made up; the bars, events and dates are real.",
      statMental: "Mental state", statGeo: "Georgian", statTusa: "Social circle",
      tabLife: "Life", tl: "Twitter", newsLabel: "News", autopilot: "autopilot",
      again: "Live another life", share: "Copy summary",
      pathTitle: "Choice map",
      pathLegend: "A filled dot is what you chose; an empty one is a life you never lived.",
    },
    tlEmpty: "All quiet. Twitter is waking up.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    fmt: (d, m, y, M) => `${M[m]} ${d}, ${y}`,
    day: n => `day ${n} in Tbilisi`,
    notYet: "not in Tbilisi yet",
    flow: (inc, rent) => `income $${inc} · rent $${rent}`,
    counters: { khinkali: "khinkali", beer: "beers", chacha: "chacha shots", dumpster: "kg rescued", protests: "protests", fights: "fights", partners: "partners", borderruns: "border runs" },
    tags: { news: "news", life: "life", love: "love", freegan: "freeganism", fight: "Koshini", bar: "bars", drama: "drama", binge: "binge", filler: "" },
    pause: "Pause", resume: "Resume",
    who: (c, esc) => `You are <b>${esc(c.name)}</b>, ${c.age}, a ${esc(c.prof.name)} from ${esc(c.city.from)}.`,
    whoMoney: (money, income, loc) => `$${money.toLocaleString(loc)} on your card. Income $${income} a month. Georgian: "gamarjoba" and "khinkali".`,
    rows: c => [
      ["Days in Tbilisi", c.days], ["Khinkali eaten", c.khinkali], ["Beers", c.beer], ["Chacha shots", c.chacha],
      ["Kg of food rescued from dumpsters", c.dumpster], ["Protests on Rustaveli", c.protests], ["Fights at Koshini", c.fights],
      ["Partners", c.partners], ["Border runs", c.borderruns], ["Georgian", c.geo], ["Mental state", c.mental], ["Money", c.money],
    ],
    autoTag: "autopilot",
    congrats: (s, n) => `Congratulations! You lived in Tbilisi for ${n} ${en(n, "day", "days")}.`,
    forks: n => `${n} ${en(n, "fork", "forks")}`,
    copied: "Copied ✓", copyFail: "Couldn't copy",
    share: (s, title) => { const c = s.counters; return `"Tbilisi Lore": ${s.char.name}, ${s.char.prof.name} from ${s.char.city.from}.\n${title}.\n🥟 ${c.khinkali} khinkali · 🍺 ${c.beer} beers · 🗑️ ${c.dumpster} kg from dumpsters · 👊 ${c.fights} fights at Koshini · 💞 ${c.partners} partners · 📣 ${c.protests} protests`; },
    border: {
      text: (s, protestRisk, base) => `Almost 365 days since your last entry. Time for a border run.${protestRisk ? ` You've been to ${s.counters.protests} ${en(s.counters.protests, "protest", "protests")}, and the chats say protesters get turned back at the border. You stare at your Rustaveli photos on Instagram for a long time.` : base ? " The chats are full of stories about entry refusals. You're nervous." : ""}`,
      armT: "Sadakhlo, Armenia: out and back",
      armBad: "On the way back in, the border guard stares at your passport for a long time…",
      armOk: "You step into Armenia, buy some brandy and come back. A fresh visa year begins. The guard says \"კეთილი იყოს თქვენი მობრძანება\". It's almost nice.",
      turT: "Sarpi, Turkey: and the sea while you're at it",
      turBad: "On the way back in, the border guard goes off to \"check something\" and doesn't return for half an hour…",
      turOk: "You eat a balık ekmek in Hopa, swim, and come back via Batumi. A border run that's basically a holiday.",
    },
    final: (s, today, days) => {
      const f = [], c = s.counters;
      f.push(`Today is ${today}. You're still in Tbilisi, ${days} days later.`);
      if (s.has("married")) f.push("You're married to Giorgi and have 400 new relatives waiting for you at every supra.");
      else if (s.has("poly")) f.push("The triad lives on. The shared Google Calendar has 1,400 \"Feelings circle\" events.");
      else if (s.has("gio")) f.push("Giorgi's mom still sends you khachapuri through the neighbours.");
      else f.push("Love life: complicated, but the view from Mtatsminda is nice.");
      if (s.has("cat") && s.has("dog")) f.push("A cat and a dog called Khachapuri tolerate you. That's family.");
      else if (s.has("cat")) f.push("The dumpster cat now owns the flat.");
      else if (s.has("dog")) f.push("Khachapuri waits for you outside every morning.");
      if (s.geo >= 60) f.push("You speak Georgian fluently, and taxi drivers have finally stopped switching to Russian.");
      else if (s.geo >= 30) f.push("Your Georgian: a confident \"tamada, please, enough\" level.");
      else f.push("Your Georgian never got past \"madloba\" and \"ara, thanks\".");
      if (c.dumpster >= 15) f.push(`You've rescued ${c.dumpster} kg of food from dumpsters. The Vake freegans call you \"the elder\".`);
      if (c.beer >= 60) f.push(`Over these years you've had ${c.beer} beers. Natakhtari could send you postcards.`);
      if (c.fights >= 2) f.push("Koshini is long \"closed <3\", but those who stayed still tell the legend of your khinkali fights.");
      if (c.protests >= 5) f.push(`After ${c.protests} protests on Rustaveli, the corn sellers know you by sight.`);
      if (s.tusa < 15) f.push("Only one person from the 2022 crowd is left. It's you.");
      return f.join(" ");
    },
  };

  // Подменяет тексты событий английскими. Логика (даты, эффекты, условия) остаётся из data.js.
  function applyContent(D, E) {
    const missing = [];
    D.NAMES = E.NAMES;
    D.CITIES.forEach(c => Object.assign(c, E.CITIES[c.id]));
    D.PROFS.forEach(p => (p.name = E.PROFS[p.id]));
    for (const e of [...D.FIXED, ...D.POOL]) {
      const t = E.EV[e.id];
      if (!t) { missing.push(e.id); continue; }
      e.text = t.text;
      delete e.textFn;
      if (e.tweet && t.tweet) e.tweet = typeof t.tweet === "string" ? { ...e.tweet, text: t.tweet } : { ...e.tweet, ...t.tweet };
      if (e.choices) e.choices = e.choices.map((c, i) => ({ ...c, t: t.choices[i][0], r: t.choices[i][1] }));
    }
    D.FILLER = D.FILLER.map((f, i) => s => ({ ...f(s), text: E.FILLER[i] }));
    D.AMBIENT.forEach((a, i) => (a.text = E.AMBIENT[i]));
    for (const k of Object.keys(D.ENDINGS)) Object.assign(D.ENDINGS[k], E.ENDINGS[k]);
    D.BINGE = E.BINGE;
    return missing;
  }

  return { ru, en: enUI, plural, applyContent };
})();
