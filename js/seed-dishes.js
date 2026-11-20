// Wbudowana, tylko do odczytu baza dań. Wartości dotyczą jednej typowej porcji.
// Dania domowe: szacunek dla typowej receptury (nie deklaracja konkretnego produktu).
// Fast food: oficjalne tabele sieci, o ile nie zaznaczono inaczej.

const homeNote='Wartość orientacyjna dla typowej domowej porcji. Skład i kaloryczność zależą od receptury, gramatury i dodatków.';

function home(id,name,meal,servingWeight,kcal,protein,fat,carbs,description){
  return {
    id:`dish:${id}`,name,category:'Domowe',type:'domowe',meal,servingWeight,
    kcal,protein,fat,carbs,description,
    source:'Baza dań domowych',sourceKind:'built-in-reference',sourceUrl:'',dataNote:homeNote
  };
}

const chainSources={
  "McDonald's":{url:'https://mcdonalds.pl/tabela-wartosci-odzywczych',note:'Oficjalna tabela McDonald’s Polska (2026). Pozycje sezonowe mogą być dostępne tylko w wybranych okresach.'},
  KFC:{url:'https://kfc.pl/kcal-wartosci-odzywcze-alergeny-skladniki',note:'Oficjalna tabela KFC Polska z 12.11.2026; wartości na porcję.'},
  'Burger King':{url:'https://burgerking.pl/',note:'Oficjalna tabela wartości odżywczych Burger King Polska; wartości na porcję.'},
  Popeyes:{url:'https://www.popeyeschicken.pl/pl/nutrition',note:'Wartości z przewodnika Popeyes (XI 2026). Polskie menu i gramatura mogą się różnić — sprawdź lokalną tabelę.'}
};

function chain(chainName,id,name,servingWeight,kcal,protein,fat,carbs,description,meal='Obiad'){
  const src=chainSources[chainName];
  return {
    id:`dish:${id}`,name,category:chainName,type:'fast-food',meal,servingWeight,
    kcal,protein,fat,carbs,description,
    source:chainName==='Popeyes'?'Popeyes · przewodnik wartości (globalny)':`${chainName} · oficjalne wartości`,sourceKind:'chain-official',sourceUrl:src.url,dataNote:src.note
  };
}

export const seedDishes=[
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

  // KFC Polska — oficjalna tabela 12.11.2026
  chain('KFC','kfc-zinger','Zinger Burger',170,445,30,22,36,'Panierowana pierś kurczaka, sałata i sos w bułce.'),
  chain('KFC','kfc-zinger-max','Zinger Max',240,590,30,29,41,'Większa wersja Zingera z dodatkami.'),
  chain('KFC','kfc-zinger-ser-bekon','Zinger Ser & Bekon',200,524,35,26,40,'Zinger z serem i boczkiem.'),
  chain('KFC','kfc-grander','Grander Burger',300,756,29,38,61,'Duża kanapka z kurczakiem i warzywami.'),
  chain('KFC','kfc-grander-max','Grander Max',415,1075,19,56,81,'Największa wersja Grandera.'),
  chain('KFC','kfc-longer','Longer',127,309,24,8,43,'Długa kanapka z kurczakiem w bułce.'),
  chain('KFC','kfc-cheeseburger','Cheeseburger KFC',125,309,17,9,40,'Klasyczny cheeseburger z kurczakiem.'),
  chain('KFC','kfc-itwist','iTwist',132,350,27,18,38,'Kanapka z panierowanym kurczakiem i sosem.'),
  chain('KFC','kfc-twister','Twister',226,579,47,30,57,'Tortilla z kurczakiem, sałatą i pomidorem.'),
  chain('KFC','kfc-mega-pocket','Mega Pocket',287,715,18,37,62,'Duża tortilla z kurczakiem i warzywami.'),
  chain('KFC','kfc-qurrito','Qurrito',230,692,17,38,53,'Tortilla z kurczakiem, ryżem i sosem.'),
  chain('KFC','kfc-halloumi','Halloumi Vege Burger',280,708,21,39,55,'Wegetariański burger z halloumi.'),
  chain('KFC','kfc-hot-wings','Hot Wings',36,114,11,7.4,5,'Pikantne skrzydełko w panierce.','Przekąski'),

  // Burger King Polska — oficjalna tabela
  chain('Burger King','bk-hamburger','Hamburger BK',108,263,13,10,30,'Wołowina, ketchup, musztarda, ogórek i cebula.'),
  chain('Burger King','bk-cheeseburger','Cheeseburger BK',152,407,24,21,31,'Wołowina z serem cheddar.'),
  chain('Burger King','bk-double-cheeseburger','Double Cheeseburger BK',162,422,24,22,30,'Dwa kotlety wołowe i dwa plastry sera.'),
  chain('Burger King','bk-big-king','Big King',189,469,23,24,38,'Dwa kotlety, ser, sałata i sos.'),
  chain('Burger King','bk-big-king-xxl','Big King XXL',362,995,58,58,50,'Duży burger z dwoma kotletami wołowymi.'),
  chain('Burger King','bk-whopper','Whopper',290,700,31.5,40,54,'Wołowina z grilla, pomidor, sałata, cebula i majonez.'),
  chain('Burger King','bk-bacon-whopper','Bacon Whopper',300,700,31.5,40,54,'Whopper z boczkiem.'),
  chain('Burger King','bk-double-whopper','Double Whopper',378,836,45,50,50,'Podwójna wołowina, warzywa i sos.'),
  chain('Burger King','bk-cheese-whopper','Cheese Whopper',309,720,32,41.3,54,'Whopper z serem cheddar.'),
  chain('Burger King','bk-double-bacon-cheese-whopper','Double Bacon & Cheese Whopper',386,1039,56.6,67.5,48.8,'Podwójna wołowina, boczek i ser.'),
  chain('Burger King','bk-chicken-burger','Chicken Burger BK',131,377,10,20,40,'Panierowany kurczak, sałata i majonez.'),
  chain('Burger King','bk-chicken-royale','Chicken Royale',235,662,29,36,54,'Duża kanapka z panierowanym kurczakiem.'),
  chain('Burger King','bk-bacon-cheese-chicken-royale','Bacon & Cheese Chicken Royale',280,725,30,44,51,'Chicken Royale z boczkiem i serem.'),
  chain('Burger King','bk-crispy-chicken','Crispy Chicken',183,489,18,29,39,'Panierowany kurczak w bułce.'),
  chain('Burger King','bk-cheese-crispy-chicken','Cheese Crispy Chicken',192,562,18.7,34.1,43.3,'Crispy Chicken z serem.'),
  chain('Burger King','bk-chili-cheese-burger','Chili Cheese Burger',114,384,12,25,28,'Burger z sosem chili i serem.'),
  chain('Burger King','bk-bacon-king-junior','Bacon King Junior',100,310.5,12.4,15.9,28.5,'Mały burger z boczkiem i serem.'),
  chain('Burger King','bk-double-bacon-king-junior','Double Bacon King Junior',203,584,28.5,32.9,41.6,'Podwójna wersja Bacon King Junior.'),
  chain('Burger King','bk-onion-rings','Onion Rings 9 szt.',90,278,4.6,13,34,'Panierowane krążki cebulowe.','Przekąski'),
  chain('Burger King','bk-nuggets','Chicken Nuggets 9 szt.',144,398.9,23,24,22,'Panierowane kawałki kurczaka.','Przekąski'),
  chain('Burger King','bk-spicy-nuggets','Spicy Nuggets 9 szt.',189,438,24,24,31,'Pikantne nuggetsy.','Przekąski'),

  // Popeyes — przewodnik oficjalny (globalny)
  chain('Popeyes','popeyes-chicken-sandwich','Chicken Sandwich Classic',1,700,28,42,50,'Panierowana pierś kurczaka, bułka i sos.'),
  chain('Popeyes','popeyes-chicken-sandwich-spicy','Chicken Sandwich Spicy',1,700,28,42,50,'Pikantna wersja kanapki z kurczakiem.'),
  chain('Popeyes','popeyes-tenders-3','Chicken Tenders 3 szt.',3,390,35,19,25,'Trzy panierowane polędwiczki z kurczaka.'),
  chain('Popeyes','popeyes-tenders-5','Chicken Tenders 5 szt.',5,650,58,32,41,'Pięć panierowanych polędwiczek z kurczaka.'),
  chain('Popeyes','popeyes-wing','Skrzydełko Classic',1,220,14,15,11,'Jedno skrzydełko w panierce.','Przekąski'),
  chain('Popeyes','popeyes-leg','Nóżka Classic',1,200,15,12,9,'Jedna nóżka w panierce.','Przekąski'),
  chain('Popeyes','popeyes-thigh','Udko Classic',1,490,25,34,18,'Jedno udko w panierce.','Przekąski'),
  chain('Popeyes','popeyes-breast','Pierś Classic',1,620,52,30,17,'Jedna pierś w panierce.','Przekąski'),
  chain('Popeyes','popeyes-cajun-fries-reg','Cajun Fries Regular',1,270,3,15,31,'Frytki z przyprawą cajun.','Przekąski'),
  chain('Popeyes','popeyes-mac-cheese','Mac & Cheese Regular',1,280,11,20,16,'Makaron z serem w stylu cajun.','Przekąski'),
  chain('Popeyes','popeyes-coleslaw','Coleslaw Regular',1,160,1,12,12,'Sałatka z kapusty.','Przekąski'),
  chain('Popeyes','popeyes-biscuit','Biscuit',1,230,3,14,24,'Małe pieczywo maślane.','Przekąski')
];

export const dishCatalogInfo={
  count:seedDishes.length,
  homemade:seedDishes.filter(d=>d.type==='domowe').length,
  fastFood:seedDishes.filter(d=>d.type==='fast-food').length,
  chains:[...new Set(seedDishes.filter(d=>d.type==='fast-food').map(d=>d.category))]
};
