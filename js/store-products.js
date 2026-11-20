import {biedronkaProducts,biedronkaCatalogInfo} from './store-products-biedronka.js';

// Lidl i Kaufland publikują nazwy asortymentu, ale ich karty produktów
// nie zawierają pełnych tabel wartości odżywczych. Wartości poniżej są więc
// orientacyjne dla danego typu produktu, a nie deklaracją konkretnego SKU.
const ASSORTMENT_NOTE='Nazwa i asortyment z oficjalnej strony sklepu. Wartości orientacyjne dla tego typu produktu — sklep nie publikuje tabeli odżywczej; sprawdź etykietę, jeśli jest dostępna.';
const LIDL_MEAT_URL='https://www.lidl.pl/h/mieso-i-drob/h10095752';
const LIDL_PIKOK_URL='https://www.lidl.pl/c/pikok/s10012365';
const LIDL_PILOS_URL='https://www.lidl.pl/c/pilos/s10015077';
const KAUFLAND_MEAT_URL='https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina.html';
const KAUFLAND_DELI_URL='https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/mieso-i-wedliny.html';
const KAUFLAND_DAIRY_URL='https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka.html';

function lidl(name,slug,id,unitWeight,kcal100,protein100,fat100,carbs100,category='Pieczywo i wypieki'){
  return {
    id:`lidl:${id}`,name,brand:'Lidl',category,store:'Lidl',unitWeight,
    kcal100,protein100,fat100,carbs100,fiber100:null,
    source:'Lidl · piekarnia (katalog asortymentu)',
    sourceKind:'retailer-assortment-reference',
    sourceUrl:`https://www.lidl.pl/p/${slug}/p${id}`,
    dataNote:ASSORTMENT_NOTE
  };
}

function kaufland(name,id,unitWeight,kcal100,protein100,fat100,carbs100,category='Pieczywo i wypieki'){
  return {
    id:`kaufland:${id}`,name,brand:'Kaufland',category,store:'Kaufland',unitWeight,
    kcal100,protein100,fat100,carbs100,fiber100:null,
    source:'Kaufland · piekarnia (katalog asortymentu)',
    sourceKind:'retailer-assortment-reference',
    sourceUrl:'https://sklep.kaufland.pl/piekarnia/',
    dataNote:ASSORTMENT_NOTE
  };
}

function assortment(store,name,id,unitWeight,kcal100,protein100,fat100,carbs100,category,source,sourceUrl,brand=store){
  return {
    id:`${store.toLowerCase()}:${id}`,name,brand,category,store,unitWeight,
    kcal100,protein100,fat100,carbs100,fiber100:null,
    source,sourceKind:'retailer-assortment-reference',sourceUrl,dataNote:ASSORTMENT_NOTE
  };
}

function lidlMeat(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=LIDL_MEAT_URL){
  return assortment('Lidl',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Mięso i drób','Lidl · mięso i drób (katalog asortymentu)',sourceUrl,'Rzeźnik');
}

function lidlDeli(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=LIDL_PIKOK_URL){
  return assortment('Lidl',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Wędliny i kiełbasy','Lidl · Pikok (katalog asortymentu)',sourceUrl,'Pikok');
}

function lidlDairy(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=LIDL_PILOS_URL){
  return assortment('Lidl',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Nabiał i jaja','Lidl · Pilos (katalog asortymentu)',sourceUrl,'Pilos');
}

function kauflandMeat(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=KAUFLAND_MEAT_URL){
  return assortment('Kaufland',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Mięso i drób','Kaufland · mięso (katalog asortymentu)',sourceUrl,'K-Stoisko Mięsne');
}

function kauflandDeli(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=KAUFLAND_DELI_URL){
  return assortment('Kaufland',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Wędliny i kiełbasy','Kaufland · mięso i wędliny (katalog asortymentu)',sourceUrl,'Kaufland');
}

function kauflandDairy(name,id,unitWeight,kcal100,protein100,fat100,carbs100,sourceUrl=KAUFLAND_DAIRY_URL){
  return assortment('Kaufland',name,id,unitWeight,kcal100,protein100,fat100,carbs100,'Nabiał i jaja','Kaufland · nabiał i jaja (katalog asortymentu)',sourceUrl,'Kaufland');
}

export const lidlProducts=[
  lidl('Chleb górski','chleb-gorski',11408926,500,240,8,2,47),
  lidl('Bochen w stylu rustykalnym','bochen-w-stylu-rustykalnym',11219114,450,250,8,2,50),
  lidl('Bochen orkiszowy na kamieniu z witaminami','bochen-orkiszowy-na-kam-z-witamin',10027134,400,245,9,3,46),
  lidl('Chleb drwalski','chleb-drwalski',11405685,500,230,7,1.5,46),
  lidl('Chleb żytni bez drożdży o niskim indeksie glikemicznym','chleb-zytni-bez-drozdzy-z-niskim-indeksem-glikemicznym',11409332,400,210,6,1.2,44),
  lidl('Chleb na maślance','chleb-na-maslance',11409879,450,250,8,5,43),
  lidl('Chleb wieloziarnisty na kamieniu','chleb-wieloziarnisty-na-kamieniu',11431736,450,240,9,4,40),
  lidl('Chleb pełen ziaren','chleb-pelen-ziaren',11426175,450,250,10,5,39),
  lidl('Chleb słonecznikowy','chleb-slonecznikowy',11275123,450,270,9,7,40),
  lidl('Chleb bałtonowski','chleb-baltonowski',11219107,500,240,7,1.5,49),
  lidl('Chleb typu włoskiego','chleb-typu-wloskiego',11407776,450,260,8,2,50),
  lidl('Bagietka duża','bagietka-duza',11357428,250,270,8,2,53),
  lidl('Półbagietka','polbagietka',11340511,130,265,8,2,52),
  lidl('Bułka ziemniaczana','bulka-ziemniaczana',11031283,70,270,8,4,48),
  lidl('Bułka orkiszowa','bulka-orkiszowa',11419491,70,255,9,3,47),
  lidl('Bułka śniadaniowa fitness','bulka-sniadaniowa-fitness',10000815,70,230,10,2,42),
  lidl('Bułka paryska','bulka-paryska',11421892,240,265,8,2,52),
  lidl('Bułka nacięta','bulka-nacieta',11430111,70,260,8,2,51),
  lidl('Bułka z dynią','bulka-z-dynia',11430015,80,245,8,6,39),
  lidl('Bułka pszenna','bulka-pszenna',11031282,70,265,8,2,52),
  lidl('Bułka poznańska XXL','bulka-poznanska-xxl',11416159,120,270,8,2,53),
  lidl('Bułka kajzerka','bulka-kajzerka',11031284,70,275,8,2,54),
  lidl('Bułka grahamka','bulka-grahamka',11434806,70,250,9,2,47),
  lidl('Bułka z kiełkami żyta','bulka-z-kielkami-zyta',11414023,80,245,9,3,43),
  lidl('Kajzerka wieloziarnista','kajzerka-wieloziarnista',11405680,70,255,9,4,44),
  lidl('Bułka z nasionami rzepaku i omega 3','bulka-z-nasionami-rzepaku-i-omega-3',11434330,80,260,9,6,40),
  lidl('Bułka pszenna (duża)','bulka-pszenna-11436741',11436741,100,265,8,2,53),
  lidl('Bułka wyborna','bulka-wyborna',11437691,80,270,8,3,52),
  lidl('Bułka z ziarnami','bulka-z-ziarnami',11410494,80,260,9,6,42),
  lidl('Bułka ziemniaczana z ziarnami','bulka-ziemniaczana-z-ziarnami',11416420,80,265,8,5,47),
  lidl('Bułka Ziarnella','bulka-ziarnella',11427201,80,255,9,5,42),
  lidl('Bułka typu górskiego','bulka-typu-gorskiego',11432568,70,240,8,2,47),
  lidl('Bułka ze skyrem','bulka-ze-skyrem',11436670,80,250,10,6,36),
  lidl('Bułka rustykalna z ziarnami dyni i słonecznika','bulka-w-stylu-rustykalnym-z-ziarnami-dyni-i-slonecznika',11316086,90,260,9,7,40),
  lidl('Bagietka w stylu francuskim','bagietka-w-stylu-francuskim',11437576,250,265,8,2,53),
  lidl('Bajgiel z makiem','bajgiel-z-makiem',11438009,90,280,9,4,50),
  lidl('Bułka bawarska','bulka-bawarska',11040003,90,270,9,3,50),
  lidl('Croissant z nadzieniem orzechowym','croissant-z-nadzieniem-orzechowym',11209514,85,410,7,22,46,'Słodkie wypieki'),
  lidl('Pączek pistacjowy z belgijską czekoladą','paczek-pistacjowy-z-belgijska-czekolada',11267270,90,380,6,20,45,'Słodkie wypieki'),
  lidl('Donut Pinky','donut-pinky',11006015,75,350,4,17,46,'Słodkie wypieki'),
  lidl('Ciastko francuskie z czekoladą','ciastko-francuskie-z-czekolada',11040067,80,420,6,24,45,'Słodkie wypieki'),
  lidl('Drożdżówka z budyniem','drozdzowka-z-budyniem',11410853,90,320,6,9,52,'Słodkie wypieki'),
  lidl('Malinianka z kruszonką','malinianka-z-kruszonka',11654084,90,360,5,14,53,'Słodkie wypieki'),
  lidl('Fantazja truskawkowa','fantazja-truskawkowa',11336202,90,330,5,10,55,'Słodkie wypieki'),
  lidl('Pączek z nadzieniem wieloowocowym','paczek-z-nadzieniem-wieloowocowym',11432768,80,310,5,12,46,'Słodkie wypieki'),
  lidl('Milka Donut','milka-donut',11253536,75,380,5,20,46,'Słodkie wypieki'),
  lidl('Donut czekoladowy','donut-czekoladowy',10000827,75,370,5,19,45,'Słodkie wypieki'),
  lidl('Ciastko z jabłkiem','ciastko-z-jablkiem',11006401,90,330,4,14,48,'Słodkie wypieki'),
  lidl('Rogal świętomarciński','rogal-swietomarcinski',11406146,100,400,8,16,56,'Słodkie wypieki'),
  lidl('Rogal maślany','rogal-maslany',11410476,80,410,7,22,46,'Słodkie wypieki'),
  lidl('Croissant pistacjowy','croissant-pistacjowy',10027147,85,430,8,25,45,'Słodkie wypieki'),
  lidl('Bagietka z masłem czosnkowym','bagietka-z-maslem-czosnkowym',10000841,180,330,8,14,42,'Pieczywo i wypieki'),
  lidl('Pizzerina z szynką i pieczarkami','pizzerina-z-szynka-i-pieczarkami',10000886,180,280,11,11,34,'Pieczywo i wypieki'),
  lidl('Mini calzone margherita','mini-calzone-margherita',10027140,160,270,11,10,35,'Pieczywo i wypieki'),
  lidl('Precel','precel',10000820,80,290,8,5,53,'Pieczywo i wypieki'),
  lidl('Frusta prosciutto','frusta-prosciutto',10027141,180,310,12,14,33,'Pieczywo i wypieki'),
  lidl('Zapiekanka z pieczarkami i serem','zapiekanka-z-pieczarkami-i-sererm',10027150,180,260,11,11,29,'Pieczywo i wypieki'),
  lidl('Pinsa margherita wypiek na kamieniu','pinsa-margherita-wypiek-na-kam',10027142,160,270,10,9,36,'Pieczywo i wypieki'),
  lidl('Pasztecik grzybowy','pasztecik-grzybowy',10000844,100,280,7,15,29,'Pieczywo i wypieki'),
  lidl('Burek z serem i szpinakiem','burek-z-serem-i-szpinakiem',10000846,120,290,9,15,30,'Pieczywo i wypieki'),
  lidl('Przekąska z serem','przekaska-z-serem',10000823,100,300,10,16,28,'Pieczywo i wypieki'),
  lidl('Cebularz','cebularz',10027143,120,290,7,9,45,'Pieczywo i wypieki'),
  lidl('Twist z rozmarynem','twist-z-rozmarynem',10035513,100,310,8,12,44,'Pieczywo i wypieki')
];

export const kauflandProducts=[
  kaufland('Chleb wiejski','chleb-wiejski',500,230,8,1.5,47),
  kaufland('Wiejski chleb korzeniowy','wiejski-chleb-korzeniowy',500,240,8,2,48),
  kaufland('Chleb cebulowy','chleb-cebulowy',450,260,8,5,45),
  kaufland('Chleb razowy','chleb-razowy',500,220,7,1.5,43),
  kaufland('Chleb słonecznikowy','chleb-slonecznikowy',450,270,9,7,40),
  kaufland('Bułka poznańska','bulka-poznanska',75,270,8,2,53),
  kaufland('Bagietka pszenna duża','bagietka-pszenna-duza',250,265,8,2,52),
  kaufland('Bagietka pszenna','bagietka-pszenna',150,260,8,2,51),
  kaufland('Bagietka czosnkowa','bagietka-czosnkowa',180,330,8,14,42),
  kaufland('Precel','precel',80,290,8,5,53),
  kaufland('Ciabatta','ciabatta',200,260,9,3,50),
  kaufland('Swiss Weckli','swiss-weckli',70,265,8,2,52),
  kaufland('Franzbrötchen','franzbrotchen',100,390,6,18,52),
  kaufland('Bułka orkiszowa','bulka-orkiszowa',70,255,9,3,47)
];

export const lidlMeatProducts=[
  lidlMeat('Filet z piersi kurczaka','mieso-filet-z-piersi-kurczaka',500,106,23,1.3,0),
  lidlMeat('Polędwiczki z kurczaka','mieso-poledwiczki-z-kurczaka',400,108,24,1.2,0),
  lidlMeat('Mięso z uda kurczaka','mieso-z-uda-kurczaka',1000,161,19,9,0),
  lidlMeat('Podudzie z kurczaka','mieso-podudzie-z-kurczaka',1000,161,19,9,0),
  lidlMeat('Skrzydełka z kurczaka','mieso-skrzydelka-z-kurczaka',1000,191,18,13,0),
  lidlMeat('Mięso mielone z kurczaka','mieso-mielone-z-kurczaka',400,143,20,7,0),
  lidlMeat('Mięso mielone wołowe','mieso-mielone-wolowe',400,250,26,17,0),
  lidlMeat('Schab wieprzowy','mieso-schab-wieprzowy',500,143,21,6,0),
  lidlMeat('Karkówka wieprzowa','mieso-karkowka-wieprzowa',500,242,17,19,0),
  lidlMeat('Polędwiczka wieprzowa','mieso-poledwiczka-wieprzowa',400,143,21,6,0),
  lidlMeat('Gulasz wołowy','mieso-gulasz-wolowy',500,200,20,13,0),
  lidlMeat('Stek z polędwicy wołowej','mieso-stek-z-poledwicy-wolowej',300,190,21,12,0),
  lidlMeat('Filet z piersi indyka','mieso-filet-z-piersi-indyka',500,114,24,1.5,0),
  lidlMeat('Mięso mielone z indyka','mieso-mielone-z-indyka',500,150,19,8,0),
  lidlMeat('Kaczka – tuszka','mieso-kaczka-tuszka',1000,300,18,25,0,'https://www.lidl.pl/p/rzeznik-kaczka-tuszka/p11407883'),
  lidlMeat('Szynka wieprzowa, XXL','mieso-szynka-wieprzowa-xxl',1000,143,21,6,0)
];

export const lidlDeliProducts=[
  lidlDeli('Szynka krucha','wedlina-szynka-krucha',150,140,19,6,1),
  lidlDeli('Szynka gotowana w kotle','wedlina-szynka-gotowana-w-kotle',150,110,18,3,1),
  lidlDeli('Szynka wędzona dymem czereśniowym','wedlina-szynka-wedzona-dymem-czeresniowym',150,130,19,5,1),
  lidlDeli('Schab wędzony dymem czereśniowym','wedlina-schab-wedzony-dymem-czeresniowym',150,130,20,5,1),
  lidlDeli('Polędwica sopocka','wedlina-poledwica-sopocka',100,140,20,6,1),
  lidlDeli('Polędwica łososiowa','wedlina-poledwica-lososiowa',100,145,20,7,1),
  lidlDeli('Kiełbasa Krakowska sucha','wedlina-kielbasa-krakowska-sucha',100,300,25,22,2),
  lidlDeli('Kiełbasa Śląska, wieprzowa','wedlina-kielbasa-slaska-wieprzowa',400,280,16,23,2),
  lidlDeli('Kabanosy wieprzowe','wedlina-kabanosy-wieprzowe',100,350,30,26,2),
  lidlDeli('Salami dojrzewające','wedlina-salami-dojrzewajace',100,400,25,32,2),
  lidlDeli('Parówki z szynki wieprzowej','wedlina-parowki-z-szynki-wieprzowej',250,260,13,22,3),
  lidlDeli('Frankfurterki z szynki','wedlina-frankfurterki-z-szynki',450,270,13,23,3),
  lidlDeli('Boczek wędzony','wedlina-boczek-wedzony',150,400,12,38,1),
  lidlDeli('Pasztet borowy','wedlina-pasztet-borowy',200,280,12,23,5),
  lidlDeli('Kiełbasa biała z szynki','wedlina-kielbasa-biala-z-szynki',500,260,15,21,2)
];

export const lidlDairyProducts=[
  lidlDairy('Mleko świeże 3,2%','nabial-mleko-swieze-3-2',1000,61,3.2,3.2,4.7),
  lidlDairy('Mleko świeże 2%','nabial-mleko-swieze-2',1000,50,3.4,2,4.7),
  lidlDairy('Mleko UHT 3,2%','nabial-mleko-uht-3-2',1000,61,3.2,3.2,4.7),
  lidlDairy('Mleko UHT 1,5%','nabial-mleko-uht-1-5',1000,46,3.4,1.5,4.8),
  lidlDairy('Mleko UHT 0,5%','nabial-mleko-uht-0-5',1000,36,3.4,0.5,4.9),
  lidlDairy('Kefir naturalny 2%','nabial-kefir-naturalny-2',400,55,3.4,2,4),
  lidlDairy('Maślanka naturalna','nabial-maslanka-naturalna',1000,40,3.3,1,4.5),
  lidlDairy('Masło ekstra 82% zawartości tłuszczu','nabial-maslo-ekstra-82',200,735,0.7,82,0.7),
  lidlDairy('Śmietana do zup i sosów 18%','nabial-smietana-18',400,180,2.5,18,3.5),
  lidlDairy('Śmietana naturalna 12%','nabial-smietana-12',400,130,2.7,12,3.8),
  lidlDairy('Śmietanka kremowa 30%','nabial-smietanka-kremowa-30',330,300,2.4,30,3),
  lidlDairy('Serek wiejski naturalny','nabial-serek-wiejski-naturalny',200,98,11,3,4),
  lidlDairy('Serek wiejski lekki','nabial-serek-wiejski-lekki',200,75,12,1.5,3.5),
  lidlDairy('Serek wiejski wysokobiałkowy','nabial-serek-wiejski-wysokobialkowy',200,85,15,1,3),
  lidlDairy('Twaróg chudy','nabial-twarog-chudy',250,100,18,1,3.5),
  lidlDairy('Twaróg półtłusty','nabial-twarog-poltlusty',250,133,18,5,2),
  lidlDairy('Twaróg tłusty','nabial-twarog-tlusty',250,170,17,10,2),
  lidlDairy('Jogurt naturalny kremowy','nabial-jogurt-naturalny-kremowy',400,70,4,3,6),
  lidlDairy('Jogurt naturalny typ grecki','nabial-jogurt-naturalny-grecki',400,133,4,10,5),
  lidlDairy('Jogurt owocowy truskawka','nabial-jogurt-owocowy-truskawka',150,95,3.5,2,16),
  lidlDairy('Skyr stylu islandzkim – wanilia','nabial-skyr-wanilia',150,90,9,0.3,12),
  lidlDairy('Ser Gouda','nabial-ser-gouda',150,356,25,27,2),
  lidlDairy('Ser Edam','nabial-ser-edam',250,330,25,24,2),
  lidlDairy('Cheddar','nabial-cheddar',250,410,25,34,1),
  lidlDairy('Mozzarella','nabial-mozzarella',300,240,18,18,2),
  lidlDairy('Camembert klasyczny','nabial-camembert',250,300,20,24,1),
  lidlDairy('Brie ser pleśniowy','nabial-brie',200,334,21,28,0.5),
  lidlDairy('Ser feta','nabial-ser-feta',200,264,14,21,4),
  lidlDairy('Burrata','nabial-burrata',125,280,17,23,2)
];

export const kauflandMeatProducts=[
  kauflandMeat('Schab','mieso-schab',500,143,21,6,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/schab.html'),
  kauflandMeat('Karkówka','mieso-karkowka',500,242,17,19,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/karkowka.html'),
  kauflandMeat('Polędwica wieprzowa','mieso-poledwica-wieprzowa',400,143,21,6,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/poledwica-wieprzowa.html'),
  kauflandMeat('Golonka wieprzowa','mieso-golonka-wieprzowa',1000,260,17,21,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/golonka-wieprzowa.html'),
  kauflandMeat('Boczek wieprzowy','mieso-boczek-wieprzowy',500,400,12,38,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/boczek-wieprzowy.html'),
  kauflandMeat('Udziec wieprzowy','mieso-udziec-wieprzowy',1000,200,19,13,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/udziec-wieprzowy.html'),
  kauflandMeat('Mięso mielone wieprzowe','mieso-mielone-wieprzowe',400,280,20,22,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/mielone-mieso-wieprzowe.html'),
  kauflandMeat('Rostbef','mieso-rostbef',500,200,21,13,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wolowina/rostbeef.html'),
  kauflandMeat('Polędwica wołowa','mieso-poledwica-wolowa',500,190,21,12,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wolowina/filet-wolowy.html'),
  kauflandMeat('Mielone mięso wołowe','mieso-mielone-wolowe',400,250,26,17,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wolowina/mielone-mieso-wolowe.html'),
  kauflandMeat('Stek wołowy','mieso-stek-wolowy',300,190,21,12,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wolowina/steki-wolowe.html'),
  kauflandMeat('Kurczak','mieso-kurczak',1000,215,18,15,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kurczak.html'),
  kauflandMeat('Pierś z kurczaka','mieso-piers-z-kurczaka',500,106,23,1.3,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kurczak.html'),
  kauflandMeat('Udo z kurczaka','mieso-udo-z-kurczaka',1000,161,19,9,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kurczak.html'),
  kauflandMeat('Podudzie z kurczaka','mieso-podudzie-z-kurczaka',1000,161,19,9,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kurczak.html'),
  kauflandMeat('Skrzydełka z kurczaka','mieso-skrzydelka-z-kurczaka',1000,191,18,13,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kurczak.html'),
  kauflandMeat('Indyk','mieso-indyk',1000,160,20,8,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/indyk.html'),
  kauflandMeat('Pierś z indyka','mieso-piers-z-indyka',500,114,24,1.5,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/indyk.html'),
  kauflandMeat('Kaczka','mieso-kaczka',1000,300,18,25,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/drob/kaczka.html'),
  kauflandMeat('Jagnięcina','mieso-jagniecina',1000,230,18,17,0,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/jagniecina.html')
];

export const kauflandDeliProducts=[
  kauflandDeli('Schab wędzony','wedlina-schab-wedzony',150,130,20,5,1,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/wieprzowina/peklowany-schab.html'),
  kauflandDeli('Biała kiełbasa parzona','wedlina-biala-kielbasa-parzona',500,260,15,21,2,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/mieso-i-wedliny/kielbasa-parzona.html'),
  kauflandDeli('Kiełbasa gotowana','wedlina-kielbasa-gotowana',400,250,14,20,2,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/mieso-i-wedliny/kielbasa-gotowana.html'),
  kauflandDeli('Kiełbasa surowa','wedlina-kielbasa-surowa',500,300,16,25,1,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/mieso/mieso-i-wedliny/kielbasa-surowa.html'),
  kauflandDeli('Kabanosy','wedlina-kabanosy',100,350,30,26,2),
  kauflandDeli('Parówki','wedlina-parowki',250,260,13,22,3),
  kauflandDeli('Salami','wedlina-salami',100,400,25,32,2),
  kauflandDeli('Pasztet','wedlina-pasztet',200,280,12,23,5)
];

export const kauflandDairyProducts=[
  kauflandDairy('Mleko świeże','nabial-mleko-swieze',1000,61,3.2,3.2,4.7,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/mleko.html'),
  kauflandDairy('Mleko UHT','nabial-mleko-uht',1000,61,3.2,3.2,4.7,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/mleko.html'),
  kauflandDairy('Mleko 2%','nabial-mleko-2',1000,50,3.4,2,4.7,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/mleko.html'),
  kauflandDairy('Kefir','nabial-kefir',400,55,3.4,2,4),
  kauflandDairy('Maślanka','nabial-maslanka',1000,40,3.3,1,4.5),
  kauflandDairy('Jogurt naturalny','nabial-jogurt-naturalny',400,70,4,3,6),
  kauflandDairy('Jogurt grecki','nabial-jogurt-grecki',400,133,4,10,5),
  kauflandDairy('Twaróg','nabial-twarog',250,133,18,5,2),
  kauflandDairy('Serek wiejski','nabial-serek-wiejski',200,98,11,3,4),
  kauflandDairy('Śmietana 18%','nabial-smietana-18',400,180,2.5,18,3.5),
  kauflandDairy('Śmietana 12%','nabial-smietana-12',400,130,2.7,12,3.8),
  kauflandDairy('Masło','nabial-maslo',200,735,0.7,82,0.7),
  kauflandDairy('Ser Gouda','nabial-ser-gouda',150,356,25,27,2,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/ser.html'),
  kauflandDairy('Ser Edam','nabial-ser-edam',250,330,25,24,2,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/ser.html'),
  kauflandDairy('Mozzarella','nabial-mozzarella',300,240,18,18,2,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/ser.html'),
  kauflandDairy('Ser pleśniowy','nabial-ser-plesniowy',200,300,20,24,1,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/ser.html'),
  kauflandDairy('Jajka','nabial-jajka',60,143,12.5,9.5,0.7,'https://sklep.kaufland.pl/asortyment/produkty-spozywcze/produkty-mleczne-i-jajka/jajka.html')
];

const biedronkaSingleUnits=biedronkaProducts.map(p=>/(\d+)\s*[x×]\s*\d+/i.test(p.name)?{...p,unitWeight:null}:p);
export const storeProducts=[...biedronkaSingleUnits,...lidlProducts,...lidlMeatProducts,...lidlDeliProducts,...lidlDairyProducts,...kauflandProducts,...kauflandMeatProducts,...kauflandDeliProducts,...kauflandDairyProducts];

export const storeCatalogInfo={
  count:storeProducts.length,
  biedronka:biedronkaCatalogInfo.count,
  lidl:lidlProducts.length+lidlMeatProducts.length+lidlDeliProducts.length+lidlDairyProducts.length,
  kaufland:kauflandProducts.length+kauflandMeatProducts.length+kauflandDeliProducts.length+kauflandDairyProducts.length,
  lidlMeat:lidlMeatProducts.length,lidlDeli:lidlDeliProducts.length,lidlDairy:lidlDairyProducts.length,
  kauflandMeat:kauflandMeatProducts.length,kauflandDeli:kauflandDeliProducts.length,kauflandDairy:kauflandDairyProducts.length,
  note:'Biedronka: wartości z oficjalnych kart produktów. Lidl i Kaufland: nazwy z oficjalnych stron asortymentu (piekarnia, mięso, wędliny, nabiał), wartości orientacyjne dla typu produktu.'
};
