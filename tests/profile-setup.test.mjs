import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProfileData,profilesNeedInitialSetup,readProfileForm} from '../js/profile-utils.js';

const woman={age:34,height:168,weight:67.5,pal:1.6,goal:10};
const man={age:36,height:182,weight:85,pal:1.8,goal:15};

test('first setup is required until both profiles exist',()=>{
  assert.equal(profilesNeedInitialSetup({}),true);
  assert.equal(profilesNeedInitialSetup({female:woman}),true);
  assert.equal(profilesNeedInitialSetup({male:man}),true);
  assert.equal(profilesNeedInitialSetup({female:woman,male:man}),false);
});
test('profile validation accepts valid values and rejects edge cases',()=>{
  assert.equal(validateProfileData(woman),true);assert.equal(validateProfileData(man),true);
  assert.equal(validateProfileData({...woman,age:18}),false);
  assert.equal(validateProfileData({...woman,age:101}),false);
  assert.equal(validateProfileData({...woman,height:119.9}),false);
  assert.equal(validateProfileData({...woman,weight:29.9}),false);
  assert.equal(validateProfileData({...woman,pal:1.5}),false);
  assert.equal(validateProfileData({...woman,goal:12}),false);
  assert.equal(validateProfileData({}),false);
});
test('onboarding form reads each sex-specific field independently',()=>{
  const form={elements:{femaleAge:{value:'34'},femaleHeight:{value:'168'},femaleWeight:{value:'67.5'},femalePal:{value:'1.6'},femaleGoal:{value:'10'},maleAge:{value:'36'},maleHeight:{value:'182'},maleWeight:{value:'85'},malePal:{value:'1.8'},maleGoal:{value:'15'}}};
  assert.deepEqual(readProfileForm(form,'female'),woman);
  assert.deepEqual(readProfileForm(form,'male'),man);
});
