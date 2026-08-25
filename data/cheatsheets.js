// ---------------------------------------------------------------------------
// "Tahák" (cheat sheet) — per category.
// Section fields:
//   title, rule[] (short), steps[]?, groups[]? ({label, items}),
//   tip?, trap?, examples[]?, practice[]? ({prompt, answer}), links[]?
// ---------------------------------------------------------------------------
const PRAVOPIS_CHEATSHEET = [
  {
    title: "1. Vyjmenovaná slova",
    rule: [
      "Po obojetných B, L, M, P, S, V, Z piš y/ý jen ve vyjmenovaných slovech a od nich odvozených — jinak i/í.",
    ],
    steps: [
      "Je před i/y obojetná souhláska (B L M P S V Z)?",
      "Je slovo na seznamu vyjmenovaných, nebo od něj odvozené?",
      "Ano → y/ý. Ne → i/í.",
    ],
    groups: [
      { label: "B", items: "bydlet, byt, obyvatel, dobytek, kobyla, býk, bystrý, bylina" },
      { label: "L", items: "mlýn, blýskat se, lysý, lýko, plynout, polykat, vzlykat" },
      { label: "M", items: "mýt, mýtit, zamykat, mýtina, hmyz, myslet, mýlit se, jmelí" },
      { label: "P", items: "pýcha, pysk, netopýr, slepýš, kopyto, klopýtat" },
      { label: "S", items: "syn, sytý, sýr, syrový, sysel, sypat, usychat" },
      { label: "V", items: "vysoký, výskat, zvykat, žvýkat, výr, zvyk" },
      { label: "Z", items: "brzy, jazyk, nazývat" },
    ],
    trap:
      "Ve výslovnosti se y a i neliší — rozhoduje jen seznam. Pozor na dvojice, kde i/y mění význam:",
    examples: [
      "být (existovat) × bít (tlouct)",
      "mýtit (kácet) × mít (vlastnit)",
      "pýcha × píchat",
      "výr (sova) × vír (vodní)",
    ],
    practice: [
      { prompt: "starý ml_n", answer: "mlýn" },
      { prompt: "museli m_tit les", answer: "mýtit" },
      { prompt: "citlivý p_sk", answer: "pysk" },
    ],
  },
  {
    title: "2. Psaní ú/ů",
    rule: ["Ú na začátku slova. Ů uvnitř domácího slova. U přejatých slov může být ú i uprostřed."],
    steps: [
      "Je to úplný začátek slova? → ú (úkol, úterý).",
      "Je to domácí české slovo uprostřed? → ů (dům, stůl).",
      "Je to přejaté slovo? → často ú i uprostřed (manikúra, múza).",
    ],
    trap: "Nezačínej slovo písmenem ů. Uprostřed běžného českého slova nepiš ú místo ů.",
    examples: [
      "úkol, únor → ú",
      "dům, kůň, růže → ů",
      "manikúra, kúra → ú (přejatá)",
      "vzhůru, dohůry → ů (ustálené výjimky)",
    ],
    practice: [
      { prompt: "_kol na zítra", answer: "úkol" },
      { prompt: "nový st_l", answer: "stůl" },
      { prompt: "m_za v muzeu", answer: "múza" },
    ],
  },
  {
    title: "3. Předpony s- / z- / vz-",
    rule: [
      "s- = dolů / pryč / dohromady. z- = změna stavu / výsledek. vz- = vzhůru / náhlý začátek. U některých slov je potřeba tvar umět nazpaměť.",
    ],
    steps: [
      "Jde o pohyb dolů, pryč nebo spojení? → zkus s- (shodit, spojit).",
      "Jde o změnu stavu nebo výsledek? → z- (zchudnout, zbořit).",
      "Jde o pohyb vzhůru / náhlý start? → vz- (vzlétnout, vzplanout).",
    ],
    trap: "Významové pravidlo je jen vodítko — některá slova se musí zapamatovat (nelze je „odvodit“).",
    examples: [
      "shodit (správně) × zhodit (chyba)",
      "zchudnout (správně) × schudnout (chyba)",
      "vzlétnout (správně) × zlétnout (chyba)",
      "zbořit (správně) × sbořit (chyba)",
    ],
    practice: [
      { prompt: "_hodit kámen ze skály", answer: "shodit" },
      { prompt: "_chudnout po nemoci", answer: "zchudnout" },
      { prompt: "_létnout vzhůru", answer: "vzlétnout" },
    ],
  },
  {
    title: "4. Mě / mně",
    rule: [
      "U zájmena já: mě = 2. a 4. pád; mně = 3. a 6. pád. V ostatních slovech (město, měkký…) je vždy jen mě.",
    ],
    steps: [
      "Jde o tvar zájmena já? Ne → piš mě (město, změna, rozumně).",
      "Ano → zeptej se pádem: koho/čeho? koho/co? → mě.",
      "Komu/čemu? o kom/o čem? → mně.",
    ],
    trap: "Do slov jako město, měkký, rozumně se mně nikdy nedává — nejde o zájmeno já.",
    examples: [
      "Bez mě… / Vidíš mě? → mě",
      "Řekni mně… / Mluvili o mně. → mně",
      "město, měkký, změna → vždy mě",
    ],
    practice: [
      { prompt: "Bez _ to nepůjde.", answer: "mě" },
      { prompt: "Řekni _, co se stalo.", answer: "mně" },
      { prompt: "velké _sto", answer: "město" },
    ],
  },
  {
    title: "5. Velká a malá písmena",
    rule: [
      "Obecná jména malým, vlastní velkým. U víceslovných názvů obvykle jen první slovo velké (pokud další samo není vlastní jméno).",
    ],
    steps: [
      "Je to druhové označení (město, řeka, škola)? → malé.",
      "Je to konkrétní jedinečný název (Praha, Vltava)? → velké.",
      "Víceslovný název? → většinou jen 1. slovo velké (Pražský hrad, Karlův most).",
    ],
    trap: "Nepiš Pražský Hrad / Karlův Most. U oficiálního názvu státu je Česká republika (obě velká) × český jazyk (malé).",
    examples: [
      "Pražský hrad, Karlův most",
      "Česká republika × český jazyk",
      "Novákův dům, Petrovy knihy (vždy velké)",
    ],
    practice: [
      { prompt: "pražský / Pražský hrad?", answer: "Pražský hrad" },
      { prompt: "český jazyk / Český jazyk?", answer: "český jazyk" },
      { prompt: "novákův / Novákův dům?", answer: "Novákův dům" },
    ],
  },
  {
    title: "6. Shoda přísudku s podmětem",
    rule: [
      "V množném čísle minulého času: muž. životný -i; muž. neživotný a ženský -y; střední -a. U smíšeného podmětu rozhoduje přítomnost mužského životného.",
    ],
    steps: [
      "Najdi podmět v množném čísle.",
      "Urči rod: životný mužský → -i; neživotný/ženský → -y; střední → -a.",
      "Smíšený podmět: je tam aspoň jeden mužský životný? → -i, jinak obvykle -y.",
    ],
    trap:
      "děvčátka / koťata = střední rod (-a), i když jsou „živá“. rodiče = mužský životný (-i).",
    examples: [
      "Chlapci přišli. Stromy rostly. Ženy zpívaly. Města rostla.",
      "Chlapci a dívky zpívali. Auta a tramvaje jezdily.",
      "Děvčátka si hrála. Rodiče přijeli.",
    ],
    practice: [
      { prompt: "Děvčátka si hrála / hráli?", answer: "hrála" },
      { prompt: "Rodiče přijeli / přijely?", answer: "přijeli" },
      { prompt: "Dny ubíhaly / ubíhali?", answer: "ubíhaly" },
    ],
  },
  {
    title: "7. Koncovky přídavných jmen",
    rule: [
      "V 1. pádě mn. č. se přídavné jméno shoduje s podstatným: muž. životný -í, ženský/muž. neživotný -é, střední -á. V psaní používej spisovné koncovky, ne hovorové -ma.",
    ],
    steps: [
      "Urči rod podstatného jména.",
      "Doplň koncovku přídavného: -í / -é / -á.",
      "V 7. pádě mn. č. piš -mi/-y (s dětmi), ne -ma (s dětma).",
    ],
    trap: "mladí kluci × mladé dívky × mladá koťata. Hovorové -ma do testu nepatří.",
    examples: [
      "mladí kluci · mladé dívky · mladá koťata",
      "s dětmi, s kluky (spisovně)",
      "hezčí · chytřejší · moudřejší",
    ],
    practice: [
      { prompt: "mlad_ žáci (chlapci)", answer: "mladí" },
      { prompt: "s dětmi / s dětma?", answer: "s dětmi" },
      { prompt: "mlad_ koťata", answer: "mladá" },
    ],
  },
  {
    title: "8. Čárky v souvětí a větě",
    rule: [
      "Čárkou oddělujeme větné celky, oslovení, vsuvku a členy výčtu. Před a/i/ani/nebo čárka obvykle není, pokud nejde o odporovací vztah nebo vsuvku.",
    ],
    steps: [
      "Je ve větě oslovení nebo vsuvka? → odděl čárkami (Ahoj, Petře, … / Pravda, myslím, je jinde.).",
      "Jsou tu dvě věty (souvětí)? → často čárka mezi nimi.",
      "Je to výčet? → čárky mezi položkami; před a obvykle ne.",
    ],
    trap: "Vsuvku odděluj z obou stran. U oslovení nezapomeň čárku. Nepřidávej čárku před a ve výčtu bez důvodu.",
    examples: [
      "Petře, pojď sem.",
      "Praha, Brno a Ostrava (bez čárky před a)",
      "To je, myslím, dobrý nápad. (vsuvka z obou stran)",
    ],
    practice: [
      { prompt: "Ahoj Petře pojď dál. — kam patří čárka?", answer: "Ahoj, Petře, pojď dál." },
      { prompt: "Výčet: jablka hrušky a švestky", answer: "jablka, hrušky a švestky" },
    ],
  },
  {
    title: "9. Předložky s / z",
    rule: [
      "Předložka z/ze = odkud / z čeho (2. pád). Předložka s/se = s kým / s čím (7. pád). Nespleť si je s předponami s-/z- u sloves.",
    ],
    steps: [
      "Zeptáš se odkud / z čeho? → z/ze (z domu, ze školy).",
      "Zeptáš se s kým / s čím? → s/se (s kamarádem, se mnou).",
      "Jde o předponu u slovesa? → řeš podle sekce s-/z-/vz-.",
    ],
    trap: "z lesa (odkud) × s kamarádem (s kým). „se mnou“ je se, ne ze.",
    examples: [
      "z Prahy, ze školy, z domu",
      "s otcem, se sestrou, s úsměvem",
    ],
    practice: [
      { prompt: "_ školy přišel pozdě", answer: "ze" },
      { prompt: "šla _ kamarádkou", answer: "s" },
      { prompt: "mluvil _ mnou", answer: "se" },
    ],
  },
  {
    title: "10. Zápor ne- / ně-",
    rule: [
      "ne- = zápor (nevidím, nešťastný). ně- = neurčitost (někdo, něco, někdy). Nespojuj je dohromady.",
    ],
    steps: [
      "Znamená to opak / popření? → ne-.",
      "Znamená to neurčitou osobu/věc/čas? → ně-.",
      "Když si nejsi jistý, dosaď význam: „ne“ = zápor, „ně“ = někdo/něco.",
    ],
    trap: "někdo ≠ nekdo. nešťastný (zápor) × nějaký (neurčité).",
    examples: [
      "nevidím, nechci, nešťastný → ne-",
      "někdo, něco, někdy, nějaký → ně-",
    ],
    practice: [
      { prompt: "_kdo zvonil", answer: "někdo" },
      { prompt: "_viděl nic", answer: "neviděl" },
      { prompt: "_jaký problém", answer: "nějaký" },
    ],
  },
  {
    title: "11. Číslovky a přejatá slova",
    rule: [
      "Základní číslovky piš podle spisovného tvaru (milion, tisíc). U přejatých slov se drž ustáleného českého pravopisu (ne „anglického“ zápisu).",
    ],
    steps: [
      "Je to číslovka? → zkontroluj i/í/y a délku (tisíc, milion).",
      "Je to přejaté slovo? → české znění v testu (např. bez zbytečné anglické podoby).",
      "Nejsi si jistý? → vyber tvar, který znáš z učebnice / spisovného textu.",
    ],
    trap: "Preferovaný tvar je milion (ne milión jako jediná správná varianta v testech). tisíc s í.",
    examples: [
      "tisíc, milion",
      "Vyhrál milion korun. (spisovně)",
    ],
    practice: [
      { prompt: "t_sic korun", answer: "tisíc" },
      { prompt: "vyhrál mil_on", answer: "milion" },
    ],
  },
];

const SKLADBA_CHEATSHEET = [
  {
    title: "1. Podmět a přísudek",
    rule: [
      "Podmět = o kom/o čem věta je (kdo? co?). Přísudek = co podmět dělá / jaký je. Bez přísudku věta není.",
    ],
    steps: [
      "Zeptej se: Kdo? Co? → podmět.",
      "Zeptej se: Co dělá? Jaký je? → přísudek.",
      "Hledej sloveso — přísudek je skoro vždy kolem něj.",
    ],
    trap: "Podmět může chybět (Prší.) — přísudek ale musí být. Nespleť si předmět (koho/co?) s podmětem.",
    examples: [
      "Pes štěká. → podmět Pes, přísudek štěká",
      "Prší. → jen přísudek",
      "Být unavený. → přísudek jmenný se sponou",
    ],
    practice: [
      { prompt: "Kočka spí. — podmět?", answer: "Kočka" },
      { prompt: "Prší. — je tu podmět?", answer: "Ne (jen přísudek)" },
      { prompt: "Děti si hrají. — přísudek?", answer: "si hrají" },
    ],
  },
  {
    title: "2. Předmět, přívlastek, příslovečné určení",
    rule: [
      "Předmět = koho/co? komu/čemu? … (rozvíjí sloveso). Přívlastek = jaký? čí? který? (u podstatného). Příslovečné určení = kde? kdy? jak? proč?",
    ],
    steps: [
      "Rozvíjí sloveso pádem? → předmět.",
      "Stojí u podstatného a říká jaký/čí/který? → přívlastek.",
      "Odpovídá na kde/kdy/jak/proč? → příslovečné určení.",
    ],
    trap: "„pěkný dům“ = přívlastek, ne předmět. Předmět hledej u slovesa (Vidím dům.).",
    examples: [
      "Vidím psa. → předmět psa",
      "velký dům → přívlastek velký",
      "běží rychle / doma / ráno → příslovečné určení",
    ],
    practice: [
      { prompt: "Čtu knihu. — předmět?", answer: "knihu" },
      { prompt: "starý most — přívlastek?", answer: "starý" },
      { prompt: "Šel včera. — příslovečné určení?", answer: "včera" },
    ],
  },
  {
    title: "3. Doplněk",
    rule: [
      "Doplněk rozvíjí zároveň podmět (nebo předmět) i přísudek — odpovídá na jaký? v jakém stavu? často po stát se, zdát se, cítit se, jmenovat…",
    ],
    steps: [
      "Je ve větě sloveso typu stát se / zdát se / cítit se / zvolit…?",
      "Říká tvar něco o stavu podmětu i o ději? → doplněk.",
      "Ověř: bez doplňku věta zní neúplně nebo mění smysl.",
    ],
    trap: "Nespleť doplněk s přívlastkem: přívlastek patří jen k podstatnému (mladý muž), doplněk k podmětu + slovesu (Muž přišel unavený.).",
    examples: [
      "Cítil se unavený. → doplněk unavený",
      "Zvolili ho předsedou. → doplněk předsedou",
      "Vrátil se nemocný. → doplněk nemocný",
    ],
    practice: [
      { prompt: "Stal se učitelem. — doplněk?", answer: "učitelem" },
      { prompt: "Zdál se spokojený. — doplněk?", answer: "spokojený" },
    ],
  },
  {
    title: "4. Věta jednoduchá × souvětí",
    rule: [
      "Jednoduchá věta = jeden přísudek. Souvětí = dva a více přísudků (více větných celků).",
    ],
    steps: [
      "Najdi všechna slovesa v určitém tvaru (přísudky).",
      "Jeden přísudek → věta jednoduchá.",
      "Dva a více → souvětí.",
    ],
    trap: "Infinitiv (číst, jít) sám o sobě není přísudek věty. Počítej jen určité tvary (čte, šel, bude…).",
    examples: [
      "Pes štěká. → jednoduchá",
      "Pes štěká a kočka mňouká. → souvětí",
      "Když prší, zůstanu doma. → souvětí",
    ],
    practice: [
      { prompt: "Svítí slunce. — jednoduchá/souvětí?", answer: "jednoduchá" },
      { prompt: "Když přijdu, zavolám. — ?", answer: "souvětí" },
    ],
  },
  {
    title: "5. Souvětí souřadné × podřadné",
    rule: [
      "Souřadné = věty „vedle sebe“ (a, ale, nebo, proto…). Podřadné = jedna věta řídí druhou (že, když, protože, aby, který…).",
    ],
    steps: [
      "Jsou věty rovnocenné (můžeš dát tečku a oddělit)? → souřadné.",
      "Závisí jedna na druhé (bez řídící nedává smysl)? → podřadné.",
      "Podívej se na spojku: a/ale/nebo × že/když/protože/aby/který.",
    ],
    trap: "„a“ = typicky souřadné. „že / když / protože / aby“ = podřadné. Nespleť si je.",
    examples: [
      "Četl a psal. → souřadné",
      "Řekl, že přijde. → podřadné",
      "Když prší, sedím doma. → podřadné",
    ],
    practice: [
      { prompt: "Šel jsem, ale zůstal doma. — typ?", answer: "souřadné" },
      { prompt: "Vím, že lže. — typ?", answer: "podřadné" },
    ],
  },
  {
    title: "6. Vedlejší věty (základní typy)",
    rule: [
      "Vedlejší věta nahrazuje větný člen: podmětná, předmětná, přívlastková, příslovečná (čas, příčina, účel, podmínka…), doplňková.",
    ],
    steps: [
      "Najdi řídící větu a vedlejší (často za čárkou + spojka/vztažné).",
      "Zeptej se na vedlejší: kdo/co? koho/co? jaký? kdy/proč/za jakým účelem?",
      "Podle otázky urči typ.",
    ],
    trap: "Přivlastková často začíná který/jenž a stojí u podstatného. Předmětná odpovídá na koho/co? po slovese.",
    examples: [
      "Chlapec, který přišel, je můj bratr. → přívlastková",
      "Řekl, že přijde. → předmětná",
      "Zůstal doma, protože pršelo. → příslovečná (příčina)",
    ],
    practice: [
      { prompt: "Kniha, kterou čtu, je nová. — typ?", answer: "přívlastková" },
      { prompt: "Ptám se, kdy přijdeš. — typ?", answer: "předmětná" },
    ],
  },
  {
    title: "7. Holá × rozvitá věta; základ větný",
    rule: [
      "Holá = jen podmět + přísudek (nebo samotný přísudek). Rozvitá = má ještě další větné členy. Základ větný = podmět + přísudek.",
    ],
    steps: [
      "Najdi podmět a přísudek (= základ).",
      "Je ve větě ještě předmět / přívlastek / příslovečné…? → rozvitá.",
      "Jen základ (případně bez podmětu)? → holá.",
    ],
    trap: "„Pes štěká.“ je holá. „Malý pes štěká nahlas.“ je rozvitá — i když je krátká.",
    examples: [
      "Ptáci létají. → holá",
      "Malí ptáci létají vysoko. → rozvitá",
      "Prší. → holá (základ = přísudek)",
    ],
    practice: [
      { prompt: "Děti spí. — holá/rozvitá?", answer: "holá" },
      { prompt: "Unavené děti spí doma. — ?", answer: "rozvitá" },
    ],
  },
  {
    title: "8. Čárky ve větě a souvětí",
    rule: [
      "Čárkou oddělujeme věty v souvětí, oslovení, vsuvku a výčet. Před a/i/ani/nebo čárka obvykle není, pokud nejde o odporovací vztah nebo vsuvku.",
    ],
    steps: [
      "Oslovení / vsuvka? → odděl čárkami.",
      "Souvětí (více přísudků)? → často čárka mezi větami.",
      "Výčet? → čárky mezi položkami; před a obvykle ne.",
    ],
    trap: "Vsuvku odděl z obou stran. U oslovení nezapomeň čárku. Nepřidávej čárku před a ve výčtu bez důvodu.",
    examples: [
      "Petře, pojď sem.",
      "Praha, Brno a Ostrava",
      "To je, myslím, dobrý nápad.",
    ],
    practice: [
      { prompt: "Ahoj Petře pojď dál.", answer: "Ahoj, Petře, pojď dál." },
      { prompt: "Když prší zůstanu doma.", answer: "Když prší, zůstanu doma." },
    ],
  },
];

const TVAROSLOVI_CHEATSHEET = [
  {
    title: "1. Slovní druhy — přehled",
    rule: [
      "10 slovních druhů: podstatné, přídavné, zájmeno, číslovka, sloveso, příslovce, předložka, spojka, částice, citoslovce. První 5 se ohýbá (skloňuje/časuje), zbylé obvykle ne.",
    ],
    steps: [
      "Má slovo pád / osobu / čas? → ohebný druh.",
      "Určuje vztah, spojuje, cití, nebo „jen stojí“? → neohebný.",
      "Nejsi si jistý? → zkus otázku: kdo/co? jaký? který? kolik? co dělá? jak/kde/kdy?",
    ],
    groups: [
      { label: "Ohebné", items: "podstatné, přídavné, zájmena, číslovky, slovesa" },
      { label: "Neohebné", items: "příslovce, předložky, spojky, částice, citoslovce" },
    ],
    trap: "pěkně = příslovce (jak?), pěkný = přídavné (jaký?). stejný kořen ≠ stejný druh.",
    examples: [
      "dům (podst.) · hezký (příd.) · on (zájm.) · tři (čísl.) · běžet (sloveso)",
      "rychle (přísl.) · v / na (předl.) · a / že (spoj.) · kéž (část.) · au (citosl.)",
    ],
    practice: [
      { prompt: "rychle — slovní druh?", answer: "příslovce" },
      { prompt: "který — slovní druh?", answer: "zájmeno" },
      { prompt: "a — slovní druh?", answer: "spojka" },
    ],
  },
  {
    title: "2. Podstatná jména — mluvnické kategorie",
    rule: [
      "U podstatného určuj: pád, číslo, rod (mužský životný/neživotný, ženský, střední), vzor.",
    ],
    steps: [
      "Zeptej se pádem (kdo/co? koho/čeho? …).",
      "Jednotné / množné?",
      "Rod + vzor (pán, hrad, muž, stroj, žena, růže, píseň, kost, město, moře, kuře, stavení…).",
    ],
    trap: "děvče, kotě = střední rod (vzory kuře). rodiče = mužský životný.",
    examples: [
      "pes — 1. p., j. č., m. živ., vzor pán",
      "města — 1./4. p., mn. č., střední, vzor město",
    ],
    practice: [
      { prompt: "koťata — rod?", answer: "střední" },
      { prompt: "ženy — rod?", answer: "ženský" },
    ],
  },
  {
    title: "3. Pády — otázky",
    rule: [
      "1 kdo/co · 2 koho/čeho · 3 komu/čemu · 4 koho/co · 5 oslovujeme · 6 (o) kom/(o) čem · 7 kým/čím.",
    ],
    steps: [
      "Najdi předložku (pomáhá určit pád).",
      "Polož pádovou otázku ke jménu.",
      "Ověř shodu s přídavným / zájmenem u jména.",
    ],
    trap: "4. pád koho/co ≠ 2. pád koho/čeho. U neživotných je 1. a 4. často stejný tvar (hrad).",
    examples: [
      "bez domu → 2. pád",
      "k domu → 3. pád",
      "o domě → 6. pád",
      "s domem → 7. pád",
    ],
    practice: [
      { prompt: "z školy — pád?", answer: "2. pád" },
      { prompt: "s kamarádem — pád?", answer: "7. pád" },
      { prompt: "vidím školu — pád?", answer: "4. pád" },
    ],
  },
  {
    title: "4. Přídavná jména",
    rule: [
      "Shodují se s podstatným v rodě, čísle a pádě. Stupňují se: 1. základ, 2. -ejší/-ější/-ší, 3. nej- + 2. stupeň.",
    ],
    steps: [
      "Urči rod/číslo/pád podstatného → stejné u přídavného.",
      "Je to tvrdé (mladý), měkké (jarní) nebo přivlastňovací (otcův, matčin)?",
      "Stupňování: hezký → hezčí → nejhezčí.",
    ],
    trap: "dobrý → lepší → nejlepší (ne „dobřejší“). velký → větší → největší.",
    examples: [
      "mladý muž · jarní den · otcův dům",
      "hezčí, chytřejší, moudřejší",
    ],
    practice: [
      { prompt: "dobrý → 2. stupeň?", answer: "lepší" },
      { prompt: "mlad_ dívky (1. p. mn.)", answer: "mladé" },
    ],
  },
  {
    title: "5. Zájmena",
    rule: [
      "Zastupují podstatná/přídavná: osobní (já, ty…), přivlastňovací (můj…), ukazovací (ten…), tázací (kdo, co, jaký…), vztažná (který, jenž…), neurčitá (někdo…), záporná (nikdo…).",
    ],
    steps: [
      "Zastupuje osobu? → osobní / přivlastňovací.",
      "Ptá se / odkazuje ve větě? → tázací / vztažné.",
      "Neurčitost / zápor? → někdo / nikdo…",
    ],
    trap: "mě / mně jen u já (viz Pravopis). který ≠ jaký (výběr × vlastnost).",
    examples: [
      "já, ty, on · můj, tvůj · ten, tato",
      "kdo, co, jaký · který, jenž · někdo, nikdo",
    ],
    practice: [
      { prompt: "někdo — typ zájmena?", answer: "neurčité" },
      { prompt: "který přišel — typ?", answer: "vztažné" },
    ],
  },
  {
    title: "6. Číslovky",
    rule: [
      "Základní (kolik? jedna, pět), řadové (kolikátý? první), druhové (kolikerý?), násobné (kolikrát? dvakrát).",
    ],
    steps: [
      "Otázka kolik? → základní.",
      "Kolikátý? → řadová.",
      "Kolikrát / kolikerý? → násobná / druhová.",
    ],
    trap: "třetí = řadová, tři = základní. „dvakrát“ je násobná, ne základní.",
    examples: [
      "pět jablek · první místo · dvojí měřítko · třikrát",
    ],
    practice: [
      { prompt: "sedmý — typ?", answer: "řadová" },
      { prompt: "dvakrát — typ?", answer: "násobná" },
    ],
  },
  {
    title: "7. Slovesa — osoba, číslo, čas, způsob",
    rule: [
      "U slovesa určuj: osobu, číslo, čas (přítomný/minulý/budoucí), způsob (oznamovací/rozkazovací/podmiňovací), někdy vid (dokonavý/nedokonavý).",
    ],
    steps: [
      "Kdo dělá? (1./2./3. os.) a j. č. / mn. č.",
      "Kdy? teď / dříve / později.",
      "Oznamuje / rozkazuje / podmínka (by)?",
    ],
    trap: "Podmiňovací = bych, bys, by… Rozkaz = Čti! Počitej i zvratné si/se jako součást tvaru.",
    examples: [
      "píšu · psal jsem · budu psát",
      "piš! · psal bych",
    ],
    practice: [
      { prompt: "šel bych — způsob?", answer: "podmiňovací" },
      { prompt: "Pojď! — způsob?", answer: "rozkazovací" },
    ],
  },
  {
    title: "8. Příslovce, předložky, spojky",
    rule: [
      "Příslovce = jak/kde/kdy/proč u slovesa. Předložka = u jména a pojí se s pádem. Spojka = spojuje věty/slova.",
    ],
    steps: [
      "Stojí u slovesa a odpovídá jak/kde/kdy? → příslovce.",
      "Stojí před jménem a řídí pád? → předložka.",
      "Spojuje části souvětí nebo výčtu? → spojka.",
    ],
    trap: "v / na / do = předložky (ne příslovce). rychle = příslovce. že / protože / a = spojky.",
    examples: [
      "jde rychle · bydlí doma",
      "v domě · na stole · do školy",
      "a, ale, že, protože, aby",
    ],
    practice: [
      { prompt: "nahlas — druh?", answer: "příslovce" },
      { prompt: "bez — druh?", answer: "předložka" },
      { prompt: "protože — druh?", answer: "spojka" },
    ],
  },
  {
    title: "9. Částice a citoslovce",
    rule: [
      "Částice dodávají postoj (kéž, ať, jistě, prý…). Citoslovce vyjadřují zvuk/cit (au, fui, haf…). Obvykle se neohýbají.",
    ],
    steps: [
      "Dá se věta bez toho slova říct stejně věcně, jen bez „postoje“? → částice.",
      "Napodobuje zvuk / citový výkřik? → citoslovce.",
      "Není to předložka/spojka/příslovce? ověř otázkami výše.",
    ],
    trap: "prý, kéž, ať = částice. „au“ není sloveso.",
    examples: [
      "Kéž by přišel. · To je prý pravda.",
      "Au! · Haf! · Fuj!",
    ],
    practice: [
      { prompt: "kéž — druh?", answer: "částice" },
      { prompt: "fui — druh?", answer: "citoslovce" },
    ],
  },
];

const SLOVNI_ZASOBA_CHEATSHEET = [
  {
    title: "1. Synonyma a antonyma",
    rule: [
      "Synonyma = podobný význam (rychlý ≈ bystrý). Antonyma = opačný význam (rychlý × pomalý).",
    ],
    steps: [
      "Hledáš stejný/podobný smysl? → synonymum.",
      "Hledáš opak? → antonymum.",
      "Ověř kontext — ne každé „podobné“ slovo sedí v každé větě.",
    ],
    trap: "Velký ≈ obrovský (syn.), ale ne vždy zaměnitelné (velký bratr ≠ obrovský bratr).",
    examples: [
      "hezký ≈ pěkný · chytrý ≈ bystrý",
      "den × noc · začít × skončit",
    ],
    practice: [
      { prompt: "antonymum k „mladý“?", answer: "starý" },
      { prompt: "synonymum k „odvážný“?", answer: "statečný (např.)" },
    ],
  },
  {
    title: "2. Homonyma",
    rule: [
      "Homonyma = stejné znění/zápis, jiný význam (kohoutek = pták / vodovod).",
    ],
    steps: [
      "Má slovo v textu víc možných významů?",
      "Vyber význam podle okolních slov.",
      "V testu často máš ukázat, že poznáš oba významy.",
    ],
    trap: "Nespleť s homofony (stejná výslovnost, jiný zápis: mít × mýt) — to je spíš pravopis.",
    examples: [
      "kohoutek · zámek · stát (stát / stát se)",
      "kolej (vlak) × kolej (na kolejišti významy podle kontextu)",
    ],
    practice: [
      { prompt: "zámek — uveď 2 významy", answer: "budova × mechanismus na dveřích" },
    ],
  },
  {
    title: "3. Jednoznačná × mnohoznačná slova",
    rule: [
      "Jednoznačná mají jeden význam. Mnohoznačná mají více souvisejících významů (hlava = část těla / vedoucí).",
    ],
    steps: [
      "Jde význam „rozvětvit“ do více smyslů?",
      "Ano → mnohoznačné. Ne → jednoznačné.",
      "Význam vždy čti z kontextu věty.",
    ],
    trap: "Mnohoznačnost ≠ homonymie: u mnohoznačných jsou významy příbuzné, u homonym často náhodně stejný tvar.",
    examples: [
      "list (stromu / papíru) · jazyk (orgán / řeč)",
      "křemík (spíš jednoznačné odborné)",
    ],
    practice: [
      { prompt: "oko — jednoznačné/mnohoznačné?", answer: "mnohoznačné" },
    ],
  },
  {
    title: "4. Sousloví a rčení",
    rule: [
      "Sousloví = ustálené spojení (černé zlato). Rčení/pořekadlo nese obrazný význam (mít máslo na hlavě).",
    ],
    steps: [
      "Jde o ustálené spojení se zvláštním významem?",
      "Nelze překládat doslova → hledaj obrazný smysl.",
      "V testu často vysvětli význam vlastními slovy.",
    ],
    trap: "Nepřekládej rčení doslova. „Spadnout na hlavu“ ≠ fyzický pád, pokud je to rčení v kontextu.",
    examples: [
      "černé zlato · železnice",
      "mít máslo na hlavě · tlouct špačky",
    ],
    practice: [
      { prompt: "„mít máslo na hlavě“ znamená…", answer: "mít špatné svědomí / být vinen" },
    ],
  },
  {
    title: "5. Odborné názvy a pojmenování",
    rule: [
      "Odborný název = přesné pojmenování z oboru. Od běžného slova ho poznáš podle přesnosti a kontextu textu.",
    ],
    steps: [
      "Je text naučný / z oboru?",
      "Je slovo použité v přesném významu?",
      "Ano → odborný název; ne → běžné slovo.",
    ],
    trap: "Stejné slovo může být běžné i odborné podle textu (kořen v botanice × „kořen problému“).",
    examples: [
      "fotosyntéza · trojúhelník · podmět",
      "voda (běžně) × H₂O v chemickém kontextu",
    ],
    practice: [
      { prompt: "podmět v ČJ textu — odborný název?", answer: "ano" },
    ],
  },
  {
    title: "6. Tvoření slov",
    rule: [
      "Odvozování (předpona/přípona), skládání (zeměkoule), zkracování (ČR, MHD). Urči základ (kořen) a slovotvorný prostředek.",
    ],
    steps: [
      "Najdi kořen / základové slovo.",
      "Je tam předpona/přípona, nebo dvě části složeniny?",
      "Je to zkratka / zkratkové slovo?",
    ],
    trap: "učitel ← učit (odvození). zeměkoule = složenina. Nespleť odvození se skládáním.",
    examples: [
      "les → lesník → prales",
      "vodovod · zeměpis",
      "ČR · auto (z automobil)",
    ],
    practice: [
      { prompt: "učitel — odvozené/složené?", answer: "odvozené" },
      { prompt: "zeměkoule — ?", answer: "složené" },
    ],
  },
  {
    title: "7. Spisovnost a vhodnost slov",
    rule: [
      "V testu preferuj spisovné tvary. Nespisovné/hovorové (kámoš, dyt…) do odpovědi nepatří, pokud text nevyžaduje rozpoznat styl.",
    ],
    steps: [
      "Je tvar z učebnice / spisovného textu?",
      "Zní hovorově nebo slangově? → spíš špatně v „správné odpovědi“.",
      "U stylu textu poznej, jestli je spisovný, hovorový, nebo nářeční.",
    ],
    trap: "„Kámoš“ poznáš jako nespisovné. V doplňovačkách piš spisovně.",
    examples: [
      "přítel (spis.) × kámoš (nespis.)",
      "číst (spis.) × číst si to „vole“ (nespis. kontext)",
    ],
    practice: [
      { prompt: "kámoš — spisovně?", answer: "ne (spíš kamarád / přítel)" },
    ],
  },
];

const LITERARNI_TEORIE_CHEATSHEET = [
  {
    title: "1. Poezie × próza × drama",
    rule: [
      "Poezie = verše, rytmus, často strofy. Próza = souvislý text bez veršů. Drama = text pro divadlo (dialogy, scény, didaskálie).",
    ],
    steps: [
      "Jsou tam verše / sloky? → poezie.",
      "Je to psané jako hra (postavy, scény)? → drama.",
      "Jinak obvykle próza.",
    ],
    trap: "Báseň v próze je výjimka — u JPZ stačí základní rozpoznání. Drama ≠ „dramatický příběh“ v próze.",
    examples: [
      "báseň, říkanka → poezie",
      "povídka, román → próza",
      "činohra, dialogy postav → drama",
    ],
    practice: [
      { prompt: "text ve verších — druh?", answer: "poezie" },
      { prompt: "román — druh?", answer: "próza" },
    ],
  },
  {
    title: "2. Vypravěč a vyprávěcí způsob",
    rule: [
      "Ich-forma = vypravěč „já“. Er-forma = vypravěč „on/ona“. Pozoruj, kdo mluví a co ví.",
    ],
    steps: [
      "Hledej já / my × on / ona / oni.",
      "Je vypravěč postava příběhu, nebo stojí „venku“?",
      "Urči ich × er.",
    ],
    trap: "Dialog v uvozovkách není automaticky ich-forma celého textu — rozhoduje vypravěč mimo přímou řeč.",
    examples: [
      "Šel jsem do lesa. → ich-forma",
      "Petr šel do lesa. → er-forma",
    ],
    practice: [
      { prompt: "„Bála jsem se tmy.“ — forma?", answer: "ich-forma" },
    ],
  },
  {
    title: "3. Postavy a prostředí",
    rule: [
      "Hlavní postava = střed děje. Vedlejší = doplňují. Prostředí = kde/kdy se děj odehrává (místo, čas, atmosféra).",
    ],
    steps: [
      "O kom text mluví nejvíc? → hlavní postava.",
      "Kdo vstupuje jen občas? → vedlejší.",
      "Kde a kdy se to děje? → prostředí.",
    ],
    trap: "Nezaměňuj vypravěče s hlavní postavou (nemusí to být totéž).",
    examples: [
      "hlavní hrdina × epizodní postava",
      "město v noci / vesnice v létě → prostředí",
    ],
    practice: [
      { prompt: "Text je hlavně o Aničce — Anička je…", answer: "hlavní postava" },
    ],
  },
  {
    title: "4. Téma, motiv, hlavní myšlenka",
    rule: [
      "Téma = o čem text je. Motiv = opakovaný / výrazný prvek. Hlavní myšlenka = co text říká / chce sdělit.",
    ],
    steps: [
      "Shrň jednou větou: o čem to je? → téma.",
      "Co se v textu vrací / je nápadné? → motiv.",
      "Co z toho plyne / co autor sděluje? → hlavní myšlenka.",
    ],
    trap: "Téma ≠ název. Hlavní myšlenka není jen obsah děje, ale smysl / poselství.",
    examples: [
      "téma: přátelství · motiv: cesta · myšlenka: přátelství pomáhá v nouzi",
    ],
    practice: [
      { prompt: "Text o lži a důvěře — téma spíš…", answer: "pravda / důvěra / lež" },
    ],
  },
  {
    title: "5. Kompozice děje",
    rule: [
      "Často: úvod → zápletka → vyvrcholení → rozuzlení. Poznáš, kde děj nabírá konflikt a kde se uzavírá.",
    ],
    steps: [
      "Kde se představí situace/postavy? → úvod.",
      "Kde vzniká problém? → zápletka.",
      "Kde je největší napětí a jak to dopadne? → vyvrcholení + rozuzlení.",
    ],
    trap: "Ne každý text má všechny části stejně jasně — hledej logiku děje, ne šablonu za každou cenu.",
    examples: [
      "úvod: klidná situace → konflikt → vrchol → řešení",
    ],
    practice: [
      { prompt: "Konflikt začíná — která část?", answer: "zápletka" },
    ],
  },
  {
    title: "6. Jazykové prostředky (obraznost)",
    rule: [
      "Metafora = pojmenování na základě podobnosti. Přirovnání = jako / jak. Personifikace = lidské vlastnosti neživému. Epiteton = výstižný přívlastek.",
    ],
    steps: [
      "Je tam „jako/jak“? → přirovnání.",
      "Je něco nazváno jinak bez „jako“? → metafora.",
      "Chová se věc jako člověk? → personifikace.",
    ],
    trap: "„Rychlý jako vítr“ = přirovnání. „Moře ohně“ = metafora. Nespleť je.",
    examples: [
      "oči jako uhlíky → přirovnání",
      "zlaté srdce → metafora",
      "vítr šeptá → personifikace",
    ],
    practice: [
      { prompt: "„čas utíká“ — prostředek?", answer: "personifikace (čas jako člověk)" },
      { prompt: "„silný jako medvěd“ — ?", answer: "přirovnání" },
    ],
  },
  {
    title: "7. Verš, rým, strofa",
    rule: [
      "Verš = jeden řádek básně. Strofa = skupina veršů. Rým = zvuková shoda na konci veršů (AABB, ABAB…).",
    ],
    steps: [
      "Spočítej řádky = verše.",
      "Jak jsou seskupené? → strofy.",
      "Jak se rýmují konce? → schéma rýmu.",
    ],
    trap: "Ne každý verš se musí rýmovat (volný verš). Strofa ≠ věta.",
    examples: [
      "AABB = sdružený · ABAB = střídavý",
      "4 verše v jednom oddílu = strofa",
    ],
    practice: [
      { prompt: "rým aabb — typ?", answer: "sdružený" },
    ],
  },
  {
    title: "8. Literární žánry (základ)",
    rule: [
      "Pohádka, bajka, pověst, povídka, román, báseň, báje… Rozliš podle znaků: zvířata s poučením = bajka; vysvětlení vzniku = pověst/báje; magie + dobro/zlo = pohádka.",
    ],
    steps: [
      "Jsou postavy zvířata a je na konci poučení? → bajka.",
      "Vysvětluje vznik místa/jména? → pověst.",
      "Kouzla, typické obraty (bylo nebylo)? → pohádka.",
    ],
    trap: "Pověst ≠ pohádka: pověst se váže k místu/historii, pohádka je neskutečný příběh s kouzly.",
    examples: [
      "bajka: liška a vrána + poučení",
      "pověst: o vzniku hradu",
      "pohádka: bylo nebylo, drak, princ",
    ],
    practice: [
      { prompt: "Zvířata + poučení — žánr?", answer: "bajka" },
      { prompt: "Bylo nebylo + kouzla — žánr?", answer: "pohádka" },
    ],
  },
];

const POROZUMENI_TEXTU_CHEATSHEET = [
  {
    title: "1. Nejdřív text, potom otázky",
    rule: [
      "Nejdřív pochop celek textu, teprve pak řeš otázky. Odpověď musí sedět s textem — ne s tím, „co si myslíš obecně“.",
    ],
    steps: [
      "Přečti text jednou v klidu.",
      "Řekni si: o čem to je? (1 věta)",
      "Teprve pak čti otázky a vrať se k místu v textu.",
    ],
    trap: "Neodpovídej podle dojmu nebo znalostí mimo text. Platí jen to, co je v zadání.",
    examples: [
      "Text říká A, ty „víš“, že B → správně je A",
      "Nejdřív celek, pak detail v odstavci",
    ],
    practice: [
      { prompt: "Kde hledat odpověď?", answer: "v textu (ne mimo něj)" },
    ],
  },
  {
    title: "2. Hlavní myšlenka × detail",
    rule: [
      "Hlavní myšlenka = smysl celku. Detail = konkrétní údaj v jedné větě/odstavci. Otázka napoví, co chce.",
    ],
    steps: [
      "Ptá se na celek / „hlavně o čem“? → hlavní myšlenka.",
      "Ptá se na konkrétní fakt (kdo, kdy, kolik)? → detail.",
      "Najdi odstavec, kde to je napsané.",
    ],
    trap: "Detail z jedné věty není hlavní myšlenka. Hlavní myšlenka není výčet všech detailů.",
    examples: [
      "hlavní myšlenka: shrnutí celku",
      "detail: „V textu je uvedeno, že…“",
    ],
    practice: [
      { prompt: "„O čem text převážně je?“ — typ otázky?", answer: "hlavní myšlenka" },
    ],
  },
  {
    title: "3. Klíčová slova v otázce",
    rule: [
      "V otázce si podtrhni pojmy, jména, čísla, zápor (ne, kromě). Pak je najdi v textu.",
    ],
    steps: [
      "Označ klíčová slova otázky.",
      "Najdi stejná / synonymní místa v textu.",
      "Porovnej, jestli odpověď přesně sedí (pozor na zápor a výjimky).",
    ],
    trap: "Slovo „ne“ / „kromě“ / „vždy“ mění správnou odpověď. Čti celou otázku.",
    examples: [
      "otázka: „Proč…“ → hledej příčinu",
      "otázka: „Která informace NENÍ…“ → vylučuj podle textu",
    ],
    practice: [
      { prompt: "Otázka s „není uvedeno“ — co dělat?", answer: "ověřit každou možnost v textu" },
    ],
  },
  {
    title: "4. Domněnka × informace z textu",
    rule: [
      "Správná odpověď musí být přímo v textu nebo z něj bezpečně plyne. Domněnka bez opory je špatně.",
    ],
    steps: [
      "Ukážu prstem na větu, která to dokazuje?",
      "Ano → OK. Ne → spíš domněnka.",
      "U „proč/jak“ musí důvod v textu opravdu být.",
    ],
    trap: "„Asi to tak bude“ nestačí. Když text mlčí, neviduj.",
    examples: [
      "Text: „Petr zůstal doma, protože stonal.“ → důvod = stonal",
      "Text důvod neuvádí → nehádáme",
    ],
    practice: [
      { prompt: "Nemáš větu na důkaz — odpověď je…", answer: "nejistá / špatně podložená" },
    ],
  },
  {
    title: "5. Časová osa a vztahy",
    rule: [
      "Sleduj pořadí dějů (dříve/později) a vztahy (příčina → následek, důvod, podmínka).",
    ],
    steps: [
      "Označ časové signály (pak, potom, předtím, druhý den…).",
      "Spoj příčinu a následek, pokud se na ně ptají.",
      "Seřaď události, když to úloha chce.",
    ],
    trap: "Pořadí v textu nemusí být pořadí v čase — čti časové výrazy, ne jen odstavce shora.",
    examples: [
      "Nejdřív A, potom B → B není dřív než A",
      "„proto / protože“ → vztah příčiny",
    ],
    practice: [
      { prompt: "„protože“ signalizuje…", answer: "příčinu" },
    ],
  },
  {
    title: "6. Rychlá kontrola před odevzdáním",
    rule: [
      "Než zavřeš úlohu: sedí odpověď s textem? Nepletl jsi zápor? Nevybral jsi „chyták“ mimo zadání?",
    ],
    steps: [
      "Vrať se k větě v textu a porovnej.",
      "Zkontroluj zápor a výjimky v otázce.",
      "U jistoty 50/50 nech označeno, ale ověř obě možnosti.",
    ],
    trap: "Poslední chvíle často pokazí přepsání / špatné políčko — zkontroluj i to.",
    examples: [
      "odpověď vs. text = shoda",
      "otázka „není“ × odpověď „je“ → chyba",
    ],
    practice: [
      { prompt: "Poslední krok před odevzdáním?", answer: "porovnat odpověď s textem" },
    ],
  },
];

const CHEAT_SHEETS = {
  Pravopis: PRAVOPIS_CHEATSHEET,
  Skladba: SKLADBA_CHEATSHEET,
  Tvarosloví: TVAROSLOVI_CHEATSHEET,
  "Slovní zásoba": SLOVNI_ZASOBA_CHEATSHEET,
  "Literární teorie": LITERARNI_TEORIE_CHEATSHEET,
  "Porozumění textu": POROZUMENI_TEXTU_CHEATSHEET,
};

export { CHEAT_SHEETS };
