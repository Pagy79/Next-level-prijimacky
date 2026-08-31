/**
 * Refactor Literární teorie → CERMAT 100–105 % + author diversity.
 * Output: data/questions_refactored_literatura.json
 *
 * Rules:
 * - BAN: Erben, Mácha, Čapek, Neruda, Wolker
 * - Max 2 uses per author in the output file
 * - Genre mix: 40 % poetry, 40 % prose, 20 % drama/publicistika
 */
import { readFileSync, writeFileSync } from "fs";

const INPUT = "data/questions.json";
const OUTPUT = "data/questions_refactored_literatura.json";

const BANNED = ["Erben", "Mácha", "Čapek", "Neruda", "Wolker"];

/** Wide ZŠ 6–9 pool (no banned names). */
const AUTHORS = [
  // Czech 19–20c
  "Borovský",
  "Arbes",
  "Vrchlický",
  "Sládek",
  "Bezruč",
  "Poláček",
  "Bass",
  "Hrabal",
  "Seifert",
  "Orten",
  "Skácel",
  "Mikulášek",
  "Ota Pavel",
  "Foglar",
  "Škvorecký",
  "Lustig",
  "Němcová",
  "Jirásek",
  "Olbracht",
  "Vančura",
  "Halas",
  "Nezval",
  "Hašek",
  "Šrámek",
  "Dyk",
  "Holan",
  "Hrubín",
  "Fuks",
  "Rais",
  "Tyl",
  "Čelakovský",
  "Zeyer",
  "Deml",
  "Hrubín", // duplicate entry filtered later
  "Voskovec",
  "Werich",
  "Klíma",
  "Fuks",
  // World
  "Poe",
  "Verne",
  "Saint-Exupéry",
  "Rowling",
  "Tolkien",
  "Orwell",
  "London",
  "Twain",
  "Hemingway",
  "Bradbury",
  "Golding",
  "Dickens",
  "Stevenson",
  "Andersen",
  "Grimm",
  "Shakespeare",
  "Molière",
  "Ibsen",
  "Cervantes",
  "Hugo",
  "Kipling",
  "Carroll",
  "Defoe",
  "Pushkin",
  "Christie",
  "Asimov",
  "Doyle",
  "Kafka",
  // Folk / myths / fables
  "Petiška",
  "Ezop",
  "La Fontaine",
  "Homér",
];

const AUTHOR_POOL = [...new Set(AUTHORS)].filter((a) => !BANNED.some((b) => a.includes(b)));

function hashSeed(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  return seed;
}

function shuffleStable(arr, seedStr) {
  const a = [...arr];
  let seed = hashSeed(seedStr);
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(correct, distractors, seed) {
  const opts = [correct, ...distractors].slice(0, 4);
  const uniq = [];
  for (const o of opts) if (o && !uniq.includes(o)) uniq.push(o);
  while (uniq.length < 4) uniq.push(distractors[uniq.length] || `varianta ${uniq.length}`);
  const four = uniq.slice(0, 4);
  const shuffled = shuffleStable(four, seed);
  return {
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
  };
}

/** Assign each question an author with max 2 uses; prefer genre affinity. */
function assignAuthors(genres) {
  const usage = Object.fromEntries(AUTHOR_POOL.map((a) => [a, 0]));
  const poetryLean = [
    "Vrchlický",
    "Sládek",
    "Bezruč",
    "Seifert",
    "Orten",
    "Skácel",
    "Mikulášek",
    "Halas",
    "Nezval",
    "Holan",
    "Hrubín",
    "Dyk",
    "Čelakovský",
    "Zeyer",
    "Poe",
    "Pushkin",
    "Baudelaire",
  ].filter((a) => AUTHOR_POOL.includes(a));
  // add Baudelaire if missing
  if (!AUTHOR_POOL.includes("Baudelaire")) AUTHOR_POOL.push("Baudelaire");

  const proseLean = [
    "Borovský",
    "Arbes",
    "Poláček",
    "Bass",
    "Hrabal",
    "Foglar",
    "Škvorecký",
    "Lustig",
    "Němcová",
    "Jirásek",
    "Olbracht",
    "Vančura",
    "Hašek",
    "Ota Pavel",
    "Fuks",
    "Rais",
    "Klíma",
    "Verne",
    "London",
    "Twain",
    "Hemingway",
    "Bradbury",
    "Golding",
    "Orwell",
    "Tolkien",
    "Rowling",
    "Dickens",
    "Stevenson",
    "Andersen",
    "Grimm",
    "Saint-Exupéry",
    "Kafka",
    "Doyle",
    "Christie",
    "Asimov",
    "Defoe",
    "Kipling",
    "Carroll",
    "Cervantes",
    "Hugo",
    "Petiška",
    "Ezop",
    "La Fontaine",
    "Homér",
  ].filter((a) => AUTHOR_POOL.includes(a) || true);

  const dramaLean = [
    "Shakespeare",
    "Molière",
    "Ibsen",
    "Tyl",
    "Voskovec",
    "Werich",
    "Nezval",
    "Vančura",
    "Golding",
  ];

  // ensure all in pool
  for (const a of [...poetryLean, ...proseLean, ...dramaLean]) {
    if (!AUTHOR_POOL.includes(a)) AUTHOR_POOL.push(a);
    if (usage[a] == null) usage[a] = 0;
  }

  function take(preferred, i) {
    const pref = preferred.filter((a) => (usage[a] || 0) < 2);
    const any = AUTHOR_POOL.filter((a) => (usage[a] || 0) < 2);
    const list = pref.length ? pref : any;
    const a = list[hashSeed(`auth-${i}-${preferred[0]}`) % list.length];
    usage[a] = (usage[a] || 0) + 1;
    return a;
  }

  return genres.map((g, i) => {
    if (g === "poezie") return take(poetryLean, i);
    if (g === "próza") return take(proseLean, i);
    return take(dramaLean, i);
  });
}

/** Short original school excerpts (not verbatim copyrighted poems). */
const EXCERPTS = {
  poezie: {
    personifikace: (a) => ({
      workingText: `(Úryvek inspirovaný lyrikou autora: ${a})\nVítr si pohrával s okenicemi a noc šeptala do polštáře dávné příběhy. Stromy u cesty se nachylovaly, jako by naslouchaly.`,
      text: "Který básnický prostředek je ve vyznačeném smyslu použit u věty „noc šeptala do polštáře“?",
      correct: "personifikace",
      distractors: ["metafora", "přirovnání", "hyperbola"],
      explanation:
        "Personifikace přisuzuje neživému jevu (noci) lidskou činnost (šeptala).",
    }),
    prirovnani: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nByl rychlý jako šíp vypuštěný z luku a tichý jako stín pod lipami.`,
      text: "Který básnický prostředek je v úryvku dominantní?",
      correct: "přirovnání",
      distractors: ["personifikace", "oxymóron", "ironie"],
      explanation: "Přirovnání poznáš podle spojení se slovem „jako“.",
    }),
    metafora: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nV srdci mu hořel oheň neodvratného rozhodnutí. Slova byla kameny, které házeli po sobě.`,
      text: "Co je v úryvku „slova byla kameny“?",
      correct: "metafora",
      distractors: ["přirovnání", "epiteton", "asonance"],
      explanation: "Metafora pojmenovává na základě podobnosti bez „jako“.",
    }),
    rym_aabb: (a) => ({
      workingText: `(Strofa inspirovaná ${a})\nNad polem letí šedý pták,\nhledá v brázdách zimní znak.\nV dáli hučí starý mlýn,\na voda šeptá: „Ještě dřiň.“`,
      text: "Jaké je schéma rýmu v této sloce?",
      correct: "AABB (sdružený)",
      distractors: ["ABAB (střídavý)", "ABBA (obkročný)", "ABC (volný bez rýmu)"],
      explanation: "Rýmují se 1.–2. a 3.–4. verš → AABB.",
    }),
    rym_abab: (a) => ({
      workingText: `(Strofa inspirovaná ${a})\nDo ticha padá první sníh,\nna střechách se třpytí led.\nV okně plápolá můj smích,\na venku mrzne celý svět.`,
      text: "Jaký typ rýmu je v ukázce (sníh–smích, led–svět)?",
      correct: "střídavý (ABAB)",
      distractors: ["sdružený (AABB)", "obkročný (ABBA)", "postupný (ABCD)"],
      explanation: "Rýmuje se 1. se 3. a 2. se 4. → ABAB.",
    }),
    rym_abba: (a) => ({
      workingText: `(Strofa inspirovaná ${a})\nZavřu oči do ticha nocí,\nslova těžká jako kámen,\nvrací se mi dávný plamen,\nkdyž se den s temnotou točí.`,
      text: "Jak se nazývá rým se schématem ABBA?",
      correct: "obkročný",
      distractors: ["sdružený", "střídavý", "přerývaný"],
      explanation: "ABBA = obkročný rým.",
    }),
    anafora: (a) => ({
      workingText: `(Úryvek inspirovaný ${a})\nNechoď sem, když bouří vítr.\nNechoď sem, když padá déšť.\nNechoď sem bez světla v očích.`,
      text: "Jaký prostředek je opakováním „Nechoď sem“ na začátku veršů?",
      correct: "anafora",
      distractors: ["epifora", "hyperbola", "gradace"],
      explanation: "Anafora = opakování stejných slov na začátku veršů/vět.",
    }),
    refren: (a) => ({
      workingText: `(Píseň/báseň ve stylu ${a})\n1 Hory mlčí pod sněhem.\n2 Vrať se, vrať se, malý ptáku.\n3 Řeka nese tiché zprávy.\n4 Vrať se, vrať se, malý ptáku.`,
      text: "Který verš funguje v ukázce jako refrén?",
      correct: "Vrať se, vrať se, malý ptáku.",
      distractors: [
        "Hory mlčí pod sněhem.",
        "Řeka nese tiché zprávy.",
        "V ukázce refrén není.",
      ],
      explanation: "Refrén je opakovaný verš (zde 2 a 4).",
    }),
    oxymoron: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nV síni zavládlo hlasité ticho. Jeho nepřítomná přítomnost bolela víc než křik.`,
      text: "Který prostředek spojuje protikladná slova v „hlasité ticho“?",
      correct: "oxymóron",
      distractors: ["hyperbola", "metafora", "epiteton"],
      explanation: "Oxymóron spojuje výrazy s protikladným významem.",
    }),
    hyperbola: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nČekal věčnost, než se dveře pohnuly. Srdce mu bušilo na tisíc bubnů.`,
      text: "Který prostředek je v „čekal věčnost“?",
      correct: "hyperbola",
      distractors: ["ironie", "litotes", "metafora"],
      explanation: "Hyperbola = záměrné přehánění.",
    }),
    ironie: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\n„To se ti teda povedlo,“ řekl otec, když syn převrátil celou polévku na ubrus.`,
      text: "Jaký prostředek je v otcově poznámce?",
      correct: "ironie",
      distractors: ["hyperbola", "personifikace", "alegorie"],
      explanation: "Ironie říká opak skutečného významu (chvála = výčitka).",
    }),
    epiteton: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nPo stříbrné hladině jezera pluly zlaté čluny večerního slunce.`,
      text: "Co jsou výrazy „stříbrná hladina“ a „zlaté čluny“ především?",
      correct: "epiteton (básnický přívlastek)",
      distractors: ["anafora", "rým", "dialog"],
      explanation: "Epiteton = výstižný ozdobný přívlastek.",
    }),
    metonymie: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nCelé město vyšlo do ulic. Praha rozhodla — a stadion jásal.`,
      text: "„Stadion jásal“ je příklad:",
      correct: "metonymie (synekdocha / záměna celku a části v kontextu)",
      distractors: ["přirovnání", "volný verš", "próza"],
      explanation:
        "Metonymie pojmenovává na základě souvislosti (stadion = lidé na něm).",
    }),
    gradace: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nŠel. Utíkal. Řítil se bez rozmyslu vpřed, až se země zdála krátká.`,
      text: "Jak se nazývá stupňování výrazů „šel – utíkal – řítil se“?",
      correct: "gradace",
      distractors: ["anafora", "inverze", "elipsa"],
      explanation: "Gradace = stupňování intenzity výrazů.",
    }),
    retoricka: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nCo ještě zbývá říci o ztraceném čase? Kdo vrátí včerejšek?`,
      text: "Jaký typ otázky je „Kdo vrátí včerejšek?“",
      correct: "řečnická otázka",
      distractors: ["doplňovací otázka čekající odpověď", "rozhovor", "didaskálie"],
      explanation: "Řečnická otázka neočekává odpověď, zdůrazňuje myšlenku.",
    }),
    sonet: (a) => ({
      workingText: `(Informace k tvorbě ${a})\nKlasický sonet má pevný počet veršů a obvykle dvě čtveřice a dvě trojice.`,
      text: "Kolik veršů má klasický sonet?",
      correct: "14",
      distractors: ["8", "12", "16"],
      explanation: "Klasický sonet = 14 veršů.",
    }),
    strofa: (a) => ({
      workingText: `(Ukázka ${a})\n[1–4 verše]\n\n[5–8 verše]\n\nMezera dělí skupiny veršů.`,
      text: "Jak se nazývá skupina veršů oddělená mezerou?",
      correct: "strofa (sloka)",
      distractors: ["verš", "refrén", "akt"],
      explanation: "Strofa/sloka = skupina veršů oddělená od ostatních.",
    }),
    vers: (a) => ({
      workingText: `(Úryvek ${a})\nJeden řádek básně nese rytmus i obraz.\nDruhý řádek pokračuje v myšlence.`,
      text: "Jak se nazývá jeden řádek básně?",
      correct: "verš",
      distractors: ["strofa", "odstavec", "replika"],
      explanation: "Verš = jeden řádek básně.",
    }),
    elegie: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nZůstal prázdný stůl a tiché křeslo. Sníh padá na hrob, který nemá jméno.`,
      text: "Který básnický žánr vyjadřuje žal a smutek nad ztrátou?",
      correct: "elegie",
      distractors: ["óda", "satira", "bajka"],
      explanation: "Elegie = žalozpěv / báseň smutku.",
    }),
    oda: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nSláva tobě, jarní světlo, které zvedá těžká víčka měst!`,
      text: "Který žánr má oslavný charakter?",
      correct: "óda",
      distractors: ["elegie", "anekdota", "reportáž"],
      explanation: "Óda oslavuje osobu, jev nebo ideu.",
    }),
    volny_vers: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nDnes\nje ticho\njiné než včera\n— bez rýmu, bez počítání slabik.`,
      text: "Jak se nazývá verš bez pravidelného rýmu a pevného počtu slabik?",
      correct: "volný verš",
      distractors: ["blankvers", "alexandrín", "haiku"],
      explanation: "Volný verš nemá pevný rým ani pravidelný rozměr.",
    }),
    aliterace: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nVítr vlnil vysoké vrbové větve nad vodou.`,
      text: "Opakování hlásky „v“ na začátku slov je:",
      correct: "aliterace",
      distractors: ["asonance", "rým", "metafora"],
      explanation: "Aliterace = opakování stejných hlásek na začátku slov.",
    }),
    alegorie: (a) => ({
      workingText: `(Úryvek ve stylu ${a} / bajkový tón)\nLiška chválila vránu za zpěv — a vrána upustila sýr. Celý příběh míří jinam než k zvířatům.`,
      text: "Když má text skrytý přenesený význam jako celek, jde o:",
      correct: "alegorii",
      distractors: ["pouhou personifikaci", "deník", "fejeton"],
      explanation: "Alegorie = celek s přeneseným / skrytým významem.",
    }),
    balada: (a) => ({
      workingText: `(Lyrickoepická ukázka ve stylu ${a})\nDívka šla temným lesem o půlnoci. Ozvalo se volání — a ráno našli jen stopy v jinovatce.`,
      text: "Jak se nazývá lyrickoepická skladba s často tragickým příběhem?",
      correct: "balada",
      distractors: ["óda", "sonet", "fejeton"],
      explanation: "Balada spojuje lyriku a epiku, často s temným/tragickým dějem.",
    }),
    epos: (a) => ({
      workingText: `(Informace k epice / ${a})\nDlouhé veršované vyprávění o hrdinech a velkých činech patří k nejstarším žánrům.`,
      text: "Jak se nazývá starobylý veršovaný epický žánr o hrdinských činech?",
      correct: "epos",
      distractors: ["novela", "drama", "fejeton"],
      explanation: "Epos = rozsáhlá veršovaná epická skladba.",
    }),
    basnicka_sbirka: (a) => ({
      workingText: `(Faktografická poznámka)\nBásně autora ${a} vyšly pohromadě jako jedna kniha s jednotným názvem.`,
      text: "Jak se nazývá soubor básní jednoho autora vydaný jako jedna kniha?",
      correct: "básnická sbírka",
      distractors: ["antologie cizích autorů", "román", "akt"],
      explanation: "Básnická sbírka = knižně vydaný soubor básní jednoho autora.",
    }),
  },
  próza: {
    ich: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nŠel jsem po nábřeží a cítil jsem, že mě město pozoruje. Nevěděl jsem, jestli mám zůstat.`,
      text: "Jaký typ vypravěče je v ukázce?",
      correct: "ich-forma (vypravěč = postava, 1. osoba)",
      distractors: [
        "er-forma vševědoucí",
        "dramatický dialog bez vypravěče",
        "lyrický subjekt bez děje",
      ],
      explanation: "Ich-forma = vyprávění v 1. osobě (já).",
    }),
    er: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nPetr otevřel dopis a zbledl. Ani Marie netušila, co v něm stálo — vypravěč však znal oba.`,
      text: "Vypravěč ve 3. osobě, který zná myšlenky postav, je:",
      correct: "vševědoucí vypravěč (er-forma)",
      distractors: ["ich-forma", "pouhý dialog", "didaskálie"],
      explanation: "Er-forma ve 3. osobě; vševědoucí zná vnitřní stavy postav.",
    }),
    bajka: (a) => ({
      workingText: `(Bajka ve stylu ${a})\nVlk kázal oviním o míru — a přitom měl zuby plné peří. Na konci stojí poučení o pokrytectví.`,
      text: "Krátký alegorický příběh (často se zvířaty) s poučením je:",
      correct: "bajka",
      distractors: ["pověst", "reportáž", "sonet"],
      explanation: "Bajka = krátký alegorický příběh s poučením.",
    }),
    povest: (a) => ({
      workingText: `(Vyprávění ve stylu ${a})\nNa skále nad řekou prý stával hrad. Lidová paměť pojí místo se smyšleným hrdinou, který zachránil kraj.`,
      text: "Vyprávění vázané k místu/historii se smyšlenými prvky je:",
      correct: "pověst",
      distractors: ["mýtus o stvoření světa", "fejeton", "óda"],
      explanation: "Pověst se váže ke konkrétnímu místu nebo události.",
    }),
    mytus: (a) => ({
      workingText: `(Výkladový úryvek / ${a})\nBohové se přeli o vládu nad mořem a zemí. Příběh vysvětluje, proč vlny bijí do útesů.`,
      text: "Starobylé vyprávění o bozích a vzniku světa je:",
      correct: "mýtus",
      distractors: ["novela", "deník", "kritika"],
      explanation: "Mýtus vypráví o bozích, hrdinech, vzniku světa.",
    }),
    mytus_vs_povest: (a) => ({
      workingText: `(Srovnání žánrů — kontext ${a})\nA: příběh o vzniku ohně od bohů.\nB: příběh o vzniku jména konkrétního hradu.`,
      text: "Čím se mýtus liší od pověsti?",
      correct: "mýtus je obecnější (bohové/svět); pověst se váže k místu/historii",
      distractors: [
        "mýtus je vždy v próze, pověst vždy ve verších",
        "pověst nemá žádný děj",
        "rozdíl neexistuje",
      ],
      explanation: "Mýtus = obecné sakrální příběhy; pověst = lokalizovaná tradice.",
    }),
    pohadka: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nBylo nebylo — za sedmero horami. Kouzelný prsten splnil tři přání a zlo bylo potrestáno.`,
      text: "Který znak je typický pro pohádku?",
      correct: "kouzlo / typické obraty a boj dobra se zlem",
      distractors: [
        "přesné historické datum a archivní citace",
        "jen dialog bez děje",
        "výhradně reportážní styl",
      ],
      explanation: "Pohádka: neskutečno, ustálené obraty, dobro vs. zlo.",
    }),
    novela: (a) => ({
      workingText: `(Teorie žánru + kontext ${a})\nStředně dlouhý prozaický příběh s úzkým dějem a výrazným zvratem bývá kratší než román.`,
      text: "Čím se novela typicky liší od povídky?",
      correct: "novela mívá výraznější dějový zvrat a ucelenější konstrukci než krátká povídka",
      distractors: [
        "novela je vždy ve verších",
        "povídka musí mít 5 aktů",
        "novela nemá postavy",
      ],
      explanation: "Novela = prozaický útvar s výraznou pointou/zvratem, delší než povídka.",
    }),
    flashback: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nTeď stál před branou. Najednou si vzpomněl na zimu před deseti lety, kdy tudy utíkal bos.`,
      text: "Návrat v čase osvětlující minulost je:",
      correct: "flashback (retrospektiva)",
      distractors: ["expozice bez minulosti", "katharsis", "didaskálie"],
      explanation: "Flashback = návrat do minulosti v ději.",
    }),
    pointa: (a) => ({
      workingText: `(Krátký útvar ve stylu ${a})\nCelý den hledali zloděje. Nakonec zjistili, že klíč měli celou dobu v druhé kapse.`,
      text: "Překvapivé vyústění na konci je:",
      correct: "pointa",
      distractors: ["expozice", "motto", "akt"],
      explanation: "Pointa = výstižné/překvapivé zakončení.",
    }),
    expozice: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nV malém přístavu žili dva bratři. Loď stála u mola a vítr voněl solí — ještě než přišla zpráva o válce.`,
      text: "Úvod, kde poznáváme postavy a prostředí, je:",
      correct: "expozice",
      distractors: ["katastrofa", "peripetie", "epilog"],
      explanation: "Expozice = úvodní seznámení s situací.",
    }),
    kolize: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nKdyž odmítl prodat pozemek, soused začal vyhrožovat. Tím se konflikt rozjel naplno.`,
      text: "Rozvinutí konfliktu v ději se nazývá:",
      correct: "kolize (zápletka / rozvinutí sporu)",
      distractors: ["pouhý popis počasí", "titulní list", "rejstřík"],
      explanation: "Kolize = střet zájmů a rozvoj konfliktu.",
    }),
    klimax: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nNa střeše hořelo, lano praskalo — vteřina rozhodovala o životě.`,
      text: "Vyvrcholení napětí v ději je:",
      correct: "vrchol / klimax",
      distractors: ["expozice", "motto", "bibliografie"],
      explanation: "Klimax = bod největšího napětí.",
    }),
    peripetie: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nUž se zdálo, že vyhráli — pak přišel telegram a všechno se obrátilo.`,
      text: "Náhlý zvrat v ději je:",
      correct: "peripetie",
      distractors: ["anafora", "epiteton", "strofa"],
      explanation: "Peripetie = náhlý obrat v ději.",
    }),
    protagonist: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nPříběh sleduje především Aninu cestu. Ostatní postavy do ní vstupují jen občas.`,
      text: "Postava v centru děje je:",
      correct: "hlavní postava (protagonista)",
      distractors: ["epizodní postava", "vydavatel", "korektor"],
      explanation: "Protagonista = hlavní postava.",
    }),
    antagonist: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nCokoli hrdina naplánoval, soused Havránek překazil — záměrně a soustavně.`,
      text: "Postava v přímém konfliktu s hrdinou je:",
      correct: "antagonista",
      distractors: ["lyrický subjekt", "refrén", "metrum"],
      explanation: "Antagonista stojí proti hlavní postavě.",
    }),
    dystopie: (a) => ({
      workingText: `(Kontext dilemat ${a})\nStát sleduje každý pohyb. Pravda je zakázaná, jazyk se zužuje, svoboda mizí.`,
      text: "Žánr líčící negativní, utlačivou fiktivní společnost je:",
      correct: "dystopie",
      distractors: ["utopie", "idylá", "anekdota"],
      explanation: "Dystopie = varovný obraz špatné společnosti.",
    }),
    utopie: (a) => ({
      workingText: `(Kontext ${a})\nOstrov, kde není chudoba ani trestů — vše řízeno dokonalým řádem shody.`,
      text: "Žánr ideální dokonalé společnosti je:",
      correct: "utopie",
      distractors: ["dystopie", "thriller", "elegie"],
      explanation: "Utopie = ideální společenské uspořádání.",
    }),
    scifi: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nRaketoplán mířil k měsíční stanici. Počítač počítal kyslík na hodiny.`,
      text: "Žánr s vědou/technikou budoucnosti nebo vesmíru je:",
      correct: "science fiction",
      distractors: ["realista vesnická idyla 19. stol. bez spekulace", "lidová hádanka", "óda"],
      explanation: "Sci-fi staví na vědě, technice, budoucnosti, vesmíru.",
    }),
    fantasy: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nTrpaslíci střežili bránu a čaroděj zvedl hůl proti stínu z hor.`,
      text: "Žánr s magií a smyšleným světem je:",
      correct: "fantasy",
      distractors: ["reportáž z parlamentu", "kronika bez fikce", "učební návod"],
      explanation: "Fantasy = magie, mýtické bytosti, fiktivní svět.",
    }),
    cestopis: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nTřetí den jsme vstoupili do pouště. Noc byla jasná a kompas se chvěl v dlani.`,
      text: "Žánr popisující cesty a zážitky z neznámých krajů je:",
      correct: "cestopis",
      distractors: ["sonet", "monolog", "akt"],
      explanation: "Cestopis líčí cesty a poznávání krajů.",
    }),
    anekdota: (a) => ({
      workingText: `(Krátký útvar ve stylu ${a})\nUčitel se zeptal na hlavní město. Žák odpověděl: „U nás doma.“ — a třída vybuchla smíchy.`,
      text: "Krátké vtipné vyprávění s pointou je:",
      correct: "anekdota",
      distractors: ["epos", "tragédie", "slovník"],
      explanation: "Anekdota = krátký vtipný příběh s pointou.",
    }),
    motto: (a) => ({
      workingText: `(Kniha ve stopách ${a})\nNa první straně před kapitolou stojí citát: „Pravda bolí, ale léčí.“`,
      text: "Citát na začátku díla naznačující téma je:",
      correct: "motto (epigraf)",
      distractors: ["epilog", "didaskálie", "scéna"],
      explanation: "Motto/epigraf = úvodní citát.",
    }),
    epilog: (a) => ({
      workingText: `(Závěr knihy ve stylu ${a})\nPo letech se hrdina vrátil. Autor v posledních odstavcích shrnuje, co bylo dál.`,
      text: "Závěrečný komentář/shrnutí po ději je:",
      correct: "epilog",
      distractors: ["expozice", "titulek", "rejstřík jmen"],
      explanation: "Epilog uzavírá a doplňuje děj.",
    }),
    in_medias_res: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\nPrvní věta: „Střela právě minula sklo.“ Teprve později se dozvíme, proč vůbec stříleli.`,
      text: "Začátek uprostřed děje bez klidného úvodu je:",
      correct: "in medias res",
      distractors: ["chronologický úvod od narození", "pouhý seznam postav", "fejeton"],
      explanation: "In medias res = vstup přímo do dění.",
    }),
    tema_motiv: (a) => ({
      workingText: `(Analýza textu ${a})\nV příběhu se opakuje cesta vlakem. Celé dílo však mluví o osamělosti moderního člověka.`,
      text: "Jaký je rozdíl mezi motivem a tématem?",
      correct: "motiv = dílčí prvek; téma = ústřední smysl díla",
      distractors: [
        "motiv je vždy delší než téma",
        "téma je jen jméno autora",
        "jsou to synonyma bez rozdílu",
      ],
      explanation: "Motiv je prvek; téma je hlavní idea.",
    }),
    proza_vs_poezie: (a) => ({
      workingText: `(Srovnání — kontext četby ${a})\nText A běží v odstavcích bez veršů. Text B je členěn do řádků s rytmem.`,
      text: "Základní rozdíl mezi prózou a poezií?",
      correct: "próza = souvislé věty/odstavce; poezie = verše (a často rytmus/rým)",
      distractors: [
        "próza nesmí mít děj",
        "poezie nesmí mít metaforu",
        "rozdíl je jen v tloušťce knihy",
      ],
      explanation: "Próza vs. poezie = způsob uspořádání jazyka.",
    }),
    literatura_faktu: (a) => ({
      workingText: `(Srovnání žánrů — ${a} jako čtenářský kontext)\nKniha A dokládá data a svědectví. Kniha B vymýšlí postavy a dialogy.`,
      text: "Čím se literatura faktu liší od umělecké fikce?",
      correct: "opírá se o ověřitelná fakta / skutečné události",
      distractors: [
        "nesmí používat spisovnou češtinu",
        "musí být vždy ve verších",
        "nesmí mít nadpis",
      ],
      explanation: "Literatura faktu vychází z reality a ověřitelnosti.",
    }),
    cyklus: (a) => ({
      workingText: `(Poznámka k tvorbě ${a})\nNěkolik povídek spojuje stejné město a podobní hrdinové — vycházejí jako řada.`,
      text: "Soubor děl spojených tématem/postavami je:",
      correct: "cyklus",
      distractors: ["jediný sonet", "didaskálie", "korektura"],
      explanation: "Cyklus = skupina děl s jednotícím prvkem.",
    }),
    epizoda: (a) => ({
      workingText: `(Úryvek z většího celku ${a})\nKapitola o nočním útěku je uzavřená sama o sobě, ale patří do delšího románu.`,
      text: "Menší uzavřená část většího vyprávění je:",
      correct: "epizoda",
      distractors: ["celá bibliografie", "vydavatelská doložka", "ISBN"],
      explanation: "Epizoda = dílčí uzavřená část příběhu.",
    }),
    pasmo_vypravece: (a) => ({
      workingText: `(Úryvek ve stylu ${a})\n„Zmiz!“ křikl. Pak vypravěč dodal, že v pokoji zavládlo ticho.`,
      text: "Část, kde mluví vypravěč (ne přímá řeč postav), je:",
      correct: "pásmo vypravěče",
      distractors: ["jen uvozovky bez komentáře", "obsah knihy", "rejstřík"],
      explanation: "Pásmo vypravěče = narace mimo přímou řeč.",
    }),
    filozoficka_pohadka: (a) => ({
      // Bez výchozího textu — otázka je čistě žánrová, meta „dílo v tradici X“ spoileruje.
      workingText: null,
      text: "Spojení filozofického poselství s pohádkovým rámcem je typické pro:",
      correct: "filozofickou / moderní pohádku s podobenstvím",
      distractors: ["účetní zprávu", "telefonní seznam", "rýmovací tabulku"],
      explanation: "Filozofická pohádka nese hlubší smysl v jednoduchém příběhu.",
    }),
  },
  drama: {
    didaskalie: (a) => ({
      workingText: `(Úryvek z dramatu — tradice ${a})\nANNA: (tiše, u okna) Nechoď ještě.\n(Odmlčí se. Zvenčí duní vlak.)`,
      text: "Pokyny v závorkách pro herce/inscenátory jsou:",
      correct: "didaskálie",
      distractors: ["metafora", "motto", "epilog prózy"],
      explanation: "Didaskálie = scénické poznámky.",
    }),
    monolog: (a) => ({
      workingText: `(Úryvek — ${a})\nKRÁL: (sám na jevišti) Všichni spí. Jen já slyším, jak se říše drolí…`,
      text: "Dlouhá promluva jedné postavy bez odpovědi druhých je:",
      correct: "monolog",
      distractors: ["dialog", "refrén", "aliterace"],
      explanation: "Monolog = řeč jedné postavy o samotě / bez reakce.",
    }),
    dialog: (a) => ({
      workingText: `(Úryvek — ${a})\nA: Přijdeš?\nB: Než zazní půlnoc.\nA: Pak budu čekat.`,
      text: "Střídavé promluvy postav jsou:",
      correct: "dialog",
      distractors: ["monolog", "pásmo vypravěče v románu", "sonet"],
      explanation: "Dialog = rozhovor postav.",
    }),
    replika: (a) => ({
      workingText: `(Úryvek — ${a})\nMlynář: Voda stoupla.\n(To je jedna ucelená promluva postavy.)`,
      text: "Jedna promluva jedné postavy v dramatu je:",
      correct: "replika",
      distractors: ["strofa", "kapitola", "fejeton"],
      explanation: "Replika = jedna výpověď postavy.",
    }),
    akt: (a) => ({
      workingText: `(Struktura hry — ${a})\nHra má tři velké části oddělené oponou; v každé se mění situace.`,
      text: "Velká část divadelní hry se nazývá:",
      correct: "akt (dějství)",
      distractors: ["verš", "odstavec", "heslo ve slovníku"],
      explanation: "Akt/dějství = hlavní oddíl dramatu.",
    }),
    scena: (a) => ({
      workingText: `(Struktura — ${a})\nKdykoli někdo vstoupí nebo odejde, mění se situace na jevišti uvnitř aktu.`,
      text: "Menší úsek aktu při změně postav na jevišti je:",
      correct: "scéna (výstup)",
      distractors: ["románová kapitola mimo drama", "rým", "bajka"],
      explanation: "Scéna/výstup = část aktu.",
    }),
    tragedie: (a) => ({
      workingText: `(Žánrový kontext ${a})\nHrdina volí mezi ctí a životem; na konci umírá a obecenstvo cítí otřes i očistu.`,
      text: "Vážný dramatický žánr s tragickým koncem je:",
      correct: "tragédie",
      distractors: ["komedie", "anekdota", "reklamní slogan"],
      explanation: "Tragédie = vážný konflikt, obvykle nešťastný konec.",
    }),
    komedie: (a) => ({
      workingText: `(Žánrový kontext ${a})\nZáměny osob, nedorozumění a závěrečná svatba — obecenstvo se směje.`,
      text: "Odlehčený dramatický žánr s komikou a často šťastným koncem je:",
      correct: "komedie",
      distractors: ["tragédie", "elegie", "kronika"],
      explanation: "Komedie pracuje s komikou a bývá smírná.",
    }),
    katastrofa: (a) => ({
      workingText: `(Teorie dramatu — ${a})\nPo vrcholu přichází závěr, kde se konflikt uzavírá — často tragicky.`,
      text: "Závěrečné rozuzlení dramatu (často tragické) je:",
      correct: "katastrofa (v dramaturgickém smyslu)",
      distractors: ["expozice", "titulní stránka", "copyright"],
      explanation: "Katastrofa = závěrečné rozuzlení tragického konfliktu.",
    }),
    fejeton: (a) => ({
      workingText: `(Publicistika — tón ${a})\nLehký sloupek o frontě u pekárny: vtip, nadsázka, aktuální postřeh ze života města.`,
      text: "Lehký vtipný publicistický útvar na aktuální téma je:",
      correct: "fejeton",
      distractors: ["epos", "didaskálie", "blankvers"],
      explanation: "Fejeton = lehký, aktuální, často vtipný publicistický text.",
    }),
    reportaz: (a) => ({
      workingText: `(Publicistika — ${a})\nAutor byl přímo na místě povodně; popisuje, co viděl a slyšel od pamětníků.`,
      text: "Žánr založený na přímé přítomnosti / svědectví je:",
      correct: "reportáž",
      distractors: ["sonet", "oxymóron", "akt"],
      explanation: "Reportáž vychází z přímého pozorování události.",
    }),
    denik: (a) => ({
      workingText: `(Útvar — ${a})\n12. března — Dnes poprvé napadl sníh. Bojím se zítrajšku.`,
      text: "Pravidelný osobní záznam zážitků a myšlenek je:",
      correct: "deník",
      distractors: ["dialog dvou herců na jevišti", "rýmové schéma", "obsah učebnice"],
      explanation: "Deník = chronologické osobní zápisy.",
    }),
    kritika: (a) => ({
      workingText: `(Publicistika — ${a})\nRecenzent hodnotí nový román: klady kompozice, výtky k jazyku, doporučení čtenáři.`,
      text: "Útvar hodnotící umělecké dílo je:",
      correct: "kritika / recenze",
      distractors: ["bajka se zvířaty", "lidová hádanka", "jmenný rejstřík"],
      explanation: "Kritika/recenze hodnotí dílo a argumentuje.",
    }),
    autobiografie: (a) => ({
      workingText: `(Žánr — ${a})\nAutor píše: „Narodil jsem se v malém městě…“ a líčí vlastní život.`,
      text: "Dílo, v němž autor popisuje vlastní život, je:",
      correct: "autobiografie",
      distractors: ["biografie napsaná někým jiným", "pouhá reklamní brožura", "partitura"],
      explanation: "Autobiografie = vlastní životopis.",
    }),
    biografie: (a) => ({
      workingText: `(Žánr — ${a})\nBadatel sestavil životní příběh spisovatele podle dopisů a archivů — píše o něm v er-formě.`,
      text: "Životopis jiné osoby napsaný někým jiným je:",
      correct: "biografie",
      distractors: ["autobiografie", "recept", "slovní hříčka"],
      explanation: "Biografie = životopis napsaný o někom jiném.",
    }),
    kronika: (a) => ({
      workingText: `(Útvar — ${a})\nLéta Páně… Město postihl mor. Poté přišla povodeň. Zápisy jdou rok po roku.`,
      text: "Chronologický zápis událostí je:",
      correct: "kronika",
      distractors: ["sonet", "monolog", "oxymóron"],
      explanation: "Kronika řadí události časově za sebou.",
    }),
    druhy: (a) => ({
      workingText: `(Opakování teorie — příklady z četby včetně ${a})\nEpika vypráví, lyrika vyjadřuje, drama je určeno jevišti.`,
      text: "Tři základní literární druhy jsou:",
      correct: "epika, lyrika, drama",
      distractors: ["próza, poezie, rým", "pohádka, bajka, fejeton", "román, povídka, článek"],
      explanation: "Základní druhy: epika, lyrika, drama.",
    }),
    prislovi: (a) => ({
      workingText: `(Lidová slovesnost — kontext výuky s ${a})\n„Bez práce nejsou koláče.“ Výrok nese obecné poučení.`,
      text: "Krátký obrazný výrok s poučením je:",
      correct: "přísloví",
      distractors: ["pořekadlo bez poučení", "didaskálie", "akt"],
      explanation: "Přísloví obsahuje mravní/životní poučení.",
    }),
    prislovi_vs_porekadlo: (a) => ({
      workingText: `(Srovnání — ${a})\nA: „Kdo jinému jámu kopá…“ (poučení)\nB: „mít máslo na hlavě“ (obrazné spojení bez mravního apelů)`,
      text: "Čím se přísloví liší od pořekadla?",
      correct: "přísloví má poučení; pořekadlo je spíš ustálené obrazné rčení",
      distractors: [
        "pořekadlo je vždy delší",
        "přísloví se nesmí používat ve škole",
        "rozdíl neexistuje",
      ],
      explanation: "Přísloví poučuje; pořekadlo spíš obrazně pojmenovává.",
    }),
  },
};

// Fix typo key
EXCERPTS.próza.er = EXCERPTS.próza.er;

function buildGenrePlan(n) {
  const nPoetry = Math.round(n * 0.4);
  const nProse = Math.round(n * 0.4);
  const nDrama = n - nPoetry - nProse;
  return [
    ...Array(nPoetry).fill("poezie"),
    ...Array(nProse).fill("próza"),
    ...Array(nDrama).fill("drama"),
  ];
}

function keysOf(genre) {
  if (genre === "poezie") return Object.keys(EXCERPTS.poezie);
  if (genre === "próza") return Object.keys(EXCERPTS.próza);
  return Object.keys(EXCERPTS.drama);
}

function stripMetaWorkingPrefix(wt) {
  if (!wt || typeof wt !== "string") return wt || null;
  let t = wt.trimStart();
  const re = /^\([^)\n]{2,120}\)\s*\n?/;
  while (re.test(t)) t = t.replace(re, "").trimStart();
  t = t.trim();
  return t || null;
}

function makeQuestion(id, genre, author, templateKey, seed) {
  const bag =
    genre === "poezie" ? EXCERPTS.poezie : genre === "próza" ? EXCERPTS.próza : EXCERPTS.drama;
  const factory = bag[templateKey];
  const raw = factory(author);
  const picked = pickOptions(raw.correct, raw.distractors, seed);
  const workingText = stripMetaWorkingPrefix(raw.workingText);
  const q = {
    id,
    category: "Literární teorie",
    text: raw.text,
    options: picked.options,
    correctAnswerIndex: picked.correctAnswerIndex,
    explanation: raw.explanation,
    hint: workingText
      ? "Opři se o výchozí text — pojem musí sedět s ukázkou, ne jen s pamětí definice."
      : "Vyber pojem, který přesně sedí na zadaný jev.",
    meta: {
      refactored: true,
      difficultyTarget: "100-105% CERMAT9",
      genre,
      author,
      templateKey,
      sourceId: id,
    },
  };
  if (workingText) q.workingText = workingText;
  return q;
}

function assertNoBanned(q) {
  const blob = JSON.stringify({
    text: q.text,
    workingText: q.workingText,
    options: q.options,
    explanation: q.explanation,
    hint: q.hint,
    author: q.meta?.author,
  });
  for (const b of BANNED) {
    if (new RegExp(b, "i").test(blob)) {
      throw new Error(`Banned author ${b} leaked into ${q.id}`);
    }
  }
}

function authorCounts(list) {
  const c = {};
  for (const q of list) {
    const a = q.meta?.author || "?";
    c[a] = (c[a] || 0) + 1;
  }
  return c;
}

// --- main ---
const original = JSON.parse(readFileSync(INPUT, "utf8")).filter(
  (q) => q.category === "Literární teorie"
);
const n = original.length;
const genres = buildGenrePlan(n);
const authors = assignAuthors(genres);

const poetryKeys = keysOf("poezie");
const proseKeys = keysOf("próza");
const dramaKeys = keysOf("drama");

const out = original.map((q, i) => {
  const genre = genres[i];
  const author = authors[i];
  const keys =
    genre === "poezie" ? poetryKeys : genre === "próza" ? proseKeys : dramaKeys;
  const templateKey = keys[i % keys.length];
  const built = makeQuestion(q.id, genre, author, templateKey, `${q.id}-${author}`);
  assertNoBanned(built);
  return built;
});

// Diversity check
const counts = authorCounts(out);
const over = Object.entries(counts).filter(([, v]) => v > 2);
if (over.length) {
  console.error("Authors over limit:", over);
  process.exit(1);
}

// Genre ratios
const gCount = { poezie: 0, próza: 0, drama: 0 };
for (const q of out) gCount[q.meta.genre]++;

writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n");

console.log(`\nWrote ${out.length} questions → ${OUTPUT}`);
console.log(
  `Genre mix: poezie ${gCount.poezie} (${((gCount.poezie / n) * 100).toFixed(0)}%), próza ${gCount.próza} (${((gCount.próza / n) * 100).toFixed(0)}%), drama/publ. ${gCount.drama} (${((gCount.drama / n) * 100).toFixed(0)}%)`
);
console.log(`Banned check: OK (none of ${BANNED.join(", ")})`);
console.log(`Unique authors: ${Object.keys(counts).length}`);
console.log("\nSEZNAM VŠECH AUTORŮ V DÁVCE (autor → počet):");
for (const [a, c] of Object.entries(counts).sort((x, y) => x[0].localeCompare(y[0], "cs"))) {
  console.log(`  ${a}: ${c}`);
}

console.log("\nUkázky (3):");
for (const id of [out[0].id, out[40].id, out[80].id]) {
  const q = out.find((x) => x.id === id);
  console.log("\n---", id, "|", q.meta.genre, "|", q.meta.author);
  console.log(q.text);
  console.log(q.workingText.split("\n")[0]);
  console.log("→", q.options[q.correctAnswerIndex]);
}
