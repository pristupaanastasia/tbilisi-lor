# Тбилиси-лор: история русской эмиграции

**Играть: https://tbilisi-lor.com** · [English version below](#tbilisi-lore-a-story-of-russian-emigration)

Шуточный браузерный симулятор жизни русского эмигранта в Тбилиси, в духе «1 in 8 Billion». Тебе выпадает случайный герой: имя, город, профессия и деньги на карте. Дальше жизнь идёт сама, неделя за неделей, с 24 февраля 2022 года до сегодняшнего дня. Иногда нужно выбирать.

### Что внутри

- **Реальные даты.** Митинги на Руставели, закон об «иноагентах», 28 ноября 2024, штрафы, депортации, ремонт Руставели, отключения воды и газа, бары Кошини, «Плохо», Seniors и веган-кафе «Фрик» с его великими тредами. Всё, что касается реальных мест, людей и событий, взято из новостей и твитов. Выдуманы только приключения самого героя.
- **Лента новостей России и Украины** идёт параллельно игре, только реальные события.
- **Твиттер** сбоку комментирует происходящее (аккаунты выдуманные).
- **Показатели:** деньги, ментальное состояние, грузинский язык, тусовка, а ещё счётчики хинкали, пива, чачи, еды с помоек, протестов, драк, партнёров и бордеранов.
- **Механики:** бордераны раз в год с риском отказа во въезде (выше, если ходишь на протесты), запой при нулевом ментальном состоянии, оффер в Германию или на Кипр, знакомства с учётом гендерного перекоса среди эмигрантов.
- **Концовки:** «Ты всё ещё здесь», «Возвращение» (кончились деньги), «Отказ во въезде», Лиссабон, Германия и Кипр с казино. В конце показана карта всех выборов: что ты выбрал(а) и какие жизни остались непрожитыми.
- **Два языка:** русский и английский, переключатель в правом верхнем углу.
- **Сделано для телефона:** большинство играет с мобильного.

### Запуск локально

Сборка не нужна, достаточно открыть `index.html` в браузере.

### Тесты

```sh
make test     # node --test, покрытие строк в js/ не ниже 70%
make hooks    # подключить pre-push хук: проверка на секреты и IP + тесты
```

Тесты прогоняют сотни жизней на обоих языках с фейковым DOM. Они проверяют, что перевод полный, тексты не ломаются, а концовки и механики (запой, отказ во въезде, оффер) достижимы.

### Выкладка

```sh
echo 'SERVER = root@<ip>' > deploy.local.mk   # файл не попадает в git
make deploy                                   # Caddy в Docker, HTTPS автоматически
```

### Структура

| Файл | Что там |
|---|---|
| `js/data.js` | события, даты, эффекты, концовки (русский) |
| `js/data.en.js` | английские тексты по `id` событий |
| `js/news.js` | лента реальных новостей России и Украины |
| `js/i18n.js` | строки интерфейса на двух языках |
| `js/game.js` | механика и отрисовка |
| `test/` | тесты и фейковый DOM |
| `scripts/check-secrets.js` | проверка коммитов перед пушем |
| `deploy/` | Caddy и docker compose |

---

# Tbilisi Lore: a story of Russian emigration

**Play: https://tbilisi-lor.com/?lang=en**

A tongue-in-cheek browser life simulator about a Russian emigrant in Tbilisi, in the spirit of "1 in 8 Billion". You get a random hero: a name, a home city, a job and some money on the card. Then life plays out on its own, week by week, from February 24, 2022 to today. Sometimes you have to choose.

### What's inside

- **Real dates.** Rallies on Rustaveli, the "foreign agents" law, November 28, 2024, fines, deportations, the Rustaveli overhaul, water and gas outages, the Koshini, Plokho and Seniors bars, and vegan café Freek with its legendary Twitter threads. Anything about real places, people and events comes from the news and tweets. Only the hero's own adventures are made up.
- **A Russia and Ukraine news ticker** runs alongside the game, real events only.
- **Twitter** in the side column comments on what's happening (the accounts are fictional).
- **Stats:** money, mental state, Georgian, social circle, plus counters for khinkali, beer, chacha, food rescued from dumpsters, protests, fights, partners and border runs.
- **Mechanics:** yearly border runs with a risk of being refused entry (higher if you go to protests), a binge when your mental state hits zero, a job offer in Germany or Cyprus, and dating shaped by the gender imbalance among emigrants.
- **Endings:** "You're still here", "Going back" (out of money), "Entry refused", Lisbon, Germany, and Cyprus with its casino. At the end you get a map of every choice you made and the lives you didn't live.
- **Two languages:** Russian and English, switch in the top-right corner.
- **Built for phones:** most people play on mobile.

### Run locally

No build step, just open `index.html` in a browser.

### Tests

```sh
make test     # node --test, line coverage in js/ must be at least 70%
make hooks    # enable the pre-push hook: secret and IP scan + tests
```

The tests play hundreds of lives in both languages against a fake DOM. They check that the translation is complete, no text is broken, and every ending and mechanic (binge, entry refusal, job offer) is reachable.

### Deploy

```sh
echo 'SERVER = root@<ip>' > deploy.local.mk   # not tracked by git
make deploy                                   # Caddy in Docker, automatic HTTPS
```

### Layout

| File | Contents |
|---|---|
| `js/data.js` | events, dates, effects, endings (Russian) |
| `js/data.en.js` | English texts keyed by event `id` |
| `js/news.js` | real Russia and Ukraine news ticker |
| `js/i18n.js` | UI strings in both languages |
| `js/game.js` | mechanics and rendering |
| `test/` | tests and the fake DOM |
| `scripts/check-secrets.js` | pre-push commit scan |
| `deploy/` | Caddy and docker compose |
