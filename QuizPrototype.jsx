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
    hint: "Zeptej se na zvýrazněný výraz otázkou proč? Pokud odpovídá, jde o příslovečné určení příčiny.",
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
    hint: "Přístavek blíže vysvětluje nebo upřesňuje jiný větný člen a odděluje se čárkami z obou stran.",
  },
  {
    category: "Skladba",
    text: "Který větný člen je ve větě zvýrazněn? „Chlapec přišel domů unavený.“",
    options: ["přívlastek", "přístavek", "doplněk", "předmět"],
    correctAnswerIndex: 2,
    explanation:
      "Slovo „unavený“ se vztahuje zároveň k podmětu (chlapec) i k přísudku (přišel) a vyjadřuje stav podmětu v okamžiku děje – jde o doplněk.",
    hint: "Doplněk se váže současně na podmět (nebo předmět) i na přísudek – vyjadřuje, v jakém stavu někdo něco dělal.",
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
    hint: "Trpný rod opisný poznáš podle tvaru „být“ + příčestí trpné (např. je postaven, byl napsán).",
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
    hint: "Zkus na dané slovo položit pádovou otázku: komu, čemu? To je typická otázka 3. pádu.",
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
    hint: "Zeptej se, jestli slovo spojuje dvě věty nebo možnosti. Pokud ano, je to spojka.",
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
    hint: "Zkus na slovo položit otázku 2. pádu: bez koho, čeho?",
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
    hint: "Podmiňovací způsob poznáš podle částice „by/bych/bys…“ ve spojení s příčestím minulým.",
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
    hint: "Zeptej se na zvýrazněné slovo otázkou čí? – to je typická otázka přivlastňovacích zájmen.",
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
    hint: "Pomnožná podstatná jména označují jednu věc, ale gramaticky mají jen tvar množného čísla (dveře, kalhoty, nůžky, prázdniny).",
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
    hint: "Všimni si slova „jako“ – to je typický signál přirovnání.",
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
      "Zemřela matka a do hrobu dána,\nsiroty po ní zůstaly;\ni přicházely každičkého rána\na matičku svou hledaly.\n(K. J. Erben: Kytice, úvodní báseň Kytice)",
    text: "Z jaké sbírky pochází uvedená ukázka a kdo je jejím autorem?",
    options: [
      "Babička – Božena Němcová",
      "Kytice – Karel Jaromír Erben",
      "Máj – Karel Hynek Mácha",
      "Bajky – Ezop",
    ],
    correctAnswerIndex: 1,
    explanation: "Ukázka je úvodní básní stejnojmenné sbírky Kytice Karla Jaromíra Erbena.",
    hint: "Sbírka je pojmenována přímo podle této úvodní básně.",
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
];
const LETTERS = ["A", "B", "C", "D"];

// Fixed Cermat okruhy shown in the chapter menu, in this order, regardless
// of how many real questions currently exist for each one.
const CERMAT_TOPICS = [
  "Pravopis",
  "Skladba",
  "Tvarosloví",
  "Porozumění textu",
  "Slovní zásoba",
  "Literární teorie",
];

const QUIZ_LENGTH = 20; // per-topic practice round
const FULL_TEST_LENGTH = 30; // full timed mock exam, mirrors real JPZ length
const FULL_TEST_MINUTES = 60;

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
  },
  Skladba: {
    icon: IconRulerTriangle,
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-500",
    btn: "text-blue-600 border-blue-200 hover:bg-blue-50",
  },
  "Porozumění textu": {
    icon: IconBookOpen,
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-500",
    btn: "text-sky-600 border-sky-200 hover:bg-sky-50",
  },
  Tvarosloví: {
    icon: IconGear,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-500",
    btn: "text-amber-600 border-amber-200 hover:bg-amber-50",
  },
  "Slovní zásoba": {
    icon: IconChat,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-500",
    btn: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
  },
  "Literární teorie": {
    icon: IconBooksStack,
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-500",
    btn: "text-violet-600 border-violet-200 hover:bg-violet-50",
  },
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
  const [screen, setScreen] = useState("dashboard"); // dashboard | quiz | results
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

  const availableCategories = CERMAT_TOPICS;

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
    prepareQuestion(drawnQs[0]);
    setIsTimedMode(true);
    setTimeRemainingSec(FULL_TEST_MINUTES * 60);
    setScreen("quiz");
  }

  function selectOption(originalIndex) {
    if (isAnswerEvaluated) return;
    setSelectedOptionId(originalIndex);
    setIsAnswerEvaluated(true);
    setAnsweredCount((c) => c + 1);
    const isCorrect =
      originalIndex === filteredQuestions[currentIndex].correctAnswerIndex;

    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = showHint ? 1 : 2;
      setConsecutiveWrong(0);
    } else {
      const newStreak = consecutiveWrong + 1;
      if (newStreak >= 2) {
        pointsEarned = -1; // penalty: two wrong answers in a row
      }
      setConsecutiveWrong(newStreak);
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

  function getOptionState(originalIndex) {
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
                        className={`mt-auto w-full text-xs font-semibold border rounded-full py-2 transition-colors active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-default ${meta.btn}`}
                      >
                        Procvičovat
                      </button>
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
              <div className="flex items-center justify-between mb-4">
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
                  const dim = isAnswerEvaluated && !isSelected && !isCorrectOpt;
                  const state = getOptionState(opt.originalIndex);

                  return (
                    <button
                      key={opt.originalIndex}
                      disabled={isAnswerEvaluated}
                      onClick={() => selectOption(opt.originalIndex)}
                      className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-all ${
                        state === "correct"
                          ? "bg-green-50 border-green-300"
                          : state === "wrong"
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-zinc-200 hover:border-zinc-300 active:scale-95"
                      } ${dim ? "opacity-40" : ""} ${
                        isAnswerEvaluated ? "cursor-default" : "cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}
