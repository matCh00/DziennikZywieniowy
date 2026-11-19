/**
 * Lekki katalog startowy produktów ogólnych (nie katalog SKU sieci).
 * Wartości są referencyjne i mają charakter orientacyjny; wartości opakowanych
 * produktów należy zawsze weryfikować z etykietą konkretnego produktu.
 * Jedyny rekord oznaczony jako bezpośrednio zweryfikowany w tym pliku pochodzi
 * z DTU Frida 6.1; zob. docs/KATALOG_STARTOWY.md.
 */
const rows = [
// OWOCE
['banana','Banan','Owoce',89,1.1,.3,22.8,120,'banany'],['apple','Jabłko','Owoce',52,.3,.2,13.8,180,'jabłko czerwone antonówka'],['pear','Gruszka','Owoce',57,.4,.1,15.2,170,'gruszki'],['orange','Pomarańcza','Owoce',47,.9,.1,11.8,150,'pomarańcze'],['mandarin','Mandarynka','Owoce',53,.8,.3,13.3,85,'mandarynki'],['kiwi','Kiwi','Owoce',61,1.1,.5,14.7,75,'kiwi zielone'],['strawberry','Truskawki','Owoce',32,.7,.3,7.7,12,'truskawka'],['blueberry','Borówki amerykańskie','Owoce',57,.7,.3,14.5,5,'borówki jagody'],['raspberry','Maliny','Owoce',52,1.2,.7,11.9,4,'malina'],['grape','Winogrona','Owoce',69,.7,.2,18.1,5,'winogrono'],['plum','Śliwka','Owoce',46,.7,.3,11.4,65,'śliwki'],['peach','Brzoskwinia','Owoce',39,.9,.3,9.5,150,'brzoskwinie'],['nectarine','Nektarynka','Owoce',44,1.1,.3,10.6,140,'nektarynki'],['watermelon','Arbuz','Owoce',30,.6,.2,7.6,300,'arbuz'],['melon','Melon','Owoce',34,.8,.2,8.2,250,'melon'],['pineapple','Ananas','Owoce',50,.5,.1,13.1,80,'ananas'],['mango','Mango','Owoce',60,.8,.4,15,200,'mango'],['lemon','Cytryna','Owoce',29,1.1,.3,9.3,60,'cytryna'],['avocado','Awokado','Owoce',160,2,14.7,8.5,70,'awokado hass'],['pomegranate','Granat','Owoce',83,1.7,1.2,18.7,175,'granat'],['cherries','Wiśnie','Owoce',50,1,.3,12.2,8,'wiśnia czereśnie'],['cherry','Czereśnie','Owoce',63,1.1,.2,16,8,'czereśnia'],['blackcurrant','Porzeczka czarna','Owoce',63,1.4,.4,15.4,3,'czarna porzeczka'],['cranberry','Żurawina świeża','Owoce',46,.4,.1,12.2,2,'żurawina'],
// WARZYWA
['tomato','Pomidor','Warzywa',18,.9,.2,3.9,120,'pomidory'],['cherry-tomato','Pomidor koktajlowy','Warzywa',18,.9,.2,3.9,15,'koktajlowe cherry'],['cucumber','Ogórek','Warzywa',15,.7,.1,3.6,100,'ogórek zielony'],['pepper-red','Papryka czerwona','Warzywa',31,1,.3,6,150,'papryka'],['pepper-yellow','Papryka żółta','Warzywa',27,1,.2,6.3,150,'papryka'],['carrot','Marchew','Warzywa',41,.9,.2,9.6,60,'marchewka'],['broccoli','Brokuł surowy','Warzywa',34,2.8,.4,6.6,150,'brokuły'],['broccoli-cooked','Brokuł gotowany','Warzywa',35,2.4,.4,7.2,150,'brokuł na parze'],['cauliflower','Kalafior surowy','Warzywa',25,1.9,.3,5,150,'kalafior'],['cauliflower-cooked','Kalafior gotowany','Warzywa',23,1.8,.5,4.1,150,'kalafior na parze'],['potato','Ziemniaki gotowane','Warzywa',87,1.9,.1,20.1,180,'ziemniak ziemniaki'],['potato-raw','Ziemniaki surowe','Warzywa',77,2,.1,17.5,180,'ziemniaki surowe'],['sweet-potato','Bataty pieczone','Warzywa',90,2,.2,20.7,150,'batat patat'],['beetroot','Burak gotowany','Warzywa',44,1.7,.2,10,100,'buraki'],['onion','Cebula','Warzywa',40,1.1,.1,9.3,70,'cebula'],['garlic','Czosnek','Warzywa',149,6.4,.5,33.1,5,'ząbek czosnku'],['lettuce','Sałata masłowa','Warzywa',14,1.4,.2,2.9,30,'sałata'],['spinach','Szpinak świeży','Warzywa',23,2.9,.4,3.6,30,'szpinak baby'],['zucchini','Cukinia','Warzywa',17,1.2,.3,3.1,200,'cukinia'],['eggplant','Bakłażan','Warzywa',25,1,.2,6,'200','oberżyna'],['mushroom','Pieczarki','Warzywa',22,3.1,.3,3.3,100,'pieczarka'],['cabbage','Kapusta biała','Warzywa',25,1.3,.1,5.8,100,'kapusta'],['red-cabbage','Kapusta czerwona','Warzywa',31,1.4,.2,7.4,100,'czerwona kapusta'],['brussels','Brukselka gotowana','Warzywa',36,2.6,.5,7.1,100,'brukselki'],['green-beans','Fasolka szparagowa gotowana','Warzywa',35,1.9,.3,7.9,150,'fasolka'],['peas','Groszek zielony gotowany','Warzywa',84,5.4,.2,15.6,100,'groszek'],['corn','Kukurydza gotowana','Warzywa',96,3.4,1.5,21,100,'kukurydza kolba'],['celery','Seler korzeniowy','Warzywa',42,1.5,.3,9.2,100,'seler'],['radish','Rzodkiewka','Warzywa',16,.7,.1,3.4,10,'rzodkiewki'],['leek','Por','Warzywa',61,1.5,.3,14.2,100,'por'],['pumpkin','Dynia','Warzywa',26,1,.1,6.5,150,'dynia'],['asparagus','Szparagi gotowane','Warzywa',22,2.4,.2,4.1,100,'szparagi'],['pickles','Ogórki kiszone','Warzywa',11,.5,.1,1.9,40,'kiszony kiszone'],['sauerkraut','Kapusta kiszona','Warzywa',19,1.1,.1,4.3,100,'kiszona'],['olives','Oliwki zielone','Warzywa',145,1,15.3,3.8,5,'oliwka'],
// PIECZYWO — rozbudowany zestaw wariantów do wyszukiwania „bułka”
['roll','Bułka kajzerka pszenna','Pieczywo',297,9,3.5,56,60,'kajzerka bułka zwykła pszenna'],['roll-wheat','Bułka pszenna zwykła','Pieczywo',285,9,2.5,56,65,'bułki pszenne zwykłe'],['roll-graham','Bułka grahamka','Pieczywo',270,9.5,3,50,75,'grahamki bułka graham'],['roll-multigrain','Bułka wieloziarnista','Pieczywo',285,10,6,45,80,'bułka z ziarnami wieloziarnowa'],['roll-seeds','Bułka z ziarnami','Pieczywo',295,10,7,44,80,'bułki z pestkami słonecznika dyni'],['roll-rye','Bułka żytnia','Pieczywo',259,8.5,3.3,48,75,'bułka razowa żytnia'],['roll-spelt','Bułka orkiszowa','Pieczywo',275,10,4,49,75,'bułki orkisz'],['roll-protein','Bułka proteinowa','Pieczywo',265,20,8,25,80,'bułka wysokobiałkowa proteina'],['roll-milk','Bułka mleczna','Pieczywo',316,9,7,53,50,'bułeczka mleczna'],['roll-butter','Bułka maślana','Pieczywo',330,8,9,53,55,'bułeczka maślana'],['roll-sweet','Bułka słodka drożdżowa','Pieczywo',296,9.1,6.6,48.7,60,'bułka słodka drożdżówka'],['roll-hotdog','Bułka do hot doga','Pieczywo',280,9,4,51,65,'hot dog bułka hotdog'],['roll-burger','Bułka hamburgerowa','Pieczywo',295,9,6,50,75,'bułka burgerowa'],['roll-bagel','Bajgiel pszenny','Pieczywo',270,10,1.5,53,90,'obwarzanek bajgiel'],['roll-pretzel','Precel pszenny','Pieczywo',320,10,3,63,70,'precelki'],['roll-ciabatta','Bułka ciabatta','Pieczywo',271,8.5,3.5,51,90,'ciabatta'],['roll-baguette','Bagietka pszenna','Pieczywo',274,9,1.5,57,100,'bagietka'],['roll-baguette-grain','Bagietka pełnoziarnista','Pieczywo',260,9,3,48,100,'bagietka razowa'],['roll-spelt-grain','Bułka orkiszowa pełnoziarnista','Pieczywo',265,10,4,46,80,'orkiszowa razowa'],['roll-glutenfree','Bułka bezglutenowa','Pieczywo',275,4,5,53,70,'pieczywo bez glutenu'],['roll-brioche','Bułka brioche','Pieczywo',330,9,12,48,70,'brioszka'],['roll-pita','Chlebek pita','Pieczywo',275,9,1.2,56,70,'pita'],['roll-tortilla','Tortilla pszenna','Pieczywo',310,8.5,8,50,60,'placek tortilla wrap'],['roll-tortilla-whole','Tortilla pełnoziarnista','Pieczywo',300,9,7,48,60,'wrap pełnoziarnisty'],['bread','Chleb żytni','Pieczywo',259,8.5,3.3,48,40,'chleb razowy'],['bread-whole','Chleb pełnoziarnisty','Pieczywo',247,9,3.5,43,40,'chleb ziarnisty'],['bread-wheat','Chleb pszenny','Pieczywo',265,8.5,3.2,49,40,'chleb biały'],['bread-sourdough','Chleb na zakwasie','Pieczywo',250,8.5,1.5,49,45,'zakwas chleb'],['bread-protein','Chleb proteinowy','Pieczywo',260,22,8,25,40,'chleb wysokobiałkowy'],['toast','Chleb tostowy pszenny','Pieczywo',270,8.5,4,49,25,'tostowy tosty'],['crispbread','Pieczywo chrupkie żytnie','Pieczywo',350,10,2,67,10,'wasa chrupkie'],['rice-cake','Wafle ryżowe naturalne','Pieczywo',387,8,3,81,7,'wafle ryżowe'],['rusks','Sucharki pszenne','Pieczywo',390,11,5,74,10,'sucharek'],
// PRODUKTY ZBOŻOWE / SUCHE
['oats','Płatki owsiane','Produkty zbożowe',366,13.5,7,58.7,40,'owsianka płatki'],['oats-instant','Płatki owsiane błyskawiczne','Produkty zbożowe',370,13,7,60,40,'błyskawiczne'],['oats-bran','Otręby owsiane','Produkty zbożowe',246,17,7,66,15,'otręby'],['cornflakes','Płatki kukurydziane','Produkty zbożowe',357,7, .4,84,30,'corn flakes'],['muesli','Musli klasyczne','Produkty zbożowe',360,10,6,64,45,'musli'],['granola','Granola','Produkty zbożowe',450,10,18,60,40,'granola'],['buckwheat-dry','Kasza gryczana sucha','Produkty zbożowe',343,13.3,3.4,71.5,60,'gryczana'],['buckwheat-cooked','Kasza gryczana gotowana','Produkty zbożowe',92,3.4,.6,19.9,150,'kasza gryczana ugotowana'],['millet-dry','Kasza jaglana sucha','Produkty zbożowe',378,11,.9,73,60,'jaglana'],['millet-cooked','Kasza jaglana gotowana','Produkty zbożowe',119,3.5,1,23.7,150,'kasza jaglana ugotowana'],['barley-dry','Kasza jęczmienna sucha','Produkty zbożowe',354,9.9,1.2,77,60,'pęczak jęczmienna'],['barley-cooked','Kasza jęczmienna gotowana','Produkty zbożowe',123,2.3,.4,27.6,150,'kasza jęczmienna ugotowana'],['bulgur-dry','Bulgur suchy','Produkty zbożowe',342,12.3,1.3,75.9,60,'kasza bulgur'],['bulgur-cooked','Bulgur gotowany','Produkty zbożowe',83,3.1,.2,18.6,150,'bulgur ugotowany'],['couscous-dry','Kuskus suchy','Produkty zbożowe',376,12.8,.6,77.4,60,'kus kus'],['couscous-cooked','Kuskus gotowany','Produkty zbożowe',112,3.8,.2,23.2,150,'kuskus ugotowany'],['quinoa-dry','Komosa ryżowa sucha','Produkty zbożowe',368,14.1,6.1,64.2,60,'quinoa'],['quinoa-cooked','Komosa ryżowa gotowana','Produkty zbożowe',120,4.4,1.9,21.3,150,'quinoa ugotowana'],['rice-dry','Ryż biały suchy','Produkty zbożowe',360,7,.7,80,60,'ryż biały'],['rice-cooked','Ryż biały gotowany','Produkty zbożowe',130,2.7,.3,28,150,'ryż ugotowany'],['rice-brown-dry','Ryż brązowy suchy','Produkty zbożowe',370,7.5,2.7,77,60,'ryż pełnoziarnisty'],['rice-brown-cooked','Ryż brązowy gotowany','Produkty zbożowe',123,2.7,1,25.6,150,'ryż brązowy ugotowany'],['pasta-dry','Makaron pszenny suchy','Produkty zbożowe',371,13,1.5,74,80,'makaron pasta'],['pasta-cooked','Makaron pszenny gotowany','Produkty zbożowe',158,5.8,.9,30.9,150,'makaron ugotowany'],['pasta-whole-dry','Makaron pełnoziarnisty suchy','Produkty zbożowe',350,13,2.5,67,80,'makaron razowy'],['pasta-whole-cooked','Makaron pełnoziarnisty gotowany','Produkty zbożowe',149,5.5,1.2,28,150,'makaron razowy gotowany'],['pasta-egg-dry','Makaron jajeczny suchy','Produkty zbożowe',370,13,3.5,70,80,'makaron jajeczny'],['pasta-rice-dry','Makaron ryżowy suchy','Produkty zbożowe',364,5.9,.6,80,80,'makaron ryżowy'],['flour-wheat','Mąka pszenna typ 450','Produkty zbożowe',343,10,1,73,20,'mąka tortowa'],['flour-whole','Mąka pszenna pełnoziarnista','Produkty zbożowe',339,13,2.5,61,20,'mąka razowa'],['flour-rye','Mąka żytnia','Produkty zbożowe',325,9,2,68,20,'mąka żytnia'],['semolina','Kasza manna sucha','Produkty zbożowe',360,10,1,76,30,'manna'],['breadcrumbs','Bułka tarta','Produkty zbożowe',350,10,5,68,15,'tarta panierka'],
// NABIAŁ I JAJA
['milk','Mleko 2%','Nabiał i jaja',50,3.4,2,4.8,250,'mleko'],['milk-0','Mleko 0,5%','Nabiał i jaja',38,3.4,.5,4.9,250,'mleko odtłuszczone'],['milk-3-2','Mleko 3,2%','Nabiał i jaja',62,3.2,3.2,4.7,250,'mleko pełne'],['lactosefree','Mleko bez laktozy 2%','Nabiał i jaja',50,3.4,2,4.8,250,'bez laktozy'],['kefir','Kefir naturalny 2%','Nabiał i jaja',51,3.4,2,4.7,250,'kefir'],['buttermilk','Maślanka naturalna','Nabiał i jaja',45,3.4,1.5,4.7,250,'maślanka'],['yogurt','Jogurt naturalny 2%','Nabiał i jaja',60,4.3,2,6,150,'jogurt'],['yogurt-greek','Jogurt typu greckiego 10%','Nabiał i jaja',133,4,10,4,150,'jogurt grecki'],['yogurt-protein','Jogurt wysokobiałkowy naturalny','Nabiał i jaja',65,10,0.5,4,150,'proteinowy jogurt'],['skyr','Skyr naturalny','Nabiał i jaja',63,11,.2,4,150,'skyr'],['skyr-fruit','Skyr owocowy','Nabiał i jaja',85,9,.2,11,150,'skyr smakowy'],['cottage','Twaróg półtłusty','Nabiał i jaja',133,18.7,4.7,3.7,100,'twaróg'],['cottage-fat','Twaróg chudy','Nabiał i jaja',99,19.8,.5,3.5,100,'chudy twaróg'],['cottage-fatty','Twaróg tłusty','Nabiał i jaja',175,17.7,10,3.5,100,'tłusty twaróg'],['cottage-cheese','Serek wiejski naturalny','Nabiał i jaja',97,11,5,2.5,200,'serek wiejski'],['cottage-cheese-light','Serek wiejski lekki','Nabiał i jaja',81,11,3,2.5,200,'lekki serek wiejski'],['cream-cheese','Serek śmietankowy naturalny','Nabiał i jaja',235,6,22,4,30,'serek kremowy'],['cream-13','Śmietanka 13%','Nabiał i jaja',151,2.9,13.5,4.3,15,'śmietanka 13 procent'],['cream-18','Śmietana 18%','Nabiał i jaja',188,2.7,18,3.6,20,'śmietana'],['cream-30','Śmietanka 30%','Nabiał i jaja',292,2.2,30,3.1,15,'kremówka'],['butter','Masło 82%','Nabiał i jaja',744,.7,82,.7,10,'masło'],['gouda','Ser gouda','Nabiał i jaja',356,25,27,2.2,20,'gouda ser żółty'],['mozzarella','Mozzarella','Nabiał i jaja',280,28,17,2.2,50,'mozzarella'],['feta','Ser feta','Nabiał i jaja',265,14,21,4,30,'feta'],['emmental','Ser ementaler','Nabiał i jaja',380,28,29,0,20,'ementaler'],['parmesan','Parmezan','Nabiał i jaja',392,35,29,0,10,'parmezan'],['cream-cheese-light','Serek topiony','Nabiał i jaja',290,13,24,3,20,'ser topiony'],['egg','Jajo kurze całe','Nabiał i jaja',143,12.6,9.5,.7,55,'jajko jajka'],['egg-white','Białko jaja kurzego','Nabiał i jaja',44,10.2,0,.9,33,'białko jajka'],['egg-yolk','Żółtko jaja kurzego','Nabiał i jaja',322,16,27,3.6,18,'żółtko'],
// MIĘSO, RYBY I WĘDLINY
['chicken','Pierś z kurczaka surowa bez skóry','Mięso i ryby',120,22.5,2.6,0,150,'kurczak pierś filet surowy'],['chicken-cooked','Pierś z kurczaka gotowana','Mięso i ryby',165,31,3.6,0,130,'kurczak filet gotowany'],['chicken-grilled','Pierś z kurczaka grillowana','Mięso i ryby',165,31,3.6,0,130,'kurczak grill'],['chicken-fried','Pierś z kurczaka smażona bez panierki','Mięso i ryby',190,29,7,0,130,'kurczak smażony'],['chicken-breaded','Kurczak panierowany smażony','Mięso i ryby',260,18,13,18,120,'kotlet panierowany'],['chicken-thigh','Udko z kurczaka bez skóry surowe','Mięso i ryby',121,19.7,4.1,0,130,'udko kurczaka'],['turkey-breast','Pierś z indyka surowa','Mięso i ryby',105,24,1,0,150,'indyk filet'],['turkey-cooked','Pierś z indyka pieczona','Mięso i ryby',147,30,2,0,130,'indyk pieczony'],['pork-loin','Schab wieprzowy surowy','Mięso i ryby',143,21,6,0,150,'schab'],['pork-loin-baked','Schab pieczony','Mięso i ryby',190,29,7,0,130,'schab pieczony'],['pork-tenderloin','Polędwiczka wieprzowa surowa','Mięso i ryby',120,22,3,0,150,'polędwica wieprzowa'],['beef-mince','Wołowina mielona 10% tłuszczu surowa','Mięso i ryby',176,20,10,0,150,'mielona wołowina'],['beef-steak','Stek wołowy grillowany','Mięso i ryby',217,27,12,0,150,'stek'],['beef-goulash','Wołowina na gulasz surowa','Mięso i ryby',150,21,7,0,150,'gulasz wołowy'],['ham','Szynka z indyka','Mięso i ryby',105,18,3,2,30,'wędlina indyk'],['ham-pork','Szynka wieprzowa gotowana','Mięso i ryby',145,21,6,1,30,'szynka'],['chicken-ham','Szynka drobiowa','Mięso i ryby',98,17,2,2,30,'szynka drobiowa'],['sausage','Kiełbasa śląska','Mięso i ryby',280,16,23,1,70,'kiełbasa'],['frankfurter','Parówka drobiowa','Mięso i ryby',220,11,18,2,50,'parówki'],['sausage-chicken','Kiełbasa drobiowa','Mięso i ryby',190,15,14,2,70,'kiełbasa z kurczaka'],['bacon','Boczek wędzony','Mięso i ryby',400,14,38,0,20,'boczek'],['salami','Salami','Mięso i ryby',407,22,35,1,20,'salami'],['salmon','Łosoś surowy','Mięso i ryby',208,20,13,0,120,'łosoś'],['salmon-baked','Łosoś pieczony','Mięso i ryby',206,22,12,0,120,'łosoś pieczony'],['cod','Dorsz surowy','Mięso i ryby',82,18,0.7,0,150,'dorsz'],['cod-baked','Dorsz pieczony','Mięso i ryby',105,23,.9,0,150,'dorsz pieczony'],['tuna','Tuńczyk w sosie własnym odsączony','Mięso i ryby',116,26,1,0,120,'tuńczyk konserwa'],['mackerel','Makrela wędzona','Mięso i ryby',305,19,25,0,80,'makrela'],['sardine','Sardynki w oleju odsączone','Mięso i ryby',208,25,11,0,90,'sardynki'],['shrimp','Krewetki gotowane','Mięso i ryby',99,24,.3,0,100,'krewetka'],['fish-sticks','Paluszki rybne panierowane','Mięso i ryby',220,12,10,20,100,'paluszki rybne'],
// STRĄCZKI, KONSERWY, ROŚLINNE
['lentils','Soczewica gotowana','Rośliny strączkowe',116,9,.4,20,150,'soczewica'],['lentils-dry','Soczewica sucha','Rośliny strączkowe',352,25,1.1,60,60,'soczewica sucha'],['chickpeas','Ciecierzyca gotowana','Rośliny strączkowe',164,8.9,2.6,27.4,150,'ciecierzyca'],['beans-white','Fasola biała gotowana','Rośliny strączkowe',139,9.7,.5,25,150,'fasola'],['kidney','Fasola czerwona kidney konserwowa odsączona','Rośliny strączkowe',127,8.7,.5,22.8,130,'kidney'],['soybeans','Edamame gotowane','Rośliny strączkowe',121,12,5.2,8.9,100,'soja edamame'],['tofu','Tofu naturalne','Rośliny strączkowe',144,17.3,8.7,2.8,100,'tofu'],['hummus','Hummus klasyczny','Rośliny strączkowe',240,7.9,17.8,14.3,30,'humus'],['corn-canned','Kukurydza konserwowa odsączona','Konserwy',90,3.2,1.2,17.6,100,'kukurydza puszka'],['tomato-canned','Pomidory krojone z puszki','Konserwy',24,1.2,.2,4.2,100,'pomidory puszka'],['tuna-oil','Tuńczyk w oleju odsączony','Konserwy',198,29,8,0,100,'tuńczyk olej'],
// TŁUSZCZE, SOSY, DODATKI
['olive-oil','Oliwa z oliwek','Tłuszcze i dodatki',884,0,100,0,5,'oliwa'],['rapeseed-oil','Olej rzepakowy','Tłuszcze i dodatki',884,0,100,0,5,'olej'],['sunflower-oil','Olej słonecznikowy','Tłuszcze i dodatki',884,0,100,0,5,'olej'],['coconut-oil','Olej kokosowy','Tłuszcze i dodatki',892,0,100,0,5,'kokosowy'],['margarine','Margaryna miękka','Tłuszcze i dodatki',540,.5,60,.5,10,'margaryna'],['peanut-butter','Masło orzechowe','Tłuszcze i dodatki',588,25,50,20,15,'masło z orzechów'],['almond-butter','Masło migdałowe','Tłuszcze i dodatki',614,21,56,19,15,'krem migdałowy'],['mayonnaise','Majonez','Tłuszcze i dodatki',680,1,75,1,15,'majonez'],['ketchup','Ketchup','Tłuszcze i dodatki',105,1.5,.2,24,15,'keczup'],['mustard','Musztarda','Tłuszcze i dodatki',66,4,4,5,10,'musztarda'],['soy-sauce','Sos sojowy','Tłuszcze i dodatki',53,8,.6,4.9,10,'sojowy'],['pesto','Pesto zielone','Tłuszcze i dodatki',430,5,42,7,15,'pesto'],['honey','Miód','Tłuszcze i dodatki',304,.3,0,82,10,'miod'],['jam','Dżem owocowy','Tłuszcze i dodatki',250,.4,.1,62,20,'dżem konfitura'],['sugar','Cukier biały','Tłuszcze i dodatki',400,0,0,100,5,'cukier'],['maple','Syrop klonowy','Tłuszcze i dodatki',260,.1,.1,67,15,'syrop klonowy'],
// ORZECHY I PRZEKĄSKI
['almonds','Migdały','Orzechy i przekąski',579,21,50,22,15,'migdał'],['walnuts','Orzechy włoskie','Orzechy i przekąski',654,15,65,14,15,'orzech włoski'],['cashews','Orzechy nerkowca','Orzechy i przekąski',553,18,44,30,15,'nerkowce'],['peanuts','Orzeszki ziemne','Orzechy i przekąski',567,26,49,16,15,'fistaszki'],['pistachio','Pistacje','Orzechy i przekąski',562,20,45,28,15,'pistacja'],['pumpkin-seeds','Pestki dyni','Orzechy i przekąski',559,30,49,11,10,'pestki dyni'],['sunflower-seeds','Pestki słonecznika','Orzechy i przekąski',584,21,51,20,10,'słonecznik łuskany'],['chia','Nasiona chia','Orzechy i przekąski',486,17,31,42,10,'chia'],['flax','Siemię lniane','Orzechy i przekąski',534,18,42,29,10,'len'],['raisins','Rodzynki','Orzechy i przekąski',299,3.1,.5,79,15,'rodzynka'],['dates','Daktyle suszone','Orzechy i przekąski',282,2.5,.4,75,10,'daktyl'],['popcorn','Popcorn bez tłuszczu','Orzechy i przekąski',387,13,4.5,78,10,'prażona kukurydza'],['chips','Chipsy ziemniaczane solone','Orzechy i przekąski',536,7,34,52,30,'chipsy'],['pretzels','Paluszki słone','Orzechy i przekąski',380,10,4,77,20,'paluszki'],
// SŁODYCZE I DESERY
['dark-chocolate','Czekolada gorzka 70%','Słodycze',598,7.8,42.6,45.9,10,'czekolada'],['milk-chocolate','Czekolada mleczna','Słodycze',535,7.5,30,59,10,'czekolada mleczna'],['white-chocolate','Czekolada biała','Słodycze',539,6,32,59,10,'biała czekolada'],['wafer','Wafel przekładany','Słodycze',520,6,28,62,15,'wafelek'],['biscuit','Herbatniki maślane','Słodycze',450,7,15,70,10,'herbatnik'],['oat-cookie','Ciastko owsiane','Słodycze',470,7,20,65,20,'ciastka owsiane'],['sponge-cake','Biszkopt','Słodycze',297,8,5,56,30,'biszkopt'],['cheesecake','Sernik','Słodycze',300,8,18,26,100,'sernik'],['apple-pie','Szarlotka','Słodycze',260,3,10,39,120,'ciasto jabłkowe'],['ice-cream','Lody śmietankowe','Słodycze',207,3.5,11,24,60,'lody'],['pudding','Budyń waniliowy gotowy','Słodycze',115,3.5,3,18,150,'budyń'],['jelly','Galaretka owocowa gotowa','Słodycze',60,1.5,0,13,150,'galaretka'],['protein-bar','Baton proteinowy','Słodycze',360,30,10,38,55,'baton białkowy'],
// GOTOWE POTRAWY I DANIA
['pancake','Naleśniki naturalne','Dania gotowe',227,6.4,7.5,32,70,'naleśnik'],['pancake-cottage','Naleśniki z twarogiem','Dania gotowe',190,9,6,25,150,'naleśniki serowe'],['dumplings','Pierogi ruskie gotowane','Dania gotowe',190,7,5,29,200,'pierogi'],['dumplings-meat','Pierogi z mięsem gotowane','Dania gotowe',210,9,7,28,200,'pierogi mięsne'],['pizza-margherita','Pizza margherita','Dania gotowe',250,11,9,31,300,'pizza'],['lasagne','Lasagne mięsna','Dania gotowe',160,9,7,15,300,'lazania'],['sushi','Sushi maki z łososiem','Dania gotowe',160,6,4,25,150,'sushi'],['soup-tomato','Zupa pomidorowa','Dania gotowe',45,1.5,1.5,6,300,'pomidorowa'],['soup-chicken','Rosół drobiowy','Dania gotowe',30,3,1.5,1,300,'rosół'],['soup-cream','Krem z brokułów','Dania gotowe',55,2.5,2.5,5,300,'zupa krem'],['fries','Frytki pieczone','Dania gotowe',195,3,7,30,150,'frytki'],['potato-mash','Puree ziemniaczane','Dania gotowe',113,2.2,4.2,16,180,'puree'],['salad-greek','Sałatka grecka','Dania gotowe',110,4,8,5,200,'grecka'],['coleslaw','Surówka coleslaw','Dania gotowe',150,1.5,11,11,100,'colesław'],['risotto','Risotto z warzywami','Dania gotowe',145,3.5,4,23,250,'risotto'],['falafel','Falafel','Dania gotowe',333,13,17,32,30,'falafele'],
// NAPOJE
['orange-juice','Sok pomarańczowy 100%','Napoje',45,.7,.2,10.4,250,'sok pomarańczowy'],['apple-juice','Sok jabłkowy 100%','Napoje',46,.1,.1,11.3,250,'sok jabłkowy'],['carrot-juice','Sok marchwiowy','Napoje',40,.9,.2,9.3,250,'sok marchewkowy'],['cola','Napój typu cola','Napoje',42,0,0,10.6,250,'cola'],['cola-zero','Napój typu cola bez cukru','Napoje',1,0,0,0,250,'cola zero'],['lemonade','Lemoniada słodzona','Napoje',40,0,0,10,250,'lemoniada'],['coffee-milk','Kawa z mlekiem 2% bez cukru','Napoje',20,1.2,.8,2,200,'kawa mleczna'],['tea','Herbata bez cukru','Napoje',1,0,0,.2,250,'herbata'],['cocoa','Kakao na mleku 2%','Napoje',78,4.5,2.5,9,250,'kakao'],
];

const extraBase = [
  // Owoce i owoce egzotyczne
  ['mango','Mango świeże','Owoce',60,.8,.4,15,200,'mango'],['kiwi-gold','Kiwi żółte','Owoce',60,1.1,.5,15,75,'kiwi gold'],['nektarynka','Nektarynka','Owoce',44,1.1,.3,11,140,'nektarynka'],['brzoskwinia','Brzoskwinia','Owoce',39,.9,.3,10,150,'brzoskwinia'],['morela','Morele świeże','Owoce',48,1.4,.4,11,35,'morela'],['arbuz','Arbuz','Owoce',30,.6,.2,7.6,250,'arbuz'],['melon','Melon żółty','Owoce',34,.8,.2,8,200,'melon'],['granat','Granat','Owoce',83,1.7,1.2,19,175,'granat pestki'],['jeżyny','Jeżyny świeże','Owoce',43,1.4,.5,10,5,'jeżyna'],['żurawina','Żurawina świeża','Owoce',46,.4,.1,12,5,'żurawina'],['porzeczki-czerwone','Porzeczki czerwone','Owoce',56,1.4,.2,14,5,'czerwona porzeczka'],['agrest','Agrest','Owoce',44,1,.6,10,5,'agrest'],['figi','Figi świeże','Owoce',74,.8,.3,19,50,'figa'],['persymona','Persymona / kaki','Owoce',70,.6,.2,18.6,170,'kaki persymona'],['papaja','Papaja','Owoce',43,.5,.3,11,150,'papaja'],['grejpfrut','Grejpfrut różowy','Owoce',42,.8,.1,11,230,'grejpfrut'],['mandarynka','Mandarynka','Owoce',53,.8,.3,13,75,'mandarynka'],['cytryna','Cytryna','Owoce',29,1.1,.3,9,60,'cytryna'],['limonka','Limonka','Owoce',30,.7,.2,10.5,65,'limonka'],['kokos','Miąższ kokosa świeży','Owoce',354,3.3,33,15.2,40,'kokos'],['daktyle-medjool','Daktyle Medjool','Owoce',277,1.8,.2,75,24,'daktyl medjool'],['śliwki-suszone','Śliwki suszone','Owoce',240,2.2,.4,64,10,'suszone śliwki'],['morele-suszone','Morele suszone','Owoce',241,3.4,.5,63,8,'suszone morele'],['żurawina-suszona','Żurawina suszona słodzona','Owoce',325,.1,.4,83,10,'suszona żurawina'],
  // Warzywa, grzyby i kiszonki
  ['cukinia','Cukinia','Warzywa',17,1.2,.3,3.1,200,'kabaczek'],['bakłażan','Bakłażan','Warzywa',25,1,.2,6,200,'oberżyna'],['dynia','Dynia','Warzywa',26,1,.1,6.5,200,'dynia hokkaido'],['szparagi','Szparagi zielone','Warzywa',20,2.2,.1,3.9,15,'szparagi'],['brukselka','Brukselka','Warzywa',43,3.4,.3,9,20,'brukselki'],['kapusta-włoska','Kapusta włoska','Warzywa',27,2,.1,6,150,'kapusta savoy'],['kapusta-czerwona','Kapusta czerwona','Warzywa',31,1.4,.2,7.4,150,'czerwona kapusta'],['por','Por','Warzywa',61,1.5,.3,14,90,'pory'],['seler-korzeń','Seler korzeniowy','Warzywa',42,1.5,.3,9.2,100,'seler korzeń'],['pietruszka-korzeń','Pietruszka korzeń','Warzywa',55,2.3,.6,12,60,'korzeń pietruszki'],['pasternak','Pasternak','Warzywa',75,1.2,.3,18,100,'pasternak'],['koper-włoski','Koper włoski / fenkuł','Warzywa',31,1.2,.2,7.3,150,'fenkuł'],['rzepa','Rzepa','Warzywa',28,.9,.1,6.4,100,'rzepa'],['brukiew','Brukiew','Warzywa',38,1.1,.2,9,150,'karpiel'],['jarmuż','Jarmuż','Warzywa',49,4.3,.9,9,30,'kale'],['boćwina','Boćwina','Warzywa',19,1.8,.2,3.7,30,'burak liściowy'],['karczoch','Karczoch','Warzywa',47,3.3,.2,11,120,'karczochy'],['fasolka-szparagowa','Fasolka szparagowa zielona','Warzywa',31,1.8,.2,7,100,'fasolka szparagowa'],['groszek-zielony','Groszek zielony świeży','Warzywa',81,5.4,.4,14,80,'zielony groszek'],['bób','Bób gotowany','Warzywa',110,7.6,.4,19.7,100,'bob'],['batat','Batat / słodki ziemniak','Warzywa',86,1.6,.1,20,130,'bataty'],['burak','Burak ćwikłowy surowy','Warzywa',43,1.6,.2,10,80,'burak czerwony'],['boczniaki','Boczniaki','Warzywa',33,3.3,.4,6.1,100,'boczniak'],['kurki','Kurki świeże','Warzywa',38,1.5,.5,6.9,100,'pieprznik jadalny'],['papryka-żółta','Papryka żółta','Warzywa',27,1,.2,6.3,150,'żółta papryka'],['papryka-chili','Papryczka chili','Warzywa',40,1.9,.4,9,15,'chili chilli'],['oliwki','Oliwki zielone','Warzywa',145,1,15.3,3.8,4,'oliwka'],['kapusta-kiszona','Kapusta kiszona','Warzywa',19,1,.1,4.3,100,'kiszona kapusta'],['kimchi','Kimchi','Warzywa',15,1.1,.5,2.4,50,'kimchi koreańskie'],['ogórki-kiszone','Ogórki kiszone','Warzywa',11,.7,.1,1.7,50,'kiszone ogórki'],['rzodkiew-czarna','Rzodkiew czarna','Warzywa',35,1.2,.2,7.5,100,'czarna rzodkiew'],['rukiew','Rukiew wodna','Warzywa',11,2.3,.1,1.3,20,'rzeżucha wodna'],['cykoria','Cykoria','Warzywa',17,1.2,.2,4,50,'cykoria sałatowa'],['radicchio','Radicchio','Warzywa',23,1.4,.3,4.5,50,'czerwona cykoria'],['karczochy-serca','Serca karczochów konserwowe','Warzywa',47,3.3,.2,11,40,'karczochy konserwowe'],
  // Pieczywo, produkty mączne i śniadaniowe
  ['pita-pelnoziarnista','Chlebek pita pełnoziarnisty','Pieczywo',260,9.8,2.5,48,60,'pita razowa'],['tortilla-pszenna','Tortilla pszenna','Pieczywo',310,8.5,8,50,45,'placek tortilla'],['tortilla-pelnoziarnista','Tortilla pełnoziarnista','Pieczywo',300,9,7,48,45,'tortilla razowa'],['lawasz','Lawasz','Pieczywo',290,9,1.5,58,60,'lavash'],['chleb-pumpernikiel','Chleb pumpernikiel','Pieczywo',250,6,1.5,48,35,'pumpernikiel'],['chleb-orkiszowy','Chleb orkiszowy','Pieczywo',250,9,2.5,47,40,'orkisz'],['chleb-żytni-razowy','Chleb żytni razowy 100%','Pieczywo',259,8.5,3.3,48,40,'razowiec żytni'],['chleb-tostowy','Chleb tostowy pszenny','Pieczywo',265,8.5,3.5,49,30,'tostowy'],['chleb-tostowy-pelno','Chleb tostowy pełnoziarnisty','Pieczywo',250,9,3.5,45,30,'tost pełnoziarnisty'],['focaccia','Focaccia','Pieczywo',300,8,9,45,100,'focaccia'],['croissant','Croissant maślany','Pieczywo',406,8,21,45,60,'rogalik francuski croissant'],['naan','Chlebek naan','Pieczywo',290,9,5,49,90,'naan'],['podpłomyk','Podpłomyk pszenny','Pieczywo',270,8,3,52,60,'placek podpłomyk'],['chleb-kukurydziany','Chleb kukurydziany','Pieczywo',330,7,4,66,40,'cornbread'],['chleb-proteinowy','Chleb wysokobiałkowy','Pieczywo',260,20,10,18,35,'chleb proteinowy'],['chleb-bezglutenowy','Chleb bezglutenowy','Pieczywo',250,4,4,48,35,'bezglutenowy chleb'],['bułka-z-otrębami','Bułka z otrębami','Pieczywo',255,10,3,45,65,'otręby bułka'],['bułka-z-serem','Bułka serowa','Pieczywo',320,12,10,44,75,'bułka ser'],['bułka-z-cebulą','Bułka cebulowa','Pieczywo',280,8,4,51,70,'bułka cebula'],['bułka-kukurydziana','Bułka kukurydziana','Pieczywo',285,7,4,54,70,'bułka kukurydza'],['bułka-ziemniaczana','Bułka ziemniaczana','Pieczywo',270,8,3,52,70,'bułka ziemniaki'],['grzanki','Grzanki pszenne','Pieczywo',410,12,7,75,15,'grzanki'],
  // Nabiał i sery
  ['ricotta','Ricotta','Nabiał i jaja',174,11,13,3,30,'ser ricotta'],['mascarpone','Mascarpone','Nabiał i jaja',429,4.5,44,4,20,'mascarpone'],['halloumi','Ser halloumi','Nabiał i jaja',321,22,25,2,30,'halloumi'],['burrata','Burrata','Nabiał i jaja',300,15,25,2,50,'burrata'],['brie','Ser brie','Nabiał i jaja',334,21,28,0.5,30,'brie'],['camembert','Ser camembert','Nabiał i jaja',300,20,24,0.5,30,'camembert'],['cheddar','Ser cheddar','Nabiał i jaja',403,25,33,1.3,20,'cheddar'],['edam','Ser edamski','Nabiał i jaja',357,25,28,1.4,20,'edam'],['kozi-ser','Ser kozi miękki','Nabiał i jaja',364,22,30,2,25,'ser kozi'],['ser-plesniowy','Ser z niebieską pleśnią','Nabiał i jaja',353,21,29,2,25,'gorgonzola lazur blue cheese'],['oscypek','Oscypek','Nabiał i jaja',350,25,27,1,30,'ser wędzony'],['twaróg-sernikowy','Twaróg sernikowy','Nabiał i jaja',120,15,5,4,100,'sernikowy twaróg'],['jogurt-grecki-5','Jogurt grecki 5%','Nabiał i jaja',97,8,5,4,150,'grecki 5'],['jogurt-pitny','Jogurt pitny naturalny','Nabiał i jaja',62,3.4,2,7,200,'jogurt do picia'],['jogurt-pitny-owoc','Jogurt pitny owocowy','Nabiał i jaja',78,3,1.8,12,200,'jogurt pitny owocowy'],['ayran','Ayran naturalny','Nabiał i jaja',36,2,2,2,250,'ajran'],['maślanka-truskawkowa','Maślanka truskawkowa','Nabiał i jaja',66,3.2,1.5,9,250,'maślanka owocowa'],['mleko-kozie','Mleko kozie','Nabiał i jaja',69,3.6,4.1,4.5,250,'kozie mleko'],['mleko-sojowe','Napój sojowy niesłodzony','Nabiał i jaja',33,3.3,1.8,.7,250,'mleko sojowe'],['mleko-owsiane','Napój owsiany niesłodzony','Nabiał i jaja',44,1,.8,7,250,'mleko owsiane'],['mleko-migdalowe','Napój migdałowy niesłodzony','Nabiał i jaja',13,.4,1.1,.2,250,'mleko migdałowe'],['mleko-kokosowe-napoj','Napój kokosowy','Nabiał i jaja',20,.2,1.8,.8,250,'mleko kokosowe napój'],['ser-provolone','Ser provolone','Nabiał i jaja',351,26,27,2,20,'provolone'],['ser-raclette','Ser raclette','Nabiał i jaja',350,23,28,1,25,'raclette'],['ser-ricotta-light','Ricotta light','Nabiał i jaja',140,12,8,3,30,'ricotta lekka'],
  // Mięso, drób i ryby
  ['królik','Mięso z królika surowe','Mięso i ryby',173,21,9,0,150,'królik'],['kaczka','Pierś z kaczki bez skóry surowa','Mięso i ryby',140,19,6,0,150,'kaczka pierś'],['udziec-indyk','Udziec z indyka bez skóry surowy','Mięso i ryby',150,20,7,0,150,'indyk udziec'],['skrzydełko-kurczaka','Skrzydełko kurczaka ze skórą surowe','Mięso i ryby',203,18,14,0,80,'skrzydełka'],['wątróbka-kurczaka','Wątróbka drobiowa surowa','Mięso i ryby',119,17,5,1,100,'wątróbka kurza'],['łopatka-wieprzowa','Łopatka wieprzowa surowa','Mięso i ryby',250,17,20,0,150,'łopatka'],['żeberka-wieprzowe','Żeberka wieprzowe surowe','Mięso i ryby',277,17,23,0,150,'żeberka'],['wątroba-wołowa','Wątroba wołowa surowa','Mięso i ryby',135,20,3.6,3.9,100,'wątróbka wołowa'],['jagnięcina','Mięso jagnięce surowe','Mięso i ryby',294,18,24,0,150,'jagnięcina baranina'],['cielęcina','Cielęcina surowa','Mięso i ryby',172,20,9,0,150,'cielęcina'],['mielony-indyk','Mięso z indyka mielone','Mięso i ryby',150,20,8,0,150,'indyk mielony'],['mielona-wolowina-20','Wołowina mielona 20% tłuszczu','Mięso i ryby',254,17,20,0,150,'mielona wołowina 20'],['mielona-wieprzowina','Wieprzowina mielona','Mięso i ryby',263,17,21,0,150,'mięso mielone wieprzowe'],['polędwica-indycza','Polędwica z indyka','Mięso i ryby',115,23,2,0,30,'wędlina indycza'],['pasztet-drobiowy','Pasztet drobiowy','Mięso i ryby',250,14,19,5,25,'pasztet kurczak'],['pasztet-wieprzowy','Pasztet wieprzowy','Mięso i ryby',300,13,25,4,25,'pasztet'],['szynka-parmeńska','Szynka parmeńska','Mięso i ryby',270,26,18,0,20,'prosciutto'],['boczek-surowy','Boczek świeży surowy','Mięso i ryby',518,9,53,0,20,'boczek surowy'],['pstrąg','Pstrąg tęczowy surowy','Mięso i ryby',148,20,6.6,0,150,'pstrąg'],['śledź','Śledź świeży','Mięso i ryby',158,18,9,0,100,'sledz'],['mintaj','Mintaj surowy','Mięso i ryby',92,19,1,0,150,'mintaj'],['plamiak','Plamiak / łupacz surowy','Mięso i ryby',90,20,0.6,0,150,'łupacz haddock'],['tilapia','Tilapia surowa','Mięso i ryby',96,20,1.7,0,150,'tilapia'],['małże','Małże gotowane','Mięso i ryby',86,12,2.2,3.7,100,'omułki'],['kalmary','Kalmary surowe','Mięso i ryby',92,16,1.4,3.1,100,'kałamarnica'],['ośmiornica','Ośmiornica gotowana','Mięso i ryby',82,15,1,2,100,'octopus'],['krab','Mięso kraba gotowane','Mięso i ryby',97,19,1.5,0,100,'krab'],['anchois','Anchois w oleju odsączone','Mięso i ryby',210,29,10,0,10,'sardela anchois'],['tuńczyk-świeży','Tuńczyk świeży surowy','Mięso i ryby',144,23,5,0,150,'stek z tuńczyka'],
  // Kasze, mąki i inne produkty zbożowe
  ['amarantus','Amarantus nasiona suche','Produkty zbożowe',371,14,7,65,30,'amarant'],['teff','Teff / miłka abisyńska sucha','Produkty zbożowe',367,13,3.7,73,30,'teff'],['orkisz-ziarno','Ziarno orkiszu suche','Produkty zbożowe',338,15,2.5,70,50,'orkisz ziarno'],['płatki-żytnie','Płatki żytnie','Produkty zbożowe',338,10,2,69,40,'żytnie płatki'],['płatki-jęczmienne','Płatki jęczmienne','Produkty zbożowe',354,10,2.3,73,40,'jęczmienne płatki'],['ryż-dziki','Ryż dziki suchy','Produkty zbożowe',357,15,1.1,75,60,'dziki ryż'],['ryż-basmati','Ryż basmati suchy','Produkty zbożowe',365,8,1,78,60,'basmati'],['ryż-jaśminowy','Ryż jaśminowy suchy','Produkty zbożowe',365,7,0.7,80,60,'jaśminowy'],['makaron-udon','Makaron udon gotowany','Produkty zbożowe',127,3.3,.2,27,150,'udon'],['makaron-soba','Makaron soba gotowany','Produkty zbożowe',99,5.1,.1,21,150,'soba'],['makaron-kukurydziany','Makaron kukurydziany suchy','Produkty zbożowe',357,7,1.5,78,80,'kukurydziany makaron'],['makaron-gryczany','Makaron gryczany suchy','Produkty zbożowe',343,13,3,71,80,'gryczany makaron'],['mąka-owsiana','Mąka owsiana','Produkty zbożowe',404,14,9,66,20,'owsiana mąka'],['mąka-kukurydziana','Mąka kukurydziana','Produkty zbożowe',361,7,3.9,76,20,'kukurydziana mąka'],['mąka-migdałowa','Mąka migdałowa','Produkty zbożowe',571,21,50,20,15,'migdałowa mąka'],['kasza-ryżowa','Kasza ryżowa sucha','Produkty zbożowe',360,7,1,79,50,'ryżowa kasza'],['płatki-ryżowe','Płatki ryżowe','Produkty zbożowe',360,7,1,80,30,'ryżowe płatki'],['wafle-ryżowe','Wafle ryżowe naturalne','Produkty zbożowe',387,8,3,81,7,'wafel ryżowy'],['wafle-kukurydziane','Wafle kukurydziane','Produkty zbożowe',380,8,2,82,7,'kukurydziane wafle'],
  // Rośliny strączkowe i produkty roślinne
  ['fasola-czarna','Fasola czarna gotowana','Rośliny strączkowe',132,8.9,.5,24,150,'czarna fasola'],['fasola-mung','Fasola mung gotowana','Rośliny strączkowe',105,7,0.4,19,150,'mung'],['fasola-mung-sucha','Fasola mung sucha','Rośliny strączkowe',347,24,1.2,63,50,'mung sucha'],['groch-luskany','Groch łuskany gotowany','Rośliny strączkowe',118,8.3,.4,21,150,'groch'],['groch-suchy','Groch łuskany suchy','Rośliny strączkowe',341,24,1.2,60,50,'groch suchy'],['fasola-borlotii','Fasola borlotti gotowana','Rośliny strączkowe',123,8.6,.5,22,150,'borlotti'],['łubin','Ziarna łubinu gotowane','Rośliny strączkowe',119,15.6,2.9,9.9,100,'łubin'],['tempeh','Tempeh naturalny','Rośliny strączkowe',193,20,11,9,100,'tempeh'],['seitan','Seitan naturalny','Rośliny strączkowe',141,25,2,5,100,'seitan'],['napoj-grochowy','Napój grochowy niesłodzony','Rośliny strączkowe',38,3.5,1.5,1,250,'mleko grochowe'],['granulat-sojowy','Granulat sojowy suchy','Rośliny strączkowe',345,50,2,30,40,'soja teksturowana tvp'],
  // Przetwory, dodatki, orzechy i przyprawy
  ['passata','Passata pomidorowa','Konserwy',29,1.4,.2,5.5,100,'przecier pomidorowy'],['ogórki-konserwowe','Ogórki konserwowe','Konserwy',18,.5,.2,3.4,50,'korniszony'],['buraczki-konserwowe','Buraczki tarte konserwowe','Konserwy',50,1.5,.2,11,100,'buraczki'],['papryka-konserwowa','Papryka konserwowa','Konserwy',25,.8,.2,5,50,'papryka marynowana'],['kapary','Kapary konserwowe','Konserwy',23,2.4,.9,4.9,5,'kapary'],['oliwki-czarne','Oliwki czarne','Konserwy',115,.8,10.7,6,4,'czarne oliwki'],['tahini','Tahini / pasta sezamowa','Tłuszcze i dodatki',595,17,54,21,15,'pasta sezamowa'],['ajvar','Ajvar łagodny','Tłuszcze i dodatki',70,1.5,3,9,20,'ajwar'],['chrzan','Chrzan tarty','Tłuszcze i dodatki',48,1.2,.7,10,10,'chrzan tarty'],['sos-sriracha','Sos sriracha','Tłuszcze i dodatki',93,1.5,.5,20,10,'sriracha'],['sos-teriyaki','Sos teriyaki','Tłuszcze i dodatki',89,5,.2,17,15,'teriyaki'],['ocet-balsamiczny','Ocet balsamiczny','Tłuszcze i dodatki',88,.5,0,17,10,'balsamico'],['pasta-miso','Pasta miso','Tłuszcze i dodatki',199,12,6,26,10,'miso'],['masło-klarowane','Masło klarowane','Tłuszcze i dodatki',900,0,100,0,5,'ghee'],['olej-rzepakowy','Olej rzepakowy','Tłuszcze i dodatki',884,0,100,0,5,'olej rzepak'],['olej-sezamowy','Olej sezamowy','Tłuszcze i dodatki',884,0,100,0,5,'sezamowy'],['olej-lniany','Olej lniany','Tłuszcze i dodatki',884,0,100,0,5,'lniany'],['orzechy-makadamia','Orzechy makadamia','Orzechy i przekąski',718,8,76,14,15,'makadamia'],['orzechy-brazylijskie','Orzechy brazylijskie','Orzechy i przekąski',659,14,67,12,15,'brazylijskie'],['orzechy-laskowe','Orzechy laskowe','Orzechy i przekąski',628,15,61,17,15,'leszczyna'],['orzechy-pekan','Orzechy pekan','Orzechy i przekąski',691,9,72,14,15,'pekan'],['orzechy-pinia','Orzeszki piniowe','Orzechy i przekąski',673,14,68,13,10,'piniowe'],['sezam','Sezam łuskany','Orzechy i przekąski',573,18,50,23,10,'ziarna sezamu'],['konopie','Nasiona konopi łuskane','Orzechy i przekąski',553,32,49,9,10,'konopne'],['mak','Mak niebieski','Orzechy i przekąski',525,18,42,28,5,'mak'],['morele-liofilizowane','Morele liofilizowane','Orzechy i przekąski',310,4,1,70,5,'liofilizowane morele'],['truskawki-liofilizowane','Truskawki liofilizowane','Orzechy i przekąski',330,7,3,70,5,'liofilizowane truskawki'],
  // Desery, przekąski i dania obiadowe
  ['pączek','Pączek z nadzieniem różanym','Słodycze',400,6,20,50,80,'pączki'],['drożdżówka','Drożdżówka z kruszonką','Słodycze',350,7,12,53,100,'drożdżowe ciasto'],['muffin','Muffin czekoladowy','Słodycze',400,6,20,50,90,'babeczka'],['brownie','Brownie czekoladowe','Słodycze',450,6,25,50,70,'brownie'],['tiramisu','Tiramisu','Słodycze',300,5,20,25,100,'tiramisu'],['budyn-ryzowy','Pudding ryżowy','Słodycze',120,3.5,3,20,150,'ryż na mleku'],['krakersy','Krakersy solone','Orzechy i przekąski',440,9,13,70,15,'krakers'],['nachosy','Nachosy kukurydziane','Orzechy i przekąski',490,7,23,63,25,'nachos'],['orzeszki-w-panierce','Orzeszki w chrupiącej panierce','Orzechy i przekąski',500,16,27,50,25,'orzeszki panierowane'],['bigos','Bigos tradycyjny','Dania gotowe',120,7,7,8,300,'bigos'],['żurek','Żurek z kiełbasą','Dania gotowe',75,4,4,6,300,'zurek'],['barszcz','Barszcz czerwony czysty','Dania gotowe',35,1,0.2,7,300,'barszcz czerwony'],['gołąbki','Gołąbki z mięsem i ryżem','Dania gotowe',130,7,6,12,250,'golabki'],['leczo','Leczo warzywne','Dania gotowe',70,2,4,7,250,'leczo'],['chili-con-carne','Chili con carne','Dania gotowe',130,9,5,12,250,'chili'],['curry-kurczak','Curry z kurczakiem','Dania gotowe',160,12,8,10,250,'kurczak curry'],['curry-warzywne','Curry warzywne','Dania gotowe',110,3,6,12,250,'curry warzywne'],['gulasz-wieprzowy','Gulasz wieprzowy','Dania gotowe',150,12,8,5,250,'gulasz'],['gulasz-wołowy-gotowy','Gulasz wołowy gotowy','Dania gotowe',135,12,7,5,250,'gulasz wołowina'],['papryka-faszerowana','Papryka faszerowana ryżem i mięsem','Dania gotowe',120,7,5,12,250,'faszerowana papryka'],['kotlet-schabowy','Kotlet schabowy panierowany','Dania gotowe',280,18,16,16,140,'schabowy'],['kotlet-mielony','Kotlet mielony smażony','Dania gotowe',250,17,17,8,100,'mielony'],['placki-ziemniaczane','Placki ziemniaczane smażone','Dania gotowe',220,4,11,27,100,'placki'],['kopytka','Kopytka ziemniaczane gotowane','Dania gotowe',160,4,1,34,180,'kopytka'],['kluski-slaskie','Kluski śląskie gotowane','Dania gotowe',150,3,1,32,180,'śląskie'],['kaszanka','Kaszanka smażona','Dania gotowe',250,11,18,10,100,'kaszanka'],['zupa-grochowa','Zupa grochowa','Dania gotowe',75,4,2,10,300,'grochówka'],['zupa-krupnik','Krupnik','Dania gotowe',55,2,1.5,8,300,'krupnik'],['zupa-ogorkowa','Zupa ogórkowa','Dania gotowe',45,1.5,2,5,300,'ogórkowa'],['zupa-jarzynowa','Zupa jarzynowa','Dania gotowe',40,1.5,1,6,300,'jarzynówka'],['ratatouille','Ratatouille','Dania gotowe',75,2,4,8,250,'ratatuj'],['bowl-buddha','Buddha bowl z warzywami i kaszą','Dania gotowe',135,5,5,18,300,'bowl'],['sałatka-cezar','Sałatka cezar z kurczakiem','Dania gotowe',160,10,9,10,250,'cezar'],['sałatka-tuna','Sałatka z tuńczykiem','Dania gotowe',120,12,5,6,250,'tuńczyk sałatka'],
  // Napoje
  ['woda-kokosowa','Woda kokosowa','Napoje',19,.7,.2,3.7,250,'kokosowa'],['napoj-izotoniczny','Napój izotoniczny','Napoje',25,0,0,6,250,'izotonik'],['napoj-energetyczny','Napój energetyczny słodzony','Napoje',45,0,0,11,250,'energetyk'],['napoj-energetyczny-zero','Napój energetyczny bez cukru','Napoje',2,0,0,.5,250,'energetyk zero'],['herbata-mrożona','Herbata mrożona słodzona','Napoje',30,0,0,7.5,250,'ice tea'],['kawa-czarna','Kawa czarna bez cukru','Napoje',2,.1,0,0,200,'espresso americano'],['kawa-latte','Latte na mleku 2%','Napoje',48,3,2,5,250,'caffe latte'],['matcha','Matcha na wodzie bez cukru','Napoje',5,.3,.1,1,200,'matcha'],['kakao-woda','Kakao na wodzie z cukrem','Napoje',55,2,1.5,9,250,'kakao woda']
];

const formSpecs = {
  'Owoce': [
    {id:'frozen',suffix:'mrożone',k:1,p:1,f:1,c:1},
    {id:'baked',suffix:'pieczone bez dodatku cukru',k:1.08,p:1,f:1,c:1.05}
  ],
  'Warzywa': [
    {id:'boiled',suffix:'gotowane',k:.9,p:.92,f:1,c:.9},
    {id:'steam',suffix:'na parze',k:.96,p:1,f:1,c:.96},
    {id:'roasted',suffix:'pieczone bez tłuszczu',k:1.12,p:1.05,f:1,c:1.1}
  ],
  'Pieczywo': [
    {id:'toasted',suffix:'opiekane',k:1.03,p:1,f:1,c:1},
    {id:'croutons',suffix:'w formie grzanek',k:1.12,p:1,f:1,c:1.1},
    {id:'seeds',suffix:'z dodatkiem ziaren',k:1.12,p:1.05,f:1.2,c:1.02}
  ],
  'Nabiał i jaja': [
    {id:'light',suffix:'w wersji lekkiej',k:.82,p:1.05,f:.55,c:1},
    {id:'lactose-free',suffix:'bez laktozy',k:1,p:1,f:1,c:1},
    {id:'fruit',suffix:'owocowe',k:1.18,p:.95,f:1,c:1.35}
  ],
  'Mięso i ryby': [
    {id:'boiled',suffix:'gotowane',k:1.12,p:1.18,f:.88,c:1},
    {id:'baked',suffix:'pieczone',k:1.22,p:1.22,f:.9,c:1},
    {id:'grilled',suffix:'grillowane',k:1.25,p:1.25,f:.88,c:1},
    {id:'pan-fried',suffix:'smażone bez panierki',k:1.38,p:1.15,f:1.25,c:1.02}
  ],
  'Produkty zbożowe': [
    {id:'cooked',suffix:'gotowane na wodzie',k:.34,p:.34,f:.34,c:.34},
    {id:'milk-porridge',suffix:'na mleku',k:.78,p:.82,f:.85,c:.78},
    {id:'porridge',suffix:'w formie owsianki / kleiku',k:.62,p:.62,f:.62,c:.62}
  ],
  'Rośliny strączkowe': [
    {id:'boiled',suffix:'gotowane',k:.88,p:.9,f:.9,c:.88},
    {id:'roasted',suffix:'pieczone',k:1.18,p:1.1,f:1.2,c:1.1},
    {id:'puree',suffix:'w formie puree',k:.9,p:.9,f:1,c:.9}
  ],
  'Konserwy': [
    {id:'drained',suffix:'po odsączeniu',k:.96,p:1,f:.9,c:.95},
    {id:'tomato',suffix:'w sosie pomidorowym',k:1.12,p:1,f:1,c:1.2}
  ],
  'Tłuszcze i dodatki': [
    {id:'light',suffix:'w wersji o obniżonej zawartości tłuszczu',k:.72,p:1,f:.65,c:1.2},
    {id:'flavoured',suffix:'w wariancie ziołowym',k:1.03,p:1,f:1.02,c:1.02}
  ],
  'Orzechy i przekąski': [
    {id:'roasted',suffix:'prażone',k:1.02,p:1,f:1.02,c:1},
    {id:'salted',suffix:'solone',k:1,p:1,f:1,c:1},
    {id:'chopped',suffix:'siekanie / posiekane',k:1,p:1,f:1,c:1}
  ],
  'Słodycze': [
    {id:'mini',suffix:'w małej porcji',k:1,p:1,f:1,c:1},
    {id:'homemade',suffix:'domowe',k:.95,p:1,f:.95,c:.95}
  ],
  'Dania gotowe': [
    {id:'homemade',suffix:'domowe',k:.92,p:1,f:.9,c:.95},
    {id:'baked',suffix:'pieczone / podgrzane w piekarniku',k:1.04,p:1,f:1,c:1},
    {id:'light',suffix:'w wersji lżejszej',k:.82,p:1,f:.8,c:.9}
  ],
  'Napoje': [
    {id:'unsweetened',suffix:'bez dodatku cukru',k:.18,p:1,f:1,c:.12},
    {id:'diluted',suffix:'rozcieńczone wodą',k:.55,p:1,f:1,c:.55}
  ]
};

const norm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ł/g,'l').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const clamp = value => Math.max(0,Math.min(100,Number(value)||0));

// Wariant nie może powtarzać obróbki, którą produkt już ma w nazwie
// („Makaron udon gotowany · gotowane na wodzie”) ani przeczyć kategorii
// („Olej rzepakowy · w wersji o obniżonej zawartości tłuszczu”).
const PREPARATION_WORDS = {
  boiled: /gotowan/, steam: /na parze/, roasted: /pieczon|prażon/, baked: /pieczon/,
  grilled: /grillowan/, 'pan-fried': /smażon/, toasted: /opiekan/, croutons: /grzank|tost/,
  frozen: /mrożon/, baked_sweet: /suszon/,
};
const NAME_GROUPS = {
  oil: /olej|oliwa|masło klarowane/,
  sweetener: /cukier|miód|syrop|dżem/,
  solidDairy: /ser|twar|jaj|masło|śmietan/,
  sugaryDrink: /bez cukru|bez dodatku|woda|herbata|kawa|zero|izotoniczny|energetyczny/,
  flour: /mąka/,
  tomatoSauce: /oliwki|kukurydz|tuńczyk|ogór|kapary/,
  dried: /susz/,
};
function variantIsSensible(name, category, specId) {
  const prep = PREPARATION_WORDS[specId];
  if (prep && prep.test(name.toLowerCase())) return false;
  if (specId === 'light' && NAME_GROUPS.oil.test(name)) return false;
  if (specId === 'flavoured' && NAME_GROUPS.sweetener.test(name)) return false;
  if (specId === 'fruit' && NAME_GROUPS.solidDairy.test(name)) return false;
  if (specId === 'light' && /jaj|masło(?! orzechowe)/.test(name)) return false;
  if (specId === 'unsweetened' && NAME_GROUPS.sugaryDrink.test(name)) return false;
  if (specId === 'diluted' && /woda/.test(name)) return false;
  if (['cooked','milk-porridge','porridge'].includes(specId) && NAME_GROUPS.flour.test(name)) return false;
  if (specId === 'tomato' && NAME_GROUPS.tomatoSauce.test(name)) return false;
  if (specId === 'baked' && NAME_GROUPS.dried.test(name)) return false;
  return true;
}

function buildExtraSeedProducts(existing=[]) {
  const ids = new Set(existing.map(p=>p.id));
  const names = new Set(existing.map(p=>norm(p.name)));
  const out = [];
  const add = (row, form=null) => {
    const [id,name,category,kcal,p,f,c,unitWeight,aliases=''] = row;
    const spec = form;
    if (spec && !variantIsSensible(name, category, spec.id)) return;
    const itemId = norm(spec ? `${id}-${spec.id}` : id);
    const itemName = spec ? `${name} · ${spec.suffix}` : name;
    if (ids.has(itemId) || names.has(norm(itemName))) return;
    const scale = (v,m) => Math.round(v*m*10)/10;
    const pp = spec?.p ?? 1, fp = spec?.f ?? 1, cp = spec?.c ?? 1;
    const variant = Boolean(spec);
    const protein100 = clamp(scale(p,pp)), fat100 = clamp(scale(f,fp)), carbs100 = clamp(scale(c,cp));
    // Wariant musi być fizycznie możliwy: makroskładniki nie mogą przekroczyć 100 g.
    if (variant && protein100 + fat100 + carbs100 > 99) return;
    // Energię wariantu liczymy z jego własnych makroskładników (4/9/4 kcal na gram),
    // dzięki czemu kcal i makro nigdy się nie rozjeżdżają.
    const variantKcal = Math.round(4*protein100 + 9*fat100 + 4*carbs100);
    out.push({
      id:itemId,name:itemName,category,kcal100:variant?Math.min(950,variantKcal):Math.round(kcal),protein100,fat100,carbs100,fiber100:null,
      unitWeight:unitWeight===''?null:Number(unitWeight),aliases:String(aliases).split(/\s+/).filter(Boolean),
      source:variant?'Szacunkowa odmiana technologiczna · produkt ogólny':'Wartość referencyjna · produkt ogólny',sourceKind:'generic-reference',store:'Ogólne',
      dataNote:variant?'Orientacyjna estymacja dla sposobu przygotowania; wynik zależy od receptury, ilości wody, tłuszczu i marki. Nie jest to etykieta SKU.':'Wartość orientacyjna produktu ogólnego; nie jest to etykieta konkretnego SKU sklepowego.'
    });
    ids.add(itemId);names.add(norm(itemName));
  };
  for (const row of extraBase) {
    add(row);
    const specs = formSpecs[row[2]] || [];
    for (const spec of specs) add(row,spec);
  }
  return out;
}


// ---------------------------------------------------------------------------
// Codzienne produkty spotykane w Lidlu, Biedronce, Kauflandzie i Carrefourze.
// Wartości referencyjne dla kategorii produktu (na 100 g), oparte na publicznych
// tabelach USDA FoodData Central i zakresach polskich tabel NIZP PZH.
// To NIE są etykiety konkretnych SKU — dla opakowania nadrzędna jest etykieta.
// ---------------------------------------------------------------------------
const everydayRows = [
  // Pieczywo sklepowe i bułki
  ['bulka-sniadaniowa','Bułka śniadaniowa pszenna','Pieczywo',280,8.5,3,55,50,'bułka śniadaniowa piekarnia'],
  ['bulka-cebulowa','Bułka cebulowa','Pieczywo',285,8.5,4,53,70,'cebulowa bułka'],
  ['bulka-slonecznikowa','Bułka z ziarnami słonecznika','Pieczywo',295,10,7,45,80,'słonecznik bułka ziarna'],
  ['bulka-wieloziarnista-ciemna','Bułka wieloziarnista ciemna','Pieczywo',270,10,5,43,80,'ciemna wieloziarnista bułka'],
  ['bulka-zytnia-z-ziarnami','Bułka żytnia z ziarnami','Pieczywo',265,9,5,45,80,'żytnia bułka ziarna'],
  ['bulka-toastowa','Bułka toastowa pszenna','Pieczywo',270,8.5,4,50,25,'bułka do tostów'],
  ['bulka-do-kebabu','Bułka do kebabu','Pieczywo',290,9,5,52,100,'kebab pity'],
  ['chalka','Chałka pszenna','Pieczywo',300,8.5,6,53,80,'chałka drożdżowa'],
  ['chleb-wiejski','Chleb wiejski pszenny','Pieczywo',250,8,2,50,40,'chleb wiejski'],
  ['chleb-razowy-pszenno-zytni','Chleb razowy pszenno-żytni','Pieczywo',240,8,2.5,45,40,'razowy mieszany'],
  ['chleb-slonecznikowy','Chleb z ziarnami słonecznika','Pieczywo',270,9.5,6,44,40,'chleb ziarna słonecznik'],
  ['bagietka-zytnia','Bagietka żytnia','Pieczywo',250,9,2,49,100,'żytnia bagietka'],
  // Nabiał sklepowy
  ['mleko-1-5','Mleko 1,5%','Nabiał i jaja',46,3.4,1.5,4.8,250,'mleko 1,5'],
  ['jogurt-naturalny-1-5','Jogurt naturalny 1,5%','Nabiał i jaja',55,4.5,1.5,6,150,'jogurt 1,5'],
  ['jogurt-grecki-2','Jogurt grecki 2%','Nabiał i jaja',73,8,2,4.2,150,'grecki 2'],
  ['jogurt-islandzki','Jogurt typu islandzkiego','Nabiał i jaja',65,10,.2,5,150,'skyr islandzki'],
  ['skyr-waniliowy','Skyr waniliowy','Nabiał i jaja',90,9,.2,12,150,'skyr smakowy'],
  ['serek-homogenizowany-waniliowy','Serek homogenizowany waniliowy','Nabiał i jaja',130,6,5,16,150,'homogenizowany'],
  ['twarozek-ziarnisty','Twarożek ziarnisty','Nabiał i jaja',110,12,5,3,150,'ziarnisty twaróg'],
  ['kefir-1','Kefir 1%','Nabiał i jaja',40,3.4,1,4.7,250,'kefir 1'],
  ['maslanka-1-5','Maślanka 1,5%','Nabiał i jaja',40,3.4,1.5,4.5,250,'maślanka 1,5'],
  ['ser-zolty-light','Ser żółty light 17% tłuszczu','Nabiał i jaja',250,29,17,1,20,'lekki ser żółty'],
  ['mozzarella-light','Mozzarella light','Nabiał i jaja',250,24,15,2,50,'mozzarella lekka'],
  ['feta-light','Feta light','Nabiał i jaja',200,17,13,3,30,'feta lekka'],
  ['ser-smietankowy-light','Serek śmietankowy light','Nabiał i jaja',160,6,12,6,30,'kremowy serek light'],
  ['serek-wiejski-z-rzodkiewka','Serek wiejski z rzodkiewką','Nabiał i jaja',95,10,5,2.5,200,'wiejski rzodkiewka'],
  ['jogurt-owocowy-2','Jogurt owocowy 2%','Nabiał i jaja',90,4,2,14,150,'jogurt owocowy'],
  ['smietana-12','Śmietana 12%','Nabiał i jaja',135,2.8,12,4,20,'śmietana 12'],
  // Wędliny i ryby ze sklepowej lady
  ['kabanosy','Kabanosy drobiowe','Mięso i ryby',380,28,30,1,20,'kabanos'],
  ['mortadela','Mortadela','Mięso i ryby',300,14,26,2,20,'mortadela drobiowa'],
  ['serdelki','Serdelki drobiowe','Mięso i ryby',250,13,20,3,50,'serdelki'],
  ['szynka-konserwowa','Szynka konserwowa','Mięso i ryby',120,17,4,2,30,'szynka konserwa'],
  ['poledwica-sopocka','Polędwica sopocka','Mięso i ryby',130,22,4,1,30,'sopocka'],
  ['kielbasa-krakowska','Kiełbasa krakowska sucha','Mięso i ryby',320,25,25,1,30,'krakowska'],
  ['schab-pieczony-wedlina','Schab pieczony wędlina','Mięso i ryby',150,22,6,1,30,'schab wędlina'],
  ['losos-wedzony','Łosoś wędzony na gorąco','Mięso i ryby',160,23,7,0,30,'wędzony łosoś'],
  // Mąka, kasze i dodatki
  ['maka-pszenna-500','Mąka pszenna typ 500','Produkty zbożowe',348,10,1,72,20,'mąka pszenna 500'],
  ['maka-zytnia-720','Mąka żytnia typ 720','Produkty zbożowe',340,8,1.5,71,20,'mąka żytnia 720'],
  ['otręby-pszenne','Otręby pszenne','Produkty zbożowe',216,15.5,4.2,64,15,'otręby pszenne'],
  ['ryz-paraboliczny','Ryż paraboliczny suchy','Produkty zbożowe',360,8,1,78,60,'ryż parboiled'],
  ['platki-owsiane-gorskie','Płatki owsiane górskie','Produkty zbożowe',370,13,7,60,40,'owsiane górskie'],
  ['koncentrat-pomidorowy','Koncentrat pomidorowy 30%','Konserwy',95,4.5,.5,19,15,'przecier koncentrat'],
  // Warzywa i owoce ze sklepowej półki
  ['rukola','Rukola','Warzywa',25,2.6,.7,3.6,30,'rucola'],
  ['salata-lodowa','Sałata lodowa','Warzywa',14,.9,.1,2.9,100,'sałata lodowa'],
  ['papryka-mini','Papryka mini mix','Warzywa',31,1,.3,6,40,'mini papryczki'],
  ['marchewka-mini','Marchewka mini','Warzywa',41,.9,.2,9.6,15,'karotka marchew mini'],
  ['ziemniaki-mlode','Ziemniaki młode gotowane','Warzywa',87,2,.1,20,150,'młode ziemniaki'],
  ['winogrono-ciemne','Winogrono ciemne','Owoce',69,.7,.2,18.1,5,'ciemne winogrona'],
  // Przekąski i napoje
  ['orzeszki-ziemne-solone','Orzeszki ziemne solone','Orzechy i przekąski',567,26,49,16,30,'fistaszki solone'],
  ['chipsy-paprykowe','Chipsy paprykowe','Orzechy i przekąski',530,6.5,33,50,30,'czipsy papryka'],
  ['woda-mineralna','Woda mineralna niegazowana','Napoje',0,0,0,0,250,'woda butelkowana'],
  ['sok-jablkowy-metny','Sok jabłkowy mętny 100%','Napoje',46,.1,.1,11.3,250,'sok jabłko mętny'],
  ['smoothie-owocowe','Smoothie owocowe','Napoje',55,.5,.2,12.5,250,'koktajl owocowy'],
  // Dania gotowe i dania z barku
  ['frytki-mrozone','Frytki mrożone pieczone','Dania gotowe',160,2.5,5,25,150,'frytki z piekarnika'],
  ['pierogi-z-kapusta','Pierogi z kapustą i grzybami gotowane','Dania gotowe',180,5,5,29,200,'pierogi kapusta'],
  ['zapiekanka','Zapiekanka z pieczarkami','Dania gotowe',230,9,9,28,250,'zapiekanka pieczarki'],
  ['hot-dog','Hot dog z parówką','Dania gotowe',290,10,16,26,150,'hotdog'],
  ['salatka-jarzynowa','Sałatka jarzynowa','Dania gotowe',180,3,14,10,150,'jarzynowa'],
  ['surowka-z-kapusty','Surówka z kapusty białej','Dania gotowe',60,1.2,3.5,6,100,'surówka kapusta'],
  ['nalesniki-z-serem','Naleśniki z serem i sosem','Dania gotowe',200,8,7,26,200,'naleśniki ser sos'],
  ['ryba-panierowana','Ryba panierowana smażona','Dania gotowe',230,15,13,13,150,'ryba w panierce'],
  ['golonka','Golonka pieczona','Dania gotowe',260,22,18,1,150,'golonka']
];
rows.push(...everydayRows);

export const seedProducts = rows.map(([id,name,category,kcal,protein,fat,carbs,unitWeight,aliases='']) => ({
  id:norm(id), name, category, kcal100:Number(kcal), protein100:Number(protein), fat100:Number(fat), carbs100:Number(carbs), fiber100:null,
  unitWeight:unitWeight===''?null:Number(unitWeight), aliases:String(aliases).split(/\s+/).filter(Boolean),
  source:'Wartości referencyjne · produkt ogólny', sourceKind:'generic-reference', store:'Ogólne',
  dataNote:'Wartość orientacyjna dla produktu ogólnego — nie jest etykietą konkretnego SKU sklepowego.'
}));

// Jedna pozycja z jawnie sprawdzonym źródłem i wartościami opublikowanymi w bazie Frida.
seedProducts.find(p=>p.id==='roll-sweet').kcal100=296;
Object.assign(seedProducts.find(p=>p.id==='roll-sweet'), {
  protein100:9.1, fat100:6.6, carbs100:48.7,
  source:'DTU Frida · bułka słodka (wartość referencyjna)', sourceKind:'published-reference',
  dataNote:'Frida 6.1, food ID 1334: Rolls, sweet dough type. Wartość dla duńskiej kategorii referencyjnej, nie polski produkt sklepowy.',
  sourceUrl:'https://frida.fooddata.dk/index.php/food/1334?lang=en', sourceLicense:'CC BY 4.0'
});

// Rozszerzenie katalogu startowego o dodatkowe codzienne produkty i warianty obróbki.
seedProducts.push(...buildExtraSeedProducts(seedProducts));

// Pozycje dodane jako codzienne produkty sklepowe mają jawnie wskazane źródło referencyjne.
const everydayIds = new Set(everydayRows.map(row => norm(row[0])));
for (const product of seedProducts) {
  if (!everydayIds.has(product.id)) continue;
  product.source = 'Wartość referencyjna · USDA FoodData Central / NIZP PZH (kategoria ogólna)';
  product.sourceUrl = 'https://fdc.nal.usda.gov/';
  product.dataNote = 'Wartość referencyjna dla kategorii produktu, zgodna z zakresem publicznych tabel USDA FoodData Central i NIZP PZH. Konkretny produkt z Lidla, Biedronki, Kauflandu lub Carrefour może się różnić — nadrzędna jest etykieta opakowania.';
}

export const seedCatalogInfo = {
  version:'2026-11-20.1',
  count:seedProducts.length,
  sources:[
    {label:'USDA FoodData Central — dane w domenie publicznej (CC0 1.0)',url:'https://fdc.nal.usda.gov/'},
    {label:'NIZP PZH — Tabele wartości odżywczej produktów spożywczych i potraw (licencja)',url:'https://www.pzh.gov.pl/uslugi/tabele-wartosci-odzywczej-produktow/'},
    {label:'Rozporządzenie (UE) 1169/2011 — deklaracja w przeliczeniu na 100 g',url:'https://eur-lex.europa.eu/eli/reg/2011/1169/oj/pol'}
  ],
  licenseNote:'Katalog zawiera wartości referencyjne dla produktów ogólnych. Nie jest pełnym katalogiem SKU konkretnych sieci. Dokładne produkty z etykiet należy dodawać/importować z odpowiednią atrybucją i licencją.'
};
