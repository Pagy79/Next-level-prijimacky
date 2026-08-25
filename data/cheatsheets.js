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
    title: "1. Základní větné členy",
    rule: [
      "Podmět (1. pád, otázka kdo? co?) může být vyjádřený (přímo uvedeným slovem), nevyjádřený (rozpoznatelný jen z koncovky slovesa nebo z kontextu) nebo všeobecný (nelze určit konkrétní osobu, rozumí se jím lidé/někdo obecně).",
      "Přísudek slovesný je tvořen samotným plnovýznamovým slovesem a odpovídá na otázku co dělá/dělal podmět?",
      "Přísudek jmenný se sponou je tvořen sponovým slovesem (být, bývat, stát se) a jmennou částí (podstatné nebo přídavné jméno), která nese hlavní význam.",
    ],
    trap:
      "Nevyjádřený podmět se snadno přehlédne – věta bez viditelného podmětu ho většinou stále MÁ, jen není vyjádřen slovem. Všeobecný podmět naopak vypadá, jako by šlo o větu bez podmětu vůbec – pozor na rozdíl mezi nimi.",
    examples: [
      "Čte knihu. (podmět nevyjádřený: on – poznáš z koncovky slovesa)",
      "Ve zprávách hlásili bouřku. (podmět všeobecný – nelze určit konkrétní osobu)",
      "Bratr je učitel. (přísudek jmenný se sponou: je učitel)",
      "Pes štěká. (přísudek slovesný: štěká)",
    ],
  },
  {
    title: "2. Rozvíjející větné členy",
    rule: [
      "Předmět rozvíjí přísudek (sloveso) a odpovídá na pádové otázky kromě 1. pádu: koho, čeho? komu, čemu? koho, co? o kom, o čem? kým, čím?",
      "Příslovečné určení rozvíjí přísudek a vyjadřuje okolnost děje – místo (kde? kam?), čas (kdy?), způsob (jak?), příčinu (proč?) a další.",
      "Přívlastek rozvíjí podstatné jméno. Shodný přívlastek se s ním shoduje v rodě, čísle a pádě (obvykle přídavné jméno). Neshodný přívlastek se neshoduje a bývá vyjádřen podstatným jménem v jiném pádě, často s předložkou.",
      "Doplněk se váže současně na podmět (nebo předmět) i na přísudek a vyjadřuje stav nebo vlastnost, ve které se podmět (předmět) během děje nacházel.",
    ],
    trap:
      "Předmět a příslovečné určení se snadno zamění, protože oba rozvíjejí sloveso – rozhoduje typ otázky (pádová = předmět, okolnostní jako kde/kdy/jak/proč = příslovečné určení). Neshodný přívlastek se zase plete s předmětem, protože oba mohou mít podobu podstatného jména v jiném pádě – rozhoduje, jestli rozvíjí sloveso (předmět), nebo podstatné jméno (přívlastek).",
    examples: [
      "Četl knihu. (předmět: knihu – 4. pád, rozvíjí sloveso četl)",
      "Byl v Praze. (příslovečné určení místa: v Praze – rozvíjí sloveso byl)",
      "dům z cihel (neshodný přívlastek: z cihel – rozvíjí podstatné jméno dům)",
      "Vrátil se domů unavený. (doplněk: unavený – váže se na podmět i na sloveso zároveň)",
    ],
  },
  {
    title: "3. Věta jednoduchá vs. souvětí",
    rule: [
      "Věta jednoduchá obsahuje jen jednu základní skladební dvojici (jeden určitý slovesný tvar), i když může být hodně rozvitá dalšími větnými členy.",
      "Souvětí obsahuje dva nebo víc určitých slovesných tvarů, tedy dvě nebo víc vět spojených dohromady.",
      "Počet vět v souvětí zjistíš tak, že spočítáš všechny určité slovesné tvary (ne infinitivy, ne přechodníky) – kolik jich je, tolik vět souvětí má.",
    ],
    trap:
      "Dlouhá, hodně rozvitá věta jednoduchá může na první pohled působit jako souvětí. Vždy počítej určité slovesné tvary, ne délku věty.",
    examples: [
      "Chlapec rychle běžel do školy s těžkou taškou na zádech. (1 přísudek = věta jednoduchá, i když dlouhá)",
      "Když zazvonil budík, chlapec rychle vstal a oblékl se. (3 přísudky: zazvonil, vstal, oblékl se = souvětí o třech větách)",
    ],
  },
  {
    title: "4. Souvětí podřadné (druhy vedlejších vět)",
    rule: [
      "Podmětná věta zastupuje podmět věty řídící – ptáme se na ni stejně jako na podmět (kdo, co?).",
      "Předmětná věta zastupuje předmět – ptáme se na ni pádovými otázkami předmětu (koho, čeho? komu, čemu? apod.).",
      "Přívlastková věta zastupuje přívlastek – ptáme se jaký? který? čí?",
      "Příslovečné věty se dál dělí podle okolnosti: časová (kdy?), místní (kde/kam?), způsobová (jak?), příčinná (proč?), účelová (za jakým účelem?), podmínková (za jaké podmínky?), přípustková (navzdory čemu?).",
      "Doplňková věta zastupuje doplněk – vzácná, váže se na podmět/předmět i přísudek řídící věty zároveň.",
    ],
    trap:
      "Nejjistější způsob, jak druh vedlejší věty poznat, je nahradit ji jedním slovem nebo ukazovacím zájmenem a podívat se, jaký větný člen by na jejím místě stál a na jakou otázku odpovídá.",
    examples: [
      "Kdo se bojí, nesmí do lesa. (podmětná – kdo?)",
      "Řekl, že přijde. (předmětná – řekl co?)",
      "To je dům, ve kterém bydlím. (přívlastková – jaký dům?)",
      "Nepřišel, protože byl nemocný. (příslovečná příčinná – proč?)",
      "Přišel brzy, aby si zajistil místo. (příslovečná účelová – za jakým účelem?)",
    ],
  },
  {
    title: "5. Souvětí souřadné (poměry a spojky)",
    rule: [
      "Slučovací poměr: prosté spojení dějů vedle sebe nebo po sobě. Spojky: a, i, ani, nebo, také.",
      "Stupňovací poměr: druhý děj je závažnější než první. Spojky: nejen… ale i, ba dokonce.",
      "Odporovací poměr: děje si vzájemně odporují. Spojky: ale, avšak, však, nýbrž.",
      "Vylučovací poměr: platí jen jedna z uvedených možností. Spojky: nebo, anebo, buď – nebo.",
      "Příčinný (důvodový) poměr: druhá věta udává příčinu první. Spojky: neboť, vždyť.",
      "Důsledkový poměr: druhá věta je důsledkem první. Spojky: proto, tudíž, tedy.",
    ],
    trap:
      "Stejná spojka (nejčastěji „a“ nebo „nebo“) může podle kontextu vyjadřovat různý poměr – rozhoduje význam vět, ne jen samotná spojka.",
    examples: [
      "Umyl nádobí a uklidil pokoj. (slučovací)",
      "Nejen že zapomněl klíče, ale ještě i telefon. (stupňovací)",
      "Chtěl jet na kole, ale pršelo. (odporovací)",
      "Buď zůstaneš doma, nebo půjdeš s námi. (vylučovací)",
      "Zaspal, proto přišel pozdě. (důsledkový)",
    ],
  },
  {
    title: "6. Interpunkce (čárky ve větě a v souvětí)",
    rule: [
      "Čárka odděluje věty v souvětí – vždy na hranici mezi větou hlavní a vedlejší, a mezi větami hlavními, pokud jejich poměr není čistě slučovací.",
      "Před spojkami a, i, ani, nebo se čárka NEPÍŠE, pokud spojují větné členy nebo věty ve slučovacím poměru (prosté spojení, žádný protiklad ani důsledek).",
      "Před spojkami a, i, ani, nebo se čárka NAOPAK PÍŠE, pokud uvozují vedlejší větu, nebo pokud spojují věty s jiným než slučovacím poměrem, i když formálně použijeme spojku a.",
      "Spojky než a jak: čárka se píše, pokud uvozují celou vedlejší větu (se svým vlastním slovesem). Nepíše se u holého přirovnání bez vedlejší věty (jen srovnání dvou výrazů).",
      "Ve výčtu se čárky píší mezi jednotlivými členy, ale ne před posledním členem spojeným spojkou a.",
    ],
    trap:
      "Klasické záludné dvojice: „než“ a „jak“ jednou uvozují skutečnou vedlejší větu (čárka ano), podruhé jen holé přirovnání dvou slov (čárka ne). Spojka „a“ se zase někdy tváří jako čistě slučovací, i když ve skutečnosti navazuje jako důsledek (a proto, a tak) – tam se čárka obvykle píše.",
    examples: [
      "Koupil jablka, hrušky a banány. (výčet – čárka mezi členy, ne před poslední spojkou a)",
      "Je chytřejší, než jsem čekal. (skutečná vedlejší věta – čárka ANO) × Je chytřejší než já. (holé přirovnání – čárka NE)",
      "Udělal to, jak mu bylo řečeno. (vedlejší věta způsobová – čárka ANO) × Byl bílý jako sníh. (holé přirovnání – čárka NE)",
      "Zesílil vítr, a proto jsme se museli vrátit. (a + proto mění poměr na důsledkový – čárka se píše)",
    ],
  },
];

const TVAROSLOVI_CHEATSHEET = [
  {
    title: "1. Deset slovních druhů (ohebné vs. neohebné)",
    rule: [
      "Čeština rozlišuje 10 slovních druhů, rozdělených na ohebné (mění svůj tvar – skloňují se nebo časují) a neohebné (tvar nemění).",
      "Ohebné slovní druhy (5): 1. podstatná jména, 2. přídavná jména, 3. zájmena, 4. číslovky, 5. slovesa.",
      "Neohebné slovní druhy (5): 6. příslovce, 7. předložky, 8. spojky, 9. částice, 10. citoslovce.",
    ],
    trap:
      "Číslované pořadí 1–10 bývá u přijímaček důležité. Zapamatuj si dělení na ohebné/neohebné podle toho, jestli dané slovo mění tvar podle pádu, čísla, osoby apod.",
    examples: [
      "ohebné: dům (skloňuje se: domu, domě…), psát (časuje se: píšu, píšeš…)",
      "neohebné: rychle, nad, a, ano, au – tyto tvary se nikdy nemění",
    ],
  },
  {
    title: "2. Podstatná jména",
    rule: [
      "Mluvnické kategorie podstatných jmen: pád (1.–7.), číslo (jednotné/množné), rod (mužský životný/neživotný, ženský, střední) a vzor.",
      "Vzory mužského rodu: pán, hrad (neživotné), muž, stroj (neživotné), předseda, soudce (životné zakončená na -a/-e).",
      "Vzory ženského rodu: žena, růže, píseň, kost.",
      "Vzory středního rodu: město, moře, kuře, stavení.",
      "Vzor se určí podle zakončení a skloňování slova a pomáhá správně tvořit pádové koncovky.",
    ],
    trap:
      "Gramatický rod podstatného jména nemusí odpovídat očekávání podle významu – slova na -ata (děvčata, koťata) jsou rodu STŘEDNÍHO, přestože označují živé bytosti, a slovo předseda je přes koncovku -a rodu mužského.",
    examples: [
      "pán – hrad – muž – stroj – předseda – soudce (vzory mužského rodu)",
      "žena – růže – píseň – kost (vzory ženského rodu)",
      "město – moře – kuře – stavení (vzory středního rodu)",
      "děvčata, koťata (rod střední, i když jde o živé bytosti)",
    ],
  },
  {
    title: "3. Přídavná jména (druhy a stupňování)",
    rule: [
      "Podle významu rozlišujeme přídavná jména jakostní (jaký? – zelený, hezký, chytrý), druhová/vztahová (jaký druh, vztahující se k čemu – dřevěný, sportovní) a přivlastňovací (čí? – otcův, matčin).",
      "Stupňují se jen jakostní přídavná jména: 1. stupeň – pozitiv (hezký), 2. stupeň – komparativ (hezčí), 3. stupeň – superlativ (nejhezčí, tvoří se předponou nej- k tvaru komparativu).",
      "Komparativ se tvoří příponou -ejší (po tvrdých a obojetných souhláskách) nebo -ější (po měkkých souhláskách); řada slov má nepravidelné stupňování.",
    ],
    trap:
      "Nepravidelné stupňování je potřeba znát nazpaměť – nejčastější chyby vznikají právě u těchto výjimek.",
    examples: [
      "dobrý – lepší – nejlepší (nepravidelné)",
      "špatný – horší – nejhorší (nepravidelné)",
      "velký – větší – největší (nepravidelné)",
      "chytrý – chytřejší – nejchytřejší (-ejší) × moudrý – moudřejší – nejmoudřejší (-ější)",
    ],
  },
  {
    title: "4. Zájmena (druhy a skloňování já, ty, se, jenž)",
    rule: [
      "Druhy zájmen: osobní (já, ty, on, ona, ono, my, vy, oni), přivlastňovací (můj, tvůj, jeho, svůj), ukazovací (ten, tento, onen, týž), tázací (kdo, co, jaký, který, čí), vztažná (kdo, co, jenž, který – uvozují vedlejší věty), neurčitá (někdo, něco, některý), záporná (nikdo, nic, žádný), zvratná (se, si, sebe, svůj).",
      "Zájmeno já se skloňuje nepravidelně: 1. já, 2. mě/mne, 3. mně/mi, 4. mě/mne, 6. mně, 7. mnou.",
      "Zájmeno ty se skloňuje: 1. ty, 2. tebe/tě, 3. tobě/ti, 4. tebe/tě, 6. tobě, 7. tebou.",
      "Zvratné zájmeno se/sebe nemá tvar 1. pádu a skloňuje se: 2. sebe, 3. sobě/si, 4. sebe/se, 6. sobě, 7. sebou.",
      "Vztažné zájmeno jenž se skloňuje podle rodu, čísla a pádu; v běžné mluvě se často nahrazuje zájmenem který. Po předložce se mu připojuje -ň/-n (o něm/o němž, s ním/s nímž).",
    ],
    trap:
      "Zájmeno jenž mění tvar nejen podle pádu, ale po předložkách navíc přibírá -ň/-n – to bývá častý zdroj chyb.",
    examples: [
      "Bez mě to nepůjde. (2. pád zájmena já)",
      "Věřím ti. (3. pád zájmena ty)",
      "Myslel jen na sebe. (4. pád zvratného zájmena sebe)",
      "muž, o němž jsme mluvili (vztažné zájmeno jenž po předložce)",
    ],
  },
  {
    title: "5. Číslovky (druhy, určité/neurčité, dvě/dva, obě/oba)",
    rule: [
      "Druhy číslovek: základní (kolik? – pět, sto), řadové (kolikátý? – pátý, stý), druhové (kolikerý? – patery, dvojí), násobné (kolikrát? – pětkrát, dvakrát).",
      "Určité číslovky vyjadřují přesný počet (pět, deset, sto), neurčité vyjadřují nepřesné množství (málo, mnoho, několik, tolik).",
      "Číslovka dva/dvě: dva se používá pro rod mužský (dva kluci, dva stromy), dvě pro rod ženský a střední (dvě dívky, dvě města).",
      "Číslovka oba/obě: oba se používá pro rod mužský (oba bratři), obě pro rod ženský a střední (obě sestry, obě města).",
    ],
    trap:
      "Rozlišení dva/dvě a oba/obě podle rodu je jeden z nejčastějších pravopisných chytáků – řídí se stejným principem jako rozdíl mezi rodem mužským a ostatními rody.",
    examples: [
      "dva chlapci, dva domy (mužský rod) × dvě dívky, dvě auta (ženský a střední rod)",
      "oba bratři (mužský rod) × obě sestry, obě města (ženský a střední rod)",
      "pět (základní) – pátý (řadová) – patery (druhová) – pětkrát (násobná)",
    ],
  },
  {
    title: "6. Slovesa (osoba, číslo, čas, způsob, rod, vid)",
    rule: [
      "Osoba (1., 2., 3.) a číslo (jednotné/množné) určují, kdo je konatelem děje: já píšu (1. os. j. č.), vy píšete (2. os. mn. č.).",
      "Čas: minulý (psal jsem), přítomný (píšu), budoucí (budu psát / napíšu).",
      "Způsob: oznamovací (píšu), rozkazovací (piš!), podmiňovací (psal bych).",
      "Slovesný rod: činný (chlapec napsal dopis) a trpný (dopis byl napsán chlapcem) – v trpném rodě se podmět stává tím, na koho děj působí, ne kdo ho koná.",
      "Vid: dokonavý (napsat – děj s výsledkem, ukončený) a nedokonavý (psát – děj probíhající, opakovaný).",
    ],
    trap:
      "Trpný rod se často plete s minulým časem, protože obě konstrukce obsahují sloveso být + příčestí – rozhoduje, jestli podmět děj koná (činný rod), nebo jestli je jím zasažen (trpný rod).",
    examples: [
      "Chlapec napsal dopis. (činný rod – podmět koná děj)",
      "Dopis byl napsán chlapcem. (trpný rod – podmět je zasažen dějem)",
      "psát (nedokonavý – probíhající děj) × napsat (dokonavý – ukončený děj s výsledkem)",
      "Kdybych měl čas, přišel bych. (podmiňovací způsob)",
    ],
  },
  {
    title: "7. Neohebné slovní druhy (rozlišení předložky a příslovce)",
    rule: [
      "Předložka se vždy pojí s podstatným jménem (nebo zájmenem) a určuje jeho pád – sama o sobě nedává smysl: v, na, s, bez, kolem.",
      "Příslovce stojí samostatně a rozvíjí sloveso, přídavné jméno nebo jiné příslovce – vyjadřuje okolnost (místo, čas, způsob): rychle, tam, včera, velmi.",
      "Spojka spojuje věty nebo větné členy: a, ale, protože, že, aby.",
      "Částice vyjadřuje postoj mluvčího k obsahu výpovědi a není platným větným členem: snad, prý, kéž, ať.",
      "Citoslovce vyjadřuje cit nebo napodobuje zvuk, stojí většinou mimo větnou stavbu: au, bum, haf, hurá.",
    ],
    trap:
      "Slova jako kolem, blízko, kvůli mohou být jak předložkou (kolem domu), tak příslovcem (rozhlédl se kolem). Rozhoduje, jestli za slovem následuje podstatné jméno v určitém pádě (předložka), nebo jestli slovo stojí samostatně (příslovce).",
    examples: [
      "Šel kolem domu. (kolem = předložka, pojí se s domu v 2. pádě)",
      "Rozhlédl se kolem. (kolem = příslovce, stojí samostatně)",
      "Bydlí blízko školy. (blízko = předložka) × Bydlí blízko. (blízko = příslovce)",
    ],
  },
];

const SLOVNI_ZASOBA_CHEATSHEET = [
  {
    title: "1. Význam slov (jednoznačnost, metafora, metonymie)",
    rule: [
      "Jednoznačná slova mají jen jeden ustálený význam – typicky odborné termíny: trojúhelník, kyslík, podmět.",
      "Mnohoznačná (polysémní) slova mají víc souvisejících významů, které se od sebe odvíjejí: hlava (část těla / vedoucí / začátek kapitoly), pero (psací potřeba / ptačí peří).",
      "Metafora přenáší význam na základě PODOBNOSTI (vzhledu, vlastnosti, funkce): srdce města, hodinu čeká.",
      "Metonymie přenáší význam na základě VĚCNÉ souvislosti, ne podobnosti: vypít sklenici (myšlen obsah), číst Čapka (myšleno dílo).",
    ],
    trap:
      "Metafora a metonymie se snadno zamění – rozhoduje typ souvislosti: metafora stojí na PODOBNOSTI dvou věcí, metonymie na jejich VĚCNÉM sepětí (nádoba a obsah, autor a dílo, místo a instituce).",
    examples: [
      "hlava (část těla / vedoucí rodiny / začátek kapitoly) – mnohoznačné slovo",
      "srdce města (metafora – podobnost s významem „střed“)",
      "vypít sklenici (metonymie – nádoba místo obsahu)",
      "číst Čapka (metonymie – autor místo díla)",
    ],
  },
  {
    title: "2. Vztahy mezi slovy",
    rule: [
      "Synonyma jsou slova stejného nebo podobného významu: radost – potěšení.",
      "Antonyma jsou slova opačného významu: velký – malý.",
      "Homonyma jsou slova, která zní (nebo se píší) stejně, ale mají zcela odlišný, nesouvisející význam: kolej (ubytovna) – kolej (železniční trať).",
      "Hyperonymum je nadřazené, obecnější pojem: strom.",
      "Hyponymum je podřazený, konkrétnější druh spadající pod hyperonymum: dub, buk, smrk jsou hyponyma ke slovu strom.",
    ],
    trap:
      "Hyperonymum a hyponymum se často pletou se synonymy – nejde o stejný význam, ale o vztah nadřazenosti a podřazenosti (obecný pojem × jeho konkrétní druh).",
    examples: [
      "radost – potěšení (synonyma)",
      "velký – malý (antonyma)",
      "kolej (přístřešek/ubytovna) – kolej (železniční trať) (homonyma)",
      "strom (hyperonymum) – dub, buk, smrk (hyponyma)",
    ],
  },
  {
    title: "3. Slovní zásoba podle původu a stáří",
    rule: [
      "Slova domácí od začátku patří do češtiny, slova přejatá pocházejí z cizích jazyků: fotbal, internet, gymnázium.",
      "Archaismy jsou zastaralá slova, dnes běžně nahrazená jinými – věc nebo jev, který označují, ale stále existuje: vojna (= válka), kdyžto.",
      "Historismy označují věci nebo jevy, které už dnes neexistují – zanikly spolu s tím, co pojmenovávaly: halapartna, panoš, groš.",
      "Neologismy jsou nově vzniklá slova pro nové skutečnosti: selfie, influencer, hejtovat.",
    ],
    trap:
      "Archaismus a historismus se snadno zamění – rozhoduje, jestli věc/jev, který slovo označuje, ještě EXISTUJE (archaismus – jen se dnes jinak pojmenovává) nebo UŽ NEEXISTUJE (historismus – zanikla i skutečnost sama).",
    examples: [
      "vojna (zastarale „válka“) – archaismus, věc (válka) stále existuje",
      "halapartna, panoš – historismy, věci samy už neexistují",
      "selfie, influencer – neologismy",
      "fotbal, internet – slova přejatá",
    ],
  },
  {
    title: "4. Slovní zásoba podle citového zabarvení",
    rule: [
      "Neutrální slova jsou bez citového zabarvení, věcná pojmenování: dům, jídlo, pes.",
      "Zdrobněliny (deminutiva) vyjadřují zmenšení nebo láskyplný vztah: domeček, pejsek, sluníčko.",
      "Zveličelá slova (augmentativa) vyjadřují zveličení, často s hrubším nádechem: barák, chlapisko.",
      "Slova hanlivá (pejorativa) vyjadřují opovržení nebo negativní hodnocení: fracek, hňup.",
      "Slova knižní jsou formální, typická pro psaný nebo oficiální projev: jenž, vskutku.",
    ],
    trap:
      "Zdrobnělina nemusí jen zmenšovat velikost – často hlavně vyjadřuje citový, láskyplný vztah, zatímco zveličelé slovo může znít hrubě, i když jen popisuje velikost.",
    examples: [
      "dům (neutrální) – domeček (zdrobnělina) – barák (zveličelé, hovorové)",
      "pes – pejsek (zdrobnělina, láskyplné)",
      "fracek, spratek (pejorativa – hanlivá slova pro dítě)",
    ],
  },
  {
    title: "5. Spisovnost a nespisovnost",
    rule: [
      "Spisovná čeština je kodifikovaná podoba jazyka používaná v oficiálních textech, ve škole a v médiích.",
      "Hovorová čeština je uvolněnější, ale stále spisovná varianta používaná v běžné mluvené komunikaci.",
      "Obecná čeština je nespisovný, nejrozšířenější útvar používaný v neformální mluvě (typické znaky: -ej místo -ý, protetické v- na začátku slova).",
      "Slang je nespisovná slovní zásoba typická pro určitou zájmovou nebo profesní skupinu.",
      "Nářečí (dialekt) zahrnuje slova a výslovnost typické pro určitý region.",
    ],
    trap:
      "Obecná čeština se často plete se slangem – obecná čeština je široce používaný nespisovný jazyk napříč společností (není vázaný na jednu skupinu), zatímco slang patří jen určité zájmové nebo profesní skupině.",
    examples: [
      "dobrý (spisovně) – dobrej (obecná čeština)",
      "oči (spisovně) – voči (obecná čeština, protetické v-)",
      "„kára“ pro auto (slang, ne obecná čeština)",
    ],
  },
  {
    title: "6. Ustálená slovní spojení (rčení, přísloví, pranostiky)",
    rule: [
      "Rčení (pořekadlo) je ustálené obrazné spojení bez mravního ponaučení – jen popisuje jev: Lije jako z konve.",
      "Přísloví je ustálený výrok s obecně platným mravním poučením nebo životní moudrostí: Bez práce nejsou koláče.",
      "Pranostika je ustálený výrok vztahující se k počasí a ročním obdobím, často vázaný na konkrétní datum nebo svátek: Medardova kápě, čtyřicet dní kape.",
    ],
    trap:
      "Rčení a přísloví se často zaměňují – klíčový rozdíl je přítomnost mravního poučení: přísloví ho obsahuje, rčení jen obrazně popisuje nějaký jev.",
    examples: [
      "Lije jako z konve. (rčení – jen popisuje intenzitu deště, bez poučení)",
      "Bez práce nejsou koláče. (přísloví – obsahuje životní poučení)",
      "Medardova kápě, čtyřicet dní kape. (pranostika – vztahuje se k počasí kolem svátku Medarda)",
    ],
  },
];

const LITERARNI_TEORIE_CHEATSHEET = [
  {
    title: "1. Literární druhy a žánry",
    rule: [
      "Tři základní literární druhy: lyrika (vyjadřuje pocity a nálady, bez dějovosti – typicky báseň), epika (vypráví příběh – v próze i ve verších), drama (text určený k jevištnímu provedení, staví na dialozích a scénických poznámkách).",
      "Žánry epiky: pohádka (boj dobra se zlem, nadpřirozeno, šťastný konec), pověst (váže se k místu nebo historické události, obsahuje smyšlený či nadpřirozený prvek), bajka (zvířata jednající jako lidé, mravní ponaučení), povídka (kratší próza s jednou dějovou linií), novela (delší a dějově složitější než povídka), román (nejrozsáhlejší prozaický útvar, víc dějových linií a postav).",
      "Žánry lyriky: báseň, óda (oslavná báseň), elegie (žalozpěv, báseň o smutku a ztrátě).",
      "Žánry dramatu: tragédie (vážný obsah, tragický konec), komedie (odlehčený obsah, obvykle šťastný konec).",
    ],
    trap:
      "Balada je lyricko-epická skladba – kombinuje obojí: má děj (epika) i silné citové a atmosférické působení (lyrika), typicky s tragickým koncem. Nepatří tedy čistě ani k lyrice, ani k epice.",
    examples: [
      "Kytice (K. J. Erben) – sbírka balad, lyricko-epické básně",
      "O třech přadlenách – pohádka",
      "O Bruncvíkovi – pověst",
      "O lišce a čápovi – bajka",
    ],
  },
  {
    title: "2. Poezie a tropy",
    rule: [
      "Verš je jeden řádek básně, sloka (strofa) je skupina veršů oddělená od ostatních mezerou.",
      "Sdružený rým (schéma AABB): rýmují se vždy sousední verše.",
      "Střídavý rým (schéma ABAB): rýmuje se 1. verš se 3. a 2. se 4.",
      "Obkročný rým (schéma ABBA): rýmuje se 1. verš se 4. a 2. se 3. (prostřední dvojice „obkročuje“ krajní).",
      "Metafora přenáší význam na základě podobnosti, bez spojky jako/jak.",
      "Přirovnání srovnává dvě věci pomocí spojky jako/jak.",
      "Personifikace přisuzuje neživým věcem nebo přírodním jevům lidské vlastnosti.",
      "Epiteton je básnický, ozdobný přívlastek zdůrazňující vlastnost popisované věci.",
      "Hyperbola je záměrné přehánění za účelem zdůraznění.",
    ],
    trap:
      "Metafora a přirovnání se často pletou – přirovnání používá spojku jako/jak a věci výslovně srovnává, metafora žádnou spojku nemá a jednu věc rovnou „přejmenuje“ na druhou.",
    examples: [
      "sdružený rým (AABB): „Na topole nad jezerem (A) / seděl Vodník pod večerem (A) / Sviť, měsíčku, sviť (B), / ať mi šije niť (B).“",
      "střídavý rým (ABAB): „Zemřela matka a do hrobu dána (A), / siroty po ní zůstaly (B); / i přicházely každičkého rána (A) / a matičku svou hledaly (B).“",
      "silný jako lev (přirovnání) × zlaté vlasy slunce (metafora)",
      "vítr si pohrával s listím (personifikace)",
      "temný les, zlaté slunce (epiteton) × čekal jsem věčnost (hyperbola)",
    ],
  },
  {
    title: "3. Vypravěč a kompozice",
    rule: [
      "Ich-forma: vypravěčem je přímo hlavní postava, mluví v 1. osobě (já) – čtenář zná jen její pohled na děj.",
      "Er-forma: vypravěč stojí mimo děj a mluví o postavách ve 3. osobě (on, ona) – může znát i to, co jednotlivé postavy neví.",
      "Chronologický děj plyne v pořadí, v jakém se události skutečně staly.",
      "Retrospektivní děj se vrací v čase zpět, například formou vzpomínky, a neplyne přímočaře.",
      "Přímá charakteristika: vypravěč nebo jiná postava vlastnosti postavy popíše výslovně.",
      "Nepřímá charakteristika: vlastnosti postavy vyplývají z jejího jednání, řeči a chování, aniž by je někdo přímo pojmenoval.",
    ],
    trap:
      "Er-forma neznamená, že je vypravěč nutně neutrální nebo nezaujatý – i vypravěč ve 3. osobě může znát a sdělovat vnitřní myšlenky postav (tzv. vševědoucí vypravěč), pokud to tak autor napsal.",
    examples: [
      "Byl jsem unavený a šel jsem domů. (ich-forma)",
      "Byl unavený a šel domů. (er-forma)",
      "Vypravěč uprostřed děje vzpomíná na hrdinovo dětství. (retrospektiva)",
      "Byl to poctivý a pracovitý muž. (přímá charakteristika)",
      "Čtenář pozná poctivost postavy z toho, že vrátí nalezenou peněženku. (nepřímá charakteristika)",
    ],
  },
  {
    title: "4. Klíčoví autoři",
    rule: [
      "Karel Jaromír Erben – český romantismus, sbírka balad Kytice, čerpá z lidových pověstí a pověr.",
      "Božena Němcová – romanticko-realistická próza, román Babička.",
      "Jan Neruda – realismus, povídkový soubor Povídky malostranské.",
      "Karel Hynek Mácha – český romantismus, lyrickoepická báseň Máj.",
      "Karel Čapek – meziválečná próza a drama, drama R.U.R. (odtud pochází slovo „robot“), román Válka s mloky, povídkový soubor Povídky z jedné kapsy.",
      "George Orwell – britská literatura, dystopický román 1984, alegorická novela Farma zvířat.",
      "Jules Verne – francouzská literatura, průkopník dobrodružné a sci-fi prózy, romány Dvacet tisíc mil pod mořem a Cesta kolem světa za osmdesát dní.",
      "Antoine de Saint-Exupéry – francouzský spisovatel a letec, novela Malý princ.",
    ],
    trap:
      "Autoři stejného období nebo tématu se snadno zamění (např. Erben a Mácha – oba čeští romantici) – je důležité si pamatovat konkrétní dvojici autor–dílo, ne jen literární období nebo národnost.",
    examples: [
      "Kytice → Karel Jaromír Erben",
      "Babička → Božena Němcová",
      "Máj → Karel Hynek Mácha",
      "R.U.R. → Karel Čapek",
      "Malý princ → Antoine de Saint-Exupéry",
    ],
  },
];

const POROZUMENI_TEXTU_CHEATSHEET = [
  {
    title: "1. Zlatá strategie čtení (jak ušetřit čas)",
    rule: [
      "Pravidlo 1: Nejdřív si přečti OTÁZKU (i všechny možnosti odpovědi), a teprve pak jdi číst samotný TEXT. Musíš přesně vědět, jakou konkrétní informaci v ukázce hledáš, než se do ní pustíš.",
      "Pravidlo 2: Při čtení textu si v duchu (nebo fyzicky, pokud to jde) podtrhávej klíčová slova, jména, data a čísla – usnadní ti to rychlé dohledání odpovědi, až se k otázce vrátíš.",
    ],
    tip: "V praxi to znamená: přečti si otázku i všechny 4 možnosti odpovědi ještě předtím, než se poprvé podíváš na výchozí text. Pak čteš text už s konkrétním cílem v hlavě, ne naslepo – to ušetří desítky vteřin u každé otázky.",
    examples: [
      "Otázka zní „Kdy se hlavní hrdina rozhodl odjet?“ → v textu už jen hledáš časový údaj a slovo „rozhodl“, nemusíš číst každou větu se stejnou pozorností.",
    ],
  },
  {
    title: "2. Chytáky u otázek „co z textu vyplývá / nevyplývá“",
    rule: [
      "Pravidlo 3: Vycházej POUZE z textu. Zapomeň na to, co víš ze života nebo z jiných zdrojů – i logická, pravdivá informace je špatně, pokud v textu doslova není napsaná nebo z něj se stoprocentní jistotou nevyplývá.",
      "Pozor na absolutní slova: možnosti obsahující slova jako VŽDYCKY, NIKDY, VŠICHNI, JEDINĚ, VÝHRADNĚ bývají z 90 % chyták – text totiž málokdy dává tak jednoznačné, bezvýjimečné tvrzení.",
    ],
    trap:
      "Když si nejsi jistý/jistá, zeptej se sám sebe: „Řekl by to takhle přesně i autor textu, nebo si tam něco domýšlím navíc?“ Pokud domýšlíš, je odpověď špatně, i kdyby to znělo rozumně.",
    examples: [
      "Text: „Většina žáků test zvládla bez problémů.“ → možnost „Všichni žáci test zvládli bez problémů“ je špatně (text říká „většina“, ne „všichni“).",
      "Text neříká nic o počasí → možnosti „Nikdy nepršelo“ i „Vždycky pršelo“ jsou obě špatně, protože text o počasí vůbec mlčí.",
    ],
  },
  {
    title: "3. Jak seřadit rozházené odstavce (logická návaznost)",
    rule: [
      "Hledej ukazovací zájmena a spojky na začátku vět („Tato událost…“, „Proto se rozhodl…“, „Navíc…“) – ty jasně napovídají, co muselo být zmíněno v textu PŘEDTÍM.",
      "Sleduj časovou posloupnost (ráno → odpoledne → večer, nejdřív → pak → nakonec) a logické vztahy příčina–následek.",
      "Odstavec, který něco poprvé PŘEDSTAVUJE (jméno, místo, situaci), musí být na začátku; odstavec, který na něco už jen ODKAZUJE, musí následovat až po něm.",
    ],
    tip: "V praxi: nejdřív najdi odstavec, který nezačíná odkazujícím zájmenem ani spojkou typu „proto/tedy/navíc“ – to bývá nejčastěji ten úvodní. Od něj se pak zbytek dá poskládat podle toho, na co která věta odkazuje.",
    examples: [
      "„Tento nález potvrdil domněnku vědců.“ → musí následovat AŽ PO odstavci, kde je nález poprvé popsán.",
      "„Ráno vyrazili na výlet… Odpoledne dorazili na chatu… Večer si opekli buřty.“ → pořadí odstavců kopíruje časovou posloupnost.",
    ],
  },
  {
    title: "4. Klíčový přehled slohu",
    rule: [
      "Slohové postupy: informační (holá fakta, žádné hodnocení), popisný (jak něco/někdo vypadá), vyprávěcí (děj a příběh odvíjející se v čase), výkladový (vysvětlení principu – jak a proč něco funguje), úvahový (osobní zamyšlení, argumentace, vyjádření názoru).",
      "Popis vs. charakteristika: popis zachycuje VNĚJŠÍ, viditelné znaky (jak něco nebo někdo vypadá). Charakteristika navíc popisuje VNITŘNÍ vlastnosti a povahu (jaký někdo je, jak se chová a proč).",
      "Vyprávění vs. líčení: vyprávění sleduje děj a časovou posloupnost událostí. Líčení je emocionálně zabarvený popis (často přírody nebo atmosféry) plný básnických obrazů, bez důrazu na děj.",
      "Funkční styly: prostěsdělovací (běžná každodenní komunikace), odborný (přesná terminologie, věcnost), administrativní (úřední dopisy, vyhlášky, formuláře), publicistický (noviny, zprávy, aktuálnost), umělecký (obraznost, estetická funkce).",
    ],
    tip: "Nejrychlejší způsob, jak poznat funkční styl u krátké ukázky: všímej si slovní zásoby. Odborné termíny → odborný styl. Razítka, čísla jednací, „Vážený pane“ → administrativní. Titulek a aktuální událost → publicistický. Obrazná, ozdobná slova → umělecký.",
    examples: [
      "„Teplota vody dosáhla 15 °C.“ → informační postup, odborný styl",
      "„Byl vysoký, štíhlý, měl hnědé oči.“ → popis (vnější vzhled)",
      "„Byl to laskavý, ale tvrdohlavý muž.“ → charakteristika (vnitřní povaha)",
      "„Slunce se pomalu koupalo v mlze nad loukou…“ → líčení (obraznost, atmosféra)",
    ],
  },
  {
    title: "5. 📚 Kde trénovat čtení zdarma",
    links: [
      {
        title: "Městská knihovna v Praze (E-knihy zdarma)",
        description:
          "Tisíce e-knih povinné četby ke stažení ve stáhnutelných formátech i PDF zdarma (Čapek, Němcová, Doyle...).",
        url: "https://search.mlp.cz/cz/eknihy",
      },
      {
        title: "Knihovny.cz",
        description: "Obří digitální archiv českých knihoven pro čtení děl přímo v prohlížeči.",
        url: "https://www.knihovny.cz",
      },
      {
        title: "Project Gutenberg (Česká sekce)",
        description: "Volně přístupné klasické knihy k okamžitému čtení online.",
        url: "https://www.gutenberg.org/browse/languages/cs",
      },
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
