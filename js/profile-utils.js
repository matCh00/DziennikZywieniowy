export function validateProfileData(data){
  return Boolean(data)
    && Number.isInteger(Number(data.age)) && Number(data.age)>=19 && Number(data.age)<=100
    && Number.isFinite(Number(data.height)) && Number(data.height)>=120 && Number(data.height)<=230
    && Number.isFinite(Number(data.weight)) && Number(data.weight)>=30 && Number(data.weight)<=350
    && [1.4,1.6,1.8,2].includes(Number(data.pal))
    && [0,5,10,15,20].includes(Number(data.goal));
}
export function profilesNeedInitialSetup(profiles={}){
  return !profiles.female || !profiles.male;
}
export function readProfileForm(form, sex){
  const get=name=>form.elements[`${sex}${name[0].toUpperCase()}${name.slice(1)}`].value;
  return {age:Number(get('age')),height:Number(get('height')),weight:Number(get('weight')),pal:Number(get('pal')),goal:Number(get('goal'))};
}
