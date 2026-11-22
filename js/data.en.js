// English texts for the game. Keyed by event id from data.js — dates, effects and conditions live there.
// choices: [[button text, result text or s => text], ...] in the same order as in data.js.
window.DATA_EN = {
  NAMES: ["Sasha", "Zhenya", "Valya", "Mika", "Nika", "Shura", "Tosha", "Lyova", "Kira", "Slava", "Roma", "Danya"],
  CITIES: {
    msk: { name: "Moscow", from: "Moscow", to: "Moscow" },
    spb: { name: "St Petersburg", from: "St Petersburg", to: "St Petersburg" },
    ekb: { name: "Yekaterinburg", from: "Yekaterinburg", to: "Yekaterinburg" },
    nsk: { name: "Novosibirsk", from: "Novosibirsk", to: "Novosibirsk" },
    kzn: { name: "Kazan", from: "Kazan", to: "Kazan" },
    msq: { name: "Minsk", from: "Minsk", to: "Minsk" },
  },
  PROFS: {
    it: "backend developer", pm: "product manager", design: "designer", smm: "social media manager",
    standup: "stand-up comic", dj: "techno DJ", psy: "online therapist", copy: "copywriter",
  },

  EV: {
    // ——— real dates ———
    war: {
      text: s => `5 a.m. You're in ${s.char.city.name}, working as a ${s.char.prof.name}. You open your phone and there's the news. By lunchtime you're comparing plane tickets, though yesterday the only trip on your mind was a holiday.`,
      tweet: { who: "anxious_zoomer", text: "does anyone know if georgia lets you in with an internal passport? asking for myself" },
      choices: [
        ["Istanbul, then Tbilisi: $1,400 a ticket", "You fly with a layover. In Istanbul you eat a 9-euro simit and cry in duty free."],
        ["Via Yerevan, then a marshrutka", "In Yerevan everyone says \"akhper\" and asks you to stay. You take the six-hour marshrutka to Tbilisi anyway. Your neighbour, Uncle Ashot, explains the whole way that Armenians built Tbilisi, Mesrop Mashtots invented the Georgian alphabet, and khinkali are \"just our manti, only sadder\". The Georgian driver smokes in silence and turns the music up."],
        ["Upper Lars in a friend's car", "Your friend drives you in a Hyundai Solaris, listening to a podcast about Stoicism the whole way. The border takes nine hours."],
      ],
    },
    arrive: {
      text: "You're in Tbilisi. The city smells of coriander, exhaust and something you'll later identify as hope. The taxi driver gives you a free lecture on how Stalin was Georgian, \"but that one doesn't count\".",
      tweet: "day 1. ate 12 khinkali. didn't find a flat. good vibes",
    },
    bog: {
      text: "To open an account, the bank asks you to sign a form condemning the invasion of Ukraine. The queue at the branch on Pekini Avenue reaches the pharmacy next door.",
      tweet: "more IT people at the bank branch on pekini avenue today than at yandex HQ",
      choices: [
        ["Sign, obviously", "You sign. Account open. They give you an aubergine-coloured card and, for some reason, a churchkhela."],
        ["Ask the chat first", "The Telegram chat \"Tbilisi for our people\" produces 600 messages, 4 guides and one fight. A week later you sign anyway."],
      ],
    },
    rally22: { text: "Tens of thousands of people march down Rustaveli in support of Ukraine. You stand in the crowd with a blue-and-yellow ribbon. For the first time in a week you don't feel alone with the news." },
    rent: {
      text: "Your landlady in Vake, batono Nino, says the rent is now $1,100 instead of $400. \"It's not me, genatsvale, it's the market.\" There's an icon on the wall behind her.",
      tweet: "rent in vake costs like a mortgage in the moscow suburbs, but at least from my window i can see another IT guy",
      choices: [
        ["Pay $1,100. Vake is Vake", "You pay. At least the stairwell smells of expensive coffee and other people's success."],
        ["Move to Gldani", "Gldani: Soviet tower blocks, a stunning view, and a neighbour who teaches you to swear in Georgian. Rent: $350."],
        ["A bunk at Fabrika hostel", "You live in a former sewing factory with six IT people and one man who is \"writing a book\". $250 a month."],
      ],
    },
    graffiti: { text: "Someone has written \"RUSSIANS GO HOME\" on the wall of your building. Underneath, in marker, someone added: \"and take the Bolt scooters with you\". What can you say to that." },
    ip: {
      text: "At the Public Service Hall you register as an individual entrepreneur with 1% tax in fifteen minutes. The clerk gives you a sweet. You cry at the efficiency of public services and call your mom to tell her.",
      tweet: "registered a business in georgia faster than i used to get a GP appointment in russia",
    },
    mobik: {
      text: "\"Partial\" mobilisation is announced. By evening you have 47 Telegram messages asking \"can I crash at yours?\". The queue at Upper Lars stretches for 20 kilometres.",
      tweet: "lars queue. swapping my spot for a bike, the bike for a scooter, the scooter for a spot",
      choices: [
        ["Host six people on your sofa", "Six people, one sofa and one snowboarder with three snowboards. For a week the flat smells of instant noodles and brotherhood."],
        ["Send a link to hostels", "You send a Booking link. One friend replies \"got it\" and is never heard from again."],
      ],
    },
    lars_bike: { text: "Your cousin crosses Lars on foot with a bike he bought in the queue for 40,000 roubles. He gives the bike to you on the spot. You can't actually ride it in Tbilisi: everything here is uphill." },
    ny22: {
      text: "New Year's, Tbilisi style: fireworks fly from every balcony, in every direction, sometimes horizontally. You hide behind a dumpster and feel like you're on the front line of a celebration.",
      tweet: "in tbilisi you don't watch the new year's fireworks. in tbilisi you dodge them",
    },
    koshini_open: {
      text: "A bar called Koshini opens in Sololaki, with a terrace. All day its Twitter posts the same thing: \"a stunning view of the city from the terrace\". The next day it's \"a lovely view of the kilometre-long queue to the bar\", and a couple of hours later \"now the neighbours hate us within a half-kilometre radius 👍\".",
      tweet: "Koshini bar. A bar with a terrace with a stunning view of the city, a retractable roof and bluetooth",
    },
    koshini_halloween: { text: "Koshini runs a \"two-day nightmare marathon\": a chess tournament yesterday, \"horribly hopeless karaoke\" today, free drink for a costume. You show up in a sheet with holes. They pour, but doubtfully." },
    koshini_new: { text: "The \"new Koshini\" opens. The first thing the bar posts is a meme about its new toilets. Evenings are Jackbox and onigiri sandwiches, \"come and get cured\". You get cured." },
    koshini_rent: { text: "Koshini says it straight: we'd like you to spend some money on Thursdays too, so we can pay the rest of our rent. They launch karaoke and a discount Thursday: beer and shots for 6 lari. You come to save the bar and save it by 40 lari." },
    freek_upstairs: { text: "Vegan café Freek tweets that instead of soundproofing they \"actually rented the flat upstairs\". A minute later they reply to themselves: \"lefties.. where's the money from..\". A week later the café is flooded with \"sewage shenanigans\", and at the end of the month the power goes out." },
    freek_market: { text: "Freek opens a free market: bring things, take things, no money. Tbilisi's freegans are in ecstasy. You leave a Uniqlo sweater and take a chess set without a queen and a David Graeber book." },
    freek_thread: {
      text: "The great week of Freek threads. The \"hierarchy-free\" horizontal team kicks out three of the founders and changes the locks. The former team posts its thread, the \"bartender in the mesh tank top\" posts his, then another one appears. People make quizzes about the threads, and someone writes that they contain \"a polyphony of voices\". The phrase becomes a meme forever.",
      tweet: "there were 3 threads about vegan café freek and i read all of them. i'm opening café control freak, with strict hierarchy",
      choices: [
        ["Read every thread", "You finish at 4 a.m. and still can't say who's right. You draw a diagram on A4. It looks like the Tokyo metro map."],
        ["Take the quiz \"Who are you from the Freek thread?\"", s => `You get \"the bartender in the mesh tank top\". ${s.has("freek") ? "You've actually been there and think you've seen that tank top." : "You decide to buy a mesh tank top."}`],
      ],
    },
    queer_thread: {
      text: s => `"Fresh polyphony of voices from Tbilisi." The whole timeline is reading the thread about a horizontal queer commune: the move, the parties, the domestic conflicts, a public scandal, an expulsion and some lost queer memoirs. It's unreadable without commas, so retellings "with punctuation" circulate separately. A couple of days later a response thread "from Vanadzor" appears.${s.has("poly") ? " Anya drops the link in the triad's group chat captioned \"this isn't about us\". Lyosha reacts with 🤔." : ""}`,
      tweet: "finished the thread about the queer commune in tbilisi. now i'm scared to go to any party in sololaki",
    },
    agents23: {
      text: "Parliament passes the \"foreign agents\" law in its first reading. Protests outside parliament, water cannon and tear gas. A Georgian flag next to an EU flag under a jet of water goes around the world.",
      choices: [
        ["Go to parliament", "You stand with the locals. An elderly Georgian woman gives you Maalox for your eyes and says, \"You're ours.\" Wet, scary, and somehow very much like home."],
        ["Watch the stream from a bar", "You watch Formula's stream and refresh Twitter. The bartender turns off the music. You drink in silence."],
      ],
    },
    agents23b: { text: "The law is withdrawn. Rustaveli celebrates: flags, the anthem, someone dancing kartuli right on the zebra crossing. You don't know yet that this is only season one." },
    azimuth: {
      text: "The first direct flight from Moscow in four years lands in Tbilisi. People protest at the airport. Your mom texts: \"Well, if there's a direct flight now, I'll come for the May holidays.\"",
      tweet: "Sweetie, I bought a ticket. I'll bring buckwheat, you probably don't have it there",
    },
    mom: { text: "Mom arrives with 4 kg of buckwheat, dried mushrooms and an opinion about your flat. In three days she befriends the neighbour, falls out with a taxi driver and asks \"when are you coming home\"." },
    candidate: { text: "Georgia gets EU candidate status. Flags, fireworks and car horns on Rustaveli. A stranger hugs you and pours chacha from a Borjomi bottle. Refusing is not an option." },
    banks24: {
      text: "Banks start closing accounts of Russians without residence permits. You get an SMS in Georgian, run it through Google Translate and get: \"Your account respectfully does not continue.\"",
      choices: [
        ["Rush a residence permit via your business", "For a month you collect papers, translations and apostilles. The notary calls you \"my headache\", but fondly."],
        ["Open an account in Armenia", "You go to Yerevan for a bank account. Now you have four banking apps and no money in any of them."],
      ],
    },
    agents24: {
      text: "The \"transparency of foreign influence\" law is back. Now there are protests on Rustaveli every evening, thousands of students. You learn a new phrase: \"რუსული კანონი\", \"the Russian law\". Awkward.",
      tweet: "georgians protest against the \"russian law\", russians in bars protest against being russian. tbilisi, may",
      choices: [
        ["Go to the protests every evening", "You know all the chants, and the students call you \"our Russian\". Your voice goes, your Georgian grows."],
        ["Keep a low profile and donate", "You send money to lawyers for the detained and feel like you're doing at least something."],
      ],
    },
    agents24b: { text: "Parliament overrides the president's veto and the law passes. The avenue is quiet and angry. That evening, for the first time, you hear Georgians answer \"what next?\" with \"Europe\" rather than \"nothing\"." },
    koshini_closed: {
      text: s => `January 27: Koshini's last "hopeless karaoke". February 1: the bar tweets "the very last closing of koshini bar, this time it's really it". Instagram is left with "closed <3".${s.counters.fights ? " The khinkali you threw at your opponent in 2022 becomes part of history." : ""}`,
      tweet: "koshini closed <3. where do we go now to argue about who left the right way",
    },
    elections24: { text: "Parliamentary elections. You can't vote, but you spend the evening refreshing the timeline as if it matters. Georgian Dream declares victory, the opposition doesn't recognise the result." },
    nov28: {
      text: "The prime minister announces that EU accession talks are postponed until 2028. That same evening Rustaveli takes to the street and doesn't leave. Fireworks, water cannon, pots and pans.",
      tweet: "my georgian neighbour asked if i have a helmet. said it's \"for renovations\". he isn't renovating anything",
      choices: [
        ["Go out to Rustaveli", "You stay until 3 a.m. Someone hands out free tea, someone else free khachapuri. You get both, because you look hungry."],
        ["Bang a pot on your balcony at 9 p.m.", "You bang a ladle. The whole street answers. The pot is dented, but the neighbours say hello to you for the first time."],
      ],
    },
    pres24: { text: "A new president is inaugurated. Salome Zourabichvili leaves the Orbeliani palace saying she's taking legitimacy with her. You don't fully understand how that works, but it sounds beautiful." },
    fines25: {
      text: "Fines of up to 5,000 lari for blocking roads and a ban on masks at protests. Now you protest strictly on the pavement, face uncovered, passport in your pocket just in case.",
      tweet: "georgian protesters have mastered protest parkour: pavement, kerb, pavement, never the road",
    },
    deport25: {
      text: s => `Another couple of dozen foreigners are deported from Georgia, Russians among them. Those detained at rallies are expelled, and some are turned back at the border later.${s.counters.protests ? ` You've been to ${s.counters.protests} protests and, for the first time, you clean up your Rustaveli stories.` : " You don't go to rallies, but you clean up your stories just in case."}`,
      tweet: "new genre in emigrant chats: \"can i do a border run if i went to rustaveli 3 times but stood at the back\"",
    },
    mzia: { text: "Mzia Amaglobeli, founder of Batumelebi and Netgazeti, is sentenced to two years. Rustaveli is especially full that evening. No jokes here." },
    oct4: { text: "Municipal elections. You're sitting in a bar on Orbeliani and can't work out why people outside are trying to storm the presidential palace. The bartender says philosophically that \"the bill still has to be paid\"." },
    year_protest: { text: "Exactly one year of daily protests, 365 evenings in a row. Georgians haven't missed a single one, and you haven't made it to a single yoga class, though you promised yourself every week." },
    may26: { text: "Independence Day. The opposition gathers its biggest rally in months on Rustaveli. You hold a Georgian flag and, for the first time, sing at least the chorus of the anthem correctly." },
    water24: { text: "GWP repairs a main water pipeline, and Vake, Saburtalo, Mtatsminda, Krtsanisi and Chugureti go without water for three days. You wash your hair with Nabeghlavi and put the dishes off until better times." },
    blackout26: {
      text: "The power goes out across all of Georgia: the grid was being tested on the Enguri hydropower units. Pumping stations in Tbilisi and Rustavi stop, and the water goes too. You sit in the dark with a warm Natakhtari, realising your phone has enough battery left for exactly one tweet.",
      tweet: "no power and no water in tbilisi. but there's chacha, and chacha doesn't depend on infrastructure",
    },
    water26: { text: "About 80,000 subscribers in Tbilisi and Mtskheta go without water for 36 hours: GWP is moving a main pipe for the new bridge over the Aragvi. Tankers with drinking water drive around the neighbourhood. You queue with a five-litre bottle and meet half your building." },
    gas26: { text: "Because of the Rustaveli works, about 13,000 subscribers in the centre lose gas for almost a day, including the Foreign Ministry and the Supreme Court. You heat khinkali in the microwave and feel like a traitor to the homeland. Someone else's homeland, but still." },
    leonidze26: { text: "Part of Leonidze Street is closed for rehabilitation works. Bolt takes you on a detour through three districts and one philosophical crisis. Two kilometres take 40 minutes, enough to learn the names of all the driver's grandchildren." },
    rustaveli26: {
      text: "Rustaveli is closed for a full overhaul, with a temporary traffic scheme around the avenue. The utilities are being replaced for the first time in decades. The protest now runs along construction fences. You trip over the new paving, and a passer-by immediately says \"ვაიმე!\" to you.",
      tweet: "rustaveli is closed. walking from freedom square to the philharmonic is faster than a taxi. a taxi, to be fair, is faster than a marshrutka. a marshrutka is faster than never",
      choices: [
        ["Switch to a scooter", "You weave between fences, an excavator and protesters. A grandmother with a shopping trolley from Dezertirebi overtakes you."],
        ["Walk everywhere, like in 2022", "You walk 80 km in a week and become the fittest emigrant in Sololaki. Your trainers don't survive it."],
        ["The metro", "In the metro you remember that the escalator at Rustaveli station goes so long and so deep that you can scroll through a week's worth of timeline."],
      ],
    },
    rustaveli26b: { text: "The stretch of Rustaveli from Chovelidze to the Elbakidze descent reopens to cars. The city celebrates like it got a piece of the homeland back. Fifteen minutes later there's a traffic jam." },
    rustaveli26c: {
      text: "Rustaveli's completion is pushed back another month, to November 30: \"unforeseen circumstances, project adjustments, weather\". You move all your meetings to December and say it's \"also unforeseen circumstances\".",
      tweet: "the rustaveli works got pushed to november 30. so did my deadline at work. coincidence? i think not",
    },
    traffic26: { text: "The mayor on traffic: \"We can't demolish buildings and destroy green spaces.\" In nine years the number of cars in Tbilisi has doubled to about 948,000. You look out at Saburtalo: all 948,000 seem to be parked right under your window." },
    meta: {
      text: "The whole timeline is playing \"1 in 8 Billion\", a random-life simulator. You get an emigrant in Tbilisi. You close the tab and stare at Mtatsminda for a long time.",
      tweet: "got an IT emigrant in tbilisi in 1 in 8 billion. game's too realistic, deleting",
    },

    // ——— freegans ———
    fr_raid: {
      text: "You're invited on a \"freegan raid\" behind a supermarket on Rustaveli. The squad: a vegan from St Petersburg, a former banker and a guy in a 600-euro North Face jacket.",
      choices: [
        ["Go", "The haul: 4 kg of avocados, a crate of yoghurts dated today and a melon that has seen some things. You reconsider your relationship with property."],
        ["I'll just buy some, thanks", "You buy avocados for 9 lari. The freegans look at you with pity, like at someone who still pays for ChatGPT."],
      ],
    },
    fr_fridge: { text: "A \"take one, leave one\" food-sharing fridge appears in Fabrika's courtyard. You leave half a khachapuri and take three jars of fermented cabbage of unknown vintage." },
    fr_dezertir: { text: "Dezertirebi market, 6:30 p.m., freegan golden hour. A vendor shoves a bag of tomatoes at you: \"Take it, genatsvale, it's going in the bin anyway.\" You think she's adopted you. You don't mind." },
    fr_macbook: { text: "You meet a freegan with a MacBook Pro M3 and a flat in Sololaki. He explains it's not about money, it's about \"exiting the system\". He exited the system through a hole in the fence behind Spar." },
    fr_date: { text: "A freegan date. You share a rescued Napoleon cake on a bench in Dedaena park. It's the most romantic thing that's happened to you in Georgia." },
    fr_cat: { text: "Your freegan neighbour drags an armchair home from a dumpster. There's a cat living in the armchair. Now you have a cat. The cat objects, but stays." },
    fr_chat: {
      text: "The \"Rescued food Tbilisi\" chat has a 400-message argument about whether you can eat khinkali from a dumpster. The moderator bans both sides and joins a monastery.",
      tweet: "khinkali from a dumpster isn't food, it's archaeology. but i ate it",
    },
    fr_guard: {
      text: "A supermarket guard chases you away from the bins. You try to explain yourself in Georgian.",
      choices: [
        ["\"მე არ ვარ უსახლკარო, მე ცნობიერი ვარ!\"", s => s.geo >= 25 ? "\"I'm not homeless, I'm mindful!\" The guard cracks up and brings you a still-warm loaf of shoti. Georgian pays off." : "You mix up the words and say \"I'm not a house, I'm a consciousness\". The guard crosses himself and leaves. The bin is yours."],
        ["Run off with a melon", "You run down Aghmashenebeli with a melon under your arm and end up in a blogger's stories as \"Tbilisi vibes\"."],
      ],
    },
    fr_tv: {
      text: "Russian TV airs a segment about \"emigrants digging through Tbilisi's dumpsters\". In the background: you, holding an avocado. Your mom calls.",
      tweet: "They showed you on Channel One. You look good, just thin. Come home",
    },
    fr_thread: {
      text: s => `You write a thread: "how I've eaten from Vake's dumpsters for ${Math.round(s.counters.dumpster / 2)} months and saved $900". 14,000 likes. A food blogger, a neo-Marxist and an investor who wants to "Uberize freeganism" slide into your DMs.`,
      choices: [
        ["Launch the startup \"FreeGo\"", "You raise a $15k pre-seed from an investor in Dubai. Two months later the product is eaten by a raccoon. Well, by the yard dog."],
        ["Stay underground", "You delete the thread. A true freegan doesn't need likes. Though 14k felt nice."],
      ],
    },
    fr_supra: { text: "The freegans throw a \"rescued supra\" with a tamada. The eighth toast is to \"food that got a second chance\". You're suspiciously moved." },

    // ——— polyamory ———
    poly_start: {
      text: "At a party at Stamba you meet a couple, Lyosha and Anya from St Petersburg. They're very open. Too open. In the morning it turns out you're now a \"triad\". You share a Google Calendar.",
      tweet: "emigrants in tbilisi are either polyamorous, building a polyamory startup, or both",
      choices: [
        ["Well… stay", "You accept the calendar invite. First event: \"Feelings circle, Sun 11:00, bring hummus\"."],
        ["Leave the Georgian way, without saying goodbye", "You slip out while they make smoothies. The calendar keeps sending invites for another six months."],
      ],
    },
    poly_circle: { text: "Sunday \"feelings circle\". Topic: who didn't wash the lobio pot. Anya thinks it's \"not about the pot\". Lyosha thinks it's about the pot. The pot stays silent." },
    poly_meta: { text: "Anya gets a \"metamour\" from Batumi. Now there are four of you and a Notion board called \"Logistics of love\" with columns \"Want\", \"Discussing\" and \"Jealous\"." },
    poly_flat: { text: "The three of you rent a two-room flat in Sololaki. The landlady is sure you're \"brother, sister and a cousin\". You don't correct her." },
    poly_babo: { text: "Manana, the grandmother next door, understands everything. She's silent for a long time, then brings churchkhela. Three pieces, \"for everyone\". That's what tolerance looks like in Sololaki." },
    poly_end: {
      text: "The triad breaks up. The breakup is run as a retro on a Miro board: \"what went well\", \"what could be improved\", \"who gets the multicooker\".",
      choices: [
        ["Take the multicooker", "The multicooker is yours. Love is gone, the plov remains."],
        ["Take the cat", s => s.has("cat") ? "The cat was already yours. You take it again, just in case." : "You never had a cat. You leave with a cat anyway. Whose cat it is remains unclear."],
      ],
    },

    // ——— dating: gender imbalance ———
    dating_m: {
      text: "You install Tinder in Vake. Within 5 km: 40 profiles of male IT guys the app shows you by mistake, two Georgian women looking for \"a serious relationship with a Georgian\", and one woman from St Petersburg who is already dating your team lead. The stats are honest: 60% of Russians who entered Georgia in March 2022 were men (IDFI, based on Geostat data).",
      choices: [
        ["Expand the radius to Batumi", "Now you have 4 matches. All four turn out to be the same team lead on different accounts."],
        ["Delete the app and join the running club", "The running club has 38 men. You reinstall Tinder."],
      ],
    },
    dating_f: {
      text: "You install Tinder in Vake and an hour later have 312 matches. Every first message says they're \"backend, but with a soul\". A spring 2024 survey by Bereg and Paper Kartuli counted 57% men and 42% women among Russian emigrants in Georgia, and you can feel every one of those percent.",
      choices: [
        ["Screen them with a Google Form", "You make a 14-question form, including \"name three Georgian letters\". Two people finish it. Both write \"ღ\"."],
        ["Turn off your phone and go to a supra", "At the supra the tamada introduces you to three single nephews. The queue just switched languages."],
      ],
    },
    kinky: {
      text: s => s.char.gender === "m"
        ? "You're invited to a kinky party in a Sololaki basement. Dress code: latex or leather. There are 23 men and zero women. Half an hour later you're sitting in a circle in harnesses, discussing whether to rewrite the service from Go to Rust and where to find a decent accountant for your sole proprietorship."
        : "You're invited to a kinky party in a Sololaki basement. Dress code: latex or leather. There are 23 men and, apart from you, not a single woman. Half an hour later all 23 are sitting in a circle in harnesses, debating a Go-to-Rust rewrite and asking what you think about microservices.",
      tweet: "went to a kinky party in tbilisi. 23 guys in latex discussing job grades and relocation packages. the most hardcore practice of the night was code review",
    },

    // ——— Koshini ———
    koshini1: {
      text: "Koshini bar in Sololaki, named after journalist Oleg Kashin. 1 a.m., the terrace with a view of the city. An argument over who \"left the right way\": the February crowd or the September crowd. A September guy calls you \"a tourist with a safety cushion\". A khinkali flies at you.",
      tweet: "february and september emigrants fought at koshini again. the march ones stayed neutral and finished the khachapuri",
      choices: [
        ["Answer with a khinkali", "The khinkali hits your opponent's forehead and sprays broth. The bar applauds. You pay for a broken shot glass and someone else's shirt."],
        ["Leave the Georgian way", "You leave without saying goodbye or paying for your chacha. A week later the bartender finds you on Instagram and politely sends the bill."],
      ],
    },
    koshini2: { text: "They let you back into Koshini. The bartender remembers you. A new sign hangs over the bar: \"No arguing about February vs September people. No throwing khinkali.\"" },
    koshini3: { text: "Another fight at Koshini, this time over how to eat khinkali. You: by the tail, with your hands. Your opponent picks up a fork. By unwritten Georgian law the fork guy eliminates himself: the waiters carry him out." },
    koshini4: { text: "Your photo appears at Koshini, captioned \"Guest of honour. Do not serve after the third\". You're prouder of it than of your degree." },
    koshini_poly: { text: "At Koshini, Anya's ex finds out she's in a triad and calls \"all three of you\" out for a talk. The talk ends in arm wrestling. Lyosha wins, even though he's vegan." },

    // ——— Freek / Shpana and bars ———
    freek1: { text: "Vegan café Freek: \"a kitchen and bar free from violence, hierarchy and any discrimination\". The word \"(vegan)\" appears nine times on the menu; the café bought a beer for whoever counted correctly. Tomato gose on tap, and you're invited to \"eat, drink and talk about democracy\". Someone tells you that in 2016 people stormed another Tbilisi vegan café, Kiwi, with sausages and shashlik. You finish your cheeseless khachapuri in respectful silence." },
    freek_pizza: {
      text: s => `Vegan café Freek, now called Shpana, delivers the wrong pizza via Bolt. The café blames "consumerist bullshit" and "capitalist puke", and tells the customer: "You're clearly not our audience." The screenshots go all over the timeline.${s.has("freek") ? " You've eaten there and know this is completely on brand." : ""}`,
      tweet: "ordered the wrong pizza from a vegan café. well, they sent the wrong one. well, i'm the wrong audience. capitalist puke, basically",
    },
    ploho1: {
      text: "Bar Plokho (Russian for \"Bad\") at 8 Amaghleba Street. Their bio: \"tbilisi is great, the bar's just called that\", plus \"infused vodkas, some cocktails and very bad music\". The music really is very bad. You stay until closing. You text your mom \"I'm at Bad\", and she calls at 1 a.m. in tears.",
      tweet: "My child keeps texting that they're at Bad. Says it's a bar. I don't know what to believe anymore",
    },
    friends_wedding: {
      text: "Friends from Moscow get married at the Public Service Hall: in Georgia you don't have to wait a month, you can sign almost right away. They sign, walk out, and an hour later you're celebrating at Plokho. The music, as the bar's bio promises, is very bad. You're the witness because you're the only one who showed up in a shirt.",
      choices: [
        ["Give a toast the Georgian way", "You toast for seven minutes: to the couple, to Georgia, to the bride's mom watching on video from Moscow. The bar applauds, the bride cries, the groom buys everyone chacha."],
        ["Catch the bouquet", "You catch the bouquet, knocking over the bartender. A week later the groom's second cousin texts you."],
      ],
    },
    wedding_season: { text: "Emigrant wedding season: another couple of friends signs at the Public Service Hall, this time a guy from St Petersburg and a woman from Minsk. The party is on a Sololaki rooftop, and the Georgian tamada mixes up their names in all fourteen toasts. Nobody corrects him." },
    ploho_bday: { text: "On June 22 Plokho celebrates its summer birthday with a beach party without a beach. Three days later the bar posts the results, and item one is the number of lost phones." },
    ploho_2025: { text: "Plokho now opens on Mondays too, \"and the weather will adjust\". In summer there's a backgammon tournament and a milk-tea cocktail served with an echpochmak. The bar says even its relations with the neighbours are more diplomatic than international ones." },
    seniors: { text: "You end up at Seniors bar. Next morning you tweet: \"Got wasted at seniors bar. Feeling great.\" You're not the first person to tweet that." },
    seniors_talk: { text: "Thursday, 8 p.m., Seniors bar: a visiting guest gives a talk \"about current affairs\". Half the room has known each other since 2022. The other half knows each other from Proshmandovtsy." },

    // ——— Proshmandovtsy (anonymised) ———
    prosh_politician: {
      text: s => [
        "Another emigrant politician ends up in Proshmandovtsy. The timeline talks about nothing else for a week, every chat is on fire. In every thread someone writes \"I always knew\", and someone quietly deletes a photo with him from last year's conference.",
        "Another opposition figure in Proshmandovtsy. The emigrant chats run the usual cycle: first \"it can't be\", then \"well, actually everyone knew\", then a long apology post that satisfies no one.",
        "New week, new politician in Proshmandovtsy. You catch yourself opening that channel before the news every morning. A friend starts a \"who's next\" spreadsheet, and it's scarily accurate.",
      ][(s.times.prosh_politician || 0) % 3],
      tweet: "tbilisi now has two kinds of news: what parliament passed and who ended up in proshmandovtsy. the second kind gets more reads",
    },

    // ——— Yerevan ———
    ashot_back: {
      text: "Uncle Ashot from the marshrutka finds you on Telegram and sends an 11-minute voice message. It proves that Armenian merchants built Sololaki, that Pirosmani was \"half ours\", and that the sulphur baths were \"an Armenian idea, the Georgians just undressed first\".",
      choices: [
        ["Forward it to your Georgian neighbour", "Your neighbour replies with a 14-minute voice message. You become the mediator in a dispute between two nations. Nobody pays you for it."],
        ["Reply \"akhper, you're right\"", "Ashot sends a photo of brandy and promises to \"welcome you like a brother\" on your next border run."],
      ],
    },
    marshrutka_ab: {
      text: "The Yerevan–Tbilisi marshrutka. In the back seat an Armenian and a Georgian spend three hours arguing over who invented the alphabet, dolma, the toast and the very idea of hospitality. By Sadakhlo they're hugging and complaining about taxi drivers together.",
      tweet: "in the yerevan–tbilisi marshrutka an armenian proved armenians built tbilisi. a georgian proved yerevan was built on a georgian toast. they both chipped in for the driver's chacha",
    },
    ashot_visit: { text: "On your border run to Armenia, Uncle Ashot really does meet you at the border. He drives you home, feeds you tolma and shows you a book where Tbilisi is labelled in Armenian on every map. He only lets you go with a three-litre jar of apricot jam." },

    // ——— Georgian life ———
    letter: {
      text: s => {
        s.lettersEn ||= ["ღ — looks like a snail that has seen it all", "ჟ — like a \"zh\", only drunk", "ფ — looks like an owl but reads as \"p\"", "ქ — either a \"k\" or just a sigh", "წ — the sound you make when you see the rent", "ყ — a throaty \"k\"; you cough for three minutes", "ძ — a gentle \"dz\"; you start calling the cat that"];
        const l = s.lettersEn.splice(Math.floor(Math.random() * s.lettersEn.length), 1)[0] || "ჰ — the last one, just an exhale";
        return `You learn the letter ${l}. The alphabet has 33. ${Math.max(0, 33 - Math.round(s.geo / 2))} to go.`;
      },
    },
    supra: { text: "The neighbours invite you to a supra. The tamada makes 14 toasts: to God, to parents, to the dead, to Georgia, to you, to your future children, and separately to your mother, whom he has never met." },
    dog: { text: "A huge dog with a tag in its ear walks you home. Every day. Now it's your dog, though the dog doesn't see it that way. You call it Khachapuri." },
    taxi: { text: "Your Bolt driver drives on the wrong side of the road, holding the wheel with one hand, crossing himself at every church with the other, and showing you photos of his grandchildren with a third (where from?)." },
    gio: {
      text: "You start dating Giorgi from Kutaisi. Two weeks later his mom wants to meet you and asks whether you're baptised and how many khinkali you can eat in one sitting.",
      choices: [
        ["\"Twenty,\" without blinking", "Giorgi's mom nods approvingly. You eat twenty and three more out of respect. You're accepted into the family."],
        ["\"Actually, I'm vegan…\"", "Silence. Somewhere in Kutaisi a dog howls. Giorgi stops replying."],
      ],
    },
    gio_wedding: { text: "Giorgi proposes on a roof on Mtatsminda. The wedding has 400 guests, six of whom you know. The tamada talks for three hours. You're officially part of a Georgian family." },
    coffee: {
      text: "The 31st specialty coffee shop opens on Aghmashenebeli, flat white for 9 lari. There are now more coffee shops in the neighbourhood than PSP pharmacies, which nobody thought possible.",
      tweet: "emigrants brought two things to tbilisi: specialty coffee and anxiety. the coffee's already run out",
    },
    own_coffee: {
      text: "Friends invite you to invest in coffee shop number 32. Name: \"Barista Sololaki\". On the menu: a raf latte with churchkhela.",
      choices: [
        ["Invest $5,000", "The coffee shop lasts seven months. You lose the money but learn to make latte art shaped like a Georgian cross."],
        ["Nah, I'll pass", "Six months later the coffee shop closes and a barbershop called \"The Bearded Emigrant\" opens in its place."],
      ],
    },
    layoff: { text: "You're laid off. The HR email begins with \"We're a family.\" The family has decided it needs fewer relatives." },
    rehire: { text: "An Estonian startup with an office in Tbilisi hires you. The office is a desk at a coworking space and a CEO who is always in Bali." },
    standup: { text: "Open mic in a basement on Marjanishvili. The joke about Vake rent kills, the joke about the Georgian alphabet kills you. Twelve people in the room, eleven of them also comics." },
    dj: { text: "You play a set in a basement on Plekhanov Avenue. The dance floor: 30 people in identical black T-shirts. You're a long way from Bassiani, but the bouncer already nods at you like one of his own." },
    bassiani: {
      text: "You try to get into Bassiani. Face control looks into your soul, then at your trainers, then back into your soul.",
      choices: [
        ["Say \"გამარჯობა\" with a proper \"ღ\"", s => s.geo >= 20 ? "You're in. At 7 a.m. you walk out into the rain a different person, though you couldn't say which one." : "You say \"gamarjoba\" with a strong Moscow-suburb accent. You're gently turned away."],
        ["Go to KHIDI instead", "KHIDI lets you in. You dance in a former bomb shelter by the river and think there are too many metaphors here."],
      ],
    },
    baths: { text: "Sulphur baths in Abanotubani. The kisi scrubber works on you so hard that all your anxieties come off with your skin, along with a few moles, apparently." },
    snow: { text: "Three centimetres of snow fall on Tbilisi. The city is paralysed, schools are closed, and a taxi driver on summer tyres asks you to pray with him." },
    rtveli: { text: "Rtveli, the grape harvest in Kakheti. You crush grapes barefoot, drink young wine from a jug and end up falling asleep in a qvevri. Not in it, next to it. But almost." },
    tbilisoba: { text: "Tbilisoba. Mtsvadi, churchkhela and wine from barrels everywhere. An old man you've never met teaches you to dance kartuli. You step on his foot, and he declares you \"one of ours\"." },
    balcony: { text: "The Tbilisi balcony where you drink your coffee is held up by prayer, a washing line and, apparently, the neighbour's grapevine. You keep drinking your coffee. This is Tbilisi." },
    scam_flat: {
      text: "In the \"Rent without agents\" chat you find a flat in Vake for $500 with a view of Mtatsminda. The deposit has to go to a card in Kazakhstan.",
      choices: [
        ["Send the deposit", "The flat doesn't exist. Mtatsminda does. Minus $300 and a little faith in people."],
        ["Ask for a video call", "The owner is \"in the mountains right now, no signal\". He's still in the mountains."],
      ],
    },
    lisi: { text: "You join a running club at Lisi Lake. 40 members: 38 IT people and 2 Georgians who happened to be running past." },
    lisi2: { text: "The Lisi running club runs a half marathon. At kilometre 15 half the IT people turn off into a khinkali place. You're one of them. Only the two Georgians finish." },
    chat_ban: { text: "You get banned from the main Russian-language Tbilisi chat for asking \"where can I rent a two-room flat in Vake for $400\". The moderator replies: \"Rent jokes are forbidden by chat rule #1.\"" },
    tvorog: { text: "You discover Georgian dairy: matsoni, nadughi, imeruli and sulguni that stretches all the way to Kutaisi. Now you eat khachapuri for breakfast and look back on your oatmeal life as someone else's." },
    batumi: { text: "You take the train to Batumi. Pebble beach, a chacha fountain, and skyscrapers that look like a six-year-old named them. You bring back a pebble and a sunburn." },
    traffic_pool: { text: "A new detour scheme. Your navigator sends you down a closed street five times in a row, then gives up: \"route not found\". The marshrutka driver shrugs and drives on the pavement like everyone else." },
    traffic_pool2: { text: "You need to get from Vake to Sololaki. You leave at 9 a.m., arrive at lunchtime, and the meeting is over. But in the traffic jam you learned every Georgian swear word by lip-reading." },
    bakuriani: {
      text: "In winter everyone goes skiing in Bakuriani: train to Borjomi, then a marshrutka up into the mountains. The Kokhta and Didveli slopes, khachapuri at the lift, and a stove in the guesthouse that the owner stokes as if you were his last hope.",
      choices: [
        ["Try skiing for the first time", "You fall 23 times. Your instructor Gocha says that's a good result. In the evening you lie by the stove feeling muscles you never knew you had."],
        ["Snowboard, I'm from the big city", "On Didveli you show them how it's done, then crash into a snowdrift where your former team lead is already sitting. You nod at each other in silence."],
        ["Don't ski, just eat", "For three days you only commute between the dining room and the stove. Zero kilos lost, half a kilo of khachapuri gained. That's a ski holiday too."],
      ],
    },
    bakuriani23: { text: "Bakuriani hosts the Freestyle Ski and Snowboard World Championships. World stars on the course, you and all of Tbilisi's IT people in the lift queue. You take a selfie with the final in the background and post it as \"basically competing\"." },
    gudauri: { text: "Gudauri. On the slope you run into half your old office. You nod at each other silently, like veterans of the same stock-options war." },
    georgian_reply: { text: "You order khachapuri in Georgian, and for the FIRST time they answer in Georgian instead of switching to Russian. You walk out of the bakery a winner." },
    lobio: { text: "Lunch, as is tradition: lobio in a clay pot, mchadi, pkhali and a glass of saperavi. The bill is 34 lari. Suddenly you realise this alone was worth leaving for. Well, this and a few other things." },
    crypto: {
      text: "A guy from Fabrika invites you to buy into the memecoin $KHINKALI. \"Already 40x, bro.\"",
      choices: [
        ["Put in $1,000", s => { if (Math.random() < 0.3) { s.money += 5000; return "You sell at the top. +$4,000! You'll tell this story at every party for the rest of your life."; } return "The memecoin goes to zero in three hours. The guy moves to Thailand."; }],
        ["No", "A week later $KHINKALI does 300x. You promise yourself never to check the price. You check it every day."],
      ],
    },
    relo_leave: {
      text: "Another farewell party: friends are moving to Portugal, Serbia, Argentina. Half of your 2022 crowd is left in Tbilisi.",
      tweet: "tbilisi, 2024: a farewell party every friday. soon there'll be nobody left to see off and i'll be seeing off myself",
    },
    lisbon: {
      text: "You're offered a digital nomad visa in Portugal. Friends in Lisbon write: \"there are 30 coffee shops per street here too, but there's the ocean\".",
      choices: [
        ["Stay in Tbilisi", "You don't go. The ocean won't feed you khinkali at 3 a.m."],
        ["Move to Lisbon", "You pack a suitcase, the cat and a jar of adjika."],
      ],
    },
    offer_abroad: {
      text: "A recruiter messages you on LinkedIn: \"Two openings, both with relocation.\" One is in Berlin, with a Blue Card, German health insurance and an Ausländerbehörde appointment \"in a few months\". The other is in Limassol: the sea, lower taxes, and a separate line in the pitch noting that the City of Dreams casino resort is near the office.",
      choices: [
        ["Germany: Berlin, Blue Card", "You sign the offer and pack a winter jacket. Your last khinkali is at the train station."],
        ["Cyprus: Limassol, the sea and a casino", "You sign the offer and buy sunglasses. For some reason the phrase \"just to have a look\" keeps spinning in your head."],
        ["No, I'm staying in Tbilisi", "You turn them both down. The recruiter likes your LinkedIn post out of pity."],
      ],
    },
    flat_buy: {
      text: "A developer in Didi Digomi offers you a flat in \"white frame\" condition, to be finished \"next year\". The flat comes with a residence permit.",
      choices: [
        ["Buy it for $22,000", "You now own a concrete box with a view of another concrete box. But you have a residence permit."],
        ["Nah, renting is calmer", "You keep renting. Batono Nino raises the rent again."],
      ],
    },
    gig: { text: "A side gig turns up: translating a khinkali place's menu into English. Now \"khinkali with meat of the soul\" is on the menu in six restaurants." },
    nye: { text: "New Year's from the balcony: you no longer hide from the fireworks, you launch your own. Horizontally. Like a local." },
    earthquake: { text: "A small tremor at night. You leap up in horror. Your Georgian neighbours don't even wake up, and the cat looks at you with contempt." },
    protest_regular: { text: "Another evening on Rustaveli. You know all the corn sellers by now, and one elderly protester who brings his own stool." },
    entry_scare: { text: "The chats are full of entry refusals for Russians at the border again, no reasons given. You reread your passport as if something new might appear in it." },
  },

  // Same order as FILLER in data.js
  FILLER: [
    "An ordinary week. You eat 9 khinkali and leave the tails, as you should.",
    "The week goes by at the coworking space. You attend 14 calls and one khinkali place.",
    "You walk up Mtatsminda and ride the funicular down. Life is getting better.",
    "A quiet week. You drink tarragon Lagidze water and look at the Mtkvari.",
    "The neighbour's rooster wakes you at 5:12. You live in the centre of a capital city. No further questions.",
    "In the marshrutka you pass your fare to the driver through five people. Your change comes back through six.",
    "You spend the evening scrolling the timeline. It's all the same.",
    "You learn that \"ki\" means \"yes\" in Georgian and \"ara\" means \"no\". Your brain protests.",
    "Chacha with the neighbour. He says you're a good person, even though you're Russian. You decide it's a compliment.",
    "At Dezertirebi you buy adjika from a grandmother who calls you \"sheni chirime\". You google it. It's sweet.",
    "A tagged street dog growls at you. Then lies down and shows its belly. A typical Tbilisi local.",
    "All day you write in emigrant chats that you'll \"never leave this place\". In the evening you open job listings in Berlin.",
    "You spend 40 minutes looking for a house number. Tbilisi house numbering lives a life of its own.",
    "The week passes under the sign of lobiani.",
    "You finally get that \"Rustaveli\" is a street, a metro station, a poet and half the city.",
    "You try adjaruli and dip bread in the yolk. The yolk splashes your laptop. Your laptop is Georgian now.",
    "You buy a Magti SIM in an underpass and the seller tells you his whole life story. You never pick a plan.",
    "All day you tell friends back home that no, it's not dangerous here, and yes, the khinkali really are that big.",
    "At the Dry Bridge market you buy a Soviet camera that doesn't work and a painting of Mtatsminda that does.",
    "You go to Mtskheta, watch the Aragvi meet the Mtkvari and, for the first time in a month, think about nothing.",
    "You stand in line at the Public Service Hall for 12 minutes and are already outraged it's taking so long. Comfort has spoiled you.",
    "You learn \"გაუმარჯოს!\" and say it at every toast. Sometimes even at the right moment.",
    "The upstairs neighbour has been renovating for three years. The hammer drill now wakes you instead of the rooster. The rooster is offended.",
    "On one walk through Vake you count seven people from your old Moscow life. This isn't emigration, it's a branch office.",
    "You try churchkhela for the first time and honestly admit it beats a Snickers.",
    "You get lost in Sololaki and stumble into a courtyard with grapevines and old men playing backgammon. You stay till evening.",
    "The lift is broken. In Tbilisi that means it'll come back when it feels like it.",
    "You run a Georgian song through Google Translate and get \"my love is like a mountain, and you are like cheese\". Beautiful.",
    "You download Duolingo for Georgian. The owl sends a notification: \"შენ შეგიძლია!\" You can't. Not yet.",
    "A neighbour gives you a lift for the first time and refuses money. You try to hand it over three times. On the third he's offended.",
    "You buy wine at the market in a plastic Nabeghlavi bottle. It's better than a 3,000-rouble bottle in Moscow.",
    "You spend the evening at a bar arguing Borjomi vs Nabeghlavi. Lagidze wins, though it wasn't even in the argument.",
    "You live on pkhali for a week and feel like the healthiest person in the Caucasus.",
    "Downpour. Plekhanov Avenue turns into a river and a marshrutka sails past you like a speedboat.",
    "An evening on the balcony with a Natakhtari from the corner shop. A couple of lari a bottle, the view of Mtatsminda is free.",
    "You finally settle the big question: Natakhtari or Zedazeni. A week later you change your mind.",
  ],

  // Same order as AMBIENT in data.js
  AMBIENT: [
    "love tbilisi, hate the hills. heart rate 120 on my way to buy bread",
    "overheard in vake: \"i'm not an emigrant, i'm a digital nomad with an anxiety disorder\"",
    "24 khinkali today. neighbourhood record, but the neighbourhood doesn't know",
    "gldani is like vake but without the IT people. paradise",
    "rescued 3 kg of strawberries from the bin behind carrefour. consumer society, you lost",
    "freeganism in tbilisi is when the vendor at dezertirebi gives you everything herself and gets offended if you don't take it",
    "new rule at koshini: first the toast, then the fight. culture",
    "in a triad the key thing is communication. and a shared calendar. and a separate shelf in the fridge",
    "our triad is a quintet now. looking for a 4-bedroom in sololaki, no agents",
    "Are you eating? Send me a photo of what you eat. Khachapuri again? It's just dough and cheese",
    "the september crowd opened a barbershop, the february crowd opened a coffee shop, the march crowd opened their mouths at a supra and never closed them",
    "at lars they're selling queue spots, bikes, scooters and the meaning of life. meaning of life is in short supply",
    "found out what a water cannon is for the first time in my life. georgians said \"you'll get used to it\". i don't want to get used to it",
    "the rustaveli protest goes on. students brought a speaker. it's playing \"Gaumarjos\". powerful",
    "9 p.m. all of saburtalo is banging pots. me too. i don't know the words but i know the rhythm",
    "third year in tbilisi. learned to tell 4 kinds of khachapuri apart, never learned to say no to a tamada",
    "the tbilisi freegan scene isn't what it used to be. the 2022 crowd grabs all the rescued avocados on reflex",
    "the koshini old-timers sit like veterans recalling the great battle of february vs september 2022",
    "2026. nobody says \"emigrant\" anymore. they say \"oh, you're one of the '22 people\". sounds like a generation",
    "four of us broke up in a miro retro. plov on schedule, cat on weekends",
  ],

  BINGE: {
    start: "Your mental state hits zero. You stop answering work calls, and chacha and Natakhtari become breakfast, lunch and dinner. The binge begins.",
    offers: [
      { text: "Friends stage an intervention in a Sololaki kitchen: khachapuri, Borjomi and the number of an addiction doctor recommended in the emigrant chat.",
        yes: ["Call the doctor", "An IV drip, a week on Borjomi and a long talk. You start answering calls again."],
        no: ["\"One more, and tomorrow for sure\"", "Tomorrow never comes. Your friends leave the number on the fridge."] },
      { text: "An online therapist from the same chat offers an emergency session at an emigrant discount.",
        yes: ["Book it and show up", "For the first half hour you say nothing, then you talk for three hours. It gets easier."],
        no: ["Cancel five minutes before", "You write \"something came up\". Something keeps coming up."] },
      { text: "The Lisi Lake running club texts: \"Easy 5 km tomorrow at 7:00, we're waiting for you.\"",
        yes: ["Get up at 6:30 and go", "You run a kilometre and a half and sit down on the grass. Someone brings you water, nobody laughs. You come back the next week too."],
        no: ["Turn off the alarm", "Alarm off. The next one to ring is the Wolt courier with chacha."] },
      { text: "Mom video-calls at 3 a.m. Tbilisi time. She sees everything in your face.",
        yes: ["Tell her everything", "You talk until morning. Mom doesn't say \"I told you so\". In the morning you book a doctor yourself."],
        no: ["Say \"I'm just tired\"", "Mom pretends to believe you. You pretend everything's fine."] },
    ],
    filler: [
      "Groundhog Day: chacha, a series, khachapuri delivery, chacha again.",
      "Day four without leaving the flat. The Wolt courier knows you by name.",
      "Manana from next door silently leaves a pot of soup at your door.",
      "You wake up at 4 p.m. on the balcony. The lights are coming on on Mtatsminda.",
      "Work sends an email titled \"Is everything okay?\". You don't open it.",
      "You go through old photos from back home and drink to each one.",
    ],
    lost: "You say no for the third time. Nobody calls or texts anymore. The binge runs its course and the money on your card melts away.",
  },

  ENDINGS: {
    home: { title: "Going back", text: s => s.has("binge_lost")
      ? `The binge eats your last lari. Your parents buy you a ticket to ${s.char.city.to} and you fly to them. Dad meets you at the airport in silence; in the kitchen Mom says "I told you so" and puts a bowl of soup in front of you. You join the famous "40% who went back".`
      : `The money runs out. You go back to ${s.char.city.to}. Mom says "I told you so" in the kitchen. At the airport you leave a churchkhela on a bench, like an offering. You join the famous "40% who went back".` },
    refused: { title: "Entry refused", text: s => s.has("refused_protest") ? `Coming back from a border run, you're refused entry. The form says "other reasons", but everyone knows: ${s.counters.protests} evenings on Rustaveli didn't go unnoticed. You stay in Yerevan and bang a pot on your balcony at 9 p.m. every evening. Your Armenian neighbours first tap their temples, then start banging along with you.` : "Coming back from a border run, you're refused entry at the Georgian border, no explanation. You stay in Yerevan and open its 41st coffee shop. You can see Tbilisi on a clear day. No, you can't. But you look anyway." },
    lisbon: { title: "Lisbon", text: () => "You're in Lisbon. Hills here too, little trams too, coffee shops too. But khinkali cost 18 euros and are made by Brazilians. Every evening you tweet \"miss tbilisi\"." },
    germany: { title: "Germany", text: s => `You're in Berlin. Your Blue Card is approved, and the next Ausländerbehörde appointment is in four months. Deutsche Bahn trains are late so confidently that you miss the marshrutkas. Everything is closed on Sunday, so you stay home learning two languages at once: German and the Georgian you ${s.geo >= 30 ? "almost learned" : "never learned"}. There are khinkali in Berlin, but it's just not the same.` },
    cyprus: { title: "Cyprus", text: s => `You're in Limassol. The sea, an office overlooking the port, and colleagues you already know from Tbilisi. On your very first Friday you walk into the City of Dreams casino resort "just to have a look". By Monday morning ${s.money > 3000 ? "your Tbilisi savings are down to $" + Math.round(s.money * 0.2).toLocaleString("en-US") : "you owe the casino more than the move cost"}. You tweet: "at least there's the sea". Game over, bets are placed.` },
    final: { title: "You're still here", text: null },
  },
};
