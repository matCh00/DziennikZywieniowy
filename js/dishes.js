/**
 * FORMAT DANYCH — baza dań (uniwersalny). Każde danie ma ten sam zestaw pól:
 *
 *   id, name, category, type, meal, servingWeight,
 *   kcal, protein, fat, carbs, description,
 *   source, sourceKind, sourceUrl, dataNote
 *
 *   type — 'domowe' albo 'fast-food'
 *   servingWeight — masa jednej typowej porcji w gramach
 *   kcal/protein/fat/carbs — wartości dla JEDNEJ porcji (nie na 100 g)
 *
 * ŹRÓDŁA OFICJALNE: McDonald's, KFC i Burger King (sourceKind: chain-official)
 * — oficjalne tabele sieci. Popeyes korzysta z przewodnika globalnego, więc
 * wartości mogą się różnić od polskiego menu.
 * ŹRÓDŁA PRZYBLIŻONE: dania domowe (sourceKind: built-in-reference) — szacunek
 * dla typowej receptury i porcji, a nie deklaracja konkretnego produktu.
 * Menu fast food zmienia się regionalnie — sprawdź aktualną tabelę sieci.
 */

const homeNote='Szacunek dla typowej domowej receptury i porcji, nie pomiar laboratoryjny ani deklaracja producenta. Wynik zależy od gramatury surowców, obróbki, ilości tłuszczu, sosów i dodatków.';

function home(id,name,meal,servingWeight,kcal,protein,fat,carbs,description){
  return {
    id:`dish:${id}`,name,category:'Domowe',type:'domowe',meal,servingWeight,
    kcal,protein,fat,carbs,description,
    source:'Baza dań domowych',sourceKind:'built-in-reference',sourceUrl:'',dataNote:homeNote
  };
}

const chainSources={
  "McDonald's":{kind:'chain-official',url:'https://cdn.mcdonalds.pl/uploads/20261110125619/352978-tabela-wo-8-11-2023-mop.pdf',note:'Oficjalna tabela McDonald’s Polska, plik z 10.11.2026; podaje kcal i makroskładniki na 100 g oraz na porcję. Wartości dotyczą konkretnej receptury/gramatury.'},
  KFC:{kind:'chain-official',url:'https://amrestcdn.azureedge.net/kfc-web-ordering/KFC/TOU/KFC_wartosci_odzywcze_MKT_27.10.2026_promocja_NAAN.pdf',note:'Oficjalna tabela KFC Polska z 27.10.2026; wartości na porcję, oparte na badaniach laboratoryjnych lub obliczeniach wartości odżywczej.'},
  'Burger King':{kind:'partner-published-reference',url:'https://glovo-allergy-info-prod.s3.eu-west-1.amazonaws.com/public/products_information_77359.pdf',note:'Tabela wartości odżywczych BK w kopii dystrybuowanej przez partnera Glovo (dokument starszy, ok. 2025), nie potwierdza aktualnej receptury menu w Polsce w 2026 r.'},
  Popeyes:{kind:'global-reference',url:'https://www.popeyeschicken.pl/pl/nutrition',note:'Wartości referencyjne z przewodnika globalnego; nie stanowią potwierdzenia polskiej receptury ani polskiej gramatury. Masy porcji w tym pliku są przybliżone.'}
};

function chain(chainName,id,name,servingWeight,kcal,protein,fat,carbs,description,meal='Obiad'){
  const src=chainSources[chainName];
  return {
    id:`dish:${id}`,name,category:chainName,type:'fast-food',meal,servingWeight,
    kcal,protein,fat,carbs,description,
    source:chainName==='Popeyes'?'Popeyes · global reference':chainName==='Burger King'?'Burger King · tabela wartości w kopii partnera (starsza)':`${chainName} · tabela wartości odżywczych`,sourceKind:src.kind||'built-in-reference',sourceUrl:src.url,dataNote:src.note
  };
}

export const dishes=[
  // Domowe — kotlety, mięsa i ryby
  home('schabowy-klasyczny','Kotlet schabowy panierowany, smażony','Obiad',180,420,28,26,18,'Klasyczny schabowy w bułce tartej, smażony na oleju. Podany bez dodatków.'),
  home('schabowy-pieczony','Kotlet schabowy panierowany, pieczony','Obiad',180,330,30,16,20,'Lżejsza wersja schabowego z piekarnika, bez smażenia w tłuszczu.'),
  home('kurczak-panierowany','Kotlet z kurczaka panierowany','Obiad',160,350,32,18,16,'Pierś z kurczaka w panierce z bułki tartej.'),
  home('indyk-panierowany','Kotlet z indyka panierowany','Obiad',160,330,33,15,15,'Kotlet z piersi indyka w złocistej panierce.'),
  home('pierś-gotowana','Pierś z kurczaka gotowana','Obiad',150,248,46,5,0,'Pierś bez skóry, gotowana w wodzie lub na parze.'),
  home('pierś-pieczona','Pierś z kurczaka pieczona','Obiad',150,275,43,10,0,'Pierś z kurczaka upieczona z odrobiną oliwy i przypraw.'),
  home('pierś-grillowana','Pierś z kurczaka grillowana','Obiad',150,260,45,7,0,'Pierś z grilla, bez panierki i sosu.'),
  home('pierś-smażona','Pierś z kurczaka smażona','Obiad',150,340,40,18,4,'Pierś smażona na patelni z dodatkiem tłuszczu.'),
  home('kotlet-mielony','Kotlet mielony wieprzowy','Obiad',150,390,24,27,12,'Kotlet z mięsa mielonego z bułką i jajkiem.'),
  home('klopsiki-pomidorowe','Klopsiki w sosie pomidorowym','Obiad',250,330,22,18,20,'Klopsiki duszone w pomidorowym sosie.'),
  home('gulasz-wołowy','Gulasz wołowy','Obiad',250,360,32,20,12,'Kawałki wołowiny duszone z cebulą i przyprawami.'),
  home('gulasz-wieprzowy','Gulasz wieprzowy','Obiad',250,420,30,28,11,'Wieprzowina duszona w gęstym sosie.'),
  home('pieczen-rzymska','Pieczeń rzymska','Obiad',180,360,24,24,14,'Pieczeń z mięsa mielonego z jajkiem i bułką.'),
  home('łosoś-pieczony','Łosoś pieczony','Obiad',150,312,30,20,0,'Filet z łososia upieczony z cytryną i ziołami.'),
  home('dorsz-pieczony','Dorsz pieczony','Obiad',150,158,26,5,0,'Chudy filet z dorsza z piekarnika.'),
  home('krewetki-smażone','Krewetki smażone','Obiad',150,260,24,14,8,'Krewetki podsmażone na oliwie z czosnkiem.'),
  home('wołowina-duszona','Wołowina duszona','Obiad',200,380,38,24,3,'Wołowina duszona powoli z marchewką i cebulą.'),
  home('karkówka-pieczona','Karkówka pieczona','Obiad',180,450,32,35,2,'Plastry pieczonej karkówki z przyprawami.'),

  // Domowe — zupy
  home('rosół','Rosół tradycyjny','Obiad',400,180,14,10,8,'Rosół drobiowy z marchewką, pietruszką i cebulą.'),
  home('pomidorowa','Zupa pomidorowa z ryżem','Obiad',400,210,8,8,26,'Pomidorowa na wywarze warzywnym z dodatkiem ryżu.'),
  home('ogórkowa','Zupa ogórkowa','Obiad',400,170,6,8,18,'Ogórkowa z kiszonych ogórków z marchewką i ziemniakami.'),
  home('barszcz','Barszcz czerwony','Obiad',400,120,4,3,18,'Barszcz z buraków, podany bez uszek.'),
  home('żurek-kiełbasa','Żurek z kiełbasą','Obiad',400,320,18,20,18,'Żurek na zakwasie z kiełbasą i jajkiem.'),
  home('żurek-jajko','Żurek z jajkiem','Obiad',400,260,14,15,17,'Żurek na zakwasie z jajkiem, bez mięsa.'),
  home('grochówka','Grochówka','Obiad',400,280,16,10,32,'Gęsta zupa z grochu z wędzonką.'),
  home('kapuśniak','Kapuśniak','Obiad',400,190,8,8,22,'Kapuśniak z kapusty i ziemniaków.'),
  home('krupnik','Krupnik','Obiad',400,220,12,8,26,'Zupa jęczmienna z warzywami i mięsem.'),
  home('krem-dyniowy','Krem z dyni','Obiad',400,180,4,9,22,'Kremowa zupa z dyni z odrobiną śmietanki.'),
  home('zupa-cygańska','Zupa cygańska','Obiad',400,260,14,12,24,'Zupa z kiełbasą, papryką i fasolą.'),
  home('chłodnik','Chłodnik litewski','Obiad',400,150,7,7,15,'Chłodnik z botwiny, kefiru i jajka.'),

  // Domowe — mączne, pierogi i dodatki
  home('pierogi-ruskie','Pierogi ruskie','Obiad',250,480,15,18,62,'Pierogi z farszem z ziemniaków i twarogu, bez okrasy.'),
  home('pierogi-mięso','Pierogi z mięsem','Obiad',250,520,22,20,62,'Pierogi z farszem mięsnym, bez okrasy.'),
  home('pierogi-kapusta','Pierogi z kapustą i grzybami','Obiad',250,430,12,14,62,'Pierogi z kapustą i grzybami, bez okrasy.'),
  home('pierogi-jagody','Pierogi z jagodami','Obiad',200,380,6,8,70,'Pierogi z owocami, podane z odrobiną cukru.'),
  home('kopytka','Kopytka','Obiad',250,420,12,10,70,'Kopytka ziemniaczane z mąką, bez sosu.'),
  home('kluski-śląskie','Kluski śląskie','Obiad',250,400,10,8,72,'Kluski z ziemniaków z charakterystycznym wgłębieniem.'),
  home('carbonara','Makaron carbonara','Obiad',300,650,28,30,65,'Makaron z boczkiem, jajkiem i serem.'),
  home('bolognese','Spaghetti bolognese','Obiad',350,580,30,20,70,'Makaron z sosem pomidorowo-mięsnym.'),
  home('makaron-kurczak','Makaron z kurczakiem i brokułem','Obiad',350,520,35,16,60,'Makaron z piersią kurczaka i brokułem w lekkim sosie.'),
  home('zapiekanka-makaron','Zapiekanka makaronowa','Obiad',350,620,28,28,62,'Makaron zapiekany z mięsem, pomidorami i serem.'),
  home('lasagne','Lasagne','Obiad',350,610,32,28,55,'Warstwy makaronu, sosu mięsnego i beszamelu.'),
  home('pizza-margherita','Pizza margherita','Obiad',300,720,28,24,92,'Ciasto, sos pomidorowy, mozzarella i bazylia.'),
  home('pizza-pepperoni','Pizza pepperoni','Obiad',300,850,34,38,88,'Pizza z sosem pomidorowym, serem i pepperoni.'),
  home('pizza-capricciosa','Pizza capricciosa','Obiad',300,800,32,34,88,'Pizza z szynką, pieczarkami i oliwkami.'),
  home('ryż-biały','Ryż biały gotowany','Obiad',200,260,5,1,56,'Ryż biały ugotowany bez dodatków.'),
  home('ryż-brązowy','Ryż brązowy gotowany','Obiad',200,248,5,2,52,'Ryż pełnoziarnisty ugotowany bez dodatków.'),
  home('kasza-gryczana','Kasza gryczana gotowana','Obiad',200,240,6,2,48,'Kasza gryczana ugotowana bez dodatków.'),
  home('quinoa','Quinoa gotowana','Obiad',200,240,9,4,40,'Komosa ryżowa ugotowana bez dodatków.'),

  // Domowe — śniadania i wypieki na słodko
  home('naleśniki-ser','Naleśniki z serem','Śniadanie',250,520,22,20,60,'Naleśniki z twarogiem, podane bez sosu.'),
  home('naleśniki-owoce','Naleśniki z owocami','Śniadanie',250,430,12,12,70,'Naleśniki z owocami sezonowymi.'),
  home('naleśniki-czekolada','Naleśniki z czekoladą','Śniadanie',250,560,14,24,72,'Naleśniki z kremem czekoladowym.'),
  home('placki-ziemniaczane','Placki ziemniaczane','Obiad',250,480,8,26,52,'Placki z tartych ziemniaków smażone na oleju.'),
  home('placki-twarogowe','Placki twarogowe','Śniadanie',200,380,20,15,42,'Placki z twarogu, podane z owocami.'),
  home('placki-bananowe','Placki bananowe','Śniadanie',200,350,10,12,50,'Placki z banana i jajka, bez mąki.'),
  home('jajecznica','Jajecznica z 3 jaj','Śniadanie',180,330,21,24,2,'Jajecznica z trzech jaj na maśle.'),
  home('omlet-warzywa','Omlet z warzywami','Śniadanie',220,290,20,18,10,'Omlet z papryką, pomidorem i cebulą.'),
  home('jajka-sadzone','Jajka sadzone, 2 szt.','Śniadanie',120,220,14,16,1,'Dwa jajka smażone na tłuszczu.'),
  home('shakshuka','Shakshuka','Śniadanie',300,320,18,18,20,'Jajka zapiekane w sosie pomidorowym z papryką.'),
  home('owsianka-klasyczna','Owsianka klasyczna','Śniadanie',300,340,12,8,55,'Płatki owsiane ugotowane na mleku.'),
  home('owsianka-owoce','Owsianka z owocami','Śniadanie',350,380,11,7,68,'Owsianka z bananem i owocami sezonowymi.'),
  home('owsianka-proteinowa','Owsianka proteinowa','Śniadanie',350,420,30,9,55,'Owsianka z dodatkiem białka i jogurtu.'),
  home('overnight-oats','Overnight oats','Śniadanie',300,360,14,10,52,'Płatki owsiane namoczone w jogurcie przez noc.'),
  home('kanapka-twaróg','Kanapka z twarogiem','Śniadanie',180,320,18,10,40,'Chleb pełnoziarnisty z twarogiem i warzywami.'),
  home('kanapka-jajko','Kanapka z jajkiem','Śniadanie',180,350,17,16,35,'Chleb z jajkiem, sałatą i pomidorem.'),
  home('kanapka-łosoś','Kanapka z łososiem','Śniadanie',180,380,20,18,35,'Chleb z łososiem, serkiem i warzywami.'),
  home('avocado-toast','Avocado toast','Śniadanie',200,400,12,26,34,'Tost z avocado, jajkiem i pomidorkami.'),
  home('smoothie','Smoothie owocowe','Śniadanie',400,240,4,2,52,'Blendowane owoce z jogurtem i wodą.'),
  home('twaróg-warzywa','Twaróg z warzywami','Śniadanie',250,220,24,8,10,'Twaróg półtłusty z rzodkiewką i ogórkiem.'),

  // Domowe — sałatki i dania jednogarnkowe
  home('sałatka-grecka','Sałatka grecka','Obiad',300,320,10,24,18,'Sałatka z fetą, oliwkami, pomidorem i ogórkiem.'),
  home('cezar-kurczak','Sałatka Cezar z kurczakiem','Obiad',300,430,32,24,20,'Sałata rzymska, kurczak, parmezan i sos Cezar.'),
  home('sałatka-tuńczyk','Sałatka z tuńczykiem','Obiad',300,300,24,16,16,'Sałata, tuńczyk, jajko i warzywa.'),
  home('sałatka-kurczak','Sałatka z kurczakiem','Obiad',300,350,32,16,20,'Kurczak grillowany, mix sałat i warzywa.'),
  home('coleslaw','Coleslaw','Obiad',200,180,2,14,12,'Kapusta z marchewką w sosie majonezowym.'),
  home('surówka-marchew','Surówka z marchewki','Obiad',150,90,1,4,12,'Marchewka z jabłkiem i odrobiną cytryny.'),
  home('bigos','Bigos','Obiad',300,330,18,20,18,'Kapusta z mięsem, kiełbasą i grzybami.'),
  home('leczo','Leczo','Obiad',300,280,14,16,22,'Papryka, cukinia, pomidory i kiełbasa.'),
  home('fasolka-bretońska','Fasolka po bretońsku','Obiad',300,340,18,12,38,'Fasola w sosie pomidorowym z kiełbasą.'),
  home('curry-kurczak','Curry z kurczakiem','Obiad',350,480,34,22,38,'Kurczak w mleczku kokosowym z ryżem.'),
  home('curry-ciecierzyca','Curry z ciecierzycą','Obiad',350,420,16,18,48,'Ciecierzyca w pomidorowo-kokosowym sosie curry.'),
  home('gulasz-indyk','Gulasz z indyka','Obiad',300,380,35,20,14,'Indyk duszony z warzywami i papryką.'),
  home('risotto','Risotto z kurczakiem','Obiad',350,520,28,18,58,'Ryż arborio z kurczakiem, parmezanem i warzywami.'),
  home('paella','Paella','Obiad',350,480,26,14,62,'Ryż z kurczakiem, krewetkami i szafranem.'),

  // Domowe — desery
  home('sernik','Sernik','Przekąski',120,380,8,22,36,'Kawałek klasycznego sernika na spodzie z herbatników.'),
  home('szarlotka','Szarlotka','Przekąski',150,360,4,16,50,'Ciasto z jabłkami i cynamonem.'),
  home('brownie','Brownie','Przekąski',100,420,6,24,44,'Czekoladowe ciasto o wilgotnym wnętrzu.'),
  home('budyń','Budyń waniliowy','Przekąski',200,220,6,8,32,'Budyń na mleku, bez dodatków.'),
  home('racuchy','Racuchy','Przekąski',200,420,10,18,55,'Smażone racuchy drożdżowe, bez cukru pudru.'),
  home('tarta-owoce','Tarta z owocami','Przekąski',130,340,4,16,44,'Kruche ciasto z owocami i lekką polewą.'),
  home('pączek-domowy','Pączek domowy','Przekąski',100,350,6,18,42,'Pączek smażony z nadzieniem różanym.'),

  // McDonald's Polska — oficjalna tabela 2026
  chain("McDonald's",'mcd-hamburger','Hamburger',108,258,13,9.5,29,'Klasyczny hamburger: bułka, wołowina, ketchup, musztarda, cebula, ogórek.'),
  chain("McDonald's",'mcd-cheeseburger','Cheeseburger',152,306,16,13,30,'Hamburger z plasterkiem sera cheddar.'),
  chain("McDonald's",'mcd-big-mac','Big Mac',219,544,27,29,42,'Dwa kotlety wołowe, trzy kawałki bułki i sos Big Mac.'),
  chain("McDonald's",'mcd-mcroyal','McRoyal',214,547,33,29,38,'Wołowina, ser, sałata, pomidor i sos.'),
  chain("McDonald's",'mcd-wiesmac','WieśMac',232,607,31,38,35,'Wołowina, boczek, ser, sałata i sos.'),
  chain("McDonald's",'mcd-mcchicken','McChicken',189,433,21,17,48,'Panierowany kurczak, sałata i sos w bułce.'),
  chain("McDonald's",'mcd-mcdouble','McDouble',162,408,24,21,30,'Dwa kotlety wołowe, ser, cebula i ogórek.'),
  chain("McDonald's",'mcd-mcroyal-double','McRoyal Podwójny',304,798,54,47,38,'Podwójna wołowina, ser, warzywa i sos.'),
  chain("McDonald's",'mcd-wiesmac-double','WieśMac Podwójny',346,967,55,67,36,'Podwójna wołowina, boczek, ser i sos.'),
  chain("McDonald's",'mcd-wrap-klasyczny','McWrap Chrupiący Klasyczny',274,572,25,23,64,'Tortilla z panierowanym kurczakiem i warzywami.'),
  chain("McDonald's",'mcd-wrap-bekon','McWrap Chrupiący Bekon Deluxe',261,648,25,33,59,'Tortilla z kurczakiem, boczkiem i sosem.'),
  chain("McDonald's",'mcd-nuggets-6','McNuggets 6 szt.',101,262,16,12,21,'Sześć kawałków panierowanego kurczaka.','Przekąski'),
  chain("McDonald's",'mcd-nuggets-9','McNuggets 9 szt.',161,393,25,19,31,'Dziewięć kawałków panierowanego kurczaka.','Przekąski'),
  chain("McDonald's",'mcd-frytki-srednie','Frytki średnie',114,327,4.1,15,41,'Średnia porcja frytek.','Przekąski'),
  chain("McDonald's",'mcd-frytki-duże','Frytki duże',150,430,5.4,20,54,'Duża porcja frytek.','Przekąski'),
  chain("McDonald's",'mcd-mcflurry-kitkat','McFlurry KitKat',298,298,6.2,10,45,'Lody z kawałkami KitKat.','Przekąski'),
  chain("McDonald's",'mcd-cola-04','Coca-Cola 0,4 l',400,174,0,0,44,'Napój gazowany.','Przekąski'),
  chain("McDonald's",'mcd-drwal-klasyczny','Burger Drwala Klasyczny',318,923,39,53,71,'Wołowina, panierowany ser, boczek, sałata, prażona cebula i sos.'),
  chain("McDonald's",'mcd-drwal-kurczak','Burger Drwala z kurczakiem',318,863,32,43,83,'Drwal z panierowanym kotletem z kurczaka.'),
  chain("McDonald's",'mcd-drwal-żurawina','Burger Drwala z żurawiną',318,940,39,51,77,'Klasyczny Drwal z sosem żurawinowym.'),
  chain("McDonald's",'mcd-drwal-serowy','Burger Drwala Serowy',349,974,42,49,80,'Drwal z dodatkowym cheddarem i sosem serowym.'),
  chain("McDonald's",'mcd-drwal-ostro','Burger Drwala Na ostro',318,900,39,51,69,'Drwal z pikantnym sosem i papryczkami jalapeño.'),

  // KFC Polska — oficjalna tabela z 27.10.2026
  chain('KFC','kfc-zinger','Zinger Burger',170,445,25,22,36,'Panierowana pierś kurczaka, sałata i sos w bułce.'),
  chain('KFC','kfc-zinger-max','Zinger Max',240,590,41,29,41,'Większa wersja Zingera z dodatkami.'),
  chain('KFC','kfc-zinger-ser-bekon','Zinger Ser & Bekon',200,524,30,26,40,'Zinger z serem i boczkiem.'),
  chain('KFC','kfc-grander','Grander Burger',300,756,37,38,61,'Duża kanapka z kurczakiem i warzywami.'),
  chain('KFC','kfc-grander-max','Grander Max',415,1075,60,56,81,'Największa wersja Grandera.'),
  chain('KFC','kfc-longer','Longer',127,309,15,8,43,'Długa kanapka z kurczakiem w bułce.'),
  chain('KFC','kfc-cheeseburger','Cheeseburger KFC',125,309,17,9,40,'Klasyczny cheeseburger z kurczakiem.'),
  chain('KFC','kfc-itwist','iTwist',132,350,11,18,38,'Kanapka z panierowanym kurczakiem i sosem.'),
  chain('KFC','kfc-twister','Twister',226,579,23,30,57,'Tortilla z kurczakiem, sałatą i pomidorem.'),
  chain('KFC','kfc-mega-pocket','Mega Pocket',287,719,30,37,62,'Duża tortilla z kurczakiem i warzywami.'),
  chain('KFC','kfc-qurrito','Qurrito',230,692,35,38,53,'Tortilla z kurczakiem, ryżem i sosem.'),
  chain('KFC','kfc-halloumi','Halloumi Vege Burger',280,708,31,39,55,'Wegetariański burger z halloumi.'),
  chain('KFC','kfc-hot-wings','Hot Wings',36,114,7,7,5,'Pikantne skrzydełko w panierce.','Przekąski'),

  chain('KFC','kfc-hot-spicy-strips','Hot & Spicy Strips 1 szt.',32,92,6,5,3.2,'Panierowany, pikantny kawałek kurczaka.','Przekąski'),
  chain('KFC','kfc-qurrito-grande','Qurrito Grande',320,1078,46,64,80,'Duża tortilla z kurczakiem i dodatkami.'),
  chain('KFC','kfc-grander-kentucky-gold','Grander Kentucky Gold Burger',320,842,36,45,78,'Grander z sosem Kentucky Gold.'),
  chain('KFC','kfc-kentucky-gold-wrapper','Kentucky Gold Wrapper',350,1197,42,77,91,'Wrap z kurczakiem i sosem Kentucky Gold.'),
  chain('KFC','kfc-twister-halloumi','Twister Halloumi Vege',260,697,28,44,44,'Wrap z serem halloumi i warzywami.'),
  chain('KFC','kfc-qurrito-breakfast','Qurrito śniadaniowe',220,548,30,35,25,'Śniadaniowa tortilla z jajkiem i serem.','Śniadanie'),
  chain('KFC','kfc-toast-egg-cheese','Tost z jajkiem i serem',150,368,17,20,31,'Tost śniadaniowy z jajkiem i serem.','Śniadanie'),
  chain('KFC','kfc-breakfast-bagel','Bagel śniadaniowy',250,680,30,33,68,'Bagel śniadaniowy z dodatkami.','Śniadanie'),
  chain('KFC','kfc-breakfast-bagel-small','Bagiel śniadaniowy',240,638,29,26,70,'Mniejszy wariant śniadaniowego bagla.','Śniadanie'),
  chain('KFC','kfc-double-decker-breakfast-toast','Tost piętrowy z jajkiem, serem i bekonem',300,738,35,41,55,'Piętrowy tost śniadaniowy z jajkiem, serem i bekonem.','Śniadanie'),

  // Burger King — starsza tabela wartości w kopii partnera (nie bieżąca tabela oficjalna)
  chain('Burger King','bk-hamburger','Hamburger BK',105.4,241.2,11.3,6.5,31.7,'Wołowina, ketchup, musztarda, ogórek i cebula.'),
  chain('Burger King','bk-cheeseburger','Cheeseburger BK',116.9,280.3,13.6,9.6,32,'Wołowina z serem cheddar.'),
  chain('Burger King','bk-double-cheeseburger','Double Cheeseburger BK',161.2,387.6,22.6,16.4,33.7,'Dwa kotlety wołowe i dwa plastry sera.'),
  chain('Burger King','bk-big-king','Big King',200.2,501,23,27.2,37.3,'Dwa kotlety, ser, sałata i sos.'),
  chain('Burger King','bk-big-king-xxl','Big King XXL',379.7,976.5,56,60.7,156,'Duży burger z dwoma kotletami wołowymi.'),
  chain('Burger King','bk-whopper','Whopper',285.1,602.6,27.9,32.2,104,'Wołowina z grilla, pomidor, sałata, cebula i majonez.'),
  chain('Burger King','bk-bacon-whopper','Bacon Whopper',300,700,31.5,40,54,'Whopper z boczkiem.'),
  chain('Burger King','bk-double-whopper','Double Whopper',369.1,830.3,46.9,49,156,'Podwójna wołowina, warzywa i sos.'),
  chain('Burger King','bk-cheese-whopper','Cheese Whopper',309,720,32,41.3,54,'Whopper z serem cheddar.'),
  chain('Burger King','bk-double-bacon-cheese-whopper','Double Bacon & Cheese Whopper',386,1039,56.6,67.5,48.8,'Podwójna wołowina, boczek i ser.'),
  chain('Burger King','bk-chicken-burger','Chicken Burger BK',137,488.1,10.7,29.2,43.7,'Panierowany kurczak, sałata i majonez.'),
  chain('Burger King','bk-chicken-royale','Chicken Royale',235,662,29,36,54,'Duża kanapka z panierowanym kurczakiem.'),
  chain('Burger King','bk-bacon-cheese-chicken-royale','Bacon & Cheese Chicken Royale',280,725,30,44,51,'Chicken Royale z boczkiem i serem.'),
  chain('Burger King','bk-crispy-chicken','Crispy Chicken',170.2,388.8,20.7,17.5,33.5,'Panierowany kurczak w bułce.'),
  chain('Burger King','bk-cheese-crispy-chicken','Cheese Crispy Chicken',192,562,18.7,34.1,43.3,'Crispy Chicken z serem.'),
  chain('Burger King','bk-chili-cheese-burger','Chili Cheese Burger',118.8,329.1,11.4,15.6,32.8,'Burger z sosem chili i serem.'),
  chain('Burger King','bk-bacon-king-junior','Bacon King Junior',145,449.6,18,23,41.2,'Mały burger z boczkiem i serem.'),
  chain('Burger King','bk-double-bacon-king-junior','Double Bacon King Junior',203,584,28.5,32.9,41.6,'Podwójna wersja Bacon King Junior.'),
  chain('Burger King','bk-onion-rings','Onion Rings 9 szt.',90,278,4.6,13,34,'Panierowane krążki cebulowe.','Przekąski'),
  chain('Burger King','bk-nuggets','Chicken Nuggets 9 szt.',144,398.9,23,24,22,'Panierowane kawałki kurczaka.','Przekąski'),
  chain('Burger King','bk-spicy-nuggets','Spicy Nuggets 9 szt.',189,438,24,24,31,'Pikantne nuggetsy.','Przekąski'),

  // Popeyes — globalne dane referencyjne, nie polska karta produktu
  chain('Popeyes','popeyes-chicken-sandwich','Chicken Sandwich Classic',260,700,28,42,50,'Panierowana pierś kurczaka, bułka i sos.'),
  chain('Popeyes','popeyes-chicken-sandwich-spicy','Chicken Sandwich Spicy',260,700,28,42,50,'Pikantna wersja kanapki z kurczakiem.'),
  chain('Popeyes','popeyes-tenders-3','Chicken Tenders 3 szt.',120,390,35,19,25,'Trzy panierowane polędwiczki z kurczaka.'),
  chain('Popeyes','popeyes-tenders-5','Chicken Tenders 5 szt.',200,650,58,32,41,'Pięć panierowanych polędwiczek z kurczaka.'),
  chain('Popeyes','popeyes-wing','Skrzydełko Classic',60,220,14,15,11,'Jedno skrzydełko w panierce.','Przekąski'),
  chain('Popeyes','popeyes-leg','Nóżka Classic',120,200,15,12,9,'Jedna nóżka w panierce.','Przekąski'),
  chain('Popeyes','popeyes-thigh','Udko Classic',150,490,25,34,18,'Jedno udko w panierce.','Przekąski'),
  chain('Popeyes','popeyes-breast','Pierś Classic',180,620,52,30,17,'Jedna pierś w panierce.','Przekąski'),
  chain('Popeyes','popeyes-cajun-fries-reg','Cajun Fries Regular',150,270,3,15,31,'Frytki z przyprawą cajun.','Przekąski'),
  chain('Popeyes','popeyes-mac-cheese','Mac & Cheese Regular',150,280,11,20,16,'Makaron z serem w stylu cajun.','Przekąski'),
  chain('Popeyes','popeyes-coleslaw','Coleslaw Regular',100,160,1,12,12,'Sałatka z kapusty.','Przekąski'),
  chain('Popeyes','popeyes-biscuit','Biscuit',80,230,3,14,24,'Małe pieczywo maślane.','Przekąski')
];

// ---------------------------------------------------------------------------
// Tabela partnera BK jest starsza; tylko pozycje dokładnie występujące w jej wierszach
// zachowują status opublikowanej referencji. Pozostałe warianty pozostają szacunkami.
const bkReferenceIds = new Set(['dish:bk-hamburger','dish:bk-cheeseburger','dish:bk-double-cheeseburger','dish:bk-big-king','dish:bk-big-king-xxl','dish:bk-whopper','dish:bk-double-whopper','dish:bk-chicken-burger','dish:bk-crispy-chicken','dish:bk-cheese-crispy-chicken','dish:bk-chili-cheese-burger','dish:bk-bacon-king-junior']);
for (const d of dishes.filter(x=>x.category==='Burger King')) if (!bkReferenceIds.has(d.id)) {
  d.source='Burger King · wartość szacunkowa (brak potwierdzenia wariantu w użytej tabeli)';
  d.sourceKind='built-in-reference'; d.sourceUrl='';
  d.dataNote='Szacunek dla wariantu menu; nie znaleziono potwierdzenia w użytej tabeli wartości BK. Menu i receptury mogą się zmieniać — traktuj jako orientacyjne.';
}

// W starszym PDF BK pola węglowodanów przy tych trzech burgerach dają energię
// niemożliwą do pogodzenia z podaną energią kcal. Zachowujemy kcal z dokumentu,
// ale nie podajemy niespójnych makr jako wiarygodnych danych.
for (const id of ['dish:bk-big-king-xxl','dish:bk-whopper','dish:bk-double-whopper']) {
  const d=dishes.find(x=>x.id===id);
  if (d) { d.protein=null; d.fat=null; d.carbs=null; d.dataNote='Kalorie i masa porcji przepisane ze starszej tabeli partnera BK. Wiersz makroskładników jest wewnętrznie niespójny z energią, dlatego makra pozostawiono jako null zamiast prezentować błędne liczby.'; }
}

// Rozszerzona baza dań domowych, gotowych, restauracyjnych i fast-food.
// Wszystkie nowe pozycje bez oficjalnej tabeli sieci mają wartości orientacyjne.
// ---------------------------------------------------------------------------
const extendedDishIds=new Set(dishes.map(x=>x.id));
const extendedDishNames=new Set(dishes.map(x=>x.name.toLocaleLowerCase('pl')));
function addHomeDish(id,name,meal,weight,kcal,protein,fat,carbs,description){
  const key=`dish:${id}`;
  if(extendedDishIds.has(key)||extendedDishNames.has(name.toLocaleLowerCase('pl'))) return;
  dishes.push(home(id,name,meal,weight,kcal,protein,fat,carbs,description));
  extendedDishIds.add(key); extendedDishNames.add(name.toLocaleLowerCase('pl'));
}
function addEatOut(id,name,category,meal,weight,kcal,protein,fat,carbs,description){
  const key=`dish:${id}`;
  if(extendedDishIds.has(key)||extendedDishNames.has(name.toLocaleLowerCase('pl'))) return;
  dishes.push({id:key,name,category,type:'fast-food',meal,servingWeight:weight,kcal,protein,fat,carbs,description,
    source:'Baza orientacyjna dań restauracyjnych i fast-food',sourceKind:'built-in-reference',sourceUrl:'',
    dataNote:'Szacunek dla typowej porcji restauracyjnej/street food, nie oficjalna tabela lokalu i nie pomiar laboratoryjny. Receptura, gramatura, sosy i dodatki różnią się między lokalami.'});
  extendedDishIds.add(key); extendedDishNames.add(name.toLocaleLowerCase('pl'));
}

// Polska kuchnia, dodatki, ziemniaki i ryż — osobne dania dla metod przygotowania.
[
  ['ziemniaki-mundurkach','Ziemniaki w mundurkach','Obiad',200,174,4,0.2,40,'Ziemniaki gotowane w skórce, bez dodatku tłuszczu.'],
  ['ziemniaki-parze','Ziemniaki gotowane na parze','Obiad',200,160,3.8,.2,36,'Ziemniaki przygotowane na parze.'],
  ['ziemniaki-pieczone-oliwa','Ziemniaki pieczone z oliwą i rozmarynem','Obiad',220,330,5,14,45,'Ćwiartki ziemniaków z oliwą, czosnkiem i rozmarynem.'],
  ['ziemniaki-z-patelni','Ziemniaki smażone z cebulą','Obiad',220,390,6,18,48,'Podsmażane ziemniaki z cebulą i przyprawami.'],
  ['ziemniaki-airfryer','Ziemniaki z air fryera','Obiad',200,250,5,5,45,'Ziemniaki z niewielką ilością oleju, przygotowane w air fryerze.'],
  ['frytki-domowe','Frytki domowe smażone','Obiad',150,468,5,22,62,'Domowe frytki z ziemniaków smażone w głębokim oleju.'],
  ['frytki-pieczone','Frytki pieczone z piekarnika','Obiad',180,300,5,8,50,'Frytki pieczone z dodatkiem niewielkiej ilości oleju.'],
  ['frytki-airfryer','Frytki z air fryera','Obiad',180,270,5,5,50,'Frytki przygotowane w air fryerze z małą ilością oleju.'],
  ['talarki-pieczone','Talarki ziemniaczane pieczone','Obiad',200,310,5,9,50,'Plastry ziemniaków pieczone z przyprawami.'],
  ['talarki-smazone','Talarki ziemniaczane smażone','Obiad',200,420,5,19,55,'Plastry ziemniaków smażone na patelni.'],
  ['puree-maslo','Puree ziemniaczane z masłem','Obiad',200,270,4,13,35,'Tłuczone ziemniaki z masłem i mlekiem.'],
  ['puree-smietanka','Puree ziemniaczane ze śmietanką','Obiad',200,290,4,15,34,'Kremowe puree z dodatkiem śmietanki.'],
  ['puree-czosnkowe','Puree ziemniaczane czosnkowe','Obiad',200,250,4,10,35,'Puree z czosnkiem i masłem.'],
  ['bataty-pieczone','Bataty pieczone','Obiad',200,180,4,1,42,'Bataty pieczone bez panierki.'],
  ['frytki-bataty','Frytki z batatów','Obiad',180,290,3,10,45,'Frytki z batatów pieczone lub smażone.'],
  ['placki-ziemniaczane-piekarnik','Placki ziemniaczane z piekarnika','Obiad',220,320,7,8,52,'Placki ziemniaczane pieczone zamiast smażonych.'],
  ['babka-ziemniaczana','Babka ziemniaczana','Obiad',250,430,10,23,45,'Tarta masa ziemniaczana zapiekana z cebulą i boczkiem.'],
  ['kartacze','Kartacze z mięsem','Obiad',300,510,20,18,65,'Duże kluski ziemniaczane z farszem mięsnym.'],
  ['pyzy-bez-miesa','Pyzy ziemniaczane bez farszu','Obiad',250,375,8,2,82,'Kluski z gotowanych i surowych ziemniaków.'],
  ['kopytka-maslo','Kopytka z masłem i bułką tartą','Obiad',250,520,12,17,75,'Kopytka podsmażone z masłem i bułką tartą.'],
  ['kluski-slaskie-sos','Kluski śląskie z sosem pieczeniowym','Obiad',300,450,11,12,72,'Kluski śląskie podane z sosem pieczeniowym.'],
  ['ryz-basmati','Ryż basmati gotowany','Obiad',200,260,5,1,56,'Ryż basmati gotowany na sypko.'],
  ['ryz-jasminowy','Ryż jaśminowy gotowany','Obiad',200,260,5,1,56,'Aromatyczny ryż jaśminowy gotowany na wodzie.'],
  ['ryz-parboiled','Ryż parboiled gotowany','Obiad',200,250,5,1,54,'Ryż paraboliczny gotowany, sypki.'],
  ['ryz-brazowy','Ryż brązowy gotowany','Obiad',200,246,5,2,52,'Pełnoziarnisty ryż brązowy ugotowany na wodzie.'],
  ['ryz-dziki','Ryż dziki gotowany','Obiad',200,202,8,1,42,'Gotowany ryż dziki o wyrazistym smaku.'],
  ['ryz-czarny','Ryż czarny gotowany','Obiad',200,230,7,2,48,'Czarny ryż gotowany na sypko.'],
  ['ryz-czerwony','Ryż czerwony gotowany','Obiad',200,230,5,2,48,'Pełnoziarnisty czerwony ryż gotowany.'],
  ['ryz-sushi','Ryż do sushi','Obiad',200,270,5,1,60,'Ryż krótkoziarnisty z zaprawą octową, cukrem i solą.'],
  ['ryz-smazony-jajko','Ryż smażony z jajkiem','Obiad',300,500,15,17,68,'Ryż smażony na patelni z jajkiem i warzywami.'],
  ['ryz-smazony-warzywa','Ryż smażony z warzywami','Obiad',300,430,9,12,70,'Ryż smażony z mieszanką warzyw.'],
  ['ryz-pilaw','Pilaw z warzywami','Obiad',300,420,8,10,72,'Ryż duszony z warzywami, cebulą i przyprawami.'],
  ['ryz-z-maslem','Ryż z masłem','Obiad',220,330,5,9,56,'Ryż gotowany podany z masłem.'],
  ['kasza-jaglana-z-warzywami','Kasza jaglana z warzywami','Obiad',300,360,10,8,60,'Kasza jaglana z duszoną marchewką, cukinią i cebulą.'],
  ['kasza-gryczana-z-pieczarkami','Kasza gryczana z pieczarkami','Obiad',300,390,12,10,60,'Kasza gryczana z podsmażanymi pieczarkami.'],
  ['pęczak-z-grzybami','Pęczak z grzybami','Obiad',300,380,11,8,65,'Kasza pęczak z leśnymi grzybami i natką pietruszki.'],
  ['kuskus-warzywa','Kuskus z warzywami','Obiad',300,390,11,8,68,'Kuskus z warzywami i oliwą.'],
  ['bulgur-z-kurczakiem','Bulgur z kurczakiem','Obiad',350,520,34,14,58,'Kasza bulgur z kurczakiem i warzywami.'],
  ['quinoa-z-warzywami','Komosa ryżowa z warzywami','Obiad',300,390,13,12,55,'Quinoa z pieczonymi warzywami.'],
  ['kaszotto-grzybowe','Kaszotto grzybowe','Obiad',350,480,14,15,65,'Kasza pęczak gotowana na bulionie z grzybami.'],
  ['kaszotto-burak','Kaszotto z burakiem i fetą','Obiad',350,500,17,18,63,'Kasza pęczak z burakiem, fetą i pestkami.'],
  ['pierogi-ruskie-smazone','Pierogi ruskie smażone','Obiad',250,600,16,28,65,'Pierogi ruskie podsmażone na patelni.'],
  ['pierogi-ruskie-cebula','Pierogi ruskie z cebulką','Obiad',280,560,17,23,68,'Pierogi ruskie z podsmażoną cebulką.'],
  ['pierogi-ruskie-skwarek','Pierogi ruskie ze skwarkami','Obiad',280,650,18,32,67,'Pierogi ruskie podane ze skwarkami.'],
  ['pierogi-z-serem','Pierogi z serem na słodko','Obiad',250,480,17,12,72,'Pierogi z twarogiem i cukrem.'],
  ['pierogi-z-jagodami','Pierogi z jagodami','Obiad',250,430,8,8,78,'Pierogi z jagodowym nadzieniem.'],
  ['pierogi-z-truskawkami','Pierogi z truskawkami','Obiad',250,420,8,7,78,'Pierogi z truskawkowym nadzieniem.'],
  ['pierogi-ze-szpinakiem','Pierogi ze szpinakiem i fetą','Obiad',250,500,16,18,62,'Pierogi z farszem szpinakowym i serem feta.'],
  ['pierogi-z-soczewica','Pierogi z soczewicą','Obiad',250,470,17,12,68,'Pierogi z farszem z zielonej soczewicy.'],
  ['pierogi-z-kurczakiem','Pierogi z kurczakiem','Obiad',250,520,22,16,65,'Pierogi z farszem z kurczaka i cebuli.'],
  ['pierogi-z-kaczka','Pierogi z kaczką','Obiad',250,560,20,22,64,'Pierogi z farszem z pieczonej kaczki.'],
  ['pierogi-piecarki-mozzarella','Pierogi z pieczarkami i mozzarellą','Obiad',250,510,17,17,68,'Pierogi z pieczarkami, mozzarellą i cebulą.'],
  ['pierogi-z-kapusta-smazone','Pierogi z kapustą i grzybami smażone','Obiad',250,520,12,20,70,'Pierogi z kapustą i grzybami podsmażone po ugotowaniu.'],
  ['leniwe','Pierogi leniwe z twarogu','Obiad',250,460,22,12,64,'Kluski leniwe z twarogu, jajka i mąki.'],
  ['knedle-sliwki','Knedle ze śliwkami','Obiad',250,450,9,7,88,'Knedle ziemniaczane z nadzieniem śliwkowym.'],
  ['knedle-truskawki','Knedle z truskawkami','Obiad',250,430,8,6,85,'Knedle ziemniaczane z truskawkami.'],
  ['kluski-lane','Kluski lane','Obiad',250,320,11,8,50,'Kluski z jajka i mąki podane do zupy.'],
  ['racuchy-jablka','Racuchy z jabłkami','Śniadanie',220,460,9,18,64,'Drożdżowe placuszki z jabłkiem.'],
  ['racuchy-jagody','Racuchy z jagodami','Śniadanie',220,450,9,16,66,'Placuszki drożdżowe z jagodami.'],
  ['krokiety-kapusta','Krokiety z kapustą i grzybami','Obiad',250,500,12,22,64,'Naleśniki z farszem kapuściano-grzybowym w panierce.'],
  ['krokiety-ser-pieczarki','Krokiety z serem i pieczarkami','Obiad',250,520,17,24,58,'Naleśniki z farszem serowo-pieczarkowym.'],
  ['gołąbki-bez-ryzu','Gołąbki z mięsem bez ryżu','Obiad',300,350,25,20,12,'Liście kapusty faszerowane mięsem, duszone w sosie pomidorowym.'],
  ['gołąbki-wegetarianskie','Gołąbki z kaszą i grzybami','Obiad',300,330,10,10,45,'Gołąbki z farszem z kaszy i grzybów.'],
  ['bigos-mloda-kapusta','Bigos z młodej kapusty','Obiad',300,300,17,17,18,'Młoda kapusta duszona z kiełbasą i koperkiem.'],
  ['kapusniak-mloda-kapusta','Kapuśniak z młodej kapusty','Obiad',400,180,8,7,20,'Lekka zupa z młodej kapusty i warzyw.'],
  ['fasolka-bretonska-vege','Fasolka po bretońsku wegetariańska','Obiad',300,290,15,7,40,'Biała fasola w sosie pomidorowym bez mięsa.'],
  ['leczo-wegetarianskie','Leczo warzywne z cukinią','Obiad',300,220,6,12,24,'Papryka, cukinia, pomidory i cebula duszone razem.'],
  ['placki-z-cukinii','Placki z cukinii','Obiad',220,360,10,18,38,'Placki z tartej cukinii i jajka.'],
  ['placki-z-kalafiora','Placki z kalafiora','Obiad',220,330,12,16,32,'Placki z kalafiora z ziołami.'],
  ['kotlet-jajeczny','Kotlet jajeczny','Obiad',150,320,15,20,18,'Jajka na twardo z bułką tartą, smażone na patelni.'],
  ['kotlet-rybny','Kotlet rybny','Obiad',160,290,22,12,20,'Kotlet z białej ryby z koperkiem, panierowany.'],
  ['kotlet-z-kaszy','Kotlet z kaszy gryczanej i twarogu','Obiad',180,330,14,14,35,'Wegetariaczny kotlet z kaszy gryczanej i twarogu.'],
  ['pulpeciki-indyk','Pulpety z indyka w sosie koperkowym','Obiad',280,390,31,19,18,'Pulpety z indyka w delikatnym sosie koperkowym.'],
  ['schab-duszony','Schab duszony w sosie własnym','Obiad',220,390,38,22,7,'Plastry schabu długo duszone w sosie własnym.'],
  ['kurczak-w-sosie-smietanowym','Kurczak w sosie śmietanowym','Obiad',300,520,38,29,12,'Kurczak duszony w sosie śmietanowym.'],
  ['kurczak-w-sosie-pieczarkowym','Kurczak w sosie pieczarkowym','Obiad',300,480,38,23,13,'Pierś kurczaka z pieczarkami w sosie.'],
  ['kurczak-w-sosie-musztardowym','Kurczak w sosie musztardowym','Obiad',280,460,37,22,12,'Kurczak duszony w sosie na bazie musztardy.'],
  ['indyk-w-sosie-koperkowym','Indyk w sosie koperkowym','Obiad',280,400,39,18,12,'Indyk duszony w lekkim sosie koperkowym.'],
  ['polędwiczki-wieprzowe-grzyby','Polędwiczki wieprzowe w sosie grzybowym','Obiad',280,480,38,26,10,'Polędwiczki duszone z leśnymi grzybami.'],
  ['stek-wolowy-maslo','Stek wołowy z masłem czosnkowym','Obiad',220,580,45,40,2,'Stek wołowy podany z masłem czosnkowym.'],
  ['dorsz-w-panierce','Dorsz panierowany smażony','Obiad',200,420,29,19,28,'Filet dorsza w panierce smażony na patelni.'],
  ['dorsz-na-parze','Dorsz na parze z cytryną','Obiad',180,160,34,2,1,'Dorsz gotowany na parze z cytryną i koperkiem.'],
  ['losos-grillowany','Łosoś grillowany','Obiad',170,350,34,22,0,'Filet łososia grillowany bez panierki.'],
  ['pstrag-pieczony','Pstrąg pieczony z ziołami','Obiad',200,300,38,15,1,'Pstrąg pieczony z cytryną i ziołami.'],
  ['krewetki-czosnek','Krewetki z czosnkiem i pietruszką','Obiad',180,280,28,15,4,'Krewetki smażone krótko na oliwie z czosnkiem.'],
  ['mule-w-winie','Mule w sosie pomidorowym','Obiad',300,300,25,8,25,'Omułki duszone z pomidorami, czosnkiem i ziołami.'],
  ['risotto-grzyby','Risotto z grzybami leśnymi','Obiad',350,560,16,20,78,'Ryż arborio z grzybami, bulionem i parmezanem.'],
  ['risotto-szpinak','Risotto ze szpinakiem','Obiad',350,520,17,18,72,'Kremowe risotto ze szpinakiem.'],
  ['risotto-krewetki','Risotto z krewetkami','Obiad',350,560,27,17,70,'Risotto z krewetkami, czosnkiem i natką.'],
  ['paella-owocemorza','Paella z owocami morza','Obiad',400,570,30,14,76,'Ryż z owocami morza, papryką i szafranem.'],
  ['paella-warzywna','Paella warzywna','Obiad',380,490,12,12,82,'Hiszpański ryż z warzywami i szafranem.'],
  ['makaron-aglio-olio','Spaghetti aglio e olio','Obiad',300,560,14,22,72,'Spaghetti z czosnkiem, oliwą, chili i pietruszką.'],
  ['makaron-pesto','Makaron z pesto bazyliowym','Obiad',320,650,18,30,72,'Makaron z pesto bazyliowym i parmezanem.'],
  ['makaron-pesto-kurczak','Makaron z pesto i kurczakiem','Obiad',350,690,39,25,70,'Makaron z kurczakiem i zielonym pesto.'],
  ['makaron-z-tunczykiem','Makaron z tuńczykiem i pomidorami','Obiad',350,560,32,12,72,'Makaron z tuńczykiem, pomidorami i oliwą.'],
  ['makaron-z-lososiem','Makaron z łososiem w sosie śmietanowym','Obiad',350,680,30,30,68,'Makaron z łososiem w kremowym sosie.'],
  ['makaron-z-pieczarkami','Makaron z pieczarkami','Obiad',330,520,16,18,68,'Makaron z pieczarkami, cebulą i natką.'],
  ['makaron-serowy','Makaron z sosem serowym','Obiad',300,620,22,26,68,'Makaron w kremowym sosie serowym.'],
  ['makaron-szpinak-ricotta','Makaron ze szpinakiem i ricottą','Obiad',330,560,22,19,66,'Makaron w sosie ze szpinaku i ricotty.'],
  ['makaron-arrabbiata','Penne all’arrabbiata','Obiad',320,500,15,13,76,'Penne w ostrym sosie pomidorowym z chili.'],
  ['makaron-puttanesca','Spaghetti alla puttanesca','Obiad',320,520,16,17,73,'Makaron z pomidorami, oliwkami, kaparami i anchois.'],
  ['makaron-alfredo','Fettuccine Alfredo','Obiad',330,700,23,34,72,'Makaron w sosie śmietanowo-maślanym z parmezanem.'],
  ['makaron-cacio-e-pepe','Pasta cacio e pepe','Obiad',300,610,21,25,68,'Makaron z pecorino i świeżo mielonym pieprzem.'],
  ['makaron-lasagne-warzywna','Lasagne warzywna','Obiad',350,540,20,22,58,'Warstwy makaronu, warzyw, pomidorów i beszamelu.'],
  ['zapiekanka-bagietka-klasyczna','Zapiekanka na bagietce z pieczarkami i serem','Obiad',250,620,24,27,65,'Połówka bagietki z pieczarkami, serem i ketchupem.'],
  ['zapiekanka-bagietka-kurczak','Zapiekanka na bagietce z kurczakiem','Obiad',280,650,33,23,72,'Bagietka z kurczakiem, serem i sosem czosnkowym.'],
  ['zapiekanka-bagietka-salami','Zapiekanka na bagietce z salami','Obiad',270,700,27,34,66,'Bagietka z pieczarkami, salami i serem.'],
  ['zapiekanka-bagietka-bekon','Zapiekanka na bagietce z boczkiem','Obiad',270,720,28,38,60,'Zapiekana bagietka z boczkiem, pieczarkami i serem.'],
  ['zapiekanka-bagietka-wege','Zapiekanka na bagietce warzywna','Obiad',250,550,19,19,68,'Bagietka z pieczarkami, papryką, cebulą i serem.'],
  ['bagietka-czosnkowa','Bagietka czosnkowa zapiekana','Przekąski',150,480,10,22,59,'Bagietka z masłem czosnkowym i ziołami, zapieczona.'],
  ['bagietka-serowa','Bagietka zapiekana z serem','Przekąski',180,560,22,23,62,'Bagietka z roztopionym serem żółtym.'],
  ['bagietka-caprese','Bagietka caprese','Przekąski',220,510,20,17,65,'Bagietka z mozzarellą, pomidorem i pesto.'],
  ['tosty-francuskie','Tosty francuskie','Śniadanie',200,470,16,20,55,'Pieczywo maczane w jajku i mleku, smażone na maśle.'],
  ['tosty-z-serem','Tosty z serem i szynką','Śniadanie',180,480,25,21,46,'Tosty z szynką i serem żółtym.'],
  ['panini-kurczak','Panini z kurczakiem i mozzarellą','Obiad',250,560,34,20,60,'Grillowana kanapka z kurczakiem, mozzarellą i pesto.'],
  ['panini-salami','Panini z salami i serem','Obiad',230,610,25,29,60,'Grillowana kanapka z salami i serem.'],
  ['grzanka-awokado','Grzanka z awokado i jajkiem','Śniadanie',220,430,16,24,36,'Chrupiący chleb z awokado i jajkiem sadzonym.'],
  ['bruschetta-pomidor','Bruschetta z pomidorami','Przekąski',160,300,8,10,40,'Grzanki z pomidorami, czosnkiem i bazylią.'],
  ['bruschetta-mozzarella','Bruschetta z mozzarellą','Przekąski',180,360,14,14,42,'Grzanki z mozzarellą i pomidorami.'],
  ['focaccia-oliwki','Focaccia z oliwkami','Przekąski',150,430,9,18,58,'Włoskie pieczywo z oliwkami i oliwą.'],
  ['sałatka-ziemniaczana','Sałatka ziemniaczana z jajkiem','Obiad',300,430,12,25,36,'Ziemniaki, jajka, ogórek kiszony i sos majonezowy.'],
  ['sałatka-kuskus','Sałatka z kuskusem i warzywami','Obiad',300,390,11,11,60,'Kuskus z ogórkiem, pomidorem, papryką i ziołami.'],
  ['sałatka-burak-feta','Sałatka z burakiem, fetą i rukolą','Obiad',280,390,14,24,24,'Pieczony burak, feta, rukola, orzechy i dressing.'],
  ['sałatka-halloumi','Sałatka z grillowanym halloumi','Obiad',300,520,22,38,18,'Sałata, warzywa i grillowany ser halloumi.'],
  ['sałatka-kalafior','Sałatka z pieczonym kalafiorem','Obiad',300,340,10,18,34,'Pieczony kalafior z tahini, pietruszką i cytryną.'],
  ['sałatka-makaronowa','Sałatka makaronowa z szynką','Obiad',300,460,18,23,44,'Makaron, szynka, ser, kukurydza i sos jogurtowy.'],
  ['sałatka-ryzowa','Sałatka ryżowa z tuńczykiem','Obiad',300,420,23,12,54,'Ryż, tuńczyk, kukurydza, ogórek i jajko.'],
  ['sałatka-cezar-krewetki','Sałatka Cezar z krewetkami','Obiad',300,430,28,25,18,'Sałata rzymska, krewetki, grzanki, parmezan i sos Cezar.'],
  ['poke-losos','Poke bowl z łososiem','Obiad',400,620,31,24,66,'Ryż, łosoś, awokado, ogórek, edamame i sos sojowy.'],
  ['poke-tunczyk','Poke bowl z tuńczykiem','Obiad',400,570,35,15,68,'Ryż, tuńczyk, awokado, edamame i warzywa.'],
  ['poke-tofu','Poke bowl z tofu','Obiad',400,520,20,18,68,'Ryż, tofu, edamame, warzywa i sezam.'],
  ['buddha-bowl-kurczak','Buddha bowl z kurczakiem','Obiad',400,560,37,16,60,'Kasza, kurczak, warzywa, hummus i pestki.'],
  ['buddha-bowl-falafel','Buddha bowl z falafelem','Obiad',400,590,19,22,74,'Kasza, falafel, hummus, warzywa i sos tahini.'],
  ['bowl-ziemniaczany','Bowl z pieczonymi ziemniakami i kurczakiem','Obiad',400,570,37,19,55,'Pieczone ziemniaki, kurczak, sałata i sos jogurtowy.'],
  ['bowl-burrito','Burrito bowl z wołowiną','Obiad',400,650,34,23,72,'Ryż, wołowina, fasola, kukurydza, salsa i ser.'],
  ['sushi-california','California rolls z surimi','Obiad',250,350,10,7,62,'Rolki sushi z ryżem, surimi, ogórkiem i awokado.'],
  ['sushi-philadelphia','Philadelphia roll z łososiem','Obiad',250,420,16,17,50,'Sushi z łososiem, serkiem i ogórkiem.'],
  ['sushi-tempura','Sushi tempura z krewetką','Obiad',280,520,16,22,62,'Rolki z krewetką w tempurze i sosem.'],
  ['sushi-vege','Sushi wegetariańskie','Obiad',250,300,7,5,58,'Maki z ogórkiem, awokado, marchewką i oshinko.'],
  ['ramen-miso','Ramen miso z kurczakiem','Obiad',550,650,39,23,70,'Bulion miso, makaron ramen, kurczak, jajko i warzywa.'],
  ['ramen-tonkotsu','Ramen tonkotsu','Obiad',550,780,32,42,68,'Ramen na bulionie wieprzowym z makaronem i boczkiem.'],
  ['ramen-wege','Ramen wegetariański','Obiad',520,520,18,17,70,'Bulion warzywny, tofu, makaron i warzywa.'],
  ['pho-bo','Pho bo','Obiad',550,520,35,12,65,'Wietnamska zupa z wołowiną, makaronem ryżowym i ziołami.'],
  ['pad-thai-kurczak','Pad thai z kurczakiem','Obiad',400,650,32,22,78,'Makaron ryżowy smażony z kurczakiem, jajkiem i orzeszkami.'],
  ['pad-thai-krewetki','Pad thai z krewetkami','Obiad',400,620,28,20,78,'Makaron ryżowy z krewetkami, jajkiem, limonką i orzeszkami.'],
  ['makaron-chow-mein','Chow mein z kurczakiem','Obiad',400,590,32,18,72,'Smażony makaron z kurczakiem i warzywami.'],
  ['kurczak-sweet-sour','Kurczak słodko-kwaśny z ryżem','Obiad',400,620,30,15,82,'Kurczak w sosie słodko-kwaśnym podany z ryżem.'],
  ['kurczak-teriyaki','Kurczak teriyaki z ryżem','Obiad',400,610,38,12,78,'Kurczak w sosie teriyaki z ryżem i sezamem.'],
  ['kurczak-katsu','Chicken katsu curry','Obiad',420,750,35,29,86,'Panierowany kurczak z japońskim curry i ryżem.'],
  ['mapo-tofu','Mapo tofu z ryżem','Obiad',400,560,25,25,54,'Tofu w pikantnym sosie z fermentowaną pastą i ryżem.'],
  ['bibimbap','Bibimbap z wołowiną','Obiad',420,650,31,22,80,'Ryż z wołowiną, warzywami, jajkiem i pastą gochujang.'],
  ['gyoza-kurczak','Gyoza z kurczakiem','Przekąski',180,380,17,14,43,'Japońskie pierożki z kurczakiem, podsmażone i podduszone.'],
  ['gyoza-warzywa','Gyoza warzywne','Przekąski',180,330,9,10,50,'Pierożki z kapustą i warzywami, gotowane na parze.'],
  ['falafel-wrap','Wrap z falafelem','Obiad',300,560,18,24,62,'Tortilla z falafelem, warzywami i sosem tahini.'],
  ['shawarma-kurczak','Shawarma z kurczakiem','Obiad',350,620,36,25,58,'Marynowany kurczak z przyprawami, pitą i warzywami.'],
  ['biryani-kurczak','Chicken biryani','Obiad',400,650,35,18,82,'Aromatyczny ryż basmati z kurczakiem i przyprawami.'],
  ['butter-chicken','Butter chicken z ryżem','Obiad',400,720,34,32,72,'Kurczak w kremowym sosie pomidorowo-maślanym z ryżem.'],
  ['tikka-masala','Chicken tikka masala z ryżem','Obiad',400,690,36,26,72,'Kurczak w sosie tikka masala z ryżem basmati.'],
  ['dal-makhani','Dal makhani z ryżem','Obiad',400,570,20,18,75,'Czarna soczewica duszona z pomidorami i przyprawami.'],
  ['chana-masala','Chana masala z ryżem','Obiad',400,560,18,14,82,'Ciecierzyca w pikantnym sosie pomidorowym z ryżem.'],
  ['burrito-kurczak','Burrito z kurczakiem','Obiad',350,650,36,20,70,'Tortilla pszenna z kurczakiem, ryżem, fasolą i salsą.'],
  ['burrito-vege','Burrito wegetariańskie','Obiad',350,560,19,17,78,'Tortilla z fasolą, ryżem, warzywami i serem.'],
  ['quesadilla-kurczak','Quesadilla z kurczakiem i serem','Obiad',250,620,34,30,48,'Tortilla z kurczakiem i roztopionym serem.'],
  ['quesadilla-ser','Quesadilla serowa','Obiad',220,560,24,28,45,'Tortilla z mieszanką serów.'],
  ['tacos-wołowina','Tacos z wołowiną','Obiad',250,520,27,24,42,'Tortille kukurydziane z wołowiną, salsą i warzywami.'],
  ['tacos-ryba','Tacos z rybą','Obiad',250,470,24,18,48,'Tacos z rybą, kapustą i sosem limonkowym.'],
  ['nachos-ser','Nachos zapiekane z serem','Przekąski',250,650,20,35,62,'Chipsy kukurydziane zapiekane z serem i salsą.'],
  ['nachos-chili','Nachos z chili con carne','Przekąski',300,720,29,34,75,'Nachosy z chili con carne, serem i jalapeño.'],
  ['kebab-kurczak-pita','Kebab z kurczakiem w picie','Obiad',400,720,38,30,72,'Mięso z kurczaka, pita, warzywa i sos.'],
  ['kebab-wolowina-bulka','Kebab wołowo-baraní w bułce','Obiad',450,850,42,42,78,'Mięso wołowo-baranie, bułka, warzywa i sos.'],
  ['kebab-box-ryz','Kebab box z ryżem','Obiad',450,760,40,28,78,'Mięso kebab, ryż, surówka i sos.'],
  ['kebab-box-frytki','Kebab box z frytkami','Obiad',450,900,38,42,88,'Mięso kebab z frytkami, surówką i sosem.'],
  ['kebab-tortilla','Kebab w tortilli','Obiad',400,780,38,34,75,'Tortilla z mięsem, warzywami i sosem czosnkowym.'],
  ['kebab-falafel','Kebab falafel w picie','Obiad',380,650,20,24,82,'Pita z falafelem, warzywami i sosem tahini.'],
  ['gyros-pita','Gyros w picie','Obiad',400,700,36,28,72,'Wieprzowy gyros, pita, pomidor, cebula i tzatziki.'],
  ['hotdog-klasyczny','Hot dog klasyczny','Przekąski',180,480,16,25,48,'Bułka, parówka, ketchup i musztarda.'],
  ['hotdog-francuski','Hot dog francuski','Przekąski',170,430,14,20,45,'Parówka w podłużnej bułce z sosami.'],
  ['hotdog-z-bekonem','Hot dog z bekonem i serem','Przekąski',220,620,23,36,48,'Bułka, parówka, bekon, ser i sos.'],
  ['burger-vege','Burger wegetariański','Obiad',280,560,20,24,58,'Bułka, kotlet roślinny, sałata, pomidor i sos.'],
  ['burger-fish','Burger rybny','Obiad',250,520,22,22,52,'Bułka z panierowaną rybą, sałatą i sosem.'],
  ['burger-bacon','Burger wołowy z bekonem','Obiad',320,850,42,52,50,'Wołowina, bekon, ser, sałata i sos burgerowy.'],
  ['burger-bbq','Burger wołowy BBQ','Obiad',320,790,40,42,54,'Burger z wołowiną, serem, sosem BBQ i cebulą.'],
  ['burger-double-cheese','Double cheeseburger','Obiad',300,760,42,42,48,'Podwójny kotlet wołowy, ser, pikle i sos.'],
  ['burger-chicken-crispy','Crispy chicken burger','Obiad',280,690,30,32,65,'Panierowany kurczak w bułce z sałatą i majonezem.'],
  ['burger-spicy-chicken','Spicy chicken burger','Obiad',280,700,30,33,64,'Pikantny panierowany kurczak, sałata i ostry sos.'],
  ['burger-halloumi','Burger z halloumi','Obiad',280,680,25,38,52,'Grillowany halloumi, bułka, warzywa i sos.'],
  ['chicken-wings-bbq','Skrzydełka BBQ','Przekąski',250,650,40,45,18,'Skrzydełka kurczaka pieczone i glazurowane sosem BBQ.'],
  ['chicken-tenders','Polędwiczki z kurczaka w panierce','Przekąski',200,560,36,28,35,'Kawałki kurczaka w chrupiącej panierce.'],
  ['chicken-popcorn','Popcorn chicken','Przekąski',180,520,30,28,32,'Małe kawałki kurczaka w panierce.'],
  ['onion-rings','Krążki cebulowe panierowane','Przekąski',150,450,6,25,48,'Cebula w panierce smażona na głębokim tłuszczu.'],
  ['mozzarella-sticks','Mozzarella sticks','Przekąski',180,540,22,32,38,'Panierowane paluszki mozzarelli, smażone.'],
  ['nuggets-9','Nuggetsy z kurczaka, 9 szt.','Przekąski',150,400,24,22,28,'Dziewięć kawałków panierowanego kurczaka.'],
  ['fish-and-chips','Fish and chips','Obiad',400,850,32,42,85,'Panierowana ryba z frytkami i sosem tatarskim.'],
  ['pizza-quattro-formaggi','Pizza quattro formaggi','Obiad',350,900,38,39,95,'Pizza z czterema serami.'],
  ['pizza-diavola','Pizza Diavola','Obiad',350,920,37,41,96,'Pizza z pikantnym salami i chili.'],
  ['pizza-prosciutto-funghi','Pizza prosciutto e funghi','Obiad',350,820,34,32,94,'Pizza z szynką i pieczarkami.'],
  ['pizza-hawajska','Pizza hawajska','Obiad',350,850,34,32,100,'Pizza z szynką i ananasem.'],
  ['pizza-vege','Pizza warzywna','Obiad',350,760,27,26,104,'Pizza z papryką, cukinią, pieczarkami i oliwkami.'],
  ['pizza-bbq-chicken','Pizza BBQ chicken','Obiad',350,900,38,36,96,'Pizza z kurczakiem, cebulą i sosem barbecue.'],
  ['pizza-capricciosa','Pizza capricciosa','Obiad',350,850,34,34,94,'Pizza z szynką, pieczarkami, karczochami i oliwkami.'],
  ['pizza-tonno','Pizza tonno','Obiad',350,820,38,28,96,'Pizza z tuńczykiem, cebulą i oliwkami.'],
  ['pizza-calzone','Calzone z szynką i serem','Obiad',350,800,34,30,90,'Zamknięta pizza z szynką, serem i pomidorami.'],
  ['pizza-piadina','Piadina z szynką i rukolą','Obiad',250,560,23,20,65,'Włoski placek z szynką, serem i rukolą.'],
  ['schnitzel-wiener','Sznycel wiedeński','Obiad',220,520,36,29,22,'Cielęcy sznycel panierowany i smażony.'],
  ['cordon-bleu','Cordon bleu','Obiad',220,610,37,35,25,'Panierowany kotlet z kurczaka z szynką i serem.'],
  ['beef-burger-steak','Stek wołowy restauracyjny','Obiad',250,600,52,40,0,'Stek wołowy grillowany, bez dodatków.'],
  ['pork-ribs','Żeberka BBQ','Obiad',350,850,45,60,18,'Żeberka wieprzowe pieczone w sosie barbecue.'],
  ['pulled-pork-burger','Pulled pork burger','Obiad',320,780,35,38,70,'Szarpana wieprzowina w bułce z sosem BBQ.'],
  ['mac-cheese','Mac and cheese','Obiad',300,650,23,32,66,'Makaron zapiekany w kremowym sosie serowym.'],
  ['mac-cheese-bacon','Mac and cheese z boczkiem','Obiad',330,760,28,42,67,'Makaron serowy z chrupiącym boczkiem.'],
  ['chicken-caesar-wrap','Wrap Cezar z kurczakiem','Obiad',280,580,32,25,52,'Tortilla z kurczakiem, sałatą, parmezanem i sosem Cezar.'],
  ['subway-tuna-style','Sub z tuńczykiem','Obiad',250,520,28,18,58,'Długa kanapka z tuńczykiem, warzywami i sosem.'],
  ['subway-chicken-style','Sub z kurczakiem','Obiad',250,500,32,12,58,'Długa kanapka z kurczakiem i warzywami.'],
  ['club-sandwich','Club sandwich','Obiad',300,620,35,30,50,'Trójwarstwowa kanapka z kurczakiem, bekonem, jajkiem i sałatą.'],
  ['croque-monsieur','Croque monsieur','Śniadanie',220,560,28,29,45,'Francuska zapiekana kanapka z szynką i serem.'],
  ['croque-madame','Croque madame','Śniadanie',250,650,34,37,46,'Croque monsieur z jajkiem sadzonym.'],
  ['churros','Churros z cukrem','Przekąski',150,520,7,25,65,'Smażone ciasto parzone z cukrem.'],
  ['cheesecake-portion','Sernik nowojorski','Przekąski',150,520,9,35,40,'Kremowy sernik na spodzie ciasteczkowym.'],
  ['tiramisu-portion','Tiramisu restauracyjne','Przekąski',150,430,7,28,36,'Deser z mascarpone, biszkoptów i kawy.'],
  ['pancakes-maple','Pancakes z syropem klonowym','Śniadanie',250,560,13,18,82,'Amerykańskie placuszki z syropem klonowym.'],
  ['waffle-icecream','Gofr z lodami i polewą','Przekąski',220,620,10,25,88,'Gofr z porcją lodów i polewą.']
].forEach(r=>addHomeDish(...r));

// Komponowane talerze ryżowe: odmiana ryżu × źródło białka × sos.
const riceBases=[
  {name:'ryż basmati',k:260,p:5,f:1,c:56},{name:'ryż jaśminowy',k:260,p:5,f:1,c:56},{name:'ryż brązowy',k:246,p:5,f:2,c:52},
  {name:'ryż parboiled',k:250,p:5,f:1,c:54},{name:'ryż dziki',k:202,p:8,f:1,c:42},{name:'ryż czarny',k:230,p:7,f:2,c:48},
  {name:'ryż czerwony',k:230,p:5,f:2,c:48},{name:'ryż do sushi',k:270,p:5,f:1,c:60},{name:'ryż arborio',k:260,p:5,f:1,c:57}
];
const proteinOptions=[
  {id:'kurczak-grill',name:'kurczakiem grillowanym',k:250,p:42,f:6,c:0,w:130},{id:'kurczak-crispy',name:'kurczakiem chrupiącym',k:330,p:30,f:18,c:17,w:130},
  {id:'indyk',name:'indykiem',k:220,p:40,f:4,c:0,w:130},{id:'wolowina',name:'wołowiną',k:300,p:30,f:20,c:0,w:130},
  {id:'wieprzowina',name:'wieprzowiną',k:320,p:30,f:22,c:0,w:130},{id:'losos',name:'łososiem',k:280,p:28,f:18,c:0,w:130},
  {id:'tunczyk',name:'tuńczykiem',k:160,p:34,f:2,c:0,w:120},{id:'krewetki',name:'krewetkami',k:150,p:30,f:2,c:2,w:130},
  {id:'tofu',name:'tofu',k:190,p:18,f:12,c:5,w:150},{id:'falafel',name:'falafelem',k:270,p:12,f:16,c:25,w:120},
  {id:'halloumi',name:'grillowanym halloumi',k:320,p:22,f:25,c:2,w:100},{id:'pulpeciki',name:'pulpecikami drobiowymi',k:260,p:28,f:14,c:8,w:140}
];
const riceSauces=[
  {id:'teriyaki',name:'sosem teriyaki',k:80,p:2,f:0,c:18},{id:'curry',name:'sosem curry kokosowym',k:160,p:3,f:14,c:7},
  {id:'pomidorowy',name:'sosem pomidorowym',k:65,p:2,f:2,c:10},{id:'czosnkowy',name:'sosem czosnkowym',k:120,p:2,f:11,c:5},
  {id:'slodki-chili',name:'sosem sweet chili',k:70,p:0,f:0,c:17},{id:'orzechowy',name:'sosem orzechowym',k:150,p:5,f:12,c:6},
  {id:'serowy',name:'sosem serowym',k:140,p:6,f:11,c:5},{id:'jogurtowy',name:'sosem jogurtowo-ziołowym',k:70,p:4,f:3,c:6}
];
let riceCombo=0;
for(let i=0;i<riceBases.length;i++){
  for(let j=0;j<proteinOptions.length;j++){
    const sauce=riceSauces[(i*3+j*2)%riceSauces.length];
    const rice=riceBases[i], prot=proteinOptions[j];
    const kcal=rice.k+prot.k+sauce.k+45;
    const protein=rice.p+prot.p+sauce.p+2;
    const fat=rice.f+prot.f+sauce.f+2;
    const carbs=rice.c+prot.c+sauce.c+8;
    const name=`Bowl z ${rice.name} z ${prot.name} i ${sauce.name}`;
    addHomeDish(`rice-bowl-${i}-${j}`,name,'Obiad',420,kcal,protein,fat,carbs,`Porcja obiadowa: ${rice.name}, ${prot.name}, warzywa i ${sauce.name}.`);
    riceCombo++;
  }
}

// Ziemniaczane talerze obiadowe — różne formy ziemniaków i źródła białka.
const potatoForms=[
  {id:'gotowane',name:'ziemniaki gotowane',k:175,p:4,f:0,c:40},{id:'pieczone',name:'ziemniaki pieczone',k:210,p:5,f:4,c:42},
  {id:'frytki',name:'frytki',k:460,p:5,f:22,c:60},{id:'puree',name:'puree ziemniaczane',k:240,p:4,f:10,c:36},
  {id:'talarki',name:'talarki pieczone',k:250,p:5,f:7,c:42},{id:'wedges',name:'łódeczki ziemniaczane',k:260,p:5,f:8,c:44},
  {id:'kluski',name:'kluski śląskie',k:250,p:5,f:2,c:54},{id:'kopytka',name:'kopytka',k:270,p:7,f:3,c:56},
  {id:'bataty',name:'bataty pieczone',k:180,p:4,f:1,c:42},{id:'placki',name:'placki ziemniaczane',k:400,p:7,f:20,c:48}
];
const potatoProteins=proteinOptions.slice(0,10);
for(let i=0;i<potatoForms.length;i++){
  for(let j=0;j<potatoProteins.length;j++){
    const st=potatoForms[i], pr=potatoProteins[j];
    const kcal=st.k+pr.k+35, protein=st.p+pr.p+2, fat=st.f+pr.f+3, carbs=st.c+pr.c+5;
    addHomeDish(`potato-plate-${i}-${j}`,`${st.name.charAt(0).toUpperCase()+st.name.slice(1)} z ${pr.name}`,'Obiad',400,kcal,protein,fat,carbs,`${st.name}, ${pr.name}, surówka i lekki dodatek sosu.`);
  }
}

// Makarony w wielu kształtach, sosach i wariantach restauracyjnych.
const pastaShapes=['spaghetti','penne','fusilli','tagliatelle','rigatoni','farfalle','makaron ryżowy','udon','soba','makaron pełnoziarnisty'];
const pastaDishes=[
  ['bolognese','sosem bolognese',580,30,20,70],['carbonara','sosem carbonara',650,28,30,65],['pesto','pesto bazyliowym',620,18,28,72],
  ['pomodoro','sosem pomodoro',500,15,14,75],['alfredo','sosem Alfredo',680,23,34,70],['ser','sosem serowym',640,24,30,68],
  ['pieczarki','pieczarkami w sosie śmietanowym',590,18,25,70],['kurczak','kurczakiem i brokułem',570,35,17,67],
  ['tunczyk','tuńczykiem i oliwkami',560,32,16,68],['losos','łososiem i szpinakiem',650,32,26,67],
  ['arrabbiata','ostrym sosem arrabbiata',510,16,13,77],['szpinak-ricotta','szpinakiem i ricottą',560,22,19,66]
];
for(let i=0;i<pastaShapes.length;i++){
  for(let j=0;j<pastaDishes.length;j++){
    const [sid,sauce,k,p,f,c]=pastaDishes[j];
    const name=`${pastaShapes[i].charAt(0).toUpperCase()+pastaShapes[i].slice(1)} ${sauce}`;
    addHomeDish(`pasta-combo-${i}-${j}`,name,'Obiad',330,k+(i%3)*20,p+(i%2),f+(i%3),c+(i%2)*2,`${pastaShapes[i]} podany ${sauce}. Wartość zależy od porcji i ilości sosu.`);
  }
}

// Fast food i restauracje — warianty dań, nie deklaracje wartości oficjalnych sieci.
const streetBases=[
  {id:'burger-beef',name:'Burger wołowy',cat:'Burgery',w:300,k:650,p:32,f:35,c:54},
  {id:'burger-chicken',name:'Burger z kurczakiem',cat:'Burgery',w:290,k:620,p:30,f:29,c:60},
  {id:'burger-vege',name:'Burger roślinny',cat:'Burgery',w:280,k:560,p:20,f:24,c:58},
  {id:'wrap-chicken',name:'Wrap z kurczakiem',cat:'Wrapy i kanapki',w:280,k:550,p:30,f:22,c:56},
  {id:'hotdog',name:'Hot dog',cat:'Hot dogi',w:180,k:450,p:14,f:23,c:48},
  {id:'kebab',name:'Kebab w tortilli',cat:'Kebab i street food',w:400,k:750,p:38,f:32,c:75}
];
const addOns=[
  ['cheese','z serem cheddar',90,5,7,1],['bacon','z bekonem',130,8,12,0],['jalapeno','z jalapeño',15,.5,.1,3],
  ['bbq','z sosem BBQ',60,0,0,15],['garlic','z sosem czosnkowym',100,1,10,3],['onion','z karmelizowaną cebulą',45,.5,1,9],
  ['avocado','z awokado',80,1,7,4],['egg','z jajkiem',80,7,6,.5],['mushroom','z pieczarkami',25,2,1,3],['blue-cheese','z serem pleśniowym',110,6,9,1]
];
for(let i=0;i<streetBases.length;i++){
  const b=streetBases[i];
  for(let j=0;j<addOns.length;j++){
    const [aid,txt,k,p,f,c]=addOns[j];
    addEatOut(`street-${b.id}-${aid}`,`${b.name} ${txt}`,b.cat,'Obiad',b.w+25,b.k+k,b.p+p,b.f+f,b.c+c,`${b.name.toLowerCase()} ${txt}; wartość szacunkowa obejmuje standardową bułkę/tortillę, mięso lub kotlet oraz sos.`);
  }
}

// Desery i śniadania restauracyjne w odmiennych wariantach.
const sweetVariants=[
  ['gofr-bita','Gofr z bitą śmietaną',220,560,8,30,65],['gofr-owoce','Gofr z owocami',220,430,8,12,70],['gofr-czekolada','Gofr z kremem czekoladowym',220,620,9,32,72],
  ['nalesniki-nutella','Naleśniki z kremem czekoladowym',250,560,14,24,72],['nalesniki-twarog','Naleśniki z twarogiem i rodzynkami',250,520,22,18,64],
  ['nalesniki-jablko','Naleśniki z jabłkami i cynamonem',250,450,10,12,75],['pancakes-banan','Pancakes bananowe',220,420,12,12,68],
  ['pancakes-bacon','Pancakes z bekonem i syropem',250,650,19,28,78],['croissant-szynka','Croissant z szynką i serem',150,470,17,25,42],
  ['croissant-czekolada','Croissant z czekoladą',100,420,7,23,47],['drozdzowka-budyn','Drożdżówka z budyniem',110,360,7,12,54],
  ['sernik-oreo','Sernik z ciasteczkami',150,480,8,28,48],['brownie-lody','Brownie z lodami',180,620,8,31,72],
  ['apple-pie-icecream','Szarlotka na ciepło z lodami',200,540,6,22,78],['tart-tatin','Tarte tatin',150,420,4,19,58],
  ['creme-brulee','Crème brûlée',150,360,5,25,28],['panna-cotta','Panna cotta z musem owocowym',160,340,5,24,25],
  ['profiteroles','Profiterolki z kremem',150,430,8,25,44],['eclair','Ekler z kremem',100,340,6,20,35],['donut-boston','Donut z kremem waniliowym',100,390,5,18,52]
];
for(const r of sweetVariants){
  const [id,name,weight,k,p,f,c]=r;
  addHomeDish(`sweet-${id}`,name,/nalesniki|pancakes|croissant/i.test(id)?'Śniadanie':'Przekąski',weight,k,p,f,c,`${name}. Wartość orientacyjna dla jednej typowej porcji.`);
}


// Dalsze warianty dla pełniejszego katalogu offline: pierogi, ryż, risotto,
// ziemniaki, sałatki, curry, pieczywo na ciepło, śniadania i zupy.
// Wszystkie wartości poniżej są szacunkami typowej porcji.
[
  ['skyr-proteinowy','Skyr proteinowy z owocami i płatkami','Śniadanie',300,330,31,3,43,'Skyr, owoce jagodowe, płatki owsiane i odrobina miodu.'],
  ['falafel','Falafel z hummusem i warzywami','Obiad',320,560,19,26,58,'Kulki z ciecierzycy podane z hummusem, warzywami i pitą.'],
  ['ryz-tunczyk','Ryż z tuńczykiem i warzywami','Obiad',350,470,31,8,66,'Ryż, tuńczyk, kukurydza, ogórek i lekki sos jogurtowy.'],
  ['wrap-chicken','Wrap z grillowanym kurczakiem','Obiad',280,520,34,17,55,'Tortilla z kurczakiem, sałatą, pomidorem i sosem jogurtowym.'],
  ['ratatouille','Ratatouille z warzyw duszonych','Obiad',300,220,5,13,25,'Duszone bakłażany, cukinia, papryka, pomidory i zioła.'],
  ['burger-beef','Burger wołowy klasyczny','Obiad',300,650,32,35,54,'Bułka, kotlet wołowy, sałata, pomidor, ogórek i sos.']
].forEach(r=>addHomeDish(...r));

// Pierogi: nadzienie × sposób podania (gotowane, podsmażone, z okrasą).
const dumplingFillings=[
  ['ruskie','ruskie',480,15,18,62],['mieso','z mięsem',520,22,20,62],['kapusta-grzyby','z kapustą i grzybami',430,12,14,62],
  ['szpinak-feta','ze szpinakiem i fetą',470,17,18,60],['ser-szpinak','z serem i szpinakiem',490,19,19,61],
  ['kurczak','z kurczakiem',510,25,17,62],['kasza-grzyby','z kaszą gryczaną i grzybami',450,14,13,68],
  ['soczi','z soczewicą',460,18,12,68],['ser','z serem na słodko',500,20,12,72],['jagody','z jagodami',420,9,8,78],
  ['truskawki','z truskawkami',410,8,7,78],['śliwki','ze śliwkami',430,8,8,80]
];
const dumplingMethods=[
  ['gotowane','gotowane',0,0,0],['podsmazane','podsmażane na maśle',90,10,1],['okraszone','z cebulką i skwarkami',150,15,2]
];
for(let i=0;i<dumplingFillings.length;i++){
  const [fid,fill,kcal,protein,fat,carbs]=dumplingFillings[i];
  for(let j=0;j<dumplingMethods.length;j++){
    const [mid,method,addK,addF,addC]=dumplingMethods[j];
    addHomeDish(`pierogi-${fid}-${mid}`,`Pierogi ${fill}, ${method}`,'Obiad',280,kcal+addK,protein+1,fat+addF,carbs+addC,`Porcja pierogów ${fill}, ${method}; kaloryczność zależy od ilości tłuszczu i dodatków.`);
  }
}

// Ryż smażony / pilaw: różne odmiany ziaren i dodatki białkowo-warzywne.
const friedRiceBases=[
  ['basmati','basmati',255,5,1,55],['jasmin','jaśminowego',260,5,1,56],['parboiled','parboiled',250,5,1,54],
  ['brazowy','brązowego',245,5,2,52],['sushi','do sushi',270,5,1,60],['dziki','dzikiego',210,8,1,43],
  ['czerwony','czerwonego',235,5,2,49],['czarny','czarnego',235,7,2,49],['dlugoziarnisty','długoziarnistego',255,5,1,56]
];
const friedRiceMixins=[
  ['warzywa','warzywami',70,3,2,12],['jajko','jajkiem',100,7,7,1],['kurczak','kurczakiem',190,30,7,2],
  ['krewetki','krewetkami',130,25,2,2],['tofu','tofu',160,16,10,4],['wolowina','wołowiną',240,27,14,1],
  ['szynka','szynką i groszkiem',150,15,8,9],['kimchi','kimchi i jajkiem',125,8,7,8]
];
for(let i=0;i<friedRiceBases.length;i++) for(let j=0;j<friedRiceMixins.length;j++){
  const [bid,bn,bk,bp,bf,bc]=friedRiceBases[i], [mid,mn,mk,mp,mf,mc]=friedRiceMixins[j];
  addHomeDish(`fried-rice-${bid}-${mid}`,`Ryż smażony ${bn} z ${mn}`,'Obiad',380,bk+mk+75,bp+mp+3,bf+mf+5,bc+mc+7,`Ryż ${bn} smażony z ${mn}, warzywami i sosem sojowym.`);
}

// Risotto i ryż kremowy — odmiany, warzywa oraz dodatki restauracyjne.
const risottoAdditions=[
  ['grzyby','grzybami leśnymi',560,17,19,78],['kurczak','kurczakiem',620,36,18,76],['losos','łososiem',650,32,25,72],
  ['krewetki','krewetkami',590,29,15,78],['szpinak','szpinakiem',520,16,17,76],['dynia','dynią i szałwią',540,13,18,82],
  ['szparagi','szparagami',530,16,17,78],['burak','burakiem i kozim serem',590,18,23,78]
];
const risottoStyles=[['arborio','arborio'],['carnaroli','carnaroli'],['pelnoziarniste','brązowego ryżu'],['orzotto','pęczaku (orzotto)'],['milano','alla milanese'],['pomidorowe','pomidorowego']];
for(let i=0;i<risottoStyles.length;i++) for(let j=0;j<risottoAdditions.length;j++){
  const [sid,sn]=risottoStyles[i], [aid,an,k,pr,f,c]=risottoAdditions[j];
  addHomeDish(`risotto-${sid}-${aid}`,`Risotto ${sn} z ${an}`,'Obiad',360,k+(i%2)*20,pr+(i%3),f+(i%2),c+(i%2)*2,`Kremowe danie ryżowe ${sn} z ${an}, bulionem i serem.`);
}

// Ziemniaki i dania ziemniaczane — forma przygotowania × dodatek główny.
const potatoBases=[
  ['mundurkach','ziemniaki w mundurkach',180,4,0,40],['puree','puree ziemniaczane',240,4,10,36],
  ['pieczone','ziemniaki pieczone',220,5,5,42],['talarki','talarki ziemniaczane',260,5,8,43],
  ['frytki-pieczone','frytki pieczone',300,5,8,50],['frytki-smazone','frytki smażone',460,5,22,60],
  ['wedges','ziemniaczane łódeczki',270,5,9,44],['placki','placki ziemniaczane',420,8,24,46]
];
const potatoToppings=[
  ['koper','z koperkiem i jogurtem',55,3,3,5],['tzatziki','z sosem tzatziki',90,3,7,4],['gulasz','z gulaszem wołowym',260,22,15,8],
  ['kurczak','z kurczakiem z grilla',210,32,7,1],['jajko','z jajkiem sadzonym',120,8,9,1],['twarog','z twarogiem i szczypiorkiem',130,18,5,4],
  ['pieczarki','z pieczarkami w śmietanie',160,5,12,8],['boczek','z boczkiem i cebulą',190,10,16,3]
];
for(let i=0;i<potatoBases.length;i++) for(let j=0;j<potatoToppings.length;j++){
  const [bid,bn,bk,bp,bf,bc]=potatoBases[i], [tid,tn,tk,tp,tf,tc]=potatoToppings[j];
  addHomeDish(`potato-meal-${bid}-${tid}`,`${bn[0].toUpperCase()+bn.slice(1)} ${tn}`,'Obiad',350,bk+tk,bp+tp,bf+tf,bc+tc,`${bn[0].toUpperCase()+bn.slice(1)} ${tn}; przykładowa porcja dania obiadowego.`);
}

// Sałatki: baza / styl restauracyjny × źródło białka.
const saladBases=[
  ['grecka','sałatka grecka',260,8,18,18],['cezar','sałatka Cezar',280,8,18,16],['ziemniaczana','sałatka ziemniaczana',300,6,16,34],
  ['makaronowa','sałatka makaronowa',320,9,14,38],['kuskus','sałatka kuskus',260,8,8,36],['quinoa','sałatka z komosą',280,9,10,34],
  ['coleslaw','coleslaw',180,2,14,12],['bowl','bowl warzywny',240,7,10,30]
];
const saladProteins=[
  ['kurczak','kurczakiem',200,32,7,1],['tunczyk','tuńczykiem',150,29,2,0],['jajko','jajkiem',140,12,10,1],
  ['losos','łososia',220,26,13,0],['feta','fetą',130,7,11,2],['tofu','tofu',170,17,10,4],
  ['ciecierzyca','ciecierzycą',160,9,3,25],['krewetki','krewetkami',140,27,2,1]
];
for(let i=0;i<saladBases.length;i++) for(let j=0;j<saladProteins.length;j++){
  const [bid,bn,bk,bp,bf,bc]=saladBases[i], [pid,pn,pk,pp,pf,pc]=saladProteins[j];
  addHomeDish(`salad-combo-${bid}-${pid}`,`${bn} z ${pn}`,'Obiad',330,bk+pk,bp+pp,bf+pf,bc+pc,`${bn[0].toUpperCase()+bn.slice(1)} z ${pn}, warzywami i dressingiem.`);
}

// Curry i dania w sosie — składnik bazowy × wariant sosu / regionu.
const curryProteins=[
  ['kurczak','kurczakiem',230,32,9,4],['indyk','indykiem',210,34,6,2],['wolowina','wołowiną',280,28,17,2],
  ['krewetki','krewetkami',150,27,3,3],['tofu','tofu',190,18,12,5],['ciecierzyca','ciecierzycą',220,12,6,32],
  ['warzywa','warzywami',130,5,5,19],['paneer','paneerem',280,19,21,4]
];
const curryStyles=[
  ['kokosowe','w sosie kokosowym',170,2,16,8],['pomidorowe','w sosie pomidorowym',90,3,3,13],['tik masala','w sosie tikka masala',160,5,11,10],
  ['korma','w sosie korma',210,5,18,9],['zielone','w zielonym curry',180,4,15,9],['czerwone','w czerwonym curry',170,3,14,11]
];
for(let i=0;i<curryProteins.length;i++) for(let j=0;j<curryStyles.length;j++){
  const [pid,pn,pk,pp,pf,pc]=curryProteins[i], [sid,sn,sk,sp,sf,sc]=curryStyles[j];
  const protein=pp+sp+3, fat=pf+sf+4, carbs=pc+sc+58;
  const kcal=Math.round(4*protein+9*fat+4*carbs);
  addHomeDish(`curry-combo-${pid}-${sid}`,`Curry ${pn} ${sn}`,'Obiad',380,kcal,protein,fat,carbs,`Porcja curry ${pn} ${sn}, podana z ryżem.`);
}

// Bagietki, zapiekanki i kanapki na ciepło.
const hotFillings=[
  ['pieczarki-ser','z pieczarkami i serem',520,22,24,52],['szynka-ser','z szynką i serem',560,29,25,54],
  ['kurczak-bbq','z kurczakiem BBQ',590,34,20,65],['salami','z salami i mozzarellą',640,28,31,58],
  ['caprese','caprese z pomidorem i mozzarellą',510,20,21,58],['tuńczyk','z tuńczykiem i serem',570,31,22,55],
  ['bekon-jajko','z bekonem i jajkiem',650,31,35,52],['warzywa-feta','z warzywami i fetą',500,19,21,57],
  ['kebab','z mięsem kebab i sosem',690,34,31,68],['chorizo','z chorizo i papryką',620,26,30,58]
];
const hotBreads=[['bagietka','bagietka'],['ciabatta','ciabatta'],['panini','bułka panini'],['chleb','chleb tostowy']];
for(let i=0;i<hotFillings.length;i++) for(let j=0;j<hotBreads.length;j++){
  const [fid,fill,k,pr,f,c]=hotFillings[i], [bid,bn]=hotBreads[j];
  addHomeDish(`hot-sandwich-${fid}-${bid}`,`${bn.charAt(0).toUpperCase()+bn.slice(1)} zapiekana ${fill}`,'Obiad',260,k+(j===0?0:-35),pr,f,c,`${bn} z nadzieniem ${fill}, podpieczona w piekarniku lub opiekaczu.`);
}

// Śniadania jajeczne i owsianki w popularnych wariantach.
[
  ['jajecznica-szczypiorek','Jajecznica ze szczypiorkiem',220,330,21,24,3],['jajecznica-boczek','Jajecznica z boczkiem',250,460,27,36,2],
  ['jajecznica-pieczarki','Jajecznica z pieczarkami',240,350,22,25,4],['omlet-ser','Omlet z serem',240,390,25,29,3],
  ['omlet-szynka','Omlet z szynką i serem',260,450,32,31,4],['omlet-szpinak','Omlet ze szpinakiem i fetą',250,380,24,27,6],
  ['jajka-benedyktynskie','Jajka po benedyktyńsku',280,520,23,34,29],['jajka-faszerowane','Jajka faszerowane',180,310,16,25,3],
  ['tost-awokado','Tost z awokado i jajkiem',220,420,14,25,35],['tost-francuski','Tosty francuskie',220,430,14,17,52],
  ['owsianka-jablko','Owsianka z jabłkiem i cynamonem',330,360,12,8,59],['owsianka-maslo-orzechowe','Owsianka z masłem orzechowym',330,470,17,18,56],
  ['owsianka-jagodowa','Owsianka jagodowa',330,350,13,7,58],['jogurt-granola','Jogurt z granolą i owocami',300,390,17,12,52],
  ['burrito-sniadaniowe','Burrito śniadaniowe z jajkiem',300,540,26,26,48],['kanapka-klubowa','Kanapka klubowa z indykiem',260,480,30,19,45],
  ['tosty-ser-szynka','Tosty z serem i szynką',180,430,23,21,37],['bagel-lososiowy','Bajgiel z łososiem i serkiem',220,460,23,18,53],
  ['croissant-maslo','Croissant maślany',65,270,5,15,29],['croissant-migdal','Croissant migdałowy',110,460,9,27,45]
].forEach(([id,name,w,k,pr,f,c])=>addHomeDish(id,name,/jaj|omlet|owsianka|jogurt|burrito|kanapka|tost|bajgiel|croissant/i.test(name)?'Śniadanie':'Przekąski',w,k,pr,f,c,`${name}. Wartość orientacyjna dla typowej porcji.`));

// Zupy i dania jednogarnkowe z typowych kuchni domowych.
[
  ['zupa-krem-brokuł','Krem brokułowy',400,190,8,11,18],['zupa-krem-pieczarki','Krem pieczarkowy',400,220,8,15,16],
  ['zupa-krem-pomidor','Krem pomidorowy',400,180,5,8,24],['zupa-krem-kalafior','Krem kalafiorowy',400,170,6,9,17],
  ['zupa-minestrone','Minestrone',400,210,8,7,29],['zupa-ramen','Ramen z kurczakiem',500,520,30,18,58],
  ['zupa-pho','Pho z wołowiną',500,430,28,9,58],['zupa-miso','Zupa miso z tofu',350,150,10,6,15],
  ['zupa-tajska','Tajska zupa kokosowa',400,340,18,24,16],['zupa-fasolowa','Zupa fasolowa',400,280,15,8,38],
  ['zupa-cebulowa','Francuska zupa cebulowa z grzanką',400,310,12,14,34],['zupa-rybna','Zupa rybna',400,240,22,10,16],
  ['zupa-wiejska','Zupa wiejska z kiełbasą',400,330,16,19,23],['zupa-soczewicowa','Zupa z soczewicy',400,260,15,7,34],
  ['gulasz-chili','Chili con carne z ryżem',420,590,32,18,72],['leczo-kurczak','Leczo z kurczakiem',350,360,32,15,22],
  ['bowl-meksykanski','Bowl meksykański z fasolą',400,520,20,16,70],['bowl-teriyaki','Bowl teriyaki z kurczakiem',400,610,36,14,82],
  ['bowl-grecki','Bowl grecki z kurczakiem',380,520,34,18,52],['bowl-falafel','Bowl z falafelem i hummusem',380,590,20,28,62]
].forEach(([id,name,w,k,pr,f,c])=>addHomeDish(id,name,'Obiad',w,k,pr,f,c,`${name}. Wartość orientacyjna zależna od receptury i dodatków.`));

// Kuchnie restauracyjne i popularne dania zamawiane na wynos.
const restaurantPlates=[
  ['chinese','Kurczak słodko-kwaśny z ryżem',400,620,30,12,92],['orange-chicken','Orange chicken z ryżem',400,720,32,24,92],
  ['kung-pao','Kurczak kung pao',380,560,34,23,46],['beef-broccoli','Wołowina z brokułami',380,490,34,20,38],
  ['pad-thai','Pad thai z kurczakiem',400,650,29,22,80],['pad-thai-shrimp','Pad thai z krewetkami',400,610,28,18,82],
  ['ramen-pork','Ramen z wieprzowiną',500,680,32,30,66],['udon-beef','Udon z wołowiną',400,620,30,18,84],
  ['sushi-mix','Zestaw sushi mix',300,480,22,9,78],['sushi-maki','Maki z łososiem, 8 szt.',180,300,13,5,50],
  ['sushi-nigiri','Nigiri z łososiem, 6 szt.',180,330,20,7,47],['poke-shrimp','Poke bowl z krewetkami',400,520,30,14,68],
  ['gyros-talerz','Talerz gyros z pitą',450,790,38,36,80],['szaszlyk-kurczak','Szaszłyk drobiowy z ryżem',400,520,38,12,58],
  ['fajita-chicken','Fajitas z kurczakiem',380,580,38,20,55],['enchiladas','Enchiladas z kurczakiem',380,640,34,25,65],
  ['lasagne-spinach','Lasagne ze szpinakiem',350,560,25,24,58],['gnocchi-gorgonzola','Gnocchi z sosem gorgonzola',350,650,20,30,76],
  ['gnocchi-pomodoro','Gnocchi w sosie pomidorowym',350,520,15,13,82],['carbonara-guanciale','Spaghetti carbonara z guanciale',350,720,30,37,72],
  ['steak-frites','Stek z frytkami',450,900,48,48,62],['fish-tacos','Tacos rybne z surówką',300,520,26,20,58],
  ['shrimp-tempura','Krewetki w tempurze',200,480,24,25,39],['chicken-parmesan','Chicken parmesan z makaronem',430,790,48,30,78],
  ['pork-schnitzel','Sznycel wieprzowy z ziemniakami',420,760,38,36,66],['chicken-devolaille','Kotlet de volaille z ziemniakami',400,730,38,38,55],
  ['baked-salmon','Łosoś pieczony z warzywami',350,470,36,25,18],['beef-stroganoff','Boeuf strogonow z kaszą',400,590,34,25,52],
  ['moussaka','Moussaka',350,610,28,34,40],['greek-souvlaki','Souvlaki z pitą i tzatziki',400,640,38,26,55],
  ['shakshuka-feta','Szakszuka z fetą i pieczywem',350,490,23,25,42],['burrito-bowl','Burrito bowl z wołowiną',420,680,34,24,82]
];
for(const [id,name,w,k,pr,f,c] of restaurantPlates){
  addEatOut(`restaurant-${id}`,name,'Dania restauracyjne','Obiad',w,k,pr,f,c,`${name}. Wartość orientacyjna typowej porcji restauracyjnej; receptura lokalu może się różnić.`);
}

export const dishCatalogInfo={
  count:dishes.length,
  homemade:dishes.filter(d=>d.type==='domowe').length,
  fastFood:dishes.filter(d=>d.type==='fast-food').length,
  chains:[...new Set(dishes.filter(d=>d.type==='fast-food').map(d=>d.category))],
  nutritionQuality:{officialChainRows:dishes.filter(d=>d.sourceKind==='chain-official').length,partnerPublishedRows:dishes.filter(d=>d.sourceKind==='partner-published-reference').length,globalReferenceRows:dishes.filter(d=>d.sourceKind==='global-reference').length,recipeEstimates:dishes.filter(d=>d.sourceKind==='built-in-reference').length},
  note:'Dania domowe i restauracyjne spoza potwierdzonych tabel sieci są szacunkami typowych receptur/porcji. Dane oficjalne sieci mają datę i zakres wskazane przy rekordzie; starsza tabela partnera BK i globalna tabela Popeyes nie są równoważne aktualnej polskiej etykiecie.'
};
