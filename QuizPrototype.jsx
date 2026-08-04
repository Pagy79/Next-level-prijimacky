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
    text: "Hoši i dívky se na táboře spřátel_li.",
    options: ["i", "y", "a", "o"],
    correctAnswerIndex: 0,
    explanation:
      "V podmětu je alespoň jedno slovo rodu mužského životného (hoši), proto v přísudku píšeme -i, i když je přítomno i slovo rodu ženského.",
    hint: "Když je v podmětu smíšený rod a jeden z nich je mužský životný, tento rod „vyhrává“.",
  },
  {
    category: "Pravopis",
    text: "Psi na dvoře celou noc štěk_li.",
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
    text: "Kola u vozu se rychle otáč_la.",
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
        title: "Městská knihovna v Praze",
        description: "Tisíce e-knih povinné četby ke stažení zdarma (Čapek, Němcová, Doyle...).",
        url: "https://search.mlp.cz/cz/eknihy",
      },
      {
        title: "Český rozhlas: Čtenářský deník",
        description: "Audioknihy a načtené klasické příběhy zdarma k poslechu.",
        url: "https://temata.rozhlas.cz/ctenarskydenik",
      },
      {
        title: "Knihovny.cz",
        description: "Obří digitální archiv českých knihoven pro čtení přímo v prohlížeči.",
        url: "https://www.knihovny.cz",
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
    <div className="min-h-screen w-full flex justify-center bg-zinc-200 p-6 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-zinc-50 rounded-3xl shadow-xl border border-zinc-200 overflow-hidden flex flex-col">
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
                  <button
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                    aria-label="Profil"
                  >
                    <IconUser className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                    aria-label="Nastavení"
                  >
                    <IconSettings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-xl font-semibold text-zinc-900 leading-snug mb-1">
                Připrav se na jednotnou přijímací zkoušku pro 4leté obory
              </h1>
              <p className="text-sm text-zinc-500 mb-6">Český jazyk a literatura · 2026</p>

              <button
                onClick={startFullTest}
                className="w-full text-left bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-2xl p-5 mb-7 transition-colors active:scale-95"
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
      </div>
    </div>
  );
}
