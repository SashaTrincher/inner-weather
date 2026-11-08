const {test}=require('node:test');
const assert=require('node:assert/strict');
const quick=require('../dist/model.js').EmotionModel;
const deep=require('../dist/deep-model.js').DeepEmotionModel;
const answer=(overrides={})=>deep.questions.map(q=>q.context?null:({pleasant:2,energy:2,intensity:2,interest:2,clarity:2,connection:2,control:2,...overrides}[q.id]??0));
const index=id=>deep.questions.findIndex(q=>q.id===id);
test('quick mode preserves the original ten questions and sixteen patterns',()=>{
 assert.equal(quick.questions.length,10);assert.equal(quick.profiles.length,16);
 assert.equal(quick.rank([4,3,0,3,0,0,0,0,0,1])[0].name,'Happiness');
 assert.equal(quick.rank([1,1,3,1,4,1,2,1,3,4])[0].name,'Existential unease');
});
test('both modes reject missing, sparse and invalid responses',()=>{
 for(const model of [quick,deep]){
  for(const bad of [[],Array(model.questions.length),Array(model.questions.length).fill(undefined),Array(model.questions.length).fill(null),Array(model.questions.length).fill(-1),Array(model.questions.length).fill(5),Array(model.questions.length).fill('2'),Array(model.questions.length).fill(NaN)])assert.throws(()=>model.rank(bad));
 }
});
test('deep questionnaire and profiles have complete, valid definitions',()=>{
 assert.equal(deep.questions.length,42);assert.equal(deep.profiles.length,34);
 assert.equal(new Set(deep.questions.map(q=>q.id)).size,42);
 for(const q of deep.questions){assert.equal(q.labels.length,5);assert.ok(q.context||q.signal.every(Boolean));}
 for(const p of deep.profiles){
  assert.ok(p.keys.length>0);for(const key of p.keys)assert.ok(deep.questions.some(q=>q.id===key&&!q.context));
  const a=deep.questions.map(q=>q.context?null:p.targets[q.id]);
  assert.equal(deep.rank(a)[0].name,p.name);
  for(const q of deep.questions.filter(q=>!q.context))assert.ok(Number.isInteger(p.targets[q.id])&&p.targets[q.id]>=0&&p.targets[q.id]<=4);
 }
});
test('specific emotional cues distinguish related experiences',()=>{
 const cases=[
  [{pleasant:1,guilt:4,rumination:2},'Guilt'],
  [{pleasant:0,judgment:4,exposed:3},'Shame'],
  [{pleasant:1,envy:4},'Envy'],
  [{pleasant:3,gratitude:4},'Gratitude'],
  [{pleasant:3,relief:4,energy:1},'Relief'],
  [{pleasant:1,worry:4,uncertainty:4},'Anxiety-like unease'],
  [{pleasant:4,energy:4,intensity:4,interest:4},'Excitement'],
  [{pleasant:1,purpose:4,uncertainty:4,rumination:3},'Existential unease'],
  [{numb:4,intensity:0,interest:0},'Emotional numbness'],
  [{pleasant:2,intensity:0,acceptance:2},'Quiet neutrality']
 ];for(const [a,name]of cases)assert.equal(deep.rank(answer(a))[0].name,name);
});
test('physical context changes interpretation notes but never emotion ranks',()=>{
 const a=answer({pleasant:4,energy:3,interest:3}),baseline=deep.rank(a).map(p=>[p.name,p.distance]);
 for(const id of ['sleep','discomfort','needs','influences','duration'])for(let value=0;value<=4;value++){
  const b=[...a];b[index(id)]=value;assert.deepEqual(deep.rank(b).map(p=>[p.name,p.distance]),baseline);
 }
 const b=[...a];b[index('sleep')]=0;b[index('discomfort')]=4;b[index('duration')]=4;
 assert.ok(deep.context(b).some(n=>n.includes('restorative')));assert.ok(deep.context(b).some(n=>n.includes('discomfort')));
});
test('nonspecific body sensations cannot override defining emotional cues',()=>{
 const a=answer({pleasant:4,energy:4,intensity:4,interest:4,tension:4,restless:4,heavy:4});
 assert.equal(deep.rank(a)[0].name,'Excitement');
 const calm=answer(),tense=answer({tension:4});
 assert.notEqual(deep.rank(calm).find(p=>p.name==='Anxiety-like unease').distance,deep.rank(tense).find(p=>p.name==='Anxiety-like unease').distance);
});
test('results stay finite, distinct, ordered and reproducible across mixed inputs',()=>{
 let seed=123;for(let t=0;t<100;t++){
  const a=deep.questions.map(q=>{seed=(seed*1664525+1013904223)>>>0;return q.context?null:seed%5;});
  const ranked=deep.rank(a);assert.equal(new Set(ranked.slice(0,4).map(p=>p.name)).size,4);
  assert.ok(ranked.every((p,i)=>Number.isFinite(p.distance)&&(i===0||p.distance>=ranked[i-1].distance)));
  assert.deepEqual(ranked,deep.rank(a));
  assert.ok(deep.explain(a,ranked[0]).every(x=>typeof x==='string'&&x.length));
 }
});
test('explanations use relevant signals and snapshots preserve coexisting factors',()=>{
 const a=answer({pleasant:1,purpose:4,uncertainty:4,rumination:3,worry:3,restless:4,heavy:4});
 const p=deep.profiles.find(p=>p.name==='Existential unease');
 assert.ok(!deep.explain(a,p).includes('Your feelings feel accessible.'));
 const snapshot=deep.snapshot(a);assert.ok(snapshot[0].items.includes('Restlessness'));assert.ok(snapshot[0].items.includes('Physical heaviness'));
 assert.ok(snapshot[1].items.includes('Future-focused worry'));assert.ok(snapshot[1].items.includes('Repetitive thoughts'));
});
