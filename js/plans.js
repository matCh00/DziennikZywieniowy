/**
 * FORMAT DANYCH — plany tygodniowe (uniwersalny, wspólny dla przykładów i planów użytkownika)
 * -----------------------------------------------------------------------------------------
 * Każdy plan to obiekt o stałym zestawie pól:
 *   id          unikalny identyfikator tekstowy (np. 'plan:przykladowy-tydzien')
 *   title       nazwa planu
 *   kind        'sample' (przykład tylko do odczytu) albo 'custom' (plan użytkownika)
 *   description krótki opis planu
 *   startDate   'YYYY-MM-DD' dla planów użytkownika albo null dla przykładu
 *   days        tablica dni; każdy dzień ma:
 *                 dayIndex  0–6 (0 = pierwszy dzień planu)
 *                 meals     tablica posiłków; każdy posiłek ma:
 *                             meal   nazwa posiłku (Śniadanie, Obiad, …)
 *                             items  tablica pozycji; każda pozycja to JEDEN z wariantów:
 *                               a) odwołanie do dania z dishes.js:
 *                                  { dishId:'dish:...', servings:1.5 }
 *                                  (servings = liczba porcji dania, 1 = jedna porcja)
 *                               b) własna pozycja produktowa (bez dania):
 *                                  { name, grams, kcal100, protein100, fat100, carbs100 }
 *                                  (protein100/fat100/carbs100 mogą być null)
 *   source      czytelny opis źródła
 *   sourceKind  'built-in-sample' dla przykładów
 *   dataNote    informacja o dokładności danych
 *
 * ŹRÓDŁA OFICJALNE: dania typu fast food w dishes.js korzystają z oficjalnych
 * tabel sieci. ŹRÓDŁA PRZYBLIŻONE: dania domowe i przykładowe plany — to szacunki
 * dla typowych porcji, a nie deklaracje konkretnych produktów. Przy opakowanym
 * produkcie nadrzędna jest etykieta. Wartości można swobodnie uzupełniać i rozwijać.
 */
export const plans = [
  {
    id: 'plan:przykladowy-tydzien',
    title: 'Przykładowy tydzień',
    kind: 'sample',
    description: 'Wzorcowy jadłospis do podglądu. Nie jest zapisywany i nie podlega edycji.',
    startDate: null,
    source: 'Przykładowy jadłospis wbudowany',
    sourceKind: 'built-in-sample',
    dataNote: 'Wartości w pozycjach produktowych są wartościami referencyjnymi kategorii, a dania pobierają kcal z dishes.js. To szacunki, chyba że dany rekord ma wskazane źródło oficjalnej karty lub etykiety. Dla produktów pakowanych nadrzędna jest etykieta konkretnego opakowania.',
    days: [
      {
        dayIndex: 0,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Płatki owsiane', grams: 60, kcal100: 366},
            {name: 'Mleko 2%', grams: 200, kcal100: 50},
            {name: 'Banan', grams: 100, kcal100: 89}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Skyr naturalny', grams: 150, kcal100: 63},
            {name: 'Jabłko', grams: 120, kcal100: 52}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Pierś z kurczaka, gotowana', grams: 150, kcal100: 165},
            {name: 'Ryż biały, gotowany', grams: 180, kcal100: 130},
            {name: 'Brokuł, gotowany', grams: 120, kcal100: 35},
            {name: 'Oliwa z oliwek', grams: 5, kcal100: 884}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Chleb żytni', grams: 70, kcal100: 259},
            {name: 'Twaróg półtłusty', grams: 80, kcal100: 133},
            {name: 'Pomidor', grams: 80, kcal100: 18}
          ]}
        ]
      },
      {
        dayIndex: 1,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Jajo kurze, całe', grams: 110, kcal100: 143},
            {name: 'Chleb żytni', grams: 60, kcal100: 259},
            {name: 'Pomidor', grams: 100, kcal100: 18}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Banan', grams: 120, kcal100: 89},
            {name: 'Skyr naturalny', grams: 150, kcal100: 63}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Łosoś, surowy', grams: 140, kcal100: 208},
            {name: 'Ziemniaki, gotowane', grams: 200, kcal100: 87},
            {name: 'Ogórek', grams: 100, kcal100: 15}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Jogurt naturalny 2%', grams: 150, kcal100: 60},
            {name: 'Płatki owsiane', grams: 25, kcal100: 366}
          ]}
        ]
      },
      {
        dayIndex: 2,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Płatki owsiane', grams: 55, kcal100: 366},
            {name: 'Mleko 2%', grams: 180, kcal100: 50},
            {name: 'Jabłko', grams: 100, kcal100: 52}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Twaróg półtłusty', grams: 100, kcal100: 133},
            {name: 'Gruszka', grams: 120, kcal100: 57}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Makaron pszenny, gotowany', grams: 180, kcal100: 158},
            {name: 'Tuńczyk odsączony', grams: 100, kcal100: 116},
            {name: 'Pomidor', grams: 120, kcal100: 18},
            {name: 'Oliwa z oliwek', grams: 5, kcal100: 884}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Skyr naturalny', grams: 150, kcal100: 63}
          ]}
        ]
      },
      {
        dayIndex: 3,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Chleb żytni', grams: 80, kcal100: 259},
            {name: 'Jajo kurze, całe', grams: 55, kcal100: 143},
            {name: 'Ogórek', grams: 60, kcal100: 15}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Jabłko', grams: 150, kcal100: 52},
            {name: 'Masło orzechowe', grams: 15, kcal100: 588}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Pierś z kurczaka, gotowana', grams: 160, kcal100: 165},
            {name: 'Ryż biały, gotowany', grams: 150, kcal100: 130},
            {name: 'Brokuł, gotowany', grams: 150, kcal100: 35}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Jogurt naturalny 2%', grams: 180, kcal100: 60}
          ]}
        ]
      },
      {
        dayIndex: 4,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Skyr naturalny', grams: 170, kcal100: 63},
            {name: 'Płatki owsiane', grams: 40, kcal100: 366},
            {name: 'Banan', grams: 70, kcal100: 89}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Pomarańcza', grams: 150, kcal100: 47},
            {name: 'Twaróg półtłusty', grams: 80, kcal100: 133}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Soczewica, gotowana', grams: 180, kcal100: 116},
            {name: 'Ryż biały, gotowany', grams: 130, kcal100: 130},
            {name: 'Pomidor', grams: 100, kcal100: 18},
            {name: 'Oliwa z oliwek', grams: 5, kcal100: 884}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Czekolada gorzka 70%', grams: 15, kcal100: 598}
          ]}
        ]
      },
      {
        dayIndex: 5,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Jajo kurze, całe', grams: 110, kcal100: 143},
            {name: 'Pomidor', grams: 100, kcal100: 18},
            {name: 'Ser gouda', grams: 20, kcal100: 356}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Banan', grams: 120, kcal100: 89}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Łosoś, surowy', grams: 130, kcal100: 208},
            {name: 'Ziemniaki, gotowane', grams: 220, kcal100: 87},
            {name: 'Ogórek', grams: 100, kcal100: 15}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Skyr naturalny', grams: 150, kcal100: 63},
            {name: 'Gruszka', grams: 100, kcal100: 57}
          ]}
        ]
      },
      {
        dayIndex: 6,
        meals: [
          {meal: 'Śniadanie', items: [
            {name: 'Płatki owsiane', grams: 60, kcal100: 366},
            {name: 'Mleko 2%', grams: 200, kcal100: 50},
            {name: 'Gruszka', grams: 100, kcal100: 57}
          ]},
          {meal: 'II śniadanie', items: [
            {name: 'Jajo kurze, całe', grams: 55, kcal100: 143},
            {name: 'Pomidor', grams: 100, kcal100: 18}
          ]},
          {meal: 'Obiad', items: [
            {name: 'Makaron pszenny, gotowany', grams: 180, kcal100: 158},
            {name: 'Pierś z kurczaka, gotowana', grams: 130, kcal100: 165},
            {name: 'Brokuł, gotowany', grams: 100, kcal100: 35},
            {name: 'Oliwa z oliwek', grams: 5, kcal100: 884}
          ]},
          {meal: 'Kolacja', items: [
            {name: 'Jogurt naturalny 2%', grams: 150, kcal100: 60}
          ]}
        ]
      }
    ]
  }
];

// Rozszerzenie pierwszego jadłospisu o piąty, niewielki posiłek każdego dnia.
// Pozycje pozostają w formacie produktowym zgodnym z istniejącym planem.
const sampleExtras=[
  {name:'Jogurt naturalny 2%',grams:150,kcal100:60},{name:'Borówki amerykańskie',grams:80,kcal100:57},
  {name:'Serek wiejski lekki',grams:150,kcal100:81},{name:'Pomidor',grams:100,kcal100:18},
  {name:'Kefir naturalny',grams:200,kcal100:51},{name:'Banan',grams:80,kcal100:89},
  {name:'Marchew',grams:120,kcal100:41},{name:'Hummus klasyczny',grams:40,kcal100:240},
  {name:'Jabłko',grams:150,kcal100:52},{name:'Orzechy włoskie',grams:15,kcal100:654},
  {name:'Skyr naturalny',grams:150,kcal100:63},{name:'Truskawki',grams:100,kcal100:32},
  {name:'Wafle ryżowe naturalne',grams:20,kcal100:387},{name:'Masło orzechowe',grams:10,kcal100:588}
];
if(plans[0]){
  plans[0].title='Zbilansowany tydzień — jadłospis bazowy';
  plans[0].description='Urozmaicony jadłospis z 5 posiłkami dziennie. Porcje są przykładowe i można je dopasować do potrzeb.';
  plans[0].days.forEach((day,i)=>{
    if(!day.meals.some(m=>m.meal==='Podwieczorek')) day.meals.splice(3,0,{meal:'Podwieczorek',items:[sampleExtras[i*2%sampleExtras.length],sampleExtras[(i*2+1)%sampleExtras.length]]});
  });
  plans[0].dataNote='Wartości orientacyjne i dziedziczone z produktów/dishes.js. Jadłospis nie jest dietą leczniczą ani indywidualnym zaleceniem; dla produktów pakowanych nadrzędna jest etykieta konkretnego opakowania.';
}

const weeklyDishPools={
  breakfast:['dish:owsianka-klasyczna','dish:jajecznica','dish:omlet-warzywa','dish:naleśniki-ser','dish:avocado-toast','dish:racuchy','dish:tosty-z-serem','dish:placki-twarogowe','dish:shakshuka','dish:pancakes-maple'],
  snack:['dish:smoothie','dish:kanapka-twaróg','dish:kanapka-jajko','dish:twaróg-warzywa','dish:sałatka-grecka','dish:kanapka-łosoś','dish:overnight-oats','dish:placki-bananowe'],
  lunch:['dish:schabowy-klasyczny','dish:kurczak-panierowany','dish:łosoś-pieczony','dish:carbonara','dish:bolognese','dish:risotto','dish:ryz-basmati','dish:kurczak-teriyaki','dish:butter-chicken','dish:pad-thai-kurczak','dish:zapiekanka-bagietka-klasyczna','dish:pierogi-ruskie','dish:kurczak-w-sosie-pieczarkowym','dish:stek-wolowy-maslo'],
  dinner:['dish:cezar-kurczak','dish:sałatka-grecka','dish:sałatka-tuńczyk','dish:kanapka-łosoś','dish:sałatka-ziemniaczana','dish:sałatka-burak-feta','dish:bagietka-czosnkowa','dish:panini-kurczak','dish:pierogi-ze-szpinakiem','dish:sałatka-kuskus','dish:poke-tofu','dish:wrap-chicken'],
  vegetarian:['dish:curry-ciecierzyca','dish:risotto-grzyby','dish:quinoa-z-warzywami','dish:leczo','dish:falafel','dish:sałatka-grecka','dish:makaron-szpinak-ricotta','dish:dal-makhani','dish:chana-masala','dish:placki-z-cukinii'],
  fish:['dish:łosoś-pieczony','dish:dorsz-na-parze','dish:pstrag-pieczony','dish:poke-losos','dish:paella-owocemorza','dish:ryz-tunczyk','dish:makaron-z-lososiem','dish:sushi-philadelphia'],
  quick:['dish:zapiekanka-bagietka-klasyczna','dish:hotdog-klasyczny','dish:burger-chicken-crispy','dish:quesadilla-kurczak','dish:kebab-kurczak-pita','dish:makaron-pesto','dish:ryz-smazony-warzywa','dish:wrap-chicken'],
  polish:['dish:schabowy-klasyczny','dish:pierogi-ruskie','dish:żurek-kiełbasa','dish:placki-ziemniaczane','dish:gołąbki-bez-ryzu','dish:kasza-gryczana-z-pieczarkami','dish:kopytka-maslo','dish:barszcz','dish:fasolka-bretonska-vege'],
  italian:['dish:carbonara','dish:bolognese','dish:lasagne','dish:makaron-aglio-olio','dish:makaron-pesto','dish:pizza-capricciosa','dish:risotto-grzyby','dish:bruschetta-pomidor','dish:makaron-arrabbiata'],
  asian:['dish:kurczak-teriyaki','dish:ramen-miso','dish:pad-thai-krewetki','dish:bibimbap','dish:pho-bo','dish:mapo-tofu','dish:gyoza-warzywa','dish:kurczak-sweet-sour','dish:poke-tunczyk'],
  highProtein:['dish:pierś-grillowana','dish:pulpeciki-indyk','dish:omlet-warzywa','dish:skyr-proteinowy','dish:kurczak-w-sosie-musztardowym','dish:dorsz-na-parze','dish:cezar-kurczak'],
  budget:['dish:ryz-basmati','dish:ziemniaki-mundurkach','dish:makaron-z-pieczarkami','dish:placki-ziemniaczane','dish:fasolka-bretonska-vege','dish:jajecznica','dish:kasza-jaglana-z-warzywami'],
  family:['dish:lasagne','dish:kurczak-panierowany','dish:bolognese','dish:pierogi-z-serem','dish:pizza-margherita','dish:ryz-smazony-jajko','dish:klopsiki-pomidorowe'],
  mediterranean:['dish:sałatka-grecka','dish:paella','dish:losos-grillowany','dish:makaron-puttanesca','dish:bruschetta-mozzarella','dish:buddha-bowl-kurczak','dish:ratatouille'],
  comfort:['dish:mac-cheese','dish:zapiekanka-makaron','dish:burger-beef','dish:kurczak-w-sosie-smietanowym','dish:pierogi-ruskie-smazone','dish:ziemniaki-pieczone-oliwa','dish:sernik']
};
const weeklyThemes=[
  {id:'wysokobialkowy',title:'Tydzień wysokobiałkowy',description:'Przykładowy jadłospis z częstszym udziałem ryb, drobiu, jaj, nabiału i strączków.',breakfast:'breakfast',snack:'snack',lunch:'highProtein',dinner:'fish'},
  {id:'budzetowy',title:'Tydzień budżetowy',description:'Proste dania z łatwo dostępnych składników, kasz, ryżu, jaj i warzyw.',breakfast:'breakfast',snack:'snack',lunch:'budget',dinner:'polish'},
  {id:'wegetarianski',title:'Tydzień wegetariański',description:'Jadłospis bez mięsa i ryb; wykorzystuje nabiał, jaja, tofu i rośliny strączkowe.',breakfast:'breakfast',snack:'vegetarian',lunch:'vegetarian',dinner:'vegetarian'},
  {id:'rybny',title:'Tydzień z rybami',description:'Różne gatunki ryb i owoców morza w domowych i inspirowanych restauracją daniach.',breakfast:'breakfast',snack:'snack',lunch:'fish',dinner:'fish'},
  {id:'szybki',title:'Tydzień szybkich posiłków',description:'Praktyczne posiłki z krótkim czasem przygotowania, w tym wrapy, zapiekanki i dania z patelni.',breakfast:'breakfast',snack:'snack',lunch:'quick',dinner:'quick'},
  {id:'polski',title:'Tydzień kuchni polskiej',description:'Tradycyjne dania domowe, pierogi, ziemniaki, kasze, zupy i klasyczne obiady.',breakfast:'breakfast',snack:'snack',lunch:'polish',dinner:'polish'},
  {id:'wloski',title:'Tydzień włoski',description:'Pasty, risotto, pizza, sałatki i proste dania inspirowane kuchnią włoską.',breakfast:'breakfast',snack:'italian',lunch:'italian',dinner:'italian'},
  {id:'azjatycki',title:'Tydzień azjatycki',description:'Ryż, ramen, dania stir-fry, curry, sushi i pierożki inspirowane kuchnią Azji.',breakfast:'breakfast',snack:'snack',lunch:'asian',dinner:'asian'},
  {id:'srodziemnomorski',title:'Tydzień śródziemnomorski',description:'Warzywa, oliwa, ryby, kasze, pomidory, sery i dania inspirowane basenem Morza Śródziemnego.',breakfast:'breakfast',snack:'snack',lunch:'mediterranean',dinner:'mediterranean'},
  {id:'rodzinny',title:'Tydzień rodzinny',description:'Znane, uniwersalne dania obiadowe i kolacje, z prostymi składnikami.',breakfast:'breakfast',snack:'snack',lunch:'family',dinner:'family'},
  {id:'comfort-food',title:'Tydzień comfort food',description:'Domowe dania sycące, zapiekanki, makarony, burgery i ziemniaczane dodatki.',breakfast:'breakfast',snack:'snack',lunch:'comfort',dinner:'comfort'},
  {id:'bez-miesa',title:'Tydzień bez mięsa',description:'Różnorodne posiłki roślinne i jajeczno-nabiałowe, bez mięsa i wędlin.',breakfast:'breakfast',snack:'vegetarian',lunch:'vegetarian',dinner:'vegetarian'},
  {id:'lunchbox',title:'Tydzień lunchboxów',description:'Dania wygodne do spakowania: sałatki, bowle, ryż, makaron i kanapki.',breakfast:'breakfast',snack:'snack',lunch:'quick',dinner:'mediterranean'}
];
function makeWeeklySample(theme,themeIndex){
  const choose=(poolKey,day,offset=0)=>{
    const pool=weeklyDishPools[poolKey]||weeklyDishPools.snack;
    return pool[(day+offset+themeIndex*2)%pool.length];
  };
  const days=[];
  for(let day=0;day<7;day++){
    const meals=[
      {meal:'Śniadanie',items:[{dishId:choose(theme.breakfast,day,0),servings:1}]},
      {meal:'II śniadanie',items:[{dishId:choose(theme.snack,day,1),servings:.7}]},
      {meal:'Obiad',items:[{dishId:choose(theme.lunch,day,2),servings:1}]},
      {meal:'Podwieczorek',items:[{dishId:choose('snack',day,3),servings:.7}]},
      {meal:'Kolacja',items:[{dishId:choose(theme.dinner,day,4),servings:.85}]}
    ];
    days.push({dayIndex:day,meals});
  }
  return {id:`plan:${theme.id}`,title:theme.title,kind:'sample',description:theme.description,startDate:null,
    source:'Przykładowy jadłospis wbudowany · dania z katalogu offline',sourceKind:'built-in-sample',
    dataNote:'Wartości zależą od porcji i receptur dań w dishes.js; większość domowych i restauracyjnych dań ma charakter szacunkowy. To propozycja przykładowa, nie indywidualna dieta ani zalecenie medyczne. Dla produktów pakowanych nadrzędna jest etykieta.',days};
}
for(let i=0;i<weeklyThemes.length;i++) plans.push(makeWeeklySample(weeklyThemes[i],i+1));

export const planCatalogInfo = {
  count: plans.length,
  samples: plans.filter(plan => plan.kind === 'sample').length,
  note: 'Przykładowe plany są tylko do odczytu. Pozycje odwołujące się do dań pobierają wartości z dishes.js; wartości zmieniają się wraz z aktualizacją dań. Pozycje produktowe z gramaturą wykorzystują podane kcal/100 g. Wartości szacunkowe nie zastępują etykiety produktu ani pomiaru dietetycznego.'
};
