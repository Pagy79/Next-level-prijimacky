import React, { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Data (shape mirrors questions.json / Question struct)
// ---------------------------------------------------------------------------
const questionsData = [
  {
    category: "Pravopis",
    text: "Dřevěné stoly v jídelně se pod tíhou jídla prohýbal_.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 1,
    explanation:
      "Podmět „stoly“ je rod mužský neživotný (ty stoly). V přísudku proto píšeme tvrdé -y.",
    hint: "Zkus si podmět nahradit ukazovacím zájmenem: „ty stoly“, nebo „ti stoly“? Podle toho poznáš životnost.",
  },
  {
    category: "Pravopis",
    text: "Z dálky jsme uslyšeli s_čkování.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation:
      "Sýček je vyjmenované slovo po S. Píšeme proto tvrdé a dlouhé -ý.",
    hint: "Slovo souvisí s názvem malé sovy. Vzpomeň si na vyjmenovaná slova po S.",
  },
  {
    category: "Pravopis",
    text: "Na louce rozkvétaly nádherné fialov_ květiny.",
    options: ["é", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation:
      "Přídavné jméno „fialové“ se shoduje s podmětem „květiny“ (rod ženský, množné číslo, 1. pád), proto píšeme koncovku -é.",
    hint: "Najdi podmět, se kterým se přídavné jméno shoduje, a zeptej se: jaké? Jaká je jejich koncovka v 1. pádě množného čísla?",
  },
  {
    category: "Pravopis",
    text: "Maminka koupila nové ob_vací stěny.",
    options: ["í", "ý", "i", "y"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo obývací je odvozené od vyjmenovaného slova obyvatel (být, bydlit, obyvatel, byt...), proto píšeme tvrdé a dlouhé -ý.",
    hint: "Od jakého vyjmenovaného slova se toto slovo odvozuje? Zkus řadu: být, bydlit, obyvatel, byt...",
  },
  {
    category: "Skladba",
    text: "Určete základní skladební dvojici ve větě: „Malý chlapec včera rychle utíkal domů.“",
    options: ["chlapec domů", "malý chlapec", "chlapec utíkal", "rychle utíkal"],
    correctAnswerIndex: 2,
    explanation:
      "Podmět je „chlapec“ (kdo, co?) a přísudek „utíkal“ (co dělal?). Ostatní slova jsou rozvíjející větné členy.",
    hint: "Nejdřív najdi přísudek (co dělal?), pak se zeptej Kdo? Co? a najdi k němu podmět.",
  },
  {
    category: "Skladba",
    text: "Vyberte větu, která je souvětím:",
    options: [
      "Pes štěkal na poštáka.",
      "Ráno jsme vstali a nasnídali se.",
      "Vysoký strom na zahradě uschl.",
      "Babička s dědou přijeli autobusem.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje více než jeden přísudek. Ve větě „Ráno jsme vstali a nasnídali se.“ jsou dva přísudky (vstali, nasnídali se).",
    hint: "Spočítej si v každé větě, kolik obsahuje sloves v určitém tvaru (přísudků). Souvětí jich má víc než jeden.",
  },
  {
    category: "Tvarosloví",
    text: "Které slovo je v 7. pádě množného čísla napsáno správně?",
    options: ["s pány", "s páni", "s pávmi", "s panoma"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno pán (rod mužský životný, vzor pán) přibírá v 7. pádě množného čísla koncovku -y (s pány).",
    hint: "7. pád se ptá „(s) kým, čím?“. Zkus si slovo „pán“ sklonit podle vzoru pán v množném čísle.",
  },
  {
    category: "Tvarosloví",
    text: "Určete slovní druh slova „rychle“ ve větě: Rychle utíkal domů.",
    options: ["Přídavné jméno", "Příslovce", "Sloveso", "Částice"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „rychle“ odpovídá na otázku Jak? a rozvíjí sloveso (utíkal). Jedná se tedy o příslovce.",
    hint: "Zkus se na dané slovo zeptat otázkou Jak? Který slovní druh na tuto otázku obvykle odpovídá?",
  },

  // ---- Pravopis (nové) ----
  {
    category: "Pravopis",
    text: "Která z následujících vět NENÍ zapsána pravopisně správně?",
    options: [
      "Bylo mi jasné, že se mnou nikdo nepočítá.",
      "Nesmírně mně těšilo, že jsme se setkali po tak dlouhé době.",
      "Kamarádka mi slíbila, že mi pomůže s úkolem.",
      "Když se mě zeptali na názor, řekl jsem pravdu.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „těšit“ se pojí se 4. pádem (koho? co? – mě), nikoli se 3. pádem (komu? čemu? – mně). Správně tedy: Nesmírně mě těšilo…",
    hint: "Zeptej se: těšit koho, co? nebo těšit komu, čemu? Podle toho zjistíš správný tvar zájmena.",
  },
  {
    category: "Pravopis",
    text: "Malé děti si na hřišti hrál_ a smál_ se.",
    options: ["y", "a", "i", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „děti“ je v množném čísle rodu ženského (skloňuje se podle vzoru „kost“), přestože v jednotném čísle je „dítě“ rodu středního. V přísudku proto píšeme -y: děti si hrály.",
    hint: "Nenech se zmást jednotným číslem – „dítě“ je střední rod, ale množné číslo „děti“ se chová jako rod ženský.",
  },
  {
    category: "Pravopis",
    text: "Které slovo je napsáno s chybnou předponou?",
    options: [
      "shodit ovoce ze stromu",
      "zhodit staré oblečení",
      "sbalit se na cestu",
      "sjet dolů po sjezdovce",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „shodit“ (ve významu shodit dolů, pryč) se píše s předponou s-. Tvar „zhodit“ není spisovný.",
    hint: "Předpona s- se často pojí se slovesy vyjadřujícími pohyb směrem dolů nebo pryč.",
  },
  {
    category: "Pravopis",
    text: "Ve které větě je velké písmeno použito správně?",
    options: [
      "Navštívili jsme Pražský Hrad i Karlův Most.",
      "Navštívili jsme Pražský hrad i Karlův most.",
      "navštívili jsme pražský hrad i karlův most.",
      "Navštívili jsme pražský Hrad i Karlův Most.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "U víceslovných vlastních jmen (názvů památek) se velké písmeno píše zpravidla jen na začátku názvu: Pražský hrad, Karlův most.",
    hint: "U víceslovných názvů památek se velké písmeno obvykle píše jen u prvního slova.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je chyba?",
    options: [
      "Byl ohromně šťastný, že to všechno stihl.",
      "Bylo mu smutně, že musí odejít.",
      "Vjezd do garáže byl uzavřený.",
      "Objevili jsme zajímavou jeskyni.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Ve větách bez podmětu vyjadřujících stav (zejména se slovesem být) se používá tvar zakončený na -o: Bylo mu smutno. Tvar „smutně“ patří do vět s podmětem, např. Díval se na ni smutně.",
    hint: "Zkus zjistit, jestli věta má podmět. Bez podmětu (Bylo mu…) se často píše tvar na -o, ne na -ě.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použito nespisovné slovo místo spisovného?",
    options: [
      "Kamarád mi dal informaci z první ruky.",
      "Tenhle recept je fakt super, zkus ho taky.",
      "Kolega mi poradil, jak postupovat dál.",
      "Sešli jsme se v kanceláři ředitele.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Slova „fakt“ a „super“ patří mezi hovorové (nespisovné) výrazy, ve spisovném projevu by se nahradila např. slovy „opravdu“ a „skvělý“.",
    hint: "Hledej slova, která bys běžně použil v hovoru s kamarády, ale ne v oficiálním psaném textu.",
  },

  // ---- Pravopis: vyjmenovaná slova (nové, druhá dávka) ----
  {
    category: "Pravopis",
    text: "Za vesnicí stál starý ml_n.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo mlýn je vyjmenované slovo po M, píšeme proto tvrdé -ý.",
    hint: "Mlýn patří mezi vyjmenovaná slova po M (mýt, myslet, mýlit se, hmyz, chmýří, mlýn…).",
  },
  {
    category: "Pravopis",
    text: "Kůň má na hubě citlivý p_sk.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo pysk je vyjmenované slovo po P, píšeme tedy tvrdé -y.",
    hint: "Pysk patří mezi vyjmenovaná slova po P (pýcha, pyl, pysk, netopýr, slepýš, kopyto…).",
  },
  {
    category: "Pravopis",
    text: "V jeskyni přezimoval vzácný slep_š.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo slepýš patří mezi vyjmenovaná slova po P, píšeme tedy -ý-.",
    hint: "Slepýš je beznohý plaz a patří do skupiny vyjmenovaných slov po P.",
  },
  {
    category: "Pravopis",
    text: "Na půdě jsme našli starý zaprášený b_t.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo byt je vyjmenované slovo po B, píšeme proto tvrdé -y.",
    hint: "Byt patří mezi vyjmenovaná slova po B (bydlet, obyvatel, byt, příbytek, nábytek…).",
  },
  {
    category: "Pravopis",
    text: "V zoo jsme obdivovali mohutného b_ka.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo býk je vyjmenované slovo po B, píšeme tedy -ý-.",
    hint: "Býk patří mezi vyjmenovaná slova po B.",
  },
  {
    category: "Pravopis",
    text: "Dědeček měl už úplně l_sou hlavu.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo lysý je vyjmenované slovo po L, píšeme proto tvrdé -y.",
    hint: "Lysý patří mezi vyjmenovaná slova po L (mlýn, blýskat se, lysý, lýko, plyš, plynout…).",
  },
  {
    category: "Pravopis",
    text: "Za bouřky se na obloze neustále bl_skalo.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Sloveso blýskat se je odvozeno od vyjmenovaného slova po L, píšeme tedy -ý-.",
    hint: "Sloveso souvisí s vyjmenovanými slovy po L: mlýn, mlýnice, blýskat se, lysý, lýko, plyš.",
  },
  {
    category: "Pravopis",
    text: "Deštivé počasí trvalo celý týden a lidé si na něj museli zv_kat.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Sloveso zvykat je odvozeno od vyjmenovaného slova po Z (zvyk), píšeme tedy -y-.",
    hint: "Sloveso souvisí se slovem „zvyk“ – jedním z vyjmenovaných slov po Z.",
  },

  // ---- Pravopis: shoda přísudku s podmětem (nové, druhá dávka) ----
  {
    category: "Pravopis",
    text: "Žáci ve třídě pozorně poslouchal_ výklad učitele.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět „žáci“ je rodu mužského životného (ti žáci), proto v přísudku píšeme -i: žáci poslouchali.",
    hint: "Zkus si podmět nahradit zájmenem: „ti žáci“, nebo „ty žáci“? Podle toho poznáš životnost.",
  },
  {
    category: "Pravopis",
    text: "Vlaky na nádraží dlouho stál_ kvůli poruše.",
    options: ["y", "i", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět „vlaky“ je rodu mužského neživotného (ty vlaky), proto píšeme tvrdé -y: vlaky stály.",
    hint: "Zkus dosadit „ty vlaky“ – u neživotného rodu mužského píšeme v přísudku -y.",
  },
  {
    category: "Pravopis",
    text: "Sestry si spolu dlouho povídal_ o prázdninách.",
    options: ["y", "i", "a", "o"],
    correctAnswerIndex: 0,
    explanation: "Podmět „sestry“ je rodu ženského, v přísudku proto píšeme -y: sestry si povídaly.",
    hint: "U podmětu rodu ženského v množném čísle píšeme v přísudku -y.",
  },
  {
    category: "Pravopis",
    text: "Města v regionu postupně rozšiřoval_ své hranice.",
    options: ["a", "y", "i", "o"],
    correctAnswerIndex: 0,
    explanation: "Podmět „města“ je rodu středního, v přísudku proto píšeme -a: města rozšiřovala.",
    hint: "U podmětu rodu středního v množném čísle píšeme v přísudku -a.",
  },
  {
    category: "Pravopis",
    text: "Chlapci a dívky se na oslavě dobře bavil_.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Pokud je podmět tvořen slovy různého rodu a alespoň jedno je rodu mužského životného, píšeme v přísudku -i: chlapci a dívky se bavili.",
    hint: "Když je v podmětu smíšený rod a jeden z nich je mužský životný, tento rod „vyhrává“ a píše se -i.",
  },
  {
    category: "Pravopis",
    text: "Obě děvčata si na dovolené moc užil_ sluníčka.",
    options: ["a", "y", "i", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět „děvčata“ je rodu středního (jako „kuřata“), v přísudku proto píšeme -a.",
    hint: "Slovo „děvčata“ je stejně jako „kuřata“ rodu středního – v přísudku píšeme -a.",
  },
  {
    category: "Pravopis",
    text: "Lidé z celého města se sešl_ na náměstí.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation: "Podmět „lidé“ je rodu mužského životného, proto v přísudku píšeme -i: lidé se sešli.",
    hint: "Slovo „lidé“ označuje osoby – jde tedy o mužský rod životný.",
  },
  {
    category: "Pravopis",
    text: "V košíku spal_ tři malá koťata.",
    options: ["a", "y", "i", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět „koťata“ je rodu středního (skloňuje se jako „kuřata“), v přísudku proto píšeme -a.",
    hint: "Slova zakončená v množném čísle na -ata (koťata, kuřata, house) jsou rodu středního.",
  },

  // ---- Pravopis: mě/mně, vě/vje, ú/ů, zdvojené souhlásky (nové) ----
  {
    category: "Pravopis",
    text: "Ve které možnosti je slovo napsáno chybně?",
    options: ["oběd", "vjezd do dvora", "svjetlo svítilny", "vjem z výletu"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „světlo“ se píše s -vě-, protože nejde o předponu v- připojenou ke kořeni začínajícímu na je- (jako u vjet, vjezd, vjem). Správně je tedy „světlo“, nikoli „svjetlo“.",
    hint: "Skupina -vje- se píše jen tam, kde jde o předponu v- + kořen začínající je- (vjet, vjezd, vjem). Jinde píšeme -vě-.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je zájmeno mě/mně použito nesprávně?",
    options: [
      "Bez mně se prosím nikam nechoďte.",
      "Vzpomínáš si na mě z tábora?",
      "Řekni mně, jak se máš.",
      "Dej mně vědět, až dorazíš.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Předložka „bez“ se pojí s 2. pádem (bez koho, čeho?), správný tvar je tedy „mě“ (bez mě), nikoli „mně“ (3. pád).",
    hint: "Zeptej se: bez koho, čeho? To je otázka 2. pádu, ve kterém se používá tvar „mě“, ne „mně“.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je sloveso napsáno chybně?",
    options: [
      "objednávka byla hotová",
      "oběť dopravní nehody",
      "objevil nový ostrov",
      "obědvit ve školní jídelně",
    ],
    correctAnswerIndex: 3,
    explanation:
      "Sloveso „obědvat“ (mít oběd) se v infinitivu píše s koncovkou -at, tvar „obědvit“ není spisovný.",
    hint: "Zkus si sloveso časovat v přítomném čase: obědvám, obědváš… podle toho poznáš správnou infinitivní příponu.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je slovo napsáno chybně (ú/ů)?",
    options: ["úterý", "průkaz", "zústat doma", "kůň"],
    correctAnswerIndex: 2,
    explanation:
      "Uvnitř slova (mimo začátek slova nebo hranici předpony) se píše -ů-, nikoli -ú-. Správně je tedy „zůstat“, nikoli „zústat“.",
    hint: "Ú se píše na začátku slova nebo po předponě, uvnitř slova se píše ů.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je chyba?",
    options: [
      "Chodíme tam deně.",
      "Je to skutečně milé gesto.",
      "Vlastně jsem to nečekal.",
      "Bezpečně jsme dorazili domů.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „denně“ vzniká spojením kořene „den“ a přípony „-ně“, proto se v něm zdvojuje souhláska n: den + ně = denně.",
    hint: "Rozlož si slovo na základ a příponu (den + ně) – uvidíš, proč se tam píšou dvě n.",
  },
  {
    category: "Pravopis",
    text: "Které z uvedených slov je napsáno pravopisně správně?",
    options: ["vjed", "vjezd", "vjezt", "vgezd"],
    correctAnswerIndex: 1,
    explanation:
      "Správný pravopis slova je „vjezd“ – předpona v- se pojí s kořenem „jezd-“ (jako u jet, jízda), proto píšeme vje-, a slovo souvisí se slovesem jezdit.",
    hint: "Slovo souvisí se slovesem „jezdit“ – zkus si podle toho odvodit správnou předponu i koncovku.",
  },

  // ---- Pravopis: předpony s-/z- (nové, druhá dávka) ----
  {
    category: "Pravopis",
    text: "Ve které možnosti je sloveso napsáno chybně?",
    options: [
      "spadnout ze schodů",
      "zpadnout ze schodů",
      "skákat přes švihadlo",
      "sledovat film",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Správný tvar je „spadnout“, nikoli „zpadnout“ – předpona s- zde vyjadřuje pohyb směrem dolů.",
    hint: "Předpona s- se pojí se slovesy vyjadřujícími pád nebo pohyb směrem dolů.",
  },
  {
    category: "Pravopis",
    text: "Které slovo je napsáno se správnou předponou?",
    options: ["skácet starý strom", "zkácet starý strom", "skákat do dálky", "spravit kolo"],
    correctAnswerIndex: 0,
    explanation:
      "Spisovný tvar je „skácet“ (skácet strom = způsobit, že spadne), nikoli „zkácet“.",
    hint: "Předpona s- se pojí se slovesy vyjadřujícími způsobení pádu něčeho (skácet, srazit, sesadit).",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je použita chybná předpona?",
    options: [
      "Po nemoci musel zesílit svaly cvičením.",
      "Bouře v noci sesílila.",
      "Kávu si raději oslazuji méně.",
      "Zeslábl po dlouhé nemoci.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Správný tvar je „zesílila“, nikoli „sesílila“ – sloveso „zesílit“ (stát se silnějším) se píše s předponou ze-/z-.",
    hint: "Hledej slovo, které popisuje, že se něco stalo silnějším – takové slovo má předponu ze-, ne se-.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použita chybná předpona?",
    options: [
      "Diváci se shromáždili na náměstí.",
      "Diváci se zhromáždili na náměstí.",
      "Sešli se před divadlem.",
      "Setkali se po letech.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Spisovný tvar je „shromáždili“, nikoli „zhromáždili“ – předpona s- vyjadřuje spojení, shromáždění na jedno místo.",
    hint: "Předpona s-/se- se často pojí se slovesy vyjadřujícími spojení více věcí nebo osob na jedno místo.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použita chybná předpona?",
    options: [
      "Oheň spálil celý les.",
      "Oheň zpálil celý les.",
      "Slunce mu spálilo záda.",
      "Svíčka dohořela do rána.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Spisovný tvar je „spálil“, nikoli „zpálil“ – předpona s- se pojí se slovesy vyjadřujícími zničení, zánik něčeho.",
    hint: "Předpona s- se často pojí se slovesy vyjadřujícími zánik nebo zničení něčeho úplně (spálit, shořet, shnít).",
  },

  // ---- Pravopis: velká písmena (nové, druhá dávka) ----
  {
    category: "Pravopis",
    text: "Ve které možnosti je velké písmeno použito správně?",
    options: [
      "Byl jsem na návštěvě u Babičky.",
      "Jeli jsme na dovolenou k Moři.",
      "V květnu slavíme Svátek práce.",
      "Navštívili jsme Národní muzeum v Praze.",
    ],
    correctAnswerIndex: 3,
    explanation:
      "Název instituce „Národní muzeum“ se píše s velkým počátečním písmenem u prvního slova. Běžná podstatná jména jako „babička“ nebo „moře“ se píší s malým písmenem.",
    hint: "Velké písmeno patří k oficiálním názvům institucí, památek nebo vlastním jménům, ne k běžným podstatným jménům.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je název státního svátku napsán správně?",
    options: [
      "Den Vzniku Samostatného Československého Státu",
      "den vzniku samostatného československého státu",
      "Den vzniku samostatného československého státu",
      "DEN vzniku Samostatného Státu",
    ],
    correctAnswerIndex: 2,
    explanation:
      "U víceslovných názvů svátků se velké písmeno píše jen na začátku názvu: Den vzniku samostatného československého státu.",
    hint: "Podobně jako u názvů památek se u víceslovných názvů svátků velké písmeno píše jen u prvního slova.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti jsou obě zeměpisná jména napsána správně?",
    options: [
      "Krkonošské hory, Vltava",
      "krkonošské Hory, vltava",
      "Krkonošské Hory, Vltava",
      "krkonošské hory, Vltava",
    ],
    correctAnswerIndex: 0,
    explanation:
      "U víceslovných zeměpisných názvů se velké písmeno píše zpravidla jen u prvního slova (Krkonošské hory); jednoslovná vlastní jména (Vltava) mají velké písmeno vždy.",
    hint: "U víceslovných zeměpisných názvů bývá velké písmeno jen na začátku, jednoslovné názvy řek mají velké písmeno vždy.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je věta o Nerudově díle zapsána celá správně?",
    options: [
      "Přečetli jsme si Nerudovy Povídky Malostranské.",
      "Přečetli jsme si Nerudovy povídky malostranské.",
      "přečetli jsme si nerudovy povídky malostranské.",
      "Přečetli jsme si nerudovy Povídky Malostranské.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Přivlastňovací přídavné jméno odvozené od vlastního jména (Nerudovy) se píše s velkým písmenem. Název díla „povídky malostranské“ se píše s malým písmenem, protože jde o běžné přídavné jméno, ne o vlastní jméno.",
    hint: "Přivlastňovací přídavná jména od osobních jmen (Nerudův, Novákova) se píšou velkým písmenem, i když jsou odvozená od jména.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je název organizace napsán správně?",
    options: [
      "Pracuje pro Český Červený Kříž.",
      "Pracuje pro český Červený kříž.",
      "Pracuje pro Český červený kříž.",
      "pracuje pro Český červený kříž.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "U víceslovných názvů organizací se velké písmeno píše zpravidla jen u prvního slova: Český červený kříž.",
    hint: "Stejně jako u jiných víceslovných názvů institucí bývá velké písmeno jen na začátku názvu.",
  },

  // ---- Pravopis: čárka v souvětí (nové) ----
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka použita správně?",
    options: [
      "Když dorazili domů, bylo už tma.",
      "Když dorazili domů bylo, už tma.",
      "Když, dorazili domů, bylo už tma.",
      "Když dorazili, domů bylo už tma.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Čárka odděluje vedlejší větu („Když dorazili domů“) od věty hlavní („bylo už tma“). Čárka se píše na hranici vět, ne uprostřed větného členu.",
    hint: "Najdi hranici mezi vedlejší a hlavní větou – tam, a jen tam, patří čárka.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět chybí čárka?",
    options: [
      "Věděl že přijde pozdě.",
      "Kniha, kterou jsem četl, byla zajímavá.",
      "Protože pršelo, zůstali jsme doma.",
      "Ačkoli byl unavený, dokončil úkol.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Ve větě „Věděl, že přijde pozdě.“ chybí čárka před vedlejší větou uvozenou spojkou „že“.",
    hint: "Hledej spojku, která uvozuje vedlejší větu (že, protože, ačkoli, který…) – před ní zpravidla patří čárka.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka u oslovení použita správně?",
    options: [
      "Petře pojď už domů.",
      "Petře, pojď už domů.",
      "Petře, pojď, už domů.",
      "Petře pojď, už domů.",
    ],
    correctAnswerIndex: 1,
    explanation: "Oslovení („Petře“) se odděluje čárkou od zbytku věty.",
    hint: "Oslovení se v psaném textu vždy odděluje čárkou od zbytku věty.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka použita chybně?",
    options: [
      "Chtěl jet na kole, ale pršelo.",
      "Chtěl jet, na kole ale pršelo.",
      "Snažil se, seč mohl.",
      "Přišel pozdě, protože zaspal.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Čárka musí stát na hranici vět, tedy před spojkou „ale“: „Chtěl jet na kole, ale pršelo.“ Ve špatné variantě je čárka umístěna uprostřed větného členu.",
    hint: "Čárka musí oddělovat celé věty, ne rozdělovat jeden větný člen (např. „na kole“) na dvě části.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je vsuvka správně oddělena čárkami z obou stran?",
    options: [
      "Praha, hlavní město České republiky patří k nejnavštěvovanějším místům.",
      "Praha hlavní město České republiky, patří k nejnavštěvovanějším místům.",
      "Praha, hlavní město České republiky, patří k nejnavštěvovanějším místům.",
      "Praha hlavní město České republiky patří, k nejnavštěvovanějším místům.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Přístavek („hlavní město České republiky“) se odděluje čárkami z obou stran, protože blíže vysvětluje podstatné jméno „Praha“.",
    hint: "Přístavek, který blíže popisuje podstatné jméno, se odděluje čárkami na obou koncích, ne jen na jednom.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je interpunkce (čárky) zapsána správně?",
    options: [
      "Soused, milovník zahradničení, každý večer zalévá své záhony.",
      "Soused milovník zahradničení, každý večer zalévá své záhony.",
      "Soused, milovník zahradničení každý večer zalévá své záhony.",
      "Soused milovník zahradničení každý večer, zalévá své záhony.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Přístavek „milovník zahradničení“ blíže vysvětluje slovo „soused“ a musí být oddělen čárkami z obou stran.",
    hint: "Hledej slovní spojení, které blíže popisuje podstatné jméno na začátku věty – to musí mít čárku před sebou i za sebou.",
  },

  // ---- Pravopis (nové, čtvrtá dávka) ----
  {
    category: "Pravopis",
    text: "V našem městě žije mnoho ob_vatel.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo obyvatel je vyjmenované slovo po B, píšeme proto tvrdé -y.",
    hint: "Obyvatel patří mezi vyjmenovaná slova po B (bydlet, obyvatel, byt, příbytek…).",
  },
  {
    category: "Pravopis",
    text: "V dutině starého stromu hnízdil vzácný v_r.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo výr je vyjmenované slovo po V, píšeme tedy tvrdé -ý.",
    hint: "Výr je noční dravý pták a patří mezi vyjmenovaná slova po V.",
  },
  {
    category: "Pravopis",
    text: "Na louce jsme pozorovali plachého s_sla.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo sysel je vyjmenované slovo po S, píšeme proto tvrdé -y.",
    hint: "Sysel je hlodavec žijící na loukách a patří mezi vyjmenovaná slova po S.",
  },
  {
    category: "Pravopis",
    text: "Na statku chovali velké množství dob_tka.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo dobytek je vyjmenované slovo po B, píšeme proto tvrdé -y.",
    hint: "Dobytek patří mezi vyjmenovaná slova po B.",
  },
  {
    category: "Pravopis",
    text: "Kůň si při běhu poranil kop_to.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo kopyto je vyjmenované slovo po P, píšeme proto tvrdé -y.",
    hint: "Kopyto patří mezi vyjmenovaná slova po P.",
  },
  {
    category: "Pravopis",
    text: "Hoši i dívky se na táboře spřátelil_.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "V podmětu je alespoň jedno slovo rodu mužského životného (hoši), proto v přísudku píšeme -i, i když je přítomno i slovo rodu ženského.",
    hint: "Když je v podmětu smíšený rod a jeden z nich je mužský životný, tento rod „vyhrává“.",
  },
  {
    category: "Pravopis",
    text: "Psi na dvoře celou noc štěkal_.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation: "Podmět „psi“ je rodu mužského životného (ti psi), proto píšeme v přísudku -i: psi štěkali.",
    hint: "Zvířata v množném čísle bývají rodu mužského životného, pokud jejich jednotné číslo je mužského rodu (pes → psi).",
  },
  {
    category: "Pravopis",
    text: "Do třídy nastoupili nov_ žáci.",
    options: ["í", "ý", "é", "á"],
    correctAnswerIndex: 0,
    explanation:
      "Přídavné jméno se v 1. pádě množného čísla shoduje s podstatným jménem „žáci“ (rod mužský životný), proto píšeme koncovku -í: noví žáci.",
    hint: "Podmět „žáci“ je rodu mužského životného – přídavné jméno v 1. pádě množného čísla má pak koncovku -í.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka použita správně?",
    options: [
      "Je stejně vysoký, jako jeho bratr.",
      "Je stejně vysoký jako jeho bratr.",
      "Je vyšší, než jeho bratr.",
      "Je vyšší než, jeho bratr.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Ve srovnávacích spojeních se stejnou měrou (stejně vysoký jako) se čárka nepíše, protože „jako“ zde nezahajuje vedlejší větu, jen připojuje porovnávaný člen.",
    hint: "Čárka se před „jako“ nebo „než“ píše jen tehdy, když uvozují celou větu, ne jen jednotlivé slovo v porovnání.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použita správná interpunkce před výčtem?",
    options: [
      "Na výlet si vezmi tyto věci, baterku, mapu a láhev vody.",
      "Na výlet si vezmi tyto věci: baterku, mapu a láhev vody.",
      "Na výlet si vezmi, tyto věci: baterku, mapu a láhev vody.",
      "Na výlet si vezmi tyto věci baterku, mapu, a láhev vody.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Dvojtečka se píše po slovech, která výslovně ohlašují výčet (např. „tyto věci“), a odděluje ohlašovací část od samotného výčtu.",
    hint: "Hledej slovo, které přímo ohlašuje, že bude následovat výčet – po něm patří dvojtečka, ne čárka.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět jsou uvozovky použity správně?",
    options: [
      '„Pojď už domů,“ zavolala maminka.',
      '"Pojď už domů," zavolala maminka.',
      '„Pojď už domů", zavolala maminka.',
      '„Pojď už domů”, zavolala maminka.',
    ],
    correctAnswerIndex: 0,
    explanation:
      "V češtině se používají dolní a horní uvozovky ve tvaru „…“ (dole na začátku, nahoře na konci), ne rovné anglické uvozovky ani jiné kombinace.",
    hint: "České uvozovky mají jiný tvar než anglické – na začátku dole, na konci nahoře.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je velké/malé písmeno použito správně?",
    options: [
      "Mluví plynně Anglicky.",
      "Je to Čech, který mluví anglicky.",
      "je to čech, který mluví Anglicky.",
      "Je to čech, který mluví anglicky.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Podstatné jméno označující příslušníka národa (Čech) se píše s velkým písmenem, zatímco název jazyka jako příslovce (anglicky) se píše s malým písmenem.",
    hint: "Národnost jako podstatné jméno má velké písmeno, název jazyka jako příslovce má malé písmeno.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použita chybná předpona?",
    options: [
      "Lidé se shlukovali na náměstí.",
      "Lidé se zhlukovali na náměstí.",
      "Dav se rozptýlil.",
      "Policie zasáhla.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Spisovný tvar je „shlukovali“, nikoli „zhlukovali“ – předpona s- se pojí se slovesy vyjadřujícími spojení, shromáždění na jedno místo.",
    hint: "Předpona s-/se- se často pojí se slovesy vyjadřujícími spojení více věcí nebo osob na jedno místo.",
  },
  {
    category: "Pravopis",
    text: "Kola u vozu se rychle otáčel_.",
    options: ["a", "y", "i", "o"],
    correctAnswerIndex: 0,
    explanation: "Podmět „kola“ je rodu středního, v přísudku proto píšeme -a: kola se otáčela.",
    hint: "U podmětu rodu středního v množném čísle píšeme v přísudku -a.",
  },
  {
    category: "Pravopis",
    text: "Dělníci museli m_tit část lesa kvůli stavbě silnice.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Sloveso mýtit (kácet les) je vyjmenované slovo po M, píšeme tedy -ý-.",
    hint: "Mýtit patří mezi vyjmenovaná slova po M.",
  },
  {
    category: "Pravopis",
    text: "Na pampelišce bylo jemné bílé chm_ří.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo chmýří je vyjmenované slovo po M, píšeme tedy -ý-.",
    hint: "Chmýří patří mezi vyjmenovaná slova po M.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka použita správně?",
    options: [
      "Sluníčko zapadlo a hvězdy se rozzářily na obloze.",
      "Sluníčko zapadlo, a hvězdy se rozzářily na obloze.",
      "Umyl nádobí, a šel spát.",
      "Přišel domů a, uvařil si čaj.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Před spojkou „a“ ve slučovacím poměru (prosté spojení dvou dějů/vět) se čárka nepíše: Sluníčko zapadlo a hvězdy se rozzářily.",
    hint: "Před spojkou „a“, pokud jen prostě spojuje dvě věty bez odporovacího významu, se čárka obvykle nepíše.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je oslovení v dopise napsáno správně?",
    options: [
      "Vážený Pane řediteli,",
      "Vážený pane řediteli,",
      "vážený Pane Řediteli,",
      "Vážený, pane řediteli,",
    ],
    correctAnswerIndex: 1,
    explanation:
      "V oslovení „vážený pane řediteli“ se velké písmeno píše jen na začátku věty (Vážený), samotné oslovení „pane řediteli“ se píše s malými písmeny.",
    hint: "Velké písmeno patří jen na úplný začátek oslovení, ne ke každému slovu uvnitř něj.",
  },
  {
    category: "Pravopis",
    text: "Auta a autobusy stál_ v dlouhé koloně.",
    options: ["y", "a", "i", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět je tvořen slovy různého rodu (auta – střední, autobusy – mužský neživotný); protože žádné z nich není rodu mužského životného, ale je mezi nimi jméno jiného rodu než středního, píšeme -y: auta a autobusy stály.",
    hint: "Když je podmět tvořen slovy různého rodu bez rodu mužského životného, ale je mezi nimi i jiný rod než střední, píšeme v přísudku -y.",
  },
  {
    category: "Pravopis",
    text: "Dcery a synové odjel_ na tábor.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "V podmětu je slovo rodu mužského životného (synové), proto v přísudku píšeme -i, i když je přítomno i slovo rodu ženského (dcery).",
    hint: "Když je v podmětu smíšený rod a jeden z nich je mužský životný, tento rod „vyhrává“ a píše se -i.",
  },

  // ---- Pravopis (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Pravopis",
    text: "Ve které možnosti je přejaté slovo napsáno správně?",
    options: ["gymnázium", "gymnasium", "gymnázyum", "gymnasyum"],
    correctAnswerIndex: 0,
    explanation:
      "Spisovná podoba slova je „gymnázium“ – přípona -ium se píše s -á-, ne s -a- ani s -y-.",
    hint: "Jde o školu, kterou navštěvují starší studenti – zkus si vybavit, jak se slovo běžně píše v textech.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použit správný spisovný tvar?",
    options: [
      "Kdyby jste přišli včas, stihli byste to.",
      "Kdybyste přišli včas, stihli byste to.",
      "Kdyby jste přišli včas, stihli by jste to.",
      "Kdybyste přišli včas, stihli by jste to.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Spisovný tvar je „kdybyste“ a „stihli byste“ – podmiňovací částice se píše dohromady, tvar „by jste“ není spisovný.",
    hint: "Podmiňovací částice pro 2. osobu množného čísla se píše jako jedno slovo: byste, ne by jste.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je chyba v psaní záporu?",
    options: [
      "Nikdy jsem to neviděl.",
      "Nikdy jsem to viděl.",
      "Nic jsem neřekl.",
      "Nikoho jsem nepotkal.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Věta „Nikdy jsem to viděl“ postrádá zápor u slovesa – u záporných zájmen a příslovcí (nikdy, nikdo, nic) se v češtině zásadně používá dvojí zápor: Nikdy jsem to NEviděl.",
    hint: "V češtině se záporná zájmena a příslovce (nikdy, nikdo, nic) pojí se záporným tvarem slovesa – všimni si, kde tahle shoda chybí.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je přídavné jméno odvozené od zeměpisného názvu napsáno správně?",
    options: [
      "Navštívili jsme Pražský hrad a Českou televizi.",
      "Máme rádi český film a slovenskou hudbu.",
      "Máme rádi Český film a Slovenskou hudbu.",
      "Byli jsme na Českém trhu.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Přídavná jména odvozená od zeměpisných názvů se v běžném popisném užití píší s malým písmenem, pokud nejsou přímo součástí oficiálního vlastního jména: český film, slovenská hudba.",
    hint: "Přídavná jména jako „český“ nebo „slovenský“ se v běžném popisu píší s malým písmenem, pokud nejsou přímo součástí vlastního názvu.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je číslovka napsána pravopisně správně?",
    options: [
      "Přišlo pět set lidí.",
      "Přišlo pětset lidí.",
      "Přišlo pěct set lidí.",
      "Přišlo pjet set lidí.",
    ],
    correctAnswerIndex: 0,
    explanation: "Číslovka „pět set“ se píše jako dvě samostatná slova.",
    hint: "Zkus si představit, jak bys číslovku zapsal(a) číslicemi – 500 = pět set, dvě oddělená slova.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je použit správný tvar zájmena a podstatného jména v 7. pádě množného čísla?",
    options: [
      "Rodiče přišli se svými dětmi a jejich hračkami.",
      "Rodiče přišli se svými dětmi a jejich hračkama.",
      "Rodiče přišli se svýma dětma a jejich hračkami.",
      "Rodiče přišli se svými dětmi a jejich hračkamy.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Spisovný tvar 7. pádu množného čísla je „dětmi“ a „hračkami“, nikoli hovorové „dětma“, „hračkama“ nebo nespisovné „hračkamy“.",
    hint: "V 7. pádě množného čísla podstatných jmen píšeme spisovně koncovku -mi, ne hovorové -ma.",
  },
  {
    category: "Pravopis",
    text: "Autobusy a tramvaje dnes jezdil_ podle jízdního řádu.",
    options: ["y", "i", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět je tvořen slovy rodu mužského neživotného (autobusy) a ženského (tramvaje) – v obou případech píšeme v přísudku -y.",
    hint: "Ani jedno z podstatných jmen v podmětu není mužského rodu životného – zkus, jaká koncovka platí pro zbylé rody.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je předložka s/z napsána chybně?",
    options: [
      "Přišel s kamarádem.",
      "Sešel z hory.",
      "Sešel s hory.",
      "Vrátil se z dovolené.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Předložka „z“ se pojí s 2. pádem a vyjadřuje směr odkud (sešel z hory). Tvar „s hory“ je nespisovný, správně má být „z hory“.",
    hint: "Předložka „s“ se pojí se 7. pádem (s kým, čím?), předložka „z“ s 2. pádem (odkud, z čeho?). Zkus si na dané spojení položit otázku.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka u výčtu použita správně?",
    options: [
      "Koupili jsme jablka hrušky, banány a pomeranče.",
      "Koupili jsme jablka, hrušky, banány a pomeranče.",
      "Koupili jsme, jablka hrušky banány a pomeranče.",
      "Koupili jsme jablka, hrušky banány, a pomeranče.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Jednotlivé členy výčtu se oddělují čárkou, poslední dva členy spojené spojkou „a“ se čárkou neoddělují.",
    hint: "Čárka odděluje jednotlivé položky výčtu, ale ne poslední dvě, pokud jsou spojené spojkou „a“.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je přivlastňovací přídavné jméno napsáno správně?",
    options: ["To je Petrův pes.", "To je Petrůj pes.", "To je petrův pes.", "To je Petruv pes."],
    correctAnswerIndex: 0,
    explanation:
      "Přivlastňovací přídavné jméno odvozené od jména „Petr“ má tvar „Petrův“ – s velkým počátečním písmenem a s -ů-.",
    hint: "Přivlastňovací přídavná jména od mužských jmen mají příponu -ův (Petrův, Novákův) a píší se s velkým písmenem.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je pravopisná chyba?",
    options: [
      "Věřím ti.",
      "Objevili nový ostrov.",
      "Byl to opěvovaný hrdina.",
      "Vjezd byl zavřený, mněli jsme počkat.",
    ],
    correctAnswerIndex: 3,
    explanation:
      "Správný tvar je „měli jsme počkat“, ne „mněli jsme počkat“ – sloveso „mít“ v minulém čase se píše s -mě-, ne -mně-.",
    hint: "Zkus si sloveso časovat v přítomném čase: mám, máš, má… kořen slova neobsahuje -n-.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je slovo napsáno chybně?",
    options: [
      "Bezpečně dorazili domů.",
      "Rozhodně to zvládneme.",
      "Upřimně řečeno, nevím.",
      "Zbytečně se trápil.",
    ],
    correctAnswerIndex: 2,
    explanation: "Správně je „upřímně“ s dlouhým í, ne „upřimně“.",
    hint: "Zkus si slovo rozložit na základ „upřímný“ a příponu -ně.",
  },

  // ---- Pravopis (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Pravopis",
    text: "Po které z uvedených souhlásek píšeme vždy tvrdé -y, bez ohledu na vyjmenovaná slova?",
    options: ["b (obojetná)", "h (tvrdá)", "p (obojetná)", "v (obojetná)"],
    correctAnswerIndex: 1,
    explanation:
      "Souhláska h je tvrdá – po tvrdých souhláskách (h, ch, k, r, d, t, n) píšeme vždy y/ý, bez výjimek. Naproti tomu b, p, v jsou obojetné souhlásky, u kterých volba i/y závisí na tom, jestli je slovo vyjmenované.",
    hint: "Tvrdé souhlásky (h, ch, k, r, d, t, n) se chovají jinak než obojetné souhlásky (b, l, m, p, s, v, z), u kterých řešíme vyjmenovaná slova.",
  },
  {
    category: "Pravopis",
    text: "Po které z uvedených souhlásek píšeme vždy měkké -i, bez výjimky?",
    options: ["ž", "b", "p", "s"],
    correctAnswerIndex: 0,
    explanation:
      "Souhláska ž je měkká – po měkkých souhláskách (ž, š, č, ř, c, j, ď, ť, ň) píšeme vždy i/í, bez výjimek.",
    hint: "Měkké souhlásky se nikdy neřídí vyjmenovanými slovy – tam je volba i/y jednoznačná.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je zkratka napsána správně (s tečkou)?",
    options: ["tzn", "tzn.", "tz.n.", "tzn,"],
    correctAnswerIndex: 1,
    explanation:
      "Zkratka „tzn.“ (to znamená) se píše s tečkou na konci, protože jde o zkrácené slovo.",
    hint: "Zkratky vzniklé vynecháním části slova se v češtině obvykle píší s tečkou na konci.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je vsuvka v přímé řeči zapsána správně?",
    options: [
      "„Půjdu tam, řekl Petr, až to stihnu.“",
      "„Půjdu tam,“ řekl Petr, „až to stihnu.“",
      "„Půjdu tam“, řekl Petr, „až to stihnu“.",
      "Půjdu tam, „řekl Petr“, až to stihnu.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Pokud uvozovací věta (řekl Petr) vstupuje doprostřed přímé řeči, uzavírá se první část uvozovkami a čárkou, druhá část znovu začíná uvozovkami: „Půjdu tam,“ řekl Petr, „až to stihnu.“",
    hint: "Obě části přímé řeči musí mít svoje vlastní uvozovky, uvozovací věta mezi nimi se odděluje čárkami.",
  },
  {
    category: "Pravopis",
    text: "Policie dnes v centru města zasahoval_ proti demonstrantům.",
    options: ["a", "i", "y", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „policie“ je podstatné jméno rodu ženského v jednotném čísle (vzor růže), přísudek se s ním shoduje jako s jakýmkoli jiným ženským jménem v jednotném čísle: policie zasahovala.",
    hint: "Nenech se zmást tím, že policie tvoří skupinu lidí – gramaticky jde o jedno podstatné jméno rodu ženského v jednotném čísle.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je velké/malé písmeno použito správně?",
    options: [
      "Je Evropan a mluví evropsky.",
      "Je evropan a mluví Evropsky.",
      "Je Evropan a mluví Evropsky.",
      "Je evropan a mluví evropsky.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno označující příslušníka světadílu (Evropan) se píše s velkým písmenem jako jiná obyvatelská jména, zatímco odvozené přídavné jméno/příslovce (evropsky) se píše s malým písmenem.",
    hint: "Podstatná jména pro obyvatele/národnost mají velké písmeno, odvozená přídavná jména a příslovce se stejným základem malé.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka před spojkou „protože“ použita správně?",
    options: [
      "Nepřišel protože byl nemocný.",
      "Nepřišel, protože byl nemocný.",
      "Nepřišel protože, byl nemocný.",
      "Nepřišel, protože, byl nemocný.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Spojka „protože“ vždy uvozuje vedlejší větu, a proto se před ní píše čárka, oddělující ji od věty hlavní.",
    hint: "Spojka „protože“ vždy začíná vedlejší větu – před vedlejší větou se píše čárka.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je koncovka přídavného jména napsána správně (rod mužský životný, mn. č.)?",
    options: ["chytří kluci", "chytrí kluci", "chytří klucy", "chytrí klucy"],
    correctAnswerIndex: 0,
    explanation:
      "V koncovce přídavného jména se souhláska t před -í mění na měkké ť (chytří), proto píšeme dlouhé í. Podstatné jméno „kluci“ má koncovku -i, protože jde o rod mužský životný.",
    hint: "U tvrdých přídavných jmen dochází v mužském rodě životném množného čísla ke změkčení poslední souhlásky kmene (chytrý → chytří).",
  },
  {
    category: "Pravopis",
    text: "Jak zní správný tvar přídavného jména „mladý“ v mužském rodě životném množného čísla?",
    options: ["mladí", "mladý", "mladéí", "mladiví"],
    correctAnswerIndex: 0,
    explanation:
      "Přídavné jméno „mladý“ v mužském rodě životném množného čísla mění poslední souhlásku kmene (d → ď) a má tvar „mladí“.",
    hint: "U tvrdých přídavných jmen dochází v mužském rodě životném množného čísla ke změkčení poslední souhlásky (d→ď, t→ť, n→ň, r→ř, ch→š, h→z, k→c).",
  },
  {
    category: "Pravopis",
    text: "Jak zní správný tvar přídavného jména „drahý“ v mužském rodě životném množného čísla?",
    options: ["drazí", "drahí", "drazý", "drahiví"],
    correctAnswerIndex: 0,
    explanation:
      "Přídavné jméno „drahý“ mění v mužském rodě životném množného čísla souhlásku h na z: drazí.",
    hint: "U některých tvrdých přídavných jmen dochází ke změně poslední souhlásky kmene – h se mění na z (drahý → drazí).",
  },
  {
    category: "Pravopis",
    text: "Jak zní správný tvar přídavného jména „tichý“ v mužském rodě životném množného čísla?",
    options: ["tiší", "tichí", "tiši", "tichýí"],
    correctAnswerIndex: 0,
    explanation:
      "Přídavné jméno „tichý“ mění v mužském rodě životném množného čísla souhlásku ch na š: tiší.",
    hint: "Souhláska ch se v tomto tvaru mění na š (tichý → tiší), podobně jako h→z nebo k→c.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je datum napsáno pravopisně správně?",
    options: ["5. května 2024", "5.května 2024", "5 května 2024", "5.5.května 2024"],
    correctAnswerIndex: 0,
    explanation:
      "Za řadovou číslovkou vyjadřující den se píše tečka a mezera před názvem měsíce: 5. května 2024.",
    hint: "Řadová číslovka dne se odděluje tečkou a mezerou od slovně vypsaného měsíce.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je čárka u oslovení použita správně?",
    options: [
      "Podej mi Petře tu knihu.",
      "Podej mi, Petře, tu knihu.",
      "Podej mi Petře, tu knihu.",
      "Podej mi, Petře tu knihu.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Oslovení uprostřed věty se odděluje čárkami z obou stran: Podej mi, Petře, tu knihu.",
    hint: "Oslovení se odděluje čárkou vždy z obou stran, ať stojí na začátku, uprostřed, nebo na konci věty.",
  },
  {
    category: "Pravopis",
    text: "Farmář choval velké stádo dob_tka.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation: "Slovo „dobytek“ je vyjmenované slovo po B, píšeme tedy tvrdé -y-.",
    hint: "Dobytek patří mezi vyjmenovaná slova po B, na rozdíl od slovesa „dobýt“ (získat silou), které vyjmenované není.",
  },
  {
    category: "Pravopis",
    text: "Kovář pracoval celý den u rozžhavené v_hně.",
    options: ["ý", "í", "y", "i"],
    correctAnswerIndex: 0,
    explanation: "Slovo „výheň“ je vyjmenované slovo po V, píšeme tedy tvrdé -ý-.",
    hint: "Výheň patří mezi vyjmenovaná slova po V (vysoký, výskat, zvykat, výheň, vyžle…).",
  },
  {
    category: "Pravopis",
    text: "Ten slovník je dvojjaz_čný.",
    options: ["y", "i", "ý", "í"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „dvojjazyčný“ je odvozeno od vyjmenovaného slova „jazyk“ (skupina Z), píšeme proto -y-.",
    hint: "Slovo souvisí s vyjmenovaným slovem „jazyk“ – odvozená slova se řídí stejným pravopisem jako slovo základní.",
  },
  {
    category: "Pravopis",
    text: "V kurníku se proháněla malá kuřat_.",
    options: ["a", "y", "i", "o"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno „kuřata“ je rodu středního (podobně jako koťata, house), v přísudku proto píšeme -a.",
    hint: "Slova zakončená v množném čísle na -ata jsou rodu středního, i když jde o mláďata živých tvorů.",
  },
  {
    category: "Pravopis",
    text: "Ve které z vět je přístavek na konci věty oddělen čárkou správně?",
    options: [
      "Navštívili jsme Brno, druhé největší město České republiky.",
      "Navštívili jsme Brno druhé největší město České republiky.",
      "Navštívili jsme, Brno druhé největší město České republiky.",
      "Navštívili jsme Brno, druhé, největší město České republiky.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Přístavek na konci věty se odděluje čárkou od zbytku věty: Navštívili jsme Brno, druhé největší město České republiky.",
    hint: "Přístavek na konci věty stačí oddělit jednou čárkou, protože už za ním nic dalšího nenásleduje.",
  },
  {
    category: "Pravopis",
    text: "Ve které možnosti je zkratka napsána pravopisně správně?",
    options: ["a t d.", "atd", "atd.", "a.t.d."],
    correctAnswerIndex: 2,
    explanation: "Zkratka „atd.“ (a tak dále) se píše dohromady, s tečkou na konci.",
    hint: "Zkratka se píše jako jedno slovo zakončené tečkou, ne s mezerami mezi jednotlivými písmeny.",
  },
  {
    category: "Pravopis",
    text: "Žáci a žákyně dnes psal_ důležitý test.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "V podmětu je slovo rodu mužského životného (žáci), proto v přísudku píšeme -i, i když je přítomno i slovo rodu ženského (žákyně).",
    hint: "Když je v podmětu smíšený rod a jeden z nich je mužský životný, tento rod „vyhrává“ a píše se -i.",
  },

  // ---- Skladba (nové) ----
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Kniha, kterou jsem si vypůjčil v knihovně, byla velmi zajímavá.“",
    options: [
      "vedlejší věta přísudková",
      "vedlejší věta přívlastková",
      "vedlejší věta předmětná",
      "vedlejší věta příslovečná",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „kterou jsem si vypůjčil v knihovně“ rozvíjí podstatné jméno „kniha“ a odpovídá na otázku jaký? který? Jde tedy o větu přívlastkovou.",
    hint: "Zeptej se na vedlejší větu otázkou jaký? který? čí? Pokud sedí, jde o přívlastkovou větu.",
  },
  {
    category: "Skladba",
    text: "Které souvětí je souřadné?",
    options: [
      "Když přišel domů, hned usnul.",
      "Ačkoli pršelo, vyrazili na výlet.",
      "Nejdřív si udělal domácí úkoly, a pak si šel hrát.",
      "Protože zaspal, přišel pozdě do školy.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "V možnosti se spojkou „a pak“ jsou obě věty hlavní, rovnocenné – jde tedy o souvětí souřadné. V ostatních možnostech je jedna z vět vedlejší (podřadné souvětí).",
    hint: "V souřadném souvětí jsou obě věty rovnocenné (věty hlavní), v podřadném je jedna věta vedlejší, závislá na druhé.",
  },
  {
    category: "Skladba",
    text: "Ve které možnosti je zvýrazněné slovní spojení přívlastek NESHODNÝ? (A) zelená louka / (B) dům z cihel / (C) rychlé auto / (D) starý most",
    options: ["zelená louka", "dům z cihel", "rychlé auto", "starý most"],
    correctAnswerIndex: 1,
    explanation:
      "Neshodný přívlastek se s podstatným jménem neshoduje v pádě, čísle a rodě – typicky je vyjádřen předložkovým pádem, zde „z cihel“. Ostatní přívlastky se s podstatným jménem shodují – jde o přívlastky shodné.",
    hint: "Shodný přívlastek se mění spolu s podstatným jménem. Neshodný přívlastek zůstává ve stejném tvaru – často jde o podstatné jméno v jiném pádě nebo s předložkou.",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Kvůli dešti jsme zůstali doma.“",
    options: [
      "příslovečné určení místa",
      "příslovečné určení příčiny",
      "příslovečné určení způsobu",
      "příslovečné určení času",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Výraz „kvůli dešti“ odpovídá na otázku proč? z jakého důvodu?, jde tedy o příslovečné určení příčiny.",
    hint: "Zkus na zvýrazněný výraz položit různé otázky (kde? kdy? proč? jak?) a najdi tu, na kterou odpovídá nejpřesněji.",
  },
  {
    category: "Skladba",
    text: "Vyberte základní skladební dvojici ve větě: „Starý pes věrně hlídal celý dvůr.“",
    options: ["starý pes", "pes hlídal", "celý dvůr", "věrně hlídal"],
    correctAnswerIndex: 1,
    explanation:
      "Podmět je „pes“ (kdo, co hlídal?), přísudek je „hlídal“ (co dělal?). Ostatní slovní spojení jsou rozvíjející větné členy.",
    hint: "Najdi přísudek (co dělal?) a poté se zeptej kdo, co? – tím najdeš podmět.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Pojedeme na výlet, jakmile přestane pršet.“",
    options: [
      "vedlejší věta podmětná",
      "vedlejší věta příslovečná časová",
      "vedlejší věta příslovečná podmínková",
      "vedlejší věta předmětná",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „jakmile přestane pršet“ vyjadřuje čas (kdy pojedeme?) – jde o vedlejší větu příslovečnou časovou.",
    hint: "Zeptej se vedlejší věty otázkou kdy? Pokud odpovídá, je to věta příslovečná časová.",
  },

  // ---- Skladba (nové, druhá dávka – doplnění do 20) ----
  {
    category: "Skladba",
    text: "Jaký druh věty podle postoje mluvčího je: „Kéž by už bylo léto!“?",
    options: ["věta oznamovací", "věta tázací", "věta rozkazovací", "věta přací"],
    correctAnswerIndex: 3,
    explanation:
      "Věta vyjadřuje přání mluvčího (kéž by...), jde tedy o větu přací.",
    hint: "Všimni si slova „kéž“ – signalizuje, že mluvčí vyjadřuje přání, ne otázku nebo rozkaz.",
  },
  {
    category: "Skladba",
    text: "Jaký druh věty podle postoje mluvčího je: „Zavři prosím okno.“?",
    options: ["věta oznamovací", "věta rozkazovací", "věta přací", "věta zvolací"],
    correctAnswerIndex: 1,
    explanation: "Věta vyjadřuje rozkaz nebo žádost, jde tedy o větu rozkazovací.",
    hint: "Sloveso je v rozkazovacím způsobu (zavři) – to je typický znak věty rozkazovací.",
  },
  {
    category: "Skladba",
    text: "Je následující ukázka větou jednoduchou, nebo souvětím? „Po dlouhé procházce lesem jsme si konečně sedli k ohni.“",
    options: [
      "věta jednoduchá",
      "souvětí souřadné",
      "souvětí podřadné",
      "nelze určit",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Věta obsahuje pouze jeden přísudek (sedli jsme si), jde tedy o větu jednoduchou, i když je rozvitá.",
    hint: "Spočítej, kolik určitých slovesných tvarů (přísudků) věta obsahuje.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Kdo se bojí, nesmí do lesa.“",
    options: [
      "vedlejší věta podmětná",
      "vedlejší věta přívlastková",
      "vedlejší věta předmětná",
      "vedlejší věta příslovečná místní",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „kdo se bojí“ zastupuje podmět věty hlavní (odpovídá na otázku kdo, co?), jde tedy o vedlejší větu podmětnou.",
    hint: "Zeptej se věty hlavní otázkou kdo, co nesmí do lesa? Odpověď je vedlejší věta – to je znak podmětné věty.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Slíbil, že přijede včas.“",
    options: [
      "vedlejší věta podmětná",
      "vedlejší věta předmětná",
      "vedlejší věta přívlastková",
      "vedlejší věta doplňková",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „že přijede včas“ odpovídá na pádovou otázku předmětu (slíbil co?), jde tedy o vedlejší větu předmětnou.",
    hint: "Zeptej se slovesa v hlavní větě pádovou otázkou (koho, co?) – pokud na ni vedlejší věta odpovídá, je předmětná.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Pokud se budeš učit, uspěješ u zkoušky.“",
    options: [
      "vedlejší věta podmínková",
      "vedlejší věta příčinná",
      "vedlejší věta účelová",
      "vedlejší věta přípustková",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „pokud se budeš učit“ vyjadřuje podmínku, za které nastane děj věty hlavní – jde o vedlejší větu podmínkovou.",
    hint: "Zeptej se vedlejší větou otázkou za jaké podmínky? Spojka „pokud“ je typická pro podmínkové věty.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Přišel brzy, aby si zajistil dobré místo.“",
    options: [
      "vedlejší věta účelová",
      "vedlejší věta časová",
      "vedlejší věta způsobová",
      "vedlejší věta přívlastková",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „aby si zajistil dobré místo“ vyjadřuje účel (za jakým účelem přišel?), jde tedy o vedlejší větu účelovou.",
    hint: "Zeptej se vedlejší větou otázkou za jakým účelem? Spojka „aby“ často uvozuje účelové věty.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Ačkoli byl unavený, dokončil závod.“",
    options: [
      "vedlejší věta přípustková",
      "vedlejší věta podmínková",
      "vedlejší věta důsledková",
      "vedlejší věta místní",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „ačkoli byl unavený“ vyjadřuje okolnost, navzdory které platí děj věty hlavní – jde o vedlejší větu přípustkovou.",
    hint: "Zeptej se vedlejší větou otázkou navzdory čemu? Spojka „ačkoli“ je typická pro přípustkové věty.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Praha, hlavní město České republiky, láká turisty z celého světa.“",
    options: ["přívlastek", "přístavek", "doplněk", "předmět"],
    correctAnswerIndex: 1,
    explanation:
      "Slovní spojení „hlavní město České republiky“ blíže vysvětluje podstatné jméno „Praha“ a je od něj odděleno čárkami – jde o přístavek.",
    hint: "Hledej slovní spojení oddělené čárkami z obou stran, které blíže vysvětluje jiné podstatné jméno stojící bezprostředně před ním.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Chlapec přišel domů unavený.“",
    options: ["přívlastek", "přístavek", "doplněk", "předmět"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „unavený“ se vztahuje zároveň k podmětu (chlapec) i k přísudku (přišel) a vyjadřuje stav podmětu v okamžiku děje – jde o doplněk.",
    hint: "Hledej slovo, které se váže zároveň k podmětu i k přísudku a popisuje stav podmětu v okamžiku děje.",
  },
  {
    category: "Skladba",
    text: "Kolikanásobný přívlastek je ve větě: „Koupili jsme si velký, prostorný a světlý byt.“?",
    options: ["jednoduchý", "dvojnásobný", "trojnásobný", "čtyřnásobný"],
    correctAnswerIndex: 2,
    explanation:
      "Přívlastek je tvořen třemi rovnocennými přídavnými jmény (velký, prostorný, světlý), jde tedy o přívlastek trojnásobný (několikanásobný větný člen).",
    hint: "Spočítej, kolik rovnocenných slov odpovídá na stejnou otázku (jaký?) u podstatného jména „byt“.",
  },
  {
    category: "Skladba",
    text: "Kolik vět (základních skladebních celků s určitým slovesným tvarem) obsahuje souvětí: „Když přišel domů, najedl se a šel spát.“?",
    options: ["jedna", "dvě", "tři", "čtyři"],
    correctAnswerIndex: 2,
    explanation:
      "Souvětí obsahuje tři určité slovesné tvary (přišel, najedl se, šel), tedy tři věty: vedlejší větu časovou a dvě věty hlavní spojené souřadně.",
    hint: "Spočítej, kolikrát se v souvětí objevuje sloveso v určitém tvaru (ne v infinitivu).",
  },

  // ---- Skladba (nové, třetí dávka – doplnění do 40) ----
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Udělal to tak, jak mu bylo řečeno.“",
    options: [
      "vedlejší věta způsobová",
      "vedlejší věta místní",
      "vedlejší věta důsledková",
      "vedlejší věta měrová",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „jak mu bylo řečeno“ vyjadřuje způsob (jak to udělal?), jde tedy o vedlejší větu způsobovou.",
    hint: "Zeptej se vedlejší větou otázkou jak? Pokud odpovídá, je to věta způsobová.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Šel tam, kam ho oči vedly.“",
    options: [
      "vedlejší věta časová",
      "vedlejší věta místní",
      "vedlejší věta způsobová",
      "vedlejší věta podmětná",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „kam ho oči vedly“ vyjadřuje místo (kam šel?), jde tedy o vedlejší větu místní.",
    hint: "Zeptej se vedlejší větou otázkou kam, kde? Pokud odpovídá, je to věta místní.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Pršelo tak silně, že se ulice zaplavily.“",
    options: [
      "vedlejší věta příčinná",
      "vedlejší věta důsledková",
      "vedlejší věta účelová",
      "vedlejší věta podmínková",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „že se ulice zaplavily“ vyjadřuje důsledek intenzity deště, jde tedy o vedlejší větu důsledkovou.",
    hint: "Zeptej se, jaký byl výsledek, důsledek toho, co se dělo v hlavní větě.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Byl tak unavený, že usnul ihned po večeři.“",
    options: [
      "vedlejší věta měrová",
      "vedlejší věta místní",
      "vedlejší věta podmětná",
      "vedlejší věta přívlastková",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „že usnul ihned po večeři“ vyjadřuje míru únavy, jde tedy o vedlejší větu měrovou.",
    hint: "Věta odpovídá na otázku do jaké míry? nakolik? – vztahuje se k intenzitě vlastnosti v hlavní větě.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Setkal se s panem Novákem, ředitelem školy.“",
    options: ["přívlastek", "přístavek", "doplněk", "předmět"],
    correctAnswerIndex: 1,
    explanation:
      "Slovní spojení „ředitelem školy“ blíže vysvětluje, kým je pan Novák, a je odděleno čárkou – jde o přístavek.",
    hint: "Hledej slovní spojení oddělené čárkou, které blíže vysvětluje osobu zmíněnou těsně před ním.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Malovala pokoj bílou barvou zamyšlená.“",
    options: ["přívlastek", "přístavek", "doplněk", "příslovečné určení"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „zamyšlená“ se vztahuje zároveň k podmětu i k přísudku a vyjadřuje stav podmětu během děje – jde o doplněk.",
    hint: "Hledej slovo, které se váže zároveň k podmětu i k přísudku a popisuje, v jakém stavu podmět děj vykonával.",
  },
  {
    category: "Skladba",
    text: "Ve které z vět je podmět všeobecný (nevyjádřený, ale rozumí se „lidé“)?",
    options: [
      "Prší.",
      "V rádiu hlásili bouřku.",
      "Sníh se roztál.",
      "Kniha ležela na stole.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Ve větě „V rádiu hlásili bouřku“ není konkrétní podmět vyjádřen, ale rozumí se jím neurčitá skupina lidí – jde o podmět všeobecný.",
    hint: "Hledej větu, kde přísudek je v množném čísle, ale není jasné, kdo přesně danou činnost dělá.",
  },
  {
    category: "Skladba",
    text: "Ve které z vět není vyjádřen ani nelze doplnit žádný podmět?",
    options: ["Chlapec běžel.", "Prší.", "Maminka vaří.", "Pes štěká."],
    correctAnswerIndex: 1,
    explanation:
      "Věta „Prší“ nemá podmět a ani ho nelze doplnit – jde o větu bezpodmětou, typickou pro popis přírodních jevů.",
    hint: "Zkus u každé věty najít podmět otázkou kdo, co? U jedné z vět taková otázka vůbec nedává smysl.",
  },
  {
    category: "Skladba",
    text: "Je věta „Je mi smutno.“ jednočlenná, nebo dvojčlenná?",
    options: [
      "dvojčlenná (má podmět i přísudek)",
      "jednočlenná (nemá vyjádřený ani doplnitelný podmět)",
      "souvětí",
      "nelze určit",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Věta „Je mi smutno“ nemá podmět a ani ho nelze doplnit – jde o větu jednočlennou.",
    hint: "Zkus najít podmět – kdo, co je smutno? Pokud odpověď nedává smysl, jde o jednočlennou větu.",
  },
  {
    category: "Skladba",
    text: "Která z možností správně zapisuje přímou řeč?",
    options: [
      'Řekl mi, "že přijde pozdě."',
      'Řekl mi: "Přijdu pozdě."',
      "Řekl mi, přijdu pozdě.",
      'Řekl mi „přijdu pozdě“',
    ],
    correctAnswerIndex: 1,
    explanation:
      "Přímá řeč se odděluje dvojtečkou a uvozovkami, přičemž první písmeno uvnitř uvozovek je velké: Řekl mi: „Přijdu pozdě.“",
    hint: "Přímá řeč se uvozuje dvojtečkou, ne čárkou, a začíná velkým písmenem uvnitř uvozovek.",
  },
  {
    category: "Skladba",
    text: "Která z vět je zapsána jako nepřímá řeč?",
    options: [
      'Petr řekl: "Jsem unavený."',
      "Petr řekl, že je unavený.",
      'Petr zvolal: "Jsem unavený!"',
      '"Jsem unavený," řekl Petr.',
    ],
    correctAnswerIndex: 1,
    explanation:
      "Nepřímá řeč přetlumočuje cizí výpověď vlastními slovy mluvčího bez uvozovek, obvykle uvozena spojkou „že“: Petr řekl, že je unavený.",
    hint: "Nepřímá řeč nepoužívá uvozovky ani dvojtečku, výpověď je přetlumočena vlastními slovy, často se spojkou že.",
  },
  {
    category: "Skladba",
    text: "Kolikanásobný podmět je ve větě: „Na výlet jeli táta, máma i děti.“?",
    options: ["jednoduchý", "dvojnásobný", "trojnásobný", "čtyřnásobný"],
    correctAnswerIndex: 2,
    explanation:
      "Podmět je tvořen třemi rovnocennými slovy (táta, máma, děti), jde tedy o podmět trojnásobný.",
    hint: "Spočítej, kolik osob/věcí odpovídá na otázku kdo, co jelo na výlet?",
  },
  {
    category: "Skladba",
    text: "Určete typ přívlastku ve spojení „starý dřevěný kůl“ (přívlastky na sebe postupně navazují, nejsou zaměnitelné pořadím).",
    options: [
      "několikanásobný přívlastek",
      "postupně rozvíjející přívlastek",
      "přístavek",
      "doplněk",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Přívlastky „starý“ a „dřevěný“ na sebe postupně navazují a nejsou vzájemně zaměnitelné ani spojitelné spojkou „a“ – jde o postupně rozvíjející přívlastek.",
    hint: "Zkus mezi přívlastky vložit spojku „a“ nebo prohodit jejich pořadí – pokud věta zní nepřirozeně nebo mění význam, přívlastky na sebe navazují postupně.",
  },
  {
    category: "Skladba",
    text: "Kolik vět hlavních obsahuje souvětí: „Když přišel domů, uvařil si čaj a sedl si k oknu.“?",
    options: ["jedna", "dvě", "tři", "žádná"],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje jednu vedlejší větu časovou („Když přišel domů“) a dvě věty hlavní spojené souřadně.",
    hint: "Nejdřív najdi vedlejší větu (uvozenou spojkou „když“), zbytek jsou věty hlavní – spočítej je.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Nevím, kam schoval klíče.“",
    options: [
      "vedlejší věta přívlastková",
      "vedlejší věta předmětná",
      "vedlejší věta příslovečná místní",
      "vedlejší věta podmětná",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „kam schoval klíče“ odpovídá na pádovou otázku předmětu (nevím co?), jde tedy o vedlejší větu předmětnou, přestože obsahuje tázací výraz „kam“.",
    hint: "Zeptej se slovesa v hlavní větě pádovou otázkou (co? o čem?) – i věty uvozené výrazy jako kam, kdy mohou být předmětné.",
  },
  {
    category: "Skladba",
    text: "Který větný člen odpovídá na otázku „jaký? který? čí?“ a rozvíjí podstatné jméno?",
    options: ["přívlastek", "předmět", "příslovečné určení", "doplněk"],
    correctAnswerIndex: 0,
    explanation:
      "Přívlastek je větný člen, který rozvíjí podstatné jméno a odpovídá na otázky jaký? který? čí?",
    hint: "Tento větný člen se váže vždy na podstatné jméno, ne na sloveso.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Babička vypravovala pohádku vnoučatům.“ (zvýrazněno: pohádku)",
    options: ["podmět", "přísudek", "předmět", "přívlastek"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „pohádku“ odpovídá na pádovou otázku slovesa (vypravovala co?) – jde o předmět.",
    hint: "Zeptej se slovesa „vypravovala“ pádovou otázkou (koho, co?) – slovo, které na ni odpoví, je hledaný větný člen.",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Knihu našel pod postelí.“",
    options: [
      "příslovečné určení času",
      "příslovečné určení místa",
      "příslovečné určení způsobu",
      "příslovečné určení příčiny",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Výraz „pod postelí“ odpovídá na otázku kde?, jde tedy o příslovečné určení místa.",
    hint: "Zkus na zvýrazněný výraz položit různé otázky (kde? kdy? jak? proč?) a najdi tu, na kterou odpovídá nejpřesněji.",
  },
  {
    category: "Skladba",
    text: "Je následující ukázka větou jednoduchou, nebo souvětím? „Rychle se najedl, umyl nádobí a odešel do práce.“",
    options: ["věta jednoduchá", "souvětí souřadné", "souvětí podřadné", "nelze určit"],
    correctAnswerIndex: 1,
    explanation:
      "Věta obsahuje tři přísudky (najedl se, umyl, odešel) spojené souřadně, jde tedy o souvětí souřadné.",
    hint: "Spočítej, kolik určitých slovesných tvarů (přísudků) věta obsahuje.",
  },
  {
    category: "Skladba",
    text: "Vypište základní skladební dvojici z věty: „Bratr je učitel.“",
    options: ["bratr — je učitel", "bratr — učitel", "je — učitel", "bratr — je"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět je „bratr“, přísudek jmenný se sponou je „je učitel“ (spona „je“ + jmenná část „učitel“ tvoří dohromady přísudek).",
    hint: "U přísudku jmenného se sponou tvoří sponové sloveso (je, byl…) spolu se jmennou částí jeden přísudek.",
  },

  // ---- Skladba (nové, čtvrtá dávka) ----
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Sejdeme se v pátek.“",
    options: [
      "příslovečné určení místa",
      "příslovečné určení času",
      "příslovečné určení způsobu",
      "příslovečné určení míry",
    ],
    correctAnswerIndex: 1,
    explanation: "Výraz „v pátek“ odpovídá na otázku kdy?, jde tedy o příslovečné určení času.",
    hint: "Zkus na zvýrazněný výraz položit různé otázky (kde? kdy? jak? proč?) a najdi tu, na kterou odpovídá nejpřesněji.",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Pracoval pečlivě a soustředěně.“",
    options: [
      "příslovečné určení způsobu",
      "příslovečné určení místa",
      "příslovečné určení příčiny",
      "příslovečné určení podmínky",
    ],
    correctAnswerIndex: 0,
    explanation: "Výrazy „pečlivě a soustředěně“ odpovídají na otázku jak?, jde tedy o příslovečné určení způsobu.",
    hint: "Zkus na zvýrazněný výraz položit různé otázky (kde? kdy? jak? proč?) a najdi tu, na kterou odpovídá nejpřesněji.",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Byl unavený až k padnutí.“",
    options: [
      "příslovečné určení míry",
      "příslovečné určení času",
      "příslovečné určení místa",
      "příslovečné určení příčiny",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Výraz „až k padnutí“ vyjadřuje míru únavy, jde tedy o příslovečné určení míry.",
    hint: "Zeptej se na zvýrazněný výraz otázkou do jaké míry? nakolik?",
  },
  {
    category: "Skladba",
    text: "Určete typ přívlastku ve zvýrazněné části věty: „Viděl jsem zajímavý film.“",
    options: ["přívlastek shodný", "přívlastek neshodný", "přístavek", "doplněk"],
    correctAnswerIndex: 0,
    explanation:
      "Přívlastek „zajímavý“ se s podstatným jménem „film“ shoduje v rodě, čísle a pádě – jde o přívlastek shodný.",
    hint: "Shodný přívlastek se mění spolu s podstatným jménem (rod, číslo, pád).",
  },
  {
    category: "Skladba",
    text: "Určete typ přívlastku ve zvýrazněné části věty: „Koupil si košili s pruhy.“",
    options: ["přívlastek shodný", "přívlastek neshodný", "přístavek", "doplněk"],
    correctAnswerIndex: 1,
    explanation:
      "Přívlastek „s pruhy“ se s podstatným jménem „košili“ neshoduje v pádě – jde o přívlastek neshodný, vyjádřený předložkovým pádem.",
    hint: "Neshodný přívlastek zůstává ve stejném tvaru bez ohledu na podstatné jméno – často jde o předložkový pád.",
  },
  {
    category: "Skladba",
    text: "Jaký druh věty podle postoje mluvčího je: „Zítra pojedeme na hory.“?",
    options: ["věta oznamovací", "věta tázací", "věta přací", "věta zvolací"],
    correctAnswerIndex: 0,
    explanation: "Věta konstatuje fakt bez zvláštního citového zabarvení nebo otázky – jde o větu oznamovací.",
    hint: "Oznamovací věta jednoduše sděluje informaci, na konci má tečku.",
  },
  {
    category: "Skladba",
    text: "Jaký druh věty podle postoje mluvčího je: „To je ale krása!“?",
    options: ["věta oznamovací", "věta rozkazovací", "věta zvolací", "věta přací"],
    correctAnswerIndex: 2,
    explanation:
      "Věta vyjadřuje silný cit, úžas – jde o větu zvolací, typicky zakončenou vykřičníkem.",
    hint: "Zvolací věta vyjadřuje silné citové zabarvení a na konci má vykřičník.",
  },
  {
    category: "Skladba",
    text: "Kolik vedlejších vět obsahuje souvětí: „Řekl, že přijde, jakmile skončí práce.“?",
    options: ["jedna", "dvě", "tři", "žádná"],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje dvě vedlejší věty: předmětnou „že přijde“ a časovou „jakmile skončí práce“, obě závislé na větě hlavní „Řekl“.",
    hint: "Najdi větu hlavní (Řekl) a spočítej, kolik vět na ní závisí.",
  },
  {
    category: "Skladba",
    text: "Jaký vztah je mezi vedlejšími větami v souvětí: „Věděl, že zapomněl klíče a že přijde pozdě.“?",
    options: [
      "vedlejší věty jsou spojeny podřadně (jedna na druhé závisí)",
      "vedlejší věty jsou spojeny souřadně (jsou na sobě nezávislé, obě závisí na větě hlavní)",
      "jde jen o jednu vedlejší větu",
      "jde o souvětí bez vedlejších vět",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Obě vedlejší věty závisí stejnou měrou na větě hlavní „Věděl“ a jsou mezi sebou spojeny souřadně spojkou „a“.",
    hint: "Zkus zjistit, jestli jedna vedlejší věta závisí na druhé, nebo jestli obě závisí stejně na větě hlavní.",
  },
  {
    category: "Skladba",
    text: "Jak se nazývá vynechání větného členu, který lze snadno domyslet z kontextu, např. „Petr šel do kina, Jana (šla) do divadla.“?",
    options: ["apozice", "elipsa (výpustka)", "gradace", "inverze"],
    correctAnswerIndex: 1,
    explanation:
      "Elipsa (výpustka) je vynechání větného členu, který je zřejmý z kontextu a dá se snadno domyslet.",
    hint: "Hledej pojem pro „vynechání“ něčeho v jazyce – ve druhé části věty chybí sloveso, které si domyslíme z první části.",
  },
  {
    category: "Skladba",
    text: "Vypište přísudek z věty: „Zima byla letos mírná.“",
    options: ["byla", "byla mírná", "zima byla", "mírná"],
    correctAnswerIndex: 1,
    explanation:
      "Přísudek jmenný se sponou je tvořen sponovým slovesem „byla“ a jmennou částí „mírná“ – dohromady tvoří přísudek „byla mírná“.",
    hint: "U přísudku jmenného se sponou tvoří sponové sloveso (být) spolu se jmennou částí jeden celek.",
  },
  {
    category: "Skladba",
    text: "Vypište přísudek z věty: „Ptáci odlétají na jih.“",
    options: ["ptáci", "odlétají", "na jih", "odlétají na jih"],
    correctAnswerIndex: 1,
    explanation: "Přísudek slovesný je tvořen samotným určitým tvarem slovesa „odlétají“.",
    hint: "Přísudek slovesný je vyjádřen jen určitým tvarem slovesa, bez dalších slov.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Viděl jsem ho, jak odchází.“",
    options: [
      "vedlejší věta doplňková",
      "vedlejší věta předmětná",
      "vedlejší věta přívlastková",
      "vedlejší věta podmětná",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta doplňková rozvíjí zároveň podstatné jméno (ho) i sloveso (viděl) a vyjadřuje děj vnímaný smysly.",
    hint: "Doplňková věta se vztahuje současně k předmětu i k přísudku, podobně jako doplněk u jednoduché věty.",
  },
  {
    category: "Skladba",
    text: "Ve které z vět je čárka mezi větami hlavními použita správně?",
    options: [
      "Nejdřív se najedl, pak si šel hrát.",
      "Nejdřív se najedl pak, si šel hrát.",
      "Nejdřív se najedl pak si šel, hrát.",
      "Nejdřív se, najedl pak si šel hrát.",
    ],
    correctAnswerIndex: 0,
    explanation: "Čárka odděluje dvě věty hlavní na jejich hranici: „Nejdřív se najedl, pak si šel hrát.“",
    hint: "Čárka musí stát přesně na hranici mezi dvěma větami, ne uprostřed větného členu.",
  },
  {
    category: "Skladba",
    text: "Je souvětí „Ačkoli pršelo a foukal vítr, vyrazili na výlet.“ souřadné, nebo podřadné?",
    options: ["souřadné", "podřadné", "jde o větu jednoduchou", "nelze určit"],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje vedlejší větu přípustkovou závislou na větě hlavní – jde tedy o souvětí podřadné, i když vedlejší věta sama obsahuje dva souřadně spojené děje.",
    hint: "Najdi větu hlavní a zjisti, jestli na ní nějaká další věta závisí, nebo jsou všechny věty rovnocenné.",
  },
  {
    category: "Skladba",
    text: "Vypište základní skladební dvojici z věty: „Sestra bude lékařkou.“",
    options: ["sestra — bude", "sestra — bude lékařkou", "bude — lékařkou", "sestra — lékařkou"],
    correctAnswerIndex: 1,
    explanation:
      "Podmět je „sestra“, přísudek jmenný se sponou je „bude lékařkou“ (spona „bude“ + jmenná část „lékařkou“).",
    hint: "U přísudku jmenného se sponou tvoří sponové sloveso spolu se jmennou částí jeden přísudek.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „To je pes, jehož majitel odjel na dovolenou.“",
    options: [
      "vedlejší věta přívlastková",
      "vedlejší věta předmětná",
      "vedlejší věta podmětná",
      "vedlejší věta příslovečná",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „jehož majitel odjel na dovolenou“ rozvíjí podstatné jméno „pes“ a odpovídá na otázku čí?, jde tedy o vedlejší větu přívlastkovou.",
    hint: "Zeptej se na vedlejší větu otázkou jaký? který? čí? Pokud sedí, jde o přívlastkovou větu.",
  },
  {
    category: "Skladba",
    text: "Je ve větě „Přišli jsme pozdě.“ podmět vyjádřen samostatným slovem?",
    options: [
      "ano, podmětem je slovo „jsme“",
      "ne, podmět je vyjádřen jen koncovkou slovesa (my)",
      "věta nemá žádný podmět",
      "nelze určit",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Podmět „my“ není ve větě vyjádřen samostatným slovem, ale je patrný z koncovky slovesa „přišli jsme“ – jde o podmět nevyjádřený.",
    hint: "Zkus si k přísudku domyslet osobní zájmeno (já, ty, on, my, vy, oni) – i když ve větě není napsané, sloveso ho naznačuje.",
  },
  {
    category: "Skladba",
    text: "V souvětí „Věděl, že kniha, kterou hledal, je v knihovně.“ na čem závisí vedlejší věta „kterou hledal“?",
    options: [
      "na větě hlavní „Věděl“",
      "na vedlejší větě „že kniha… je v knihovně“ (konkrétně na slově kniha)",
      "na ničem, je to věta hlavní",
      "nelze určit",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „kterou hledal“ rozvíjí podstatné jméno „kniha“ uvnitř jiné vedlejší věty – jde tedy o vedlejší větu druhého stupně.",
    hint: "Zjisti, jaké slovo vedlejší věta „kterou hledal“ blíže vysvětluje – je to slovo z věty hlavní, nebo z jiné vedlejší věty?",
  },
  {
    category: "Skladba",
    text: "Jaký druh věty podle postoje mluvčího je: „Nechoď tam sám!“?",
    options: ["věta oznamovací", "věta rozkazovací", "věta přací", "věta tázací"],
    correctAnswerIndex: 1,
    explanation:
      "Věta vyjadřuje zákaz/rozkaz, jde tedy o větu rozkazovací, i když je záporná.",
    hint: "Rozkazovací věta vyjadřuje příkaz nebo zákaz, sloveso bývá v rozkazovacím způsobu.",
  },

  // ---- Skladba (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Umyl nádobí a uklidil pokoj.“?",
    options: ["slučovací", "odporovací", "stupňovací", "vylučovací"],
    correctAnswerIndex: 0,
    explanation:
      "Věty jsou spojeny spojkou „a“ vyjadřující prosté sečtení dějů – jde o poměr slučovací.",
    hint: "Slučovací poměr spojuje děje, které probíhají vedle sebe nebo po sobě, bez vzájemného protikladu.",
  },
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Chtěl jet na kole, ale pršelo.“?",
    options: ["slučovací", "odporovací", "důsledkový", "příčinný"],
    correctAnswerIndex: 1,
    explanation:
      "Spojka „ale“ vyjadřuje protiklad mezi ději obou vět – jde o poměr odporovací.",
    hint: "Odporovací poměr spojuje věty, jejichž obsah si vzájemně odporuje nebo je v kontrastu.",
  },
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Nejen že zapomněl klíče, ale ještě i telefon.“?",
    options: ["slučovací", "stupňovací", "vylučovací", "důsledkový"],
    correctAnswerIndex: 1,
    explanation:
      "Spojkový výraz „nejen že… ale ještě i“ vyjadřuje stupňování závažnosti druhého děje – jde o poměr stupňovací.",
    hint: "Stupňovací poměr naznačuje, že druhý děj je závažnější nebo důležitější než první.",
  },
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Buď zůstaneš doma, nebo půjdeš s námi.“?",
    options: ["slučovací", "vylučovací", "důsledkový", "příčinný"],
    correctAnswerIndex: 1,
    explanation:
      "Spojkový výraz „buď… nebo“ vyjadřuje, že platí jen jedna z možností – jde o poměr vylučovací.",
    hint: "Vylučovací poměr naznačuje, že z uvedených možností může nastat jen jedna.",
  },
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Zaspal, proto přišel pozdě.“?",
    options: ["příčinný", "důsledkový", "odporovací", "stupňovací"],
    correctAnswerIndex: 1,
    explanation:
      "Spojka „proto“ vyjadřuje důsledek toho, co bylo řečeno v první větě – jde o poměr důsledkový.",
    hint: "Důsledkový poměr vyjadřuje, co je výsledkem, důsledkem děje z předchozí věty.",
  },
  {
    category: "Skladba",
    text: "Kolik vedlejších vět obsahuje souvětí: „Řekl, že přijde, až skončí práce.“?",
    options: ["jedna", "dvě", "tři", "žádnou"],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje dvě vedlejší věty: „že přijde“ (předmětná) a „až skončí práce“ (časová, závislá na první vedlejší větě).",
    hint: "Najdi všechny určité slovesné tvary kromě toho v hlavní větě – kolik jich zbývá?",
  },
  {
    category: "Skladba",
    text: "Který znak je typický pro přístavek?",
    options: [
      "vyjadřuje čas děje",
      "blíže vysvětluje jiné podstatné jméno a odděluje se čárkou",
      "je vždy na začátku věty",
      "nemůže obsahovat podstatné jméno",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Přístavek blíže vysvětluje nebo upřesňuje jiné podstatné jméno (nejčastěji jméno osoby, místa) a odděluje se čárkou.",
    hint: "Přemýšlej, jaký je hlavní účel přístavku ve větě – co dělá s jiným větným členem.",
  },
  {
    category: "Skladba",
    text: "Jak se nazývá jev, kdy je ve větě vynechán větný člen, který si čtenář snadno domyslí z kontextu, např. „Petr šel domů, Jana do práce.“ (chybí sloveso)?",
    options: ["elipsa (výpustka)", "apozice", "inverze", "antiteze"],
    correctAnswerIndex: 0,
    explanation:
      "Elipsa je vynechání větného členu (nejčastěji přísudku), který lze snadno domyslet z kontextu.",
    hint: "Hledej pojem pro „vynechání“ slova, které by jinak muselo být zopakováno.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „To je dům, ve kterém jsem se narodil.“",
    options: [
      "vedlejší věta přívlastková",
      "vedlejší věta příslovečná místní",
      "vedlejší věta předmětná",
      "vedlejší věta podmětná",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „ve kterém jsem se narodil“ rozvíjí podstatné jméno „dům“ a odpovídá na otázku jaký? který? – jde o vedlejší větu přívlastkovou.",
    hint: "Zeptej se na vedlejší větu otázkou jaký? který? – pokud sedí, jde o přívlastkovou větu.",
  },
  {
    category: "Skladba",
    text: "Které dva větné členy tvoří základní skladební dvojici?",
    options: [
      "podmět a přísudek",
      "přívlastek a předmět",
      "doplněk a přístavek",
      "příslovečné určení a přívlastek",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Základní skladební dvojici tvoří podmět a přísudek – ostatní větné členy jsou rozvíjející.",
    hint: "Základní skladební dvojice je jádrem věty, na kterém stojí zbytek větné stavby.",
  },
  {
    category: "Skladba",
    text: "Kolikanásobná je vedlejší věta předmětná v souvětí: „Slíbil, že přijede a že pomůže s úklidem.“?",
    options: ["jednoduchá", "dvojnásobná", "trojnásobná", "žádná"],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta předmětná je zde vyjádřena dvakrát („že přijede“ a „že pomůže s úklidem“), obě závisí na stejném slovese „slíbil“ – jde o dvojnásobnou vedlejší větu.",
    hint: "Spočítej, kolikrát se v souvětí opakuje vedlejší věta uvozená spojkou „že“, závislá na stejném slovese.",
  },
  {
    category: "Skladba",
    text: "Která část věty obvykle nese novou, důležitou informaci (tzv. jádro výpovědi) v neutrálním českém slovosledu?",
    options: ["začátek věty", "konec věty", "přísudek vždy", "podmět vždy"],
    correctAnswerIndex: 1,
    explanation:
      "V neutrálním českém slovosledu bývá nová, nejdůležitější informace (jádro výpovědi) obvykle na konci věty, zatímco na začátku stojí to, co je již známé.",
    hint: "Přemýšlej, kam v běžné české větě klademe informaci, kterou chceme nejvíc zdůraznit.",
  },
  {
    category: "Skladba",
    text: "Je věta „Pes štěká.“ větou holou, nebo rozvitou?",
    options: [
      "holá (obsahuje jen základní skladební dvojici)",
      "rozvitá",
      "souvětí",
      "nelze určit",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Věta obsahuje pouze podmět a přísudek, žádný rozvíjející větný člen – jde o větu holou.",
    hint: "Věta holá obsahuje jen podmět a přísudek, bez dalších rozvíjejících členů.",
  },
  {
    category: "Skladba",
    text: "Ve které z vět je čárka před spojkou „ale“ použita správně?",
    options: [
      "Byl unavený, ale pokračoval dál.",
      "Byl unavený ale, pokračoval dál.",
      "Byl, unavený ale pokračoval dál.",
      "Byl unavený ale pokračoval, dál.",
    ],
    correctAnswerIndex: 0,
    explanation: "Čárka se píše před spojkou „ale“, na hranici vět, ne za ní ani jinde.",
    hint: "Čárka musí stát bezprostředně před spojkou, která uvozuje odporovací poměr.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Vrátil se domů zraněný.“",
    options: ["přívlastek", "doplněk", "přístavek", "předmět"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „zraněný“ se vztahuje zároveň k podmětu i k přísudku a vyjadřuje stav podmětu v okamžiku návratu – jde o doplněk.",
    hint: "Doplněk vyjadřuje stav podmětu (nebo předmětu) v průběhu děje a váže se zároveň k podmětu i přísudku.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Nepřišel, protože byl nemocný.“",
    options: [
      "vedlejší věta příčinná",
      "vedlejší věta důsledková",
      "vedlejší věta podmínková",
      "vedlejší věta přípustková",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „protože byl nemocný“ vyjadřuje příčinu (proč nepřišel?), jde tedy o vedlejší větu příčinnou.",
    hint: "Zeptej se vedlejší větou otázkou proč? z jakého důvodu? Spojka „protože“ je typická pro příčinné věty.",
  },
  {
    category: "Skladba",
    text: "Ve které z vět je čárka mezi dvěma vedlejšími větami spojenými spojkou „a“ použita správně?",
    options: [
      "Řekl, že přijde a že pomůže.",
      "Řekl že přijde, a že pomůže.",
      "Řekl, že přijde, a že pomůže.",
      "Řekl že, přijde a že pomůže.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Pokud jsou dvě vedlejší věty stejného druhu spojeny slučovací spojkou „a“, čárka mezi nimi obvykle nestojí – jen na hranici mezi větou hlavní a první vedlejší.",
    hint: "Před slučovací spojkou „a“, spojuje-li dvě věty stejného druhu, se čárka většinou nepíše.",
  },
  {
    category: "Skladba",
    text: "Kterým znakem se doplněk liší od příslovečného určení způsobu?",
    options: [
      "doplněk se váže na sloveso i podmět (nebo předmět) zároveň, příslovečné určení jen na sloveso",
      "doplněk se nikdy nevyskytuje ve větě s podmětem",
      "příslovečné určení se vždy klade na začátek věty",
      "mezi nimi není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Doplněk se váže současně na podmět (nebo předmět) i na přísudek, zatímco příslovečné určení způsobu se váže pouze na přísudek.",
    hint: "Zkus si uvědomit, na kolik větných členů se doplněk váže najednou, na rozdíl od příslovečného určení.",
  },
  {
    category: "Skladba",
    text: "Je souvětí „Slunce zapadlo a nastala tma.“ souřadné, nebo podřadné?",
    options: ["souřadné", "podřadné", "jednoduchá věta", "nelze určit"],
    correctAnswerIndex: 0,
    explanation:
      "Obě věty jsou věty hlavní, rovnocenné, spojené spojkou „a“ – jde o souvětí souřadné.",
    hint: "Zjisti, jestli je jedna z vět závislá na druhé (podřadné), nebo jsou obě rovnocenné (souřadné).",
  },
  {
    category: "Skladba",
    text: "Vypište základní skladební dvojici z věty: „Babička byla nemocná.“",
    options: ["babička — byla nemocná", "babička — byla", "byla — nemocná", "babička — nemocná"],
    correctAnswerIndex: 0,
    explanation:
      "Podmět je „babička“, přísudek jmenný se sponou je „byla nemocná“ (spona „byla“ + jmenná část „nemocná“).",
    hint: "U přísudku jmenného se sponou tvoří sponové sloveso (byla, je…) spolu se jmennou částí jeden přísudek.",
  },

  // ---- Skladba (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Skladba",
    text: "Určete podmět ve větě: „Kouřit škodí zdraví.“",
    options: ["škodí", "zdraví", "kouřit", "nelze určit"],
    correctAnswerIndex: 2,
    explanation:
      "Podmětem věty je infinitiv „kouřit“ (co škodí zdraví? – kouřit), infinitiv zde zastupuje podstatné jméno.",
    hint: "Zeptej se: co škodí zdraví? Odpovědí je právě sloveso v infinitivu.",
  },
  {
    category: "Skladba",
    text: "Určete přísudek ve větě: „Škoda mluvit.“",
    options: ["škoda mluvit", "škoda", "mluvit", "nelze určit"],
    correctAnswerIndex: 0,
    explanation:
      "Přísudek „škoda mluvit“ je jmenný beze spony – neobsahuje sponové sloveso být, jmenná část (škoda) nese celý význam přísudku sama.",
    hint: "Přísudek jmenný beze spony nemá žádné sponové sloveso (je, byl…), jmenná část stojí sama za celý přísudek.",
  },
  {
    category: "Skladba",
    text: "Který jev je ve větě zvýrazněn? „Bylo, jak se zdálo, už pozdě.“ (zvýrazněno: jak se zdálo)",
    options: ["přístavek", "vsuvka", "doplněk", "přívlastek"],
    correctAnswerIndex: 1,
    explanation:
      "Slovní spojení „jak se zdálo“ je vsuvka – věta vložená do jiné věty, která ji doplňuje, ale není s ní skladebně spojena, odděluje se čárkami.",
    hint: "Vsuvka je vložená poznámka, kterou lze z věty vypustit, aniž by se porušila její stavba.",
  },
  {
    category: "Skladba",
    text: "Jaký poměr je mezi větami hlavními: „Nešel ven, byl totiž nemocný.“?",
    options: ["příčinný", "vysvětlovací", "důsledkový", "odporovací"],
    correctAnswerIndex: 1,
    explanation:
      "Spojka „totiž“ uvozuje větu, která vysvětluje nebo upřesňuje předchozí tvrzení – jde o poměr vysvětlovací.",
    hint: "Vysvětlovací poměr upřesňuje nebo dovysvětluje to, co bylo řečeno v předchozí větě, typicky spojkou „totiž“.",
  },
  {
    category: "Skladba",
    text: "Který znak odlišuje přístavek od shodného přívlastku?",
    options: [
      "přístavek se vždy odděluje čárkami, přívlastek shodný obvykle ne",
      "přístavek nikdy neobsahuje podstatné jméno",
      "přívlastek shodný se vždy odděluje čárkami",
      "mezi nimi není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Přístavek se od podstatného jména, které rozvíjí, odděluje čárkami, zatímco shodný přívlastek (např. přídavné jméno) se čárkami neodděluje.",
    hint: "Zkus si všimnout, jestli je rozvíjející výraz oddělen čárkami, nebo plynule navazuje na podstatné jméno.",
  },
  {
    category: "Skladba",
    text: "Na které větě je závislá vedlejší věta „kterou hledal“ v souvětí: „Věděl, že kniha, kterou hledal, je v knihovně.“?",
    options: [
      "na větě hlavní „Věděl“",
      "na vedlejší větě „že kniha… je v knihovně“",
      "na obou stejně",
      "na žádné, jde o větu hlavní",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Vedlejší věta „kterou hledal“ rozvíjí podstatné jméno „kniha“ uvnitř jiné vedlejší věty – je to tedy vedlejší věta druhého stupně, závislá na jiné vedlejší větě, ne přímo na větě hlavní.",
    hint: "Zjisti, jaké slovo vedlejší věta „kterou hledal“ blíže vysvětluje – patří to slovo do věty hlavní, nebo do jiné vedlejší věty?",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Viděl ho odcházet smutného.“ (zvýrazněno: smutného)",
    options: ["přívlastek", "doplněk", "přístavek", "předmět"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „smutného“ se vztahuje zároveň k předmětu „ho“ i k ději (odcházet) – vyjadřuje stav, ve kterém předmět byl v průběhu děje – jde o doplněk vázaný na předmět.",
    hint: "Doplněk se může vázat nejen na podmět, ale i na předmět – zároveň popisuje stav této osoby a souvisí s dějem věty.",
  },
  {
    category: "Skladba",
    text: "Vypište základní skladební dvojici z věty: „Lhát se nevyplácí.“",
    options: ["lhát — se nevyplácí", "lhát — nevyplácí", "se — nevyplácí", "lhát se — nevyplácí"],
    correctAnswerIndex: 1,
    explanation:
      "Podmětem je infinitiv „lhát“, přísudek je zvratné sloveso „nevyplácí (se)“ – základní skladební dvojice je lhát — nevyplácí.",
    hint: "Podmětem může být i infinitiv (lhát), zeptej se: co se nevyplácí?",
  },
  {
    category: "Skladba",
    text: "Kolik vět hlavních a kolik vedlejších obsahuje souvětí: „Když přišel domů, uvařil si čaj, protože měl žízeň.“?",
    options: [
      "1 věta hlavní, 2 vedlejší",
      "2 věty hlavní, 1 vedlejší",
      "1 věta hlavní, 1 vedlejší",
      "3 věty hlavní",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Souvětí obsahuje jednu větu hlavní („uvařil si čaj“) a dvě vedlejší věty: časovou („Když přišel domů“) a příčinnou („protože měl žízeň“).",
    hint: "Najdi větu, na které přímo nezávisí žádná jiná věta – to je věta hlavní. Zbylé věty jsou vedlejší.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Kniha od oblíbeného autora ho nadchla.“ (zvýrazněno: od oblíbeného autora)",
    options: ["přívlastek shodný", "přívlastek neshodný", "předmět", "příslovečné určení"],
    correctAnswerIndex: 1,
    explanation:
      "Slovní spojení „od oblíbeného autora“ rozvíjí podstatné jméno „kniha“, ale neshoduje se s ním v pádě – jde o přívlastek neshodný vyjádřený předložkovým pádem.",
    hint: "Neshodný přívlastek bývá vyjádřen podstatným jménem v jiném pádě, často s předložkou, a nemění svůj tvar podle podstatného jména, které rozvíjí.",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Byl unavený až k padnutí.“",
    options: [
      "příslovečné určení míry",
      "příslovečné určení místa",
      "příslovečné určení způsobu",
      "příslovečné určení příčiny",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Výraz „až k padnutí“ vyjadřuje míru únavy (do jaké míry byl unavený?), jde tedy o příslovečné určení míry.",
    hint: "Zeptej se na zvýrazněný výraz otázkou do jaké míry? nakolik?",
  },
  {
    category: "Skladba",
    text: "Jaký druh příslovečného určení je ve větě zvýrazněn? „Bez tvé pomoci bych to nezvládl.“",
    options: [
      "příslovečné určení podmínky",
      "příslovečné určení příčiny",
      "příslovečné určení způsobu",
      "příslovečné určení místa",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Výraz „bez tvé pomoci“ vyjadřuje podmínku, za jaké by nastal/nenastal děj – jde o příslovečné určení podmínky.",
    hint: "Zeptej se: za jaké podmínky? Výraz vyjadřuje, co by muselo/nemuselo nastat, aby platil zbytek věty.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „I když byl unavený, dokončil práci.“",
    options: ["přípustková", "podmínková", "příčinná", "důsledková"],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „i když byl unavený“ vyjadřuje okolnost, navzdory které platí děj věty hlavní – jde o vedlejší větu přípustkovou.",
    hint: "Zeptej se: navzdory čemu? Spojka „i když“ je typická pro přípustkové věty, podobně jako „ačkoli“.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Co je psáno, to je dáno.“ (první věta)",
    options: ["podmětná", "přívlastková", "předmětná", "příslovečná"],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „co je psáno“ zastupuje podmět věty hlavní (to je dáno) – jde o vedlejší větu podmětnou.",
    hint: "Zjisti, na jakou otázku vedlejší věta odpovídá ve vztahu k větě hlavní – zde nahrazuje podmět „to“.",
  },
  {
    category: "Skladba",
    text: "Které větné členy patří mezi rozvíjející (nikoli základní skladební dvojici)?",
    options: [
      "podmět a přísudek",
      "předmět, přívlastek, příslovečné určení a doplněk",
      "jen přívlastek",
      "jen předmět",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Rozvíjející větné členy jsou předmět, přívlastek, příslovečné určení a doplněk – rozvíjejí buď přísudek, nebo podstatné jméno. Podmět a přísudek naopak tvoří základní skladební dvojici.",
    hint: "Základní skladební dvojici tvoří jen dva větné členy – zbytek jsou větné členy, které je rozvíjejí.",
  },
  {
    category: "Skladba",
    text: "Kolikanásobný přívlastek je ve větě: „Koupili si nový a prostorný byt.“?",
    options: ["jednoduchý", "dvojnásobný", "trojnásobný", "čtyřnásobný"],
    correctAnswerIndex: 1,
    explanation:
      "Přívlastek je tvořen dvěma rovnocennými přídavnými jmény spojenými spojkou „a“ (nový, prostorný), jde tedy o přívlastek dvojnásobný.",
    hint: "Spočítej, kolik rovnocenných slov odpovídá na otázku jaký? u podstatného jména „byt“.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Zpíval, jako by byl profesionál.“",
    options: ["způsobová", "místní", "časová", "účelová"],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „jako by byl profesionál“ vyjadřuje způsob (jak zpíval?), jde tedy o vedlejší větu způsobovou.",
    hint: "Zeptej se vedlejší větou otázkou jak? Pokud odpovídá, jde o větu způsobovou.",
  },
  {
    category: "Skladba",
    text: "Určete přísudek ve větě: „Kniha je na stole.“",
    options: ["je", "je na stole", "na stole", "kniha je"],
    correctAnswerIndex: 0,
    explanation:
      "Sloveso „je“ zde vyjadřuje existenci/polohu, nikoli spojení se jmennou částí – jde o slovesný přísudek „je“. Výraz „na stole“ je samostatné příslovečné určení místa, které přísudek rozvíjí, ale není jeho součástí.",
    hint: "Zeptej se, jestli sloveso „je“ jen spojuje podmět se jmennou částí (spona), nebo má samo plný význam (existuje, nachází se) – zde má plný význam.",
  },
  {
    category: "Skladba",
    text: "Určete druh vedlejší věty: „Zůstaň tam, kde jsi.“",
    options: ["místní", "časová", "způsobová", "podmětná"],
    correctAnswerIndex: 0,
    explanation:
      "Vedlejší věta „kde jsi“ vyjadřuje místo (kde máš zůstat?), jde tedy o vedlejší větu místní.",
    hint: "Zeptej se vedlejší větou otázkou kde? Pokud odpovídá, jde o větu místní.",
  },
  {
    category: "Skladba",
    text: "Kolik vět obsahuje souvětí: „Ptal se, kam jdeme a kdy se vrátíme.“?",
    options: ["dvě", "tři", "čtyři", "jedna"],
    correctAnswerIndex: 1,
    explanation:
      "Souvětí obsahuje tři určité slovesné tvary: ptal se (věta hlavní), kam jdeme (vedlejší věta předmětná) a kdy se vrátíme (druhá vedlejší věta předmětná, souřadně připojená) – celkem tři věty.",
    hint: "Spočítej všechny určité slovesné tvary v souvětí – kolik jich najdeš, tolik vět souvětí obsahuje.",
  },

  // ---- Tvarosloví (nové) ----
  {
    category: "Tvarosloví",
    text: "Určete slovesný rod ve větě: „Dům byl postaven za pouhé tři měsíce.“",
    options: [
      "činný rod",
      "trpný rod opisný",
      "trpný rod zvratný",
      "rod nelze určit",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „byl postaven“ je tvořeno pomocným slovesem „být“ a příčestím trpným „postaven“ – jde o trpný rod opisný.",
    hint: "Všimni si, že se sloveso skládá ze dvou částí: tvaru slovesa „být“ a příčestí trpného (postaven, napsán, uvařen). Tato kombinace má svůj vlastní název.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je nedokonavé?",
    options: ["napsat", "psát", "dopsat", "přepsat"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „psát“ vyjadřuje děj probíhající, neukončený – je nedokonavé. Ostatní slovesa vyjadřují děj ukončený nebo výsledek – jsou dokonavá.",
    hint: "Zeptej se: vyjadřuje sloveso děj, který právě probíhá (nedokonavé), nebo děj, který už skončil (dokonavé)?",
  },
  {
    category: "Tvarosloví",
    text: "V jakém pádě je podstatné jméno „dětem“ ve větě: „Babička koupila dětem zmrzlinu.“?",
    options: ["1. pád", "3. pád", "4. pád", "6. pád"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „dětem“ odpovídá na otázku komu, čemu? (koupila komu? dětem) – jde o 3. pád (dativ).",
    hint: "Zkus na dané slovo položit různé pádové otázky (koho? komu? co?) a najdi tu, která sedí nejlépe.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „růže“?",
    options: ["žena", "růže", "píseň", "kost"],
    correctAnswerIndex: 1,
    explanation:
      "Podstatné jméno „růže“ je samo vzorovým slovem pro tento typ skloňování rodu ženského (měkké skloňování).",
    hint: "Některá slova jsou přímo vzorovými slovy pro svůj vzor – zkus si vzpomenout na vzory rodu ženského.",
  },
  {
    category: "Tvarosloví",
    text: "Určete slovní druh slova „ať“ ve větě: „Ať prší nebo svítí slunce, výlet se koná.“",
    options: ["spojka", "částice", "citoslovce", "předložka"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „ať“ zde spojuje dvě možnosti („prší“ a „svítí slunce“) a uvozuje přípustkový význam – jde o spojku.",
    hint: "Zjisti, jestli slovo spojuje dvě věty nebo možnosti dohromady, nebo jen vyjadřuje citové zabarvení.",
  },
  {
    category: "Tvarosloví",
    text: "Který tvar 2. stupně přídavného jména „hezký“ je správný?",
    options: ["hezčí", "hezší", "více hezký", "nejhezčí"],
    correctAnswerIndex: 0,
    explanation:
      "Druhý stupeň (komparativ) přídavného jména „hezký“ je „hezčí“. Tvar „nejhezčí“ je až stupeň třetí (superlativ).",
    hint: "Druhý stupeň (komparativ) vyjadřuje „více“ – zde má nepravidelný, ale běžně používaný tvar.",
  },

  // ---- Tvarosloví (nové, druhá dávka – doplnění do 20) ----
  {
    category: "Tvarosloví",
    text: "V jakém pádě je podstatné jméno „deště“ ve větě: „Vyrazili jsme na procházku bez deště.“?",
    options: ["1. pád", "2. pád", "4. pád", "6. pád"],
    correctAnswerIndex: 1,
    explanation: "Předložka „bez“ se pojí s 2. pádem (bez koho, čeho? – deště).",
    hint: "Zkus na slovo položit různé pádové otázky a zjisti, se kterou z nich se předložka „bez“ obvykle pojí.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „muž“?",
    options: ["pán", "hrad", "muž", "předseda"],
    correctAnswerIndex: 2,
    explanation:
      "Podstatné jméno „muž“ je samo vzorovým slovem pro měkké skloňování mužského rodu životného.",
    hint: "Některá slova jsou přímo vzorovými slovy – zkus si vzpomenout na vzory mužského rodu (pán, hrad, muž, stroj, předseda, soudce).",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „moře“?",
    options: ["město", "moře", "kuře", "stavení"],
    correctAnswerIndex: 1,
    explanation:
      "Podstatné jméno „moře“ je samo vzorovým slovem pro měkké skloňování rodu středního.",
    hint: "Vzory rodu středního jsou město, moře, kuře a stavení – jedno z nich je přímo naše slovo.",
  },
  {
    category: "Tvarosloví",
    text: "Určete slovesný způsob ve větě: „Kdybych měl více času, dokončil bych ten projekt.“",
    options: [
      "oznamovací způsob",
      "rozkazovací způsob",
      "podmiňovací způsob",
      "žádný, jde o infinitiv",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Tvar „kdybych měl“ a „dokončil bych“ vyjadřuje podmínku a možnost, jde tedy o podmiňovací způsob.",
    hint: "Všimni si částice „by/bych/bys“ spojené s příčestím minulým slovesa – tato kombinace má svůj vlastní název mezi slovesnými způsoby.",
  },
  {
    category: "Tvarosloví",
    text: "Který tvar slovesa je v rozkazovacím způsobu?",
    options: ["čteme", "čtěte", "čtou", "četli by"],
    correctAnswerIndex: 1,
    explanation:
      "Tvar „čtěte“ vyjadřuje rozkaz nebo výzvu adresovanou druhé osobě množného čísla – jde o rozkazovací způsob.",
    hint: "Rozkazovací způsob se používá k vyjádření příkazu, výzvy nebo prosby.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je zvratné (zvratné zájmeno se/si je jeho pevnou součástí)?",
    options: ["mýt (auto)", "mýt se", "vidět", "slyšet"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „mýt se“ je zvratné – zvratné zájmeno „se“ je jeho pevnou součástí a mění význam slovesa (mýt něco × mýt se sám).",
    hint: "Zvratná slovesa mají zvratné zájmeno se/si jako neoddělitelnou součást svého základního tvaru.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je abstraktní (pojmenovává vlastnost, děj nebo stav, ne hmotnou věc)?",
    options: ["stůl", "přátelství", "kniha", "strom"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „přátelství“ pojmenovává vztah či stav, nikoli hmotnou věc – jde tedy o podstatné jméno abstraktní.",
    hint: "Abstraktní podstatná jména si nemůžeš fyzicky osahat – pojmenovávají vlastnosti, city nebo děje.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „svůj“ ve větě: „Petr si vzal svůj batoh.“?",
    options: ["osobní", "přivlastňovací", "ukazovací", "tázací"],
    correctAnswerIndex: 1,
    explanation:
      "Zájmeno „svůj“ vyjadřuje přivlastnění (čí batoh? – svůj), jde tedy o zájmeno přivlastňovací.",
    hint: "Zeptej se na zvýrazněné slovo otázkou čí? Pokud odpovídá, jde o zájmeno vyjadřující vlastnictví.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh číslovky je slovo „třetí“ ve větě: „Přišel jsem na závody jako třetí.“?",
    options: ["základní", "řadová", "druhová", "násobná"],
    correctAnswerIndex: 1,
    explanation:
      "Číslovka „třetí“ vyjadřuje pořadí (kolikátý?), jde tedy o číslovku řadovou.",
    hint: "Zeptej se na zvýrazněné slovo otázkou kolikátý? – to je typická otázka řadových číslovek.",
  },
  {
    category: "Tvarosloví",
    text: "Ve kterém tvaru je sloveso ve 2. osobě množného čísla?",
    options: ["píšu", "píšeš", "píšete", "píší"],
    correctAnswerIndex: 2,
    explanation: "Tvar „píšete“ odpovídá 2. osobě množného čísla (vy píšete).",
    hint: "Zkus si ke každému tvaru přiřadit odpovídající zájmeno (já, ty, on, my, vy, oni) – hledáš tvar pro „vy“.",
  },
  {
    category: "Tvarosloví",
    text: "Které přídavné jméno patří mezi měkká (skloňuje se podle vzoru jarní)?",
    options: ["mladý", "letní", "pěkný", "starý"],
    correctAnswerIndex: 1,
    explanation:
      "Přídavné jméno „letní“ se skloňuje podle měkkého vzoru jarní. Ostatní uvedená přídavná jména jsou tvrdá, skloňují se podle vzoru mladý.",
    hint: "Měkká přídavná jména mají ve všech tvarech koncovky s -í/-ího apod., podobně jako slovo „jarní“.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je pomnožné (má pouze tvar množného čísla)?",
    options: ["dveře", "stůl", "okno", "zeď"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „dveře“ existuje pouze v množném čísle (pomnožné podstatné jméno) – nelze říct „jedna dveř“ ve stejném významu.",
    hint: "Zkus si od každého slova utvořit jednotné číslo – u jednoho z nich to gramaticky nedává smysl, protože existuje jen v množném čísle.",
  },

  // ---- Tvarosloví (nové, třetí dávka – doplnění do 40) ----
  {
    category: "Tvarosloví",
    text: "V jakém pádě je podstatné jméno „kamarádovi“ ve větě: „Půjčil knihu kamarádovi.“?",
    options: ["2. pád", "3. pád", "6. pád", "7. pád"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „kamarádovi“ odpovídá na otázku komu, čemu? (půjčil komu? kamarádovi) – jde o 3. pád.",
    hint: "Zkus na dané slovo položit různé pádové otázky (koho? komu? kým?) a najdi tu, která sedí nejlépe.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „žena“?",
    options: ["pán", "žena", "píseň", "kost"],
    correctAnswerIndex: 1,
    explanation: "Podstatné jméno „žena“ je samo vzorovým slovem pro tvrdé skloňování rodu ženského.",
    hint: "Vzory rodu ženského jsou žena, růže, píseň a kost – jedno z nich je přímo naše slovo.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „kost“?",
    options: ["žena", "růže", "píseň", "kost"],
    correctAnswerIndex: 3,
    explanation:
      "Podstatné jméno „kost“ je samo vzorovým slovem pro tvrdé skloňování souhláskových jmen rodu ženského.",
    hint: "Vzor je přímo totožný se zadaným slovem.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „píseň“?",
    options: ["žena", "růže", "píseň", "kost"],
    correctAnswerIndex: 2,
    explanation:
      "Podstatné jméno „píseň“ je samo vzorovým slovem pro měkké skloňování souhláskových jmen rodu ženského.",
    hint: "Vzor je přímo totožný se zadaným slovem.",
  },
  {
    category: "Tvarosloví",
    text: "Podle jakého vzoru se skloňuje podstatné jméno „předseda“?",
    options: ["pán", "předseda", "muž", "soudce"],
    correctAnswerIndex: 1,
    explanation:
      "Podstatné jméno „předseda“ je samo vzorovým slovem pro skloňování mužských jmen zakončených na -a.",
    hint: "Vzor je přímo totožný se zadaným slovem – jde o mužská jména zakončená na -a.",
  },
  {
    category: "Tvarosloví",
    text: "V jakém slovesném čase je sloveso ve větě: „Zítra dokončíme projekt.“?",
    options: ["minulý čas", "přítomný čas", "budoucí čas", "nelze určit"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „zítra“ a tvar „dokončíme“ vyjadřují děj, který teprve nastane – jde o budoucí čas.",
    hint: "Všimni si příslovce „zítra“ – naznačuje, kdy se děj odehraje.",
  },
  {
    category: "Tvarosloví",
    text: "V jakém slovesném čase je sloveso ve větě: „Včera jsme navštívili babičku.“?",
    options: ["minulý čas", "přítomný čas", "budoucí čas", "nelze určit"],
    correctAnswerIndex: 0,
    explanation:
      "Tvar „navštívili jsme“ s příslovcem „včera“ vyjadřuje děj, který se odehrál v minulosti.",
    hint: "Všimni si příslovce „včera“ a příčestí minulého ve slovesném tvaru.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „tento“ ve větě: „Tento dům patří mému strýci.“?",
    options: ["osobní", "ukazovací", "tázací", "neurčité"],
    correctAnswerIndex: 1,
    explanation:
      "Zájmeno „tento“ ukazuje na konkrétní věc (dům) – jde tedy o zájmeno ukazovací.",
    hint: "Zjisti, jestli slovo ukazuje na konkrétní, blízkou věc nebo osobu, nebo jestli spíš uvozuje otázku či vyjadřuje vlastnictví.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „kdo“ ve větě: „Kdo přišel na návštěvu?“?",
    options: ["osobní", "přivlastňovací", "tázací", "záporné"],
    correctAnswerIndex: 2,
    explanation: "Zájmeno „kdo“ se používá k vytvoření otázky – jde tedy o zájmeno tázací.",
    hint: "Zjisti, jestli se pomocí daného slova vytváří otázka, nebo jestli spíš ukazuje na něco konkrétního či vyjadřuje vlastnictví.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „nikdo“ ve větě: „Nikdo mi nezavolal.“?",
    options: ["neurčité", "záporné", "ukazovací", "přivlastňovací"],
    correctAnswerIndex: 1,
    explanation:
      "Zájmeno „nikdo“ vyjadřuje zápor, absenci osoby – jde tedy o zájmeno záporné.",
    hint: "Záporná zájmena obsahují předponu ni- a vyjadřují, že něco/někdo neexistuje (nikdo, nic, nijaký, ničí).",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh číslovky je slovo „pět“ ve větě: „Koupil pět jablek.“?",
    options: ["základní", "řadová", "druhová", "násobná"],
    correctAnswerIndex: 0,
    explanation: "Číslovka „pět“ vyjadřuje počet (kolik?), jde tedy o číslovku základní.",
    hint: "Zjisti, na jakou otázku slovo odpovídá – kolik? kolikátý? kolikerý? kolikrát? Každá z nich patří jinému druhu číslovky.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh číslovky je slovo „dvojí“ ve větě: „Měl dvojí názor na věc.“?",
    options: ["základní", "řadová", "druhová", "násobná"],
    correctAnswerIndex: 2,
    explanation:
      "Číslovka „dvojí“ vyjadřuje druh nebo způsob (jaký druh, kolikerý?), jde tedy o číslovku druhovou.",
    hint: "Zeptej se otázkou kolikerý, jaký druh? – to je typická otázka druhových číslovek.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh číslovky je slovo „třikrát“ ve větě: „Zavolal mi třikrát.“?",
    options: ["základní", "řadová", "druhová", "násobná"],
    correctAnswerIndex: 3,
    explanation:
      "Číslovka „třikrát“ vyjadřuje, kolikrát se děj opakoval, jde tedy o číslovku násobnou.",
    hint: "Zeptej se otázkou kolikrát? – to je typická otázka násobných číslovek.",
  },
  {
    category: "Tvarosloví",
    text: "Která z uvedených předložek je nevlastní (odvozená z jiného slovního druhu)?",
    options: ["v", "na", "kolem", "z"],
    correctAnswerIndex: 2,
    explanation:
      "Předložka „kolem“ je nevlastní, protože vznikla z jiného slovního druhu (příslovce). Předložky „v“, „na“ a „z“ jsou vlastní (prvotní, neodvozené).",
    hint: "Zkus zjistit, jestli předložka mohla dřív fungovat i jako jiný slovní druh (nejčastěji příslovce) – to je typický znak nevlastních předložek.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh spojky je slovo „nebo“ ve větě: „Půjdeme do kina, nebo zůstaneme doma.“?",
    options: ["spojka souřadicí", "spojka podřadicí", "částice", "předložka"],
    correctAnswerIndex: 0,
    explanation:
      "Spojka „nebo“ spojuje dvě rovnocenné věty hlavní – jde o spojku souřadicí (vylučovací poměr).",
    hint: "Souřadicí spojky spojují rovnocenné větné celky (a, ale, nebo, i, proto).",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh spojky je slovo „protože“ ve větě: „Zůstal doma, protože byl nemocný.“?",
    options: ["spojka souřadicí", "spojka podřadicí", "částice", "citoslovce"],
    correctAnswerIndex: 1,
    explanation:
      "Spojka „protože“ uvozuje vedlejší větu závislou na větě hlavní – jde o spojku podřadicí.",
    hint: "Podřadicí spojky uvozují vedlejší věty (protože, že, aby, když, pokud).",
  },
  {
    category: "Tvarosloví",
    text: "Které slovo je ve větě citoslovcem? „Bum! Auto narazilo do stromu.“",
    options: ["Bum", "Auto", "narazilo", "stromu"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „Bum“ napodobuje zvuk nárazu a nezapojuje se běžně do větné stavby – jde o citoslovce.",
    hint: "Hledej slovo, které nezapadá do větné stavby jako podmět, přísudek ani jiný větný člen a jen napodobuje zvuk nebo vyjadřuje pocit.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je rod a životnost podstatného jména „had“?",
    options: ["mužský životný", "mužský neživotný", "ženský", "střední"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno „had“ je rodu mužského životného – skloňuje se podle vzoru pán (had, hada, hadovi…), přičemž ve 4. pádě má stejný tvar jako ve 2. pádě (vidím hada), což je typický znak životnosti.",
    hint: "Zkus si utvořit 4. pád: vidím... hada, nebo had? Životná jména mají ve 4. pádě stejný tvar jako ve 2. pádě.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je hromadné (označuje víc kusů jako jeden celek)?",
    options: ["strom", "listí", "kámen", "dům"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „listí“ je hromadné podstatné jméno – označuje množství jednotlivých listů jako jeden celek, gramaticky má jen tvar jednotného čísla.",
    hint: "Zjisti, které slovo označuje víc jednotlivých kusů dohromady jako jeden celek a gramaticky má jen tvar jednotného čísla.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je látkové (označuje látku, kterou lze dělit na menší části stejné podstaty)?",
    options: ["auto", "mouka", "kniha", "židle"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „mouka“ je látkové podstatné jméno – označuje látku, jejíž libovolná část je stále mouka. Ostatní slova označují jednotlivé, dělitelné předměty.",
    hint: "Hledej slovo označující hmotu, jejíž libovolná menší část je pořád stejná látka – na rozdíl od předmětů, které dělením přestávají být tím, čím byly.",
  },

  // ---- Tvarosloví (nové, čtvrtá dávka) ----
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „někdo“ ve větě: „Někdo zaklepal na dveře.“?",
    options: ["osobní", "neurčité", "záporné", "ukazovací"],
    correctAnswerIndex: 1,
    explanation: "Zájmeno „někdo“ označuje blíže neurčenou osobu – jde tedy o zájmeno neurčité.",
    hint: "Neurčitá zájmena obsahují předponu ně- a označují osobu nebo věc, kterou přesně neznáme (někdo, něco, některý).",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „který“ ve větě: „Kniha, kterou jsem četl, byla zajímavá.“?",
    options: ["tázací", "vztažné", "ukazovací", "neurčité"],
    correctAnswerIndex: 1,
    explanation:
      "Zájmeno „který“ zde uvozuje vedlejší větu a odkazuje zpět na podstatné jméno „kniha“ – jde o zájmeno vztažné.",
    hint: "Vztažná zájmena se používají k uvození vedlejších vět a odkazují na slovo v hlavní větě (který, jenž, co, kdo).",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „se“ ve větě: „Podíval se do zrcadla.“?",
    options: ["osobní", "zvratné", "přivlastňovací", "ukazovací"],
    correctAnswerIndex: 1,
    explanation: "Zájmeno „se“ odkazuje zpět na podmět (podíval sám sebe) – jde o zájmeno zvratné.",
    hint: "Zvratná zájmena (se, si, sebe) vyjadřují, že děj se vrací zpět k původci děje.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný 3. pád osobního zájmena „já“ ve větě: „Dej ___ tu knihu.“?",
    options: ["mě", "mně", "mnou", "moje"],
    correctAnswerIndex: 1,
    explanation: "3. pád (komu, čemu?) osobního zájmena „já“ je „mně“: Dej mně tu knihu.",
    hint: "Zeptej se: dej komu? – to je otázka 3. pádu.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „dobrý“?",
    options: ["dobřejší", "lepší", "nejlepší", "více dobrý"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „dobrý“ se stupňuje nepravidelně: dobrý – lepší – nejlepší.",
    hint: "Některá přídavná jména se stupňují nepravidelně, ne pouhým přidáním přípony.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „špatný“?",
    options: ["špatnější", "horší", "nejhorší", "více špatný"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „špatný“ se stupňuje nepravidelně: špatný – horší – nejhorší.",
    hint: "Některá přídavná jména se stupňují nepravidelně.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „velký“?",
    options: ["velčí", "větší", "největší", "více velký"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „velký“ se stupňuje nepravidelně: velký – větší – největší.",
    hint: "Zkus si vzpomenout na nepravidelné stupňování tohoto slova.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je dokonavé?",
    options: ["nosit", "přinést", "nést", "nosívat"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „přinést“ vyjadřuje ukončený, jednorázový děj – je dokonavé. Ostatní slovesa vyjadřují děj probíhající nebo opakovaný – jsou nedokonavá.",
    hint: "Dokonavé sloveso vyjadřuje děj, který má jasný začátek a konec, výsledek.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso tvoří vidovou dvojici (nedokonavý protějšek) ke slovesu „koupit“?",
    options: ["kupovat", "prodávat", "koupat", "kopat"],
    correctAnswerIndex: 0,
    explanation:
      "Vidovou dvojici ke slovesu „koupit“ (dokonavé) tvoří sloveso „kupovat“ (nedokonavé) – vyjadřují stejný děj, liší se jen videm.",
    hint: "Hledej sloveso se stejným základním významem (nakupování), jen vyjadřující děj probíhající, ne ukončený.",
  },
  {
    category: "Tvarosloví",
    text: "Který slovesný tvar je infinitiv?",
    options: ["čte", "číst", "četl", "čtěte"],
    correctAnswerIndex: 1,
    explanation:
      "Infinitiv je neurčitý tvar slovesa, který nevyjadřuje osobu ani číslo a končí obvykle na -t/-ci: číst.",
    hint: "Infinitiv je základní, neurčitý tvar slovesa, který najdeš i jako heslo ve slovníku.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný tvar minulého času slovesa „jít“ v mužském rodě, jednotném čísle?",
    options: ["jel", "šel", "jdel", "chodil"],
    correctAnswerIndex: 1,
    explanation: "Sloveso „jít“ má v minulém čase nepravidelný tvar „šel“ (ne „jdel“).",
    hint: "Sloveso „jít“ patří mezi nepravidelná slovesa – jeho minulý čas se netvoří pravidelně od infinitivu.",
  },
  {
    category: "Tvarosloví",
    text: "Jakého rodu je nesklonné podstatné jméno „kupé“?",
    options: ["mužský", "ženský", "střední", "nelze určit"],
    correctAnswerIndex: 2,
    explanation:
      "Nesklonná přejatá podstatná jména zakončená na -é bývají zpravidla rodu středního, např. kupé, atelié.",
    hint: "Zkus si vzpomenout na jiná nesklonná přejatá slova zakončená na -é (atelié, kupé) a jaký rod jim čeština obvykle přisuzuje.",
  },
  {
    category: "Tvarosloví",
    text: "Ve které z vět je použita správná podoba předložky?",
    options: ["Šel k škole.", "Šel ke škole.", "Šel ke škola.", "Šel k škola."],
    correctAnswerIndex: 1,
    explanation:
      "Před slovy začínajícími na souhláskovou skupinu podobnou počáteční souhlásce předložky se používá rozšířená podoba předložky „ke“: ke škole.",
    hint: "Před některými souhláskovými skupinami se předložky k, s, v, z rozšiřují na ke, se, ve, ze.",
  },
  {
    category: "Tvarosloví",
    text: "Které slovo je ve větě přechodníkem? „Zpívajíc si, šla po ulici.“",
    options: ["Zpívajíc", "si", "šla", "ulici"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „zpívajíc“ je přechodník přítomný slovesa zpívat, vyjadřuje děj probíhající současně s dějem hlavního slovesa.",
    hint: "Přechodník je neohebný slovesný tvar končící obvykle na -c, -ouc, -ouce, vyjadřující doprovodný děj.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je pomnožné?",
    options: ["housle", "klavír", "flétna", "buben"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „housle“ existuje pouze v množném čísle (pomnožné podstatné jméno), i když označuje jeden hudební nástroj.",
    hint: "Pomnožná podstatná jména označují jednu věc, ale gramaticky mají jen tvar množného čísla.",
  },
  {
    category: "Tvarosloví",
    text: "Určete slovesný rod ve větě: „Dům se staví už druhým rokem.“",
    options: ["činný rod", "trpný rod opisný", "trpný rod zvratný", "rod nelze určit"],
    correctAnswerIndex: 2,
    explanation:
      "Sloveso „se staví“ vyjadřuje trpný rod pomocí zvratného zájmena „se“ – jde o trpný rod zvratný.",
    hint: "Všimni si zvratného zájmena „se“ připojeného k slovesu v jinak činném tvaru – taková konstrukce má svůj vlastní název mezi slovesnými rody.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je konkrétní (pojmenovává hmotnou věc)?",
    options: ["štěstí", "láska", "židle", "radost"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „židle“ pojmenovává hmotný, fyzicky existující předmět – je tedy konkrétní. Ostatní slova pojmenovávají city a stavy – jsou abstraktní.",
    hint: "Konkrétní podstatná jména si můžeš fyzicky osahat, na rozdíl od pocitů a vlastností.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh číslovky je slovo „oba“ ve větě: „Oba bratři odjeli na výlet.“?",
    options: ["základní", "řadová", "druhová", "násobná"],
    correctAnswerIndex: 0,
    explanation:
      "Číslovka „oba“ vyjadřuje počet (oba = oba dva) a řadí se mezi číslovky základní.",
    hint: "Slovo „oba“ v podstatě znamená „dva“ – zeptej se otázkou kolik?",
  },
  {
    category: "Tvarosloví",
    text: "Určete slovní druh slova „snad“ ve větě: „Snad už brzy přestane pršet.“",
    options: ["příslovce", "částice", "spojka", "citoslovce"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „snad“ vyjadřuje postoj mluvčího (nejistotu, naději) a nezapojuje se do větné stavby jako větný člen – jde o částici.",
    hint: "Zjisti, jestli slovo je platným větným členem, nebo jen vyjadřuje postoj či pocit mluvčího k obsahu věty.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je zvratné?",
    options: ["číst", "bát se", "psát", "malovat"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „bát se“ je zvratné – zvratné zájmeno „se“ je jeho neoddělitelnou součástí (nelze říct jen „bát“ ve stejném významu).",
    hint: "Zkus sloveso použít bez zájmena „se“ – pokud to nedává smysl nebo mění význam, jde o zvratné sloveso.",
  },

  // ---- Tvarosloví (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Tvarosloví",
    text: "V jakém pádě je podstatné jméno „lese“ ve větě: „Bydleli v lese.“?",
    options: ["1. pád", "4. pád", "6. pád", "7. pád"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „lese“ odpovídá na otázku o kom, o čem? (bydleli v čem? v lese) – jde o 6. pád (lokál).",
    hint: "Zkus na slovo položit otázku 6. pádu: o kom, o čem? (často s předložkami v, na, o, po, při).",
  },
  {
    category: "Tvarosloví",
    text: "V jakém pádě je podstatné jméno „kamarádem“ ve větě: „Šel do kina s kamarádem.“?",
    options: ["3. pád", "4. pád", "6. pád", "7. pád"],
    correctAnswerIndex: 3,
    explanation: "Slovo „kamarádem“ odpovídá na otázku s kým, s čím? – jde o 7. pád (instrumentál).",
    hint: "Zkus na slovo položit otázku 7. pádu: s kým, s čím?",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „sebe“ ve větě: „Myslel jen na sebe.“?",
    options: ["osobní zvratné", "přivlastňovací", "ukazovací", "neurčité"],
    correctAnswerIndex: 0,
    explanation:
      "Zájmeno „sebe“ odkazuje zpět na podmět věty (na sebe = na toho, kdo myslí) – jde o zvratné osobní zájmeno.",
    hint: "Zvratná zájmena (se, sebe, si) odkazují zpět na podmět děje – označují, že děj směřuje k němu samému.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „někdo“ ve větě: „Někdo zaklepal na dveře.“?",
    options: ["osobní", "neurčité", "tázací", "záporné"],
    correctAnswerIndex: 1,
    explanation:
      "Zájmeno „někdo“ označuje blíže neurčenou osobu – jde o zájmeno neurčité.",
    hint: "Neurčitá zájmena obsahují předponu ně- a označují osobu nebo věc, kterou přesně neznáme.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „dobrý“?",
    options: ["dobřejší", "lepší", "více dobrý", "nejlepší"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „dobrý“ má nepravidelné stupňování: dobrý – lepší – nejlepší.",
    hint: "Některá přídavná jména se stupňují zcela nepravidelně, ne pouhým přidáním přípony -ější.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „špatný“?",
    options: ["špatnější", "horší", "více špatný", "nejhorší"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „špatný“ má nepravidelné stupňování: špatný – horší – nejhorší.",
    hint: "Stejně jako u slova „dobrý“ jde o nepravidelné stupňování – druhý stupeň má úplně jiný základ.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je 2. stupeň přídavného jména „velký“?",
    options: ["velčí", "větší", "více velký", "nejvelčí"],
    correctAnswerIndex: 1,
    explanation: "Přídavné jméno „velký“ má nepravidelné stupňování: velký – větší – největší.",
    hint: "I toto přídavné jméno patří mezi nepravidelně stupňovaná.",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je dokonavé?",
    options: ["číst", "přečíst", "psát", "malovat"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „přečíst“ vyjadřuje ukončený děj s výsledkem – je dokonavé. Ostatní slovesa vyjadřují děj probíhající – jsou nedokonavá.",
    hint: "Zeptej se: vyjadřuje sloveso děj, který už skončil a má výsledek (dokonavé), nebo který právě probíhá (nedokonavé)?",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso tvoří vidovou dvojici ke slovesu „psát“ (dokonavá podoba téhož děje)?",
    options: ["čítat", "napsat", "psávat", "píšu"],
    correctAnswerIndex: 1,
    explanation:
      "Sloveso „napsat“ je dokonavá podoba k nedokonavému „psát“ – vyjadřují stejný děj, jen s různým videm.",
    hint: "Hledej sloveso, které vyjadřuje stejnou činnost jako „psát“, ale jako ukončený, výsledný děj.",
  },
  {
    category: "Tvarosloví",
    text: "Který slovesný tvar je infinitiv?",
    options: ["čte", "číst", "četl", "čtoucí"],
    correctAnswerIndex: 1,
    explanation:
      "Infinitiv je neurčitý (základní) tvar slovesa, zakončený obvykle na -t nebo -ci (číst, psát, moci).",
    hint: "Infinitiv je tvar slovesa, který najdeš ve slovníku – nemá určitou osobu ani číslo.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný tvar číslovky „dva“ ve 3. pádě (komu, čemu)?",
    options: ["dvěma", "dvouma", "dvoum", "dvěmi"],
    correctAnswerIndex: 0,
    explanation: "Číslovka „dva“ má ve 3. (a 7.) pádě tvar „dvěma“.",
    hint: "Tvar této číslovky ve 3. a 7. pádě je stejný a je nepravidelný.",
  },
  {
    category: "Tvarosloví",
    text: "Který tvar číslovky „jeden“ je ve 4. pádě rodu ženského (vidím...)?",
    options: ["jednoho", "jednu", "jedno", "jeden"],
    correctAnswerIndex: 1,
    explanation:
      "Číslovka „jeden“ se skloňuje podle rodu – ve 4. pádě rodu ženského má tvar „jednu“ (vidím jednu knihu).",
    hint: "Zkus si dosadit podstatné jméno rodu ženského, např. kniha – jaký tvar číslovky by k němu pasoval?",
  },
  {
    category: "Tvarosloví",
    text: "S jakým pádem se pojí předložka „o“ ve větě: „Mluvili o filmu.“?",
    options: ["4. pád", "6. pád", "7. pád", "2. pád"],
    correctAnswerIndex: 1,
    explanation:
      "Předložka „o“ ve významu „o něčem“ se pojí se 6. pádem (o kom, o čem? – o filmu).",
    hint: "Zkus na spojení položit otázku 6. pádu: o kom, o čem?",
  },
  {
    category: "Tvarosloví",
    text: "Které slovo je ve větě částicí? „Prý bude pršet.“",
    options: ["Prý", "bude", "pršet", "nic z toho"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „prý“ vyjadřuje, že mluvčí přejímá informaci od někoho jiného, a nezapojuje se do větné stavby jako platný větný člen – jde o částici.",
    hint: "Částice vyjadřují postoj mluvčího k obsahu výpovědi a nejsou platným větným členem.",
  },
  {
    category: "Tvarosloví",
    text: "Doplňte správný tvar přídavného jména: „Viděli jsme (velký) auta na výstavě.“",
    options: ["velká", "velký", "velcí", "velké"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno „auta“ je rodu středního v množném čísle, přídavné jméno se s ním shoduje v koncovce -á: velká auta.",
    hint: "Zjisti rod a číslo podstatného jména „auta“ a přizpůsob tomu koncovku přídavného jména.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených podstatných jmen je konkrétní (pojmenovává hmotnou věc, kterou lze vnímat smysly)?",
    options: ["láska", "židle", "radost", "pravda"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „židle“ pojmenovává hmotný předmět, který lze vidět a osahat – jde o podstatné jméno konkrétní. Ostatní slova jsou abstraktní.",
    hint: "Hledej slovo, které označuje věc, kterou si můžeš fyzicky osahat, ne pocit nebo vlastnost.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je rod podstatného jména „house“ (mládě husy)?",
    options: ["mužský", "ženský", "střední", "nelze určit"],
    correctAnswerIndex: 2,
    explanation:
      "Podstatné jméno „house“ je rodu středního, skloňuje se podle vzoru „kuře“ (house, house, houseti…).",
    hint: "Slova označující mláďata zvířat zakončená na -e bývají rodu středního a skloňují se podle vzoru kuře.",
  },
  {
    category: "Tvarosloví",
    text: "Ve kterém tvaru je sloveso v 1. osobě množného čísla?",
    options: ["píšu", "píšeš", "píšeme", "píší"],
    correctAnswerIndex: 2,
    explanation: "Tvar „píšeme“ odpovídá 1. osobě množného čísla (my píšeme).",
    hint: "Zkus si ke každému tvaru přiřadit odpovídající zájmeno – hledáš tvar pro „my“.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh přídavného jména je slovo „matčin“ ve větě: „To je matčin svetr.“?",
    options: ["druhové", "přivlastňovací", "jakostní", "zájmenné"],
    correctAnswerIndex: 1,
    explanation:
      "Přídavné jméno „matčin“ vyjadřuje, komu svetr patří – jde o přídavné jméno přivlastňovací.",
    hint: "Přivlastňovací přídavná jména odpovídají na otázku čí? a jsou odvozená od podstatných jmen označujících osobu.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh přídavného jména je slovo „zelený“ ve větě: „Měl zelený svetr.“?",
    options: ["přivlastňovací", "druhové", "jakostní", "zájmenné"],
    correctAnswerIndex: 2,
    explanation:
      "Přídavné jméno „zelený“ vyjadřuje vlastnost (jakou barvu svetr má) – jde o přídavné jméno jakostní.",
    hint: "Jakostní přídavná jména odpovídají na otázku jaký? a vyjadřují vlastnost, ne příslušnost k někomu.",
  },

  // ---- Tvarosloví (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Tvarosloví",
    text: "V jakém pádě je oslovení „Petře“ ve větě: „Petře, pojď sem!“?",
    options: ["1. pád", "4. pád", "5. pád", "6. pád"],
    correctAnswerIndex: 2,
    explanation:
      "Oslovení „Petře“ je v 5. pádě (vokativu), který se používá právě pro přímé oslovení osoby.",
    hint: "Pátý pád (vokativ) se používá speciálně pro oslovení – pozná se podle použití při přímém oslovení osoby.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je tvar ukazovacího zájmena „ten“ ve 3. pádě rodu mužského (komu, čemu)?",
    options: ["tomu", "toho", "ten", "tom"],
    correctAnswerIndex: 0,
    explanation: "Ukazovací zájmeno „ten“ má ve 3. pádě rodu mužského a středního tvar „tomu“.",
    hint: "Zkus si zájmeno „ten“ nahradit podstatným jménem mužského rodu a poskloňovat ho stejně: pánovi → tomu.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný tvar číslovky „tři“ ve 3. pádě (komu, čemu)?",
    options: ["třem", "třech", "třemi", "třim"],
    correctAnswerIndex: 0,
    explanation: "Číslovka „tři“ má ve 3. pádě tvar „třem“.",
    hint: "Zkus si utvořit spojení: dal to (komu?) třem kamarádům.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný tvar rozkazovacího způsobu slovesa „pomoci“ pro 2. osobu jednotného čísla?",
    options: ["pomoz", "pomozi", "pomohni", "pomůž"],
    correctAnswerIndex: 0,
    explanation: "Rozkazovací způsob slovesa „pomoci“ pro 2. osobu jednotného čísla je „pomoz“.",
    hint: "Zkus si představit, jak bys někomu přímo přikázal, aby ti pomohl, v tom nejkratším možném tvaru.",
  },
  {
    category: "Tvarosloví",
    text: "Který typ trpného rodu je použit ve větě: „Dům se staví už dva roky.“?",
    options: ["trpný rod opisný", "trpný rod zvratný", "činný rod", "podmiňovací způsob"],
    correctAnswerIndex: 1,
    explanation:
      "Trpný rod zvratný se tvoří pomocí zvratného zájmena „se“ u slovesa (dům se staví), na rozdíl od trpného rodu opisného (dům je stavěn), který používá sponu být + příčestí trpné.",
    hint: "Trpný rod zvratný poznáš podle zvratného zájmena „se“ připojeného ke slovesu, které jinak vyjadřuje činnost (staví se, prodává se, vaří se).",
  },
  {
    category: "Tvarosloví",
    text: "Které sloveso je zvratné?",
    options: ["smát se", "číst", "psát", "kreslit"],
    correctAnswerIndex: 0,
    explanation:
      "Sloveso „smát se“ je zvratné – zvratné zájmeno „se“ je jeho neoddělitelnou součástí (nelze říct jen „smát“ ve stejném významu).",
    hint: "Zkus sloveso použít bez zájmena „se“ – pokud to nedává smysl nebo mění význam, jde o zvratné sloveso.",
  },
  {
    category: "Tvarosloví",
    text: "V jakém čísle a jakém rodě je podstatné jméno „dítě“ v jednotném čísle?",
    options: [
      "rod mužský, jednotné číslo",
      "rod ženský, jednotné číslo",
      "rod střední, jednotné číslo",
      "nelze určit",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Podstatné jméno „dítě“ je v jednotném čísle rodu středního (to dítě), zatímco jeho množné číslo „děti“ je rodu ženského (ty děti) a skloňuje se podle vzoru kost.",
    hint: "V jednotném čísle se slovo „dítě“ chová jako běžné podstatné jméno rodu středního (to dítě, toho dítěte).",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh zájmena je slovo „ledaco“ ve větě: „Slyšel jsem o tom ledaco.“?",
    options: ["neurčité", "záporné", "tázací", "ukazovací"],
    correctAnswerIndex: 0,
    explanation: "Zájmeno „ledaco“ označuje blíže neurčenou věc – jde o zájmeno neurčité.",
    hint: "Neurčitá zájmena mohou mít i jiné předpony než ně- (např. ledaco, kdeco, cosi) – označují stále něco blíže neurčeného.",
  },
  {
    category: "Tvarosloví",
    text: "Je podstatné jméno „Praha“ obecné, nebo vlastní?",
    options: ["obecné", "vlastní", "ani jedno", "nelze určit"],
    correctAnswerIndex: 1,
    explanation:
      "Podstatné jméno „Praha“ označuje jedinečný, konkrétní objekt – jde o podstatné jméno vlastní.",
    hint: "Vlastní podstatná jména označují jedinečné, konkrétní osoby, místa nebo věci a píší se s velkým písmenem.",
  },
  {
    category: "Tvarosloví",
    text: "Je podstatné jméno „město“ obecné, nebo vlastní?",
    options: ["obecné", "vlastní", "ani jedno", "nelze určit"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno „město“ označuje celou třídu/druh objektů, ne jeden konkrétní – jde o podstatné jméno obecné.",
    hint: "Obecná podstatná jména označují druh věcí nebo bytostí, ne jednu konkrétní, jedinečnou věc.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je tvar přídavného jména „jarní“ v 1. pádě množného čísla rodu ženského?",
    options: ["jarní", "jarná", "jarné", "jarnie"],
    correctAnswerIndex: 0,
    explanation:
      "Měkká přídavná jména (vzor jarní) mají ve všech rodech 1. pádu množného čísla stejný tvar – jarní.",
    hint: "Měkká přídavná jména se na rozdíl od tvrdých neliší podle rodu v koncovce 1. pádu množného čísla.",
  },
  {
    category: "Tvarosloví",
    text: "Které z uvedených přídavných jmen patří mezi tvrdá (skloňuje se podle vzoru mladý)?",
    options: ["zimní", "hlavní", "studený", "podzimní"],
    correctAnswerIndex: 2,
    explanation:
      "Přídavné jméno „studený“ je tvrdé, skloňuje se podle vzoru mladý. Ostatní uvedená přídavná jména jsou měkká, skloňují se podle vzoru jarní.",
    hint: "Měkká přídavná jména mají v základním tvaru koncovku -í (zimní, hlavní), tvrdá mají koncovku -ý/-á/-é.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký slovesný způsob je použit ve větě: „Zítra jedeme na výlet.“?",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "žádný"],
    correctAnswerIndex: 0,
    explanation:
      "Věta sděluje fakt bez rozkazu nebo podmínky – jde o oznamovací způsob, nejběžnější slovesný způsob.",
    hint: "Oznamovací způsob prostě sděluje, co se děje, dělo nebo bude dít, bez rozkazu či podmínky.",
  },
  {
    category: "Tvarosloví",
    text: "Doplňte správný tvar: „Každý má __ názor.“ (svůj)",
    options: ["svůj", "svého", "svém", "svým"],
    correctAnswerIndex: 0,
    explanation:
      "Ve větě je potřeba 4. pád zájmena „svůj“ shodující se s podstatným jménem „názor“ (má co? – svůj názor).",
    hint: "Zeptej se pádovou otázkou 4. pádu: má koho, co? – svůj názor.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký je správný tvar číslovky „čtyři“ ve 4. pádě (vidím koho, co)?",
    options: ["čtyři", "čtyřech", "čtyřem", "čtyřmi"],
    correctAnswerIndex: 0,
    explanation:
      "Číslovka „čtyři“ má ve 4. pádě stejný tvar jako v 1. pádě: čtyři (vidím čtyři knihy).",
    hint: "Zkus si utvořit spojení: vidím (koho, co?) čtyři knihy – tvar číslovky se v tomto pádě nemění.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký slovesný způsob vyjadřuje tvar „byl bych šel“?",
    options: ["oznamovací způsob", "podmiňovací způsob minulý", "rozkazovací způsob", "přítomný čas"],
    correctAnswerIndex: 1,
    explanation:
      "Tvar „byl bych šel“ vyjadřuje podmínku vztaženou k minulosti (co by se bylo stalo, kdyby…) – jde o podmiňovací způsob minulý.",
    hint: "Tento tvar se používá, když mluvíme o něčem, co se mohlo stát v minulosti, ale nestalo se.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh přídavného jména je slovo „dřevěný“ ve větě: „Seděl na dřevěné židli.“?",
    options: ["jakostní", "druhové (vztahové)", "přivlastňovací", "zájmenné"],
    correctAnswerIndex: 1,
    explanation:
      "Přídavné jméno „dřevěný“ vyjadřuje, z jakého materiálu věc je, ne obecnou vlastnost – jde o přídavné jméno druhové (vztahové).",
    hint: "Druhová přídavná jména vyjadřují vztah k látce, materiálu nebo účelu, ne obecnou jakostní vlastnost jako barvu nebo velikost.",
  },
  {
    category: "Tvarosloví",
    text: "Doplňte správný tvar přídavného jména: „Viděli jsme (starý) hrady.“",
    options: ["staré", "staří", "stará", "starý"],
    correctAnswerIndex: 0,
    explanation:
      "Podstatné jméno „hrady“ je rodu mužského neživotného v množném čísle, přídavné jméno se s ním shoduje v koncovce -é: staré hrady.",
    hint: "Zjisti rod a životnost podstatného jména „hrady“ – hrad je věc, ne živá bytost, takže jde o mužský rod neživotný.",
  },
  {
    category: "Tvarosloví",
    text: "Ve kterém tvaru je sloveso ve 3. osobě množného čísla?",
    options: ["píšeme", "píšete", "píší", "píše"],
    correctAnswerIndex: 2,
    explanation: "Tvar „píší“ odpovídá 3. osobě množného čísla (oni píší).",
    hint: "Zkus si ke každému tvaru přiřadit odpovídající zájmeno – hledáš tvar pro „oni/ony/ona“.",
  },
  {
    category: "Tvarosloví",
    text: "Jaký druh přídavného jména je slovo „psí“ ve větě: „Slyšel psí štěkot.“?",
    options: ["jakostní", "druhové", "přivlastňovací", "zájmenné"],
    correctAnswerIndex: 2,
    explanation:
      "Přídavné jméno „psí“ vyjadřuje příslušnost ke psovi (čí štěkot? – psí), jde tedy o přídavné jméno přivlastňovací (odvozené od zvířecího jména).",
    hint: "Zeptej se na zvýrazněné slovo otázkou čí? – přivlastňovací přídavná jména mohou být odvozená i od pojmenování zvířat, ne jen lidí.",
  },

  // ---- Porozumění textu (nové, s vlastními výchozími texty) ----
  {
    category: "Porozumění textu",
    workingText:
      "Městská knihovna v Kolíně nad Labem loni oslavila sto let od svého založení. Za tu dobu se z jedné malé místnosti s několika stovkami knih stala moderní budova se třemi patry a přes padesát tisíc svazků. Kromě běžného půjčování knih dnes knihovna nabízí také čtenářské kluby pro děti, besedy se spisovateli a bezplatný přístup k internetu. Ročně ji navštíví více než dvacet tisíc lidí.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Knihovna byla založena teprve nedávno, v posledních deseti letech.",
      "Knihovna dnes nabízí služby, které při svém vzniku neposkytovala.",
      "Knihovna sídlí stále ve stejné jedné malé místnosti jako na počátku.",
      "Knihovnu navštíví ročně méně než tisíc čtenářů.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se knihovna změnila z malé místnosti v moderní budovu a dnes nabízí i čtenářské kluby, besedy a internet – tedy služby, které na počátku neměla.",
    hint: "Porovnej, jak knihovna vypadala na začátku a jak vypadá dnes – všimni si, co přibylo.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Městská knihovna v Kolíně nad Labem loni oslavila sto let od svého založení. Za tu dobu se z jedné malé místnosti s několika stovkami knih stala moderní budova se třemi patry a přes padesát tisíc svazků. Kromě běžného půjčování knih dnes knihovna nabízí také čtenářské kluby pro děti, besedy se spisovateli a bezplatný přístup k internetu. Ročně ji navštíví více než dvacet tisíc lidí.",
    text: "Kolik knih měla knihovna přibližně na začátku své existence?",
    options: ["přes padesát tisíc", "několik stovek", "přes dvacet tisíc", "přesně sto"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že knihovna začínala s „několika stovkami knih“, než se rozrostla na dnešních přes padesát tisíc svazků.",
    hint: "Hledej v textu číselný údaj, který popisuje počáteční stav knihovny, ne dnešní.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Deváťáci ze základní školy v Nové Vsi se o víkendu vydali na dvoudenní výlet do Krkonoš. První den zdolali vrchol Sněžky a přenocovali v horské chatě. Druhý den je čekala prohlídka místního muzea a odpoledne strávili u jezera. Podle vyučujícího si žáci pochvalovali hlavně výhled z vrcholu, i když cestu tam někteří považovali za náročnou.",
    text: "Které z následujících tvrzení jednoznačně vyplývá z výchozího textu?",
    options: [
      "Žáci strávili na výletě tři dny.",
      "Výlet se konal během školního týdne.",
      "Žáci navštívili muzeum až druhý den výletu.",
      "Všichni žáci hodnotili cestu na vrchol jako snadnou.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Text říká, že druhý den je čekala prohlídka muzea, tedy k návštěvě muzea došlo až druhý den výletu.",
    hint: "Zaměř se na pořadí událostí, jak jsou popsané v textu – co se stalo první a co druhý den.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Deváťáci ze základní školy v Nové Vsi se o víkendu vydali na dvoudenní výlet do Krkonoš. První den zdolali vrchol Sněžky a přenocovali v horské chatě. Druhý den je čekala prohlídka místního muzea a odpoledne strávili u jezera. Podle vyučujícího si žáci pochvalovali hlavně výhled z vrcholu, i když cestu tam někteří považovali za náročnou.",
    text: "Co si žáci podle textu nejvíce chválili?",
    options: [
      "jídlo v horské chatě",
      "výhled z vrcholu Sněžky",
      "prohlídku muzea",
      "odpoledne u jezera",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že žáci si pochvalovali hlavně výhled z vrcholu.",
    hint: "Hledej v textu slovo „pochvalovali“ a co následuje bezprostředně po něm.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Stále více lidí si dnes pěstuje bylinky přímo na okenním parapetu. Bazalka, máta nebo pažitka nepotřebují velký prostor a stačí jim pravidelná zálivka a dostatek světla. Podle odborníků je pěstování bylinek doma nejen praktické, protože si člověk může kdykoli utrhnout čerstvou surovinu do kuchyně, ale působí i jako příjemný způsob relaxace po náročném dni.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Pěstování bylinek na parapetu vyžaduje velký prostor.",
      "Podle textu je pěstování bylinek doma pouze praktické, nikoli příjemné.",
      "Bylinkám na parapetu stačí ke správnému růstu zálivka a světlo.",
      "Bazalka a máta na rozdíl od pažitky vyžadují speciální půdu.",
    ],
    correctAnswerIndex: 2,
    explanation: "Text uvádí, že bylinkám „stačí pravidelná zálivka a dostatek světla“.",
    hint: "Hledej v textu větu, která přímo popisuje, co bylinky potřebují k růstu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Stále více lidí si dnes pěstuje bylinky přímo na okenním parapetu. Bazalka, máta nebo pažitka nepotřebují velký prostor a stačí jim pravidelná zálivka a dostatek světla. Podle odborníků je pěstování bylinek doma nejen praktické, protože si člověk může kdykoli utrhnout čerstvou surovinu do kuchyně, ale působí i jako příjemný způsob relaxace po náročném dni.",
    text: "Jaké dva důvody text uvádí pro pěstování bylinek doma?",
    options: [
      "úsporu peněz a času",
      "praktičnost a relaxaci",
      "ochranu životního prostředí a zdraví",
      "dekoraci bytu a zábavu",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text zmiňuje, že pěstování bylinek je praktické (čerstvá surovina po ruce) a zároveň působí jako příjemná relaxace.",
    hint: "Text zmiňuje dva přínosy – jeden praktický (k vaření) a jeden týkající se pocitů a nálady.",
  },

  // ---- Porozumění textu (nové, druhá dávka – vlastní populárně-naučné texty) ----
  {
    category: "Porozumění textu",
    workingText:
      "Archeologové nedávno objevili poblíž Hradce Králové pozůstatky staré keramické dílny, kterou datovali do 14. století. Kromě rozbitých nádob našli také dětské hračky vyrobené z hlíny a několik mincí. Podle vedoucího výzkumu nález potvrzuje, že v této oblasti existovala už ve středověku rozvinutá řemeslná výroba. Nalezené předměty budou po odborném zpracování vystaveny v místním muzeu.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Nález potvrzuje, že v oblasti nikdy žádná řemeslná výroba neprobíhala.",
      "Archeologové našli mimo jiné dětské hračky a mince.",
      "Nalezené předměty pocházejí z 19. století.",
      "Nalezené předměty zůstanou navždy uloženy v depozitáři a nebudou vystaveny.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že archeologové kromě rozbitých nádob našli také dětské hračky z hlíny a několik mincí.",
    hint: "Hledej v textu výčet konkrétních nalezených předmětů.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Archeologové nedávno objevili poblíž Hradce Králové pozůstatky staré keramické dílny, kterou datovali do 14. století. Kromě rozbitých nádob našli také dětské hračky vyrobené z hlíny a několik mincí. Podle vedoucího výzkumu nález potvrzuje, že v této oblasti existovala už ve středověku rozvinutá řemeslná výroba. Nalezené předměty budou po odborném zpracování vystaveny v místním muzeu.",
    text: "Co podle vedoucího výzkumu nález potvrzuje?",
    options: [
      "že oblast byla ve středověku neobydlená",
      "že v oblasti existovala už ve středověku rozvinutá řemeslná výroba",
      "že mince pocházejí z jiného kontinentu",
      "že dílna sloužila jako obydlí pro archeology",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text přímo uvádí, že podle vedoucího výzkumu nález potvrzuje rozvinutou středověkou řemeslnou výrobu v této oblasti.",
    hint: "Hledej ve textu přímou parafrázi toho, co řekl vedoucí výzkumu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Archeologové nedávno objevili poblíž Hradce Králové pozůstatky staré keramické dílny, kterou datovali do 14. století. Kromě rozbitých nádob našli také dětské hračky vyrobené z hlíny a několik mincí. Podle vedoucího výzkumu nález potvrzuje, že v této oblasti existovala už ve středověku rozvinutá řemeslná výroba. Nalezené předměty budou po odborném zpracování vystaveny v místním muzeu.",
    text: "Kam budou nalezené předměty po zpracování umístěny?",
    options: ["do soukromé sbírky", "do místního muzea", "zpět do země", "do jiného státu"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že předměty budou po odborném zpracování vystaveny v místním muzeu.",
    hint: "Poslední věta textu popisuje, co se s předměty stane po jejich zpracování.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Někteří ptáci uletí během podzimní migrace tisíce kilometrů, aby unikli chladnému počasí. Orientují se přitom nejen podle slunce a hvězd, ale také díky vnímání zemského magnetického pole. Vědci zjistili, že mladí ptáci, kteří migrují poprvé, se často spoléhají hlavně na vrozený instinkt, zatímco starší jedinci si pamatují trasu z předchozích let. Zajímavé je, že některé druhy létají v noci, aby se vyhnuly dravcům a horku.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Ptáci se při migraci orientují výhradně podle slunce.",
      "Mladí ptáci migrující poprvé se spoléhají hlavně na vrozený instinkt.",
      "Všichni ptáci migrují pouze ve dne.",
      "Zemské magnetické pole nemá na orientaci ptáků žádný vliv.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že mladí ptáci, kteří migrují poprvé, se často spoléhají hlavně na vrozený instinkt.",
    hint: "Porovnej, jak se podle textu orientují mladí ptáci a jak starší, zkušenější jedinci.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Někteří ptáci uletí během podzimní migrace tisíce kilometrů, aby unikli chladnému počasí. Orientují se přitom nejen podle slunce a hvězd, ale také díky vnímání zemského magnetického pole. Vědci zjistili, že mladí ptáci, kteří migrují poprvé, se často spoléhají hlavně na vrozený instinkt, zatímco starší jedinci si pamatují trasu z předchozích let. Zajímavé je, že některé druhy létají v noci, aby se vyhnuly dravcům a horku.",
    text: "Proč podle textu některé druhy ptáků létají v noci?",
    options: [
      "aby ušetřily energii",
      "aby se vyhnuly dravcům a horku",
      "aby lépe viděly hvězdy",
      "aby nerušily jiné ptáky",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že některé druhy létají v noci, aby se vyhnuly dravcům a horku.",
    hint: "Poslední věta textu přímo uvádí dva důvody nočního letu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Někteří ptáci uletí během podzimní migrace tisíce kilometrů, aby unikli chladnému počasí. Orientují se přitom nejen podle slunce a hvězd, ale také díky vnímání zemského magnetického pole. Vědci zjistili, že mladí ptáci, kteří migrují poprvé, se často spoléhají hlavně na vrozený instinkt, zatímco starší jedinci si pamatují trasu z předchozích let. Zajímavé je, že některé druhy létají v noci, aby se vyhnuly dravcům a horku.",
    text: "Čeho všeho ptáci podle textu využívají k orientaci během migrace?",
    options: [
      "pouze zemského magnetického pole",
      "slunce, hvězd a zemského magnetického pole",
      "pouze zkušenosti starších ptáků",
      "signálu z družic",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se ptáci orientují podle slunce a hvězd a také díky vnímání zemského magnetického pole.",
    hint: "Hledej v první polovině textu výčet věcí, podle kterých se ptáci orientují.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Lidský mozek během spánku neodpočívá tak úplně, jak by se mohlo zdát. Ve fázi zvané REM spánek jsou oči pod víčky v rychlém pohybu a mozková aktivita se podobá bdělému stavu. Právě v této fázi se nejčastěji zdají živé sny. Vědci se domnívají, že REM spánek pomáhá zpracovávat zážitky z předchozího dne a upevňovat paměť. Dospělý člověk stráví v REM fázi přibližně pětinu celkové doby spánku.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Během REM spánku se oči pod víčky nehýbou.",
      "Mozková aktivita během REM spánku připomíná bdělý stav.",
      "Sny se zdají výhradně mimo REM fázi.",
      "Dospělý člověk stráví v REM fázi téměř celou dobu spánku.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že mozková aktivita se ve fázi REM spánku podobá bdělému stavu.",
    hint: "Hledej v textu větu, která přímo popisuje mozkovou aktivitu během REM fáze.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Lidský mozek během spánku neodpočívá tak úplně, jak by se mohlo zdát. Ve fázi zvané REM spánek jsou oči pod víčky v rychlém pohybu a mozková aktivita se podobá bdělému stavu. Právě v této fázi se nejčastěji zdají živé sny. Vědci se domnívají, že REM spánek pomáhá zpracovávat zážitky z předchozího dne a upevňovat paměť. Dospělý člověk stráví v REM fázi přibližně pětinu celkové doby spánku.",
    text: "K čemu podle vědců REM spánek pravděpodobně slouží?",
    options: [
      "ke zpracování zážitků a upevňování paměti",
      "pouze k odpočinku svalů",
      "k regulaci tělesné teploty",
      "k trávení jídla",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že vědci se domnívají, že REM spánek pomáhá zpracovávat zážitky z předchozího dne a upevňovat paměť.",
    hint: "Hledej ve druhé polovině textu, k čemu podle vědců REM fáze slouží.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Lidský mozek během spánku neodpočívá tak úplně, jak by se mohlo zdát. Ve fázi zvané REM spánek jsou oči pod víčky v rychlém pohybu a mozková aktivita se podobá bdělému stavu. Právě v této fázi se nejčastěji zdají živé sny. Vědci se domnívají, že REM spánek pomáhá zpracovávat zážitky z předchozího dne a upevňovat paměť. Dospělý člověk stráví v REM fázi přibližně pětinu celkové doby spánku.",
    text: "Jak velkou část celkové doby spánku podle textu tvoří u dospělého člověka REM fáze?",
    options: ["přibližně polovinu", "přibližně pětinu", "téměř celou dobu", "jen několik vteřin"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že dospělý člověk stráví v REM fázi přibližně pětinu celkové doby spánku.",
    hint: "Hledej v textu konkrétní číselný údaj o podílu REM fáze na celkové době spánku.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Lidský mozek během spánku neodpočívá tak úplně, jak by se mohlo zdát. Ve fázi zvané REM spánek jsou oči pod víčky v rychlém pohybu a mozková aktivita se podobá bdělému stavu. Právě v této fázi se nejčastěji zdají živé sny. Vědci se domnívají, že REM spánek pomáhá zpracovávat zážitky z předchozího dne a upevňovat paměť. Dospělý člověk stráví v REM fázi přibližně pětinu celkové doby spánku.",
    text: "Co se podle textu děje s očima pod víčky během REM spánku?",
    options: ["zůstávají zcela nehybné", "rychle se pohybují", "jsou pootevřené", "slzí"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že ve fázi REM spánku jsou oči pod víčky v rychlém pohybu.",
    hint: "Zkratka REM v angličtině znamená „rapid eye movement“ – rychlý pohyb očí.",
  },

  // ---- Porozumění textu (nové, třetí dávka – doplnění do 20) ----
  {
    category: "Porozumění textu",
    workingText:
      "Včely nejsou důležité jen kvůli medu, který vyrábějí. Při sběru nektaru z květu na květ přenášejí pyl, a umožňují tak mnoha rostlinám vznik plodů a semen. Odborníci odhadují, že na opylování včelami závisí velká část plodin, které lidé běžně jedí, například jablka nebo mandle. Pokud počet včel v přírodě klesá, ohrožuje to nejen jejich vlastní populaci, ale i dostupnost některých potravin. Proto se v posledních letech více mluví o ochraně včelstev a omezení používání látek, které jim škodí.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Včely jsou důležité výhradně kvůli výrobě medu.",
      "Včely při sběru nektaru přenášejí mezi květy pyl.",
      "Úbytek včel nemá na dostupnost potravin žádný vliv.",
      "Ochrana včelstev není podle textu v posledních letech tématem.",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že včely při sběru nektaru z květu na květ přenášejí pyl.",
    hint: "Hledej v textu větu popisující, co se děje, když včela přelétá z jednoho květu na druhý.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Včely nejsou důležité jen kvůli medu, který vyrábějí. Při sběru nektaru z květu na květ přenášejí pyl, a umožňují tak mnoha rostlinám vznik plodů a semen. Odborníci odhadují, že na opylování včelami závisí velká část plodin, které lidé běžně jedí, například jablka nebo mandle. Pokud počet včel v přírodě klesá, ohrožuje to nejen jejich vlastní populaci, ale i dostupnost některých potravin. Proto se v posledních letech více mluví o ochraně včelstev a omezení používání látek, které jim škodí.",
    text: "Co podle textu umožňuje přenášení pylu včelami?",
    options: [
      "vznik plodů a semen u mnoha rostlin",
      "zabarvení květů",
      "rychlejší růst stromů",
      "snížení teploty v úlu",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že přenášením pylu včely umožňují mnoha rostlinám vznik plodů a semen.",
    hint: "Hledej v první polovině textu, co je důsledkem přenášení pylu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Včely nejsou důležité jen kvůli medu, který vyrábějí. Při sběru nektaru z květu na květ přenášejí pyl, a umožňují tak mnoha rostlinám vznik plodů a semen. Odborníci odhadují, že na opylování včelami závisí velká část plodin, které lidé běžně jedí, například jablka nebo mandle. Pokud počet včel v přírodě klesá, ohrožuje to nejen jejich vlastní populaci, ale i dostupnost některých potravin. Proto se v posledních letech více mluví o ochraně včelstev a omezení používání látek, které jim škodí.",
    text: "Jaké příklady plodin závislých na opylování včelami text uvádí?",
    options: ["rýži a kukuřici", "jablka a mandle", "brambory a mrkev", "pšenici a ječmen"],
    correctAnswerIndex: 1,
    explanation: "Text jako příklad uvádí jablka nebo mandle.",
    hint: "Hledej v textu konkrétní vyjmenované příklady plodin.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Včely nejsou důležité jen kvůli medu, který vyrábějí. Při sběru nektaru z květu na květ přenášejí pyl, a umožňují tak mnoha rostlinám vznik plodů a semen. Odborníci odhadují, že na opylování včelami závisí velká část plodin, které lidé běžně jedí, například jablka nebo mandle. Pokud počet včel v přírodě klesá, ohrožuje to nejen jejich vlastní populaci, ale i dostupnost některých potravin. Proto se v posledních letech více mluví o ochraně včelstev a omezení používání látek, které jim škodí.",
    text: "Co se podle textu v posledních letech více řeší?",
    options: [
      "zvyšování produkce medu",
      "ochrana včelstev a omezení škodlivých látek",
      "chov nových druhů včel",
      "vývoz medu do zahraničí",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se v posledních letech více mluví o ochraně včelstev a omezení používání látek, které jim škodí.",
    hint: "Poslední věta textu popisuje, co je teď více v centru pozornosti.",
  },

  // ---- Porozumění textu (nové, třetí dávka – doplnění do 40) ----
  {
    category: "Porozumění textu",
    workingText:
      "Recyklace plastu není tak jednoduchá, jak by se mohlo zdát. Různé druhy plastů se od sebe chemicky liší, a proto je nutné je před dalším zpracováním pečlivě roztřídit. Pokud se do recyklace dostane nesprávný typ plastu, může znehodnotit celou dávku suroviny. Odborníci proto doporučují obaly před vyhozením propláchnout a řídit se značením na výrobku. I přes veškerou snahu se v současnosti recykluje jen menší část vyprodukovaného plastového odpadu.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Všechny druhy plastů lze recyklovat společně bez roztřídění.",
      "Nesprávně vytříděný plast může znehodnotit celou dávku suroviny.",
      "Recykluje se v současnosti většina vyprodukovaného plastu.",
      "Značení na výrobcích nemá pro recyklaci žádný význam.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že pokud se do recyklace dostane nesprávný typ plastu, může znehodnotit celou dávku suroviny.",
    hint: "Hledej v textu, co se stane, když se plasty správně nerozliší před recyklací.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Recyklace plastu není tak jednoduchá, jak by se mohlo zdát. Různé druhy plastů se od sebe chemicky liší, a proto je nutné je před dalším zpracováním pečlivě roztřídit. Pokud se do recyklace dostane nesprávný typ plastu, může znehodnotit celou dávku suroviny. Odborníci proto doporučují obaly před vyhozením propláchnout a řídit se značením na výrobku. I přes veškerou snahu se v současnosti recykluje jen menší část vyprodukovaného plastového odpadu.",
    text: "Co odborníci podle textu doporučují dělat s obaly před vyhozením?",
    options: [
      "rozřezat je na malé kousky",
      "propláchnout je a řídit se značením",
      "spálit je doma",
      "schovat je na později",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že odborníci doporučují obaly před vyhozením propláchnout a řídit se značením na výrobku.",
    hint: "Hledej v textu konkrétní doporučení, jak s obaly naložit před jejich vyhozením.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Recyklace plastu není tak jednoduchá, jak by se mohlo zdát. Různé druhy plastů se od sebe chemicky liší, a proto je nutné je před dalším zpracováním pečlivě roztřídit. Pokud se do recyklace dostane nesprávný typ plastu, může znehodnotit celou dávku suroviny. Odborníci proto doporučují obaly před vyhozením propláchnout a řídit se značením na výrobku. I přes veškerou snahu se v současnosti recykluje jen menší část vyprodukovaného plastového odpadu.",
    text: "Jak velká část vyprodukovaného plastového odpadu se podle textu v současnosti recykluje?",
    options: ["téměř veškerý", "většina", "jen menší část", "žádná část"],
    correctAnswerIndex: 2,
    explanation:
      "Text uvádí, že se i přes veškerou snahu recykluje jen menší část vyprodukovaného plastového odpadu.",
    hint: "Hledej poslední větu textu, která hodnotí celkový podíl recyklovaného plastu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Mravenci patří mezi nejorganizovanější tvory v přírodě. V jednom mraveništi může žít i několik set tisíc jedinců, přičemž každý má přesně danou roli – dělníci shánějí potravu, vojáci brání kolonii a královna klade vajíčka. Mravenci se dorozumívají především pomocí chemických látek zvaných feromony, kterými značkují cestu k potravě. Díky tomu dokáže celá kolonie efektivně spolupracovat, aniž by jednotliví mravenci museli vidět na sebe navzájem.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Všichni mravenci v mraveništi mají stejnou roli.",
      "Mravenci se dorozumívají především pomocí chemických látek.",
      "V jednom mraveništi žije nejvýše několik desítek jedinců.",
      "Královna mraveniště shání potravu pro ostatní.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se mravenci dorozumívají především pomocí chemických látek zvaných feromony.",
    hint: "Hledej v textu, jakým způsobem mravenci mezi sebou komunikují.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Mravenci patří mezi nejorganizovanější tvory v přírodě. V jednom mraveništi může žít i několik set tisíc jedinců, přičemž každý má přesně danou roli – dělníci shánějí potravu, vojáci brání kolonii a královna klade vajíčka. Mravenci se dorozumívají především pomocí chemických látek zvaných feromony, kterými značkují cestu k potravě. Díky tomu dokáže celá kolonie efektivně spolupracovat, aniž by jednotliví mravenci museli vidět na sebe navzájem.",
    text: "Jakou roli mají v mraveništi podle textu dělníci?",
    options: ["kladou vajíčka", "brání kolonii", "shánějí potravu", "řídí ostatní mravence"],
    correctAnswerIndex: 2,
    explanation: "Text uvádí, že dělníci shánějí potravu.",
    hint: "Hledej v textu větu, která vyjmenovává role jednotlivých typů mravenců.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Mravenci patří mezi nejorganizovanější tvory v přírodě. V jednom mraveništi může žít i několik set tisíc jedinců, přičemž každý má přesně danou roli – dělníci shánějí potravu, vojáci brání kolonii a královna klade vajíčka. Mravenci se dorozumívají především pomocí chemických látek zvaných feromony, kterými značkují cestu k potravě. Díky tomu dokáže celá kolonie efektivně spolupracovat, aniž by jednotliví mravenci museli vidět na sebe navzájem.",
    text: "Čím mravenci podle textu značkují cestu k potravě?",
    options: [
      "zvukovými signály",
      "feromony (chemickými látkami)",
      "barevnými znaky",
      "pohybem tykadel",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se mravenci dorozumívají pomocí chemických látek zvaných feromony, kterými značkují cestu k potravě.",
    hint: "Hledej v textu odborný název pro chemické látky, které mravenci používají.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Mravenci patří mezi nejorganizovanější tvory v přírodě. V jednom mraveništi může žít i několik set tisíc jedinců, přičemž každý má přesně danou roli – dělníci shánějí potravu, vojáci brání kolonii a královna klade vajíčka. Mravenci se dorozumívají především pomocí chemických látek zvaných feromony, kterými značkují cestu k potravě. Díky tomu dokáže celá kolonie efektivně spolupracovat, aniž by jednotliví mravenci museli vidět na sebe navzájem.",
    text: "Kolik jedinců může podle textu žít v jednom mraveništi?",
    options: ["několik desítek", "několik set", "několik set tisíc", "několik milionů"],
    correctAnswerIndex: 2,
    explanation: "Text uvádí, že v jednom mraveništi může žít i několik set tisíc jedinců.",
    hint: "Hledej v textu konkrétní číselný údaj o velikosti mraveniště.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "V archivu malého městečka Lipník se dochovala obecní kronika sahající až do roku 1789. Kronikáři do ní zaznamenávali nejen významné události, jako byly povodně nebo požáry, ale i drobné zprávy o počasí a úrodě. Díky pravidelným zápisům mohou dnes historici rekonstruovat, jak se v regionu měnilo klima za posledních dvě stě let. Kronika je dnes uložena v muzeu a její nejstarší stránky jsou kvůli křehkosti papíru veřejnosti nepřístupné.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Kronika obsahuje pouze zápisy o významných událostech, nikoli o počasí.",
      "Nejstarší stránky kroniky jsou veřejnosti nepřístupné kvůli křehkosti papíru.",
      "Kronika sahá pouze do poloviny 20. století.",
      "Kronika je uložena v soukromé sbírce, ne v muzeu.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že nejstarší stránky kroniky jsou kvůli křehkosti papíru veřejnosti nepřístupné.",
    hint: "Hledej poslední větu textu, která popisuje současný stav a přístupnost kroniky.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "V archivu malého městečka Lipník se dochovala obecní kronika sahající až do roku 1789. Kronikáři do ní zaznamenávali nejen významné události, jako byly povodně nebo požáry, ale i drobné zprávy o počasí a úrodě. Díky pravidelným zápisům mohou dnes historici rekonstruovat, jak se v regionu měnilo klima za posledních dvě stě let. Kronika je dnes uložena v muzeu a její nejstarší stránky jsou kvůli křehkosti papíru veřejnosti nepřístupné.",
    text: "Co kromě významných událostí kronikáři podle textu zaznamenávali?",
    options: [
      "jen jména obyvatel",
      "drobné zprávy o počasí a úrodě",
      "výsledky sportovních zápasů",
      "ceny potravin v obchodech",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že kronikáři zaznamenávali i drobné zprávy o počasí a úrodě.",
    hint: "Hledej v textu, co kronikáři zapisovali kromě velkých událostí jako povodně a požáry.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "V archivu malého městečka Lipník se dochovala obecní kronika sahající až do roku 1789. Kronikáři do ní zaznamenávali nejen významné události, jako byly povodně nebo požáry, ale i drobné zprávy o počasí a úrodě. Díky pravidelným zápisům mohou dnes historici rekonstruovat, jak se v regionu měnilo klima za posledních dvě stě let. Kronika je dnes uložena v muzeu a její nejstarší stránky jsou kvůli křehkosti papíru veřejnosti nepřístupné.",
    text: "K čemu mohou historici podle textu díky kronice dojít?",
    options: [
      "k rekonstrukci změn klimatu v regionu za poslední dvě stě let",
      "k přesnému počtu obyvatel městečka v roce 1789",
      "k seznamu všech kronikářů podle jména",
      "k mapě podzemních chodeb pod městečkem",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že díky pravidelným zápisům mohou historici rekonstruovat, jak se v regionu měnilo klima za posledních dvě stě let.",
    hint: "Hledej v textu, k čemu jsou pravidelné zápisy o počasí pro dnešní historiky užitečné.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Na rozdíl od lidí nemohou velryby spát celým mozkem najednou – kdyby to udělaly, přestaly by dýchat a utopily by se. Místo toho odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává v bdělém stavu a řídí dýchání i pohyb k hladině. Tomuto typu spánku se říká unihemisferický spánek. Podobným způsobem spí i některé druhy ptáků, například kachny, když hlídkují na okraji hejna.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Velryby spí stejným způsobem jako lidé, celým mozkem najednou.",
      "U velryb odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává bdělá.",
      "Kachny nikdy nespí podobným způsobem jako velryby.",
      "Velryby během spánku přestávají zcela dýchat.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že u velryb odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává v bdělém stavu.",
    hint: "Hledej v textu, jak přesně velryby během spánku fungují – celým mozkem, nebo jen jeho částí?",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Na rozdíl od lidí nemohou velryby spát celým mozkem najednou – kdyby to udělaly, přestaly by dýchat a utopily by se. Místo toho odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává v bdělém stavu a řídí dýchání i pohyb k hladině. Tomuto typu spánku se říká unihemisferický spánek. Podobným způsobem spí i některé druhy ptáků, například kachny, když hlídkují na okraji hejna.",
    text: "Proč podle textu velryby nemohou spát celým mozkem najednou?",
    options: [
      "protože by přestaly dýchat a utopily se",
      "protože by je to bolelo",
      "protože nemají dostatečně velký mozek",
      "protože potřebují neustále lovit potravu",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že kdyby velryby spaly celým mozkem najednou, přestaly by dýchat a utopily by se.",
    hint: "Hledej v textu vysvětlení, proč je pro velryby nebezpečné spát celým mozkem.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Na rozdíl od lidí nemohou velryby spát celým mozkem najednou – kdyby to udělaly, přestaly by dýchat a utopily by se. Místo toho odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává v bdělém stavu a řídí dýchání i pohyb k hladině. Tomuto typu spánku se říká unihemisferický spánek. Podobným způsobem spí i některé druhy ptáků, například kachny, když hlídkují na okraji hejna.",
    text: "Jak se nazývá typ spánku, při kterém odpočívá jen jedna mozková hemisféra?",
    options: ["REM spánek", "unihemisferický spánek", "hluboký spánek", "polyfázický spánek"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že tomuto typu spánku se říká unihemisferický spánek.",
    hint: "Hledej v textu odborný název, kterým je tento typ spánku pojmenován.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Na rozdíl od lidí nemohou velryby spát celým mozkem najednou – kdyby to udělaly, přestaly by dýchat a utopily by se. Místo toho odpočívá vždy jen jedna mozková hemisféra, zatímco druhá zůstává v bdělém stavu a řídí dýchání i pohyb k hladině. Tomuto typu spánku se říká unihemisferický spánek. Podobným způsobem spí i některé druhy ptáků, například kachny, když hlídkují na okraji hejna.",
    text: "Který další živočich podle textu spí podobným způsobem jako velryby?",
    options: ["kočky", "kachny", "medvědi", "žáby"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že podobným způsobem spí i některé druhy ptáků, například kachny, když hlídkují na okraji hejna.",
    hint: "Hledej v poslední větě textu, který pták je uveden jako příklad.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Čím dál víc knihoven nabízí svým čtenářům kromě tištěných knih také výpůjčky e-knih. Čtenář si po přihlášení do knihovnického systému může knihu stáhnout do čtečky nebo mobilní aplikace, přičemž výpůjčka je časově omezená – po uplynutí lhůty se e-kniha automaticky „vrátí“ a přestane jít otevřít. Výhodou je, že o jeden titul e-knihy se může v systému postupně vystřídat víc čtenářů, aniž by kdokoli musel fyzicky do knihovny docházet. Nevýhodou naopak zůstává, že ne všechny tituly jsou v elektronické podobě dostupné.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Výpůjčka e-knihy nemá žádné časové omezení.",
      "Po uplynutí výpůjční lhůty se e-kniha automaticky „vrátí“ a přestane jít otevřít.",
      "Všechny knižní tituly jsou dnes dostupné i v elektronické podobě.",
      "O e-knihu se nikdy nemůže vystřídat víc čtenářů.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že po uplynutí lhůty se e-kniha automaticky „vrátí“ a přestane jít otevřít.",
    hint: "Hledej v textu, co se stane s e-knihou po uplynutí výpůjční doby.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Čím dál víc knihoven nabízí svým čtenářům kromě tištěných knih také výpůjčky e-knih. Čtenář si po přihlášení do knihovnického systému může knihu stáhnout do čtečky nebo mobilní aplikace, přičemž výpůjčka je časově omezená – po uplynutí lhůty se e-kniha automaticky „vrátí“ a přestane jít otevřít. Výhodou je, že o jeden titul e-knihy se může v systému postupně vystřídat víc čtenářů, aniž by kdokoli musel fyzicky do knihovny docházet. Nevýhodou naopak zůstává, že ne všechny tituly jsou v elektronické podobě dostupné.",
    text: "Jakou výhodu výpůjček e-knih text zmiňuje?",
    options: [
      "čtenář nemusí nikdy vracet knihu",
      "o jeden titul se může postupně vystřídat víc čtenářů bez nutnosti chodit do knihovny",
      "e-knihy jsou vždy levnější než tištěné knihy",
      "e-knihy nikdy nemají výpůjční lhůtu",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí jako výhodu to, že se o jeden titul e-knihy může v systému postupně vystřídat víc čtenářů, aniž by museli fyzicky do knihovny docházet.",
    hint: "Hledej v textu větu začínající slovem „Výhodou“.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Čím dál víc knihoven nabízí svým čtenářům kromě tištěných knih také výpůjčky e-knih. Čtenář si po přihlášení do knihovnického systému může knihu stáhnout do čtečky nebo mobilní aplikace, přičemž výpůjčka je časově omezená – po uplynutí lhůty se e-kniha automaticky „vrátí“ a přestane jít otevřít. Výhodou je, že o jeden titul e-knihy se může v systému postupně vystřídat víc čtenářů, aniž by kdokoli musel fyzicky do knihovny docházet. Nevýhodou naopak zůstává, že ne všechny tituly jsou v elektronické podobě dostupné.",
    text: "Jakou nevýhodu výpůjček e-knih text zmiňuje?",
    options: [
      "ne všechny tituly jsou v elektronické podobě dostupné",
      "e-knihy se dají číst jen v knihovně",
      "čtenář musí e-knihu vracet osobně",
      "e-knihy nejde stáhnout do mobilní aplikace",
    ],
    correctAnswerIndex: 0,
    explanation: "Text uvádí jako nevýhodu to, že ne všechny tituly jsou v elektronické podobě dostupné.",
    hint: "Hledej v textu větu začínající slovem „Nevýhodou“.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Obloha se nám za jasného dne jeví modrá kvůli tomu, jak sluneční světlo interaguje s molekulami vzduchu. Bílé sluneční světlo je ve skutečnosti směsí všech barev, a když prochází atmosférou, rozptyluje se na drobných částicích vzduchu. Modré světlo má kratší vlnovou délku než například červené, a proto se rozptyluje mnohem víc. Výsledkem je, že se k našim očím ze všech směrů oblohy dostává převážně rozptýlené modré světlo. Při západu slunce prochází světlo silnější vrstvou atmosféry, což způsobuje, že převládají teplejší odstíny, jako je oranžová a červená.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Sluneční světlo je samo o sobě modré.",
      "Modré světlo se v atmosféře rozptyluje víc než červené, protože má kratší vlnovou délku.",
      "Obloha je modrá, protože atmosféra samotná má modrou barvu.",
      "Při západu slunce převládá modrá barva.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že modré světlo má kratší vlnovou délku než červené, a proto se rozptyluje mnohem víc.",
    hint: "Hledej v textu, proč se právě modré světlo rozptyluje víc než ostatní barvy.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Obloha se nám za jasného dne jeví modrá kvůli tomu, jak sluneční světlo interaguje s molekulami vzduchu. Bílé sluneční světlo je ve skutečnosti směsí všech barev, a když prochází atmosférou, rozptyluje se na drobných částicích vzduchu. Modré světlo má kratší vlnovou délku než například červené, a proto se rozptyluje mnohem víc. Výsledkem je, že se k našim očím ze všech směrů oblohy dostává převážně rozptýlené modré světlo. Při západu slunce prochází světlo silnější vrstvou atmosféry, což způsobuje, že převládají teplejší odstíny, jako je oranžová a červená.",
    text: "Čeho je podle textu bílé sluneční světlo směsí?",
    options: ["pouze modré a červené barvy", "všech barev", "pouze ultrafialového záření", "vodní páry"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že bílé sluneční světlo je ve skutečnosti směsí všech barev.",
    hint: "Hledej v textu, z čeho se podle vysvětlení bílé světlo skládá.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Obloha se nám za jasného dne jeví modrá kvůli tomu, jak sluneční světlo interaguje s molekulami vzduchu. Bílé sluneční světlo je ve skutečnosti směsí všech barev, a když prochází atmosférou, rozptyluje se na drobných částicích vzduchu. Modré světlo má kratší vlnovou délku než například červené, a proto se rozptyluje mnohem víc. Výsledkem je, že se k našim očím ze všech směrů oblohy dostává převážně rozptýlené modré světlo. Při západu slunce prochází světlo silnější vrstvou atmosféry, což způsobuje, že převládají teplejší odstíny, jako je oranžová a červená.",
    text: "Proč podle textu při západu slunce převládají teplejší odstíny jako oranžová a červená?",
    options: [
      "protože slunce v tu dobu vyzařuje jinou barvu světla",
      "protože světlo prochází silnější vrstvou atmosféry",
      "protože v tu dobu ubývá modrého světla ve vesmíru",
      "protože se mění barva samotného slunce",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že při západu slunce prochází světlo silnější vrstvou atmosféry, což způsobuje, že převládají teplejší odstíny.",
    hint: "Hledej poslední větu textu, která vysvětluje barvu oblohy při západu slunce.",
  },

  // ---- Porozumění textu (nové, čtvrtá dávka) ----
  {
    category: "Porozumění textu",
    workingText:
      "Britský spisovatel George Orwell se narodil roku 1903 v Indii, tehdy součásti britského impéria. Než se naplno věnoval psaní, pracoval mimo jiné jako policista v Barmě a později se dobrovolně zúčastnil španělské občanské války. Své zkušenosti s totalitními režimy a propagandou později zúročil ve svých nejznámějších dílech, která varují před zneužitím moci a manipulací s pravdou. Orwell zemřel v roce 1950, ale jeho díla se čtou dodnes a některé jím vytvořené pojmy zlidověly natolik, že je lidé používají, aniž by tušili, odkud pocházejí.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "George Orwell se narodil ve Velké Británii.",
      "Orwell měl osobní zkušenost s válkou i s prací u policie.",
      "Orwell se psaní věnoval už od raného dětství a nikdy nedělal nic jiného.",
      "Orwellova díla jsou dnes zapomenutá a téměř nikdo je nezná.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že Orwell pracoval jako policista v Barmě a dobrovolně se zúčastnil španělské občanské války.",
    hint: "Hledej v textu, jaké zaměstnání a zkušenosti Orwell před psaním měl.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Britský spisovatel George Orwell se narodil roku 1903 v Indii, tehdy součásti britského impéria. Než se naplno věnoval psaní, pracoval mimo jiné jako policista v Barmě a později se dobrovolně zúčastnil španělské občanské války. Své zkušenosti s totalitními režimy a propagandou později zúročil ve svých nejznámějších dílech, která varují před zneužitím moci a manipulací s pravdou. Orwell zemřel v roce 1950, ale jeho díla se čtou dodnes a některé jím vytvořené pojmy zlidověly natolik, že je lidé používají, aniž by tušili, odkud pocházejí.",
    text: "Kde se George Orwell narodil?",
    options: ["ve Velké Británii", "v Indii", "ve Španělsku", "v Barmě"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se Orwell narodil v Indii, tehdy součásti britského impéria.",
    hint: "Hledej první větu textu, která uvádí místo narození.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Britský spisovatel George Orwell se narodil roku 1903 v Indii, tehdy součásti britského impéria. Než se naplno věnoval psaní, pracoval mimo jiné jako policista v Barmě a později se dobrovolně zúčastnil španělské občanské války. Své zkušenosti s totalitními režimy a propagandou později zúročil ve svých nejznámějších dílech, která varují před zneužitím moci a manipulací s pravdou. Orwell zemřel v roce 1950, ale jeho díla se čtou dodnes a některé jím vytvořené pojmy zlidověly natolik, že je lidé používají, aniž by tušili, odkud pocházejí.",
    text: "Čeho se podle textu Orwellova díla nejčastěji týkají?",
    options: [
      "cestování po vesmíru",
      "zneužití moci a manipulace s pravdou",
      "historie starověkého Řecka",
      "života na venkově",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že Orwellova nejznámější díla varují před zneužitím moci a manipulací s pravdou.",
    hint: "Hledej ve druhé polovině textu, jaké téma se v Orwellových dílech nejčastěji objevuje.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Britský spisovatel George Orwell se narodil roku 1903 v Indii, tehdy součásti britského impéria. Než se naplno věnoval psaní, pracoval mimo jiné jako policista v Barmě a později se dobrovolně zúčastnil španělské občanské války. Své zkušenosti s totalitními režimy a propagandou později zúročil ve svých nejznámějších dílech, která varují před zneužitím moci a manipulací s pravdou. Orwell zemřel v roce 1950, ale jeho díla se čtou dodnes a některé jím vytvořené pojmy zlidověly natolik, že je lidé používají, aniž by tušili, odkud pocházejí.",
    text: "Co text uvádí o Orwellových pojmech (výrazech, které vytvořil)?",
    options: [
      "nikdy se neujaly a jsou dnes zapomenuté",
      "zlidověly natolik, že je lidé používají, aniž by znali jejich původ",
      "používají se pouze ve Velké Británii",
      "jsou srozumitelné jen odborníkům na literaturu",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že některé Orwellem vytvořené pojmy zlidověly natolik, že je lidé používají, aniž by tušili, odkud pocházejí.",
    hint: "Hledej poslední větu textu, která hodnotí, jak moc jsou Orwellovy pojmy dnes rozšířené.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Francouzský spisovatel Jules Verne, narozený v roce 1828 v přístavním městě Nantes, je dodnes považován za jednoho z otců moderního dobrodružného a vědeckofantastického románu. Ve svých knihách popisoval vynálezy a cesty, které byly v době jejich vzniku pouhou fantazií, například ponorky nebo lety na Měsíc, a mnohé z nich se později skutečně staly realitou. Verne psal rychle a systematicky, celý svůj tvůrčí život věnoval rozsáhlému cyklu románů nazvanému Podivuhodné cesty. Za svého života se stal jedním z nejpřekládanějších autorů na světě.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Jules Verne se narodil ve 20. století.",
      "Verne ve svých knihách popisoval vynálezy, které byly v jeho době pouhou fantazií.",
      "Verne za svůj život napsal jen jednu jedinou knihu.",
      "Verne nebyl za svého života nijak známý ani překládaný.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že Verne ve svých knihách popisoval vynálezy a cesty, které byly v době jejich vzniku pouhou fantazií.",
    hint: "Hledej v textu, jak text popisuje vynálezy zobrazené v jeho knihách v době, kdy je psal.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Francouzský spisovatel Jules Verne, narozený v roce 1828 v přístavním městě Nantes, je dodnes považován za jednoho z otců moderního dobrodružného a vědeckofantastického románu. Ve svých knihách popisoval vynálezy a cesty, které byly v době jejich vzniku pouhou fantazií, například ponorky nebo lety na Měsíc, a mnohé z nich se později skutečně staly realitou. Verne psal rychle a systematicky, celý svůj tvůrčí život věnoval rozsáhlému cyklu románů nazvanému Podivuhodné cesty. Za svého života se stal jedním z nejpřekládanějších autorů na světě.",
    text: "Ve kterém městě se Jules Verne narodil?",
    options: ["v Paříži", "v Nantes", "v Marseille", "v Lyonu"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se Verne narodil v přístavním městě Nantes.",
    hint: "Hledej první větu textu, která uvádí místo narození.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Francouzský spisovatel Jules Verne, narozený v roce 1828 v přístavním městě Nantes, je dodnes považován za jednoho z otců moderního dobrodružného a vědeckofantastického románu. Ve svých knihách popisoval vynálezy a cesty, které byly v době jejich vzniku pouhou fantazií, například ponorky nebo lety na Měsíc, a mnohé z nich se později skutečně staly realitou. Verne psal rychle a systematicky, celý svůj tvůrčí život věnoval rozsáhlému cyklu románů nazvanému Podivuhodné cesty. Za svého života se stal jedním z nejpřekládanějších autorů na světě.",
    text: "Jak se podle textu nazývá rozsáhlý cyklus románů, kterému Verne věnoval svůj tvůrčí život?",
    options: ["Podivuhodné cesty", "Ztracený svět", "Cesta do neznáma", "Objevitelé nových světů"],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že Verne celý svůj tvůrčí život věnoval rozsáhlému cyklu románů nazvanému Podivuhodné cesty.",
    hint: "Hledej v textu název cyklu, kterému se Verne dlouhodobě věnoval.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Francouzský spisovatel Jules Verne, narozený v roce 1828 v přístavním městě Nantes, je dodnes považován za jednoho z otců moderního dobrodružného a vědeckofantastického románu. Ve svých knihách popisoval vynálezy a cesty, které byly v době jejich vzniku pouhou fantazií, například ponorky nebo lety na Měsíc, a mnohé z nich se později skutečně staly realitou. Verne psal rychle a systematicky, celý svůj tvůrčí život věnoval rozsáhlému cyklu románů nazvanému Podivuhodné cesty. Za svého života se stal jedním z nejpřekládanějších autorů na světě.",
    text: "Co se podle textu stalo s mnoha vynálezy, které Verne ve svých knihách popisoval?",
    options: [
      "zůstaly navždy jen fantazií",
      "později se skutečně staly realitou",
      "byly zesměšňovány vědci",
      "nikdy se o nich veřejnost nedozvěděla",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že mnohé z vynálezů, které Verne popisoval, se později skutečně staly realitou.",
    hint: "Hledej v textu, co se stalo s vynálezy z jeho knih s odstupem času.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Antoine de Saint-Exupéry se narodil roku 1900 ve francouzském Lyonu a už od mládí ho fascinovalo létání. Stal se profesionálním pilotem a létal na poštovních linkách přes Saharu i Jižní Ameriku, což mu poskytlo bohaté zkušenosti, které později přenesl do své literární tvorby. Během druhé světové války sloužil jako průzkumný pilot, a právě z jednoho takového letu nad Středozemním mořem v roce 1944 se už nevrátil. Jeho nejslavnější dílo, přeložené do stovek jazyků, spojuje jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života a vztazích mezi lidmi.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Saint-Exupéry se létání vyhýbal a nikdy nelétal.",
      "Saint-Exupéry pracoval jako pilot na poštovních linkách přes Saharu a Jižní Ameriku.",
      "Saint-Exupéry zemřel v poklidu ve vysokém věku doma ve Francii.",
      "Jeho nejslavnější dílo bylo přeloženo jen do francouzštiny.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se stal profesionálním pilotem a létal na poštovních linkách přes Saharu i Jižní Ameriku.",
    hint: "Hledej v textu, jaké profesi se Saint-Exupéry věnoval a kde přesně létal.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Antoine de Saint-Exupéry se narodil roku 1900 ve francouzském Lyonu a už od mládí ho fascinovalo létání. Stal se profesionálním pilotem a létal na poštovních linkách přes Saharu i Jižní Ameriku, což mu poskytlo bohaté zkušenosti, které později přenesl do své literární tvorby. Během druhé světové války sloužil jako průzkumný pilot, a právě z jednoho takového letu nad Středozemním mořem v roce 1944 se už nevrátil. Jeho nejslavnější dílo, přeložené do stovek jazyků, spojuje jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života a vztazích mezi lidmi.",
    text: "Kdy a za jakých okolností se podle textu Saint-Exupéry naposledy nevrátil z letu?",
    options: [
      "v roce 1900 při svém prvním letu",
      "v roce 1944 při průzkumném letu nad Středozemním mořem za druhé světové války",
      "v roce 1928 při letu přes Saharu",
      "text okolnosti jeho zmizení neuvádí",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se z průzkumného letu nad Středozemním mořem v roce 1944 už nevrátil.",
    hint: "Hledej ve druhé polovině textu údaj o roce a místu jeho posledního letu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Antoine de Saint-Exupéry se narodil roku 1900 ve francouzském Lyonu a už od mládí ho fascinovalo létání. Stal se profesionálním pilotem a létal na poštovních linkách přes Saharu i Jižní Ameriku, což mu poskytlo bohaté zkušenosti, které později přenesl do své literární tvorby. Během druhé světové války sloužil jako průzkumný pilot, a právě z jednoho takového letu nad Středozemním mořem v roce 1944 se už nevrátil. Jeho nejslavnější dílo, přeložené do stovek jazyků, spojuje jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života a vztazích mezi lidmi.",
    text: "Co spojuje podle textu jeho nejslavnější dílo?",
    options: [
      "jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života",
      "vědecký popis techniky letadel",
      "cestopisné poznámky ze Sahary",
      "historické pojednání o Francii",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že jeho nejslavnější dílo spojuje jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života a vztazích mezi lidmi.",
    hint: "Hledej poslední větu textu, která popisuje charakter jeho nejslavnějšího díla.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Antoine de Saint-Exupéry se narodil roku 1900 ve francouzském Lyonu a už od mládí ho fascinovalo létání. Stal se profesionálním pilotem a létal na poštovních linkách přes Saharu i Jižní Ameriku, což mu poskytlo bohaté zkušenosti, které později přenesl do své literární tvorby. Během druhé světové války sloužil jako průzkumný pilot, a právě z jednoho takového letu nad Středozemním mořem v roce 1944 se už nevrátil. Jeho nejslavnější dílo, přeložené do stovek jazyků, spojuje jednoduchý pohádkový příběh s hlubokou úvahou o smyslu lidského života a vztazích mezi lidmi.",
    text: "Kde se Antoine de Saint-Exupéry narodil?",
    options: ["v Paříži", "v Lyonu", "v Marseille", "v Nice"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se Saint-Exupéry narodil ve francouzském Lyonu.",
    hint: "Hledej první větu textu, která uvádí místo narození.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopečná činnost patří mezi nejsilnější přírodní procesy na Zemi. Když magma z nitra Země pronikne k povrchu, může dojít k výbušné erupci, která vymrští popel až do stratosféry. Sopečný popel sice dokáže na měsíce ovlivnit počasí na celé polokouli, ale zároveň po letech obohacuje půdu o minerály, díky nimž jsou oblasti v okolí sopek často velmi úrodné. Vědci proto sopky nepřetržitě monitorují nejen kvůli riziku erupce, ale i proto, aby lépe porozuměli tomu, jak vzniká zemská kůra.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Sopečný popel nemá na počasí žádný vliv.",
      "Půda v okolí sopek bývá po letech často velmi úrodná.",
      "Vědci sopky nesledují, protože jejich chování nelze nijak zkoumat.",
      "Sopečné erupce nikdy nevymrští popel výš než pár metrů nad zem.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že sopečný popel po letech obohacuje půdu o minerály, díky nimž jsou oblasti v okolí sopek často velmi úrodné.",
    hint: "Hledej v textu, co se děje s půdou v okolí sopek s odstupem času.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopečná činnost patří mezi nejsilnější přírodní procesy na Zemi. Když magma z nitra Země pronikne k povrchu, může dojít k výbušné erupci, která vymrští popel až do stratosféry. Sopečný popel sice dokáže na měsíce ovlivnit počasí na celé polokouli, ale zároveň po letech obohacuje půdu o minerály, díky nimž jsou oblasti v okolí sopek často velmi úrodné. Vědci proto sopky nepřetržitě monitorují nejen kvůli riziku erupce, ale i proto, aby lépe porozuměli tomu, jak vzniká zemská kůra.",
    text: "Proč vědci podle textu sopky nepřetržitě monitorují?",
    options: [
      "pouze kvůli turistickému ruchu",
      "kvůli riziku erupce a pro lepší porozumění vzniku zemské kůry",
      "protože je to zákonem povinné ve všech zemích",
      "kvůli těžbě drahých kovů",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že vědci sopky monitorují kvůli riziku erupce, ale i proto, aby lépe porozuměli tomu, jak vzniká zemská kůra.",
    hint: "Hledej poslední větu textu, která uvádí dva důvody sledování sopek.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopečná činnost patří mezi nejsilnější přírodní procesy na Zemi. Když magma z nitra Země pronikne k povrchu, může dojít k výbušné erupci, která vymrští popel až do stratosféry. Sopečný popel sice dokáže na měsíce ovlivnit počasí na celé polokouli, ale zároveň po letech obohacuje půdu o minerály, díky nimž jsou oblasti v okolí sopek často velmi úrodné. Vědci proto sopky nepřetržitě monitorují nejen kvůli riziku erupce, ale i proto, aby lépe porozuměli tomu, jak vzniká zemská kůra.",
    text: "Kam až může sopečný popel podle textu při výbušné erupci vyletět?",
    options: ["jen pár metrů nad kráter", "do stratosféry", "pouze do okolních údolí", "popel zůstává vždy jen v kráteru"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že výbušná erupce může vymrštit popel až do stratosféry.",
    hint: "Hledej v textu, jak vysoko se může popel při erupci dostat.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopečná činnost patří mezi nejsilnější přírodní procesy na Zemi. Když magma z nitra Země pronikne k povrchu, může dojít k výbušné erupci, která vymrští popel až do stratosféry. Sopečný popel sice dokáže na měsíce ovlivnit počasí na celé polokouli, ale zároveň po letech obohacuje půdu o minerály, díky nimž jsou oblasti v okolí sopek často velmi úrodné. Vědci proto sopky nepřetržitě monitorují nejen kvůli riziku erupce, ale i proto, aby lépe porozuměli tomu, jak vzniká zemská kůra.",
    text: "Co podle textu způsobuje sopečnou erupci?",
    options: [
      "pronikání magmatu z nitra Země k povrchu",
      "srážky meteoritů",
      "změny mořských proudů",
      "sluneční záření",
    ],
    correctAnswerIndex: 0,
    explanation: "Text uvádí, že když magma z nitra Země pronikne k povrchu, může dojít k výbušné erupci.",
    hint: "Hledej v první větě textu, co způsobuje erupci sopky.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kompas patří mezi nejstarší navigační přístroje lidstva a jeho princip zůstává už stovky let v podstatě stejný. Magnetická střelka se vlivem zemského magnetického pole natáčí tak, aby ukazovala přibližně k severnímu magnetickému pólu. Je důležité si uvědomit, že magnetický pól se nekryje přesně se zeměpisným severním pólem, a proto musí námořníci i turisté počítat s takzvanou magnetickou deklinací, tedy odchylkou mezi oběma směry. V blízkosti velkých kovových předmětů navíc může být ukazatel kompasu zkreslený, a proto se dnes často kombinuje s moderními družicovými navigačními systémy.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Magnetický severní pól je totožný se zeměpisným severním pólem.",
      "Kompas může být zkreslený v blízkosti velkých kovových předmětů.",
      "Kompas je vynálezem posledních dvaceti let.",
      "Magnetická deklinace se týká pouze leteckých kompasů, ne námořních.",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že v blízkosti velkých kovových předmětů může být ukazatel kompasu zkreslený.",
    hint: "Hledej v textu, za jakých okolností může být ukazatel kompasu nepřesný.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kompas patří mezi nejstarší navigační přístroje lidstva a jeho princip zůstává už stovky let v podstatě stejný. Magnetická střelka se vlivem zemského magnetického pole natáčí tak, aby ukazovala přibližně k severnímu magnetickému pólu. Je důležité si uvědomit, že magnetický pól se nekryje přesně se zeměpisným severním pólem, a proto musí námořníci i turisté počítat s takzvanou magnetickou deklinací, tedy odchylkou mezi oběma směry. V blízkosti velkých kovových předmětů navíc může být ukazatel kompasu zkreslený, a proto se dnes často kombinuje s moderními družicovými navigačními systémy.",
    text: "Co je podle textu magnetická deklinace?",
    options: [
      "odchylka mezi magnetickým a zeměpisným severním pólem",
      "jiný název pro střelku kompasu",
      "chyba ve výrobě starých kompasů",
      "vzdálenost mezi dvěma kompasy",
    ],
    correctAnswerIndex: 0,
    explanation: "Text uvádí, že magnetická deklinace je odchylka mezi magnetickým pólem a zeměpisným severním pólem.",
    hint: "Hledej v textu větu, která přímo definuje pojem magnetická deklinace.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kompas patří mezi nejstarší navigační přístroje lidstva a jeho princip zůstává už stovky let v podstatě stejný. Magnetická střelka se vlivem zemského magnetického pole natáčí tak, aby ukazovala přibližně k severnímu magnetickému pólu. Je důležité si uvědomit, že magnetický pól se nekryje přesně se zeměpisným severním pólem, a proto musí námořníci i turisté počítat s takzvanou magnetickou deklinací, tedy odchylkou mezi oběma směry. V blízkosti velkých kovových předmětů navíc může být ukazatel kompasu zkreslený, a proto se dnes často kombinuje s moderními družicovými navigačními systémy.",
    text: "Podle čeho se natáčí magnetická střelka kompasu?",
    options: ["podle slunečního světla", "podle zemského magnetického pole", "podle směru větru", "podle teploty vzduchu"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se magnetická střelka vlivem zemského magnetického pole natáčí k severnímu magnetickému pólu.",
    hint: "Hledej v textu, co způsobuje natočení střelky kompasu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kompas patří mezi nejstarší navigační přístroje lidstva a jeho princip zůstává už stovky let v podstatě stejný. Magnetická střelka se vlivem zemského magnetického pole natáčí tak, aby ukazovala přibližně k severnímu magnetickému pólu. Je důležité si uvědomit, že magnetický pól se nekryje přesně se zeměpisným severním pólem, a proto musí námořníci i turisté počítat s takzvanou magnetickou deklinací, tedy odchylkou mezi oběma směry. V blízkosti velkých kovových předmětů navíc může být ukazatel kompasu zkreslený, a proto se dnes často kombinuje s moderními družicovými navigačními systémy.",
    text: "S čím se dnes podle textu kompas často kombinuje?",
    options: [
      "s mechanickými hodinkami",
      "s moderními družicovými navigačními systémy",
      "s barometrem",
      "s teploměrem",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se kompas dnes často kombinuje s moderními družicovými navigačními systémy.",
    hint: "Hledej poslední větu textu, která popisuje, s čím se kompas dnes doplňuje.",
  },

  // ---- Porozumění textu (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Porozumění textu",
    workingText:
      "Sluneční panely přeměňují energii slunečního záření na elektrický proud pomocí takzvaného fotovoltaického jevu. Čím větší plochu panely zabírají a čím déle na ně svítí slunce, tím víc energie dokážou vyrobit. Účinnost běžných panelů se v posledních letech výrazně zvýšila, přesto stále platí, že výroba elektřiny klesá za zataženého počasí nebo v zimních měsících, kdy je den kratší. Přebytečnou energii lze uchovávat v bateriích nebo ji dodávat zpět do elektrické sítě.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Sluneční panely fungují stejně dobře za jasného i zataženého počasí.",
      "Výroba elektřiny ze slunečních panelů klesá za zataženého počasí nebo v zimě.",
      "Přebytečnou energii ze slunečních panelů nelze nijak uchovat.",
      "Účinnost slunečních panelů se v posledních letech nezměnila.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že výroba elektřiny klesá za zataženého počasí nebo v zimních měsících, kdy je den kratší.",
    hint: "Hledej v textu, za jakých podmínek panely vyrábějí méně elektřiny.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sluneční panely přeměňují energii slunečního záření na elektrický proud pomocí takzvaného fotovoltaického jevu. Čím větší plochu panely zabírají a čím déle na ně svítí slunce, tím víc energie dokážou vyrobit. Účinnost běžných panelů se v posledních letech výrazně zvýšila, přesto stále platí, že výroba elektřiny klesá za zataženého počasí nebo v zimních měsících, kdy je den kratší. Přebytečnou energii lze uchovávat v bateriích nebo ji dodávat zpět do elektrické sítě.",
    text: "Na jakém principu funguje výroba elektřiny ve slunečních panelech podle textu?",
    options: [
      "na fotovoltaickém jevu",
      "na spalování paliva",
      "na jaderné reakci",
      "na mechanickém pohybu lopatek",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že sluneční panely přeměňují energii slunečního záření na elektřinu pomocí fotovoltaického jevu.",
    hint: "Hledej v první větě textu odborný název jevu, na kterém výroba elektřiny funguje.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sluneční panely přeměňují energii slunečního záření na elektrický proud pomocí takzvaného fotovoltaického jevu. Čím větší plochu panely zabírají a čím déle na ně svítí slunce, tím víc energie dokážou vyrobit. Účinnost běžných panelů se v posledních letech výrazně zvýšila, přesto stále platí, že výroba elektřiny klesá za zataženého počasí nebo v zimních měsících, kdy je den kratší. Přebytečnou energii lze uchovávat v bateriích nebo ji dodávat zpět do elektrické sítě.",
    text: "Co se podle textu dá udělat s přebytečnou vyrobenou energií?",
    options: [
      "uchovat ji v bateriích nebo dodat zpět do sítě",
      "musí se okamžitě spotřebovat, jinak zanikne",
      "nedá se s ní nic dělat",
      "musí se prodat sousedům v hotovosti",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že přebytečnou energii lze uchovávat v bateriích nebo ji dodávat zpět do elektrické sítě.",
    hint: "Hledej poslední větu textu, která popisuje, co se děje s energií navíc.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Systémy sdílených kol umožňují obyvatelům měst vypůjčit si jízdní kolo na krátkou dobu přes mobilní aplikaci a po dojetí ho nechat na jiném stanovišti, aniž by museli vracet kolo tam, kde si ho půjčili. Kola jsou vybavena GPS lokátorem, díky kterému systém vždy ví, kde se aktuálně nachází. Provozovatelé musí pravidelně přemisťovat kola mezi stanovišti, protože ve špičce se některá místa vyprázdní a jiná se naopak přeplní. Podle zastánců tento systém pomáhá snižovat dopravní zácpy a znečištění ovzduší v centrech měst.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Kolo musí uživatel vždy vrátit na stejné stanoviště, kde si ho půjčil.",
      "Kola jsou vybavena GPS lokátorem, díky kterému systém ví, kde se nacházejí.",
      "Provozovatelé nikdy nemusí kola mezi stanovišti přemisťovat.",
      "Systém sdílených kol podle textu dopravní situaci ve městech nijak neovlivňuje.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že kola jsou vybavena GPS lokátorem, díky kterému systém vždy ví, kde se aktuálně nachází.",
    hint: "Hledej v textu, jakým technickým prvkem jsou kola vybavena a k čemu slouží.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Systémy sdílených kol umožňují obyvatelům měst vypůjčit si jízdní kolo na krátkou dobu přes mobilní aplikaci a po dojetí ho nechat na jiném stanovišti, aniž by museli vracet kolo tam, kde si ho půjčili. Kola jsou vybavena GPS lokátorem, díky kterému systém vždy ví, kde se aktuálně nachází. Provozovatelé musí pravidelně přemisťovat kola mezi stanovišti, protože ve špičce se některá místa vyprázdní a jiná se naopak přeplní. Podle zastánců tento systém pomáhá snižovat dopravní zácpy a znečištění ovzduší v centrech měst.",
    text: "Proč musí provozovatelé podle textu pravidelně přemisťovat kola mezi stanovišti?",
    options: [
      "protože se ve špičce některá místa vyprázdní a jiná přeplní",
      "protože kola se musí každý den čistit",
      "protože to nařizuje zákon jednou týdně",
      "protože GPS lokátor to vyžaduje",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že provozovatelé musí kola přemisťovat, protože se ve špičce některá stanoviště vyprázdní a jiná přeplní.",
    hint: "Hledej v textu vysvětlení, proč nestačí nechat kola tam, kam je uživatelé odloží.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Systémy sdílených kol umožňují obyvatelům měst vypůjčit si jízdní kolo na krátkou dobu přes mobilní aplikaci a po dojetí ho nechat na jiném stanovišti, aniž by museli vracet kolo tam, kde si ho půjčili. Kola jsou vybavena GPS lokátorem, díky kterému systém vždy ví, kde se aktuálně nachází. Provozovatelé musí pravidelně přemisťovat kola mezi stanovišti, protože ve špičce se některá místa vyprázdní a jiná se naopak přeplní. Podle zastánců tento systém pomáhá snižovat dopravní zácpy a znečištění ovzduší v centrech měst.",
    text: "Co podle zastánců sdílená kola pomáhají snižovat?",
    options: ["ceny benzínu", "dopravní zácpy a znečištění ovzduší", "počet chodců ve městě", "cenu jízdenek MHD"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že podle zastánců tento systém pomáhá snižovat dopravní zácpy a znečištění ovzduší v centrech měst.",
    hint: "Hledej poslední větu textu, která popisuje přínos systému podle jeho zastánců.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopky vznikají tam, kde se roztavená hornina, takzvané magma, dokáže z hlubin Země dostat až na povrch. K tomu nejčastěji dochází na rozhraní tektonických desek, tedy obřích kusů zemské kůry, které se pomalu pohybují a někdy do sebe narážejí nebo se od sebe vzdalují. Když magma vystoupí na povrch, nazývá se láva a při ochlazení tuhne do podoby sopečné horniny. Ne všechny sopky jsou stejně nebezpečné – některé chrlí lávu poklidně po dlouhou dobu, jiné mohou vybuchnout náhle a s velkou silou.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Sopky vznikají výhradně uprostřed tektonických desek, nikdy na jejich rozhraní.",
      "Magma, které vystoupí na povrch, se nazývá láva.",
      "Všechny sopky vybuchují stejným, náhlým a prudkým způsobem.",
      "Sopečná hornina vzniká zahříváním, ne ochlazováním magmatu.",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že když magma vystoupí na povrch, nazývá se láva.",
    hint: "Hledej v textu, jak se magma nazývá poté, co se dostane na zemský povrch.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopky vznikají tam, kde se roztavená hornina, takzvané magma, dokáže z hlubin Země dostat až na povrch. K tomu nejčastěji dochází na rozhraní tektonických desek, tedy obřích kusů zemské kůry, které se pomalu pohybují a někdy do sebe narážejí nebo se od sebe vzdalují. Když magma vystoupí na povrch, nazývá se láva a při ochlazení tuhne do podoby sopečné horniny. Ne všechny sopky jsou stejně nebezpečné – některé chrlí lávu poklidně po dlouhou dobu, jiné mohou vybuchnout náhle a s velkou silou.",
    text: "Kde podle textu nejčastěji vznikají sopky?",
    options: [
      "uprostřed oceánů bez souvislosti s deskami",
      "na rozhraní tektonických desek",
      "pouze na pólech",
      "pouze v pouštích",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že k výstupu magmatu na povrch nejčastěji dochází na rozhraní tektonických desek.",
    hint: "Hledej v textu, s jakým geologickým jevem vznik sopek nejčastěji souvisí.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Sopky vznikají tam, kde se roztavená hornina, takzvané magma, dokáže z hlubin Země dostat až na povrch. K tomu nejčastěji dochází na rozhraní tektonických desek, tedy obřích kusů zemské kůry, které se pomalu pohybují a někdy do sebe narážejí nebo se od sebe vzdalují. Když magma vystoupí na povrch, nazývá se láva a při ochlazení tuhne do podoby sopečné horniny. Ne všechny sopky jsou stejně nebezpečné – některé chrlí lávu poklidně po dlouhou dobu, jiné mohou vybuchnout náhle a s velkou silou.",
    text: "Jak se podle textu liší jednotlivé sopky mezi sebou?",
    options: [
      "všechny sopky jsou naprosto stejně nebezpečné",
      "některé chrlí lávu poklidně, jiné mohou vybuchnout náhle a silně",
      "liší se pouze barvou lávy",
      "liší se pouze nadmořskou výškou",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že některé sopky chrlí lávu poklidně po dlouhou dobu, zatímco jiné mohou vybuchnout náhle a s velkou silou.",
    hint: "Hledej poslední větu textu, která porovnává různé typy sopečné aktivity.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Ve 40. letech 15. století zdokonalil Johannes Gutenberg v Německu knihtisk pomocí pohyblivých liter slitých z kovu, což umožnilo mnohem rychlejší a levnější výrobu knih než dosavadní ruční přepisování. Před touto dobou musel každou knihu přepisovat písař, což trvalo měsíce až roky a knihy si mohli dovolit jen bohatí lidé nebo kláštery. Díky knihtisku se během několika desetiletí rozšířily tisíce nových titulů po celé Evropě, což výrazně přispělo k šíření gramotnosti a nových myšlenek.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Před knihtiskem se knihy tiskly stejně rychle jako po jeho vynálezu.",
      "Johannes Gutenberg zdokonalil knihtisk pomocí pohyblivých kovových liter.",
      "Knihy byly před vynálezem knihtisku dostupné všem vrstvám obyvatelstva stejně.",
      "Knihtisk zpomalil šíření gramotnosti v Evropě.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že Johannes Gutenberg zdokonalil knihtisk pomocí pohyblivých liter slitých z kovu.",
    hint: "Hledej v textu jméno osoby spojené se zdokonalením knihtisku a technologii, kterou k tomu použil.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Ve 40. letech 15. století zdokonalil Johannes Gutenberg v Německu knihtisk pomocí pohyblivých liter slitých z kovu, což umožnilo mnohem rychlejší a levnější výrobu knih než dosavadní ruční přepisování. Před touto dobou musel každou knihu přepisovat písař, což trvalo měsíce až roky a knihy si mohli dovolit jen bohatí lidé nebo kláštery. Díky knihtisku se během několika desetiletí rozšířily tisíce nových titulů po celé Evropě, což výrazně přispělo k šíření gramotnosti a nových myšlenek.",
    text: "Jak dlouho podle textu trvalo ruční přepisování jedné knihy před vynálezem knihtisku?",
    options: ["několik hodin", "několik dní", "měsíce až roky", "několik minut"],
    correctAnswerIndex: 2,
    explanation: "Text uvádí, že ruční přepisování knihy trvalo měsíce až roky.",
    hint: "Hledej v textu časový údaj popisující, jak dlouho trvalo přepsat knihu ručně.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Ve 40. letech 15. století zdokonalil Johannes Gutenberg v Německu knihtisk pomocí pohyblivých liter slitých z kovu, což umožnilo mnohem rychlejší a levnější výrobu knih než dosavadní ruční přepisování. Před touto dobou musel každou knihu přepisovat písař, což trvalo měsíce až roky a knihy si mohli dovolit jen bohatí lidé nebo kláštery. Díky knihtisku se během několika desetiletí rozšířily tisíce nových titulů po celé Evropě, což výrazně přispělo k šíření gramotnosti a nových myšlenek.",
    text: "K čemu podle textu knihtisk výrazně přispěl?",
    options: ["k šíření gramotnosti a nových myšlenek", "ke zdražení knih", "k úbytku klášterů", "ke zpomalení vzdělávání"],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že rozšíření knihtisku výrazně přispělo k šíření gramotnosti a nových myšlenek.",
    hint: "Hledej poslední větu textu, která popisuje dopad knihtisku na společnost.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kofein obsažený v kávě patří mezi nejrozšířenější povzbuzující látky na světě. Po vypití kávy se kofein vstřebává do krve zhruba během půl hodiny a blokuje receptory pro látku zvanou adenosin, která v mozku běžně signalizuje únavu. Díky tomu se člověk cítí čilejší a soustředěnější. Účinek kofeinu je ale u každého člověka trochu jiný a závisí například na tělesné hmotnosti, návyku na kofein nebo genetických predispozicích. Nadměrné množství kofeinu může u citlivějších lidí způsobit neklid, zrychlený tep nebo potíže se spánkem.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Kofein podporuje pocit únavy tím, že posiluje působení adenosinu.",
      "Kofein blokuje receptory pro adenosin, látku signalizující únavu.",
      "Účinek kofeinu je u všech lidí naprosto stejný.",
      "Kofein se do krve vstřebává až po několika hodinách.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že kofein blokuje receptory pro látku zvanou adenosin, která v mozku signalizuje únavu.",
    hint: "Hledej v textu, jakým mechanismem kofein v mozku působí.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kofein obsažený v kávě patří mezi nejrozšířenější povzbuzující látky na světě. Po vypití kávy se kofein vstřebává do krve zhruba během půl hodiny a blokuje receptory pro látku zvanou adenosin, která v mozku běžně signalizuje únavu. Díky tomu se člověk cítí čilejší a soustředěnější. Účinek kofeinu je ale u každého člověka trochu jiný a závisí například na tělesné hmotnosti, návyku na kofein nebo genetických predispozicích. Nadměrné množství kofeinu může u citlivějších lidí způsobit neklid, zrychlený tep nebo potíže se spánkem.",
    text: "Na čem podle textu závisí konkrétní účinek kofeinu u daného člověka?",
    options: [
      "pouze na množství vypité kávy",
      "na tělesné hmotnosti, návyku na kofein a genetických predispozicích",
      "pouze na denní době, kdy se káva pije",
      "na barvě kávových zrn",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že účinek kofeinu závisí například na tělesné hmotnosti, návyku na kofein nebo genetických predispozicích.",
    hint: "Hledej v textu výčet faktorů, na kterých závisí, jak kofein na konkrétního člověka působí.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Kofein obsažený v kávě patří mezi nejrozšířenější povzbuzující látky na světě. Po vypití kávy se kofein vstřebává do krve zhruba během půl hodiny a blokuje receptory pro látku zvanou adenosin, která v mozku běžně signalizuje únavu. Díky tomu se člověk cítí čilejší a soustředěnější. Účinek kofeinu je ale u každého člověka trochu jiný a závisí například na tělesné hmotnosti, návyku na kofein nebo genetických predispozicích. Nadměrné množství kofeinu může u citlivějších lidí způsobit neklid, zrychlený tep nebo potíže se spánkem.",
    text: "Co může podle textu způsobit nadměrné množství kofeinu u citlivějších lidí?",
    options: ["hluboký a klidný spánek", "neklid, zrychlený tep nebo potíže se spánkem", "ztrátu chuti k jídlu natrvalo", "zlepšení zraku"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že nadměrné množství kofeinu může u citlivějších lidí způsobit neklid, zrychlený tep nebo potíže se spánkem.",
    hint: "Hledej poslední větu textu, která popisuje možné negativní účinky vyššího množství kofeinu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Meteorologové při sestavování předpovědi počasí využívají data z tisíců měřicích stanic po celém světě, z meteorologických balonů i z družic obíhajících Zemi. Naměřené údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru se následně vkládají do výkonných počítačových modelů, které simulují, jak se atmosféra bude v následujících hodinách a dnech chovat. Čím vzdálenější je předpověď, tím méně je obvykle přesná, protože se malé nepřesnosti ve vstupních datech postupně zvětšují. Proto bývá předpověď na zítřek mnohem spolehlivější než předpověď na dva týdny dopředu.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Meteorologové využívají pouze data z pozemních měřicích stanic.",
      "Naměřené údaje se vkládají do počítačových modelů simulujících chování atmosféry.",
      "Předpověď na dva týdny dopředu je stejně přesná jako předpověď na zítřek.",
      "Malé nepřesnosti ve vstupních datech se v čase samy vyrovnávají.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se naměřené údaje vkládají do výkonných počítačových modelů, které simulují chování atmosféry.",
    hint: "Hledej v textu, co se děje s naměřenými údaji poté, co jsou shromážděny.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Meteorologové při sestavování předpovědi počasí využívají data z tisíců měřicích stanic po celém světě, z meteorologických balonů i z družic obíhajících Zemi. Naměřené údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru se následně vkládají do výkonných počítačových modelů, které simulují, jak se atmosféra bude v následujících hodinách a dnech chovat. Čím vzdálenější je předpověď, tím méně je obvykle přesná, protože se malé nepřesnosti ve vstupních datech postupně zvětšují. Proto bývá předpověď na zítřek mnohem spolehlivější než předpověď na dva týdny dopředu.",
    text: "Odkud podle textu meteorologové získávají data pro předpověď počasí?",
    options: [
      "pouze z měřicích stanic",
      "z měřicích stanic, meteorologických balonů a družic",
      "pouze z družic",
      "pouze z aplikací v mobilních telefonech",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že meteorologové využívají data z měřicích stanic, meteorologických balonů i z družic.",
    hint: "Hledej v první větě textu výčet zdrojů, ze kterých meteorologové data získávají.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Meteorologové při sestavování předpovědi počasí využívají data z tisíců měřicích stanic po celém světě, z meteorologických balonů i z družic obíhajících Zemi. Naměřené údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru se následně vkládají do výkonných počítačových modelů, které simulují, jak se atmosféra bude v následujících hodinách a dnech chovat. Čím vzdálenější je předpověď, tím méně je obvykle přesná, protože se malé nepřesnosti ve vstupních datech postupně zvětšují. Proto bývá předpověď na zítřek mnohem spolehlivější než předpověď na dva týdny dopředu.",
    text: "Proč je podle textu předpověď na zítřek spolehlivější než předpověď na dva týdny dopředu?",
    options: [
      "protože se malé nepřesnosti ve vstupních datech postupně zvětšují",
      "protože meteorologové na vzdálenější předpovědi nemají data",
      "protože počítačové modely na delší předpovědi vůbec nefungují",
      "protože vzdálenější předpověď nikdo nekontroluje",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že se malé nepřesnosti ve vstupních datech postupně zvětšují, což vzdálenější předpověď činí méně přesnou.",
    hint: "Hledej poslední větu textu, která vysvětluje, proč přesnost předpovědi s časem klesá.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Meteorologové při sestavování předpovědi počasí využívají data z tisíců měřicích stanic po celém světě, z meteorologických balonů i z družic obíhajících Zemi. Naměřené údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru se následně vkládají do výkonných počítačových modelů, které simulují, jak se atmosféra bude v následujících hodinách a dnech chovat. Čím vzdálenější je předpověď, tím méně je obvykle přesná, protože se malé nepřesnosti ve vstupních datech postupně zvětšují. Proto bývá předpověď na zítřek mnohem spolehlivější než předpověď na dva týdny dopředu.",
    text: "Jaké veličiny se podle textu měří pro účely předpovědi počasí?",
    options: ["pouze teplota", "teplota, tlak vzduchu, vlhkost a proudění větru", "pouze vlhkost vzduchu", "pouze rychlost větru"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se měří údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru.",
    hint: "Hledej v textu výčet konkrétních meteorologických veličin, které se zaznamenávají.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Meteorologové při sestavování předpovědi počasí využívají data z tisíců měřicích stanic po celém světě, z meteorologických balonů i z družic obíhajících Zemi. Naměřené údaje o teplotě, tlaku vzduchu, vlhkosti a proudění větru se následně vkládají do výkonných počítačových modelů, které simulují, jak se atmosféra bude v následujících hodinách a dnech chovat. Čím vzdálenější je předpověď, tím méně je obvykle přesná, protože se malé nepřesnosti ve vstupních datech postupně zvětšují. Proto bývá předpověď na zítřek mnohem spolehlivější než předpověď na dva týdny dopředu.",
    text: "Co se podle textu obecně děje s přesností předpovědi s rostoucí vzdáleností v čase?",
    options: ["přesnost roste", "přesnost zpravidla klesá", "přesnost zůstává vždy stejná", "text se touto otázkou nezabývá"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že čím vzdálenější je předpověď, tím méně je obvykle přesná.",
    hint: "Hledej větu, která obecně popisuje vztah mezi vzdáleností předpovědi v čase a její přesností.",
  },

  // ---- Porozumění textu (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Porozumění textu",
    workingText:
      "Chatboti využívající umělou inteligenci dokážou vést plynulou konverzaci, protože byli natrénováni na obrovském množství textů z internetu a knih. Během tréninku se model učí předvídat, jaké slovo pravděpodobně následuje po předchozích slovech ve větě. Díky tomu umí odpovídat na otázky, shrnovat texty nebo pomáhat s psaním, i když ve skutečnosti „nerozumí“ světu tak, jako to dělá člověk. Odborníci proto zdůrazňují, že odpovědi chatbotů je vždy dobré ověřit z jiného zdroje, protože se mohou splést nebo si něco vymyslet.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Chatboti rozumí světu úplně stejně jako člověk.",
      "Model se během tréninku učí předvídat, jaké slovo pravděpodobně následuje.",
      "Odpovědi chatbotů není nikdy potřeba ověřovat.",
      "Chatboti byli natrénováni jen na velmi malém množství textů.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se model během tréninku učí předvídat, jaké slovo pravděpodobně následuje po předchozích slovech ve větě.",
    hint: "Hledej v textu, na jakém principu se model během tréninku učí.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Chatboti využívající umělou inteligenci dokážou vést plynulou konverzaci, protože byli natrénováni na obrovském množství textů z internetu a knih. Během tréninku se model učí předvídat, jaké slovo pravděpodobně následuje po předchozích slovech ve větě. Díky tomu umí odpovídat na otázky, shrnovat texty nebo pomáhat s psaním, i když ve skutečnosti „nerozumí“ světu tak, jako to dělá člověk. Odborníci proto zdůrazňují, že odpovědi chatbotů je vždy dobré ověřit z jiného zdroje, protože se mohou splést nebo si něco vymyslet.",
    text: "Na čem byli chatboti podle textu natrénováni?",
    options: [
      "na obrovském množství textů z internetu a knih",
      "jen na jedné jediné knize",
      "na osobních datech uživatelů",
      "na zvukových nahrávkách",
    ],
    correctAnswerIndex: 0,
    explanation: "Text uvádí, že chatboti byli natrénováni na obrovském množství textů z internetu a knih.",
    hint: "Hledej v textu, z čeho se model podle textu učil.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Chatboti využívající umělou inteligenci dokážou vést plynulou konverzaci, protože byli natrénováni na obrovském množství textů z internetu a knih. Během tréninku se model učí předvídat, jaké slovo pravděpodobně následuje po předchozích slovech ve větě. Díky tomu umí odpovídat na otázky, shrnovat texty nebo pomáhat s psaním, i když ve skutečnosti „nerozumí“ světu tak, jako to dělá člověk. Odborníci proto zdůrazňují, že odpovědi chatbotů je vždy dobré ověřit z jiného zdroje, protože se mohou splést nebo si něco vymyslet.",
    text: "Co odborníci podle textu doporučují ohledně odpovědí chatbotů?",
    options: ["vždy je bez výhrad důvěřovat", "vždy je ověřit z jiného zdroje", "nikdy je nepoužívat", "ignorovat je"],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že je vždy dobré odpovědi chatbotů ověřit z jiného zdroje, protože se mohou splést nebo si něco vymyslet.",
    hint: "Hledej poslední větu textu, která dává čtenáři konkrétní doporučení.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Příliv a odliv vznikají hlavně díky gravitačnímu působení Měsíce na vodu v oceánech. Měsíc svou přitažlivostí nadzvedává hladinu na straně Země, která je k němu právě natočená, a podobná vlna vzniká i na protější straně planety. Protože se Země zároveň otáčí kolem své osy, prochází většina míst na pobřeží za jeden den dvěma přílivy a dvěma odlivy. Svým menším dílem k jevu přispívá i gravitace Slunce, která přílivové vlny buď zesiluje, nebo zeslabuje podle vzájemné polohy Slunce, Měsíce a Země.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Příliv a odliv způsobuje výhradně gravitace Slunce.",
      "Příliv a odliv vznikají hlavně díky gravitačnímu působení Měsíce.",
      "Většina míst na pobřeží zažije za den jen jeden příliv.",
      "Země se podle textu vůbec netočí kolem své osy.",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že příliv a odliv vznikají hlavně díky gravitačnímu působení Měsíce na vodu v oceánech.",
    hint: "Hledej v první větě textu, co je hlavní příčinou přílivu a odlivu.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Příliv a odliv vznikají hlavně díky gravitačnímu působení Měsíce na vodu v oceánech. Měsíc svou přitažlivostí nadzvedává hladinu na straně Země, která je k němu právě natočená, a podobná vlna vzniká i na protější straně planety. Protože se Země zároveň otáčí kolem své osy, prochází většina míst na pobřeží za jeden den dvěma přílivy a dvěma odlivy. Svým menším dílem k jevu přispívá i gravitace Slunce, která přílivové vlny buď zesiluje, nebo zeslabuje podle vzájemné polohy Slunce, Měsíce a Země.",
    text: "Kolikrát denně podle textu prochází většina míst na pobřeží přílivem a odlivem?",
    options: [
      "jednou přílivem a jednou odlivem",
      "dvakrát přílivem a dvakrát odlivem",
      "třikrát přílivem a třikrát odlivem",
      "text to neuvádí",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že většina míst na pobřeží prochází za jeden den dvěma přílivy a dvěma odlivy.",
    hint: "Hledej v textu číselný údaj o tom, kolikrát se jev za den opakuje.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Příliv a odliv vznikají hlavně díky gravitačnímu působení Měsíce na vodu v oceánech. Měsíc svou přitažlivostí nadzvedává hladinu na straně Země, která je k němu právě natočená, a podobná vlna vzniká i na protější straně planety. Protože se Země zároveň otáčí kolem své osy, prochází většina míst na pobřeží za jeden den dvěma přílivy a dvěma odlivy. Svým menším dílem k jevu přispívá i gravitace Slunce, která přílivové vlny buď zesiluje, nebo zeslabuje podle vzájemné polohy Slunce, Měsíce a Země.",
    text: "Jakou roli hraje podle textu gravitace Slunce?",
    options: [
      "je jedinou příčinou přílivu a odlivu",
      "menším dílem přílivové vlny zesiluje nebo zeslabuje",
      "nemá na příliv a odliv vůbec žádný vliv",
      "způsobuje otáčení Země kolem osy",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že gravitace Slunce svým menším dílem přílivové vlny buď zesiluje, nebo zeslabuje podle vzájemné polohy Slunce, Měsíce a Země.",
    hint: "Hledej poslední větu textu, která popisuje vedlejší vliv Slunce na příliv a odliv.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Svět je rozdělen do několika desítek časových pásem, aby čas na hodinách přibližně odpovídal poloze Slunce na obloze – tedy aby bylo poledne zhruba tehdy, když je slunce nejvýše. Hranice časových pásem přitom nekopírují přesně poledníky, ale často se přizpůsobují hranicím států, aby v rámci jedné země platil jednotný čas. Některé velké státy, jako Rusko nebo Spojené státy, se proto rozkládají hned přes několik časových pásem. Naproti tomu Čína, přestože je rozlohou srovnatelně velká, používá na celém svém území jen jediný, celostátní čas.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Hranice časových pásem vždy přesně kopírují zeměpisné poledníky.",
      "Čína používá na celém svém rozlehlém území jen jeden celostátní čas.",
      "Rusko a Spojené státy leží celé v jediném časovém pásmu.",
      "Účelem časových pásem je, aby bylo na celém světě stále poledne.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že Čína, přestože je rozlohou srovnatelně velká, používá na celém svém území jen jediný, celostátní čas.",
    hint: "Hledej poslední větu textu, která se týká Číny.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Svět je rozdělen do několika desítek časových pásem, aby čas na hodinách přibližně odpovídal poloze Slunce na obloze – tedy aby bylo poledne zhruba tehdy, když je slunce nejvýše. Hranice časových pásem přitom nekopírují přesně poledníky, ale často se přizpůsobují hranicím států, aby v rámci jedné země platil jednotný čas. Některé velké státy, jako Rusko nebo Spojené státy, se proto rozkládají hned přes několik časových pásem. Naproti tomu Čína, přestože je rozlohou srovnatelně velká, používá na celém svém území jen jediný, celostátní čas.",
    text: "Proč podle textu hranice časových pásem často nekopírují přesně poledníky?",
    options: [
      "protože se přizpůsobují hranicím států kvůli jednotnému času v zemi",
      "protože poledníky vůbec neexistují",
      "protože to nařizují mezinárodní organizace",
      "protože Slunce mění svou polohu nepravidelně",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že hranice časových pásem se často přizpůsobují hranicím států, aby v rámci jedné země platil jednotný čas.",
    hint: "Hledej v textu důvod, proč se hranice pásem odchylují od přesných poledníků.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Svět je rozdělen do několika desítek časových pásem, aby čas na hodinách přibližně odpovídal poloze Slunce na obloze – tedy aby bylo poledne zhruba tehdy, když je slunce nejvýše. Hranice časových pásem přitom nekopírují přesně poledníky, ale často se přizpůsobují hranicím států, aby v rámci jedné země platil jednotný čas. Některé velké státy, jako Rusko nebo Spojené státy, se proto rozkládají hned přes několik časových pásem. Naproti tomu Čína, přestože je rozlohou srovnatelně velká, používá na celém svém území jen jediný, celostátní čas.",
    text: "Které dva státy text uvádí jako příklad zemí rozkládajících se přes několik časových pásem?",
    options: ["Čína a Indie", "Rusko a Spojené státy", "Kanada a Brazílie", "Austrálie a Rusko"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí jako příklad Rusko a Spojené státy, které se rozkládají přes několik časových pásem.",
    hint: "Hledej v textu konkrétní jména dvou velkých států uvedených jako příklad.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Medvědi na zimu upadají do stavu, kterému se říká zimní spánek, i když se od pravé hibernace některých menších savců v mnoha ohledech liší. Tělesná teplota medvěda během zimního spánku klesne jen mírně a medvěd se dokáže poměrně rychle probudit, pokud je vyrušen. Naproti tomu opravdoví hibernanti, jako je například sysel, upadají do mnohem hlubšího spánku s výrazně nižší tělesnou teplotou a srdeční frekvencí a probouzejí se jen zvolna, v řádu hodin. Medvěd si na zimní spánek dopředu vytváří v těle zásoby tuku, protože po celé období nic nejí ani nepije.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Zimní spánek medvěda je naprosto totožný s pravou hibernací sysla.",
      "Tělesná teplota medvěda během zimního spánku klesá jen mírně.",
      "Medvěd se během zimního spánku nedokáže vůbec probudit.",
      "Medvěd si během zimního spánku dál běžně shání potravu.",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že tělesná teplota medvěda během zimního spánku klesne jen mírně.",
    hint: "Hledej v textu, jak moc se mění tělesná teplota medvěda ve srovnání s pravými hibernanty.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Medvědi na zimu upadají do stavu, kterému se říká zimní spánek, i když se od pravé hibernace některých menších savců v mnoha ohledech liší. Tělesná teplota medvěda během zimního spánku klesne jen mírně a medvěd se dokáže poměrně rychle probudit, pokud je vyrušen. Naproti tomu opravdoví hibernanti, jako je například sysel, upadají do mnohem hlubšího spánku s výrazně nižší tělesnou teplotou a srdeční frekvencí a probouzejí se jen zvolna, v řádu hodin. Medvěd si na zimní spánek dopředu vytváří v těle zásoby tuku, protože po celé období nic nejí ani nepije.",
    text: "Jak se podle textu liší probouzení medvěda od probouzení sysla?",
    options: [
      "medvěd se probouzí rychle, sysel se probouzí zvolna, v řádu hodin",
      "oba se probouzejí stejně rychle",
      "sysel se probouzí rychleji než medvěd",
      "text o probouzení nic neříká",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že medvěd se dokáže poměrně rychle probudit, zatímco praví hibernanti jako sysel se probouzejí jen zvolna, v řádu hodin.",
    hint: "Hledej v textu srovnání rychlosti probouzení mezi medvědem a syslem.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Medvědi na zimu upadají do stavu, kterému se říká zimní spánek, i když se od pravé hibernace některých menších savců v mnoha ohledech liší. Tělesná teplota medvěda během zimního spánku klesne jen mírně a medvěd se dokáže poměrně rychle probudit, pokud je vyrušen. Naproti tomu opravdoví hibernanti, jako je například sysel, upadají do mnohem hlubšího spánku s výrazně nižší tělesnou teplotou a srdeční frekvencí a probouzejí se jen zvolna, v řádu hodin. Medvěd si na zimní spánek dopředu vytváří v těle zásoby tuku, protože po celé období nic nejí ani nepije.",
    text: "Na co si medvěd podle textu dopředu vytváří zásoby?",
    options: ["na vodu", "na tuk", "na dřevo pro pelech", "na semínka"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že si medvěd na zimní spánek dopředu vytváří v těle zásoby tuku.",
    hint: "Hledej poslední větu textu, která popisuje přípravu medvěda na období bez jídla.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Duha vzniká, když sluneční paprsky procházejí kapkami vody visícími ve vzduchu, typicky po dešti nebo u vodopádu. Uvnitř každé kapky se světlo láme a zároveň se uvnitř kapky jednou odráží, čímž se rozloží na jednotlivé barvy, protože každá barva světla se láme pod mírně jiným úhlem. Aby pozorovatel duhu viděl, musí mít Slunce za zády a kapky vody před sebou, přibližně ve výšce čtyřiceti stupňů nad obzorem. Proto se duha objevuje nejčastěji ráno nebo navečer, kdy je Slunce nízko nad obzorem.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Duha vzniká lomem a odrazem světla uvnitř kapek vody.",
      "Všechny barvy světla se uvnitř kapky lámou pod naprosto stejným úhlem.",
      "Aby člověk viděl duhu, musí mít Slunce před sebou.",
      "Duha se objevuje výhradně v poledne, kdy je slunce nejvýše.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí, že se uvnitř kapky světlo láme a zároveň jednou odráží, čímž se rozloží na jednotlivé barvy.",
    hint: "Hledej v textu, co přesně se děje se světlem uvnitř kapky vody.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Duha vzniká, když sluneční paprsky procházejí kapkami vody visícími ve vzduchu, typicky po dešti nebo u vodopádu. Uvnitř každé kapky se světlo láme a zároveň se uvnitř kapky jednou odráží, čímž se rozloží na jednotlivé barvy, protože každá barva světla se láme pod mírně jiným úhlem. Aby pozorovatel duhu viděl, musí mít Slunce za zády a kapky vody před sebou, přibližně ve výšce čtyřiceti stupňů nad obzorem. Proto se duha objevuje nejčastěji ráno nebo navečer, kdy je Slunce nízko nad obzorem.",
    text: "Kde musí být Slunce, aby pozorovatel duhu viděl?",
    options: ["před pozorovatelem", "za zády pozorovatele", "přímo nad pozorovatelem", "pod obzorem"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že pozorovatel musí mít Slunce za zády a kapky vody před sebou.",
    hint: "Hledej v textu, kde se má vzhledem k pozorovateli nacházet Slunce.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Duha vzniká, když sluneční paprsky procházejí kapkami vody visícími ve vzduchu, typicky po dešti nebo u vodopádu. Uvnitř každé kapky se světlo láme a zároveň se uvnitř kapky jednou odráží, čímž se rozloží na jednotlivé barvy, protože každá barva světla se láme pod mírně jiným úhlem. Aby pozorovatel duhu viděl, musí mít Slunce za zády a kapky vody před sebou, přibližně ve výšce čtyřiceti stupňů nad obzorem. Proto se duha objevuje nejčastěji ráno nebo navečer, kdy je Slunce nízko nad obzorem.",
    text: "Proč se podle textu duha objevuje nejčastěji ráno nebo navečer?",
    options: [
      "protože tehdy prší nejvíc",
      "protože je tehdy Slunce nízko nad obzorem",
      "protože tehdy je nejvíc kapek vody ve vzduchu",
      "protože tehdy je nejchladněji",
    ],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že se duha objevuje nejčastěji ráno nebo navečer, kdy je Slunce nízko nad obzorem.",
    hint: "Hledej poslední větu textu, která vysvětluje časovou souvislost s polohou Slunce.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Duha vzniká, když sluneční paprsky procházejí kapkami vody visícími ve vzduchu, typicky po dešti nebo u vodopádu. Uvnitř každé kapky se světlo láme a zároveň se uvnitř kapky jednou odráží, čímž se rozloží na jednotlivé barvy, protože každá barva světla se láme pod mírně jiným úhlem. Aby pozorovatel duhu viděl, musí mít Slunce za zády a kapky vody před sebou, přibližně ve výšce čtyřiceti stupňů nad obzorem. Proto se duha objevuje nejčastěji ráno nebo navečer, kdy je Slunce nízko nad obzorem.",
    text: "V jaké přibližné výšce nad obzorem se podle textu musí nacházet kapky vody, aby pozorovatel duhu viděl?",
    options: ["deset stupňů", "dvacet stupňů", "čtyřicet stupňů", "devadesát stupňů"],
    correctAnswerIndex: 2,
    explanation: "Text uvádí, že kapky vody musí být přibližně ve výšce čtyřiceti stupňů nad obzorem.",
    hint: "Hledej v textu konkrétní číselný údaj o úhlu, ve kterém se kapky vody musí nacházet.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Větrné elektrárny přeměňují kinetickou energii proudícího vzduchu na elektřinu pomocí velkých lopatek, které roztáčejí generátor uvnitř turbíny. Čím silnější a stálejší vítr v daném místě fouká, tím víc elektřiny turbína dokáže vyrobit, a proto se větrné elektrárny často staví na kopcích, na otevřených pláních nebo přímo v moři, kde vítr fouká vytrvaleji než na souši. Výhodou větrné energie je, že při samotném provozu turbíny nevznikají žádné emise skleníkových plynů. Nevýhodou naopak zůstává, že výroba elektřiny kolísá podle aktuálního počasí a bez větru turbíny elektřinu nevyrábějí vůbec.",
    text: "Které z následujících tvrzení odpovídá výchozímu textu?",
    options: [
      "Větrné elektrárny přeměňují energii slunečního záření na elektřinu.",
      "Větrné elektrárny se často staví na místech, kde vítr fouká silně a stále.",
      "Výroba elektřiny z větru je vždy naprosto stálá a nekolísá.",
      "Provoz větrných turbín produkuje velké množství emisí skleníkových plynů.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Text uvádí, že se větrné elektrárny často staví na kopcích, na otevřených pláních nebo v moři, kde vítr fouká vytrvaleji.",
    hint: "Hledej v textu, na jakých místech se větrné elektrárny podle textu obvykle staví a proč.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Větrné elektrárny přeměňují kinetickou energii proudícího vzduchu na elektřinu pomocí velkých lopatek, které roztáčejí generátor uvnitř turbíny. Čím silnější a stálejší vítr v daném místě fouká, tím víc elektřiny turbína dokáže vyrobit, a proto se větrné elektrárny často staví na kopcích, na otevřených pláních nebo přímo v moři, kde vítr fouká vytrvaleji než na souši. Výhodou větrné energie je, že při samotném provozu turbíny nevznikají žádné emise skleníkových plynů. Nevýhodou naopak zůstává, že výroba elektřiny kolísá podle aktuálního počasí a bez větru turbíny elektřinu nevyrábějí vůbec.",
    text: "Jakou výhodu větrné energie text uvádí?",
    options: [
      "při provozu turbíny nevznikají žádné emise skleníkových plynů",
      "vyrábí elektřinu naprosto konstantně, bez ohledu na počasí",
      "je levnější než všechny ostatní zdroje energie",
      "nepotřebuje k výrobě elektřiny žádný vítr",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí jako výhodu, že při samotném provozu turbíny nevznikají žádné emise skleníkových plynů.",
    hint: "Hledej v textu větu začínající slovem „Výhodou“.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Větrné elektrárny přeměňují kinetickou energii proudícího vzduchu na elektřinu pomocí velkých lopatek, které roztáčejí generátor uvnitř turbíny. Čím silnější a stálejší vítr v daném místě fouká, tím víc elektřiny turbína dokáže vyrobit, a proto se větrné elektrárny často staví na kopcích, na otevřených pláních nebo přímo v moři, kde vítr fouká vytrvaleji než na souši. Výhodou větrné energie je, že při samotném provozu turbíny nevznikají žádné emise skleníkových plynů. Nevýhodou naopak zůstává, že výroba elektřiny kolísá podle aktuálního počasí a bez větru turbíny elektřinu nevyrábějí vůbec.",
    text: "Jakou nevýhodu větrné energie text uvádí?",
    options: [
      "výroba elektřiny kolísá podle aktuálního počasí",
      "turbíny jsou příliš tiché",
      "větrné elektrárny nelze stavět v moři",
      "vítr nikdy nefouká dostatečně silně",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Text uvádí jako nevýhodu, že výroba elektřiny kolísá podle aktuálního počasí a bez větru turbíny nevyrábějí elektřinu vůbec.",
    hint: "Hledej v textu větu začínající slovem „Nevýhodou“.",
  },
  {
    category: "Porozumění textu",
    workingText:
      "Větrné elektrárny přeměňují kinetickou energii proudícího vzduchu na elektřinu pomocí velkých lopatek, které roztáčejí generátor uvnitř turbíny. Čím silnější a stálejší vítr v daném místě fouká, tím víc elektřiny turbína dokáže vyrobit, a proto se větrné elektrárny často staví na kopcích, na otevřených pláních nebo přímo v moři, kde vítr fouká vytrvaleji než na souši. Výhodou větrné energie je, že při samotném provozu turbíny nevznikají žádné emise skleníkových plynů. Nevýhodou naopak zůstává, že výroba elektřiny kolísá podle aktuálního počasí a bez větru turbíny elektřinu nevyrábějí vůbec.",
    text: "Co přesně roztáčí generátor uvnitř větrné turbíny?",
    options: ["sluneční záření", "velké lopatky poháněné proudícím vzduchem", "voda", "pára"],
    correctAnswerIndex: 1,
    explanation: "Text uvádí, že velké lopatky, poháněné proudícím vzduchem, roztáčejí generátor uvnitř turbíny.",
    hint: "Hledej v první větě textu, co přesně otáčí generátorem.",
  },

  // ---- Slovní zásoba (nové) ----
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „usilovný“?",
    options: ["lenivý", "namáhavý", "radostný", "tichý"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „usilovný“ znamená vyžadující velké úsilí, námahu – nejbližší synonymum je „namáhavý“.",
    hint: "Hledej slovo, které má podobný význam jako „vyžadující velké úsilí“.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem (opakem) ke slovu „štědrý“?",
    options: ["lakomý", "laskavý", "bohatý", "veselý"],
    correctAnswerIndex: 0,
    explanation:
      "„Štědrý“ znamená ochotný dávat, rozdávat – opakem je „lakomý“, tedy neochotný dávat.",
    hint: "Hledej slovo s opačným významem – ten, kdo nerad dává nebo utrácí.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „hlava“ ve větě: „Byl hlavou celé rodiny.“?",
    options: ["část těla", "vedoucí, představitel", "začátek něčeho", "kapitola knihy"],
    correctAnswerIndex: 1,
    explanation:
      "V tomto kontextu slovo „hlava“ neoznačuje část těla, ale osobu, která rodinu vede a rozhoduje – tedy vedoucího, představitele.",
    hint: "Zamysli se, co znamená být „hlavou“ nějaké skupiny lidí v přeneseném významu.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym (slov stejně znějících, ale s různým významem)?",
    options: [
      "kolej (studentská) – kolej (železniční)",
      "dům – domeček",
      "auto – automobil",
      "kniha – knížka",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „kolej“ může znamenat jak ubytovací zařízení pro studenty, tak součást železniční trati – jde o dvě různá slova, která zní i píší se stejně (homonyma).",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo nejlépe nahradí zvýrazněné slovo ve větě: „Jeho reakce byla naprosto iracionální.“?",
    options: ["logická", "nerozumná", "rychlá", "tichá"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „iracionální“ znamená nerozumný, odporující logice – nejbližší náhradou je „nerozumná“.",
    hint: "Slovo „iracionální“ souvisí se slovem „racionální“ (rozumný) – jde o jeho opak s předponou popírající význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Které ze slov NENÍ synonymem k ostatním třem?",
    options: ["nedostatek", "absence", "deficit", "přítomnost"],
    correctAnswerIndex: 3,
    explanation:
      "Slova „nedostatek“, „absence“ a „deficit“ znamenají v podstatě totéž – chybění něčeho. Slovo „přítomnost“ má opačný význam – označuje, že něco naopak je k dispozici.",
    hint: "Tři ze čtyř slov znamenají, že něco chybí. Jedno slovo znamená pravý opak.",
  },

  // ---- Slovní zásoba (nové, druhá dávka – doplnění do 20) ----
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „zdatný“?",
    options: ["slabý", "schopný", "líný", "smutný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „zdatný“ znamená schopný podávat dobrý výkon, být silný a výkonný – nejbližší synonymum je „schopný“.",
    hint: "Hledej slovo, které popisuje někoho, kdo je výkonný a dobře si vede.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem (opakem) ke slovu „hbitý“?",
    options: ["rychlý", "mrštný", "pomalý", "obratný"],
    correctAnswerIndex: 2,
    explanation: "Slovo „hbitý“ znamená rychlý, mrštný – opakem je „pomalý“.",
    hint: "Hledej slovo s opačným významem – ten, kdo se pohybuje pomalu, neobratně.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „zrnko“ ve větě: „V jeho slovech bylo zrnko pravdy.“?",
    options: [
      "malý kousek obilí",
      "malá část, náznak něčeho",
      "zrnitá struktura kávy",
      "součást pískoviště",
    ],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „zrnko pravdy“ znamená malou část, náznak pravdy v tom, co bylo řečeno.",
    hint: "Přemýšlej v přeneseném (obrazném) významu, ne doslovně jako o zrnu obilí.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym?",
    options: ["stůl – stolek", "list (papíru) – list (rostliny)", "auto – automobil", "dům – domek"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „list“ může znamenat jak list papíru, tak list rostliny – jde o dvě různé věci, které zní i píší se stejně (homonyma).",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „anonymní“?",
    options: ["veřejně známý", "bez uvedení jména", "velmi starý", "cizojazyčný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „anonymní“ znamená bez uvedení jména, jehož autor nebo původce zůstává neznámý.",
    hint: "Předpona an- znamená v mnoha cizích slovech zápor, popření (podobně jako v „anomálie“).",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená úsloví „mít máslo na hlavě“?",
    options: [
      "být bohatý",
      "být provinilý, mít něco na svědomí",
      "mít dobrou náladu",
      "být velmi chytrý",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Úsloví „mít máslo na hlavě“ znamená být provinilý, mít nějakou vinu nebo tajemství, které se snaží skrýt.",
    hint: "Jde o ustálené obrazné spojení – nehledej doslovný význam slov.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „hodit flintu do žita“?",
    options: [
      "vzdát se, přestat s něčím bojovat",
      "začít novou činnost",
      "jít na lov",
      "být velmi opatrný",
    ],
    correctAnswerIndex: 0,
    explanation: "Rčení „hodit flintu do žita“ znamená vzdát se, rezignovat na další úsilí.",
    hint: "Zamysli se, co by znamenalo, kdyby lovec zahodil svou zbraň a přestal lovit.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve které možnosti nejsou slova ve dvojici synonymy?",
    options: ["radost – potěšení", "start – začátek", "konec – závěr", "klid – neklid"],
    correctAnswerIndex: 3,
    explanation:
      "Slova „klid“ a „neklid“ mají opačný význam (jsou antonyma), nikoli synonymním párem jako ostatní dvojice.",
    hint: "Tři dvojice mají téměř stejný význam, jedna dvojice má význam opačný.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „import“?",
    options: [
      "vývoz zboží do zahraničí",
      "dovoz zboží ze zahraničí",
      "výroba zboží",
      "prodej zboží v obchodě",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „import“ znamená dovoz zboží ze zahraničí (opakem je export – vývoz).",
    hint: "Slovo souvisí s obchodem se zahraničím – zkus si vzpomenout na jeho opak „export“.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „export“?",
    options: [
      "dovoz zboží ze zahraničí",
      "vývoz zboží do zahraničí",
      "skladování zboží",
      "reklama na zboží",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „export“ znamená vývoz zboží do zahraničí (opakem je import – dovoz).",
    hint: "Slovo souvisí s obchodem se zahraničím – zkus si vzpomenout na jeho opak „import“.",
  },
  {
    category: "Slovní zásoba",
    text: "Jaký je vztah mezi slovy „ruka“ a „ručička“?",
    options: ["synonyma", "antonyma", "zdrobnělina (deminutivum)", "homonyma"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „ručička“ je zdrobnělinou (deminutivem) slova „ruka“, vyjadřuje menší nebo roztomilejší podobu téže věci.",
    hint: "Přípona -ička často vytváří zdrobněliny, tedy menší nebo láskyplnější podobu slova.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „pero“ ve větě: „Pták ztratil pero z křídla.“?",
    options: ["psací potřeba", "součást peří ptáka", "pružina", "kovová destička"],
    correctAnswerIndex: 1,
    explanation:
      "V této větě slovo „pero“ znamená součást ptačího peří, nikoli psací potřebu nebo pružinu.",
    hint: "Zaměř se na kontext věty – mluví se o ptákovi a jeho křídle.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve které možnosti jsou uvedená slova synonymy?",
    options: ["statečný – zbabělý", "hbitý – mrštný", "hlučný – tichý", "štědrý – lakomý"],
    correctAnswerIndex: 1,
    explanation:
      "Slova „hbitý“ a „mrštný“ mají téměř stejný význam (rychlý, obratný) – jsou synonymy. Ostatní dvojice jsou naopak antonyma.",
    hint: "Tři dvojice jsou opaky (antonyma), jen jedna dvojice má podobný význam (synonyma).",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „vlk“ ve větě: „Byl to starý mořský vlk.“?",
    options: [
      "dravé zvíře z čeledi psovitých",
      "zkušený, protřelý námořník",
      "hladový člověk",
      "nebezpečný predátor v oceánu",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Ve spojení „mořský vlk“ jde o ustálené přenesené pojmenování zkušeného, protřelého námořníka, nikoli o skutečné zvíře.",
    hint: "Jde o ustálené obrazné spojení označující člověka s mnohaletou zkušeností na moři.",
  },

  // ---- Slovní zásoba (nové, třetí dávka – doplnění do 40) ----
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „důkladný“?",
    options: ["povrchní", "pečlivý", "rychlý", "lhostejný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „důkladný“ znamená pečlivý, precizní, dělaný se vší pozorností – nejbližší synonymum je „pečlivý“.",
    hint: "Hledej slovo popisující někoho, kdo dělá věci se vší pečlivostí a nic nezanedbá.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „skromný“?",
    options: ["nenápadný", "okázalý", "tichý", "pilný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „skromný“ znamená nenáročný, nenápadný – opakem je „okázalý“ (nápadný, do očí bijící).",
    hint: "Hledej slovo popisující někoho, kdo se rád předvádí a chce být nápadný.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym?",
    options: ["klika (dveří) – klika (štěstí)", "voda – vodička", "les – lesík", "strom – stromek"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „klika“ může znamenat jak součást dveří, tak štěstí (mít kliku) – jde o dvě různé věci, které zní i píší se stejně.",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „srdce“ ve větě: „Praha je srdcem Evropy.“?",
    options: ["orgán v těle", "centrum, střed něčeho", "citový vztah", "dárek pro milovanou osobu"],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „srdce“ označuje centrum, střed něčeho důležitého – zde střed Evropy.",
    hint: "Přemýšlej v obrazném významu – co znamená být „srdcem“ nějakého území?",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „mít v hlavě guláš“?",
    options: ["mít hlad", "mít zmatek v myšlenkách", "mít výbornou paměť", "vařit oběd"],
    correctAnswerIndex: 1,
    explanation: "Rčení „mít v hlavě guláš“ znamená mít zmatek, chaos v myšlenkách.",
    hint: "Přemýšlej o guláši jako o něčem, kde jsou různé ingredience smíchané dohromady bez ladu a skladu.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená úsloví „být za vodou“?",
    options: [
      "mít vyřešené finanční problémy, mít dostatek peněz",
      "být promočený deštěm",
      "cestovat lodí",
      "být na dovolené",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Úsloví „být za vodou“ znamená mít vyřešené existenční/finanční starosti, mít dostatek peněz.",
    hint: "Jde o ustálené obrazné spojení, které se týká finanční situace, ne doslovné vody.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „efektivní“?",
    options: ["neúčinný", "účinný, přinášející žádaný výsledek", "drahý", "pomalý"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „efektivní“ znamená účinný, přinášející žádoucí výsledek s co nejmenším úsilím.",
    hint: "Slovo souvisí se slovem „efekt“ (účinek, výsledek).",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „diskrétní“?",
    options: ["hlučný", "nenápadný, taktní, zachovávající tajemství", "barevný", "rychlý"],
    correctAnswerIndex: 1,
    explanation: "Slovo „diskrétní“ znamená taktní, nenápadný, schopný zachovat tajemství.",
    hint: "Slovo se často používá ve spojení s někým, kdo umí udržet tajemství a nechová se okatě.",
  },
  {
    category: "Slovní zásoba",
    text: "Jaký je vztah mezi slovy „strom“ a „stromeček“?",
    options: ["synonyma", "antonyma", "zdrobnělina (deminutivum)", "homonyma"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „stromeček“ je zdrobnělinou slova „strom“, vyjadřuje menší nebo roztomilejší podobu téže věci.",
    hint: "Přípona -eček často vytváří zdrobněliny, tedy menší nebo láskyplnější podobu slova.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá slovo, které vzniklo zveličením základního slova, např. „chlapisko“ ze slova „chlap“?",
    options: ["zdrobnělina", "augmentativum (zveličelé slovo)", "synonymum", "homonymum"],
    correctAnswerIndex: 1,
    explanation:
      "Augmentativum je slovo vyjadřující zveličenou, zesílenou podobu základního slova (chlap → chlapisko, dům → domisko).",
    hint: "Opak zdrobněliny – místo zmenšení slovo naopak zveličuje.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je citově zabarvené (expresivní)?",
    options: ["dům", "chaloupka", "budova", "stavba"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „chaloupka“ nese citové zabarvení (láskyplný, familiární tón) na rozdíl od neutrálních slov dům, budova, stavba.",
    hint: "Hledej slovo, které v sobě nese emoční, láskyplný nádech, ne jen věcné pojmenování.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z následujících slov je knižní (spisovné, formální), nikoli hovorové?",
    options: ["auťák", "brácha", "dítě", "fotka"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „dítě“ je neutrální/spisovné pojmenování, zatímco „auťák“, „brácha“ a „fotka“ jsou hovorové (neformální) varianty.",
    hint: "Tři ze čtyř slov bys použil v běžné mluvě s kamarády, jedno je vhodné i pro formální text.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „poctivý“?",
    options: ["upřímný", "nečestný", "pracovitý", "spolehlivý"],
    correctAnswerIndex: 1,
    explanation: "Slovo „poctivý“ znamená čestný, spravedlivý – opakem je „nečestný“.",
    hint: "Hledej slovo popisující někoho, kdo podvádí nebo lže.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „prchlivý“?",
    options: ["klidný", "trpělivý", "vznětlivý", "líný"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „prchlivý“ znamená snadno se rozzlobit, vznětlivý – nejbližší synonymum je „vznětlivý“.",
    hint: "Hledej slovo popisující někoho, kdo se rychle rozzlobí.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „synonymum“?",
    options: [
      "slovo s opačným významem",
      "slovo s podobným nebo stejným významem",
      "slovo, které zní stejně jako jiné",
      "cizí slovo",
    ],
    correctAnswerIndex: 1,
    explanation: "Synonymum je slovo, které má stejný nebo velmi podobný význam jako jiné slovo.",
    hint: "Vzpomeň si, s jakými typy otázek jsi se v této kategorii už setkal(a) – hledáš definici tohoto pojmu samotného.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „antonymum“?",
    options: [
      "slovo s podobným významem",
      "slovo s opačným významem",
      "slovo, které zní stejně jako jiné",
      "zastaralé slovo",
    ],
    correctAnswerIndex: 1,
    explanation: "Antonymum je slovo s opačným významem než jiné slovo.",
    hint: "Předpona anti- v mnoha slovech znamená „proti“.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „had“ ve větě: „Byl to pravý had, nikomu se nedalo věřit.“?",
    options: ["plaz bez nohou", "zákeřný, proradný člověk", "dlouhá fronta lidí", "hadice na zalévání"],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „had“ označuje zákeřného, proradného člověka, kterému se nedá věřit.",
    hint: "Přemýšlej v obrazném významu – jaké vlastnosti se hadovi tradičně přisuzují v lidové řeči?",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „lít vodu na cizí mlýn“?",
    options: [
      "zavlažovat pole",
      "pomáhat nevědomky protivníkovi nebo jeho zájmům",
      "stavět nový mlýn",
      "plýtvat vodou",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Rčení „lít vodu na cizí mlýn“ znamená (často nevědomky) pomáhat něčím zájmům, které nejsou naše vlastní, nahrávat protistraně.",
    hint: "Přemýšlej, co by znamenalo, kdyby voda z tvého vlastního mlýna poháněla mlýn někoho jiného.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je mnohoznačné (má víc různých významů)?",
    options: ["kohoutek", "tramvaj", "učebnice", "sešit"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „kohoutek“ může znamenat mladého kohouta, součást vodovodu i spoušť u zbraně – je tedy mnohoznačné (polysémní). Ostatní slova mají jen jeden ustálený význam.",
    hint: "Hledej slovo, které může označovat úplně různé věci podle kontextu – zvíře, ale i něco jiného.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve které možnosti jsou slova ve dvojici antonyma (ne synonyma)?",
    options: ["radostný – veselý", "statečný – odvážný", "hlučný – tichý", "chytrý – bystrý"],
    correctAnswerIndex: 2,
    explanation:
      "Slova „hlučný“ a „tichý“ mají opačný význam – jsou antonyma. Ostatní dvojice mají podobný význam (synonyma).",
    hint: "Tři dvojice mají podobný význam, jedna dvojice má význam opačný.",
  },

  // ---- Slovní zásoba (nové, čtvrtá dávka) ----
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „vzácný“?",
    options: ["běžný", "cenný", "levný", "obyčejný"],
    correctAnswerIndex: 1,
    explanation: "Slovo „vzácný“ znamená řídce se vyskytující, hodnotný – nejbližší synonymum je „cenný“.",
    hint: "Hledej slovo popisující něco, čeho je málo a má to velkou hodnotu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „štíhlý“?",
    options: ["hubený", "tlustý", "vysoký", "malý"],
    correctAnswerIndex: 1,
    explanation: "Slovo „štíhlý“ znamená subtilní, útlý – opakem je „tlustý“.",
    hint: "Hledej slovo s opačným významem – ten, kdo má nadváhu.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym?",
    options: [
      "pec (kamna) – pec (jeskyně ve skále)",
      "auto – autíčko",
      "strom – stromoví",
      "kniha – knihovna",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „pec“ může znamenat jak kamna na pečení, tak přírodní dutinu ve skále – jde o dvě různá slova, která zní i píší se stejně.",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „relevantní“?",
    options: ["nedůležitý", "důležitý, podstatný, vztahující se k věci", "zastaralý", "tajný"],
    correctAnswerIndex: 1,
    explanation: "Slovo „relevantní“ znamená důležitý, podstatný, vztahující se k dané věci.",
    hint: "Slovo se často používá ve spojení s informací, která je pro danou věc opravdu důležitá.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „autentický“?",
    options: ["padělaný", "pravý, skutečný, nezfalšovaný", "cizí", "starý"],
    correctAnswerIndex: 1,
    explanation: "Slovo „autentický“ znamená pravý, skutečný, nezfalšovaný.",
    hint: "Slovo se často používá k označení něčeho, co je doopravdy původní, ne kopie nebo napodobenina.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov má hanlivý (pejorativní) význam?",
    options: ["dům", "barák", "stavba", "obydlí"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „barák“ má v tomto kontextu hanlivý (pejorativní) nádech oproti neutrálním slovům dům, stavba, obydlí.",
    hint: "Hledej slovo, které zní spíš pohrdlivě nebo znevažujícím způsobem.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá slovo, které vyšlo z běžného užívání a dnes působí zastarale, např. „vzduchoplavec“?",
    options: ["neologismus", "archaismus (zastaralé slovo)", "synonymum", "homonymum"],
    correctAnswerIndex: 1,
    explanation: "Archaismus je slovo, které vyšlo z běžného užívání a dnes působí zastarale.",
    hint: "Hledej pojem pro slovo, které se dřív běžně používalo, ale dnes už zní staromódně.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá nově vzniklé slovo, které pojmenovává novou skutečnost, např. „selfie“ nebo „lajkovat“?",
    options: ["archaismus", "neologismus (nové slovo)", "dialektismus", "synonymum"],
    correctAnswerIndex: 1,
    explanation: "Neologismus je nově vzniklé slovo, které pojmenovává novou skutečnost nebo jev.",
    hint: "Předpona neo- znamená „nový“ – jde o slovo, které v jazyce vzniklo teprve nedávno.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá slovo typické pro určitou oblast či kraj, které se neužívá v celé zemi, např. moravské „grunt“ (velký statek)?",
    options: ["dialektismus (nářeční slovo)", "archaismus", "neologismus", "citoslovce"],
    correctAnswerIndex: 0,
    explanation:
      "Dialektismus je slovo typické pro určitou oblast či nářečí, které se běžně neužívá v celém jazykovém území.",
    hint: "Hledej pojem pro slovo, které je typické jen pro určitý kraj nebo oblast, ne pro celou zemi.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá odborný výraz používaný v konkrétním oboru, např. „diagnóza“ v medicíně?",
    options: ["termín (odborný výraz)", "archaismus", "dialektismus", "citoslovce"],
    correctAnswerIndex: 0,
    explanation: "Termín je odborný výraz používaný v konkrétním vědním nebo pracovním oboru.",
    hint: "Hledej obecný pojem pro slovo, které patří do slovní zásoby konkrétního oboru.",
  },
  {
    category: "Slovní zásoba",
    text: "Jaký je rozdíl mezi slovy „civilní“ a „civilizovaný“?",
    options: [
      "jde o synonyma se stejným významem",
      "„civilní“ znamená netýkající se vojska či církve, „civilizovaný“ znamená kulturně vyspělý",
      "jde o antonyma",
      "jde o homonyma",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Slova „civilní“ (netýkající se vojska nebo církve) a „civilizovaný“ (kulturně a technicky vyspělý) znějí podobně, ale mají odlišný význam – jde o slova, která se snadno pletou.",
    hint: "Ačkoli slova znějí podobně, každé se vztahuje k jinému významu – jedno k armádě/církvi, druhé k vyspělosti společnosti.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „spadla mu čelist“?",
    options: [
      "byl velmi ospalý",
      "byl velmi překvapený nebo ohromený",
      "měl bolesti zubů",
      "usnul za jízdy",
    ],
    correctAnswerIndex: 1,
    explanation: "Rčení „spadla mu čelist“ znamená, že byl někdo velmi překvapený nebo ohromený.",
    hint: "Přemýšlej, co se fyzicky stane s ústy člověka, když je něčím opravdu šokovaný.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená úsloví „tahat za delší konec“?",
    options: [
      "prohrávat, být ve slabší pozici",
      "vyhrávat, být ve výhodnější pozici",
      "hrát na housle",
      "stěhovat nábytek",
    ],
    correctAnswerIndex: 1,
    explanation: "Úsloví „tahat za delší konec“ (provazu) znamená být ve výhodnější pozici, mít navrch.",
    hint: "Představ si přetahování lanem – kdo drží delší konec, má obvykle výhodu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „lakonický“ (o vyjadřování)?",
    options: ["upovídaný", "stručný, výstižný", "nudný", "hlasitý"],
    correctAnswerIndex: 1,
    explanation: "Slovo „lakonický“ znamená velmi stručný a výstižný způsob vyjadřování.",
    hint: "Hledej slovo popisující způsob mluvy nebo psaní, který je krátký a jde přímo k věci.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „velkorysý“?",
    options: ["štědrý", "shovívavý", "malicherný", "otevřený"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „velkorysý“ znamená shovívavý, štědrý, nedbající maličkostí – opakem je „malicherný“.",
    hint: "Hledej slovo popisující člověka, který se zbytečně hádá o nepodstatné drobnosti.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je mnohoznačné (má víc různých významů)?",
    options: ["klíč", "tramvaj", "učebnice", "deštník"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „klíč“ může znamenat předmět k odemykání, hudební znak (houslový klíč) i klín ptáků letících ve tvaru V – je tedy mnohoznačné.",
    hint: "Hledej slovo, které může označovat úplně různé věci podle kontextu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je expresivní (citově zabarvené) oproti neutrálnímu „obličej“?",
    options: ["tvář", "ksicht", "hlava", "tělo"],
    correctAnswerIndex: 1,
    explanation: "Slovo „ksicht“ je hovorové a citově (hanlivě) zabarvené oproti neutrálnímu slovu „obličej“.",
    hint: "Hledej slovo, které bys nepoužil ve formálním projevu, protože zní hrubě nebo pohrdlivě.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „nesporný“ (o faktu, tvrzení)?",
    options: ["pochybný", "nepopiratelný", "přehnaný", "vzácný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „nesporný“ znamená jistý, nepochybný, o kterém se nedá diskutovat – nejbližší synonymum je „nepopiratelný“.",
    hint: "Hledej slovo popisující fakt, o kterém se nedá vůbec pochybovat.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je přejaté z cizího jazyka?",
    options: ["stůl", "voda", "internet", "les"],
    correctAnswerIndex: 2,
    explanation: "Slovo „internet“ je přejaté z angličtiny, na rozdíl od domácích slov stůl, voda a les.",
    hint: "Hledej slovo, které do češtiny přišlo z jiného jazyka teprve nedávno, spolu s novou technologií.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „být v sedmém nebi“?",
    options: [
      "být velmi šťastný, spokojený",
      "být vysoko v horách",
      "mít strach z výšek",
      "cestovat letadlem",
    ],
    correctAnswerIndex: 0,
    explanation: "Rčení „být v sedmém nebi“ znamená být nesmírně šťastný a spokojený.",
    hint: "Přemýšlej o pocitu naprostého štěstí, jako by byl člověk až v nebi.",
  },

  // ---- Slovní zásoba (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „bezradný“?",
    options: ["jistý", "zmatený", "odvážný", "klidný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „bezradný“ znamená nevědoucí si rady, zmatený – nejbližší synonymum je „zmatený“.",
    hint: "Hledej slovo popisující někoho, kdo neví, co má dělat, a je z toho nejistý.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „štíhlý“?",
    options: ["hubený", "vyzáblý", "tlustý", "malý"],
    correctAnswerIndex: 2,
    explanation: "Slovo „štíhlý“ znamená subtilní, ne příliš tělnatý – opakem je „tlustý“.",
    hint: "Hledej slovo s opačným významem – ten, kdo má nadváhu.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym?",
    options: [
      "stan (přístřešek) – stan (rozkaz slovesa stanout)",
      "les – lesík",
      "voda – vodní",
      "kámen – kamínek",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „stan“ může znamenat jak přístřešek na táboření, tak rozkazovací tvar slovesa „stanout“ – jde o dvě různá slova, která zní i píší se stejně.",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „liška“ ve větě: „Byla to prohnaná liška, vždycky si poradila.“?",
    options: ["šelma z čeledi psovitých", "mazaný, vychytralý člověk", "kožešina", "liščí nora"],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „liška“ označuje mazaného, vychytralého člověka, ne skutečné zvíře.",
    hint: "Přemýšlej v obrazném významu – jaká vlastnost se lišce tradičně přisuzuje v pohádkách a lidové řeči?",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „vzít nohy na ramena“?",
    options: ["jít pomalu", "rychle utéct", "tancovat", "cvičit"],
    correctAnswerIndex: 1,
    explanation: "Rčení „vzít nohy na ramena“ znamená rychle utéct, dát se na útěk.",
    hint: "Přemýšlej, jak rychle by se člověk musel pohybovat, kdyby si doslova dal nohy na ramena.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „spadla mu čelist“?",
    options: ["byl velmi ospalý", "byl velmi překvapený", "měl bolesti zubů", "byl unavený"],
    correctAnswerIndex: 1,
    explanation:
      "Rčení „spadla mu čelist“ znamená, že byl někdo velmi překvapený nebo ohromený.",
    hint: "Přemýšlej, jak vypadá výraz tváře člověka, který je něčím naprosto ohromen.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývají slova napodobující zvuky, např. „bum“, „mňau“, „šeptat“?",
    options: ["synonyma", "onomatopoia (zvukomalebná slova)", "homonyma", "antonyma"],
    correctAnswerIndex: 1,
    explanation:
      "Onomatopoia jsou slova, jejichž zvuková podoba napodobuje skutečný zvuk, který popisují (bum, mňau, prásk).",
    hint: "Hledej odborný název pro slova, která svým zněním připomínají zvuk, jenž označují.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá zjemňující výraz používaný místo slova, které by mohlo být nepříjemné nebo nevhodné, např. „odešel na věčnost“ místo „zemřel“?",
    options: ["eufemismus (zjemňující výraz)", "hyperbola", "ironie", "metafora"],
    correctAnswerIndex: 0,
    explanation:
      "Eufemismus je zjemňující, opisné pojmenování používané místo přímého, nepříjemného výrazu.",
    hint: "Hledej pojem pro slovo, které zjemňuje nebo zmírňuje nepříjemné sdělení.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá zastaralé slovo, které se v dnešní běžné češtině už nepoužívá, např. „vojna“ místo „válka“?",
    options: ["archaismus (zastaralé slovo)", "neologismus", "dialektismus", "profesionalismus"],
    correctAnswerIndex: 0,
    explanation:
      "Archaismus je zastaralé slovo nebo tvar, který se v současné češtině běžně nepoužívá.",
    hint: "Předpona archai- souvisí s řeckým slovem pro „starý“ – hledej pojem pro zastaralá slova.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá nově vzniklé slovo, které pojmenovává novou skutečnost, např. „selfie“ nebo „influencer“?",
    options: ["archaismus", "neologismus (nové slovo)", "synonymum", "homonymum"],
    correctAnswerIndex: 1,
    explanation: "Neologismus je nově utvořené nebo přejaté slovo pojmenovávající novou skutečnost.",
    hint: "Předpona neo- znamená „nový“ – hledej pojem pro nedávno vzniklá slova.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá slovo typické pro určitou nářeční oblast, které se liší od spisovné podoby?",
    options: ["dialektismus (nářeční slovo)", "archaismus", "neologismus", "internacionalismus"],
    correctAnswerIndex: 0,
    explanation:
      "Dialektismus je slovo nebo výraz typický pro určité nářečí (dialekt), lišící se od spisovné češtiny.",
    hint: "Hledej pojem pro slova typická pro určitý region nebo nářečí, ne pro celou spisovnou češtinu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je slovo přejaté (cizího původu)?",
    options: ["stůl", "počítač", "internet", "kniha"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „internet“ je přejaté z angličtiny. Slova „stůl“, „počítač“ a „kniha“ jsou domácího nebo dávno zdomácnělého původu.",
    hint: "Hledej slovo, které do češtiny přišlo z cizího jazyka relativně nedávno a jeho původ je zjevný.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov jsou paronyma (slova podobně znějící, ale s odlišným významem, u kterých hrozí záměna)?",
    options: ["technicky – takticky", "kolej – kolej", "pero – pero", "dům – domek"],
    correctAnswerIndex: 0,
    explanation:
      "Slova „technicky“ a „takticky“ znějí podobně, ale mají zcela odlišný význam – jde o paronyma, u kterých hrozí záměna.",
    hint: "Hledej dvojici slov, která si student snadno splete kvůli podobnému znění, přestože mají jiný význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov jsou paronyma?",
    options: ["vzhled – výhled", "dům – domek", "auto – vůz", "kniha – knížka"],
    correctAnswerIndex: 0,
    explanation:
      "Slova „vzhled“ (jak něco vypadá) a „výhled“ (co je vidět z určitého místa) znějí podobně, ale mají odlišný význam – jde o paronyma.",
    hint: "Hledej dvojici slov lišících se jen předponou, u kterých snadno dojde k záměně významu.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá odborný výraz používaný v konkrétním oboru, např. „podmět“ a „přísudek“ v jazykovědě?",
    options: ["termín (odborný výraz)", "synonymum", "homonymum", "archaismus"],
    correctAnswerIndex: 0,
    explanation: "Termín je odborný výraz s přesně vymezeným významem, používaný v určitém oboru.",
    hint: "Hledej pojem pro slovo, které má přesný, jednoznačný význam jen v rámci určitého odborného oboru.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá vrstva slovní zásoby typická pro určitou zájmovou nebo profesní skupinu?",
    options: ["slang", "archaismus", "neologismus vždy", "termín vždy"],
    correctAnswerIndex: 0,
    explanation:
      "Slang je vrstva slovní zásoby typická pro určitou zájmovou, profesní nebo věkovou skupinu.",
    hint: "Hledej pojem pro speciální „hantýrku“ používanou uvnitř určité skupiny lidí, např. mezi hráči her nebo hudebníky.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „lakonický“ (ve významu strohý, stručný)?",
    options: ["upovídaný", "stručný", "zdvořilý", "hlučný"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „lakonický“ znamená velmi stručný, úsečný ve vyjadřování – nejbližší synonymum je „stručný“.",
    hint: "Hledej slovo popisující někoho, kdo mluví nebo píše co nejméně slovy.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „velkorysý“?",
    options: ["štědrý", "shovívavý", "malicherný", "laskavý"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „velkorysý“ znamená shovívavý, štědrý, nezabývající se maličkostmi – opakem je „malicherný“.",
    hint: "Hledej slovo popisující někoho, kdo se zbytečně zabývá nepodstatnými detaily a je úzkoprsý.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „led“ ve větě: „Mezi sourozenci panoval led.“?",
    options: ["zmrzlá voda", "chladné, odtažité vztahy", "zmrzlina", "kluziště"],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „led“ označuje chladné, odtažité vztahy mezi lidmi, ne skutečnou zmrzlou vodu.",
    hint: "Přemýšlej v obrazném významu – co znamená, když jsou vztahy mezi lidmi „ledové“?",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „tahat za kratší konec“?",
    options: ["vyhrávat", "být ve výhodě", "být v nevýhodě, prohrávat", "odpočívat"],
    correctAnswerIndex: 2,
    explanation:
      "Rčení „tahat za kratší konec“ znamená být v nevýhodné pozici, prohrávat v nějakém sporu nebo soutěži.",
    hint: "Přemýšlej o přetahování lana – co by znamenalo mít v ruce ten kratší, nevýhodnější konec?",
  },

  // ---- Slovní zásoba (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Slovní zásoba",
    text: "Jaký prostředek je použit ve větě: „Celá třída zatleskala.“ (myšleni žáci ve třídě)?",
    options: ["metafora", "metonymie", "homonymum", "antonymum"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „třída“ zde zastupuje žáky, kteří v ní jsou – jde o přenesení významu na základě věcné souvislosti (místo za lidi v něm), tedy metonymii.",
    hint: "Přemýšlej, jestli je tu podobnost mezi dvěma věcmi (metafora), nebo věcná souvislost jako místo a to, co je v něm (metonymie).",
  },
  {
    category: "Slovní zásoba",
    text: "Jaký prostředek je použit ve větě: „Má zlaté ruce.“ (o šikovném člověku)?",
    options: ["metafora", "metonymie", "homonymum", "synonymum"],
    correctAnswerIndex: 0,
    explanation:
      "Spojení „zlaté ruce“ přenáší význam na základě podobnosti (hodnota zlata ~ šikovnost) bez použití spojky jako – jde o metaforu.",
    hint: "Přemýšlej, jestli tu jde o podobnost dvou věcí (metafora), nebo věcnou souvislost (metonymie).",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je hyperonymem (nadřazeným pojmem) ke slovům růže, tulipán, kopretina?",
    options: ["květina", "zahrada", "váza", "jaro"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „květina“ je obecnější, nadřazený pojem, pod který spadají všechny tři konkrétní druhy – jde o hyperonymum.",
    hint: "Hledej obecné slovo, které zastřešuje všechny tři konkrétní příklady.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je hyponymem (podřazeným pojmem) ke slovu „nábytek“?",
    options: ["skříň", "dům", "kuchyně", "byt"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „skříň“ je konkrétní druh nábytku – jde o hyponymum ke slovu „nábytek“.",
    hint: "Hledej slovo označující konkrétní kus, který spadá pod obecnější pojem „nábytek“.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je jednoznačné (má jen jeden ustálený význam)?",
    options: ["kohoutek", "trojúhelník", "hlava", "zámek"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „trojúhelník“ jako geometrický pojem má jediný ustálený význam – je jednoznačné. Ostatní uvedená slova jsou mnohoznačná.",
    hint: "Hledej odborný termín, který se v běžné řeči nepoužívá v žádném jiném, přeneseném významu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je synonymem ke slovu „usilovat“?",
    options: ["vzdát se", "snažit se", "odpočívat", "zapomenout"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „usilovat“ znamená snažit se, vynakládat úsilí – nejbližší synonymum je „snažit se“.",
    hint: "Hledej slovo popisující, že se člověk o něco aktivně a vytrvale snaží.",
  },
  {
    category: "Slovní zásoba",
    text: "Které slovo je antonymem ke slovu „shovívavý“?",
    options: ["laskavý", "trpělivý", "přísný", "chápavý"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „shovívavý“ znamená mírný, tolerantní k chybám – opakem je „přísný“.",
    hint: "Hledej slovo popisující někoho, kdo netoleruje chyby a je na ostatní náročný.",
  },
  {
    category: "Slovní zásoba",
    text: "Která dvojice slov je dvojicí homonym?",
    options: ["zámek (stavba) – zámek (u dveří)", "dům – domov", "kniha – knížka", "auto – vůz"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „zámek“ může znamenat jak honosnou stavbu, tak uzamykací mechanismus u dveří – jde o dvě různé věci, které zní i píší se stejně.",
    hint: "Homonyma znějí stejně, ale mají zcela odlišný, nesouvisející význam.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „hodit něco za hlavu“?",
    options: [
      "zapomenout na něco, přestat se tím zabývat",
      "vyhodit odpadky",
      "otočit se",
      "podívat se dozadu",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Rčení „hodit něco za hlavu“ znamená přestat se něčím trápit, zapomenout na to a nevracet se k tomu.",
    hint: "Přemýšlej, co by znamenalo symbolicky odhodit starost pryč, za sebe, aby ji člověk už neviděl.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená rčení „mít v malíčku“?",
    options: ["dokonale něco ovládat, umět", "zapomenout něco", "být nervózní", "být unavený"],
    correctAnswerIndex: 0,
    explanation:
      "Rčení „mít něco v malíčku“ znamená danou věc dokonale ovládat, umět ji zpaměti.",
    hint: "Přemýšlej o tom, jak dobře člověk zná něco, co má „doslova po ruce“, na dosah malíčku.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je citově zabarvené (expresivní)?",
    options: ["auto", "fáro", "vozidlo", "dopravní prostředek"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „fáro“ je hovorové, citově zabarvené (expresivní) pojmenování pro auto, na rozdíl od neutrálních výrazů auto, vozidlo, dopravní prostředek.",
    hint: "Hledej slovo, které bys použil(a) spíš v neformální řeči s kamarády, ne v úředním textu.",
  },
  {
    category: "Slovní zásoba",
    text: "Jaký je vztah mezi slovy „kniha“ a „knížka“?",
    options: ["synonyma", "antonyma", "zdrobnělina (deminutivum)", "homonyma"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „knížka“ je zdrobnělinou slova „kniha“, vyjadřuje menší nebo familiárnější podobu téže věci.",
    hint: "Přípona -ka často vytváří zdrobněliny, tedy menší nebo familiárnější podobu slova.",
  },
  {
    category: "Slovní zásoba",
    text: "Co znamená slovo „prioritní“?",
    options: ["nedůležitý", "přednostní, mající prvořadý význam", "levný", "dočasný"],
    correctAnswerIndex: 1,
    explanation: "Slovo „prioritní“ znamená přednostní, mající prvořadý, nejvyšší význam.",
    hint: "Slovo souvisí se slovem „priorita“ (přednost, to nejdůležitější).",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je odborný termín z oblasti jazykovědy?",
    options: ["morfém", "balkón", "dálnice", "recept"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „morfém“ (nejmenší jednotka slova nesoucí význam) je odborný termín z oblasti jazykovědy.",
    hint: "Hledej slovo, které bys potkal(a) jen v hodině češtiny nebo v lingvistické učebnici, ne v běžné řeči.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je slangový výraz typický pro školní prostředí?",
    options: ["ředitelna", "písemka", "katedra", "třídnice"],
    correctAnswerIndex: 1,
    explanation:
      "Slovo „písemka“ je slangový, hovorový výraz žáků pro „písemnou práci“ (test) – ostatní slova jsou neutrální označení.",
    hint: "Hledej slovo, které používají hlavně žáci mezi sebou, ne oficiální školní dokumenty.",
  },
  {
    category: "Slovní zásoba",
    text: "Jak se nazývá slovo typické pro určité nářečí, např. moravské „grunt“ (velký selský statek) místo spisovného „statek“?",
    options: ["archaismus", "dialektismus (nářeční slovo)", "neologismus", "termín"],
    correctAnswerIndex: 1,
    explanation:
      "Dialektismus je slovo typické pro určité nářečí (dialekt), lišící se od spisovné podoby – příkladem je moravské „grunt“ místo spisovného „statek“.",
    hint: "Hledej pojem pro slovo vázané na určitý region, ne na celou spisovnou češtinu.",
  },
  {
    category: "Slovní zásoba",
    text: "Které z uvedených slov je neologismus (nedávno vzniklé slovo)?",
    options: ["hejtovat", "kupec", "řemeslo", "obydlí"],
    correctAnswerIndex: 0,
    explanation:
      "Slovo „hejtovat“ (z anglického hate – nenávidět, útočit slovně) je neologismus, nedávno vzniklé slovo přejaté z internetového prostředí.",
    hint: "Hledej slovo, které vzniklo teprve nedávno, typicky v souvislosti s internetem nebo sociálními sítěmi.",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „motor“ ve větě: „Byl motorem celého projektu.“?",
    options: ["součást auta", "hnací síla, iniciátor něčeho", "zvuk", "palivo"],
    correctAnswerIndex: 1,
    explanation:
      "V přeneseném významu „motor“ označuje hnací sílu, osobu, která něco žene dopředu a iniciuje – ne skutečnou součást stroje.",
    hint: "Přemýšlej v obrazném významu – co znamená být „motorem“ nějakého projektu?",
  },
  {
    category: "Slovní zásoba",
    text: "Ve které možnosti jsou slova ve dvojici synonyma?",
    options: ["štědrý – lakomý", "rychlý – pomalý", "smutný – zasmušilý", "hlučný – tichý"],
    correctAnswerIndex: 2,
    explanation:
      "Slova „smutný“ a „zasmušilý“ mají podobný význam – jsou synonyma. Ostatní dvojice jsou naopak antonyma.",
    hint: "Tři dvojice jsou opaky (antonyma), jen jedna dvojice má podobný význam (synonyma).",
  },
  {
    category: "Slovní zásoba",
    text: "Ve kterém významu je použito slovo „jazyk“ ve větě: „Studuje anglický jazyk.“?",
    options: ["orgán v ústech", "dorozumívací systém, řeč", "jazýček u boty", "plamen"],
    correctAnswerIndex: 1,
    explanation:
      "V tomto kontextu slovo „jazyk“ neoznačuje orgán v ústech, ale dorozumívací systém, řeč – jde o jeden z dalších významů mnohoznačného slova „jazyk“.",
    hint: "Přemýšlej, co znamená studovat „anglický jazyk“ ve škole – jde o studium řeči, ne tělesného orgánu.",
  },

  // ---- Literární teorie (nové) ----
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek, kdy je neživá věc nebo jev obdařen lidskými vlastnostmi (např. „vítr si pohrával s listím“)?",
    options: ["metafora", "personifikace", "přirovnání", "hyperbola"],
    correctAnswerIndex: 1,
    explanation:
      "Personifikace je básnický prostředek, který přisuzuje neživým věcem nebo přírodním jevům lidské vlastnosti či chování.",
    hint: "Přemýšlej, co dělá „vítr“ v uvedeném příkladu – chová se jako člověk (pohrává si).",
  },
  {
    category: "Literární teorie",
    text: "Které literární druhy patří mezi tři základní literární druhy?",
    options: [
      "epika, lyrika, próza",
      "epika, lyrika, drama",
      "próza, poezie, drama",
      "pohádka, bajka, epika",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Tři základní literární druhy jsou epika (vyprávění příběhu), lyrika (vyjádření pocitů a nálad) a drama (text určený k jevištnímu provedení).",
    hint: "Zamysli se nad klasickým dělením literatury do tří velkých skupin podle způsobu podání.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá krátký, výstižný a obrazný výrok lidové moudrosti, např. typu „Bez práce nejsou koláče“?",
    options: ["pořekadlo", "přísloví", "pranostika", "hádanka"],
    correctAnswerIndex: 1,
    explanation:
      "Přísloví je krátký ustálený výrok obsahující obecně platnou životní zkušenost nebo mravní ponaučení.",
    hint: "Tento typ výroku většinou obsahuje nějaké poučení nebo moudrost, ne jen ustálené slovní spojení.",
  },
  {
    category: "Literární teorie",
    text: "Určete básnický prostředek použitý ve větě: „Byl silný jako medvěd.“",
    options: ["metafora", "personifikace", "přirovnání", "aliterace"],
    correctAnswerIndex: 2,
    explanation:
      "Jde o přirovnání – dvě věci (síla člověka a medvěda) jsou explicitně přirovnány pomocí spojky „jako“. U metafory by srovnání bylo skryté, bez spojky „jako“.",
    hint: "Všimni si slova „jako“ – jaký básnický prostředek obvykle signalizuje přímé srovnání dvou věcí pomocí spojky?",
  },
  {
    category: "Literární teorie",
    text: "Ve strofě se verše rýmují podle schématu AABB (první verš s druhým, třetí se čtvrtým). Jak se tento typ rýmu nazývá?",
    options: ["sdružený rým", "střídavý rým", "obkročný rým", "přerývaný rým"],
    correctAnswerIndex: 0,
    explanation:
      "Rým, kdy se rýmují sousední verše (1. s 2. a 3. se 4., schéma AABB), se nazývá sdružený.",
    hint: "Podívej se, které verše se rýmují spolu – jsou to sousední dvojice, nebo verše, které jsou od sebe dál?",
  },
  {
    category: "Literární teorie",
    text: "Ve které možnosti je uvedena dvojice literární druh – jeho typický znak?",
    options: [
      "lyrika – dějovost, časová posloupnost",
      "epika – vypravěč, děj",
      "drama – rým, sloka",
      "epika – citové vyjádření, absence děje",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Epika je literární druh založený na vyprávění příběhu, obsahuje vypravěče a děj. Lyrika naopak nemá typicky dějovost, ale vyjadřuje pocity; drama je určeno k jevištnímu provedení a nemusí mít rým ani sloky.",
    hint: "Přemýšlej, který literární druh se soustředí na vyprávění příběhu s vypravěčem.",
  },

  // ---- Literární teorie (nové, druhá dávka – úryvky z Erbenovy Kytice, volné dílo) ----
  {
    category: "Literární teorie",
    workingText:
      "Na topole nad jezerem\nseděl Vodník pod večerem:\n„Sviť, měsíčku, sviť,\nať mi šije niť.\nŠiju, šiju si botičky\ndo sucha i do vodičky:\nsviť, měsíčku, sviť,\nať mi šije niť.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Který verš se v této ukázce opakuje jako refrén?",
    options: [
      "Na topole nad jezerem",
      "Sviť, měsíčku, sviť, ať mi šije niť.",
      "Šiju, šiju si botičky",
      "Seděl Vodník pod večerem",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Verše „Sviť, měsíčku, sviť, / ať mi šije niť.“ se v básni opakují na konci každé sloky – jde tedy o refrén.",
    hint: "Refrén je verš nebo skupina veršů, které se v básni pravidelně opakují, obvykle na konci každé sloky.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Na topole nad jezerem\nseděl Vodník pod večerem:\n„Sviť, měsíčku, sviť,\nať mi šije niť.\nŠiju, šiju si botičky\ndo sucha i do vodičky:\nsviť, měsíčku, sviť,\nať mi šije niť.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Kdo je mluvčím přímé řeči v uvozovkách v této ukázce?",
    options: ["vypravěč", "vodníkova žena", "vodník", "panna"],
    correctAnswerIndex: 2,
    explanation:
      "V uvedené ukázce mluví přímou řečí vodník, který si šije oblečení na svatbu a oslovuje měsíček.",
    hint: "Podívej se, kdo sedí na topole a co dělá bezprostředně před přímou řečí v uvozovkách.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Na topole nad jezerem\nseděl Vodník pod večerem:\n„Sviť, měsíčku, sviť,\nať mi šije niť.\nŠiju, šiju si botičky\ndo sucha i do vodičky:\nsviť, měsíčku, sviť,\nať mi šije niť.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Jaký typ rýmu je použit v této ukázce (jezerem – večerem, sviť – niť)?",
    options: ["střídavý rým", "sdružený rým", "obkročný rým", "přerývaný rým"],
    correctAnswerIndex: 1,
    explanation:
      "Rýmují se vždy sousední verše (1. s 2., 3. se 4.) – jde tedy o rým sdružený, schéma AABB.",
    hint: "Podívej se, které verše se spolu rýmují – jsou to sousední dvojice veršů.",
  },
  {
    category: "Literární teorie",
    workingText:
      "„Ach nechoď, nechoď na jezero,\nzůstaň dnes doma, moje dcero!\nJá měla zlý té noci sen:\nnechoď, dceruško, k vodě ven.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Jaký básnický prostředek je zde použit opakováním slova „nechoď“ na začátku veršů?",
    options: ["metafora", "anafora (opakování na začátku veršů)", "personifikace", "hyperbola"],
    correctAnswerIndex: 1,
    explanation:
      "Opakování stejného slova („nechoď“) na začátku po sobě jdoucích veršů je básnický prostředek zvaný anafora, který zesiluje naléhavost matčina varování.",
    hint: "Všimni si, které slovo se v ukázce několikrát opakuje na začátku verše.",
  },
  {
    category: "Literární teorie",
    workingText:
      "„Ach nechoď, nechoď na jezero,\nzůstaň dnes doma, moje dcero!\nJá měla zlý té noci sen:\nnechoď, dceruško, k vodě ven.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Kdo v této ukázce mluví a koho varuje?",
    options: [
      "vodník varuje pannu",
      "matka varuje dceru",
      "panna varuje matku",
      "vypravěč varuje čtenáře",
    ],
    correctAnswerIndex: 1,
    explanation:
      "V této části básně matka varuje svou dceru, aby nechodila k jezeru, protože měla zlý sen.",
    hint: "Všimni si oslovení „dcero“ a „dceruško“ – kdo takto oslovuje mladou dívku?",
  },
  {
    category: "Literární teorie",
    workingText:
      "Zemřela matka a do hrobu dána,\nsiroty po ní zůstaly;\ni přicházely každičkého rána\na matičku svou hledaly.\n(K. J. Erben: Kytice, úvodní báseň Kytice)",
    text: "Jaký typ rýmu je použit v této sloce (dána – rána, zůstaly – hledaly)?",
    options: ["sdružený rým", "střídavý rým", "obkročný rým", "žádný, jde o verš bez rýmu"],
    correctAnswerIndex: 1,
    explanation:
      "Rýmuje se 1. verš se 3. a 2. verš se 4. (dána–rána, zůstaly–hledaly) – jde tedy o rým střídavý, schéma ABAB.",
    hint: "Podívej se, které verše se rýmují – nejsou to sousední dvojice, ale verše, které jsou od sebe o jeden dál.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Zemřela matka a do hrobu dána,\nsiroty po ní zůstaly;\ni přicházely každičkého rána\na matičku svou hledaly.",
    text: "Z jaké sbírky pochází uvedená ukázka a kdo je jejím autorem?",
    options: [
      "Babička – Božena Němcová",
      "Kytice – Karel Jaromír Erben",
      "Máj – Karel Hynek Mácha",
      "Bajky – Ezop",
    ],
    correctAnswerIndex: 1,
    explanation: "Ukázka je úvodní básní stejnojmenné sbírky Kytice Karla Jaromíra Erbena.",
    hint: "Přemýšlej, jaký básník je známý svými baladami o nadpřirozených bytostech a lidových pověstech — psal i další ukázky, se kterými ses v této kategorii setkal(a).",
  },
  {
    category: "Literární teorie",
    workingText:
      "Zemřela matka a do hrobu dána,\nsiroty po ní zůstaly;\ni přicházely každičkého rána\na matičku svou hledaly.\n\nI zželelo se matce milých dítek;\nduše její se vrátila\na vtělila se v drobnolistý kvítek,\njímž mohylu svou pokryla.\n(K. J. Erben: Kytice, úvodní báseň Kytice)",
    text: "Jaký je hlavní motiv této básně?",
    options: [
      "proměna zemřelé matky v květinu, která zůstává s dětmi",
      "boj hrdiny s drakem",
      "cesta rytíře za princeznou",
      "spor dvou sourozenců o dědictví",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Báseň vypráví o tom, jak se duše zemřelé matky vtělila do kvítku, aby mohla zůstat blízko svých osiřelých dětí.",
    hint: "Sleduj, co se stane s duší matky poté, co zemře – kam se „přestěhuje“.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá lyrickoepická básnická skladba, která vypráví příběh (často s tragickým koncem) a zároveň silně působí na city čtenáře – právě takovým útvarem jsou i básně z Erbenovy Kytice?",
    options: ["óda", "balada", "komedie", "fejeton"],
    correctAnswerIndex: 1,
    explanation:
      "Balada je lyrickoepická básnická skladba – vypráví příběh (epika), obvykle s tragickým koncem, a zároveň silně působí na city čtenáře (lyrika).",
    hint: "Erbenovy básně mají příběh i silnou citovou stránku zároveň – hledej pojem pro tento smíšený literární útvar.",
  },
  {
    category: "Literární teorie",
    text: "Které z následujících tvrzení o baladě je pravdivé?",
    options: [
      "Balada má vždy šťastný konec.",
      "Balada často obsahuje nadpřirozené prvky a končívá tragicky.",
      "Balada je vždy psána prózou, nikdy ve verších.",
      "Balada nesmí obsahovat přímou řeč postav.",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Balada je typická právě častým výskytem nadpřirozených motivů (víly, vodníci, přízraky) a tragickým, neradostným závěrem – jak je vidět i v Erbenově Kytici.",
    hint: "Vzpomeň si na osudy postav v Erbenových baladách (Vodník, Polednice…) – jak většinou končí?",
  },

  // ---- Literární teorie (nové, třetí dávka – doplnění do 20) ----
  {
    category: "Literární teorie",
    workingText:
      "Na topole nad jezerem\nseděl Vodník pod večerem:\n„Sviť, měsíčku, sviť,\nať mi šije niť.\nŠiju, šiju si botičky\ndo sucha i do vodičky:\nsviť, měsíčku, sviť,\nať mi šije niť.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Jaký účinek má bezprostřední opakování slova ve spojení „Šiju, šiju si botičky“?",
    options: [
      "vytváří přirovnání",
      "zdůrazňuje pilnou, vytrvalou práci vodníka",
      "jde o personifikaci",
      "jde o řečnickou otázku",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Bezprostřední opakování slova „šiju, šiju“ zdůrazňuje pilnou, vytrvalou práci vodníka na svatebním oblečení.",
    hint: "Všimni si, že se sloveso „šiju“ v ukázce opakuje hned dvakrát za sebou – jaký to má na čtenáře účinek?",
  },
  {
    category: "Literární teorie",
    workingText:
      "Na topole nad jezerem\nseděl Vodník pod večerem:\n„Sviť, měsíčku, sviť,\nať mi šije niť.\nŠiju, šiju si botičky\ndo sucha i do vodičky:\nsviť, měsíčku, sviť,\nať mi šije niť.“\n(K. J. Erben: Kytice, báseň Vodník)",
    text: "Kde podle úvodních veršů vodník sedí?",
    options: [
      "na skále u moře",
      "na topole nad jezerem",
      "v jeskyni pod horou",
      "na lodi uprostřed řeky",
    ],
    correctAnswerIndex: 1,
    explanation: "Úvodní verše přímo uvádějí, že vodník seděl „na topole nad jezerem“.",
    hint: "Odpověď najdeš přímo v prvním verši ukázky.",
  },
  {
    category: "Literární teorie",
    text: "Které z následujících je typickým znakem lidové balady, k jakým patří i básně z Erbenovy Kytice?",
    options: [
      "veselý, komický tón a happy end",
      "čerpání z lidových pověstí a pověr, časté nadpřirozené motivy",
      "úplná absence jakéhokoli děje",
      "psaní výhradně v próze",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Lidová balada čerpá z lidových pověstí a pověr a často obsahuje nadpřirozené motivy (vodníci, přízraky, kletby) – to je typické i pro Erbenovu Kytici.",
    hint: "Vzpomeň si, jaké bytosti a motivy se v Erbenových baladách často objevují.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnická sbírka, ve které vyšel Erbenův Vodník, a kolik básní celkem obsahuje?",
    options: ["Kytice, 13 básní", "Máj, 1 báseň", "Bajky, 50 básní", "Babička, 22 kapitol"],
    correctAnswerIndex: 0,
    explanation: "Vodník je jednou z třinácti balad sbírky Kytice Karla Jaromíra Erbena.",
    hint: "Vzpomeň si na název sbírky, kterou jsme zmiňovali už v předchozích otázkách, a na počet básní, které obsahuje.",
  },

  // ---- Literární teorie (nové, třetí dávka – obecná teorie, doplnění do 40) ----
  {
    category: "Literární teorie",
    text: "Jak se nazývá rým, kdy se rýmuje první verš se čtvrtým a druhý se třetím (schéma ABBA)?",
    options: ["sdružený rým", "střídavý rým", "obkročný rým", "přerývaný rým"],
    correctAnswerIndex: 2,
    explanation:
      "Rým, kdy se první verš rýmuje se čtvrtým a druhý se třetím (schéma ABBA), se nazývá obkročný.",
    hint: "Představ si, že první a poslední verš „obkročují“ prostřední dva verše, které se rýmují mezi sebou.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek, kdy autor spojí dvě slova s protikladným významem, např. „mrtvé duše“ nebo „hlasité ticho“?",
    options: ["metafora", "oxymoron", "personifikace", "hyperbola"],
    correctAnswerIndex: 1,
    explanation:
      "Oxymoron je básnický prostředek spojující dva výrazy s protikladným, na první pohled neslučitelným významem.",
    hint: "Jde o zdánlivě protimluvné spojení dvou slov opačného významu vedle sebe.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek záměrného přehánění, např. „čekal jsem věčnost“?",
    options: ["hyperbola", "personifikace", "metafora", "ironie"],
    correctAnswerIndex: 0,
    explanation: "Hyperbola je básnický prostředek záměrného přehánění za účelem zdůraznění.",
    hint: "Přemýšlej, jestli člověk může doopravdy čekat „věčnost“ – jde o záměrné přehnání.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek, kdy mluvčí říká pravý opak toho, co doopravdy míní, často s posměšným podtextem?",
    options: ["metafora", "ironie", "přirovnání", "epiteton"],
    correctAnswerIndex: 1,
    explanation:
      "Ironie je vyjádření, při kterém mluvčí říká opak toho, co skutečně míní, obvykle s posměšným nebo kritickým podtextem.",
    hint: "Přemýšlej o situaci, kdy někdo řekne „to je skvělé!“ v situaci, která skvělá vůbec není.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá ozdobné, výstižné přídavné jméno (přívlastek) u podstatného jména, např. „zlaté slunce“, „temný les“?",
    options: ["epiteton (básnický přívlastek)", "metafora", "metonymie", "přirovnání"],
    correctAnswerIndex: 0,
    explanation: "Epiteton je básnický, ozdobný přívlastek zdůrazňující vlastnost popisované věci.",
    hint: "Jde o přídavné jméno, které dodává popisu obraznost a náladu, ne jen věcnou informaci.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá pojmenování jedné věci názvem věci jiné na základě věcné souvislosti, např. „vypít celou sklenici“ (myšlen obsah, ne sklo)?",
    options: ["metafora", "metonymie", "personifikace", "hyperbola"],
    correctAnswerIndex: 1,
    explanation:
      "Metonymie je záměna pojmenování na základě věcné souvislosti (např. nádoba za obsah, autor za dílo).",
    hint: "Na rozdíl od metafory (podobnost) jde tu o věcnou souvislost – sklenice a to, co je v ní.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá stupňování výrazových prostředků ve větě nebo textu, kdy každý další výraz je silnější než ten předchozí?",
    options: ["gradace", "antiteze", "personifikace", "řečnická otázka"],
    correctAnswerIndex: 0,
    explanation:
      "Gradace je básnický prostředek postupného stupňování výrazu od slabšího k silnějšímu (např. „šel, běžel, letěl“).",
    hint: "Přemýšlej o řadě slov, která postupně sílí ve významu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá otázka, na kterou se neočekává odpověď, protože slouží jen k zdůraznění myšlenky?",
    options: ["řečnická otázka", "přímá otázka", "zjišťovací otázka", "doplňovací otázka"],
    correctAnswerIndex: 0,
    explanation:
      "Řečnická otázka je otázka položená s cílem zdůraznit myšlenku, ne získat skutečnou odpověď.",
    hint: "Přemýšlej o otázce typu „Copak to není nádherné?“ – mluvčí odpověď nečeká.",
  },
  {
    category: "Literární teorie",
    text: "Kolik veršů má klasický sonet?",
    options: ["8", "12", "14", "16"],
    correctAnswerIndex: 2,
    explanation: "Klasický sonet má 14 veršů, obvykle rozdělených do dvou čtyřverší a dvou trojverší.",
    hint: "Sonet je pevná básnická forma s přesně daným, poměrně velkým počtem veršů.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá nejmenší část básně tvořená skupinou veršů oddělenou od ostatních mezerou?",
    options: ["verš", "sloka (strofa)", "rým", "přízvuk"],
    correctAnswerIndex: 1,
    explanation:
      "Sloka (strofa) je skupina veršů tvořící ucelenou část básně, oddělená od dalších slok mezerou.",
    hint: "Hledej pojem pro „odstavec“ v básni – skupinu veršů patřících k sobě.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá jeden řádek básně?",
    options: ["sloka", "verš", "rým", "přednes"],
    correctAnswerIndex: 1,
    explanation: "Verš je jeden řádek básně.",
    hint: "Jde o nejmenší jednotku básně – jeden „řádek“.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá starobylý veršovaný epický žánr vyprávějící o hrdinských činech, např. o trojské válce?",
    options: ["epos", "óda", "elegie", "bajka"],
    correctAnswerIndex: 0,
    explanation:
      "Epos je rozsáhlá veršovaná epická skladba vyprávějící o hrdinských činech a významných událostech.",
    hint: "Vzpomeň si na starověká díla jako Ilias nebo Odyssea – jaký žánr představují?",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá krátký epický žánr s alegorickým příběhem (často se zvířaty v hlavních rolích) a mravním ponaučením na konci?",
    options: ["bajka", "pověst", "óda", "elegie"],
    correctAnswerIndex: 0,
    explanation:
      "Bajka je krátký epický žánr, často s vystupujícími zvířaty jednajícími jako lidé, s mravním ponaučením na konci.",
    hint: "Vzpomeň si na příběhy jako O lišce a vráně – jaký žánr to je a co mají společné?",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá lidové vyprávění, které kombinuje historickou událost či místo se smyšleným nebo nadpřirozeným prvkem?",
    options: ["pověst", "román", "óda", "novela"],
    correctAnswerIndex: 0,
    explanation:
      "Pověst je lidové vyprávění vážící se k určitému místu nebo historické události, doplněné smyšleným nebo nadpřirozeným prvkem.",
    hint: "Tento žánr často vysvětluje původ nějakého místa, jména nebo zvyku pomocí příběhu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický žánr vyjadřující smutek, žal, obvykle nad ztrátou blízké osoby?",
    options: ["óda", "elegie", "komedie", "fraška"],
    correctAnswerIndex: 1,
    explanation:
      "Elegie je žalozpěv, básnický žánr vyjadřující smutek a truchlení, často nad ztrátou blízké osoby.",
    hint: "Hledej pojem pro báseň plnou smutku a truchlení.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický žánr oslavného charakteru, vyjadřující nadšení nad určitou osobou, událostí či myšlenkou?",
    options: ["óda", "elegie", "satira", "tragédie"],
    correctAnswerIndex: 0,
    explanation:
      "Óda je oslavná báseň vyjadřující nadšení a obdiv k opěvované osobě, události nebo myšlence.",
    hint: "Hledej pojem pro báseň, která něco či někoho velebí a oslavuje.",
  },
  {
    category: "Literární teorie",
    text: "Čím se liší novela od povídky?",
    options: [
      "novela je zpravidla delší a má složitější dějovou linii než povídka",
      "novela je vždy psána ve verších, povídka v próze",
      "novela nemá žádné postavy",
      "mezi novelou a povídkou není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Novela je zpravidla rozsáhlejší než povídka a má propracovanější, složitější dějovou linii, i když je stále kratší než román.",
    hint: "Přemýšlej o velikosti a složitosti děje – jedna z těchto dvou epických forem bývá o něco obsáhlejší.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá část dramatu, do které autor vkládá pokyny pro herce a inscenátory (např. popis jednání postav, prostředí)?",
    options: ["replika", "scénická poznámka", "dialog", "monolog"],
    correctAnswerIndex: 1,
    explanation:
      "Scénická poznámka (didaskalie) je text v dramatu, který obsahuje autorovy pokyny pro herce a inscenátory, není určen k pronesení na jevišti.",
    hint: "Hledej pojem pro text, který v divadelní hře nečte herec nahlas, ale slouží jako režijní pokyn.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá promluva jedné postavy v dramatu, pronesená bez reakce dalších postav, často vyjadřující vnitřní myšlenky?",
    options: ["dialog", "monolog", "replika", "scénická poznámka"],
    correctAnswerIndex: 1,
    explanation:
      "Monolog je souvislá promluva jedné postavy, obvykle vyjadřující její vnitřní myšlenky nebo pocity.",
    hint: "Předpona mono- znamená „jeden“ – jde o promluvu jedné jediné postavy.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá promluva dvou nebo více postav, které si vzájemně odpovídají?",
    options: ["monolog", "dialog", "replika", "óda"],
    correctAnswerIndex: 1,
    explanation: "Dialog je rozhovor dvou nebo více postav, které si vzájemně odpovídají.",
    hint: "Předpona dia- naznačuje „mezi, skrz“ – jde o promluvu probíhající MEZI víc postavami.",
  },

  // ---- Literární teorie (nové, čtvrtá dávka – úryvky z Babičky a R.U.R., volná díla) ----
  {
    category: "Literární teorie",
    workingText:
      "Děti vybíhaly každou chvilku na cestu dívat se, nejede-li už Václav, a každému, kdo šel kolem, vypravovaly: „Dnes přijede naše babička!“ Samy pak mezi sebou si ustavičně povídaly. „Jakápak asi ta babička bude?“ Ony znaly více babiček, podoby jejich se jim v hlavě pletly, nevěděly však, ke které tu svou babičku připodobnit. Tu konečně přijíždí k stavení vozík! „Babička už jede!“ rozlehlo se po domě.\n(Božena Němcová: Babička)",
    text: "Jaký druh věty podle postoje mluvčího je: „Tu konečně přijíždí k stavení vozík!“?",
    options: ["věta oznamovací", "věta zvolací", "věta přací", "věta tázací"],
    correctAnswerIndex: 1,
    explanation:
      "Věta vyjadřuje silné vzrušení a očekávání dětí – jde o větu zvolací, zakončenou vykřičníkem.",
    hint: "Všimni si vykřičníku na konci věty – signalizuje silné citové zabarvení.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Děti vybíhaly každou chvilku na cestu dívat se, nejede-li už Václav, a každému, kdo šel kolem, vypravovaly: „Dnes přijede naše babička!“ Samy pak mezi sebou si ustavičně povídaly. „Jakápak asi ta babička bude?“ Ony znaly více babiček, podoby jejich se jim v hlavě pletly, nevěděly však, ke které tu svou babičku připodobnit. Tu konečně přijíždí k stavení vozík! „Babička už jede!“ rozlehlo se po domě.\n(Božena Němcová: Babička)",
    text: "Kolikrát je v ukázce použita přímá řeč (text v uvozovkách)?",
    options: ["jednou", "dvakrát", "třikrát", "čtyřikrát"],
    correctAnswerIndex: 2,
    explanation:
      "V ukázce jsou v uvozovkách tři promluvy: „Dnes přijede naše babička!“, „Jakápak asi ta babička bude?“ a „Babička už jede!“",
    hint: "Spočítej, kolikrát se v textu objevuje text uzavřený v uvozovkách.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Děti vybíhaly každou chvilku na cestu dívat se, nejede-li už Václav, a každému, kdo šel kolem, vypravovaly: „Dnes přijede naše babička!“ Samy pak mezi sebou si ustavičně povídaly. „Jakápak asi ta babička bude?“ Ony znaly více babiček, podoby jejich se jim v hlavě pletly, nevěděly však, ke které tu svou babičku připodobnit. Tu konečně přijíždí k stavení vozík! „Babička už jede!“ rozlehlo se po domě.",
    text: "Z jakého díla pochází uvedená ukázka?",
    options: [
      "Babička – Božena Němcová",
      "Kytice – Karel Jaromír Erben",
      "Bílá nemoc – Karel Čapek",
      "Robinson Crusoe – Daniel Defoe",
    ],
    correctAnswerIndex: 0,
    explanation: "Ukázka pochází z díla Babička od Boženy Němcové.",
    hint: "Přemýšlej, který slavný český román vypráví o dětech čekajících na příjezd své babičky na venkov.",
  },
  {
    category: "Literární teorie",
    workingText:
      "Děti vybíhaly každou chvilku na cestu dívat se, nejede-li už Václav, a každému, kdo šel kolem, vypravovaly: „Dnes přijede naše babička!“ Samy pak mezi sebou si ustavičně povídaly. „Jakápak asi ta babička bude?“ Ony znaly více babiček, podoby jejich se jim v hlavě pletly, nevěděly však, ke které tu svou babičku připodobnit. Tu konečně přijíždí k stavení vozík! „Babička už jede!“ rozlehlo se po domě.\n(Božena Němcová: Babička)",
    text: "Jaký literární druh představuje uvedená ukázka?",
    options: ["poezie", "próza", "drama", "píseň"],
    correctAnswerIndex: 1,
    explanation: "Ukázka je psána souvislým textem bez veršů a rýmu – jde o prózu.",
    hint: "Všimni si, že text není rozdělen do veršů ani slok, ale plyne v souvislých větách.",
  },
  {
    category: "Literární teorie",
    workingText:
      "DOMIN: Tím vlastně vyhodil člověka a udělal Robota. Drahá slečno Gloryová, Roboti nejsou lidé. Jsou mechanicky dokonalejší než my, mají úžasnou rozumovou inteligenci, ale nemají duši.\nHELENA: Říká se, že člověk je výrobek boží.\nDOMIN: Tím hůř. Bůh neměl ani ponětí o moderní technice.\n(Karel Čapek: R.U.R.)",
    text: "Jaký literární druh představuje uvedená ukázka?",
    options: ["próza", "poezie", "drama", "óda"],
    correctAnswerIndex: 2,
    explanation:
      "Ukázka je zapsána jako dialog dvou postav (Domin, Helena) uvozený jejich jmény – jde o drama, konkrétně divadelní hru.",
    hint: "Všimni si, jak je text zapsán – jména postav následovaná dvojtečkou a jejich replikami jsou typické pro tento literární druh.",
  },
  {
    category: "Literární teorie",
    workingText:
      "DOMIN: Tím vlastně vyhodil člověka a udělal Robota. Drahá slečno Gloryová, Roboti nejsou lidé. Jsou mechanicky dokonalejší než my, mají úžasnou rozumovou inteligenci, ale nemají duši.\nHELENA: Říká se, že člověk je výrobek boží.\nDOMIN: Tím hůř. Bůh neměl ani ponětí o moderní technice.\n(Karel Čapek: R.U.R.)",
    text: "Kolik postav v uvedené ukázce mluví?",
    options: ["jedna", "dvě", "tři", "čtyři"],
    correctAnswerIndex: 1,
    explanation: "V ukázce vystupují a mluví dvě postavy: Domin a Helena.",
    hint: "Spočítej, kolik různých jmen se v ukázce objevuje před dvojtečkou jako uvození repliky.",
  },
  {
    category: "Literární teorie",
    workingText:
      "DOMIN: Tím vlastně vyhodil člověka a udělal Robota. Drahá slečno Gloryová, Roboti nejsou lidé. Jsou mechanicky dokonalejší než my, mají úžasnou rozumovou inteligenci, ale nemají duši.\nHELENA: Říká se, že člověk je výrobek boží.\nDOMIN: Tím hůř. Bůh neměl ani ponětí o moderní technice.",
    text: "Z jaké divadelní hry pochází uvedená ukázka a kdo je jejím autorem?",
    options: [
      "R.U.R. – Karel Čapek",
      "Kytice – Karel Jaromír Erben",
      "Babička – Božena Němcová",
      "Malý princ – Antoine de Saint-Exupéry",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Ukázka pochází z dramatu R.U.R. Karla Čapka, ve kterém autor poprvé použil slovo „robot“.",
    hint: "Přemýšlej, ve které slavné české divadelní hře se poprvé objevilo slovo, které dnes používá celý svět pro označení umělé bytosti.",
  },
  {
    category: "Literární teorie",
    text: "Jaké slovo, dnes používané po celém světě, poprvé použil Karel Čapek ve své divadelní hře R.U.R.?",
    options: ["android", "robot", "kyborg", "automat"],
    correctAnswerIndex: 1,
    explanation:
      "Karel Čapek v dramatu R.U.R. poprvé použil slovo „robot“, odvozené od slova „robota“ (nucená práce) na návrh svého bratra Josefa.",
    hint: "Zkratka R.U.R. znamená Rossumovi univerzální… – doplň slovo, které z tohoto díla proslulo po celém světě.",
  },
  {
    category: "Literární teorie",
    text: "Který britský spisovatel je autorem románu, ve kterém popsal totalitní stát řízený postavou zvanou Velký bratr?",
    options: ["George Orwell", "Jules Verne", "Karel Čapek", "Antoine de Saint-Exupéry"],
    correctAnswerIndex: 0,
    explanation: "Autorem tohoto antiutopického románu (1984) je britský spisovatel George Orwell.",
    hint: "Jde o slavný britský román z poloviny 20. století, jehož název je zároveň rokem.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární žánr, který popisuje fiktivní společnost s negativními, útlačnými rysy jako varování před možným vývojem lidstva?",
    options: ["utopie", "antiutopie (dystopie)", "idylka", "pohádka"],
    correctAnswerIndex: 1,
    explanation:
      "Antiutopie (dystopie) je žánr líčící fiktivní společnost s negativními, útlačnými rysy jako varování.",
    hint: "Jde o opak utopie – místo ideální společnosti líčí společnost temnou a útlačnou.",
  },
  {
    category: "Literární teorie",
    text: "Jak se naopak nazývá žánr líčící fiktivní ideální, dokonale uspořádanou společnost?",
    options: ["utopie", "antiutopie", "tragédie", "román"],
    correctAnswerIndex: 0,
    explanation: "Utopie je žánr líčící fiktivní ideální, dokonale uspořádanou společnost.",
    hint: "Jde o vysněnou, neexistující dokonalou zemi.",
  },
  {
    category: "Literární teorie",
    text: "Který francouzský spisovatel 19. století je považován za jednoho ze zakladatelů dobrodružného a vědeckofantastického románu?",
    options: ["Jules Verne", "George Orwell", "Karel Čapek", "Ezop"],
    correctAnswerIndex: 0,
    explanation:
      "Jules Verne je francouzský spisovatel 19. století, považovaný za jednoho ze zakladatelů dobrodružného a vědeckofantastického (sci-fi) románu.",
    hint: "Tento autor psal o cestování na neobvyklá místa – pod moře, do středu Země i kolem světa za osmdesát dní.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární žánr popisující smyšlené, často technicky nebo vědecky inspirované představy budoucnosti či jiných světů?",
    options: ["vědeckofantastický žánr (sci-fi)", "cestopis", "memoáry", "bajka"],
    correctAnswerIndex: 0,
    explanation:
      "Vědeckofantastický žánr (sci-fi) zobrazuje smyšlené, často technicky či vědecky inspirované představy budoucnosti, vesmíru nebo jiných světů.",
    hint: "Zkratka sci-fi vychází z anglického „science fiction“ – vědecká fikce.",
  },
  {
    category: "Literární teorie",
    text: "Který francouzský spisovatel a zároveň letec je autorem celosvětově známého filozofického příběhu o chlapci z jiné planety?",
    options: ["Antoine de Saint-Exupéry", "Jules Verne", "George Orwell", "Ezop"],
    correctAnswerIndex: 0,
    explanation:
      "Antoine de Saint-Exupéry byl francouzský spisovatel a letec, autor celosvětově známého díla Malý princ.",
    hint: "Tento autor byl sám profesí letec a za druhé světové války za záhadných okolností zmizel při letu nad mořem.",
  },
  {
    category: "Literární teorie",
    text: "Jaký literární žánr je typický kombinací filozofického poselství s pohádkovým, na první pohled dětským příběhem, jako v případě díla Malý princ?",
    options: ["filozofická pohádka (podobenství)", "vědeckofantastický román", "cestopis", "epos"],
    correctAnswerIndex: 0,
    explanation:
      "Jde o filozofickou pohádku (podobenství) – vyprávění s pohádkovými prvky, které zároveň nese hlubší filozofické poselství pro dospělé čtenáře.",
    hint: "Takové dílo se na první pohled tváří jako dětská pohádka, ale nese v sobě hlubší myšlenku i pro dospělé.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá vypravěč, který je zároveň postavou příběhu a vypráví v 1. osobě (já)?",
    options: ["er-forma (vypravěč vševědoucí)", "ich-forma (vypravěč jako postava)", "dialog", "monolog"],
    correctAnswerIndex: 1,
    explanation:
      "Ich-forma je způsob vyprávění, kdy vypravěč je zároveň postavou příběhu a vypráví v 1. osobě jednotného čísla.",
    hint: "Předpona „ich“ v němčině znamená „já“ – jde o vyprávění v první osobě.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá vypravěč, který stojí mimo děj, vypráví ve 3. osobě a zná myšlenky všech postav?",
    options: ["ich-forma", "er-forma (vypravěč vševědoucí)", "přímá řeč", "monolog"],
    correctAnswerIndex: 1,
    explanation:
      "Er-forma je způsob vyprávění ve 3. osobě, kdy vypravěč stojí mimo děj a může znát myšlenky a pocity všech postav.",
    hint: "Jde o opak ich-formy – vypravěč není postavou příběhu, ale sleduje děj zvenčí.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární žánr, ve kterém autor popisuje své vlastní cesty a zážitky z neznámých míst?",
    options: ["cestopis", "bajka", "óda", "elegie"],
    correctAnswerIndex: 0,
    explanation:
      "Cestopis je literární žánr, ve kterém autor popisuje své vlastní cesty a zážitky z cizích, často neznámých míst.",
    hint: "Název žánru přímo napovídá, že jde o zápisky z cest.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá vyprávění, které se vrací v čase zpět, aby čtenáři osvětlilo minulost postav nebo událostí?",
    options: ["retrospektiva (časový posun zpět)", "gradace", "pointa", "apozice"],
    correctAnswerIndex: 0,
    explanation:
      "Retrospektiva je vyprávění, které se vrací v čase zpět, aby osvětlilo minulost postav nebo dřívější události.",
    hint: "Předpona retro- znamená „zpět“ – jde o návrat v čase v rámci vyprávění.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá překvapivé, výstižné vyústění příběhu nebo vtipu na jeho úplném konci?",
    options: ["pointa", "předehra", "expozice", "kolize"],
    correctAnswerIndex: 0,
    explanation:
      "Pointa je překvapivé, výstižné vyústění příběhu, anekdoty nebo vtipu na jeho úplném konci.",
    hint: "Jde o „vrchol“ vyprávění, který přijde na úplném konci a často překvapí.",
  },

  // ---- Literární teorie (nové, pátá dávka – doplnění do 80) ----
  {
    category: "Literární teorie",
    text: "Který znak je typický pro pohádku?",
    options: [
      "reálné, historicky doložené postavy",
      "boj dobra se zlem a šťastný konec",
      "absence jakéhokoli nadpřirozeného prvku",
      "vždy psána ve verších",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Pohádka je typická bojem dobra se zlem, nadpřirozenými prvky a obvykle šťastným koncem.",
    hint: "Vzpomeň si na klasické pohádky – jak většinou končí a jaký konflikt v nich bývá ústřední?",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá dramatický žánr s vážným, obvykle smutným nebo tragickým koncem, často zobrazující boj hrdiny proti osudu?",
    options: ["komedie", "tragédie", "fraška", "óda"],
    correctAnswerIndex: 1,
    explanation:
      "Tragédie je dramatický žánr s vážným obsahem a tragickým koncem, často zobrazující boj hlavní postavy proti osudu nebo vyšší moci.",
    hint: "Hledej pojem pro vážné drama s neradostným koncem, opak komedie.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá dramatický žánr s odlehčeným obsahem, komickými situacemi a obvykle šťastným koncem?",
    options: ["komedie", "tragédie", "elegie", "epos"],
    correctAnswerIndex: 0,
    explanation:
      "Komedie je dramatický žánr s odlehčeným, humorným obsahem a obvykle šťastným koncem.",
    hint: "Hledej pojem pro veselé, humorné divadelní představení.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá krátký, publicistický útvar psaný lehkým, vtipným stylem na aktuální téma, obvykle otiskovaný v novinách?",
    options: ["fejeton", "epos", "elegie", "sonet"],
    correctAnswerIndex: 0,
    explanation:
      "Fejeton je krátký publicistický žánr psaný osobitým, často ironickým nebo vtipným stylem na aktuální téma.",
    hint: "Tento žánr najdeš typicky v novinách nebo časopisech, píše se osobitým, subjektivním stylem.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá publicistický žánr, ve kterém autor na základě vlastní přítomnosti nebo přímého pozorování informuje o aktuální události?",
    options: ["reportáž", "fejeton", "óda", "elegie"],
    correctAnswerIndex: 0,
    explanation:
      "Reportáž je publicistický žánr informující o aktuální události na základě autorovy vlastní přítomnosti nebo přímého pozorování.",
    hint: "Hledej pojem pro novinářský text, ve kterém autor osobně popisuje to, co viděl na místě události.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární útvar, ve kterém autor pravidelně zaznamenává vlastní zážitky a myšlenky podle data?",
    options: ["deník", "epos", "óda", "bajka"],
    correctAnswerIndex: 0,
    explanation:
      "Deník je literární útvar, do kterého autor pravidelně, obvykle podle data, zaznamenává své zážitky a myšlenky.",
    hint: "Hledej pojem pro texty psané pravidelně, den po dni, o vlastním životě autora.",
  },
  {
    category: "Literární teorie",
    text: "Čím se liší literatura faktu od umělecké (krásné) literatury?",
    options: [
      "literatura faktu se opírá o ověřitelná fakta a skutečné události, umělecká literatura je založena na fikci",
      "literatura faktu je vždy psána ve verších",
      "umělecká literatura nesmí obsahovat žádné postavy",
      "mezi nimi není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Literatura faktu se opírá o ověřitelná fakta a skutečné události, zatímco umělecká literatura je založena na fikci, i když může čerpat inspiraci ze skutečnosti.",
    hint: "Přemýšlej o rozdílu mezi encyklopedií nebo životopisem a románem – co je u nich zásadně jiné?",
  },
  {
    category: "Literární teorie",
    text: "Jaký je základní rozdíl mezi prózou a poezií?",
    options: [
      "próza je psána souvislým textem, poezie je členěna do veršů a slok",
      "próza nikdy neobsahuje dialogy",
      "poezie nesmí vyprávět příběh",
      "mezi nimi není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Próza je psána souvislým textem uspořádaným do vět a odstavců, zatímco poezie je členěna do veršů a slok, často s rytmem a rýmem.",
    hint: "Přemýšlej o vizuální podobě textu – jak vypadá stránka románu a jak stránka básnické sbírky.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá verš, který nemá pravidelný rým ani pevný počet slabik?",
    options: ["volný verš", "sonet", "epos", "óda"],
    correctAnswerIndex: 0,
    explanation:
      "Volný verš je básnický verš, který se neřídí pravidelným rýmem ani pevným metrem (počtem slabik).",
    hint: "Hledej pojem pro báseň, která se nedrží žádných pevných pravidel rýmu a rytmu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek opakování stejné hlásky nebo skupiny hlásek na začátku po sobě jdoucích slov, např. „Prší, prší, v Praze“?",
    options: ["aliterace", "gradace", "epiteton", "metonymie"],
    correctAnswerIndex: 0,
    explanation:
      "Aliterace je opakování stejné hlásky nebo skupiny hlásek na začátku více po sobě jdoucích slov.",
    hint: "Všimni si, které písmeno se v uvedeném příkladu opakuje na začátku několika slov za sebou.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá básnický prostředek, kdy celé dílo nebo jeho část má skrytý, přenesený význam, který čtenář musí rozluštit (např. bajky, kde zvířata zastupují lidské typy)?",
    options: ["alegorie", "hyperbola", "ironie", "gradace"],
    correctAnswerIndex: 0,
    explanation: "Alegorie je vyjádření, ve kterém má celé dílo nebo jeho podstatná část skrytý, přenesený význam.",
    hint: "Vzpomeň si na bajky, ve kterých zvířata zastupují lidské vlastnosti – takovému principu se říká…",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá text zaznamenávající historické události v chronologickém pořadí, obvykle podle jednotlivých let?",
    options: ["kronika", "óda", "elegie", "fejeton"],
    correctAnswerIndex: 0,
    explanation:
      "Kronika je text zaznamenávající historické události v chronologickém pořadí, obvykle rok po roce.",
    hint: "Hledej pojem pro historický zápis událostí, uspořádaný postupně podle let.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá krátké, vtipné vyprávění se stručnou, překvapivou pointou?",
    options: ["anekdota", "epos", "elegie", "óda"],
    correctAnswerIndex: 0,
    explanation:
      "Anekdota je krátké, vtipné vyprávění se stručnou a obvykle překvapivou pointou.",
    hint: "Hledej pojem pro krátký vtipný příběh, který se často vypráví ústně.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá část příběhu, ve které dochází ke střetu zájmů postav a rozvíjí se hlavní konflikt díla?",
    options: ["expozice", "kolize (zápletka)", "pointa", "katarze"],
    correctAnswerIndex: 1,
    explanation:
      "Kolize (zápletka) je část příběhu, ve které dochází ke střetu zájmů postav a rozvíjí se hlavní konflikt díla.",
    hint: "Hledej pojem pro moment, kdy se v příběhu poprvé objeví konflikt nebo problém, který je potřeba vyřešit.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá úvodní část příběhu, ve které se čtenář seznamuje s postavami, prostředím a výchozí situací?",
    options: ["expozice", "kolize", "krize", "katastrofa"],
    correctAnswerIndex: 0,
    explanation:
      "Expozice je úvodní část příběhu, která seznamuje čtenáře s postavami, prostředím a výchozí situací.",
    hint: "Hledej pojem pro „úvod“ příběhu, který teprve představuje postavy a situaci.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá krátký citát nebo výrok umístěný na začátku literárního díla, který naznačuje jeho hlavní myšlenku?",
    options: ["motto", "pointa", "předmluva", "doslov"],
    correctAnswerIndex: 0,
    explanation:
      "Motto je krátký citát nebo výrok na začátku díla, který naznačuje jeho hlavní myšlenku nebo téma.",
    hint: "Hledej pojem pro krátký úvodní citát, který dává tušit, o čem dílo bude.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá text na konci knihy, ve kterém autor nebo vydavatel dílo shrnuje nebo komentuje?",
    options: ["doslov", "předmluva", "motto", "pointa"],
    correctAnswerIndex: 0,
    explanation:
      "Doslov je text umístěný na konci knihy, ve kterém autor nebo vydavatel dílo shrnuje nebo komentuje.",
    hint: "Předpona do- naznačuje, že jde o text „na konec“ – opak předmluvy, která je na začátku.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá postava, kolem které se odehrává hlavní dějová linie příběhu?",
    options: ["hlavní postava (protagonista)", "vedlejší postava", "vypravěč", "antagonista"],
    correctAnswerIndex: 0,
    explanation:
      "Hlavní postava (protagonista) je postava, kolem které se odehrává hlavní dějová linie příběhu.",
    hint: "Hledej pojem pro postavu, na kterou se soustředí většina děje příběhu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá postava, která stojí v přímém konfliktu s hlavní postavou a brání jí v dosažení cíle?",
    options: ["protagonista", "antagonista", "vypravěč", "vedlejší postava bez konfliktu"],
    correctAnswerIndex: 1,
    explanation: "Antagonista je postava stojící v přímém konfliktu s hlavní postavou (protagonistou).",
    hint: "Hledej pojem pro „protihráče“ hlavní postavy – toho, kdo jí stojí v cestě.",
  },
  {
    category: "Literární teorie",
    text: "Čím se přísloví liší od pořekadla?",
    options: [
      "přísloví obsahuje obecné poučení nebo životní moudrost, pořekadlo je jen ustálené slovní spojení bez mravního ponaučení",
      "pořekadlo je vždy delší než přísloví",
      "přísloví se nikdy nerýmuje",
      "mezi nimi není žádný rozdíl",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Přísloví obsahuje obecně platné poučení nebo životní moudrost, zatímco pořekadlo je jen ustálené obrazné spojení bez mravního ponaučení.",
    hint: "Přemýšlej, jestli ustálené spojení obsahuje životní ponaučení, nebo jen obrazně popisuje nějaký jev.",
  },

  // ---- Literární teorie (nové, šestá dávka – doplnění do 100) ----
  {
    category: "Literární teorie",
    text: "Jak se nazývá náhlý zvrat v ději, který mění směr vyprávění, obvykle blízko vyvrcholení příběhu?",
    options: ["expozice", "peripetie (zvrat)", "kolize", "doslov"],
    correctAnswerIndex: 1,
    explanation:
      "Peripetie je náhlý zvrat v ději, který mění dosavadní směr vyprávění, obvykle nedlouho před vyvrcholením příběhu.",
    hint: "Hledej pojem pro neočekávaný obrat, který příběh posune jiným směrem, než se čekalo.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá vyvrcholení konfliktu v ději, bod, kdy je napětí největší?",
    options: ["expozice", "krize (vyvrcholení)", "doslov", "motto"],
    correctAnswerIndex: 1,
    explanation: "Krize je bod v příběhu, kdy konflikt vrcholí a napětí dosahuje maxima.",
    hint: "Hledej pojem pro moment největšího napětí v příběhu, těsně před rozuzlením.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá závěrečná část dramatu, ve které dochází k rozuzlení, často tragickému?",
    options: ["expozice", "katastrofa (rozuzlení)", "kolize", "motto"],
    correctAnswerIndex: 1,
    explanation:
      "Katastrofa je závěrečná část dramatu, ve které se konflikt rozuzlí – v tragédii bývá toto rozuzlení neradostné, tragické.",
    hint: "V klasickém dramatu jde o poslední fázi děje, kde se vše vyřeší, byť často smutně.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá hlavní, velká část divadelní hry, na které se dělí celé drama?",
    options: ["scéna", "jednání (dějství)", "výstup", "replika"],
    correctAnswerIndex: 1,
    explanation:
      "Jednání (dějství) je hlavní část, na které se dělí celé drama – hra může mít např. tři nebo pět dějství.",
    hint: "Hledej pojem pro největší dělící jednotku divadelní hry, uvnitř které jsou další, menší části.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá část dějství divadelní hry, která se mění pokaždé, když na jeviště přijde nebo odejde nějaká postava?",
    options: ["jednání", "scéna (výstup)", "replika", "expozice"],
    correctAnswerIndex: 1,
    explanation:
      "Scéna (výstup) je část dějství, která se mění s příchodem nebo odchodem postavy z jeviště.",
    hint: "Hledej menší dělící jednotku uvnitř dějství, vázanou na to, kdo je právě na jevišti.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá jedna promluva jedné postavy v dramatu?",
    options: ["replika", "monolog vždy", "dialog vždy", "scénická poznámka"],
    correctAnswerIndex: 0,
    explanation:
      "Replika je jedna promluva jedné postavy v dramatu, ať už je součástí dialogu, nebo monologu.",
    hint: "Hledej obecný pojem pro jakoukoli jednotlivou „řádku“ textu, kterou pronese jedna postava.",
  },
  {
    category: "Literární teorie",
    text: "Jaký je rozdíl mezi motivem a tématem literárního díla?",
    options: [
      "motiv je nejmenší tematický prvek díla, téma je hlavní, ústřední myšlenka celého díla",
      "motiv a téma znamenají totéž",
      "téma je vždy jen jedno slovo, motiv celá věta",
      "motiv se týká jen poezie, téma jen prózy",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Motiv je nejmenší tematický prvek díla (např. motiv cesty, motiv lásky), zatímco téma je hlavní, ústřední myšlenka celého díla, kterou motivy společně rozvíjejí.",
    hint: "Motiv je jednotlivá menší „stavební cihla“, téma je celková stavba, kterou tyto cihly dohromady tvoří.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá kompoziční postup, kdy vyprávění začíná přímo uprostřed děje, bez úvodního vysvětlení?",
    options: ["in medias res", "expozice", "retrospektiva", "pointa"],
    correctAnswerIndex: 0,
    explanation:
      "In medias res (latinsky „doprostřed věci“) je kompoziční postup, kdy příběh začíná přímo uprostřed děje, bez klasického úvodního vysvětlení situace.",
    hint: "Jde o vyprávění, které nezačíná od začátku, ale rovnou „vhodí“ čtenáře doprostřed napínavé situace.",
  },
  {
    category: "Literární teorie",
    text: "Jaký je rozdíl mezi personifikací a alegorií?",
    options: [
      "personifikace přisuzuje lidské vlastnosti jedné věci nebo jevu, alegorie vyjadřuje skrytý, přenesený význam celého díla nebo jeho části",
      "jsou to dvě naprosto stejné věci",
      "personifikace se týká jen zvířat, alegorie jen rostlin",
      "alegorie je vždy kratší než personifikace",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Personifikace přisuzuje lidské vlastnosti konkrétní neživé věci nebo jevu (vítr si pohrával), zatímco alegorie vyjadřuje skrytý, přenesený význam celého díla nebo jeho podstatné části (např. bajka jako celek).",
    hint: "Personifikace se týká jednoho konkrétního obrazu, alegorie se týká smyslu celého díla nebo jeho větší části.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá starobylé vyprávění o bozích, hrdinech nebo vzniku světa, které si dané společenství považovalo za posvátné nebo pravdivé?",
    options: ["mýtus", "bajka", "anekdota", "fejeton"],
    correctAnswerIndex: 0,
    explanation:
      "Mýtus je starobylé vyprávění o bozích, hrdinech nebo vzniku světa, které bylo v dané společnosti považováno za posvátné nebo pravdivé vysvětlení skutečnosti.",
    hint: "Hledej pojem pro starověká vyprávění o bozích, jaká známe například ze starého Řecka.",
  },
  {
    category: "Literární teorie",
    text: "Čím se liší mýtus od pověsti?",
    options: [
      "mýtus vypráví o bozích a vzniku světa, pověst se váže ke konkrétnímu, obvykle historickému místu nebo události",
      "mezi nimi není žádný rozdíl",
      "pověst je vždy delší než mýtus",
      "mýtus se váže jen k současnosti",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Mýtus vypráví o bozích, hrdinech nebo vzniku světa obecně, zatímco pověst se váže ke konkrétnímu, obvykle historickému místu nebo události a často vysvětluje jeho původ.",
    hint: "Mýtus se týká obecně světa a bohů, pověst je konkrétnější a váže se k určitému místu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá publicistický útvar, ve kterém autor hodnotí umělecké dílo (knihu, film) a vyjadřuje k němu svůj názor?",
    options: ["recenze", "reportáž", "fejeton", "zpráva"],
    correctAnswerIndex: 0,
    explanation:
      "Recenze je publicistický útvar, ve kterém autor hodnotí umělecké dílo a vyjadřuje k němu svůj kritický názor.",
    hint: "Hledej pojem pro text, který najdeš v novinách nebo časopise, když si chceš přečíst hodnocení nové knihy nebo filmu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární dílo, ve kterém autor popisuje vlastní život?",
    options: ["biografie", "autobiografie", "cestopis", "kronika"],
    correctAnswerIndex: 1,
    explanation:
      "Autobiografie je dílo, ve kterém autor píše o vlastním životě (na rozdíl od biografie, kterou o někom jiném píše jiný autor).",
    hint: "Předpona auto- znamená „sám, svůj“ – jde tedy o životopis psaný samotným autorem o sobě.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární dílo popisující život jiné osoby, napsané někým jiným než touto osobou?",
    options: ["autobiografie", "biografie (životopis)", "deník", "memoáry"],
    correctAnswerIndex: 1,
    explanation:
      "Biografie (životopis) je dílo popisující život určité osoby, napsané jiným autorem.",
    hint: "Na rozdíl od autobiografie tu autor píše o životě NĚKOHO JINÉHO, ne o sobě samém.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá moderní literární žánr, který se odehrává v budoucnosti nebo ve vesmíru a staví na vědeckých a technologických prvcích?",
    options: ["sci-fi (vědeckofantastická literatura)", "fantasy", "detektivka", "historický román"],
    correctAnswerIndex: 0,
    explanation:
      "Sci-fi (vědeckofantastická literatura) je žánr založený na vědeckých a technologických prvcích, často zasazený do budoucnosti nebo vesmíru.",
    hint: "Hledej žánr, ve kterém se často objevují vesmírné lodě, roboti nebo technologie budoucnosti.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá literární žánr, který staví na smyšleném světě s magií, bájnými bytostmi a nadpřirozenými prvky, ale bez opory ve vědeckém vysvětlení?",
    options: ["sci-fi", "fantasy", "detektivka", "cestopis"],
    correctAnswerIndex: 1,
    explanation:
      "Fantasy je žánr stavějící na smyšleném světě s magií a bájnými bytostmi, na rozdíl od sci-fi nestaví na vědeckém vysvětlení.",
    hint: "Hledej žánr, ve kterém se typicky objevují draci, čarodějové a magie, ne technologie nebo věda.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá soubor básní jednoho autora vydaný společně jako jedna kniha (např. Erbenova Kytice)?",
    options: ["sbírka", "epos", "óda", "fejeton"],
    correctAnswerIndex: 0,
    explanation:
      "Sbírka je soubor básní (nebo povídek) jednoho autora, vydaný společně jako jedna kniha.",
    hint: "Hledej obecný pojem pro knihu, ve které je „sebráno“ víc básní dohromady.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá menší, uzavřená část příběhu, která je součástí většího vyprávění?",
    options: ["epizoda", "expozice", "pointa", "motto"],
    correctAnswerIndex: 0,
    explanation:
      "Epizoda je menší, uzavřená část příběhu, která je součástí většího celku vyprávění.",
    hint: "Hledej pojem pro jednu samostatnou „epizodku“ v rámci delšího vyprávění nebo seriálu.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá součást textu, ve které mluví přímo vypravěč (popisuje, komentuje), na rozdíl od části, kde mluví přímo postavy?",
    options: ["pásmo vypravěče", "pásmo postav", "scénická poznámka", "přístavek"],
    correctAnswerIndex: 0,
    explanation:
      "Pásmo vypravěče je ta část textu, kde mluví vypravěč (popisuje děj, prostředí, komentuje), na rozdíl od pásma postav, kde promlouvají přímo jednotlivé postavy.",
    hint: "Rozliš, jestli právě čteš vypravěčův popis, nebo přímou řeč některé z postav.",
  },
  {
    category: "Literární teorie",
    text: "Jak se nazývá skupina literárních děl (např. povídek nebo románů) spojených společným tématem, postavami nebo prostředím?",
    options: ["cyklus", "sbírka", "antologie", "edice"],
    correctAnswerIndex: 0,
    explanation:
      "Cyklus je skupina děl spojených společným tématem, postavami nebo prostředím – např. série na sebe navazujících románů.",
    hint: "Hledej pojem pro víc děl, které spolu úzce souvisí (např. pokračování se stejnými postavami), na rozdíl od „sbírky“, která jen shromažďuje básně jednoho autora, nebo „antologie“, kde přispívá víc různých autorů.",
  },
];
const LETTERS = ["A", "B", "C", "D"];

// Fixed topic areas shown in the chapter menu, in this order, regardless
// of how many real questions currently exist for each one.
const TOPIC_AREAS = [
  "Pravopis",
  "Skladba",
  "Tvarosloví",
  "Porozumění textu",
  "Slovní zásoba",
  "Literární teorie",
];

const QUIZ_LENGTH = 20; // per-topic practice round
const FULL_TEST_LENGTH = 30; // full timed mock exam, mirrors real JPZ length
const FULL_TEST_MINUTES = 40;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draws exactly `count` questions from `pool`. If the pool has fewer
// questions than requested, it reshuffles and cycles through the pool again
// rather than stopping short — while avoiding placing the same question
// twice in a row where possible. Once a topic has enough real questions,
// this naturally behaves like a plain no-repeat shuffle.
function drawQuestions(pool, count) {
  if (pool.length === 0) return [];
  const result = [];
  let bag = shuffle(pool);
  while (result.length < count) {
    if (bag.length === 0) bag = shuffle(pool);
    let candidate = bag.shift();
    if (
      pool.length > 1 &&
      result.length > 0 &&
      candidate === result[result.length - 1] &&
      bag.length > 0
    ) {
      bag.push(candidate);
      candidate = bag.shift();
    }
    result.push(candidate);
  }
  return result;
}

// Maps a percentage score (0-100) to the final result tier.
function getResultTier(percentage) {
  if (percentage >= 90) {
    return { emoji: "🏆", label: "Zlatý pohár", tone: "text-amber-500" };
  }
  if (percentage >= 80) {
    return { emoji: "🥈", label: "Stříbrný pohár", tone: "text-zinc-400" };
  }
  if (percentage >= 70) {
    return { emoji: "🥉", label: "Bronzový pohár", tone: "text-orange-400" };
  }
  return {
    emoji: null,
    label: "Není to špatné, ale chce to víc testovat a učit se.",
    tone: "text-zinc-500",
  };
}

function formatTime(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Icon set — thin, precise line icons in the spirit of SF Symbols. Color is
// always inherited (currentColor) so a single neutral tone can be applied
// uniformly via Tailwind text-color utilities, keeping category identity in
// the icon shape rather than in decorative color variety.
// ---------------------------------------------------------------------------
const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 7h16M12 7v13" strokeWidth={2.2} />
      <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" strokeWidth={2.2} />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
    </svg>
  );
}

function IconSettings({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.7 7.7 0 0 0-1.7-1L15 3.6h-4l-.4 2.4a7.7 7.7 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.8 1.7 1l.4 2.4h4l.4-2.4c.6-.2 1.2-.6 1.7-1l2.3.9 2-3.4-2-1.5Z" />
    </svg>
  );
}

function IconApple({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.1 1.1-.3 2.2-1 3-.7.8-1.9 1.5-3 1.4-.1-1.1.4-2.2 1.1-3C14.3 3.6 15.5 3 16.5 3z" />
      <path d="M20.5 17.2c-.5 1.2-1.1 2.3-1.9 3.3-1 1.3-2 2.6-3.6 2.7-1.5 0-2-1-3.7-1s-2.2 1-3.7.9c-1.6-.1-2.6-1.5-3.6-2.8C2.3 17.6 1.3 13.9 2.6 11.3c.9-1.8 2.6-3 4.4-3 1.6 0 2.6 1 3.9 1s2.1-1 3.9-.9c1.3.1 2.7.7 3.6 1.7-3.2 1.9-2.7 6.7 1.1 8.1z" />
    </svg>
  );
}

function IconGoogle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.6c-.24 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.4-2.6c-.9.6-2.1 1-3.3 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6C4.7 19.6 8.1 22 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3C2.4 8.9 2 10.4 2 12s.4 3.1 1 4.5l3.4-2.6z" />
      <path fill="#EA4335" d="M12 6.3c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.2 14.7 2 12 2 8.1 2 4.7 4.4 3 7.5l3.4 2.6c.8-2.4 3-4.1 5.6-4.1z" />
    </svg>
  );
}

function IconZap({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function IconFire({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-.5-2 2 1 3.5 3.5 3.5 6a7 7 0 0 1-14 0c0-5 4-6 5-8 .5-1 .5-2 2-3Z" />
    </svg>
  );
}

function IconChevronRight({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeWidth={2} />
    </svg>
  );
}

function IconBell({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13.5 6 9.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconLogout({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
      <path d="M15.5 16.5 20 12l-4.5-4.5" />
      <path d="M20 12H9" />
    </svg>
  );
}

function IconCheckBadge({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M7.5 12.5l2.8 2.8L16.8 8.7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconRestore({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 12a8 8 0 1 1 2.5 5.8" />
      <path d="M4 17v-4h4" />
    </svg>
  );
}

function IconTrash({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    </svg>
  );
}

// Decorative artwork slot (quill pen / compass / astrolabe). Points at a
// project-relative asset path the user will supply themselves. Until that
// file exists, onError swaps in an elegant glowing placeholder instead of a
// broken-image icon, so the layout always looks finished.
function DecorativeImage({ src, alt, className, glowClassName }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`${glowClassName} rounded-full bg-gradient-to-br from-indigo-400 via-violet-400 to-blue-400 blur-2xl animate-pulse`}
        aria-hidden="true"
      />
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

// Brass compass/gear ring around an activity icon — a code-drawn stand-in
// for the "mechanical steam-space" badge look, since it's built from SVG
// ticks rather than painted artwork.
function GearCompassBadge({ children, tintClassName, glowColor }) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const outer = 20,
      inner = i % 3 === 0 ? 15.5 : 17.5;
    const x1 = 22 + outer * Math.sin(angle);
    const y1 = 22 - outer * Math.cos(angle);
    const x2 = 22 + inner * Math.sin(angle);
    const y2 = 22 - inner * Math.cos(angle);
    return { x1, y1, x2, y2, key: i };
  });
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <circle cx="22" cy="22" r="20" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.55" />
        {ticks.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#C9A227" strokeWidth="1" opacity="0.55" />
        ))}
      </svg>
      {tintClassName ? (
        <div
          className={`absolute inset-1.5 rounded-full bg-gradient-to-br ${tintClassName} flex items-center justify-center`}
          style={{ boxShadow: `0 0 14px 1px ${glowColor}` }}
        >
          {children}
        </div>
      ) : (
        <div className="absolute inset-1.5 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}


function IconClose({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeWidth={1.8} />
    </svg>
  );
}

function IconExternalLink({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 6H6a1.5 1.5 0 0 0-1.5 1.5v10.5A1.5 1.5 0 0 0 6 19.5h10.5A1.5 1.5 0 0 0 18 18v-3" />
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M10.5 13.5 19 5" />
    </svg>
  );
}

function IconClock({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function IconPencil({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M14.5 4.5l5 5L8 21H3v-5L14.5 4.5Z" />
      <path d="M12.5 6.5l5 5" />
    </svg>
  );
}

function IconRulerTriangle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 20 12 4l8 16Z" />
      <path d="M8.5 14h9" />
    </svg>
  );
}

function IconBookOpen({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M12 6c-1.6-1.2-3.6-1.8-6-1.8v13.6c2.4 0 4.4.6 6 1.8" />
      <path d="M12 6c1.6-1.2 3.6-1.8 6-1.8v13.6c-2.4 0-4.4.6-6 1.8" />
      <path d="M12 6v13.6" />
    </svg>
  );
}

function IconGear({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.9 6.5l1.9 1.4M17.2 16.1l1.9 1.4M3.5 12h2.4M18.1 12h2.4M4.9 17.5l1.9-1.4M17.2 7.9l1.9-1.4" />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 5.5h16v10H9.5L5 19v-3.5H4v-10Z" />
      <path d="M8 10h8M8 12.8h5" />
    </svg>
  );
}

function IconBooksStack({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <rect x="4" y="4" width="14" height="4.2" rx="1" />
      <rect x="4" y="9.9" width="16" height="4.2" rx="1" />
      <rect x="4" y="15.8" width="12" height="4.2" rx="1" />
    </svg>
  );
}

// Clean, filled SF-Symbols-style status glyphs (checkmark.circle.fill /
// xmark.circle.fill) — replacing the earlier hand-drawn marks with precise,
// calm iconography appropriate for a trustworthy study tool.
function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M7.5 12.5l2.8 2.8L16.8 8.7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function XCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M8.5 8.5l7 7M15.5 8.5l-7 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Each category carries a soft, muted identity color — the same convention
// Apple uses for Reminders lists or Calendar calendars: a pastel chip color
// that ties the icon and its action button together, never a saturated
// decorative accent.
// Shared iOS/NASA-glass card look for the cosmic entry flow (Welcome, Auth,
// Onboarding). Uses inline rgba values instead of Tailwind's slash-opacity
// shorthand, since this sandbox serves a static Tailwind build that doesn't
// include slash-opacity or arbitrary-hex utilities.
const COSMIC_BG_STYLE = {
  backgroundColor: "#080B1A",
  backgroundImage:
    "radial-gradient(rgba(59, 130, 246, 0.35) 1px, transparent 1px), " +
    "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))",
  backgroundSize: "16px 16px, 100% 100%",
};
const COSMIC_GLASS_CARD_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.7)",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
const COSMIC_TILE_STYLE = {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  borderColor: "rgba(255, 255, 255, 0.12)",
};
const COSMIC_BUTTON_SHADOW = { boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.3)" };

const CATEGORY_META = {
  Pravopis: {
    icon: IconPencil,
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-500",
    btn: "text-rose-600 border-rose-200 hover:bg-rose-50",
    cheatText: "text-rose-700",
  },
  Skladba: {
    icon: IconRulerTriangle,
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-500",
    btn: "text-blue-600 border-blue-200 hover:bg-blue-50",
    cheatText: "text-blue-700",
  },
  "Porozumění textu": {
    icon: IconBookOpen,
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-500",
    btn: "text-sky-600 border-sky-200 hover:bg-sky-50",
    cheatText: "text-sky-700",
  },
  Tvarosloví: {
    icon: IconGear,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-500",
    btn: "text-amber-600 border-amber-200 hover:bg-amber-50",
    cheatText: "text-amber-700",
  },
  "Slovní zásoba": {
    icon: IconChat,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-500",
    btn: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
    cheatText: "text-emerald-700",
  },
  "Literární teorie": {
    icon: IconBooksStack,
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-500",
    btn: "text-violet-600 border-violet-200 hover:bg-violet-50",
    cheatText: "text-violet-700",
  },
};

// ---------------------------------------------------------------------------
// "Tahák" (cheat sheet) content — theoretical reference summaries per topic.
// Each section: title, rule (array of rule statements), trap (common pitfall
// explanation), examples (array of short illustrative lines).
// ---------------------------------------------------------------------------
const PRAVOPIS_CHEATSHEET = [
  {
    title: "1. Vyjmenovaná slova",
    rule: [
      "Po obojetných souhláskách B, L, M, P, S, V, Z se tvrdé -y/-ý píše jen ve vyjmenovaných slovech a slovech od nich odvozených. Ve všech ostatních slovech s těmito souhláskami píšeme měkké -i/-í.",
      "Vyjmenovaná slova nejde odvodit z žádného pravidla – je nutné znát je nazpaměť podle skupin.",
      "Výběr nejčastějších slov (ne úplný seznam, kompletní tabulku najdeš v učebnici): B – bydlet, byt, obyvatel, dobytek, kobyla, býk, bystrý, bylina; L – mlýn, blýskat se, lysý, lýko, plynout, polykat, vzlykat; M – mýt, mýtit, zamykat, mýtina, hmyz, myslet, mýlit se, jmelí; P – pýcha, pysk, netopýr, slepýš, kopyto, klopýtat; S – syn, sytý, sýr, syrový, sysel, sypat, usychat; V – vysoký, výskat, zvykat, žvýkat, výr, zvyk; Z – brzy, jazyk, nazývat.",
    ],
    trap:
      "Vyjmenovaná i nevyjmenovaná slova se ve výslovnosti neliší – y/i se pozná jen podle toho, jestli slovo je na seznamu. Klasické matoucí dvojice, kde i/y mění celý význam slova:",
    examples: [
      "být (existovat, žít) × bít (udeřit, tlouct)",
      "mýtit (kácet les – vyjmenované po M) × mít (vlastnit – NENÍ vyjmenované)",
      "pýcha (namyšlenost – vyjmenované po P) × píchat (bodat – NENÍ vyjmenované)",
      "výr (druh sovy – vyjmenované po V) × vír (vodní vír – NENÍ vyjmenované)",
    ],
  },
  {
    title: "2. Psaní ú/ů",
    rule: [
      "Ú se píše na začátku slova (úkol, úterý, únava) a v citoslovcích (úúú).",
      "Ů se píše uvnitř slova, nikdy na jeho úplném začátku (dům, stůl, kůň, růže, vůz).",
      "U přejatých (cizích) slov se uprostřed slova výjimečně objevuje i ú, ne jen ů.",
    ],
    trap:
      "Nejčastější chyba je napsat na začátku slova ů místo ú, nebo naopak uprostřed běžného českého slova napsat ú místo ů.",
    examples: [
      "úkol, úterý, únor (na začátku slova → ú)",
      "dům, stůl, kůň (uprostřed domácího slova → ů)",
      "manikúra, pedikúra, múza, kúra (přejatá slova, ú i uprostřed slova)",
      "vzhůru, dohůry (ustálené výjimky s ů, i když nejsou na úplném začátku slova – je třeba si je zapamatovat)",
    ],
  },
  {
    title: "3. Psaní s-/z-/vz- na začátku slov",
    rule: [
      "Předpona s- se obvykle pojí se slovesy vyjadřujícími pohyb dolů, pryč nebo spojení dohromady (sejít, sebrat, shodit, spojit, srazit).",
      "Předpona z- se obvykle pojí se slovesy vyjadřujícími změnu stavu, výsledek nebo zánik (zesílit, zchudnout, zbořit, zemřít, zkazit).",
      "Předpona vz- vyjadřuje pohyb vzhůru nebo náhlý začátek děje (vzlétnout, vzplanout, vzpomenout, vzniknout).",
    ],
    trap:
      "Toto pravidlo o významu je jen pomocné vodítko – u řady slov se dnes rozdíl ve významu už úplně nepozná a spisovný tvar je nutné znát nazpaměť.",
    examples: [
      "shodit (dolů, s-) × zhodit (nespisovně, chybně)",
      "zchudnout (změna stavu, z-) × schudnout (chybně)",
      "vzlétnout (vzhůru, vz-) × zlétnout (chybně)",
      "zbořit (změna stavu – budova se zbořila, z-) × sbořit (chybně)",
    ],
  },
  {
    title: "4. Mě/mně",
    rule: [
      "U osobního zájmena já rozlišujeme dva tvary podle pádové otázky: mě (2. a 4. pád – koho, čeho? / koho, co?) a mně (3. a 6. pád – komu, čemu? / o kom, o čem?).",
      "V mnoha úplně jiných slovech se mě objevuje jako součást kořene nebo přípony – jde o obecné pravidlo psaní ě po retnicích b, p, v, f, m (běžný, pěkný, věda, měkký). Tato slova NEJSOU tvar zájmena já a nikdy se v nich nepíše mně.",
    ],
    trap:
      "Studenti si mě/mně u zájmena já často pletou i tam, kde jde o úplně jiné slovo, které s pádovou otázkou vůbec nesouvisí – např. u příslovcí a přídavných jmen odvozených od jiných slov.",
    examples: [
      "Bez mě to nepůjde. (2. pád – bez koho?) × Řekni mně, jak se máš. (3. pád – komu?)",
      "Vidíš mě? (4. pád – vidíš koho?) × Mluvili o mně. (6. pád – o kom?)",
      "rozumně, tamější, město, měkký, změna – vždy jen mě, nikdy mně, protože nejde o tvar zájmena já.",
    ],
  },
  {
    title: "5. Velká a malá písmena",
    rule: [
      "Obecná podstatná jména (druhová označení) píšeme s malým písmenem: město, řeka, hora, ulice, škola, svátek.",
      "Vlastní jména konkrétních, jedinečných objektů píšeme s velkým písmenem: Praha, Vltava, Sněžka.",
      "U víceslovných vlastních jmen (památky, instituce, ulice, svátky) píšeme velké písmeno zpravidla jen u prvního slova, pokud další slovo samo o sobě není vlastním jménem: Pražský hrad, Národní muzeum, Karlův most, Václavské náměstí, Štědrý den.",
      "Přídavná jména přivlastňovací odvozená od osobních jmen (Novákův, Petrův) píšeme vždy s velkým písmenem.",
      "Přídavná jména odvozená od zeměpisných názvů v běžném, nepřivlastňovacím užití píšeme s malým písmenem: český jazyk, pražské ulice, slovenská hudba.",
    ],
    trap:
      "Nejčastější chybou je psát velké písmeno u všech slov víceslovného názvu (Pražský Hrad, Karlův Most), nebo naopak malé písmeno u přídavného jména, které je součástí oficiálního názvu státu.",
    examples: [
      "Pražský hrad (NE Pražský Hrad), Karlův most (NE Karlův Most)",
      "Česká republika (oficiální název státu – obě slova velká) × český jazyk, česká vlajka (běžné užití – malé písmeno)",
      "Novákův dům, Petrovy knihy (přivlastňovací přídavné jméno od osobního jména – vždy velké)",
    ],
  },
  {
    title: "6. Shoda přísudku s podmětem",
    rule: [
      "Rod mužský životný (mn. č.) → koncovka -i: Chlapci přišli.",
      "Rod mužský neživotný → koncovka -y: Stromy rostly. Dny ubíhaly.",
      "Rod ženský → koncovka -y: Ženy zpívaly.",
      "Rod střední → koncovka -a: Města rostla. Děvčátka si hrála.",
      "Podmět smíšeného rodu s alespoň jedním jménem mužského rodu životného → -i: Chlapci a dívky zpívali.",
      "Podmět smíšeného rodu BEZ mužského životného, ale s jiným rodem než středním → -y: Auta a tramvaje jezdily.",
    ],
    trap:
      "Zvláštní pozor dej na podstatná jména, kde gramatický rod neodpovídá očekávání podle významu: děvčátka, koťata a další slova na -ata jsou rodu STŘEDNÍHO (i když jde o živé bytosti), a slovo rodiče je naopak mužského ŽIVOTNÉHO rodu, přestože zahrnuje i matku.",
    examples: [
      "Děvčátka si hrála na zahradě. (NE hráli – rod střední, koncovka -a)",
      "Koťata spala celý den. (NE spali – rod střední)",
      "Rodiče přijeli pozdě večer. (NE přijely – rod mužský životný)",
      "Dny ubíhaly rychle. (NE ubíhali – rod mužský neživotný, koncovka -y)",
    ],
  },
  {
    title: "7. Koncovky přídavných a podstatných jmen",
    rule: [
      "Přídavné jméno se s podstatným jménem shoduje v rodě, čísle a pádě – v 1. pádě množného čísla se shoda projevuje stejně jako u přísudku: mužský životný -í, ženský a mužský neživotný -é, střední -á.",
      "U komparativu (2. stupně) přídavných jmen volíme zjednodušeně příponu -ejší po tvrdých a obojetných souhláskách a -ější po měkkých souhláskách; řada slov se navíc stupňuje zcela nepravidelně.",
      "V 7. pádě množného čísla podstatných jmen píšeme spisovně koncovku -y/-mi (kluky, dětmi, chlapci), ne hovorové -ma (klukama, dětma).",
    ],
    trap:
      "Snadno se popletou tvary jako „mladí“ vs. „mladé“ vs. „mladá“ podle rodu podstatného jména, a hovorové koncovky (-ma) se v psaném projevu často vplíží místo spisovných (-mi).",
    examples: [
      "mladí kluci (mužský životný, -í) × mladé dívky (ženský, -é) × mladá koťata (střední, -á)",
      "hezčí (nepravidelné stupňování od hezký) × chytřejší (-ejší po tvrdé souhlásce) × moudřejší (-ější po měkké souhlásce)",
      "s dětmi, s kluky (spisovně) × s dětma, s klukama (hovorově, do psaného projevu nepatří)",
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

// Renders question text, turning a trailing "_" fill-in-the-blank marker
// into a small underline slot.
function QuestionText({ text }) {
  const parts = text.split("_");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="inline-block w-8 border-b-2 border-zinc-400 -translate-y-0.5 mx-0.5" />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function QuizPrototype() {
  // ---- Auth & onboarding gate ----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFlow, setAuthFlow] = useState(null); // null | "auth" | "onboarding-nickname" | "onboarding-notifications"
  const [authMode, setAuthMode] = useState("register"); // "register" | "login"
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationJustConfirmed, setNotificationJustConfirmed] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (authFlow !== null) {
      setOverlayVisible(false);
      const t = setTimeout(() => setOverlayVisible(true), 20);
      return () => clearTimeout(t);
    }
    setOverlayVisible(false);
  }, [authFlow]);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [soundHapticsEnabled, setSoundHapticsEnabled] = useState(true);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [restoreConfirmed, setRestoreConfirmed] = useState(false);

  useEffect(() => {
    if (showSettings) {
      setSettingsVisible(false);
      const t = setTimeout(() => setSettingsVisible(true), 20);
      return () => clearTimeout(t);
    }
    setSettingsVisible(false);
  }, [showSettings]);

  useEffect(() => {
    if (showPaywall) {
      setPaywallVisible(false);
      const t = setTimeout(() => setPaywallVisible(true), 20);
      return () => clearTimeout(t);
    }
    setPaywallVisible(false);
  }, [showPaywall]);

  useEffect(() => {
    if (showDeleteConfirm) {
      setDeleteConfirmVisible(false);
      const t = setTimeout(() => setDeleteConfirmVisible(true), 20);
      return () => clearTimeout(t);
    }
    setDeleteConfirmVisible(false);
  }, [showDeleteConfirm]);

  function openSettings() {
    setNicknameDraft(nickname);
    setIsEditingNickname(false);
    setShowSettings(true);
  }

  function closeSettings() {
    setShowSettings(false);
  }

  function startEditingNickname() {
    setNicknameDraft(nickname);
    setIsEditingNickname(true);
  }

  function saveNicknameDraft() {
    const trimmed = nicknameDraft.trim();
    if (trimmed) setNickname(trimmed);
    setIsEditingNickname(false);
  }

  async function toggleNotificationsInSettings() {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === "granted");
      } else {
        setNotificationsEnabled(false);
      }
    } catch (err) {
      setNotificationsEnabled(false);
    }
  }

  function openPaywall() {
    setShowPaywall(true);
  }

  function closePaywall() {
    setShowPaywall(false);
  }

  function handleUnlockPremium() {
    // No real payment provider is wired up in this environment — this
    // simulates a successful purchase for demo purposes only.
    setIsPremium(true);
    closePaywall();
  }

  function handleRestorePurchases() {
    setIsRestoringPurchases(true);
    setRestoreConfirmed(false);
    setTimeout(() => {
      setIsRestoringPurchases(false);
      setRestoreConfirmed(true);
      setTimeout(() => setRestoreConfirmed(false), 3500);
    }, 1400);
  }

  function openDeleteConfirm() {
    setShowDeleteConfirm(true);
  }

  function closeDeleteConfirm() {
    setShowDeleteConfirm(false);
  }

  function handleDeleteAccount() {
    closeDeleteConfirm();
    setShowSettings(false);
    setIsPremium(false);
    setUserEmail("");
    handleLogout();
  }

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    setAuthFlow("auth");
  }

  function closeAuth() {
    setAuthFlow(null);
  }

  function beginOnboarding() {
    setNicknameInput("");
    setAuthFlow("onboarding-nickname");
  }

  function handleSocialAuth(provider) {
    // No real backend is available in this environment — this simulates an
    // instant successful account creation via Apple/Google and always leads
    // into onboarding, since social sign-in effectively creates an account
    // on first use.
    setAuthError("");
    setUserEmail(provider === "apple" ? "ucet@icloud.com" : "ucet@gmail.com");
    beginOnboarding();
  }

  function handleEmailAuthSubmit() {
    const email = emailInput.trim();
    if (!email || !passwordInput) {
      setAuthError("Vyplň prosím e-mail i heslo.");
      return;
    }
    if (!email.includes("@")) {
      setAuthError("Zadej platnou e-mailovou adresu.");
      return;
    }
    setAuthError("");
    setUserEmail(email);
    if (authMode === "register") {
      beginOnboarding();
    } else {
      // Login: no real backend/persistence exists, so we derive a friendly
      // display name from the e-mail and skip onboarding entirely.
      setNickname(email.split("@")[0]);
      setAuthFlow(null);
      setIsAuthenticated(true);
    }
  }

  function handleNicknameSubmit() {
    const trimmed = nicknameInput.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    setAuthFlow("onboarding-notifications");
  }

  async function handleEnableNotifications() {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          try {
            new Notification("Notifikace aktivovány! 🚀", {
              body: `Ahoj ${nickname}, zítra v 17:00 dáme první procvičování.`,
            });
          } catch (err) {
            // Native notification may be blocked in a sandboxed context —
            // the in-app confirmation below still informs the user.
          }
        } else {
          setNotificationsEnabled(false);
        }
      } else {
        setNotificationsEnabled(false);
      }
    } catch (err) {
      setNotificationsEnabled(false);
    }
    setNotificationJustConfirmed(true);
  }

  function handleSkipNotifications() {
    setNotificationsEnabled(false);
    completeOnboarding();
  }

  function completeOnboarding() {
    setNotificationJustConfirmed(false);
    setAuthFlow(null);
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAuthFlow(null);
    setNickname("");
    setNicknameInput("");
    setEmailInput("");
    setPasswordInput("");
    setAuthError("");
    setNotificationsEnabled(false);
    setNotificationJustConfirmed(false);
    setScreen("dashboard");
    setCheatSheetCategory(null);
    setShowSettings(false);
    setUserEmail("");
    setIsPremium(false);
    setIsEditingNickname(false);
  }

  const [screen, setScreen] = useState("dashboard"); // dashboard | quiz | results | cheatsheet
  const [cheatSheetCategory, setCheatSheetCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]); // [{originalIndex, text}]
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timeRemainingSec, setTimeRemainingSec] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [streakCount, setStreakCount] = useState(0); // consecutive correct without a shield, 0-2
  const [hasShield, setHasShield] = useState(false); // active "second chance" shield
  const [shieldPulse, setShieldPulse] = useState(false); // transient activation glow
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState([]); // wrong picks absorbed by the shield this question
  const [shieldUsedThisQuestion, setShieldUsedThisQuestion] = useState(false); // blocks the eventual correct answer from earning a star

  const availableCategories = TOPIC_AREAS;

  const categoryCount = (cat) =>
    questionsData.filter((q) => q.category === cat).length;

  // Countdown for the full timed mock exam only. Hits 0 → auto-submit.
  useEffect(() => {
    if (screen !== "quiz" || !isTimedMode || timeRemainingSec === null) return;
    if (timeRemainingSec <= 0) {
      setTimeExpired(true);
      setScreen("results");
      return;
    }
    const id = setTimeout(() => {
      setTimeRemainingSec((t) => (t !== null ? t - 1 : t));
    }, 1000);
    return () => clearTimeout(id);
  }, [screen, isTimedMode, timeRemainingSec]);

  function prepareQuestion(question) {
    const opts = question.options.map((text, originalIndex) => ({
      originalIndex,
      text,
    }));
    setShuffledOptions(shuffle(opts));
    setSelectedOptionId(null);
    setIsAnswerEvaluated(false);
    setShowHint(false);
    setEliminatedOptionIds([]);
    setShieldUsedThisQuestion(false);
  }

  function startQuiz(category) {
    const pool = category
      ? questionsData.filter((q) => q.category === category)
      : questionsData;
    if (pool.length === 0) return; // topic has no questions yet
    setSelectedCategory(category);
    const drawnQs = drawQuestions(pool, QUIZ_LENGTH);
    setFilteredQuestions(drawnQs);
    setScore(0);
    setConsecutiveWrong(0);
    setCurrentIndex(0);
    setIsTimedMode(false);
    setTimeRemainingSec(null);
    setAnsweredCount(0);
    setTimeExpired(false);
    setStreakCount(0);
    setHasShield(false);
    setShieldPulse(false);
    prepareQuestion(drawnQs[0]);
    setScreen("quiz");
  }

  function startFullTest() {
    const drawnQs = drawQuestions(questionsData, FULL_TEST_LENGTH);
    setSelectedCategory(null);
    setFilteredQuestions(drawnQs);
    setScore(0);
    setConsecutiveWrong(0);
    setCurrentIndex(0);
    setAnsweredCount(0);
    setTimeExpired(false);
    setStreakCount(0);
    setHasShield(false);
    setShieldPulse(false);
    prepareQuestion(drawnQs[0]);
    setIsTimedMode(true);
    setTimeRemainingSec(FULL_TEST_MINUTES * 60);
    setScreen("quiz");
  }

  function selectOption(originalIndex) {
    if (isAnswerEvaluated) return;
    if (eliminatedOptionIds.includes(originalIndex)) return; // already ruled out this attempt
    const isCorrect =
      originalIndex === filteredQuestions[currentIndex].correctAnswerIndex;

    if (!isCorrect && hasShield) {
      // Shield absorbs the mistake: consume it, reveal the hint, mark this
      // option as ruled out, but let the player try again on the SAME
      // question — this does not finalize the answer or touch score. The
      // streak is explicitly zeroed, and this question is flagged so its
      // eventual correct answer won't start a new streak either.
      setHasShield(false);
      setStreakCount(0);
      setShieldUsedThisQuestion(true);
      setEliminatedOptionIds((prev) => [...prev, originalIndex]);
      setShowHint(true);
      return;
    }

    setSelectedOptionId(originalIndex);
    setIsAnswerEvaluated(true);
    setAnsweredCount((c) => c + 1);

    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = showHint ? 1 : 2;
      setConsecutiveWrong(0);
      if (!hasShield && !shieldUsedThisQuestion) {
        const newStreak = streakCount + 1;
        if (newStreak >= 3) {
          setHasShield(true);
          setStreakCount(0);
          setShieldPulse(true);
          setTimeout(() => setShieldPulse(false), 700);
        } else {
          setStreakCount(newStreak);
        }
      }
    } else {
      // Unprotected mistake: normal penalty logic, and the star streak resets.
      const newWrongStreak = consecutiveWrong + 1;
      if (newWrongStreak >= 2) {
        pointsEarned = -1; // penalty: two wrong answers in a row
      }
      setConsecutiveWrong(newWrongStreak);
      setStreakCount(0);
    }

    setLastPointsEarned(pointsEarned);
    setScore((s) => s + pointsEarned);
  }

  function nextQuestion() {
    if (currentIndex < filteredQuestions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      prepareQuestion(filteredQuestions[next]);
    } else {
      setScreen("results");
    }
  }

  function returnToDashboard() {
    setScreen("dashboard");
    setSelectedCategory(null);
    setIsTimedMode(false);
    setTimeRemainingSec(null);
  }

  function openCheatSheet(category) {
    setCheatSheetCategory(category);
    setScreen("cheatsheet");
  }

  function closeCheatSheet() {
    setCheatSheetCategory(null);
    setScreen("dashboard");
  }

  function getOptionState(originalIndex) {
    if (eliminatedOptionIds.includes(originalIndex)) return "wrong";
    if (!isAnswerEvaluated) return null;
    const correctIndex = filteredQuestions[currentIndex].correctAnswerIndex;
    if (originalIndex === correctIndex) return "correct";
    if (originalIndex === selectedOptionId) return "wrong";
    return null;
  }

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div
      className="min-h-screen w-full flex justify-center relative p-6 font-sans text-zinc-900 overflow-hidden"
      style={COSMIC_BG_STYLE}
    >
      <div
        className={`w-full max-w-md overflow-hidden flex flex-col relative rounded-3xl border ${
          isAuthenticated
            ? "bg-white bg-opacity-80 backdrop-blur-xl border-white border-opacity-60"
            : "backdrop-blur-xl"
        }`}
        style={
          isAuthenticated
            ? { boxShadow: "0 25px 60px -15px rgba(59, 130, 246, 0.15)" }
            : COSMIC_GLASS_CARD_STYLE
        }
      >
        {!isAuthenticated && (
          <div
            className="flex-1 flex flex-col p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('data:image/jpeg;base64,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')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Jemné ztmavení dole, ať zůstane text nad patou obrazovky čitelný */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none z-0"
              style={{ background: "linear-gradient(to top, rgba(8, 11, 26, 0.55), rgba(8, 11, 26, 0))" }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center text-center pt-52">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-3 border"
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                  color: "#67e8f9",
                  borderColor: "rgba(6, 182, 212, 0.3)",
                }}
              >
                Příprava na SŠ 2027
              </span>

              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-extrabold text-white leading-snug">
                  Tvůj parťák na přijímačky
                </h1>
                <span className="text-2xl" aria-hidden="true">🚀</span>
              </div>
              <p className="text-sm text-indigo-200 text-opacity-80 leading-relaxed">
                Trénuj češtinu, získávej vědomosti, dostaň se na vysněnou školu.
              </p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center gap-2.5 py-6">
              <div
                className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                style={COSMIC_TILE_STYLE}
              >
                <GearCompassBadge tintClassName="from-amber-400 to-orange-500" glowColor="rgba(251, 191, 36, 0.45)">
                  <IconZap className="w-4 h-4 text-white" />
                </GearCompassBadge>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-100">Krátké 5minutové kvízy</p>
                  <p className="text-xs text-indigo-200 text-opacity-70">Trénuj mozek kdekoli a kdykoli.</p>
                </div>
                <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
              </div>
              <div
                className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                style={COSMIC_TILE_STYLE}
>
                <GearCompassBadge tintClassName="from-rose-500 to-red-500" glowColor="rgba(244, 63, 94, 0.45)">
                  <IconFire className="w-4 h-4 text-white" />
                </GearCompassBadge>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-100">Testy nanečisto</p>
                  <p className="text-xs text-indigo-200 text-opacity-70">Odhal chytáky přijímacích zkoušek.</p>
                </div>
                <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
              </div>
              <div
                className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                style={COSMIC_TILE_STYLE}
              >
                <GearCompassBadge tintClassName="from-blue-500 to-violet-500" glowColor="rgba(129, 140, 248, 0.45)">
                  <IconBooksStack className="w-4 h-4 text-white" />
                </GearCompassBadge>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-100">Praktické taháky a triky</p>
                  <p className="text-xs text-indigo-200 text-opacity-70">Nauč se super triky a ušetři čas.</p>
                </div>
                <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 pb-2">
              <button
                onClick={() => openAuth("register")}
                className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:opacity-90 text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95 border"
                style={{
                  boxShadow: "0 0 24px 2px rgba(34, 211, 238, 0.35), 0 10px 25px -5px rgba(99, 102, 241, 0.5)",
                  borderColor: "rgba(34, 211, 238, 0.5)",
                }}
              >
                ZAČÍT HNED 🚀
              </button>
              <button
                onClick={() => openAuth("login")}
                className="text-xs font-medium text-indigo-300 hover:text-indigo-100 transition-colors"
              >
                Již máš účet? Přihlásit se
              </button>

              {/* Subtilní metalický bezel dole */}
              <div
                className="w-24 h-1 rounded-full mt-2"
                style={{ background: "linear-gradient(to right, #475569, #94a3b8, #475569)", opacity: 0.5 }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {isAuthenticated && (
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {screen === "dashboard" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
                    <IconLogo className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-zinc-900">Trénink</p>
                    <p className="text-xs text-zinc-500 -mt-0.5">na přijímačky</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-full px-3 py-1.5 truncate"
                    style={{ maxWidth: "7rem" }}
                  >
                    {nickname || "Žák"}
                  </span>
                  <button
                    onClick={openSettings}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                    aria-label="Nastavení"
                  >
                    <IconSettings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-red-600 hover:border-red-200 transition-colors"
                    aria-label="Odhlásit se"
                  >
                    <IconLogout className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-xl font-semibold text-zinc-900 leading-snug mb-1">
                Připrav se na jednotnou přijímací zkoušku pro 4leté obory
              </h1>
              <p className="text-sm text-zinc-500 mb-6">Český jazyk a literatura · 2026</p>

              <button
                onClick={startFullTest}
                className="w-full text-left bg-slate-100 hover:bg-slate-200 hover:bg-opacity-70 border border-slate-200 rounded-2xl p-5 mb-7 transition-colors active:scale-95"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-zinc-900 text-base font-semibold mb-1">Zkus si test nanečisto</p>
                    <p className="text-zinc-500 text-xs font-medium tracking-wide">
                      {FULL_TEST_LENGTH} úloh · {FULL_TEST_MINUTES} minut · {FULL_TEST_LENGTH * 2} bodů
                    </p>
                  </div>
                  <IconClock className="w-6 h-6 text-zinc-400 flex-shrink-0" />
                </div>
                <span className="inline-flex items-center justify-center bg-blue-600 text-white text-sm font-semibold px-7 py-2.5 rounded-full">
                  Start
                </span>
              </button>

              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                Trénink tematických okruhů
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {availableCategories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const Icon = meta.icon;
                  const isEmpty = categoryCount(cat) === 0;
                  return (
                    <div
                      key={cat}
                      className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${meta.badgeBg} ${meta.badgeText} flex items-center justify-center mb-3`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 leading-tight mb-1">
                        {cat}
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                        {isEmpty ? (
                          "Připravujeme"
                        ) : (
                          <>
                            {QUIZ_LENGTH} náhodných otázek
                            <br />
                            Max. {QUIZ_LENGTH * 2} bodů
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => startQuiz(cat)}
                        disabled={isEmpty}
                        className={`mt-auto w-full text-xs font-semibold border rounded-full py-2.5 transition-colors active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-default ${meta.btn}`}
                      >
                        Procvičovat
                      </button>
                      {CHEAT_SHEETS[cat] && (
                        <button
                          onClick={() => openCheatSheet(cat)}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold border rounded-full py-2.5 transition-colors active:scale-95 text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                        >
                          <IconBookOpen className="w-3.5 h-3.5" />
                          Tahák
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-zinc-400 text-center leading-relaxed">
                Za správnou odpověď bez nápovědy získáváš 2 body, s nápovědou 1 bod.
              </p>
            </>
          )}

          {screen === "quiz" && currentQuestion && (
            <>
              <div className="flex items-center justify-between mb-2.5">
                <button
                  onClick={returnToDashboard}
                  aria-label="Zavřít test"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  {currentQuestion.category}
                </span>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {currentIndex + 1} z {filteredQuestions.length}
                </span>
              </div>

              <div className="flex items-center justify-center mb-4">
                {!hasShield ? (
                  <div className="flex items-center gap-1.5" aria-label={`Streak: ${streakCount} ze 3`}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`text-base leading-none transition-transform ${
                          i < streakCount ? "scale-110" : "opacity-30"
                        }`}
                        aria-hidden="true"
                      >
                        {i < streakCount ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 transition-transform duration-300 ${
                      shieldPulse ? "scale-110" : "scale-100"
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      🛡️
                    </span>
                    <span className="text-xs font-semibold text-blue-700">Štít aktivní</span>
                  </div>
                )}
              </div>

              {eliminatedOptionIds.length > 0 && !isAnswerEvaluated && (
                <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 mb-4 text-sm font-semibold bg-blue-50 border border-blue-200 text-blue-700 animate-bounce motion-reduce:animate-none">
                  🛡️ Štít tě zachránil! Zkus to znovu.
                </div>
              )}

              {isTimedMode && timeRemainingSec !== null && (
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 mb-4 text-sm font-semibold border ${
                    timeRemainingSec <= 300
                      ? "bg-red-50 border-red-200 text-red-600 animate-pulse motion-reduce:animate-none"
                      : "bg-zinc-100 border-zinc-200 text-zinc-700"
                  }`}
                >
                  <IconClock className="w-4 h-4" />
                  Zbývá čas: {formatTime(timeRemainingSec)}
                </div>
              )}

              <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentIndex / filteredQuestions.length) * 100}%` }}
                />
              </div>

              {currentQuestion.workingText && (
                <div className="bg-white border border-zinc-200 rounded-xl p-3.5 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
                    Výchozí text
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.workingText}
                  </p>
                </div>
              )}

              <p className="text-lg font-semibold text-zinc-900 leading-snug mb-4">
                <QuestionText text={currentQuestion.text} />
              </p>

              {!showHint && (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs font-medium text-zinc-400 underline decoration-dashed underline-offset-2 hover:text-blue-600 transition-colors mb-4 self-start"
                >
                  💡 Potřebuješ nápovědu?
                </button>
              )}

              {showHint && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
                  <p className="text-sm text-amber-800 italic leading-relaxed">
                    {currentQuestion.hint}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {shuffledOptions.map((opt, i) => {
                  const isCorrectOpt = opt.originalIndex === currentQuestion.correctAnswerIndex;
                  const isSelected = opt.originalIndex === selectedOptionId;
                  const isEliminated = eliminatedOptionIds.includes(opt.originalIndex);
                  const dim = isAnswerEvaluated && !isSelected && !isCorrectOpt;
                  const state = getOptionState(opt.originalIndex);
                  const isDisabled = isAnswerEvaluated || isEliminated;

                  return (
                    <button
                      key={opt.originalIndex}
                      disabled={isDisabled}
                      onClick={() => selectOption(opt.originalIndex)}
                      className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-all ${
                        state === "correct"
                          ? "bg-green-50 border-green-300"
                          : state === "wrong"
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-zinc-200 hover:border-zinc-300 active:scale-95"
                      } ${dim ? "opacity-40" : ""} ${
                        isDisabled ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          state === "correct"
                            ? "border-green-400 text-green-700"
                            : state === "wrong"
                            ? "border-red-400 text-red-700"
                            : "border-zinc-300 text-zinc-600"
                        }`}
                      >
                        {LETTERS[i]}
                      </span>
                      <span className="text-sm text-zinc-800 flex-1">{opt.text}</span>
                      {state === "correct" && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {state === "wrong" && (
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerEvaluated && (
                <div
                  className={`rounded-xl border p-4 mt-4 ${
                    selectedOptionId === currentQuestion.correctAnswerIndex
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <p
                      className={`text-base font-semibold ${
                        selectedOptionId === currentQuestion.correctAnswerIndex
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedOptionId === currentQuestion.correctAnswerIndex ? "Správně!" : "Chyba."}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        lastPointsEarned > 0
                          ? "bg-green-100 text-green-700"
                          : lastPointsEarned < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {lastPointsEarned > 0 ? `+${lastPointsEarned}` : lastPointsEarned}{" "}
                      {Math.abs(lastPointsEarned) === 1
                        ? "bod"
                        : Math.abs(lastPointsEarned) === 2
                        ? "body"
                        : "bodů"}
                    </span>
                  </div>
                  {lastPointsEarned === 1 && (
                    <p className="text-xs italic text-zinc-500 mb-2">
                      Použil(a) jsi nápovědu, proto jen 1 bod.
                    </p>
                  )}
                  {lastPointsEarned === -1 && (
                    <p className="text-xs italic text-zinc-500 mb-2">
                      Penalizace: dvě špatné odpovědi za sebou.
                    </p>
                  )}
                  <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                    {currentQuestion.explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                  >
                    {currentIndex < filteredQuestions.length - 1 ? "Další otázka" : "Dokončit test"}
                  </button>
                </div>
              )}
            </>
          )}

          {screen === "results" && (() => {
            const maxScore = filteredQuestions.length * 2;
            const rawPercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
            const percentage = Math.max(0, Math.min(100, rawPercentage));
            const tier = getResultTier(percentage);

            return (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-6">
                <h2 className="text-xl font-semibold text-zinc-900">Konec testu</h2>

                {tier.emoji ? (
                  <div>
                    <span className="text-5xl leading-none">{tier.emoji}</span>
                    <p className={`text-base font-semibold mt-2 ${tier.tone}`}>{tier.label}</p>
                  </div>
                ) : (
                  <p className={`text-sm italic max-w-xs leading-relaxed ${tier.tone}`}>
                    {tier.label}
                  </p>
                )}

                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${
                    percentage >= 70 ? "border-green-500" : "border-red-400"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    úspěšnost
                  </p>
                  <p className="text-2xl font-bold text-zinc-900">{Math.round(percentage)}%</p>
                </div>

                <p className="text-xs text-zinc-500">
                  {score} z max. {maxScore} bodů ({filteredQuestions.length} otázek × 2 body)
                </p>

                {timeExpired && answeredCount < filteredQuestions.length && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xs leading-relaxed">
                    ⏰ Čas vypršel – {filteredQuestions.length - answeredCount}{" "}
                    {filteredQuestions.length - answeredCount === 1
                      ? "otázka zůstala nezodpovězena"
                      : "otázek zůstalo nezodpovězeno"}{" "}
                    a byla započítána za 0 bodů.
                  </p>
                )}

                <div className="w-full flex flex-col gap-2.5 mt-1">
                  <button
                    onClick={() => (isTimedMode ? startFullTest() : startQuiz(selectedCategory))}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                  >
                    Opakovat stejný test
                  </button>
                  <button
                    onClick={returnToDashboard}
                    className="w-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                  >
                    Zpět na výběr kategorií
                  </button>
                </div>
              </div>
            );
          })()}

          {screen === "cheatsheet" && cheatSheetCategory && CHEAT_SHEETS[cheatSheetCategory] && (
            <>
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={closeCheatSheet}
                  aria-label="Zavřít tahák"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Tahák · {cheatSheetCategory}
                </span>
                <span className="w-8" aria-hidden="true" />
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-5 pb-2">
                {CHEAT_SHEETS[cheatSheetCategory].map((section, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-200 p-4"
                  >
                    <h3 className="text-sm font-bold text-zinc-900 mb-2.5">{section.title}</h3>

                    {section.links ? (
                      <div className="flex flex-col gap-2">
                        {section.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl p-3 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-zinc-900 mb-0.5">
                                {link.title}
                              </p>
                              <p className="text-xs text-zinc-500 leading-relaxed">
                                {link.description}
                              </p>
                            </div>
                            <IconExternalLink className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <>
                        <ul className="flex flex-col gap-1.5 mb-3">
                          {section.rule.map((line, i) => (
                            <li key={i} className="text-xs text-zinc-700 leading-relaxed flex gap-2">
                              <span className="text-zinc-300 flex-shrink-0">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>

                        {section.tip && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                            <p className="text-xs font-semibold text-blue-800 mb-1">💡 Tip</p>
                            <p className="text-xs text-blue-800 leading-relaxed">{section.tip}</p>
                          </div>
                        )}

                        {section.trap && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                            <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Chyták</p>
                            <p className="text-xs text-amber-800 leading-relaxed">{section.trap}</p>
                          </div>
                        )}

                        {section.examples && section.examples.length > 0 && (
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                              Příklady
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {section.examples.map((ex, i) => (
                                <li key={i} className="text-xs text-zinc-700 leading-relaxed font-mono">
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => startQuiz(cheatSheetCategory)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  Vyzkoušet v praxi 🚀
                </button>
              </div>
            </>
          )}
        </div>
        )}

        {authFlow === "auth" && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                overlayVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeAuth}
            />
            <div
              className={`relative w-full backdrop-blur-xl border rounded-t-3xl sm:rounded-3xl p-6 transition-all duration-300 ${
                overlayVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('data:image/jpeg;base64,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')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
              }}
            >
              <button
                onClick={closeAuth}
                aria-label="Zavřít"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-bold text-white mb-1">
                {authMode === "register" ? "Vytvoř si účet" : "Vítej zpátky"}
              </h2>
              <p className="text-xs text-indigo-200 text-opacity-70 mb-5">
                {authMode === "register"
                  ? "Začni trénovat během chvilky."
                  : "Přihlas se a pokračuj v tréninku."}
              </p>

              <div className="flex flex-col gap-2.5 mb-5">
                <button
                  onClick={() => handleSocialAuth("apple")}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 border border-white border-opacity-10"
                >
                  <IconApple className="w-4 h-4" />
                  Pokračovat přes Apple
                </button>
                <button
                  onClick={() => handleSocialAuth("google")}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-700 font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <IconGoogle className="w-4 h-4" />
                  Pokračovat přes Google
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <span className="flex-1 h-px bg-white bg-opacity-10" />
                <span className="text-xs text-indigo-300 text-opacity-70 whitespace-nowrap">
                  nebo e-mailem
                </span>
                <span className="flex-1 h-px bg-white bg-opacity-10" />
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEmailAuthSubmit();
                  }}
                  placeholder="E-mail"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 border focus:outline-none focus:border-indigo-400 transition-colors"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEmailAuthSubmit();
                  }}
                  placeholder="Heslo"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 border focus:outline-none focus:border-indigo-400 transition-colors"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                />
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <button
                  onClick={handleEmailAuthSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 mt-1"
                  style={COSMIC_BUTTON_SHADOW}
                >
                  {authMode === "register" ? "Vytvořit účet" : "Přihlásit"}
                </button>
              </div>

              <button
                onClick={() => {
                  setAuthMode(authMode === "register" ? "login" : "register");
                  setAuthError("");
                }}
                className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white mt-4 transition-colors"
              >
                {authMode === "register" ? "Už máš účet? Přihlásit se" : "Nemáš účet? Zaregistrovat se"}
              </button>
            </div>
          </div>
        )}

        {(authFlow === "onboarding-nickname" || authFlow === "onboarding-notifications") && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                overlayVisible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`relative w-full backdrop-blur-xl border rounded-t-3xl sm:rounded-3xl p-6 transition-all duration-300 ${
                overlayVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('data:image/jpeg;base64,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')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    authFlow === "onboarding-nickname"
                      ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "w-1.5 bg-white bg-opacity-20"
                  }`}
                />
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    authFlow === "onboarding-notifications"
                      ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "w-1.5 bg-white bg-opacity-20"
                  }`}
                />
              </div>

              {authFlow === "onboarding-nickname" && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Jak ti máme říkat? 👋
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Tvoji přezdívku budeme používat při fandění a v žebříčcích.
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      autoFocus
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNicknameSubmit();
                      }}
                      placeholder="Tvoje přezdívka"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 text-center border focus:outline-none focus:border-indigo-400 transition-colors"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                    />
                    <button
                      onClick={handleNicknameSubmit}
                      disabled={!nicknameInput.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                      style={COSMIC_BUTTON_SHADOW}
                    >
                      Pokračovat ➔
                    </button>
                  </div>
                </>
              )}

              {authFlow === "onboarding-notifications" && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Nenech si pláchnout streak! 🎯
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Povol upozornění. Připomeneme ti denní opakování a týdenní test, abys neztratil/a
                    vědomosti.
                  </p>

                  {!notificationJustConfirmed ? (
                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={handleEnableNotifications}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                        style={COSMIC_BUTTON_SHADOW}
                      >
                        <IconBell className="w-4 h-4" />
                        Zapnout připomínky 🔔
                      </button>
                      <button
                        onClick={handleSkipNotifications}
                        className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white py-2 transition-colors"
                      >
                        Přeskočit zatím bez notifikací
                      </button>
                      <button
                        onClick={() => setAuthFlow("onboarding-nickname")}
                        className="w-full text-center text-xs font-medium text-indigo-400 text-opacity-60 hover:text-indigo-200 transition-colors"
                      >
                        ← Zpět
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {notificationsEnabled ? (
                        <div className="flex items-start gap-2.5 bg-emerald-500 bg-opacity-10 border border-emerald-400 border-opacity-30 rounded-xl p-3.5">
                          <IconCheckBadge className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-emerald-300 leading-relaxed">
                            Notifikace aktivovány! 🚀 Ahoj {nickname}, zítra v 17:00 dáme první
                            procvičování.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-3.5">
                          <IconBell className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-indigo-200 text-opacity-80 leading-relaxed">
                            Notifikace se nepodařilo povolit (možná je blokuje prohlížeč). Nastavení
                            můžeš kdykoli změnit později — teď pokračujme dál!
                          </p>
                        </div>
                      )}
                      <button
                        onClick={completeOnboarding}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                        style={COSMIC_BUTTON_SHADOW}
                      >
                        Pokračovat do aplikace
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {showSettings && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-50 transition-opacity duration-300 ${
                settingsVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSettings}
            />
            <div
              className={`relative w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-300 flex flex-col ${
                settingsVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ maxHeight: "88%" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
                <span className="w-14" aria-hidden="true" />
                <h2 className="text-base font-bold text-zinc-900">Nastavení</h2>
                <button
                  onClick={closeSettings}
                  className="w-14 text-right text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Hotovo
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {/* BLOK 1: Profil & účet */}
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl border border-zinc-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {(nickname || "Ž").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">
                        {nickname || "Žák"}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {userEmail || "bez e-mailu"}
                      </p>
                    </div>
                  </div>

                  {!isEditingNickname ? (
                    <button
                      onClick={startEditingNickname}
                      className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-zinc-900 py-2.5 border-t border-zinc-100 transition-colors"
                    >
                      Upravit přezdívku
                      <IconChevronRight className="w-4 h-4 text-zinc-400" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 pt-2.5 border-t border-zinc-100">
                      <input
                        type="text"
                        autoFocus
                        value={nicknameDraft}
                        onChange={(e) => setNicknameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveNicknameDraft();
                        }}
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      <button
                        onClick={saveNicknameDraft}
                        disabled={!nicknameDraft.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                      >
                        Uložit
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-red-600 py-2.5 border-t border-zinc-100 transition-colors"
                  >
                    Odhlásit se
                    <IconLogout className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>

                {/* BLOK 2: Předplatné & platby */}
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl border border-zinc-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                      Předplatné
                    </p>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isPremium
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {isPremium ? "PREMIUM 🚀" : "Verze ZDARMA"}
                    </span>
                  </div>

                  {!isPremium && (
                    <button
                      onClick={openPaywall}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 mb-2.5"
                    >
                      Odemknout PREMIUM verzi ✨
                    </button>
                  )}

                  <button
                    onClick={handleRestorePurchases}
                    disabled={isRestoringPurchases}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 py-2.5 border border-zinc-200 rounded-xl transition-colors disabled:opacity-60"
                  >
                    <IconRestore className={`w-4 h-4 ${isRestoringPurchases ? "animate-spin" : ""}`} />
                    {isRestoringPurchases ? "Obnovuji…" : "Obnovit nákupy"}
                  </button>

                  {restoreConfirmed && (
                    <p className="text-xs text-emerald-600 font-medium mt-2.5 text-center">
                      Tvá předplatná byla úspěšně obnovena! ✅
                    </p>
                  )}
                </div>

                {/* BLOK 3: Preference & notifikace */}
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl border border-zinc-200 p-4 shadow-sm flex flex-col gap-3">
                  <button onClick={toggleNotificationsInSettings} className="w-full flex items-center gap-3">
                    <span className="flex-1 text-left text-sm font-medium text-zinc-800">
                      Denní připomínky procvičování
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                        notificationsEnabled ? "bg-blue-600 justify-end" : "bg-zinc-300 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </button>
                  <div className="h-px bg-zinc-100" />
                  <button
                    onClick={() => setSoundHapticsEnabled((v) => !v)}
                    className="w-full flex items-center gap-3"
                  >
                    <span className="flex-1 text-left text-sm font-medium text-zinc-800">
                      Zvuky a haptická odezva
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                        soundHapticsEnabled ? "bg-blue-600 justify-end" : "bg-zinc-300 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </button>
                </div>

                {/* BLOK 4: Podpora & právo */}
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl border border-zinc-200 p-4 shadow-sm flex flex-col">
                  <a
                    href="mailto:podpora@appka.cz"
                    className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-zinc-900 py-2.5 transition-colors"
                  >
                    Nápověda a podpora
                    <IconChevronRight className="w-4 h-4 text-zinc-400" />
                  </a>
                  <div className="h-px bg-zinc-100" />
                  <div className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 py-2.5">
                    Ochrana osobních údajů
                    <IconChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="h-px bg-zinc-100" />
                  <div className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 py-2.5">
                    Podmínky použití
                    <IconChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                {/* BLOK 5: Nebezpečná zóna */}
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl border border-red-100 p-4 shadow-sm">
                  <button
                    onClick={openDeleteConfirm}
                    className="w-full flex items-center justify-between text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Smazat účet a data
                    <IconTrash className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaywall && (
          <div
            className="absolute inset-0 flex items-end sm:items-center justify-center"
            style={{ zIndex: 60 }}
          >
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-60 transition-opacity duration-300 ${
                paywallVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closePaywall}
            />
            <div
              className={`relative w-full bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                paywallVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <button
                onClick={closePaywall}
                aria-label="Zavřít"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">Přejdi na PREMIUM</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Odemkni všechny otázky, taháky a neomezené testy nanečisto.
                </p>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {[
                  "Přístup ke všem 600+ otázkám",
                  "Neomezené testy nanečisto",
                  "Všechny taháky bez omezení",
                  "Bez reklam",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <IconCheckBadge className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUnlockPremium}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95 shadow-lg mb-2"
              >
                Odemknout za 99 Kč / měsíc
              </button>
              <p className="text-xs text-zinc-400 text-center">
                Toto je ukázkové demo — žádná platba neproběhne.
              </p>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ zIndex: 60 }}
          >
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-60 transition-opacity duration-300 ${
                deleteConfirmVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeDeleteConfirm}
            />
            <div
              className={`relative w-full bg-white rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                deleteConfirmVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <IconTrash className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-base font-bold text-zinc-900 mb-2">
                  Opravdu chceš smazat účet?
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  Smaže se tvůj účet a veškerý postup. Tato akce je nevratná.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  Ano, smazat účet a data
                </button>
                <button
                  onClick={closeDeleteConfirm}
                  className="w-full text-center text-sm font-medium text-zinc-500 hover:text-zinc-700 py-2 transition-colors"
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
